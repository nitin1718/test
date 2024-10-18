// backend/models/Driver.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const driverSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    vehicleType: {
        type: String,
        required: true,
    },
    location: {
        type: {
            type: String,  // 'Point'
            enum: ['Point'],
            required: true,
        },
        coordinates: {
            type: [Number],  // [longitude, latitude]
            required: true,
        }
    },
    status: {
        type: String,
        enum: ['available', 'unavailable'],
        default: 'available',
    },
}, { timestamps: true });

driverSchema.index({ location: '2dsphere' });  // For geospatial queries

const Driver = mongoose.model('Driver', driverSchema);
module.exports = Driver;
