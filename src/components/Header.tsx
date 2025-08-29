import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import LanguageToggle from './LanguageToggle';
import ThemeToggle from './ThemeToggle';
import { Bell, Settings, User, LogOut } from 'lucide-react';

const Header: React.FC = () => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const { user, logout } = useAuth();

  return (
    <header className={`${theme === 'dark' ? 'bg-gray-900/95' : 'bg-white/95'} backdrop-blur-sm border-b ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'} sticky top-0 z-50`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {t('dashboard')}
              </h1>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Language Toggle */}
            <LanguageToggle />
            
            {/* Theme Toggle */}
            <ThemeToggle />
            
            {/* Notifications */}
            <button className={`p-2 rounded-lg ${theme === 'dark' ? 'text-gray-300 hover:text-white hover:bg-gray-800' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'} transition-colors`}>
              <Bell className="w-5 h-5" />
            </button>
            
            {/* Settings */}
            <button className={`p-2 rounded-lg ${theme === 'dark' ? 'text-gray-300 hover:text-white hover:bg-gray-800' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'} transition-colors`}>
              <Settings className="w-5 h-5" />
            </button>
            
            {/* User Menu */}
            <div className="flex items-center space-x-3">
              <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                <User className="w-5 h-5" />
                <span className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {user?.email || 'User'}
                </span>
              </div>
              
              <button 
                onClick={logout}
                className={`p-2 rounded-lg ${theme === 'dark' ? 'text-gray-300 hover:text-white hover:bg-gray-800' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'} transition-colors`}
                title={t('logout')}
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;