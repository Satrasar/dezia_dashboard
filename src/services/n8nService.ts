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
      const response = await fetch(this.webhookUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('n8n API hatası:', error);
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