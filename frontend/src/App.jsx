import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import RegisterPage from './components/RegisterPage';
import LoginPage from './components/LoginPage';
import CreateBookingPage from './components/CreateBookingPage';
import BookingHistoryPage from './components/BookingHistoryPage';
import CancelBookingPage from './components/CancelBookingPage';
import RegisterDriverPage from './components/RegisterDriverPage';
import LoginDriverPage from './components/LoginDriverPage';
import DriverDashboard from './components/DriverDashboard';
import HomePage from './components/Home';
import Navbar from './components/Navbar'; // Import Navbar
import UserProfile from './components/UserProfile';
import LiveTracking from './components/LiveTracking';
import AdminDashboard from './components/AdminDashboard';
import RegisterVehicle from './components/RegisterVehicle';
import BookingDriverSidePage from './components/BookingDriverSidePage';
import BookingHistoryDriverPage from './components/BookingHistoryDriverPage';
const App = () => {
  return (
    <AuthProvider>
      <Router>
        {/* Navbar will show on all pages */}
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/create-booking/:vehicleType" element={<CreateBookingPage />} /> 
          <Route path="/booking-history" element={<BookingHistoryPage />} />
          <Route path="/cancel-booking" element={<CancelBookingPage />} />
          <Route path="/driver-register" element={<RegisterDriverPage />} />
          <Route path="/driver-login" element={<LoginDriverPage />} />
          <Route path="/driver-dashboard" element={<DriverDashboard />} />
          <Route path="/live-tracking" element={<LiveTracking />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/registervehicle" element={<RegisterVehicle />} />
          <Route path="/active-requests" element={<BookingDriverSidePage />} />
          <Route path="/accepted-bookings" element={<BookingHistoryDriverPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
