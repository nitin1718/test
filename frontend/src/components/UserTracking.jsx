// src/components/UserTracking.js
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const UserTracking = ({ bookingId }) => {
  const [driverLocation, setDriverLocation] = useState(null);
  const socket = io('http://localhost:5000');

  useEffect(() => {
    // Join the booking room to get driver updates
    socket.emit('joinBooking', { bookingId });

    // Listen for driver location updates
    socket.on('updateDriverLocation', (data) => {
      console.log('Received driver location:', data);
      setDriverLocation(data); // Update state with the driver's location
    });

    return () => {
      socket.disconnect();
    };
  }, [bookingId]);

  return (
    <div>
      <h1>Tracking Driver's Location</h1>
      {driverLocation ? (
        <p>
          Driver's Current Location: Latitude {driverLocation.lat}, Longitude {driverLocation.lng}
        </p>
      ) : (
        <p>Waiting for driver's location...</p>
      )}
    </div>
  );
};
    
export default UserTracking;
