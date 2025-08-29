// n8n API servisi
export class N8nService {
  private baseUrl: string;
  private webhookUrl: string;

  constructor() {
    this.webhookUrl = '/api/n8n';
    this.baseUrl = 'https://ozlemkumtas.app.n8n.cloud/api/v1';
  }

  // Kampanya verilerini çek
  private async makeRequest(url: string, options: RequestInit = {}, retries: number = 2) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        console.log(`n8n API isteği (deneme ${attempt + 1}/${retries + 1}):`, url);
        
        const response = await fetch(url, {
          ...options,
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Cache-Control': 'no-cache',
            ...options.headers,
          },
        });

        clearTimeout(timeoutId);
        return response;
      } catch (error) {
        console.error(`n8n API deneme ${attempt + 1} başarısız:`, error);
        
        if (attempt === retries) {
          clearTimeout(timeoutId);
          if (error.name === 'AbortError') {
            throw new Error('Request timeout - n8n sunucusu yanıt vermiyor (30 saniye)');
          }
          if (error.message.includes('Failed to fetch')) {
            throw new Error('n8n sunucusuna bağlanılamıyor - Ağ bağlantısı veya CORS sorunu');
          }
          throw error;
        }
        
        // Wait before retry (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
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
          console.error('n8n hata detayı:', responseText?.substring(0, 500) || 'Boş hata yanıtı');
        } catch (e) {
          console.error('Hata detayı okunamadı:', e);
        }
        
        let errorMessage = `n8n API Hatası (${response.status}): ${response.statusText}`;
        if (response.status === 500) {
          errorMessage += ' - n8n workflow\'unda hata var. Lütfen n8n dashboard\'dan execution loglarını kontrol edin.';
        } else if (response.status === 404) {
          errorMessage += ' - Webhook URL\'i bulunamadı. Workflow aktif mi kontrol edin.';
        } else if (response.status >= 400 && response.status < 500) {
          errorMessage += ' - İstek formatı hatalı veya yetkilendirme sorunu.';
        }
        
        throw new Error(errorMessage);
      }

      try {
        responseText = await response.text();
        console.log('n8n ham yanıt:', responseText);
        
        // Check if response is empty or whitespace only
        if (!responseText || responseText.trim() === '') {
          console.warn('n8n boş yanıt döndürdü');
          // Return a default successful response structure for empty responses
          return {
            success: true,
            data: {
              campaigns: [],
              kpis: {},
              alerts: []
            },
            timestamp: new Date().toISOString(),
            message: 'n8n workflow boş yanıt döndürdü - varsayılan veriler kullanılıyor'
          };
        }

        // Check if response looks like JSON
        const trimmedResponse = responseText.trim();
        if (trimmedResponse.startsWith('{') || trimmedResponse.startsWith('[')) {
          data = JSON.parse(responseText);
        } else if (trimmedResponse.toLowerCase().includes('html') || trimmedResponse.startsWith('<!')) {
          console.warn('n8n HTML yanıtı döndürdü:', responseText.substring(0, 200));
          throw new Error('n8n HTML yanıtı döndürdü - Workflow URL\'i yanlış olabilir');
        } else if (trimmedResponse.includes('error') || trimmedResponse.includes('Error')) {
          console.warn('n8n hata mesajı döndürdü:', responseText);
          throw new Error(`n8n Workflow Hatası: ${responseText.substring(0, 100)}`);
        } else {
          console.warn('n8n geçersiz format döndürdü:', responseText.substring(0, 200));
          throw new Error('n8n geçersiz yanıt formatı - JSON bekleniyor ama farklı format alındı');
        }
      } catch (parseError) {
        console.error('JSON parse hatası:', parseError);
        console.error('Ham yanıt:', responseText?.substring(0, 500));
        
        if (parseError.message.includes('n8n')) {
          throw parseError; // Re-throw our custom errors
        }
        
        throw new Error(`n8n yanıtı JSON formatında değil: ${parseError.message}`);
      }

      console.log('n8n\'den gelen veri:', data);
      
      // n8n array response'unu kontrol et ve düzelt
      if (Array.isArray(data) && data.length > 0) {
        // n8n array döndürüyorsa ilk elemanı al
        data = data[0];
        console.log('n8n array response düzeltildi:', data);
      }
      
      // n8n response formatını kontrol et
      if (!data || (!data.success && !data.campaigns)) {
        console.warn('n8n response formatı beklenmedik:', data);
        // Eğer direkt kampanya verisi geliyorsa (eski format)
        if (data && data.campaigns && Array.isArray(data.campaigns)) {
          return {
            success: true,
            data: { 
              campaigns: data.campaigns,
              kpis: data.kpis || {},
              alerts: data.alerts || []
            },
            timestamp: new Date().toISOString()
          };
        } else {
          // Completely invalid response, return default structure
          return {
            success: true,
            data: {
              campaigns: [],
              kpis: {},
              alerts: []
            },
            timestamp: new Date().toISOString(),
            message: 'n8n geçersiz yanıt formatı - varsayılan veriler kullanılıyor'
          };
        }
      }

      // n8n'den gelen veriyi React formatına çevir
      if (data.success && data.campaigns) {
        return {
          success: true,
          data: {
            campaigns: data.campaigns,
            kpis: data.kpis || {},
            alerts: data.alerts || []
          },
          timestamp: data.timestamp || new Date().toISOString()
        };
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