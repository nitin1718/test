import React, { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import axios from 'axios';

const BookingPage = () => {
  const { user } = useContext(AuthContext);
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropOffLocation, setDropOffLocation] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [priceEstimate, setPriceEstimate] = useState(null);

  const handleBooking = async () => {
    const res = await axios.post('http://localhost:5000/api/bookings', {
      userId: user._id,
      pickupLocation,
      dropOffLocation,
      vehicleType,
    });
    setPriceEstimate(res.data.estimatedPrice);
  };

  return (
    <div>
      <h2>Book a Ride</h2>
      <input
        type="text"
        placeholder="Pickup Location"
        value={pickupLocation}
        onChange={(e) => setPickupLocation(e.target.value)}
      />
      <input
        type="text"
        placeholder="Drop-off Location"
        value={dropOffLocation}
        onChange={(e) => setDropOffLocation(e.target.value)}
      />
      <select onChange={(e) => setVehicleType(e.target.value)} value={vehicleType}>
        <option value="truck">Truck</option>
        <option value="van">Van</option>
      </select>
      <button onClick={handleBooking}>Get Price Estimate</button>
      {priceEstimate && <p>Estimated Price: ${priceEstimate}</p>}
    </div>
  );
};

export default BookingPage;
