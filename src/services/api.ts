import axios from 'axios';
import { Campaign, DashboardStats, BudgetHistory } from '../types';

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Mock data for demonstration - replace with actual n8n endpoints
const mockCampaigns: Campaign[] = [
  {
    campaign_id: 'camp_001',
    campaign_name: 'Yaz Kampanyası 2024',
    platform: 'Facebook',
    objective: 'CONVERSIONS',
    account_status: 'ACTIVE',
    daily_budget: 150,
    spend: 128.50,
    remaining_budget: 21.50,
    budget_usage: 85.67,
    impressions: 8500,
    clicks: 178,
    ctr: 2.1,
    cpc: 1.85,
    ctr_percentage: 2.1,
    performance_score: 78,
    risk_score: 25,
    trends: ['CTR artışı', 'CPC düşüşü'],
    anomalies: ['Beklenenden yüksek harcama'],
    ai_insights: ['Hedef kitle performansı iyi', 'Bütçe artırımı öneriliyor'],
    smart_recommendations: ['Günlük bütçeyi %20 artır', 'Benzer hedef kitle oluştur'],
    alerts: [
      {
        id: 'alert_001',
        type: 'BUDGET_HIGH',
        level: 'warning',
        message: 'Bütçe kullanımı %85\'i geçti',
        timestamp: '2024-01-15T10:30:00Z',
        priority: 'medium'
      }
    ],
    alert_type: 'BUDGET_HIGH',
    alert_level: 'warning',
    priority: 'medium',
    has_alert: true,
    current_budget: 150,
    new_budget: 180,
    budget_increase: 30,
    success_reasons: ['Yüksek CTR', 'Düşük CPC', 'İyi dönüşüm oranı']
  },
  {
    campaign_id: 'camp_002',
    campaign_name: 'Mobil Uygulama Tanıtımı',
    platform: 'Instagram',
    objective: 'APP_INSTALLS',
    account_status: 'ACTIVE',
    daily_budget: 200,
    spend: 89.25,
    remaining_budget: 110.75,
    budget_usage: 44.63,
    impressions: 6200,
    clicks: 112,
    ctr: 1.8,
    cpc: 2.10,
    ctr_percentage: 1.8,
    performance_score: 92,
    risk_score: 10,
    trends: ['Stabil performans', 'Hedef kitle genişlemesi'],
    anomalies: [],
    ai_insights: ['Mükemmel performans gösteriyor', 'Bütçe kullanımı optimal'],
    smart_recommendations: ['Mevcut stratejiyi sürdür', 'Lookalike audience dene'],
    alerts: [],
    alert_type: '',
    alert_level: 'normal',
    priority: 'low',
    has_alert: false,
    current_budget: 200,
    new_budget: 200,
    budget_increase: 0,
    success_reasons: ['Yüksek performans skoru', 'Düşük risk skoru']
  },
  {
    campaign_id: 'camp_003',
    campaign_name: 'E-ticaret Sonbahar',
    platform: 'Meta',
    objective: 'PURCHASE',
    account_status: 'PAUSED',
    daily_budget: 100,
    spend: 95.80,
    remaining_budget: 4.20,
    budget_usage: 95.80,
    impressions: 4100,
    clicks: 49,
    ctr: 1.2,
    cpc: 2.45,
    ctr_percentage: 1.2,
    performance_score: 45,
    risk_score: 85,
    trends: ['CTR düşüşü', 'CPC artışı'],
    anomalies: ['Anormal düşük performans', 'Yüksek harcama'],
    ai_insights: ['Kampanya optimize edilmeli', 'Hedef kitle değiştirilmeli'],
    smart_recommendations: ['Kampanyayı durdur', 'Kreatif değiştir', 'Hedef kitle daralt'],
    alerts: [
      {
        id: 'alert_002',
        type: 'PERFORMANCE_LOW',
        level: 'critical',
        message: 'Performans skoru kritik seviyede',
        timestamp: '2024-01-15T09:15:00Z',
        priority: 'high'
      },
      {
        id: 'alert_003',
        type: 'BUDGET_EXHAUSTED',
        level: 'critical',
        message: 'Bütçe neredeyse tükendi',
        timestamp: '2024-01-15T09:45:00Z',
        priority: 'high'
      }
    ],
    alert_type: 'PERFORMANCE_LOW',
    alert_level: 'critical',
    priority: 'high',
    has_alert: true,
    current_budget: 100,
    new_budget: 80,
    budget_increase: -20,
    success_reasons: []
  },
  {
    campaign_id: 'camp_004',
    campaign_name: 'Retargeting Kampanyası',
    platform: 'Facebook',
    objective: 'CONVERSIONS',
    account_status: 'ACTIVE',
    daily_budget: 75,
    spend: 45.30,
    remaining_budget: 29.70,
    budget_usage: 60.40,
    impressions: 2800,
    clicks: 90,
    ctr: 3.2,
    cpc: 1.45,
    ctr_percentage: 3.2,
    performance_score: 88,
    risk_score: 15,
    trends: ['Yüksek CTR', 'Düşük CPC'],
    anomalies: [],
    ai_insights: ['Retargeting çok etkili', 'Bütçe artırılabilir'],
    smart_recommendations: ['Bütçeyi %30 artır', 'Benzer kampanya oluştur'],
    alerts: [],
    alert_type: '',
    alert_level: 'normal',
    priority: 'low',
    has_alert: false,
    current_budget: 75,
    new_budget: 100,
    budget_increase: 25,
    success_reasons: ['Yüksek CTR', 'Düşük CPC', 'İyi hedef kitle']
  }
];

const mockStats: DashboardStats = {
  total_campaigns: 4,
  active_campaigns: 3,
  total_spend: 358.85,
  avg_ctr: 2.08,
  avg_performance_score: 75.75,
  critical_alerts: 2
};

const mockBudgetHistory: BudgetHistory[] = [
  {
    campaign_id: 'camp_001',
    campaign_name: 'Yaz Kampanyası 2024',
    old_budget: 120,
    new_budget: 150,
    increase_amount: 30,
    timestamp: '2024-01-15T08:00:00Z',
    reason: 'Yüksek performans nedeniyle otomatik artırım',
    success: true
  },
  {
    campaign_id: 'camp_004',
    campaign_name: 'Retargeting Kampanyası',
    old_budget: 50,
    new_budget: 75,
    increase_amount: 25,
    timestamp: '2024-01-14T14:30:00Z',
    reason: 'CTR hedefini aştığı için bütçe artırıldı',
    success: true
  }
];

// API functions - replace URLs with your n8n webhook endpoints
export const getCampaigns = async (): Promise<Campaign[]> => {
  try {
    // Replace with your n8n webhook URL
    // const response = await api.get('/n8n/campaigns');
    // return response.data;
    
    // Mock delay for demonstration
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockCampaigns;
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    throw error;
  }
};

export const getStats = async (): Promise<DashboardStats> => {
  try {
    // Replace with your n8n webhook URL
    // const response = await api.get('/n8n/stats');
    // return response.data;
    
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockStats;
  } catch (error) {
    console.error('Error fetching stats:', error);
    throw error;
  }
};

export const getBudgetHistory = async (): Promise<BudgetHistory[]> => {
  try {
    // Replace with your n8n webhook URL
    // const response = await api.get('/n8n/budget-history');
    // return response.data;
    
    await new Promise(resolve => setTimeout(resolve, 400));
    return mockBudgetHistory;
  } catch (error) {
    console.error('Error fetching budget history:', error);
    throw error;
  }
};

export const refreshData = async (): Promise<void> => {
  try {
    // Replace with your n8n webhook URL for data refresh
    // await api.post('/n8n/refresh');
    
    await new Promise(resolve => setTimeout(resolve, 1000));
  } catch (error) {
    console.error('Error refreshing data:', error);
    throw error;
  }
};