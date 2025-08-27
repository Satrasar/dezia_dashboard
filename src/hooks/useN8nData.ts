import { useState, useEffect } from 'react';
import { n8nService } from '../services/n8nService';
import { Campaign } from '../types';

interface N8nData {
  campaigns: Campaign[];
  kpis: any;
  alerts: any[];
  loading: boolean;
  error: string | null;
  lastUpdate: string | null;
}

export const useN8nData = (refreshInterval: number = 300000) => { // 5 dakika
  const [data, setData] = useState<N8nData>({
    campaigns: [],
    kpis: null,
    alerts: [],
    loading: true,
    error: null,
    lastUpdate: null
  });

  const fetchData = async () => {
    try {
      setData(prev => ({ ...prev, loading: true, error: null }));
      
      const response = await n8nService.getCampaignData();
      
      if (response.success) {
        // n8n'den gelen veriyi React state formatına çevir
        const campaigns: Campaign[] = response.data.campaigns.map((camp: any) => ({
          id: camp.id,
          name: camp.name,
          platform: camp.platform as 'facebook' | 'instagram',
          objective: camp.objective,
          status: camp.status === 'ACTIVE' ? 'active' : 'paused',
          budget: camp.daily_budget,
          spent: camp.spent,
          ctr: camp.ctr * 100, // n8n'de decimal, UI'da yüzde
          cpc: camp.cpc,
          aiScore: camp.ai_score,
          alerts: camp.alert_level === 'critical' ? ['Kritik uyarı var'] : [],
          lastUpdated: new Date(camp.last_updated)
        }));

        setData({
          campaigns,
          kpis: response.data.kpis,
          alerts: response.data.alerts,
          loading: false,
          error: null,
          lastUpdate: response.timestamp
        });
      } else {
        throw new Error('API yanıtı başarısız');
      }
    } catch (error) {
      console.error('Veri çekme hatası:', error);
      setData(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Bilinmeyen hata'
      }));
    }
  };

  // İlk yükleme
  useEffect(() => {
    fetchData();
  }, []);

  // Otomatik yenileme
  useEffect(() => {
    const interval = setInterval(fetchData, refreshInterval);
    return () => clearInterval(interval);
  }, [refreshInterval]);

  return {
    ...data,
    refresh: fetchData
  };
};