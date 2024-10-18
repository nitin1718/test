// src/DriverLocation.js

import React, { useEffect } from 'react';
import io from 'socket.io-client';

const DriverLocation = ({ driverId, userId }) => {
  // Connect to the backend server
  const socket = io('http://localhost:5000'); // Replace with your backend server URL

  useEffect(() => {
    // Define the function to send the driver's location
    const updateDriverLocation = (driverId, userId) => {
      if (navigator.geolocation) {
        // Watch position and send updates when location changes
        navigator.geolocation.watchPosition(
          (position) => {
            const { latitude, longitude } = position.coords;

            // Emit the driver's location to the backend server with driverId and userId
            socket.emit('driverLocationUpdate', {
              driverId,
              userId,
              location: { lat: latitude, lng: longitude },
            });
          },
          (error) => {
            console.error('Error retrieving location:', error);
          },
          { enableHighAccuracy: true } // Option to enable high-accuracy location tracking
        );
      } else {
        console.error('Geolocation is not supported by this browser.');
      }
    };

    // Start sending location updates by calling the function with driverId and userId
    updateDriverLocation(driverId, userId);

    return () => {
      // Cleanup the socket connection when the component unmounts
      socket.disconnect();
    };
  }, [driverId, userId]);

  return <div>Driver is sharing location...</div>;
};

export default DriverLocation;
