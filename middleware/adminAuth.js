const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

let serverRestartTime = Date.now(); // 🔹 Track server start time

const adminAuth = async (req, res, next) => {
    try {
        console.log("🛠 Checking Admin Authentication...");

        const token = req.cookies?.adminToken;
        console.log("🔑 Received Token:", token);

        if (!token) {
            console.log("⚠️ No token! Redirecting to login...");
            return res.redirect("/admin/login");
        }

        // Verify and decode the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("✅ Token Decoded:", decoded);

        // 🔹 Invalidate tokens issued before the server restart
        if (decoded.iat * 1000 < serverRestartTime) {
            console.log("⛔ Token invalid due to server restart.");
            res.clearCookie("adminToken");
            return res.redirect("/admin/login");
        }

        // 🔹 Check token expiry manually (to ensure it's actually expired)
        if (decoded.exp * 1000 < Date.now()) {
            console.log("⛔ Token expired.");
            res.clearCookie("adminToken");
            return res.redirect("/admin/login");
        }

        const admin = await Admin.findById(decoded.adminId);

        if (!admin) {
            console.log("⛔ Access Denied! Admin not found.");
            res.clearCookie("adminToken");
            return res.redirect("/admin/login");
        }

        req.admin = admin;
        next();
    } catch (error) {
        console.log("❌ Invalid Token:", error.message);
        res.clearCookie("adminToken");
        return res.redirect("/admin/login");
    }
};

module.exports = adminAuth;
