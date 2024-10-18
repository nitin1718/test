// backend/routes/driverRoutes.js

const express = require('express');
const { signup, login, acceptBooking, updateLocation, updateJobStatus } = require('../controllers/driverController');
const { protectDriver } = require('../middleware/driverMiddleware');  // Middleware for driver authentication

const router = express.Router();

// Route for driver signup
router.post('/signup', signup);

// Route for driver login
router.post('/login', login);

// Route to accept booking
router.post('/accept-booking', protectDriver, acceptBooking);

// Route to update driver location
router.put('/update-location', protectDriver, updateLocation);

// Route to update job status
router.put('/update-status', protectDriver, updateJobStatus);

module.exports = router;
