import React, { useContext } from 'react';
import AuthContext from '../context/AuthContext';

const UserProfile = () => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <p className="text-lg text-red-600">Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-600 to-indigo-800 py-12">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-cover bg-center h-56" style={{ backgroundImage: 'url(/path-to-background.jpg)' }}>
          <div className="flex items-center justify-center h-full bg-black bg-opacity-50">
            <h1 className="text-white text-3xl font-bold">Welcome, {user.name}!</h1>
          </div>
        </div>
        <div className="p-8">
          <div className="flex items-center justify-center -mt-16">
            <img
              className="h-32 w-32 rounded-full border-4 border-white shadow-lg"
              src="/path-to-avatar.jpg"
              alt="User Avatar"
            />
          </div>
          <div className="text-center mt-6">
            <h2 className="text-2xl font-semibold text-gray-800">{user.name}</h2>
            <p className="text-gray-600">{user.email}</p>
          </div>
          <div className="mt-8 flex justify-center space-x-4">
            <button className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition duration-300">
              Edit Profile
            </button>
            <button className="bg-gray-300 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-400 transition duration-300">
              Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
