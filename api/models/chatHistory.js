const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'user'},
    pdfId: {type: mongoose.Schema.Types.ObjectId},
    pdfLink: {type: String},
    pdfName: {type: String},
    pdfSize: {type: String},
    messages: [{
        role: String,
        content: String,
        selected: String,
    }],
    summary: {type: String},
    resources: [{
        type: { type: String },
        title: String,
        link: String
    }],
    quizs: [{
        question: {type: String},
        options: [String],
        answer: {type: Number}
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('history', historySchema);