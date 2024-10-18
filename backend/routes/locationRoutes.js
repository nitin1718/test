// routes/locationRoutes.js
const express = require('express');
const { updateLiveLocation, getLiveLocation } = require('../controllers/locationController');
const protect = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/live-update', protect, updateLiveLocation); // Continuously update live location
router.get('/live/:userId', protect, getLiveLocation); // Get live location of a user

module.exports = router;
