// src/components/RegisterVehiclePage.jsx
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import axios from 'axios';
import './Fireworks.css'; // Fireworks animation styles (वैकल्पिक)

const RegisterVehicle = () => {
  const { user, isDriver } = useContext(AuthContext);
  const navigate = useNavigate();

  const [licensePlate, setLicensePlate] = useState('');
  const [vehicleType, setVehicleType] = useState('car'); // Default value
  const [capacity, setCapacity] = useState('');
  const [status, setStatus] = useState('available'); // New State for Status
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Redirect if not authenticated or not a driver


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Basic Frontend Validation
    if (!licensePlate.trim() || !vehicleType || !capacity || !status) {
      setError('All fields are required.');
      return;
    }

    // License Plate Format Validation
    const licensePlatePattern = /^[A-Z]{3}-\d{4}$/;
    if (!licensePlatePattern.test(licensePlate.trim().toUpperCase())) {
      setError('License plate must be in the format AAA-1234.');
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      console.log(user._id)
      if (!token) {
        setError('No token found, please login again');
        return;
      }

      const res = await axios.post(
        'http://localhost:5000/api/vehicles',
        {
          licensePlate: licensePlate.trim().toUpperCase(),
          type: vehicleType,
          capacity: Number(capacity),
          status, // Include status in the request body
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, 
            'Content-Type': 'application/json',
          },
        }
      );

      setSuccess(true); // Show fireworks
      // Redirect after 3 seconds
      setTimeout(() => {
        navigate('/driver-dashboard');
      }, 3000);
    } catch (err) {
      console.error('Vehicle registration error:', err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to register vehicle. Please try again.');
      }
    }
  };

  // Generate random fireworks at different positions
  const generateFireworks = () => {
    const fireworkElements = [];

    for (let i = 0; i < 10; i++) {
      const randomX = Math.random() * 100; // Random X position
      const randomY = Math.random() * 100; // Random Y position
      const colors = ['red', 'blue', 'green', 'yellow', 'purple']; // Expanded colors
      const randomColor = colors[Math.floor(Math.random() * colors.length)];

      fireworkElements.push(
        <div
          key={i}
          className={`firework ${randomColor}`}
          style={{
            left: `${randomX}vw`,
            top: `${randomY}vh`,
          }}
        ></div>
      );
    }

    return fireworkElements;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 relative">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
          Register a Vehicle
        </h2>

        {!success ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* License Plate Field */}
            <div>
              <label htmlFor="licensePlate" className="block text-sm font-medium text-gray-700">
                License Plate
              </label>
              <input
                id="licensePlate"
                type="text"
                placeholder="e.g., ABC-1234"
                value={licensePlate}
                onChange={(e) => setLicensePlate(e.target.value)}
                required
                className="mt-1 px-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-teal-500 focus:border-teal-500"
              />
            </div>

            {/* Vehicle Type Field */}
            <div>
              <label htmlFor="vehicleType" className="block text-sm font-medium text-gray-700">
                Vehicle Type
              </label>
              <select
                id="vehicleType"
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
                required
                className="mt-1 px-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-teal-500 focus:border-teal-500"
              >
                <option value="car">Car</option>
                <option value="truck">Truck</option>
                <option value="van">Van</option>
                <option value="bike">Bike</option>
                {/* Add more vehicle types as needed */}
              </select>
            </div>

            {/* Capacity Field */}
            <div>
              <label htmlFor="capacity" className="block text-sm font-medium text-gray-700">
                Capacity
              </label>
              <input
                id="capacity"
                type="number"
                placeholder="e.g., 5"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                required
                min="1"
                className="mt-1 px-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-teal-500 focus:border-teal-500"
              />
            </div>

            {/* Status Field */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                required
                className="mt-1 px-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-teal-500 focus:border-teal-500"
              >
                <option value="available">Available</option>
                <option value="in_use">In Use</option>
                <option value="maintenance">Maintenance</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-teal-600 text-white py-2 px-4 rounded-lg hover:bg-teal-700 transition duration-300"
            >
              Register Vehicle
            </button>
          </form>
        ) : (
          <div className="text-center">
            <h3 className="text-2xl font-bold text-green-600">Vehicle Registered Successfully! 🎉</h3>
            <p className="text-gray-700 mt-2">Redirecting to the dashboard...</p>

            {/* Fullscreen Fireworks */}
            <div className="fireworks-wrapper">
              {generateFireworks()}
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <p className="mt-4 text-red-500 text-sm text-center">{error}</p>
        )}
      </div>
    </div>
  );
};

export default RegisterVehicle;
