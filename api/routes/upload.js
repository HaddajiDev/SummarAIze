const express = require("express");
const router = express.Router();
const { ObjectId } = require('mongodb');
const multer = require('multer');
const pdf = require('pdf-parse');
const pdfjs = require('pdfjs-dist');
const { openai } = require('../lib/ai');
const cloudinary = require("../lib/cloudinary");
const streamifier = require("streamifier");
const User = require('../models/UserModel');

const History = require('../models/chatHistory');

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
    const files_collection = db.collection('uploads.files');
    const chunks_collection = db.collection('uploads.chunks');  

    router.post('/upload', upload.single('file'), async (req, res) => {
        const userId = req.query.userId;
        try {
            if (!req.file) return res.status(400).json({ 
                success: false, 
                error: 'No PDF file uploaded' 
            });

            // const isValidPdf = await validatePDF(req.file.buffer);
            // if (!isValidPdf) {
            //     return res.status(400).json({
            //         success: false,
            //         error: 'Invalid PDF file structure'
            //     });
            // }

            const cloudinaryRes = await uploadToCloudinary(req.file);

            if(!cloudinaryRes){
                return res.status(500).json({
                    success: false,
                    error: 'Error uploading to cloudinary'
                });
            }
            
            const text = await extractPDFText(req.file.buffer);
            
            const uploadStream = bucket.openUploadStream(req.file.originalname);
            let fileSize = 0;
            
            const uploadComplete = new Promise((resolve, reject) => {
                uploadStream.on('finish', async () => {
                    const fileDoc = await bucket.find({ _id: uploadStream.id }).next();
                    fileSize = fileDoc.length;
                    resolve();
                });
                uploadStream.on('error', reject);
            });
            
            uploadStream.end(req.file.buffer);
            
            await uploadComplete;
            
            
            const pdfId = uploadStream.id;

            const newHistory = new History({
                userId: userId,
                pdfId,
                summary: "",
                pdfLink: cloudinaryRes.secure_url,
                pdfCloudId: cloudinaryRes.public_id,
                messages: [],
                quizs: [],
                pdfName: uploadStream.filename,
                pdfSize: `${FormatFileSize(fileSize)}`,
                resources: []
            });
            await newHistory.save();
            
            const summary = await generateSummary(text, pdfId);

            // History.updateOne(
            //     { pdfId: pdfId },
            //     { summary: summary }
            // );

            const user = await User.findById(userId);
            const currentDocuments = user?.numberOfDocuments || 0;
            await User.findByIdAndUpdate(userId, { numberOfDocuments: currentDocuments + 1 });
            
            const his = await History.findOneAndUpdate({ pdfId: pdfId }, { summary: summary });

            res.status(200).json({
                summary,
                url: cloudinaryRes.secure_url,
                pdfId,
                chat: his.messages
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
        const { prompt, pdfId } = req.body;   
        try {
            const response = await generateChat(prompt, pdfId);
            res.send({data: response});
        } catch (error) {
            console.log(error);
        }
    });

    router.get('/history', async (req, res) => {
        try {
            const { userId } = req.query;
            const history = await History.find({ 
                userId,
            });

            res.send({history});
        } catch (error) {
            res.status(500).json({ error: error });
        }
    });

    router.get('/history/:id', async(req, res) => {
        try {
            const history = await History.findOne({ pdfId: req.params.id})
            res.send({history});
        } catch (error) {
            console.log(error);
        }
    })

    router.delete('/history/:id', async(req, res) => {
        try {
            const history = await History.findOne({ pdfId: req.params.id});
            if(!history){
                return res.status(404).json({ error: "History not found"});
            }
            await cloudinary.uploader.destroy(history.pdfCloudId);
            await History.deleteOne({ pdfId: req.params.id});

            const objectId = new ObjectId(req.params.id);
            const file = await files_collection.findOne({ _id: objectId });
            if (!file) {
                return res.status(404).json({ error: "File not found" });
            }
            await files_collection.deleteOne({ _id: objectId });
            await chunks_collection.deleteMany({ files_id: objectId });
            return res.status(200).json({ message: "History deleted" });
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
async function generateSummary(text, pdfId) {
    try {
        let history = await History.findOne({ pdfId });

        const systemMessage = {
            role: "system",
            content:"[PROMPT] " + process.env.SUMMARY_PROMPT
        };


        history.messages.push(systemMessage);

        history.messages.push({role: 'user', content: text});

        const completion = await openai.chat.completions.create({
            model: process.env.AI_MODEL,
            messages: history.messages,
        });

        
        const aiResponse = completion.choices[0].message.content;
        // console.log(aiResponse);
        
        history.messages.push({ role: "assistant", content: aiResponse });
        await history.save();

        return aiResponse;
    } catch (error) {
        throw error;
    }
}
async function generateChat(text, pdfId){
    try {
        let history = await History.findOne({ pdfId: pdfId});
        if(history && history.messages.length <= 3){
            const systemMessage = {
                role: "system",
                content:"[PROMPT] " + process.env.HELP_PROMPT
            };
            history.messages.push(systemMessage);
        }


        if (text.selected) {            
            history.messages.push({
                role: "user",
                content: `[SELECTED TEXT CONTEXT] : ${text.selected}`
            });
        }
    
        history.messages.push({ role: "user", content: text.prompt });
    
        const completion = await openai.chat.completions.create({
            model: process.env.AI_MODEL,
            messages: history.messages,
        });
        const aiResponse = completion.choices[0].message.content;
        history.messages.push({ role: "assistant", content: aiResponse });
        await history.save();

        return aiResponse
    } catch (error) {
        console.log(error);
    }
}
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
function FormatFileSize(bytes) {
    if (bytes >= 1024 * 1024) {
        return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    } else if (bytes >= 1024) {
        return (bytes / 1024).toFixed(2) + ' KB';
    } else {
        return bytes + ' bytes';
    }
}