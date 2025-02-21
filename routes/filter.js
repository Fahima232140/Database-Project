const express = require('express');
const router = express.Router();

// Define your POST route
router.post('/filter', (req, res) => {
    const filterData = req.body;
    // Add your filtering logic here
    res.status(200).json({ message: "Filter applied", data: filterData });
});

module.exports = router;
