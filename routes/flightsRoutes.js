const express = require('express');
const router = express.Router();
const flightsController = require('../controllers/flightsController');

// POST route for creating a new flight
router.post('/', flightsController.createFlight);

// GET route for fetching all flights with filtering
router.get('/', flightsController.getFlights);

// GET route for fetching a flight by ID
router.get('/:id', flightsController.getFlightById);

// PUT route for updating a flight by ID
router.put('/:id', flightsController.updateFlightById);

// DELETE route for deleting a flight by ID
router.delete('/:id', flightsController.deleteFlightById);

module.exports = router;
