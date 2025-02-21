const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');

// ✅ GET User Activity (Bookings & Payments) by Email
router.get('/history/:email', async (req, res) => {
    try {
        const { email } = req.params;

        // Fetch Bookings & Payments based on the email
        const bookings = await Booking.find({ email });
        const payments = await Payment.find({ cardholder: email });

        res.json({ bookings, payments });
    } catch (error) {
        console.error("❌ Error fetching user activity:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
