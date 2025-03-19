const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: { 
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String, 
        required: true
    },
    plan: {
        type: String,
        default: 'free'
    },
    resetOtp: {
        type: String,
        default: null
    },
    resetOtpExpireAt: { 
        type: Date,
        default: null
    }
}, { timestamps: true });

module.exports = mongoose.model('user', userSchema);
