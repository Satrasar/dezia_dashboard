import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-gray-900 flex items-center justify-center z-50">
      <div className="flex flex-col items-center space-y-6">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-gray-700 rounded-full animate-spin"></div>
          <div className="absolute top-0 left-0 w-20 h-20 border-4 border-transparent border-t-blue-500 rounded-full animate-spin"></div>
          <div className="absolute top-2 left-2 w-16 h-16 border-4 border-transparent border-t-purple-500 rounded-full animate-spin" style={{ animationDirection: 'reverse' }}></div>
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold text-white mb-2">Dezia Ads Dashboard</h2>
          <p className="text-gray-400">Veriler yükleniyor...</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;