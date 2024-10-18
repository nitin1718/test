const express = require('express');
const { registerUser, loginUser, getUserProfile, updateUserProfile } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Register a new user
router.post('/register', registerUser);

// Login user
router.post('/login', loginUser);

// Get user profile (requires authentication)
router.get('/profile', authMiddleware, getUserProfile);

// Update user profile (requires authentication)
router.put('/profile', authMiddleware, updateUserProfile);

module.exports = router;
