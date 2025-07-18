import React, { useState, useEffect } from 'react';
import { RefreshCw, Settings, Bell, User } from 'lucide-react';

interface HeaderProps {
  onRefresh: () => void;
  isRefreshing: boolean;
}

const Header: React.FC<HeaderProps> = ({ onRefresh, isRefreshing }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <header className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 shadow-2xl border-b border-gray-700">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-lg">D</span>
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Dezia Ads Dashboard
                </h1>
                <p className="text-gray-300 text-sm">
                  Facebook Reklam Otomasyonu
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <div className="text-right">
              <div className="text-lg font-semibold text-white">
                {currentTime.toLocaleTimeString('tr-TR')}
              </div>
              <div className="text-sm text-gray-300">
                {currentTime.toLocaleDateString('tr-TR', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={onRefresh}
                disabled={isRefreshing}
                className={`p-3 rounded-xl bg-gray-700 hover:bg-gray-600 transition-all duration-300 ${
                  isRefreshing ? 'animate-spin' : ''
                }`}
              >
                <RefreshCw className="w-5 h-5 text-white" />
              </button>

              <button className="p-3 rounded-xl bg-gray-700 hover:bg-gray-600 transition-all duration-300 relative">
                <Bell className="w-5 h-5 text-white" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                  3
                </span>
              </button>

              <button className="p-3 rounded-xl bg-gray-700 hover:bg-gray-600 transition-all duration-300">
                <Settings className="w-5 h-5 text-white" />
              </button>

              <div className="flex items-center space-x-3 pl-3 border-l border-gray-600">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="text-sm">
                  <div className="font-semibold text-white">
                    Admin User
                  </div>
                  <div className="text-gray-300">
                    Dezia Team
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;