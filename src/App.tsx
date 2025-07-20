import React, { useState, useEffect } from 'react';
import { useAuth } from './contexts/AuthContext';
import { useTheme } from './contexts/ThemeContext';
import LoginPage from './components/LoginPage';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardOverview from './components/DashboardOverview';
import BudgetAnalysis from './components/BudgetAnalysis';
import PerformanceMetrics from './components/PerformanceMetrics';
import AutomatedActions from './components/AutomatedActions';
import AIRecommendations from './components/AIRecommendations';
import Reports from './components/Reports';
import Settings from './components/Settings';
import { Campaign } from './types';

function App() {
  const { isAuthenticated } = useAuth();
  const { isDark } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState('overview');
  const [filters, setFilters] = useState({
    search: '',
    platform: '',
    status: '',
    alertLevel: ''
  });
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: 1,
      name: "Yaz Kampanyası 2024",
      platform: "facebook",
      objective: "CONVERSIONS",
      status: "active",
      budget: 150.00,
      spent: 128.50,
      ctr: 2.10,
      cpc: 1.85,
      aiScore: 78,
      alerts: ["Bütçe kullanımı %85'i geçti"],
      lastUpdated: new Date()
    },
    {
      id: 2,
      name: "Mobil Uygulama Tanıtımı",
      platform: "instagram",
      objective: "APP_INSTALLS",
      status: "active",
      budget: 200.00,
      spent: 89.25,
      ctr: 1.80,
      cpc: 2.10,
      aiScore: 92,
      alerts: [],
      lastUpdated: new Date()
    },
    {
      id: 3,
      name: "E-ticaret Sonbahar",
      platform: "facebook",
      objective: "PURCHASE",
      status: "paused",
      budget: 100.00,
      spent: 95.80,
      ctr: 1.20,
      cpc: 2.45,
      aiScore: 45,
      alerts: ["Performans skoru kritik seviyede", "Bütçe neredeyse tükendi"],
      lastUpdated: new Date()
    }
  ]);

  // Login kontrolü
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const toggleCampaignStatus = (id: number) => {
    setCampaigns(prev => prev.map(campaign => 
      campaign.id === id 
        ? { ...campaign, status: campaign.status === 'active' ? 'paused' : 'active' }
        : campaign
    ));
  };

  const renderCurrentPage = () => {
    const filteredCampaigns = campaigns.filter(campaign => {
      const matchesSearch = campaign.name.toLowerCase().includes(filters.search.toLowerCase());
      const matchesPlatform = filters.platform === '' || campaign.platform === filters.platform;
      const matchesStatus = filters.status === '' || campaign.status === filters.status;
      const matchesAlertLevel = filters.alertLevel === '' || 
        (filters.alertLevel === 'critical' && campaign.alerts.length > 1) ||
        (filters.alertLevel === 'warning' && campaign.alerts.length === 1) ||
        (filters.alertLevel === 'normal' && campaign.alerts.length === 0);
      
      return matchesSearch && matchesPlatform && matchesStatus && matchesAlertLevel;
    });

    switch (currentPage) {
      case 'overview':
        return <DashboardOverview campaigns={filteredCampaigns} filters={filters} setFilters={setFilters} onToggleStatus={toggleCampaignStatus} />;
      case 'budget':
        return <BudgetAnalysis campaigns={filteredCampaigns} />;
      case 'performance':
        return <PerformanceMetrics campaigns={filteredCampaigns} />;
      case 'automation':
        return <AutomatedActions />;
      case 'ai-recommendations':
        return <AIRecommendations campaigns={filteredCampaigns} />;
      case 'reports':
        return <Reports campaigns={filteredCampaigns} />;
      case 'settings':
        return <Settings />;
      default:
        return <DashboardOverview campaigns={filteredCampaigns} filters={filters} setFilters={setFilters} onToggleStatus={toggleCampaignStatus} />;
    }
  };

  return (
    <div className={`min-h-screen transition-colors ${
      isDark 
        ? 'bg-gray-900 text-white' 
        : 'bg-gray-50 text-gray-900'
    }`}>
      <div className="flex">
        <Sidebar 
          isOpen={sidebarOpen} 
          onToggle={() => setSidebarOpen(!sidebarOpen)}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
        
        <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
          <Header />
          
          <main className="p-6 space-y-6">
            {renderCurrentPage()}
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;