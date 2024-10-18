import React, { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import axios from 'axios';

const DriverStatusPage = () => {
  const { driver } = useContext(AuthContext);
  const [status, setStatus] = useState('pending');

  const updateStatus = async (newStatus) => {
    await axios.put(`http://localhost:5000/api/drivers/${driver._id}/status`, {
      status: newStatus,
    });
    setStatus(newStatus);
  };

  return (
    <div>
      <h2>Update Job Status</h2>
      <p>Current Status: {status}</p>
      <button onClick={() => updateStatus('en route')}>En Route</button>
      <button onClick={() => updateStatus('delivered')}>Delivered</button>
    </div>
  );
};

export default DriverStatusPage;
