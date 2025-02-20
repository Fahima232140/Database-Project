const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const User = require("../models/User"); // Ensure this model exists
const router = express.Router();
const adminAuth = require("../middleware/adminAuth");

// ✅ Render the Admin Login Page
router.get("/login", (req, res) => {
    res.render("adminLogin"); // Ensure "adminLogin.hbs" exists in the templates folder
});

// ✅ Admin Login (POST)
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log("🔍 Received Email:", email);
        console.log("🔍 Received Password:", password);

        const admin = await Admin.findOne({ email });
        if (!admin) {
            console.log("❌ Admin not found!");
            return res.status(400).json({ error: "Admin not found!" });
        }

        console.log("✅ Found Admin:", admin);

        const isMatch = await bcrypt.compare(password, admin.password);
        console.log("🔍 Password Match:", isMatch);

        if (!isMatch) {
            console.log("❌ Invalid credentials!");
            return res.status(401).json({ error: "Invalid credentials!" });
        }

        const token = jwt.sign({ adminId: admin._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.cookie("adminToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Secure in production
            sameSite: "Strict",
            expires: 0, // 🔹 Make cookie session-based (deleted when browser closes)
        });


        console.log("✅ Login Successful, Redirecting to Users...");
        res.redirect("/admin/users");

    } catch (error) {
        console.error("❌ Login Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


// ✅ Fetch All Users (Protected)
router.get("/users", adminAuth, async (req, res) => {
    try {
        const users = await User.find();
        res.render("adminUsers", { users }); // Ensure "adminUsers.hbs" exists
    } catch (error) {
        res.status(500).json({ error: "⚠️ Failed to fetch users" });
    }
});

router.post("/users/edit/:id", adminAuth, async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const updateData = { name, email };

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            updateData.password = hashedPassword;
        }

        await User.findByIdAndUpdate(req.params.id, updateData);
        res.status(200).json({ message: "User updated successfully!" });
    } catch (error) {
        res.status(500).json({ error: "Failed to update user" });
    }
});

// ✅ Delete User (Protected)
router.post("/users/delete/:id", adminAuth, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.redirect("/admin/users");
    } catch (error) {
        res.status(500).json({ error: "⚠️ Failed to delete user" });
    }
});

// ✅ Admin Logout
router.post("/logout", (req, res) => {
    res.clearCookie("adminToken");
    res.redirect("/admin/login"); // Redirect to login page after logout
});

module.exports = router;
