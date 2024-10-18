// backend/middleware/adminMiddleware.js

const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin'); // Import the Admin model

const isAdmin = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.admin = await Admin.findById(decoded.id).select('-password');  // Add admin to request
            if (!req.admin) {
                return res.status(403).json({ message: 'Access denied, not an admin' });
            }
            next();
        } catch (error) {
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

module.exports = { isAdmin };
    