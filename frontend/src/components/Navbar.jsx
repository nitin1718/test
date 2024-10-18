import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Navbar = () => {
  const { user, isDriver, logout, isUser } = useContext(AuthContext);
  console.log(user)
  // console.log(isDriver)

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between">
        <h1 className="text-white font-bold">Logistics Platform</h1>
        <ul className="flex space-x-4">
          <li>
            <Link to="/" className="text-white">Home</Link>
          </li>
          {!isUser && !isDriver ? (
            <>


              <li>
                <Link to="/register" className="text-white">Register</Link>
              </li>
              <li>
                <Link to="/login" className="text-white">Login</Link>
              </li>
            </>
          ) : (


            (
              isDriver ? (
                // Navbar for Drivers

                <>
                  <li>
                    <Link to="/driver-dashboard" className="text-white">Driver Dashboard</Link>
                  </li>
                  <li>
                    <Link to="/active-requests" className="text-white">Active Requests</Link>
                  </li>
                  <li>
                    <Link to="/accepted-bookings" className="text-white">Manage Bookings</Link>
                  </li>
                  <li>
                    <button onClick={logout} className="text-white">Logout</button>
                  </li>
                </>
              ) : (
                // Navbar for Regular Users
                <>
                  <li>
                    <Link to="/profile" className="text-white">Profile</Link>
                  </li>
                  <li>
                    <Link to="/booking-history" className="text-white">Booking History</Link>
                  </li>
                  <li>
                    <button onClick={logout} className="text-white">Logout</button>
                  </li>
                </>
              )
            )


          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;