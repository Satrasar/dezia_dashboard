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
      
      if (!response.success && response.data?.alerts?.length > 0) {
        console.warn('n8n bağlantı uyarısı:', response.data.alerts[0].message);
      }
      
      if (response.success) {
        // n8n'den gelen veriyi React state formatına çevir
        const campaigns: Campaign[] = (response.data?.campaigns || []).map((camp: any) => ({
          id: camp.id,
          name: camp.name || '',
          platform: (camp.platform || 'facebook') as 'facebook' | 'instagram',
          objective: camp.objective || '',
          status: camp.status === 'ACTIVE' ? 'active' : 'paused',
          budget: camp.daily_budget || camp.budget || 0,
          spent: camp.spent || camp.cost || 0,
          ctr: camp.ctr_percentage || (camp.ctr || 0) * 100,
          cpc: camp.cpc || camp.cost_per_click || 0,
          aiScore: camp.performance_score || camp.ai_score || 50,
          alerts: camp.alert_level === 'critical' ? ['Kritik uyarı var'] : [],
          lastUpdated: camp.last_updated ? new Date(camp.last_updated) : new Date(),
          // Yeni gerçek veriler
          impressions: camp.impressions || 0,
          clicks: camp.clicks || 0,
          conversions: camp.conversions || 0
        }));

        setData({
          campaigns,
          kpis: {
            ...response.data?.kpis,
            // n8n'den gelen gerçek toplam veriler
            total_clicks: response.data?.kpis?.total_clicks || campaigns.reduce((sum, c) => sum + (c.clicks || 0), 0),
            total_impressions: response.data?.kpis?.total_impressions || campaigns.reduce((sum, c) => sum + (c.impressions || 0), 0),
            total_conversions: response.data?.kpis?.total_conversions || campaigns.reduce((sum, c) => sum + (c.conversions || 0), 0),
            total_spent: response.data?.kpis?.total_spent || campaigns.reduce((sum, c) => sum + c.spent, 0)
          },
          alerts: response.data?.alerts || [],
          loading: false,
          error: null,
          lastUpdate: response.timestamp
        });
      } else {
        const errorMsg = response?.error || response?.message || 'n8n workflow başarısız yanıt döndürdü';
        console.error('n8n workflow hatası:', response);
        throw new Error(`n8n Workflow Hatası: ${errorMsg}`);
      }
    } catch (error) {
      console.error('Veri çekme hatası:', error);
      setData(prev => ({
        ...prev,
        loading: false,
        error: 'n8n bağlantı sorunu - Fallback veriler kullanılıyor'
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
      
        
        // Provide user-friendly error messages
        let userMessage = 'Bilinmeyen hata oluştu';
        if (err.message.includes('Gmail API') || err.message.includes('email yanıtı')) {
          userMessage = 'n8n workflow yanlış yapılandırılmış - Dashboard Data node\'u aktif değil';
        } else if (err.message.includes('CORS') || err.message.includes('bağlanılamıyor')) {
          userMessage = 'n8n sunucusuna bağlanılamıyor - CORS ayarlarını kontrol edin';
        } else if (err.message.includes('timeout')) {
          userMessage = 'n8n sunucusu yanıt vermiyor - Workflow aktif mi kontrol edin';
        } else if (err.message.includes('JSON')) {
          userMessage = 'n8n geçersiz yanıt döndürdü - Workflow yapılandırmasını kontrol edin';
        } else {
          userMessage = err.message;
        }
        
        setError(`Veri çekme hatası: ${userMessage}`);
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