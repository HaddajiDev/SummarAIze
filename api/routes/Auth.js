const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/UserModel.js');
const transporter = require('../config/nodemailer.js');

const router = express.Router();

router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password ) {
        return res.status(400).json({ success: false, message: 'Missing Details' });
    }

    try {
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new userModel({
            name,
            email,
            password: hashedPassword,
        });

        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            sameSite: process.env.NODE_ENV === 'development' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 jours
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
                            color:rgb(0, 41, 174);
                            font-size: 2.5em;
                        }
                        .content {
                            text-align: center;
                            font-size: 1.2em;
                            line-height: 1.6;
                            color: #555;
                        }
                        .content p {
                            margin-bottom: 20px;
                        }
                        .footer {
                            text-align: center;
                            margin-top: 30px;
                            font-size: 0.9em;
                            color: #888;
                        }
                        .footer a {
                            color:rgb(0, 41, 174);
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
                </html>
            `
        };

        transporter.sendMail(mailoptions, (error, info) => {
            if (error) {
                console.log('Error sending email:', error);
                return res.status(500).json({ success: false, message: error.message });
            } else {
                console.log('Email sent: ' + info.response);
                return res.json({ success: true, message: 'Registration successful' });
            }
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});


module.exports = router;
