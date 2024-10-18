import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import axios from 'axios';

const BookingHistoryPage = () => {
  const { user, isDriver } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]); // Ensure initial state is an array
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/bookings/history', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        console.log('API Response:', res.data); // Log the response to ensure it's an array
        if (Array.isArray(res.data)) {
          setBookings(res.data);
        } else {
          console.error('Expected an array but got:', res.data);
        }
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };
    fetchBookings();
  }, [user]);

  const handleBookingClick = (booking) => {
    setSelectedBooking(booking);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">Booking History</h2>

      {/* Booking Details View */}
      {selectedBooking ? (
        <div className="bg-white shadow-lg rounded-lg p-8 mb-8 max-w-xl mx-auto">
          <h3 className="text-2xl font-bold mb-6 text-indigo-600">Booking Details</h3>
          <div className="space-y-4">
            <p className="text-gray-700">
              <strong>Pickup Location:</strong> {selectedBooking.pickupLocation}
            </p>
            <p className="text-gray-700">
              <strong>Drop-off Location:</strong> {selectedBooking.dropOffLocation}
            </p>
            <p className="text-gray-700">
              <strong>Status:</strong> {selectedBooking.status}
            </p>
            <p className="text-gray-700">
              <strong>Booking ID:</strong> {selectedBooking._id}
            </p>
            <p className="text-gray-700">
              <strong>Date:</strong> {new Date(selectedBooking.createdAt).toLocaleString()}
            </p>

            {/* Driver details */}
            {selectedBooking.driverId ? (
              <>
                <h4 className="text-xl font-bold text-indigo-600 mt-6">Driver Details</h4>
                <p className="text-gray-700">
                  <strong>Name:</strong> {selectedBooking.driverId.name}
                </p>
                <p className="text-gray-700">
                  <strong>Email:</strong> {selectedBooking.driverId.email}
                </p>
                <p className="text-gray-700">
                  <strong>Contact Number:</strong> {selectedBooking.driverId.phone}
                </p>
              </>
            ) : (
              <p className="text-red-500 mt-4">Driver details not available.</p>
            )}
          </div>

          <button
            onClick={() => setSelectedBooking(null)}
            className="mt-6 w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition duration-300"
          >
            Back to Bookings
          </button>
        </div>
      ) : (
        // Booking List View
        <ul role="list" className="divide-y divide-gray-200 max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8">
          {bookings.length === 0 ? (
            <p className="text-center text-gray-600">No bookings found.</p>
          ) : (
            bookings.map((booking) => (
              <li
                key={booking._id}
                className="flex justify-between gap-x-6 py-5 cursor-pointer hover:bg-indigo-50 transition duration-300 rounded-lg"
                onClick={() => handleBookingClick(booking)}
              >
                <div className="flex min-w-0 gap-x-4">
                  <div className="h-12 w-12 flex-none rounded-full bg-indigo-200 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {booking.pickupLocation.charAt(0)}
                    </span>
                  </div>
                  <div className="min-w-0 flex-auto">
                    <p className="text-sm font-semibold text-gray-900">
                      {booking.pickupLocation} to {booking.dropOffLocation}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">Booking ID: {booking._id}</p>
                  </div>
                </div>
                <div className="hidden sm:flex sm:flex-col sm:items-end">
                  <p className="text-sm text-gray-900">{booking.status}</p>
                  <p className="mt-1 text-xs text-gray-500">
                    Date: {new Date(booking.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
};

export default BookingHistoryPage;
