const jwt = require('jsonwebtoken');
const Session = require('../models/Session');
const User = require('../models/User'); // Import User model

// ✅ Authentication Middleware with Session & Security Checks
const authenticateJWT = async (req, res, next) => {
    console.log("🔍 Authenticating request...");

    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: "⚠️ Unauthorized: No token provided" });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId || decoded._id;
        
        if (!userId) {
            return res.status(400).json({ message: "⚠️ Invalid token: No user ID found" });
        }

        // ✅ Fetch user from DB and verify existence
        const user = await User.findById(userId).select('isVerified');
        if (!user) {
            return res.status(404).json({ message: "⚠️ User not found!" });
        }
        if (!user.isVerified) {
            return res.status(403).json({ message: "⚠️ Please verify your email to proceed." });
        }

        // ✅ Fetch latest session and validate
        const latestSession = await Session.findOne({ userId }).sort({ createdAt: -1 });
        if (!latestSession || latestSession.refreshToken !== token) {
            await Session.deleteMany({ userId }); // Force logout all sessions
            return res.status(401).json({ message: "⚠️ Session expired. Please log in again!" });
        }

        // ✅ Enforce IP restriction
        if (latestSession.ipAddress !== req.ip) {
            await Session.deleteOne({ _id: latestSession._id });
            res.clearCookie('refreshToken');
            return res.status(401).json({ message: "⚠️ Session terminated due to IP change" });
        }

        // Attach user info to request
        req.user = decoded;
        req.userId = userId;

        console.log("✅ Authentication Success! User ID:", req.userId);
        next();
    } catch (err) {
        console.log("❌ Token verification failed:", err.message);
        res.clearCookie('refreshToken');
        return res.status(403).json({ message: "⚠️ Forbidden: Invalid token" });
    }
};

// ✅ Export
module.exports = { authenticateJWT };
