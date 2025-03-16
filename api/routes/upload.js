const express = require("express");
const router = express.Router();
const { ObjectId } = require('mongodb');
const multer = require('multer');
const pdf = require('pdf-parse');
const pdfjs = require('pdfjs-dist');
const { openai } = require('../lib/ai');
const cloudinary = require("../lib/cloudinary");
const streamifier = require("streamifier");

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

            const cloudinaryRes = await uploadToCloudinary(req.file);

            if(!cloudinaryRes){
                return res.status(500).json({
                    success: false,
                    error: 'Error uploading to cloudinary'
                });
            }

            const text = await extractPDFText(req.file.buffer);
            
            const uploadStream = bucket.openUploadStream(req.file.originalname);
            
            uploadStream.end(req.file.buffer);

            const summary = await generateSummary(text, req, 0);
            
            res.status(200).json({
                summary,
                url: cloudinaryRes.secure_url
            });

        } catch (error) {
            console.error('Upload error:', error);
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    });

    router.post('/chat', async(req, res) => {
        const { prompt } = req.body;
        
        try {
            const response = await generateSummary(prompt, req, 1);
            res.send({data: response});
        } catch (error) {
            console.log(error);
        }
    })

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

// Validate PDF
async function validatePDF(buffer) {
    try {
        const doc = await pdfjs.getDocument(buffer).promise;
        return !!doc.numPages;
    } catch (error) {
        return false;
    }
}

// Extract PDF Text
async function extractPDFText(buffer) {
    try {
        const data = await pdf(buffer);
        return data.text;
    } catch (error) {
        throw new Error(`PDF text extraction failed: ${error.message}`);
    }
}

// Generate Summary
async function generateSummary(text, req, state) {
    try {
        if (!req.session.chatHistory) {
            req.session.chatHistory = [];
            const systemMessage = {
                role: "system",
                content: state === 0 ? process.env.SUMMARY_PROMPT : "Help the users"
            };
            req.session.chatHistory.push(systemMessage);
        }

        const userMessage = { role: "user", content: text };
        req.session.chatHistory.push(userMessage);

        const completion = await openai.chat.completions.create({
            model: "google/gemini-2.0-flash-lite-preview-02-05:free",
            messages: req.session.chatHistory,
        });

        const aiResponse = completion.choices[0].message.content;
        req.session.chatHistory.push({ role: "assistant", content: aiResponse });
        await req.session.save();

        return aiResponse;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

// Upload To Cloudinary
async function uploadToCloudinary(file){
    return new Promise((resolve, reject) => {
        let stream = cloudinary.uploader.upload_stream(
            { upload_preset: process.env.CLOUDINARY_PRESET },
            (error, result) => {
                if (error) {
                    console.error("Cloudinary upload error:", error);
                    reject(error);
                } else {
                    resolve(result);
                }
            }
        );
        streamifier.createReadStream(file.buffer).pipe(stream);
    });
}