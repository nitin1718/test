import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import AuthContext from "../context/AuthContext";
import axios from 'axios';

const HomePage = () => {
  const { user, isDriver } = useContext(AuthContext);
  const navigate = useNavigate(); // Initialize useNavigate
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [driverTrips, setDriverTrips] = useState([]); // Driver-specific state to manage trips

  // Fetch vehicle data for customers
  const fetchVehicleData = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/vehicles', {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setVehicles(res.data);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    }
  };

  // Fetch trips assigned to the driver
  const fetchDriverTrips = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/driver-trips', {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setDriverTrips(res.data);
    } catch (error) {
      console.error('Error fetching driver trips:', error);
    }
  };

  // Function to handle vehicle click and navigate using license plate (for customers)
  const handleVehicleClick = (licensePlate) => {
    navigate(`/create-booking/${licensePlate}`); // Navigate to create-booking page with licensePlate
  };

  // Function to handle trip click (for drivers)
  const handleTripClick = (tripId) => {
    navigate(`/trip-details/${tripId}`); // Navigate to trip details page with tripId
  };

  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [locationName, setLocationName] = useState('');

  const sendLocationToBackend = async (lat, lng) => {
    try {
      await axios.post(
        'http://localhost:5000/api/location/live-update',
        { latitude: lat, longitude: lng },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
    } catch (error) {
      console.error('Error updating live location', error);
    }
  };

  // Reverse geocoding to get location name using Nominatim API
  const getLocationName = async (lat, lng) => {
    try {
      const res = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`
      );
      const location = res.data.display_name; // Get the location name
      setLocationName(location); // Set location name in state
    } catch (error) {
      console.error('Error fetching location name', error);
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLatitude(latitude);
          setLongitude(longitude);

          // Send live location to the server every time it updates
          sendLocationToBackend(latitude, longitude);

          // Get the human-readable location name
          getLocationName(latitude, longitude);
        },
        (error) => {
          console.error('Error getting position', error);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );

      // Clean up the geolocation watcher on component unmount
      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, []);


  return (
    <main className="bg-gray-100">
      <article>
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <p className="text-lg font-semibold mb-4 uppercase tracking-wide">
                Welcome to Our Delivery Service
              </p>
              <h1 className="text-5xl font-extrabold mb-6 leading-snug animate-pulse">
                Wherever you need, we <span className="italic text-yellow-400">deliver</span>.
              </h1>
              <p className="text-lg mb-8">
                Choose from a variety of vehicles and experience seamless deliveries at every turn. Your convenience, our priority!
              </p>

              <div className="flex justify-center space-x-4">
                <a href="#" className="bg-yellow-400 text-indigo-600 hover:bg-yellow-500 py-2 px-6 rounded-md font-semibold transition transform hover:scale-105">
                  Learn More
                </a>
                <button className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-indigo-600 py-2 px-6 rounded-md font-semibold transition transform hover:scale-105">
                  <span>How it Works</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* User-specific sections */}
        {!isDriver ? (
          // Section for customers
          <div className="container mx-auto mt-12 px-4">
            <h2 className="text-center text-3xl font-semibold text-gray-800 mb-6">Choose Your Vehicle</h2>

            <div className="text-center mb-6">
              <button
                onClick={fetchVehicleData}
                className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700"
              >
                {loading ? 'Loading...' : 'Fetch Vehicle Data'}
              </button>
            </div>

            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              {vehicles.map(vehicle => (
                <li key={vehicle._id} className="bg-white p-6 text-center shadow-md rounded-lg cursor-pointer hover:bg-indigo-50 transition transform hover:scale-105" onClick={() => handleVehicleClick(vehicle.licensePlate)}>
                  <p><strong>License Plate:</strong> {vehicle.licensePlate}</p>
                  <p><strong>Type:</strong> {vehicle.type}</p>
                  <p><strong>Capacity:</strong> {vehicle.capacity}</p>
                  <p><strong>Status:</strong> {vehicle.status}</p>
                  <p><strong>Verification Status:</strong> {vehicle.verificationStatus}</p>
                  <p><strong>Driver ID:</strong> {vehicle.driverId ? vehicle.driverId.name : 'N/A'}</p>
                  <p><strong>Created At:</strong> {new Date(vehicle.createdAt).toLocaleDateString()}</p>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          // Section for drivers
          <div className="container mx-auto mt-12 px-4">
          <h2>Live Tracking</h2>
      {latitude && longitude ? (
        <div>
          <p>Latitude: {latitude}, Longitude: {longitude}</p>
          {locationName && <p>Location: {locationName}</p>}
        </div>
      ) : (
        <p>Getting your location...</p>
      )}
            {/* <h2 className="text-center text-3xl font-semibold text-gray-800 mb-6">Your Assigned Trips</h2> */}

            {/* <div className="text-center mb-6">
              <button
                onClick={fetchDriverTrips}
                className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700"
              >
                {loading ? 'Loading...' : 'Fetch Your Trips'}
              </button>
            </div> */}
{/* 
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              {driverTrips.map(trip => (
                <li key={trip._id} className="bg-white p-6 text-center shadow-md rounded-lg cursor-pointer hover:bg-indigo-50 transition transform hover:scale-105" onClick={() => handleTripClick(trip._id)}>
                  <p><strong>Trip ID:</strong> {trip._id}</p>
                  <p><strong>Pickup Location:</strong> {trip.pickupLocation}</p>
                  <p><strong>Dropoff Location:</strong> {trip.dropoffLocation}</p>
                  <p><strong>Status:</strong> {trip.status}</p>
                  <p><strong>Scheduled Date:</strong> {new Date(trip.scheduledDate).toLocaleDateString()}</p>
                </li>
              ))}
            </ul> */}
          </div>
        )}
      </article>
    </main>
  );
};

export default HomePage;
