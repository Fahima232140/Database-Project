const express = require('express');
const router = express.Router();
const flightsController = require('../controllers/flightsController');

// POST route for creating a new flight
router.post('/create', flightsController.createFlight);

// GET route for fetching all flights with optional filtering
router.get('/', flightsController.getFlights);

module.exports = router;
