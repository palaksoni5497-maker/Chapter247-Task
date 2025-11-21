'use client';

import React from 'react';
import { useAutoLogout } from '@/contexts/AutoLogoutContext';

const AutoLogoutModal: React.FC = () => {
  const { isWarningVisible, timeLeft, stayLoggedIn, logoutNow } = useAutoLogout();

  if (!isWarningVisible) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 mb-4">
            <svg
              className="h-6 w-6 text-yellow-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Session Timeout Warning
          </h3>
          
          <p className="text-sm text-gray-500 mb-4">
            You will be automatically logged out due to inactivity.
          </p>
          
          <div className="mb-6">
            <div className="text-3xl font-bold text-red-600 mb-2">
              {formatTime(timeLeft)}
            </div>
            <div className="text-sm text-gray-500">
              Time remaining before logout
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={stayLoggedIn}
              className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Stay Logged In
            </button>
            <button
              onClick={logoutNow}
              className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Logout Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutoLogoutModal;
