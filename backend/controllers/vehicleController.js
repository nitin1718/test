// controllers/vehicleController.js
const Vehicle = require('../models/Vehicle');
const jwt = require('jsonwebtoken');
// Create a new vehicle
exports.createVehicle = async (req, res) => {
    try {
        
        const { licensePlate, type, capacity, status } = req.body;
        
        token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
   
            const driverId= decoded.id
        const vehicle = new Vehicle({ driverId, licensePlate, type, capacity, status });
        await vehicle.save();
        res.status(201).json({ message: 'Vehicle created successfully', vehicle });
    } catch (error) {
        res.status(400).json({ message: 'Error creating vehicle', error });
    }
};

// Get all vehicles
exports.getAllVehicles = async (req, res) => {
    try {
        const vehicles = await Vehicle.find().populate('driverId');
        res.status(200).json(vehicles);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching vehicles', error });
    }
};

// Update vehicle status
exports.updateVehicleStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const vehicle = await Vehicle.findByIdAndUpdate(id, { status }, { new: true });
        if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
        res.status(200).json({ message: 'Vehicle status updated successfully', vehicle });
    } catch (error) {
        res.status(400).json({ message: 'Error updating vehicle status', error });
    }
};

// Request vehicle verification
exports.requestVehicleVerification = async (req, res) => {
    try {
        const { id } = req.params;
        const vehicle = await Vehicle.findByIdAndUpdate(id, { verificationStatus: 'pending' }, { new: true });
        if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
        res.status(200).json({ message: 'Vehicle verification requested', vehicle });
    } catch (error) {
        res.status(400).json({ message: 'Error requesting vehicle verification', error });
    }
};

// Verify vehicle
exports.verifyVehicle = async (req, res) => {
    try {
        const { id } = req.params;
        const vehicle = await Vehicle.findByIdAndUpdate(id, { verificationStatus: 'verified' }, { new: true });
        if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
        res.status(200).json({ message: 'Vehicle verified successfully', vehicle });
    } catch (error) {
        res.status(400).json({ message: 'Error verifying vehicle', error });
    }
};

// Reject vehicle verification
exports.rejectVehicleVerification = async (req, res) => {
    try {
        const { id } = req.params;
        const vehicle = await Vehicle.findByIdAndUpdate(id, { verificationStatus: 'rejected' }, { new: true });
        if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
        res.status(200).json({ message: 'Vehicle verification rejected', vehicle });
    } catch (error) {
        res.status(400).json({ message: 'Error rejecting vehicle verification', error });
    }
};