const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');

// Get User Booking & Payment History
router.get('/history/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        
        // Fetch Bookings & Payments for User
        const bookings = await Booking.find({ user_id: userId });
        const payments = await Payment.find({ user_id: userId });

        res.json({ bookings, payments });
    } catch (error) {
        console.error("Error fetching history:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
