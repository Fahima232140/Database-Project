const Flight = require('../models/Flights'); // Plural 'Flights'

// Create a new flight
exports.createFlight = async (req, res) => {
    try {
        const { departure, destination, date, price, flightNumber } = req.body;

        // Validate the request
        if (!departure || !destination || !date || !price || !flightNumber) {
            return res.status(400).json({ success: false, error: 'All fields are required!' });
        }

        // Create a new flight
        const newFlight = new Flight({ departure, destination, date, price, flightNumber });
        await newFlight.save();
        
        res.status(201).json({ success: true, data: newFlight });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Error creating flight: ' + error.message });
    }
};

// Get flights (with optional filtering)
exports.getFlights = async (req, res) => {
    try {
        const { departure, destination, flightNumber } = req.query;

        // Build filter criteria based on query parameters
        const filter = {};
        if (departure) filter.departure = { $regex: departure, $options: 'i' }; // Case-insensitive match
        if (destination) filter.destination = { $regex: destination, $options: 'i' };
        if (flightNumber) filter.flightNumber = { $regex: flightNumber, $options: 'i' };

        const flights = await Flight.find(filter); // Apply the filter

        res.status(200).json({ success: true, data: flights });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Error fetching flights: ' + error.message });
    }
};
