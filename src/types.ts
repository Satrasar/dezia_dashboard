export interface Campaign {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'ended';
  budget: number;
  spent: number;
  clicks?: number;
  impressions?: number;
  conversions?: number;
  ctr?: number;
  cpc?: number;
  conversionRate?: number;
  aiScore: number;
  alerts: Alert[];
  startDate: string;
  endDate?: string;
  targetAudience: string;
  platform: 'google' | 'facebook' | 'instagram' | 'linkedin';
}

export interface Alert {
  id: string;
  type: 'warning' | 'error' | 'info';
  message: string;
  timestamp: string;
}

export interface KPIData {
  total_campaigns?: number;
  active_campaigns?: number;
  total_spent?: number;
  total_clicks?: number;
  total_impressions?: number;
  total_conversions?: number;
  avg_ctr?: number;
  ai_score_avg?: number;
  critical_alerts?: number;
}

export interface FormattedKPIData {
  cost?: {
    value: string;
    change: string;
  };
  clicks?: {
    value: string;
    change: string;
  };
  impressions?: {
    value: string;
    change: string;
  };
  conversions?: {
    value: string;
    change: string;
  };
}

export interface User {
  id: string;
  email: string;
  name?: string;
}