import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { 
  BarChart3, 
  Target, 
  Settings, 
  FileText, 
  Zap, 
  Brain,
  Home,
  TrendingUp
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { t } = useLanguage();
  const { theme } = useTheme();

  const menuItems = [
    { id: 'overview', label: t('overview'), icon: Home },
    { id: 'campaigns', label: t('campaigns'), icon: Target },
    { id: 'performance', label: t('performance'), icon: TrendingUp },
    { id: 'reports', label: t('reports'), icon: FileText },
    { id: 'automation', label: t('automation'), icon: Zap },
    { id: 'ai-recommendations', label: t('aiRecommendations'), icon: Brain },
    { id: 'settings', label: t('settings'), icon: Settings },
  ];

  return (
    <aside className={`${theme === 'dark' ? 'bg-gray-900/95' : 'bg-white/95'} backdrop-blur-sm border-r ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'} w-64 min-h-screen sticky top-16`}>
      <div className="p-6">
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                activeTab === item.id
                  ? `${theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'} shadow-lg`
                  : `${theme === 'dark' ? 'text-gray-300 hover:text-white hover:bg-gray-800' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;