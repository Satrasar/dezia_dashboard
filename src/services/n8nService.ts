// n8n API servisi
export class N8nService {
  private baseUrl = 'https://n8n.dezia.xyz';
  private webhookPath = '/webhook/56c93b71-b493-432c-a7c0-4dea2bd97771';
  private maxRetries = 2;
  private retryDelay = 1000;

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async makeRequest(attempt: number = 1): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

    try {
      const response = await fetch(`${this.baseUrl}${this.webhookPath}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (attempt < this.maxRetries) {
        console.log(`n8n istek denemesi ${attempt} başarısız, ${this.retryDelay}ms sonra tekrar denenecek...`);
        await this.delay(this.retryDelay * attempt);
        return this.makeRequest(attempt + 1);
      }
      
      throw error;
    }
  }

  async getCampaignData(): Promise<N8nResponse> {
    try {
      console.log('n8n API çağrısı başlatılıyor...', `${this.baseUrl}${this.webhookPath}`);
      
      const response = await this.makeRequest();

      console.log('n8n API yanıt durumu:', response.status);
      console.log('n8n API yanıt headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        return this.handleErrorResponse(response);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.warn('n8n API JSON olmayan yanıt döndürdü, fallback veriler kullanılacak');
        return this.getFallbackData();
      }

      const rawData = await response.text();
      console.log('n8n API ham yanıt uzunluğu:', rawData.length);

      if (!rawData || rawData.trim() === '') {
        console.warn('n8n API boş yanıt döndürdü, fallback veriler kullanılacak');
        return this.getFallbackData();
      }

      return this.parseResponse(rawData);

    } catch (error) {
      console.error('n8n API genel hatası:', error);
      return this.getFallbackData();
    }
  }

  private async handleErrorResponse(response: Response): Promise<N8nResponse> {
    let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    
    if (response.status === 500) {
      errorMessage += ' - n8n workflow\'unda hata var. CORS header\'larını ve node yapılandırmasını kontrol edin.';
    } else if (response.status === 404) {
      errorMessage += ' - Webhook URL\'i bulunamadı. n8n workflow\'unun aktif olduğundan emin olun.';
    } else if (response.status === 403) {
      errorMessage += ' - Erişim reddedildi. n8n workflow izinlerini kontrol edin.';
    }
    
    console.error('n8n API hatası:', errorMessage);
    return this.getFallbackData();
  }

  private parseResponse(rawData: string): N8nResponse {
    try {
      const parsedData = JSON.parse(rawData);
      console.log('n8n API başarılı yanıt alındı');

      // n8n array döndürüyorsa ilk elemanı al
      const data = Array.isArray(parsedData) ? parsedData[0] : parsedData;

      return {
        success: true,
        data: {
          campaigns: data.campaigns || [],
          kpis: data.kpis || {},
          alerts: data.alerts || []
        },
        alerts: data.alerts || [],
        timestamp: data.timestamp || new Date().toISOString()
      };
    } catch (parseError) {
      console.error('n8n API yanıt parse hatası:', parseError);
      return this.getFallbackData();
    }
  }

  private getFallbackData(): N8nResponse {
    console.log('Fallback veriler kullanılıyor...');
    return {
      success: false,
      data: {
        campaigns: [{
          id: 'fallback_campaign',
          name: 'n8n Bağlantısı Bekleniyor...',
          platform: 'facebook',
          status: 'UNKNOWN',
          daily_budget: 0,
          spent: 0,
          ctr: 0,
          cpc: 0,
          impressions: 0,
          clicks: 0
        }],
        kpis: {},
        alerts: [{
          id: 'connection_warning',
          message: 'n8n workflow bağlantısı kurulamadı. Lütfen n8n dashboard\'ı kontrol edin.',
          type: 'warning'
        }]
      },
      timestamp: new Date().toISOString()
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