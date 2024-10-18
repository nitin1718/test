import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import axios from "axios";
import { FaTruck, FaMotorcycle, FaBicycle, FaCar, FaTruckPickup } from "react-icons/fa";

const AdminDashboard = () => {
  const { user, isAdmin } = useContext(AuthContext);
  const navigate = useNavigate();

  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [analytics, setAnalytics] = useState({});

  useEffect(() => {
    if (!isAdmin) {
      navigate("/"); // Redirect if not admin
    }
    fetchVehicles();
    fetchDrivers();
    fetchAnalytics();
  }, [isAdmin, navigate]);

  const fetchVehicles = async () => {
    try {
      const token = localStorage.getItem('token'); // Assuming you're storing the token in local storage
      const response = await fetch('http://localhost:5000/api/admin/vehicles', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json', // Optional, depending on your API
        },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
    //   console.log('Vehicles response:', data);
      setVehicles(data);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      setVehicles([]); // Reset to an empty array on error
    }
  };
  
  const fetchDrivers = async () => {
    try {
      const token = localStorage.getItem('token'); // Assuming the token is stored in local storage
      const response = await fetch('http://localhost:5000/api/admin/drivers', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json', // Optional, depending on your API
        },
      });
      console.log(response);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
    //   console.log('Drivers response:', data);
      setDrivers(data);
    } catch (error) {
      console.error('Error fetching drivers:', error.message);
      setDrivers([]); // Reset to an empty array on error
    }
  };
  
  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('token'); // Assuming the token is stored in local storage
      const response = await fetch('http://localhost:5000/api/admin/analytics', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json', // Optional, depending on your API
        },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
    //   console.log('Analytics response:', data);
      setAnalytics(data);
    } catch (error) {
      console.error('Error fetching analytics:', error.message);
    }
  };
  
  

  return (
    <main className="bg-gray-100">
      <article>
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h1 className="text-5xl font-extrabold mb-6">
                Admin Dashboard
              </h1>
              <p className="text-lg mb-8">
                Manage your fleet, monitor drivers, and analyze data effectively!
              </p>
            </div>
          </div>
        </section>

        {/* Fleet Management */}
        <div className="container mx-auto mt-12 px-4">
          <h2 className="text-center text-3xl font-semibold text-gray-800 mb-6">Fleet Management</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {vehicles.map(vehicle => (
              <li
                key={vehicle._id}
                className="bg-white p-6 text-center shadow-md rounded-lg"
              >
                <FaTruck className="text-indigo-600 mx-auto mb-4 text-4xl" />
                {vehicle.make} {vehicle.model}
                <p className="text-gray-500">{vehicle.status}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Driver Monitoring */}
        <div className="container mx-auto mt-12 px-4">
          <h2 className="text-center text-3xl font-semibold text-gray-800 mb-6">Driver Monitoring</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {drivers.map(driver => (
              <li
                key={driver._id}
                className="bg-white p-6 text-center shadow-md rounded-lg"
              >
                <FaMotorcycle className="text-indigo-600 mx-auto mb-4 text-4xl" />
                {driver.name}
                <p className="text-gray-500">{driver.status}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Data Analytics */}
        <div className="container mx-auto mt-12 px-4">
          <h2 className="text-center text-3xl font-semibold text-gray-800 mb-6">Analytics</h2>
          <div className="bg-white p-6 shadow-md rounded-lg text-center">
            <p>Total Trips: {analytics.totalTrips}</p>
            <p>Average Trip Time: {analytics.avgTripTime} minutes</p>
            <h3 className="text-xl font-semibold mt-4">Driver Performance</h3>
            <ul>
              {analytics.driverPerformance && analytics.driverPerformance.map(driver => (
                <li key={driver._id}>
                  {driver.name}: {driver.totalTrips} trips, Avg Time: {driver.avgTripTime} minutes
                </li>
              ))}
            </ul>
          </div>
        </div>
      </article>
    </main>
  );
};

export default AdminDashboard;
