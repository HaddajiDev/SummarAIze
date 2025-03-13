const express = require("express");
const router = express.Router();
const { OpenAI } = require('openai');
const { ObjectId } = require('mongodb');
const multer = require('multer');
const pdf = require('pdf-parse');
const Tesseract = require('tesseract.js');
const { createCanvas } = require('canvas');

const storage = multer.memoryStorage();
const upload = multer({ storage });

const openai = new OpenAI({
    baseURL: process.env.BASE_URL,
    apiKey: process.env.OPENROUTER_API_KEY
});

module.exports = (db, bucket) => {

    router.post('/upload', upload.single('file'), async (req, res) => {
        
        try {
            if (!req.file) return res.status(400).send("No file uploaded");
            
            const text = await processPDF(req.file.buffer);
            
            const uploadStream = bucket.openUploadStream(req.file.originalname);
            uploadStream.end(req.file.buffer);
            
            const summary = await processPdfData(text, req);
            
            res.status(200).json({
                id: uploadStream.id,
                summary,
                filename: req.file.originalname
            });

        } catch (error) {
            console.error('Upload error:', error);
            res.status(500).send(error.message);
        }

    });

    router.get('/inspect/:id', async (req, res) => {
        try {
            const fileId = req.params.id;

            if (!ObjectId.isValid(fileId)) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid file ID format'
                });
            }

            const objectID = new ObjectId(fileId);
            const files = await bucket.find({ _id: objectID }).toArray();

            if (files.length === 0) {
                return res.status(404).json({
                    success: false,
                    error: 'File not found'
                });
            }

            const fileMetadata = files[0];
            res.set({
                'Content-Type': fileMetadata.contentType,
                'Content-Length': fileMetadata.length,
                'Content-Disposition': `attachment; filename="${fileMetadata.filename}"`
            });

            const downloadStream = bucket.openDownloadStream(objectID);
            downloadStream.pipe(res);

        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, error: 'Server error' });
        }
    });

    return router;
};


async function processPDF(buffer) {
    try {
        const data = await pdf(buffer);
        let text = data.text;

        if (text.length < 500) {
            text += await runOCR(buffer);
        }
        
        return text;
    } catch (error) {
        throw new Error(`PDF processing failed: ${error.message}`);
    }
}

async function runOCR(buffer) {
    const canvas = createCanvas(1000, 1000);
    const ctx = canvas.getContext('2d');
    
    const image = await convertPDFToImage(buffer, ctx);
    const { data: { text } } = await Tesseract.recognize(image);
    return text;
}

async function convertPDFToImage(buffer, ctx) {
    const pdf = require('pdfjs-dist');
    const doc = await pdf.getDocument(buffer).promise;
    const page = await doc.getPage(1);
    const viewport = page.getViewport({ scale: 1.5 });
    
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    
    await page.render({
        canvasContext: ctx,
        viewport: viewport
    }).promise;
    
    return canvas.toBuffer();
}


async function processPdfData(text, req) {
    try {
        if (!req.session.chatHistory) {
            req.session.chatHistory = [];
        }

        const messages = [{
            role: "system",
            content: process.env.PROMPT
        }, ...req.session.chatHistory];

        const userMessage = {
            role: "user",
            content: [{
                type: "text",
                text: `Document Content:\n${text}\n\nPlease analyze this document and provide a comprehensive summary.`
            }]
        };

        messages.push(userMessage);

        const completion = await openai.chat.completions.create({
            model: "google/gemini-2.0-flash-lite-preview-02-05:free",
            messages: messages
        });

        const aiResponse = completion.choices[0].message.content;

        req.session.chatHistory.push(
            userMessage,
            { role: "assistant", content: aiResponse }
        );

        await req.session.save();
        return aiResponse;

    } catch (error) {
        console.error('Error processing PDF data:', error);
        throw error;
    }
}