// models/Booking.js
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver' }, // Driver reference
    pickupLocation: { type: String, required: true },
    dropOffLocation: { type: String, required: true },
    vehicleType: { type: String, required: true },
    estimatedCost: { type: Number, required: true },
    status: {
        type: String,
        enum: ['active', 'canceled', 'completed', 'pending'], // Include 'pending'
        default: 'active',
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Booking', bookingSchema);
