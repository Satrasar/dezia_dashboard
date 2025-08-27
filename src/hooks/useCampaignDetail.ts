import { useState, useEffect } from 'react';
import { campaignService } from '../services/campaignService';
import { Campaign } from '../types';

export const useCampaignDetail = (campaignId: string) => {
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCampaign = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await campaignService.getCampaign(campaignId);
      setCampaign(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bilinmeyen hata');
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async () => {
    if (!campaign) return false;

    try {
      const success = await campaignService.toggleCampaignStatus(campaignId);
      if (success) {
        // Veriyi yenile
        await fetchCampaign();
      }
      return success;
    } catch (error) {
      console.error('Durum değiştirme hatası:', error);
      return false;
    }
  };

  useEffect(() => {
    if (campaignId) {
      fetchCampaign();
    }
  }, [campaignId]);

  return {
    campaign,
    loading,
    error,
    refresh: fetchCampaign,
    toggleStatus
  };
};