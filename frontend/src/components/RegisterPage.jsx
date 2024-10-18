import React, { useState } from 'react';
import RegisterUserPage from './RegisterUserPage';
import RegisterDriverPage from './RegisterDriverPage';

const RegisterPage = () => {
  const [role, setRole] = useState('user');  // Default to 'user'

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-green-50 flex flex-col items-center justify-center p-6">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-lg p-8 mb-8">
        <h2 className="text-3xl font-semibold text-center text-indigo-600 mb-6">Register</h2>
        
        <form className="flex flex-col items-center mb-6">
          <label htmlFor="role" className="text-lg font-medium text-gray-700 mb-2">Register as:</label>
          
          <select
            id="role"
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            onChange={(e) => setRole(e.target.value)}
            value={role}
          >
            <option value="user">User</option>
            <option value="driver">Driver</option>
          </select>
        </form>

        {/* Conditional rendering based on selected role */}
        {role === 'user' ? <RegisterUserPage /> : <RegisterDriverPage />}
      </div>
    </div>
  );
};

export default RegisterPage;
