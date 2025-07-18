import React, { useState, useEffect } from 'react';
import { History } from 'lucide-react';
import Header from './components/Header';
import StatsCards from './components/StatsCards';
import CampaignCard from './components/CampaignCard';
import FilterBar from './components/FilterBar';
import BudgetHistoryModal from './components/BudgetHistoryModal';
import LoadingSpinner from './components/LoadingSpinner';
import { getCampaigns, getStats, getBudgetHistory, refreshData } from './services/api';
import { Campaign, DashboardStats, BudgetHistory, FilterOptions } from './types';

function App() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    total_campaigns: 0,
    active_campaigns: 0,
    total_spend: 0,
    avg_ctr: 0,
    avg_performance_score: 0,
    critical_alerts: 0,
  });
  const [budgetHistory, setBudgetHistory] = useState<BudgetHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showBudgetHistory, setShowBudgetHistory] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({
    platform: '',
    status: '',
    alert_level: '',
  });

  const fetchData = async () => {
    try {
      const [campaignsData, statsData, historyData] = await Promise.all([
        getCampaigns(),
        getStats(),
        getBudgetHistory(),
      ]);

      setCampaigns(campaignsData);
      setStats(statsData);
      setBudgetHistory(historyData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshData();
      await fetchData();
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.campaign_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlatform = !filters.platform || campaign.platform === filters.platform;
    const matchesStatus = !filters.status || campaign.account_status === filters.status;
    const matchesAlertLevel = !filters.alert_level || campaign.alert_level === filters.alert_level;

    return matchesSearch && matchesPlatform && matchesStatus && matchesAlertLevel;
  });

  useEffect(() => {
    fetchData();
  }, []);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchData();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Header onRefresh={handleRefresh} isRefreshing={refreshing} />
      
      <main className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Stats Cards */}
          <StatsCards stats={stats} />

          {/* Filter Bar */}
          <FilterBar
            filters={filters}
            onFilterChange={setFilters}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />

          {/* Budget History Button */}
          <div className="flex justify-end mb-6">
            <button
              onClick={() => setShowBudgetHistory(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg hover:from-green-600 hover:to-blue-600 transition-all duration-300"
            >
              <History className="w-4 h-4" />
              <span>Bütçe Geçmişi</span>
            </button>
          </div>

          {/* Campaign Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredCampaigns.map((campaign) => (
              <CampaignCard key={campaign.campaign_id} campaign={campaign} />
            ))}
          </div>

          {filteredCampaigns.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg">
                {searchTerm || filters.platform || filters.status || filters.alert_level
                  ? 'Filtrelere uygun kampanya bulunamadı'
                  : 'Henüz kampanya bulunmuyor'}
              </div>
            </div>
          )}
        </div>
      </main>

      <BudgetHistoryModal
        history={budgetHistory}
        isOpen={showBudgetHistory}
        onClose={() => setShowBudgetHistory(false)}
      />
    </div>
  );
}

export default App;