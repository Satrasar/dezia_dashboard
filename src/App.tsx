import React, { useState, useEffect } from 'react';
import { useAuth } from './contexts/AuthContext';
import { useTheme } from './contexts/ThemeContext';
import { useN8nData } from './hooks/useN8nData';
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
import AICreativeStudio from './components/AICreativeStudio';
import MetaAdsPublisher from './components/MetaAdsPublisher';
import { Campaign } from './types';

function App() {
  const { isAuthenticated } = useAuth();
  const { isDark } = useTheme();
  const { campaigns, kpis, alerts, loading, error, refresh } = useN8nData();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState('overview');
  const [filters, setFilters] = useState({
    search: '',
    platform: '',
    status: '',
    alertLevel: ''
  });

  // Login kontrolü
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const toggleCampaignStatus = (id: number) => {
    // n8n üzerinden kampanya durumunu değiştir
    // Bu fonksiyon n8n workflow'una POST request gönderecek
    console.log('Kampanya durumu değiştiriliyor:', id);
    // Burada n8n API'sine istek gönderebilirsiniz
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
      case 'ai-creative':
        return <AICreativeStudio />;
      case 'meta-ads-publish':
        return <MetaAdsPublisher />;
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
          
          {loading && (
            <div className="p-6">
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <span className="ml-2">Veriler yükleniyor...</span>
              </div>
            </div>
          )}
          
          {error && (
            <div className="p-6">
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                <strong>Hata:</strong> {error}
                <button 
                  onClick={refresh}
                  className="ml-4 bg-red-500 text-white px-3 py-1 rounded text-sm"
                >
                  Tekrar Dene
                </button>
              </div>
            </div>
          )}
          
          <main className="p-6 space-y-6">
            {renderCurrentPage()}
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;