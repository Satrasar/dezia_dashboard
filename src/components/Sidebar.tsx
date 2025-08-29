import React from 'react';
import { 
  Home, 
  TrendingUp, 
  DollarSign, 
  Target, 
  Zap, 
  Brain,
  BarChart3, 
  Settings,
  ChevronLeft,
  Activity,
  Palette,
  Megaphone
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  currentPage: string;
  onPageChange: (page: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle, currentPage, onPageChange }) => {
  const { isDark } = useTheme();

  const menuItems = [
    { icon: Home, label: 'Genel Bakış', page: 'overview' },
    { icon: Palette, label: 'AI Görsel Oluşturma', page: 'ai-creative' },
    { icon: Megaphone, label: 'Meta Ads Yayınla', page: 'meta-ads-publish' },
    { icon: DollarSign, label: 'Bütçe Analizi', page: 'budget' },
    { icon: Target, label: 'Performans Metrikleri', page: 'performance' },
    { icon: Zap, label: 'Otomatik Eylemler', page: 'automation' },
    { icon: Brain, label: 'AI Önerileri', page: 'ai-recommendations' },
    { icon: BarChart3, label: 'Raporlar', page: 'reports' },
    { icon: Settings, label: 'Ayarlar', page: 'settings' },
  ];

  return (
    <div className={`fixed left-0 top-0 h-full transition-all duration-300 z-50 ${
      isDark 
        ? 'bg-gray-800 border-r border-gray-700' 
        : 'bg-white border-r border-gray-200'
    } ${
      isOpen ? 'w-64' : 'w-16'
    }`}>
      {/* Header */}
      <div className={`p-4 border-b ${
        isDark ? 'border-gray-700' : 'border-gray-200'
      }`}>
        <div className="flex items-center justify-between">
          {isOpen && (
            <div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">D</span>
                </div>
                <div>
                  <h1 className={`text-lg font-bold ${
                    isDark ? 'text-blue-400' : 'text-blue-600'
                  }`}>
                    Dezia Digital
                  </h1>
                  <p className={`text-xs ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    n8n Otomasyonu ile Güçlendirilmiş
                  </p>
                </div>
              </div>
            </div>
          )}
          <button
            onClick={onToggle}
            className={`p-2 rounded-lg transition-colors ${
              isDark 
                ? 'hover:bg-gray-700 text-gray-300' 
                : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            <ChevronLeft 
              className={`w-5 h-5 transition-transform ${isOpen ? '' : 'rotate-180'}`} 
            />
          </button>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="p-4 space-y-2">
        {menuItems.map((item, index) => (
          <button
            key={index}
            onClick={() => onPageChange(item.page)}
            className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors group ${
              currentPage === item.page
                ? isDark 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-blue-100 text-blue-700'
                : isDark 
                  ? 'text-gray-400 hover:bg-gray-700 hover:text-white'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            <item.icon className="w-5 h-5" />
            {isOpen && <span className="text-sm font-medium">{item.label}</span>}
          </button>
        ))}
      </nav>

      {/* Status */}
      {isOpen && (
        <div className="absolute bottom-4 left-4 right-4">
          <div className={`rounded-lg p-3 ${
            isDark 
              ? 'bg-green-600/20 border border-green-600/30' 
              : 'bg-green-50 border border-green-200'
          }`}>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className={`text-sm font-medium ${
                isDark ? 'text-green-400' : 'text-green-700'
              }`}>
                Otomatik Sistem
              </span>
            </div>
            <p className={`text-xs mt-1 ${
              isDark ? 'text-green-300' : 'text-green-600'
            }`}>
              Aktif ve Çalışıyor
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;