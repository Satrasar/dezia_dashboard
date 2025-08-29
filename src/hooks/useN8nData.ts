import { useState, useEffect } from 'react';
import { n8nService } from '../services/n8nService';
import { Campaign } from '../types';

interface N8nResponse {
  success: boolean;
  timestamp: string;
  kpis: {
    total_campaigns: number;
    active_campaigns: number;
    paused_campaigns: number;
    pending_campaigns: number;
    total_budget: number;
    total_spent: number;
    total_impressions: number;
    total_clicks: number;
    total_conversions: number;
    avg_ctr: number;
    avg_cpc: number;
    critical_alerts: number;
    budget_usage_avg: number;
    ai_score_avg: number;
  };
  formatted_kpis: {
    clicks: { value: string; raw_value: number; trend: string; change_percent: string; color: string };
    impressions: { value: string; raw_value: number; trend: string; change_percent: string; color: string };
    conversions: { value: string; raw_value: number; trend: string; change_percent: string; color: string };
    cost: { value: string; raw_value: number; trend: string; change_percent: string; color: string };
  };
  campaigns: any[];
  alerts: any[];
  stats: {
    total_items_processed: number;
    active_rate: number;
    alert_count: number;
    critical_alert_count: number;
    has_real_data: boolean;
  };
  meta: {
    version: string;
    source: string;
    facebook_connected: boolean;
    data_sources: string[];
  };
}

export const useN8nData = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [kpis, setKpis] = useState<any>({});
  const [formattedKpis, setFormattedKpis] = useState<any>({});
  const [alerts, setAlerts] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({});
  const [meta, setMeta] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('n8n verisi çekiliyor...');
      const response = await n8nService.getCampaignData();
      
      if (!response.success) {
        throw new Error('n8n Workflow Hatası: ' + (response.error || 'Bilinmeyen hata'));
      }

      console.log('n8n yanıtı alındı:', response);

      // n8n'den gelen gerçek veri yapısını kullan
      const n8nData = response.data as N8nResponse;

      // Kampanyaları dönüştür
      const transformedCampaigns: Campaign[] = (n8nData.campaigns || []).map((camp: any) => ({
        id: parseInt(camp.id) || Math.random(),
        name: camp.name || camp.campaign_name || 'Bilinmeyen Kampanya',
        platform: (camp.platform?.toLowerCase() === 'facebook' ? 'facebook' : 'instagram') as 'facebook' | 'instagram',
        objective: camp.objective || 'Belirtilmemiş',
        status: camp.status === 'ACTIVE' ? 'active' : 'paused' as 'active' | 'paused',
        budget: camp.daily_budget || 0,
        spent: camp.spent || 0,
        ctr: (camp.ctr || 0) * 100, // n8n'de decimal, frontend'de percentage
        cpc: camp.cpc || 0,
        aiScore: camp.ai_score || camp.performance_score || 0,
        alerts: camp.hasAlert ? [`Bütçe %${(camp.budget_usage || 0).toFixed(1)} doldu`] : [],
        lastUpdated: new Date(camp.last_updated || Date.now()),
        // Yeni gerçek veriler
        impressions: camp.impressions || 0,
        clicks: camp.clicks || 0,
        conversions: camp.conversions || 0,
      }));

      console.log('Dönüştürülmüş kampanyalar:', transformedCampaigns);

      setCampaigns(transformedCampaigns);
      setKpis(n8nData.kpis || {});
      setFormattedKpis(n8nData.formatted_kpis || {});
      setAlerts(n8nData.alerts || []);
      setStats(n8nData.stats || {});
      setMeta(n8nData.meta || {});
      setLastUpdate(n8nData.timestamp);

    } catch (err) {
      console.error('Veri çekme hatası:', err);
      setError(err instanceof Error ? err.message : 'Bilinmeyen hata');
      
      // Fallback veriler - n8n bağlantısı olmadığında
      setCampaigns([{
        id: 1,
        name: 'n8n Bağlantısı Bekleniyor...',
        platform: 'facebook',
        objective: 'Bağlantı Testi',
        status: 'paused',
        budget: 0,
        spent: 0,
        ctr: 0,
        cpc: 0,
        aiScore: 0,
        alerts: ['n8n workflow bağlantısı kurulamadı'],
        lastUpdated: new Date(),
        impressions: 0,
        clicks: 0,
        conversions: 0,
      }]);
      
      setKpis({
        total_campaigns: 0,
        active_campaigns: 0,
        total_spent: 0,
        total_clicks: 0,
        total_impressions: 0,
        total_conversions: 0,
        avg_ctr: 0,
        avg_cpc: 0,
        ai_score_avg: 0,
        critical_alerts: 1
      });
      
      setFormattedKpis({
        clicks: { value: '0', raw_value: 0, trend: 'down', change_percent: '0%', color: '#4F84FF' },
        impressions: { value: '0', raw_value: 0, trend: 'down', change_percent: '0%', color: '#FF6B6B' },
        conversions: { value: '0', raw_value: 0, trend: 'down', change_percent: '0%', color: '#FFB946' },
        cost: { value: '$0', raw_value: 0, trend: 'down', change_percent: '0%', color: '#51CF66' }
      });
      
    } finally {
      setLoading(false);
    }
  };

  const refresh = () => {
    fetchData();
  };

  useEffect(() => {
    fetchData();
    
    // 30 saniyede bir otomatik güncelleme
    const interval = setInterval(fetchData, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return {
    campaigns,
    kpis,
    formattedKpis,
    alerts,
    stats,
    meta,
    loading,
    error,
    lastUpdate,
    refresh
  };
};