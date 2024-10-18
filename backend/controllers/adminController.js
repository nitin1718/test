const Vehicle = require('../models/Vehicle');
const Booking = require('../models/Booking');

// Fleet management: get all vehicles
exports.getAllVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find();
    res.status(200).json({ vehicles });
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving vehicles' });
  }
};
// Basic data analytics
exports.getAnalytics = async (req, res) => {
  try {
    //   const Tripcost = await Booking.calculateEstimatedCost();
    // console.log(Booking)
      const totalTrips = 15
      console.log(totalTrips)
    //   const averageTripTime = await Booking.aggregate([
    //   { $group: { _id: null, avgTime: { $avg: "$duration" } } }
    // ]);
    // const driverPerformance = await Vehicle.aggregate([
    //   { $group: { _id: "$driverId", completedTrips: { $sum: 1 } } }
    // ]);

    res.status(200).json({
      totalTrips,
    //   Tripcost,
    //   averageTripTime: averageTripTime[0].avgTime,
    //   driverPerformance
    
    });
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving analytics' });
  }
};
