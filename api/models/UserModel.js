const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
//-OTP for account verification-Expiration timestamp for verifyotp---Indicates if the account is verified-- OTP for password reset--Expiration timestamp for resetOtp---------//
    verifyotp: { type: String, default: '' },
    verifyotpexpireAt: { type: Number, default: 0 },
    isAccountVerified: { type: Boolean, default: false },
    resetOtp: { type: String, default: '' },
    resetOtpExpireAt: { type: Number, default: 0 }
    
});

const userModel = mongoose.models.user || mongoose.model('user', userSchema);

module.exports = userModel;
