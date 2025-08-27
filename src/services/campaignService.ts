import { n8nService } from './n8nService';
import { Campaign } from '../types';

export class CampaignService {
  private cache = new Map<string, { data: Campaign; timestamp: number }>();
  private cacheTimeout = 60000; // 1 dakika cache

  // Tek kampanya verisi çek (cache ile)
  async getCampaign(campaignId: string): Promise<Campaign | null> {
    const cached = this.cache.get(campaignId);
    const now = Date.now();

    // Cache kontrolü
    if (cached && (now - cached.timestamp) < this.cacheTimeout) {
      return cached.data;
    }

    try {
      const campaignData = await n8nService.getCampaignById(campaignId);
      
      if (campaignData) {
        const campaign: Campaign = {
          id: parseInt(campaignData.id),
          name: campaignData.name,
          platform: campaignData.platform as 'facebook' | 'instagram',
          objective: campaignData.objective,
          status: campaignData.status === 'ACTIVE' ? 'active' : 'paused',
          budget: campaignData.daily_budget,
          spent: campaignData.spent,
          ctr: campaignData.ctr * 100,
          cpc: campaignData.cpc,
          aiScore: campaignData.ai_score || 0,
          alerts: campaignData.alerts || [],
          lastUpdated: new Date(campaignData.last_updated)
        };

        // Cache'e kaydet
        this.cache.set(campaignId, { data: campaign, timestamp: now });
        return campaign;
      }

      return null;
    } catch (error) {
      console.error('Kampanya verisi çekme hatası:', error);
      return null;
    }
  }

  // Kampanya durumunu değiştir
  async toggleCampaignStatus(campaignId: string): Promise<boolean> {
    try {
      // n8n webhook'una POST request gönder
      const response = await fetch(n8nService.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'toggle_status',
          campaign_id: campaignId
        })
      });

      if (response.ok) {
        // Cache'i temizle
        this.cache.delete(campaignId);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Kampanya durumu değiştirme hatası:', error);
      return false;
    }
  }

  // Cache temizle
  clearCache() {
    this.cache.clear();
  }
}

export const campaignService = new CampaignService();