const Booking = require('../models/Booking');
const jwt = require('jsonwebtoken');
// controllers/bookingController.js

const createBooking = async (req, res) => {
    try {
        const { pickupLocation, dropOffLocation, vehicleType,estimatedCost } = req.body; // Use dropOffLocation
        // console.log(req.body)
        // Log incoming request body
        // console.log('Incoming booking request:', req.body);
        
        // Ensure the user is authenticated
        if (!req.user ) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        // Calculate estimated cost based on vehicle type and distance
        if (estimatedCost === null || estimatedCost === undefined) {
            return res.status(400).json({ error: 'Failed to calculate estimated cost' });
        }

        const booking = new Booking({
            userId: req.user.id, // User ID from authenticated request
            pickupLocation,
            dropOffLocation, // Ensure this matches the schema
            vehicleType,
            estimatedCost,
            status: 'active', // Use 'active' as initial booking status
        });

        await booking.save();
        res.status(201).json({ message: 'Booking created successfully', booking });
    } catch (error) {
        console.error('Error creating booking:', error); // Log the error details
        res.status(500).json({ error: 'Failed to create booking', details: error.message });
    }
};


// View user's booking history
const viewBookingHistory = async (req, res) => {
    try {
        // Fetch bookings for the logged-in user and populate both user and driver details
        const bookings = await Booking.find({ userId: req.user.id })
            .populate('userId', 'name email phone') // Populating user details
            .populate('driverId', 'name email phone'); // Populating driver details

        if (bookings.length === 0) {
            return res.status(200).json({ message: 'No bookings found for this user.' });
        }

        res.status(200).json(bookings);
    } catch (error) {
        console.error('Error retrieving booking history:', error);
        res.status(500).json({ error: 'Failed to retrieve booking history' });
    }
};



// Cancel a booking
// Cancel a booking
const cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.bookingId);

        if (!booking || booking.userId.toString() !== req.user.id) {
            return res.status(404).json({ error: 'Booking not found or unauthorized' });
        }

        booking.status = 'canceled'; // Change the status to 'canceled'
        await booking.save();

        res.status(200).json({ message: 'Booking cancelled successfully' });
    } catch (error) {
        console.error('Error cancelling booking:', error);
        res.status(500).json({ error: 'Failed to cancel booking' });
    }
};

// Function to estimate the cost (dummy implementation)
const calculateEstimatedCost = async (pickupLocation, dropoffLocation, vehicleType, distance) => {
    const baseFare = 100; // Fixed base fare in INR
    const perKmRate = 12; // Cost per kilometer in INR

    // Calculate the initial cost without any surcharges
    let estimatedCost = baseFare + (distance * perKmRate);

    // Add a surcharge for long distances (optional)
    if (distance > 20) {
        const longDistanceSurcharge = 0.15 * estimatedCost; // 15% surcharge for distances greater than 20 km
        estimatedCost += longDistanceSurcharge;
    }

    // Add GST (optional)
    const gstRate = 0.18; // GST rate (18%)
    const gstAmount = estimatedCost * gstRate;
    estimatedCost += gstAmount;

    // Return the calculated cost, rounded to two decimal places
    return Math.round(estimatedCost * 100) / 100;
};



const estimateBookingCost = async (req, res) => {
    try {
        const { pickupLocation, dropOffLocation, vehicleType, distance } = req.body;

        const estimatedCost = await calculateEstimatedCost(pickupLocation, dropOffLocation, vehicleType, distance);

        if (estimatedCost === null || estimatedCost === undefined) {
            return res.status(400).json({ error: 'Failed to calculate estimated cost' });
        }

        res.status(201).json({
            message: 'Booking cost estimated successfully',
            estimatedCost: estimatedCost // Send estimated cost in the response
        });
    } catch (error) {
        console.error('Error estimating booking cost:', error); // Log the error details
        res.status(500).json({ error: 'Failed to estimate booking cost', details: error.message });
    }
};




// Fetch active bookings for a driver
const getActiveBookings = async (req, res) => {
  try {
    const driverId = req.user._id; // Assume the driver is authenticated and their ID is in req.user
    const bookings = await Booking.find({ driverId, status: 'active' })
      .populate('userId', 'name email') // Populate user details if necessary
      .populate('driverId', 'name email phone'); // Populate driver details
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching active bookings' });
  }
};



const acceptBooking = async (req, res) => {
    try {
      const bookingId = req.params.id;
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const driverId= decoded.id

      // Update the booking status to 'pending' and set the driverId
      const updatedBooking = await Booking.findByIdAndUpdate(
        bookingId,
        { status: 'pending', driverId: driverId}, // Assuming req.user contains the driver's information
        { new: true }
      );
  
      if (!updatedBooking) {
        return res.status(404).json({ message: 'Booking not found' });
      }
  
      res.status(200).json(updatedBooking);
    } catch (error) {
      console.error('Error accepting booking:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };






  const viewBookingHistoryDriver = async (req, res) => {
    try {

        const bookingId = req.params.id;
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const driverId= decoded.id
        // Fetch bookings for the logged-in user and populate both user and driver details
        const bookings = await Booking.find({  driverId: driverId })
            .populate('userId', 'name email phone') // Populating user details
            .populate('driverId', 'name email phone'); // Populating driver details

        if (bookings.length === 0) {
            return res.status(200).json({ message: 'No bookings found for this user.' });
        }

        res.status(200).json(bookings);
    } catch (error) {
        console.error('Error retrieving booking history:', error);
        res.status(500).json({ error: 'Failed to retrieve booking history' });
    }
};


module.exports = {
    createBooking,
    viewBookingHistory,
    cancelBooking,
    estimateBookingCost,
    getActiveBookings,
    acceptBooking,
    viewBookingHistoryDriver
};
