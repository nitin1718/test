import React, { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import axios from 'axios';

const DriverDashboard = () => {
  const { driver } = useContext(AuthContext);
  const [location, setLocation] = useState('');
  const [status, setStatus] = useState('');

  const acceptBooking = async () => {
    await axios.post('http://localhost:5000/api/drivers/accept-booking', {}, {
      headers: { Authorization: `Bearer ${driver.token}` },
    });
  };

  const updateLocation = async () => {
    await axios.put('http://localhost:5000/api/drivers/update-location', { location }, {
      headers: { Authorization: `Bearer ${driver.token}` },
    });
  };

  const updateJobStatus = async () => {
    await axios.put('http://localhost:5000/api/drivers/update-status', { status }, {
      headers: { Authorization: `Bearer ${driver.token}` },
    });
  };

  return (
    <div>
      <h2>Driver Dashboard</h2>
      <button onClick={acceptBooking}>Accept Booking</button>
      <div>
        <input
          type="text"
          placeholder="Update Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <button onClick={updateLocation}>Update Location</button>
      </div>
      <div>
        <input
          type="text"
          placeholder="Update Job Status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        />
        <button onClick={updateJobStatus}>Update Status</button>
      </div>
    </div>
  );
};

export default DriverDashboard;
