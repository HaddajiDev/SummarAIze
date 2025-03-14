const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/UserModel');
const transporter = require('../Nodemailer');

const router = express.Router();
//------------------------------register-login-logout--------------------------------------//
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ success: false, message: 'Missing Details' });
    }

    try {
        const existingUser = await userModel.findOne({ email }).exec();
        if (existingUser) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new userModel({ name, email, password: hashedPassword });

        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            sameSite: process.env.NODE_ENV === 'development' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        const mailoptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Welcome to our app',
            html: `
                <html>
                <head>
                    <style>
                        body {
                            font-family: 'Arial', sans-serif;
                            background-color: #f0f8ff;
                            margin: 0;
                            padding: 0;
                            color: #333;
                        }
                        .container {
                            width: 100%;
                            max-width: 600px;
                            margin: 0 auto;
                            background-color: #fff;
                            padding: 20px;
                            border-radius: 10px;
                            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
                        }
                        .header {
                            text-align: center;
                            margin-bottom: 30px;
                        }
                        .header h1 {
                            color: rgb(0, 41, 174);
                            font-size: 2.5em;
                        }
                        .content {
                            text-align: center;
                            font-size: 1.2em;
                            line-height: 1.6;
                            color: #555;
                        }
                        .footer {
                            text-align: center;
                            margin-top: 30px;
                            font-size: 0.9em;
                            color: #888;
                        }
                        .footer a {
                            color: rgb(0, 41, 174);
                            text-decoration: none;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Welcome to Our App!</h1>
                        </div>
                        <div class="content">
                            <p>We are thrilled to have you on board. Get ready to explore all the amazing features our app has to offer!</p>
                            <p>Feel free to contact us if you need any assistance. We're here to help!</p>
                        </div>
                        <div class="footer">
                            <p>Stay connected with us!</p>
                            <p><a href="#">Visit our website</a></p>
                        </div>
                    </div>
                </body>
                </html>`
        };

        transporter.sendMail(mailoptions, (error, info) => {
            if (error) {
                console.log('Error sending email:', error);
                return res.status(500).json({ success: false, message: error.message });
            } else {
                console.log('Email sent:', info.response);
                return res.json({ success: true, message: 'Registration successful' });
            }
        });

    } catch (error) {
        console.error("❌ Error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Missing Details' });
    }

    try {
        const user = await userModel.findOne({ email }).exec();
        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Incorrect password" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development', 
            sameSite: process.env.NODE_ENV === 'development' ? 'none' : 'strict',  
            maxAge: 7 * 24 * 60 * 60 * 1000 
        });

        return res.json({ success: true, message: 'Login successful' });
    } catch (error) {
        console.error("❌ Error:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
router.post('/logout', async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        });
        return res.json({ success: true, message: "Logged out successfully" });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
});
//------------------------------reset-password--------------------------------------//
router.post('/send-reset-otp', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.json({ success: false, message: "Email is required" });
    }

    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));
        user.resetOtp = otp;
        user.resetOtpExpireAt = Date.now() + 30 * 60 * 1000; // OTP expiry time: 30 minutes
        await user.save();

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Password Reset',
            html: `
                <p>Your OTP for password reset is: <strong>${otp}</strong></p>
                <p>This OTP is valid for 30 minutes.</p>
            `,
        };

        await transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return res.json({ success: false, message: error.message });
            }
            return res.json({ success: true, message: "OTP sent to your email" });
        });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
});
router.post('/reset-password', async (req, res) => {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
        return res.json({ success: false, message: "Please provide all fields" });
    }

    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        if (user.resetOtp === '' || user.resetOtp !== otp) {
            return res.json({ success: false, message: "Invalid OTP" });
        }

        if (user.resetOtpExpireAt < Date.now()) {
            return res.json({ success: false, message: "OTP expired" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetOtp = '';
        user.resetOtpExpireAt = 0;
        await user.save();

        return res.json({ success: true, message: "Password reset successfully" });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
});
//------------------------------verify-email--------------------------------------//
router.post('/send-verify-otp', async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await userModel.findById(userId);
        if (user.isAccountVerified) {
            return res.json({ success: false, message: "Account already verified" });
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));
        user.verifyOtp = otp;
        user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000; // OTP expiry time: 24 hours
        await user.save();

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Account Verification',
            html: `
                <p>Your OTP for account verification is: <strong>${otp}</strong></p>
                <p>This OTP is valid for 24 hours.</p>
            `,
        };

        await transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return res.json({ success: false, message: error.message });
            }
            return res.json({ success: true, message: "OTP sent successfully" });
        });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
});
router.post('/verify-email', async (req, res) => {
    const { userId, otp } = req.body;

    if (!userId || !otp) {
        return res.status(400).json({ success: false, message: "Missing details" });
    }

    try {
        const user = await userModel.findById(userId).exec();
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (!user.verifyotp || user.verifyotp !== otp) {
            return res.status(400).json({ success: false, message: "Invalid OTP" });
        }

        if (user.verifyotpexpireAt < Date.now()) {
            return res.status(400).json({ success: false, message: "OTP expired" });
        }

        user.isAcconuntVerified = true;
        user.verifyotp = '';
        user.verifyotpexpireAt = 0;
        await user.save();

        return res.json({ success: true, message: "Email verified successfully" });
    } catch (error) {
        console.error("❌ Error:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});

module.exports = router;
