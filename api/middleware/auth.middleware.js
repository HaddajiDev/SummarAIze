
const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");

const authMiddleware = async(req, res, next) => {
    try {
        const token = req.cookies.tkn;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        req.userId = user._id;
        next();
    } catch (err){
        console.error("Error:", err.message);
        res.status(500).json({ message: "An error while verifying" });
    }

};
module.exports = authMiddleware;