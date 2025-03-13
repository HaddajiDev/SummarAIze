const express = require("express");
const router = express.Router();
const { OpenAI } = require('openai');
const { ObjectId } = require('mongodb');
const multer = require('multer');
const pdf = require('pdf-parse');
const pdfjs = require('pdfjs-dist');

const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed'), false);
        }
    }
});

const openai = new OpenAI({
    baseURL: process.env.BASE_URL,
    apiKey: process.env.OPENROUTER_API_KEY
});


module.exports = (db, bucket) => {

    router.post('/upload', upload.single('file'), async (req, res) => {
        try {
            if (!req.file) return res.status(400).json({ 
                success: false, 
                error: 'No PDF file uploaded' 
            });

            const isValidPdf = await validatePDF(req.file.buffer);
            if (!isValidPdf) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid PDF file structure'
                });
            }

            const text = await extractPDFText(req.file.buffer);
            
            const uploadStream = bucket.openUploadStream(req.file.originalname);
            
            uploadStream.end(req.file.buffer);

            const summary = await generateSummary(text, req);
            
            res.status(200).json({
                summary, 
            });

        } catch (error) {
            console.error('Upload error:', error);
            res.status(500).json({
                success: false,
                error: error.message
            });
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

async function validatePDF(buffer) {
    try {
        const doc = await pdfjs.getDocument(buffer).promise;
        return !!doc.numPages;
    } catch (error) {
        return false;
    }
}

async function extractPDFText(buffer) {
    try {
        const data = await pdf(buffer);
        return data.text;
    } catch (error) {
        throw new Error(`PDF text extraction failed: ${error.message}`);
    }
}

async function generateSummary(text, req) {
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
            content: `PDF Content:\n${text}`
        };

        messages.push(userMessage);

        const completion = await openai.chat.completions.create({
            model: "google/gemini-2.0-flash-lite-preview-02-05:free",
            messages,
        });

        const aiResponse = completion.choices[0].message.content;

        req.session.chatHistory.push(
            userMessage,
            { role: "assistant", content: aiResponse }
        );

        await req.session.save();
        return aiResponse;

    } catch (error) {
        console.error(error);
    }
}