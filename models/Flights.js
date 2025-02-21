// models/Flight.js
const mongoose = require('mongoose');

const flightSchema = new mongoose.Schema({
    departure: { type: String, required: true },
    destination: { type: String, required: true },
    date: { type: Date, required: true },
    price: { type: Number, required: true },
    flightNumber: { type: String, required: true, unique: true },
    passengers: { type: Number, required: true }, // Add passengers field
    availability: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

const Flight = mongoose.model('Flight', flightSchema);
module.exports = Flight;
