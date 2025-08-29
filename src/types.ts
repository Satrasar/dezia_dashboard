export interface Campaign {
  id: number;
  name: string;
  platform: 'facebook' | 'instagram';
  objective: string;
  status: 'active' | 'paused';
  budget: number;
  spent: number;
  ctr: number;
  cpc: number;
  aiScore: number;
  alerts: string[];
  lastUpdated: Date;
  // Yeni gerçek veriler
  impressions?: number;
  clicks?: number;
  conversions?: number;
}

export interface KPIData {
  totalCampaigns: number;
  activeCampaigns: number;
  totalSpent: number;
  averageCTR: number;
  aiScore: number;
  criticalAlerts: number;
  // Yeni KPI'lar
  totalClicks?: number;
  totalImpressions?: number;
  totalConversions?: number;
}