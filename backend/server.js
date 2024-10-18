const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const driverRoutes = require('./routes/driverRoutes');
const bookingRoutes = require('./routes/bookingRoutes'); // Import booking routes
const AdminRoutes=require('./routes/AdminRoutes')
const vehicleRoutes = require('./routes/vehicleRoutes')
const locationRoutes = require('./routes/locationRoutes');
const dotenv = require('dotenv');

dotenv.config();
connectDB();

const app = express();
app.use(cors({
     origin: 'http://localhost:5173'
}));
app.use(express.json());

// Define routes
app.use('/api/auth', userRoutes); // User authentication routes
app.use('/api/driver', driverRoutes); // Driver-related routes
app.use('/api/bookings', bookingRoutes); // Booking routes
app.use('/api/admin',AdminRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/location', locationRoutes);
const PORT = process.env.PORT || 5000;

const http = require('http');
const socketIo = require('socket.io');

const server = http.createServer(app);
const io = socketIo(server); // Initialize Socket.IO with the server

// Track drivers' locations
const driverLocations = {};

// When a new connection is made
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Listen for driver location updates
  socket.on('driverLocationUpdate', (data) => {
    const { driverId, location } = data;

    // Update the driver's location
    driverLocations[driverId] = location;

    // Broadcast the location to the user who booked the driver
    io.to(data.userId).emit('updateDriverLocation', location);
  });

  // Join a room for a specific booking (to send updates only to the relevant user)
  socket.on('joinBooking', (data) => {
    socket.join(data.bookingId); // Joining the booking room
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});


server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});




// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });

// MONGO_URI=mongodb+srv://singhvikash7077:VIKASH7077@cluster0.tk509.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
// JWT_SECRET=your_jwt_secret_key
// PORT=5000
