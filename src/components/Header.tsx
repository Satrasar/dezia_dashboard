import React, { useState, useEffect } from 'react';
import { Bell, Settings, User, ChevronDown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import ThemeToggle from './ThemeToggle';

const Header: React.FC = () => {
  const { logout, user } = useAuth();
  const { isDark } = useTheme();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDateTime = (date: Date) => {
    const timeStr = date.toLocaleTimeString('tr-TR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    const dateStr = date.toLocaleDateString('tr-TR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    return { timeStr, dateStr };
  };

  const { timeStr, dateStr } = formatDateTime(currentTime);

  return (
    <header className={`border-b px-6 py-4 ${
      isDark 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-gray-200'
    }`}>
      <div className="flex items-center justify-between">
        {/* Left */}
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">D</span>
          </div>
          <h1 className={`text-xl font-semibold ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Dezia Ads Dashboard
          </h1>
        </div>

        {/* Center - Real-time clock */}
        <div className="text-center">
          <div className={`text-2xl font-mono font-bold ${
            isDark ? 'text-blue-400' : 'text-blue-600'
          }`}>
            {timeStr}
          </div>
          <div className={`text-sm capitalize ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {dateStr}
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center space-x-4">
          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Notifications */}
          <div className="relative">
            <button className={`p-2 rounded-lg transition-colors relative ${
              isDark 
                ? 'hover:bg-gray-700 text-gray-300' 
                : 'hover:bg-gray-100 text-gray-600'
            }`}>
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </button>
          </div>

          {/* Settings */}
          <button className={`p-2 rounded-lg transition-colors ${
            isDark 
              ? 'hover:bg-gray-700 text-gray-300' 
              : 'hover:bg-gray-100 text-gray-600'
          }`}>
            <Settings className="w-5 h-5" />
          </button>

          {/* User Profile */}
          <div className="relative">
            <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className={`flex items-center space-x-2 p-2 rounded-lg transition-colors ${
                isDark 
                  ? 'hover:bg-gray-700 text-gray-300' 
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <ChevronDown className="w-4 h-4" />
            </button>

            {showUserDropdown && (
              <div className={`absolute right-0 top-full mt-2 w-48 rounded-lg shadow-xl z-50 ${
                isDark 
                  ? 'bg-gray-800 border border-gray-700' 
                  : 'bg-white border border-gray-200'
              }`}>
                <div className={`p-3 border-b ${
                  isDark ? 'border-gray-700' : 'border-gray-200'
                }`}>
                  <p className={`font-medium ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    {user?.name}
                  </p>
                  <p className={`text-sm ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {user?.email}
                  </p>
                </div>
                <div className="p-2">
                  <button className={`w-full text-left p-2 rounded text-sm transition-colors ${
                    isDark 
                      ? 'hover:bg-gray-700 text-gray-300' 
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}>
                    Profil
                  </button>
                  <button className={`w-full text-left p-2 rounded text-sm transition-colors ${
                    isDark 
                      ? 'hover:bg-gray-700 text-gray-300' 
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}>
                    Ayarlar
                  </button>
                  <button 
                    onClick={logout}
                    className={`w-full text-left p-2 rounded text-sm text-red-400 transition-colors ${
                      isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                    }`}
                  >
                    Çıkış Yap
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;