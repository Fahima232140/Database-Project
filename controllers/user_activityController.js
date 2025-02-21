// controllers/user_activityController.js
const User = require('../models/User');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
const bcrypt = require('bcrypt');
const passport = require('passport');

exports.getUserActivity = async (req, res) => {
    try {
        if (!req.userId) {
            return res.status(401).send('Unauthorized: No user found');
        }

        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).send('User not found');
        }

        // Fetch bookings & payments using user ID
        const bookings = await Booking.find({ userId: user._id }).sort({ date: -1 });
        const payments = await Payment.find({ userId: user._id }).sort({ createdAt: -1 });

        res.render('user_activity', { user, bookings, payments });
    } catch (error) {
        console.error("❌ Error fetching user activity:", error);
        res.status(500).send('Server Error');
    }
};
exports.changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        if (!oldPassword || !newPassword) {
            return res.status(400).json({ message: 'Both old and new passwords are required' });
        }

        // Fetch user dynamically (this assumes authMiddleware attaches req.userId)
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Hash new password
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Error updating password:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


module.exports = {
    getUserActivity: exports.getUserActivity, 
    changePassword: exports.changePassword
};

