import React, { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import axios from 'axios';

const CancelBookingPage = () => {
  const { user } = useContext(AuthContext);
  const [bookingId, setBookingId] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.delete(`http://localhost:5000/api/bookings/cancel/${bookingId}`, {
      headers: { Authorization: `Bearer ${user.token}` },
    });
  };

  return (
    <div>
      <h2>Cancel a Booking</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Booking ID"
          value={bookingId}
          onChange={(e) => setBookingId(e.target.value)}
          required
        />
        <button type="submit">Cancel Booking</button>
      </form>
    </div>
  );
};

export default CancelBookingPage;
