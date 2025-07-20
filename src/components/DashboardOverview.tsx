import React, { useState } from 'react';
import { motion } from 'framer-motion';
import KPICards from './KPICards';
import FilterSection from './FilterSection';
import CampaignCards from './CampaignCards';
import ControlPanel from './ControlPanel';
import CampaignDetailModal from './CampaignDetailModal';
import GoogleAdsStyleCharts from './GoogleAdsStyleCharts';
import { Campaign } from '../types';

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
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <KPICards campaigns={campaigns} />
      
      <GoogleAdsStyleCharts />
      
      <FilterSection filters={filters} setFilters={setFilters} />
      
      <CampaignCards 
        campaigns={campaigns} 
        onToggleStatus={onToggleStatus}
        onViewDetails={setSelectedCampaign}
      />
      
      <ControlPanel />

      {selectedCampaign && (
        <CampaignDetailModal 
          campaign={selectedCampaign} 
          onClose={() => setSelectedCampaign(null)} 
        />
      )}
    </motion.div>
  );
};

export default DashboardOverview;