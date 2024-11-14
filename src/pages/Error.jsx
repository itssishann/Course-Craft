import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHome, FaArrowLeft } from 'react-icons/fa';

const Error = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800 px-4 text-center">
      <h1 className="text-6xl font-bold mb-4 text-red-500">404</h1>
      <h2 className="text-2xl font-semibold mb-4">Oops! Page Not Found</h2>
      <p className="text-lg mb-8">
        Sorry, the page you are looking for doesn't exist or has been moved.
      </p>

      <div className="flex gap-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center px-4 py-2  bg-gray-800 text-white rounded-md hover:bg-gray-700 transition"
        >
          <FaArrowLeft className="mr-2 hover:-translate-x-3 transition-all duration-200" />
          Go Back
        </button>

        <button
          onClick={() => navigate('/')}
          className="flex items-center px-4 py-2 bg-blue-200 transition-all duration-200 text-white rounded-md hover:bg-blue-100 "
        >
          <FaHome className="mr-2" />
          Home
        </button>
      </div>
    </div>
  );
};

export default Error;
