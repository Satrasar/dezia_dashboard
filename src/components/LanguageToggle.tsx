import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';

const LanguageToggle: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const { isDark } = useTheme();

  return (
    <div className="relative">
      <button
        onClick={() => setLanguage(language === 'tr' ? 'en' : 'tr')}
        className={`flex items-center space-x-2 p-2 rounded-lg transition-colors ${
          isDark 
            ? 'hover:bg-gray-700 text-gray-300 hover:text-white' 
            : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
        }`}
        title={language === 'tr' ? 'Switch to English' : 'Türkçe\'ye geç'}
      >
        <Globe className="w-5 h-5" />
        <span className="text-sm font-medium uppercase">{language}</span>
      </button>
    </div>
  );
};

export default LanguageToggle;