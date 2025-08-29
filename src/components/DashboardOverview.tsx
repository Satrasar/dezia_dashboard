import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Campaign } from '../types';
import { useN8nData } from '../hooks/useN8nData';
import KPICards from './KPICards';
import GoogleAdsStyleCharts from './GoogleAdsStyleCharts';
import OverviewCharts from './OverviewCharts';
import FilterSection from './FilterSection';
import CampaignCards from './CampaignCards';
import CampaignDetailModal from './CampaignDetailModal';

interface DashboardOverviewProps {
  campaigns: Campaign[];
  filters: {
    search: string;
    platform: string;
    status: string;
    alertLevel: string;
  };
  setFilters: (filters: any) => void;
  onToggleStatus: (id: number) => void;
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({ 
  campaigns, 
  filters, 
  setFilters, 
  onToggleStatus 
}) => {
  const { kpis, formattedKpis, loading, error } = useN8nData();
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);

  const handleViewDetails = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
  };

  const handleCloseModal = () => {
    setSelectedCampaign(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Google Ads Style Charts - n8n'den gelen gerçek veriler */}
      <GoogleAdsStyleCharts campaigns={campaigns} formattedKpis={formattedKpis} kpis={kpis} />

      {/* KPI Cards */}
      <KPICards campaigns={campaigns} kpis={kpis} formattedKpis={formattedKpis} />

      {/* Filter Section */}
      <FilterSection filters={filters} setFilters={setFilters} />

      {/* Overview Charts */}
      <OverviewCharts campaigns={campaigns} />

      {/* Campaign Cards */}
      <CampaignCards 
        campaigns={campaigns} 
        onToggleStatus={onToggleStatus}
        onViewDetails={handleViewDetails}
      />

      {/* Campaign Detail Modal */}
      {selectedCampaign && (
        <CampaignDetailModal 
          campaign={selectedCampaign} 
          onClose={handleCloseModal}
        />
      )}
    </motion.div>
  );
};

export default DashboardOverview;