// n8n API servisi
export class N8nService {
  private baseUrl: string;
  private webhookUrl: string;

  constructor() {
    this.webhookUrl = '/api/n8n';
    this.baseUrl = 'https://ozlemkumtas.app.n8n.cloud/api/v1';
  }

  // Kampanya verilerini çek
  private async makeRequest(url: string, options: RequestInit = {}) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error('Request timeout - n8n sunucusu yanıt vermiyor');
      }
      throw error;
    }
  }

  async getCampaignData() {
    try {
      console.log('n8n API isteği gönderiliyor:', this.webhookUrl);
      
      let data;
      let responseText;
      
      const response = await this.makeRequest(this.webhookUrl, {
        method: 'GET',
      });

      console.log('n8n API yanıtı:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
        headers: Object.fromEntries(response.headers.entries())
      });

      if (!response.ok) {
        try {
          responseText = await response.text();
          console.error('n8n hata detayı:', responseText);
        } catch (e) {
          console.error('Hata detayı okunamadı:', e);
        }
        console.error('n8n API hata yanıtı:', responseText || 'Yanıt okunamadı');
        throw new Error(`n8n API Hatası (${response.status}): ${response.statusText}`);
      }

      try {
        responseText = await response.text();
        console.log('n8n ham yanıt:', responseText);
        
        // Check if response is JSON
        if (responseText.trim().startsWith('{') || responseText.trim().startsWith('[')) {
          data = JSON.parse(responseText);
        } else {
          // If not JSON, check if it's an email response (Gmail API response)
          if (responseText.includes('"id"') && responseText.includes('"threadId"')) {
            console.warn('n8n Gmail API yanıtı alındı, kampanya verisi bekleniyor');
            throw new Error('n8n workflow yanlış yanıt döndürdü - Gmail API yanıtı alındı');
          }
          throw new Error('n8n geçersiz JSON yanıtı döndürdü');
        }
      } catch (parseError) {
        console.error('JSON parse hatası:', parseError);
        throw new Error('n8n yanıtı JSON formatında değil');
      }

      console.log('n8n\'den gelen veri:', data);
      
      // n8n response formatını kontrol et
      if (!data.success && !data.data) {
        console.warn('n8n response formatı beklenmedik:', data);
        // Eğer direkt kampanya verisi geliyorsa
        if (Array.isArray(data)) {
          return {
            success: true,
            data: { campaigns: data },
            timestamp: new Date().toISOString()
          };
        }
      }

      // Validate response structure
      if (!data || typeof data !== 'object') {
        throw new Error('n8n geçersiz veri yapısı döndürdü');
      }

      // Check if it's a Gmail response instead of campaign data
      if (data.id && data.threadId && data.labelIds) {
        console.warn('Gmail API yanıtı tespit edildi:', data);
        throw new Error('n8n workflow yanlış yanıt döndürdü - Gmail API yanıtı alındı');
      }

      console.log('n8n\'den gelen geçerli veri:', data);
      return data;
    } catch (error) {
      console.error('n8n API hatası:', error);
      
      if (error.message.includes('Failed to fetch')) {
        throw new Error('n8n sunucusuna bağlanılamıyor - CORS veya ağ hatası');
      } else if (error.message.includes('Gmail API')) {
        throw new Error('n8n workflow yanlış yanıt döndürdü - Kampanya verisi yerine email yanıtı alındı');
      } else {
        throw new Error(`n8n Workflow Hatası: ${error.message}`);
      }
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

  // Otomasyon eylemlerini tetikle
  async triggerAutomation(action: string, data: any) {
    try {
      const response = await this.makeRequest(this.webhookUrl, {
        method: 'POST',
        body: JSON.stringify({
          action,
          ...data,
          timestamp: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error(`n8n otomasyon hatası (${response.status}): ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Otomasyon tetikleme hatası:', error);
      throw error;
    }
  }
}

export const n8nService = new N8nService();