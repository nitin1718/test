// models/Vehicle.js
const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
    driverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Driver',
        required: true
    },
    licensePlate: {
        type: String,
        required: true,
        unique: true,
    },
    type: {
        type: String,
        enum: ['car', 'truck', 'van', 'bike'], // Add more vehicle types as needed
        required: true,
    },
    capacity: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['available', 'in_use', 'maintenance', 'inactive'],
        default: 'available',
    },
    verificationStatus: {
        type: String,
        enum: ['pending', 'verified', 'rejected'],
        default: 'pending',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('Vehicle', vehicleSchema);
