const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin"); // Import the Admin model

const adminAuth = async (req, res, next) => {
    try {
        console.log("🛠 Checking Admin Authentication...");

        // Get token from cookies or Authorization header
        const token = req.cookies?.adminToken || req.header("Authorization")?.replace("Bearer ", "");
        console.log("🔑 Received Token:", token);

        if (!token) {
            console.log("⚠️ No token provided!");
            return res.status(401).json({ error: "⚠️ Unauthorized! No token provided." });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("✅ Token Decoded:", decoded);

        // Fetch admin from database
        const admin = await Admin.findById(decoded.adminId);

        if (!admin) {
            console.log("⛔ Access Denied! Admin not found.");
            return res.status(403).json({ error: "⚠️ Access denied! Admin not found." });
        }

        req.admin = admin; // Attach admin details to request object
        next();
    } catch (error) {
        console.log("❌ Invalid Token:", error.message);
        return res.status(403).json({ error: "⚠️ Invalid or expired token!" });
    }
};

module.exports = adminAuth;
