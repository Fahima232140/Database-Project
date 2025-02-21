const express = require('express');
const router = express.Router();
const userActivityController = require('../controllers/user_activityController');

// ✅ Ensure you are correctly referencing the function
router.post('/changePassword', userActivityController.changePassword);

module.exports = router;
