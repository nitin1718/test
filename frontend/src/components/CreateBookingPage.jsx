import React, { useState, useContext, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import axios from 'axios';
import './Fireworks.css';

const CreateBookingPage = () => {
  const { user } = useContext(AuthContext);
  const { vehicleType } = useParams(); 
  const navigate = useNavigate();

  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [priceEstimate, setPriceEstimate] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    try {
      const token = localStorage.getItem('authToken');

      if (!token) {
        setError('No token found, please login again');
        return;
      }

      const res = await axios.post(
        'http://localhost:5000/api/bookings/',
        {
          userId: user._id,
          pickupLocation: fromQuery,
          dropOffLocation: toQuery,
          vehicleType: vehicleType,
          estimatedCost: priceEstimate,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        }
      );

      setSuccess(true); // Set success to true to show fireworks
      
      // Show fireworks for 3 seconds, then redirect
      setTimeout(() => {
        navigate('/'); // Redirect to home page after success
      }, 3000);
    } catch (err) {
      console.error('Booking creation error:', err);
      setError('Failed to create booking. Please try again.');
    }
  };

  const handleBooking = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/bookings/cost', {
        pickupLocation: fromQuery,
        dropOffLocation: toQuery,
        vehicleType,
        distance: distance
      });

      setPriceEstimate(res.data.estimatedCost);
    } catch (err) {
      console.error('Error fetching price estimate:', err);
      setError('Failed to fetch price estimate. Please try again.');
    }
  };

  // Remaining code...

  const [fromQuery, setFromQuery] = useState(''); // From location search query
  const [toQuery, setToQuery] = useState('');     // To location search query
  const [fromSuggestions, setFromSuggestions] = useState([]); // Suggestions for "From"
  const [toSuggestions, setToSuggestions] = useState([]);     // Suggestions for "To"
  const [fromCoordinates, setFromCoordinates] = useState(null); // Coordinates of "From"
  const [toCoordinates, setToCoordinates] = useState(null);     // Coordinates of "To"
  const [distance, setDistance] = useState(null); // Calculated distance between "From" and "To"

  // Function to fetch suggestions based on query and which search bar ("From" or "To")
  const getSuggestions = async (query, setSuggestions) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }
    try {
      const response = await axios.get(`https://nominatim.openstreetmap.org/search?q=${query}&format=json&addressdetails=1&limit=50`);
      setSuggestions(response.data);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  // Function to handle search changes and fetch suggestions for "From" or "To"
  const handleFromSearchChange = (e) => {
    setFromQuery(e.target.value);
    getSuggestions(e.target.value, setFromSuggestions);  // Fetch suggestions for "From"
  };

  const handleToSearchChange = (e) => {
    setToQuery(e.target.value);
    getSuggestions(e.target.value, setToSuggestions);  // Fetch suggestions for "To"
  };

  // Function to handle suggestion selection for "From" and save coordinates
  const handleFromSuggestionClick = (suggestion) => {
    setFromQuery(suggestion.display_name); // Set selected place name
    setFromCoordinates({
      latitude: suggestion.lat,
      longitude: suggestion.lon,
    }); // Save coordinates of the selected place
    setFromSuggestions([]); // Clear suggestions
  };

  // Function to handle suggestion selection for "To" and save coordinates
  const handleToSuggestionClick = (suggestion) => {
    setToQuery(suggestion.display_name); // Set selected place name
    setToCoordinates({
      latitude: suggestion.lat,
      longitude: suggestion.lon,
    }); // Save coordinates of the selected place
    setToSuggestions([]); // Clear suggestions
  };

  // Haversine Formula to calculate distance between two coordinates
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371; // Radius of Earth in kilometers
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
  };

  // Calculate distance between "From" and "To" whenever both coordinates are set
  useEffect(() => {
    if (fromCoordinates && toCoordinates) {
      const calculatedDistance = calculateDistance(
        fromCoordinates.latitude,
        fromCoordinates.longitude,
        toCoordinates.latitude,
        toCoordinates.longitude
      );
      setDistance(calculatedDistance);
    }
  }, [fromCoordinates, toCoordinates]);







  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 relative">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
          Create a Booking for{' '}
          <span className="text-indigo-600">{vehicleType.replace(/([A-Z])/g, ' $1').trim()}</span>
        </h2>

        {!success ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Pickup and Dropoff Fields */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Pickup Location</label>
              <input
                type="text"
                placeholder="Pickup Location"
                value={fromQuery}
                onChange={handleFromSearchChange}
                required
                autoComplete="off"
                className="mt-1 px-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-indigo-500 focus:border-indigo-500"
              />
              {fromSuggestions.length > 0 && (
          <ul className="suggestions-dropdown">
            {fromSuggestions.map((suggestion) => (
              <li key={suggestion.place_id} onClick={() => handleFromSuggestionClick(suggestion)}>
                {suggestion.display_name}
              </li>
            ))}
          </ul>
        )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Dropoff Location</label>
              <input
                type="text"
                placeholder="Dropoff Location"
                value={toQuery}
                onChange={handleToSearchChange}
                required
                autoComplete="off"
                className="mt-1 px-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-indigo-500 focus:border-indigo-500"
              />
               {toSuggestions.length > 0 && (
          <ul className="suggestions-dropdown">
            {toSuggestions.map((suggestion) => (
              <li key={suggestion.place_id} onClick={() => handleToSuggestionClick(suggestion)}>
                {suggestion.display_name}
              </li>
            ))}
          </ul>
        )}
         {/* Show distance after both locations are selected */}
      {distance && (
        <p>
          The distance from <strong>{fromQuery}</strong> to <strong>{toQuery}</strong> is {distance.toFixed(2)} kilometers.
        </p>
      )}
            </div>

            {/* Price Estimate Button */}
            <button
              type="button"
              onClick={handleBooking}
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition duration-300"
            >
              Get Price Estimate
            </button>

            {priceEstimate && <p className="text-center text-lg font-bold">Estimated Price: ₹ {priceEstimate}</p>}

            <div>
              <label className="block text-sm font-medium text-gray-700">Vehicle Type</label>
              <input
                type="text"
                value={vehicleType.replace(/([A-Z])/g, ' $1').trim()}
                disabled
                className="mt-1 px-4 py-2 border border-gray-300 bg-gray-100 rounded-lg w-full focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition duration-300"
            >
              Create Booking
            </button>
          </form>
        ) : (
          <></>
        )}

        {error && (
          <p className="mt-4 text-red-500 text-sm text-center">{error}</p>
        )}
      </div>
    </div>
  );
};

export default CreateBookingPage;
