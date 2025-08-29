import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { useN8nData } from './hooks/useN8nData';
import LoginPage from './components/LoginPage';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import DashboardOverview from './components/DashboardOverview';
import BudgetAnalysis from './components/BudgetAnalysis';
import PerformanceMetrics from './components/PerformanceMetrics';
import AutomatedActions from './components/AutomatedActions';
import AIRecommendations from './components/AIRecommendations';
import Reports from './components/Reports';
import Settings from './components/Settings';
import { Campaign } from './types';

const App: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { campaigns, kpis, formattedKpis, loading, error } = useN8nData();
  const [activeTab, setActiveTab] = useState('overview');
  const [filters, setFilters] = useState({
    search: '',
    platform: 'all',
    status: 'all',
    alertLevel: 'all'
  });

  // Mock function for toggling campaign status
  const handleToggleStatus = (id: number) => {
    console.log('Toggle status for campaign:', id);
    // This would typically make an API call to update the campaign status
  };

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <Header />
        <div className="flex">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          <main className="flex-1 ml-64 p-8">
            <Routes>
              <Route 
                path="/" 
                element={
                  <DashboardOverview 
                    campaigns={campaigns || []}
                    filters={filters}
                    setFilters={setFilters}
                    onToggleStatus={handleToggleStatus}
                  />
                } 
              />
              <Route 
                path="/budget" 
                element={
                  <BudgetAnalysis 
                    campaigns={campaigns || []}
                  />
                } 
              />
              <Route 
                path="/performance" 
                element={
                  <PerformanceMetrics 
                    campaigns={campaigns || []}
                  />
                } 
              />
              <Route 
                path="/automation" 
                element={
                  <AutomatedActions 
                    campaigns={campaigns || []}
                  />
                } 
              />
              <Route 
                path="/ai-recommendations" 
                element={
                  <AIRecommendations 
                    campaigns={campaigns || []}
                  />
                } 
              />
              <Route 
                path="/reports" 
                element={
                  <Reports 
                    campaigns={campaigns || []}
                  />
                } 
              />
              <Route 
                path="/settings" 
                element={<Settings />} 
              />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
};

export default App;