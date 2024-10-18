// routes/bookingRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { createBooking, viewBookingHistory, cancelBooking, estimateBookingCost, getActiveBookings, acceptBooking, viewBookingHistoryDriver} = require('../controllers/bookingController');

// User routes
router.post('/', authMiddleware, createBooking);  // Create Booking
router.post('/cost', estimateBookingCost);
router.get('/history', authMiddleware, viewBookingHistory);  // View Booking History
router.get('/driver-history', authMiddleware, viewBookingHistoryDriver);  // View Booking History
router.get('/active-requests', authMiddleware, getActiveBookings)
router.delete('/cancel/:bookingId', authMiddleware, cancelBooking);  // Cancel Booking
router.post('/accept/:id',authMiddleware, acceptBooking);


module.exports = router;
