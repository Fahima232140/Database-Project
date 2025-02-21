const Booking = require('../models/Booking');
const Payment = require('../models/Payment');

exports.getUserActivity = async (req, res) => {
    try {
        const { email } = req.params;

        // Fetch Bookings & Payments using email
        const bookings = await Booking.find({ email }).lean();
        const payments = await Payment.find({ cardholder: email }).lean();

        res.render('userActivity', { bookings, payments });
    } catch (error) {
        console.error("Error fetching user history:", error);
        res.status(500).send("Internal Server Error");
    }
};
