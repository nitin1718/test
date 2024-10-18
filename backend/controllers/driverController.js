// backend/controllers/driverController.js

const Driver = require('../models/Driver');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Driver signup
const signup = async (req, res) => {
    try {
        const { name, email, password, phone, vehicleType } = req.body;

        // Check if the driver already exists
        const existingDriver = await Driver.findOne({ email });
        if (existingDriver) {
            return res.status(400).json({ message: 'Driver already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new driver
        const newDriver = new Driver({
            name,
            email,
            password: hashedPassword,
            phone,
            vehicleType,
            location: {
                type: 'Point',
                coordinates: [0, 0],  // Default location
            },
        });

        await newDriver.save();

        // Create token
        const token = jwt.sign({ id: newDriver._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({ message: 'Driver registered successfully', token });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Driver login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find driver by email
        const driver = await Driver.findOne({ email });
        if (!driver) {
            return res.status(404).json({ message: 'Driver not found' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, driver.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Create token
        const token = jwt.sign({ id: driver._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({
            user: { name: driver.name, email: driver.email },
            token
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Accept Booking
const acceptBooking = async (req, res) => {
    try {
        const { bookingId } = req.body;
        const driverId = req.driver.id; // Get driver ID from the authenticated token

        // Find the booking and update it with the driver's ID
        const booking = await Booking.findById(bookingId);

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        if (booking.status !== 'pending') {
            return res.status(400).json({ message: 'Booking is not pending' });
        }

        // Update the booking status and assign the driver
        booking.status = 'accepted';
        booking.driver = driverId; // Assign driver to the booking
        await booking.save();

        res.status(200).json({ message: 'Booking accepted successfully', booking });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};


// Update driver location
const updateLocation = async (req, res) => {
    try {
        const driverId = req.driver.id;  // Assuming driver is authenticated
        const { longitude, latitude } = req.body;

        const driver = await Driver.findById(driverId);
        if (!driver) {
            return res.status(404).json({ message: 'Driver not found' });
        }

        driver.location = {
            type: 'Point',
            coordinates: [longitude, latitude],
        };
        await driver.save();

        res.status(200).json({ message: 'Location updated', driver });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Update job status (e.g., en route, delivered)
const updateJobStatus = async (req, res) => {
    try {
        const driverId = req.driver.id;  // Assuming driver is authenticated
        const { status } = req.body;

        const driver = await Driver.findById(driverId);
        if (!driver) {
            return res.status(404).json({ message: 'Driver not found' });
        }

        driver.status = status;
        await driver.save();

        res.status(200).json({ message: 'Job status updated', driver });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};


module.exports = {
    signup,
    login,
    acceptBooking,
    updateLocation,
    updateJobStatus,
};