const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAccountVerified: { type: Boolean, default: false },
    verifyotp: { type: String, default: null },
    verifyotpexpireAt: { type: Date, default: null },
    resetOtp: { type: String, default: null },
    resetOtpExpireAt: { type: Date, default: null }
}, { timestamps: true });

module.exports = mongoose.model('user', userSchema);
