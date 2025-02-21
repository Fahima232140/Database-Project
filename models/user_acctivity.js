const mongoose = require('mongoose');

const UserActivitySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Booking' }],
    payments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Payment' }],
    lastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('UserActivity', UserActivitySchema);