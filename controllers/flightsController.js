const Flight = require('../models/Flights');

// GET handler for fetching flights with filtering
exports.getFlights = async (req, res) => {
    try {
        let filters = {};

        const { departure, destination, flightNumber, minDate, maxDate, minPrice, maxPrice, minPassengers, maxPassengers } = req.query;

        if (departure) filters.departure = new RegExp(departure, 'i');
        if (destination) filters.destination = new RegExp(destination, 'i');
        if (flightNumber) filters.flightNumber = flightNumber;
        if (minDate) filters.date = { ...filters.date, $gte: new Date(minDate) };
        if (maxDate) filters.date = { ...filters.date, $lte: new Date(maxDate) };
        if (minPrice) filters.price = { ...filters.price, $gte: Number(minPrice) };
        if (maxPrice) filters.price = { ...filters.price, $lte: Number(maxPrice) };
        if (minPassengers) filters.passengers = { ...filters.passengers, $gte: Number(minPassengers) };
        if (maxPassengers) filters.passengers = { ...filters.passengers, $lte: Number(maxPassengers) };

        const flights = await Flight.find(filters);

        if (flights.length) {
            res.json({ success: true, data: flights });
        } else {
            res.json({ success: false, error: 'No flights found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// GET handler for fetching a flight by ID
exports.getFlightById = async (req, res) => {
    try {
        const flight = await Flight.findById(req.params.id);
        if (!flight) {
            return res.status(404).json({ success: false, error: 'Flight not found' });
        }
        res.json({ success: true, data: flight });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// POST handler for creating a new flight
exports.createFlight = async (req, res) => {
    try {
        const { flightNumber, departure, destination, date, price, passengers } = req.body;

        if (!flightNumber || !departure || !destination || !date || !price || !passengers) {
            return res.status(400).json({ success: false, error: 'All fields are required' });
        }

        const newFlight = new Flight({
            flightNumber,
            departure,
            destination,
            date: new Date(date),
            price: Number(price),
            passengers: Number(passengers)
        });

        const savedFlight = await newFlight.save();

        res.status(201).json({ success: true, data: savedFlight });
    } catch (error) {
        if (error.code === 11000) {
            res.status(400).json({ success: false, error: 'Flight number must be unique' });
        } else {
            res.status(500).json({ success: false, error: 'Server Error' });
        }
    }
};

// PUT handler for updating a flight by ID
exports.updateFlightById = async (req, res) => {
    try {
        const updatedFlight = await Flight.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedFlight) {
            return res.status(404).json({ success: false, error: 'Flight not found' });
        }
        res.json({ success: true, data: updatedFlight });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// DELETE handler for deleting a flight by ID
exports.deleteFlightById = async (req, res) => {
    try {
        const deletedFlight = await Flight.findByIdAndDelete(req.params.id);
        if (!deletedFlight) {
            return res.status(404).json({ success: false, error: 'Flight not found' });
        }
        res.json({ success: true, data: 'Flight deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};
