const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');
const transporter = require('../lib/Nodemailer');
const crypto = require('crypto');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

// Generate OTP
function generateSecureCode(length=6) {
    return crypto.randomBytes(length)
        .toString("base64")
        .replace(/[^a-zA-Z0-9]/g, '')
        .slice(0, length);
}

// Signup
router.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email is already registered" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({
            username,
            email,
            password: hashedPassword
        });

        await user.save();

        const token = jwt.sign(
            { id: user._id.toString() },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.cookie('tkn', token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 60*60*1000
        });

        return res.status(200).json({ 
            message: 'Account created successfully',
            user: { id: user._id, username: user.username, email: user.email } 
        });

    } catch (error) {
        console.error("❌ Error:", error.message);
        res.status(500).json({ success: false, message: "An error occurred while creating the account" });
    }
});
// Login
router.post('/login', async (req, res) => {
    const { email, password, keepLogin } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        const pwd = await bcrypt.compare(password, user.password);
        if (!pwd) {
            return res.status(400).json({ message: "Incorrect password" });
        }

        const token = jwt.sign(
            { id: user._id.toString() }, 
            process.env.JWT_SECRET, 
            { expiresIn: keepLogin ?'1d' :'1h' }
        );
        res.cookie('tkn', token, {
            httpOnly: true,
            secure: true, 
            sameSite: "none",
            maxAge: keepLogin ?24*60*60*1000 :60*60*1000
        });

        return res.status(200).json({ 
            message: 'Login successful', 
            user: { id: user._id, username: user.username, email: user.email }
        });
    } catch (error) {
        console.error("❌ Error:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
// Logout
router.post('/logout', authMiddleware, async (req, res) => {
    try {
        res.clearCookie('tkn', {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        });
        return res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
});
// Get User
router.get('/user', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({
            user: { id: user._id, username: user.username, email: user.email }
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

// Reset Password
// router.post('/send-reset-otp', async (req, res) => {
//     const { email } = req.body;

//     if (!email) {
//         return res.json({ success: false, message: "Email is required" });
//     }

//     try {
//         const user = await userModel.findOne({ email });
//         if (!user) {
//             return res.json({ success: false, message: "User not found" });
//         }

//         const otp = String(Math.floor(100000 + Math.random() * 900000));
//         user.resetOtp = otp;
//         user.resetOtpExpireAt = Date.now() + 30 * 60 * 1000; // OTP expiry time: 30 minutes
//         await user.save();

//         const mailOptions = {
//             from: process.env.SENDER_EMAIL,
//             to: user.email,
//             subject: 'Password Reset',
//             html: `
//                 <p>Your OTP for password reset is: <strong>${otp}</strong></p>
//                 <p>This OTP is valid for 30 minutes.</p>
//             `,
//         };

//         await transporter.sendMail(mailOptions, (error, info) => {
//             if (error) {
//                 return res.json({ success: false, message: error.message });
//             }
//             return res.json({ success: true, message: "OTP sent to your email" });
//         });

//     } catch (error) {
//         return res.json({ success: false, message: error.message });
//     }
// });
// router.post('/reset-password', async (req, res) => {
//     const { email, otp, newPassword } = req.body;

//     if (!email || !otp || !newPassword) {
//         return res.json({ success: false, message: "Please provide all fields" });
//     }

//     try {
//         const user = await userModel.findOne({ email });
//         if (!user) {
//             return res.json({ success: false, message: "User not found" });
//         }

//         if (user.resetOtp === '' || user.resetOtp !== otp) {
//             return res.json({ success: false, message: "Invalid OTP" });
//         }

//         if (user.resetOtpExpireAt < Date.now()) {
//             return res.json({ success: false, message: "OTP expired" });
//         }

//         const hashedPassword = await bcrypt.hash(newPassword, 10);
//         user.password = hashedPassword;
//         user.resetOtp = '';
//         user.resetOtpExpireAt = 0;
//         await user.save();

//         return res.json({ success: true, message: "Password reset successfully" });

//     } catch (error) {
//         return res.json({ success: false, message: error.message });
//     }
// });

// Verify Email
// router.post('/send-verify-otp', async (req, res) => {
//     try {
//         const { userId } = req.body;
//         const user = await userModel.findById(userId);
//         if (user.isAccountVerified) {
//             return res.json({ success: false, message: "Account already verified" });
//         }

//         const otp = generateSecureCode(6);
//         user.resetOtp = otp;
//         user.resetOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;
//         await user.save();

//         const mailOptions = {
//             from: "SmartPDF",
//             to: user.email,
//             subject: 'Account Verification',
//             html: `
//                 <p>Your OTP for account verification is: <strong>${otp}</strong></p>
//                 <p>This OTP is valid for 24 hours.</p>
//             `,
//         };

//         await transporter.sendMail(mailOptions, (error, info) => {
//             if (error) {
//                 return res.json({ success: false, message: error.message });
//             }
//             return res.json({ success: true, message: "OTP sent successfully" });
//         });

//     } catch (error) {
//         return res.json({ success: false, message: error.message });
//     }
// });
// router.post('/verify-email', async (req, res) => {
//     const { userId, otp } = req.body;

//     if (!userId || !otp) {
//         return res.status(400).json({ success: false, message: "Missing details" });
//     }

//     try {
//         const user = await userModel.findById(userId);
//         if (!user) {
//             return res.status(404).json({ success: false, message: "User not found" });
//         }

//         if (!user.verifyotp || user.verifyotp !== otp) {
//             return res.status(400).json({ success: false, message: "Invalid OTP" });
//         }

//         if (user.verifyotpexpireAt < Date.now()) {
//             return res.status(400).json({ success: false, message: "OTP expired" });
//         }

//         // user.isAcconuntVerified = true;
//         user.verifyotp = '';
//         user.verifyotpexpireAt = null;
//         await user.save();

//         return res.json({ success: true, message: "Email verified successfully" });
//     } catch (error) {
//         console.error("❌ Error:", error);
//         return res.status(500).json({ success: false, message: "Internal Server Error" });
//     }
// });

module.exports = router;
