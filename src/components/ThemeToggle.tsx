import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-lg transition-colors ${
        isDark 
          ? 'hover:bg-gray-700 text-gray-300 hover:text-white' 
          : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
      }`}
      title={isDark ? 'Açık temaya geç' : 'Koyu temaya geç'}
    >
      {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  );
};

export default ThemeToggle;