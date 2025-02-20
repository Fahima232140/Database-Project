// flightsRoutes.js

const express = require('express');
const router = express.Router();
const flightsController = require('../controllers/flightsController');

// POST route for creating a new flight
router.post('/', flightsController.createFlight);

// GET route for fetching all flights
router.get('/', flightsController.getFlights);

module.exports = router;
