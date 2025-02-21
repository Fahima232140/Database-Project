const axios = require('axios');

// Controller to get flights from Aviationstack API with filters
exports.getFlights = async (req, res) => {
    try {
        const { departure, destination, airline, flight_number } = req.query;

        // Build the API request URL with dynamic query parameters
        let apiUrl = `http://api.aviationstack.com/v1/flights?access_key=${process.env.AVIATIONSTACK_API_KEY}`;
        
        if (departure) apiUrl += `&dep_iata=${departure}`;
        if (destination) apiUrl += `&arr_iata=${destination}`;
        if (airline) apiUrl += `&airline_iata=${airline}`;
        if (flight_number) apiUrl += `&flight_number=${flight_number}`;

        // Make a GET request to the Aviationstack API
        const response = await axios.get(apiUrl);

        // Check if the response contains flight data
        const flights = response.data.data;

        if (flights && flights.length) {
            res.json({ success: true, data: flights });
        } else {
            res.json({ success: false, message: 'No flights found for the given parameters' });
        }
    } catch (error) {
        console.error('Error fetching flights:', error.message);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// Controller to get flight by flight number
exports.getFlightByNumber = async (req, res) => {
    try {
        const flightNumber = req.params.flightNumber;

        // Construct the API request URL
        const apiUrl = `http://api.aviationstack.com/v1/flights?access_key=${process.env.AVIATIONSTACK_API_KEY}&flight_number=${flightNumber}`;

        // Make a GET request to the Aviationstack API
        const response = await axios.get(apiUrl);
        
        const flight = response.data.data;

        if (flight && flight.length) {
            res.json({ success: true, data: flight });
        } else {
            res.status(404).json({ success: false, message: 'Flight not found' });
        }
    } catch (error) {
        console.error('Error fetching flight:', error.message);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
