// controllers/locationController.js
const Location = require('../models/Location');

// Update live location
const updateLiveLocation = async (req, res) => {
  const { latitude, longitude } = req.body;
  const userId = req.user._id; // Get userId from the authentication middleware

  try {
    const newLocation = new Location({
      userId,
      latitude,
      longitude,
    });

    await newLocation.save();

    res.status(200).json({ message: 'Location updated successfully' });
  } catch (error) {
    console.error('Error saving location', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get live location of a specific user
const getLiveLocation = async (req, res) => {
  const { userId } = req.params;

  try {
    const location = await Location.findOne({ userId }).sort({ timestamp: -1 });

    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }

    res.status(200).json(location);
  } catch (error) {
    console.error('Error fetching location', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { updateLiveLocation, getLiveLocation };
