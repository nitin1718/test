const express = require('express');
const { isAdmin } = require('../middleware/adminMiddleware'); // Import the admin middleware
const router = express.Router();
const Vehicle = require('../models/Vehicle'); // Assuming you have a Vehicle model
const Booking = require('../models/Booking'); // Assuming you have a Booking model
const Driver = require('../models/Driver'); // Assuming you have a Driver model
const Admin = require('../models/Admin'); // Import the Admin model

// Fleet Management
router.post('/vehicles', isAdmin, async (req, res) => {
    const { make, model, type, status } = req.body;
    try {
        const vehicle = new Vehicle({ make, model, type, status });
        await vehicle.save();
        res.status(201).json(vehicle);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.get('/vehicles', isAdmin, async (req, res) => {
    try {
        const vehicles = await Vehicle.find();
        res.status(200).json(vehicles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put('/vehicles/:id', isAdmin, async (req, res) => {
    const { id } = req.params;
    try {
        const vehicle = await Vehicle.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json(vehicle);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete('/vehicles/:id', isAdmin, async (req, res) => {
    const { id } = req.params;
    try {
        await Vehicle.findByIdAndDelete(id);
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Driver Monitoring
router.get('/drivers', isAdmin, async (req, res) => {
    try {
        const drivers = await Driver.find(); // Fetch driver details
        console.log(drivers);
        res.status(200).json(drivers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Data Analysis
router.get('/analytics', isAdmin, async (req, res) => {
    try {
        const bookings = await Booking.find(); // Fetch all bookings
        const totalTrips = bookings.length;
        const totalTripTime = bookings.reduce((acc, booking) => acc + booking.tripTime, 0);
        const avgTripTime = totalTrips ? (totalTripTime / totalTrips) : 0;

        // Calculate driver performance
        const driverPerformance = await Driver.aggregate([
            { $lookup: { from: 'bookings', localField: '_id', foreignField: 'driverId', as: 'trips' } },
            { $project: { name: 1, totalTrips: { $size: '$trips' }, avgTripTime: { $avg: '$trips.tripTime' } } }
        ]);

        res.status(200).json({ totalTrips, avgTripTime, driverPerformance });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Admin Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const admin = await Admin.findOne({ email });

        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        // Assuming you have a method to validate passwords
        // const isMatch = await admin.comparePassword(password);
        if (admin.password!=password) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate a token and send response
        const token = admin.generateAuthToken(); // Assuming you have this method
        res.status(200).json({ token, user: admin });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
