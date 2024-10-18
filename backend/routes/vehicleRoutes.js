// routes/vehicleRoutes.js
const express = require('express');
const {
    createVehicle,
    getAllVehicles,
    updateVehicleStatus,
    requestVehicleVerification,
    verifyVehicle,
    rejectVehicleVerification,
} = require('../controllers/vehicleController');
const verifyToken = require('../utils/verifyToken'); // Ensure this path is correct

const router = express.Router();

// Route to create a vehicle
router.post('/', createVehicle);

// Route to get all vehicles
router.get('/', verifyToken, getAllVehicles);

// Route to update vehicle status
router.put('/:id/status', verifyToken, updateVehicleStatus);

// Route to request vehicle verification
router.put('/:id/request-verification', verifyToken, requestVehicleVerification);

// Route to verify vehicle
router.put('/:id/verify', verifyToken, verifyVehicle);

// Route to reject vehicle verification
router.put('/:id/reject', verifyToken, rejectVehicleVerification);

module.exports = router;
