const express = require("express");
const router = express.Router();
const authenticateJWT = require("../controllers/authController").authenticateJWT;
const User = require("../models/User");
const Booking = require("../models/Booking");
const Payment = require("../models/Payment");

router.get("/", authenticateJWT, async (req, res) => {
    try {
        const user = await User.findOne({ email: req.user.email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const bookings = await Booking.find({ userEmail: user.email });
        const payments = await Payment.find({ userEmail: user.email });

        res.render("user_dashboard", {
            user: { name: user.name, email: user.email },
            bookings,
            payments
        });
    } catch (error) {
        console.error("Dashboard Error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
