// n8n API servisi
export class N8nService {
  private baseUrl: string;
  private webhookUrl: string;

  constructor() {
    // n8n webhook URL'inizi buraya ekleyin
    this.webhookUrl = '/api/n8n';
    this.baseUrl = 'https://ozlemkumtas.app.n8n.cloud/api/v1';
  }

  // Kampanya verilerini çek
  async getCampaignData() {
    try {
      console.log('n8n API isteği gönderiliyor:', this.webhookUrl);
      
      const response = await fetch(this.webhookUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      console.log('n8n API yanıtı:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url
      });

      if (!response.ok) {
        // n8n'den gelen hata detaylarını al
        let errorDetails = '';
        try {
          const errorText = await response.text();
          console.error('n8n hata detayı:', errorText);
          errorDetails = errorText;
        } catch (e) {
          console.error('Hata detayı okunamadı:', e);
        }
        
        throw new Error(`n8n API Hatası (${response.status}): ${response.statusText}${errorDetails ? ' - ' + errorDetails : ''}`);
      }

      const data = await response.json();
      console.log('n8n'den gelen veri:', data);
      return data;
    } catch (error) {
      console.error('n8n API hatası:', error);
      
      // Ağ hatası mı yoksa n8n workflow hatası mı kontrol et
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('n8n sunucusuna bağlanılamıyor. Lütfen n8n instance\'ının çalıştığından emin olun.');
      }
      
      throw error;
    }
  }

  // Tek kampanya verisi çek
  async getCampaignById(campaignId: string) {
    try {
      const response = await fetch(`${this.webhookUrl}?campaign_id=${campaignId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();
      return data.data?.campaigns?.find((c: any) => c.id === campaignId);
    } catch (error) {
      console.error('Kampanya verisi çekme hatası:', error);
      throw error;
    }
  }

  // Manuel tetikleme
  async triggerWorkflow() {
    try {
      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ trigger: 'manual' })
      });

      return await response.json();
    } catch (error) {
      console.error('Workflow tetikleme hatası:', error);
      throw error;
    }
  }
}

export const n8nService = new N8nService();