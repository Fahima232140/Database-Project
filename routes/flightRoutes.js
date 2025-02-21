const express = require('express');
const router = express.Router();
const flightController = require('../controllers/flightsController');

// Route to get flights with query parameters (filtered)
router.get('/', flightController.getFlights);

// Route to get a flight by flight number
router.get('/:flightNumber', flightController.getFlightByNumber);

module.exports = router;
