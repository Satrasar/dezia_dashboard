export interface Campaign {
  campaign_id: string;
  campaign_name: string;
  platform: 'Facebook' | 'Instagram' | 'Meta';
  objective: string;
  account_status: 'ACTIVE' | 'PAUSED' | 'DISABLED';
  daily_budget: number;
  spend: number;
  remaining_budget: number;
  budget_usage: number; // percentage
  impressions: number;
  clicks: number;
  ctr: number;
  cpc: number;
  ctr_percentage: number;
  performance_score: number;
  risk_score: number;
  trends: string[];
  anomalies: string[];
  ai_insights: string[];
  smart_recommendations: string[];
  alerts: Alert[];
  alert_type: string;
  alert_level: 'normal' | 'warning' | 'critical';
  priority: 'low' | 'medium' | 'high';
  has_alert: boolean;
  current_budget: number;
  new_budget: number;
  budget_increase: number;
  success_reasons: string[];
}

export interface Alert {
  id: string;
  type: string;
  level: 'normal' | 'warning' | 'critical';
  message: string;
  timestamp: string;
  priority: 'low' | 'medium' | 'high';
}

export interface DashboardStats {
  total_campaigns: number;
  active_campaigns: number;
  total_spend: number;
  avg_ctr: number;
  avg_performance_score: number;
  critical_alerts: number;
}

export interface BudgetHistory {
  campaign_id: string;
  campaign_name: string;
  old_budget: number;
  new_budget: number;
  increase_amount: number;
  timestamp: string;
  reason: string;
  success: boolean;
}

export interface FilterOptions {
  platform: string;
  status: string;
  alert_level: string;
}