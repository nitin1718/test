import React, { useContext } from 'react';
import DriverLocation from './DriverLocation';
import AuthContext from '../context/AuthContext';

const LiveTracking = ({ bookingId }) => {
  const { isDriver } = useContext(AuthContext);
  const driverId = 'driver123'; // Replace with actual driver ID
  const userId = 'user456'; // Replace with actual user ID

  return (
    <div className="App">
      <h1>{isDriver ? "Driver Tracking" : "User Tracking"}</h1>
      <DriverLocation driverId={driverId} userId={userId} />
      {/* UserTracking component can be included here for user side */}
    </div>
  );
};

export default LiveTracking;
