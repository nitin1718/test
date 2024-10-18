const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register a new user
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create a new user instance
        const user = new User({ name, email, password: hashedPassword });
        
        // Save the user to the database
        await user.save();

        // Generate a JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Respond with the user object and token (excluding the password)
        res.status(201).json({
            user: { name: user.name, email: user.email },
            token
        });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
};

// Login user
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Compare the provided password with the hashed password in the database
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

        // Generate a JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Respond with the user object and token (excluding the password)
        res.status(200).json({
            user: { name: user.name, email: user.email },
            token
        });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
};

// Get user profile
const getUserProfile = async (req, res) => {
    try {
        // Assuming user ID is stored in the request after authentication middleware
        const userId = req.user.id;

        // Find the user by ID and exclude the password from the response
        const user = await User.findById(userId).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Respond with the user profile
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update user profile
const updateUserProfile = async (req, res) => {
    try {
        // Assuming user ID is stored in the request after authentication middleware
        const userId = req.user.id;

        // Update user profile with the new data
        const updatedUser = await User.findByIdAndUpdate(userId, req.body, {
            new: true,
            runValidators: true
        }).select('-password');

        if (!updatedUser) return res.status(404).json({ message: 'User not found' });

        // Respond with the updated user profile
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { registerUser, loginUser, getUserProfile, updateUserProfile };