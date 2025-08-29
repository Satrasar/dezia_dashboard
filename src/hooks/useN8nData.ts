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
      
      console.log('Kampanya verisi çekiliyor...');
      const response = await n8nService.getCampaignData();
      console.log('n8n servis yanıtı:', response);
      
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
          kpis: response.data.kpis || {},
          alerts: response.data.alerts || [],
          loading: false,
          error: null,
          lastUpdate: response.timestamp
        });
      } else {
        const errorMsg = response.error || response.message || 'n8n workflow başarısız yanıt döndürdü';
        console.error('n8n workflow hatası:', response);
        throw new Error(`n8n Workflow Hatası: ${errorMsg}`);
      }
    } catch (error) {
      console.error('Veri çekme hatası:', error);
      
      let userFriendlyError = 'Bilinmeyen hata';
      
      if (error instanceof Error) {
        if (error.message.includes('n8n API Hatası (500)')) {
          userFriendlyError = 'n8n workflow\'unda hata oluştu. Lütfen n8n dashboard\'undan workflow loglarını kontrol edin.';
        } else if (error.message.includes('bağlanılamıyor')) {
          userFriendlyError = 'n8n sunucusuna erişilemiyor. Sunucu durumunu kontrol edin.';
        } else {
          userFriendlyError = error.message;
        }
      }
      
      setData(prev => ({
        ...prev,
        loading: false,
        error: userFriendlyError
      }));
    }
  };

  // Otomasyon eylemlerini tetikle
  const triggerAutomation = async (action: string, data: any) => {
    try {
      const response = await fetch('/api/n8n', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action,
          ...data
        })
      });
      
      return response.ok;
    } catch (error) {
      console.error('Otomasyon tetikleme hatası:', error);
      return false;
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
    refresh: fetchData,
    triggerAutomation
  };
};