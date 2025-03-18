const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'user'},
    pdfId: {type: mongoose.Schema.Types.ObjectId},
    messages: [{
        role: String,
        content: String,
        selected: String,
    }],
    summary: {type: String},
    quizs: [{
        question: {type: String},
        options: [{
            option: {type: String}
        }],
        answer: {type: Number}
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('history', historySchema);