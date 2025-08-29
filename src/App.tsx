import React from 'react';
import { Campaign } from '../types';
import { TrendingUp, Activity, DollarSign, MousePointer, Brain, AlertTriangle } from 'lucide-react';

interface KPICardsProps {
  campaigns: Campaign[];
  kpis?: any;
  formattedKpis?: any;
}

const KPICards: React.FC<KPICardsProps> = ({ campaigns, kpis, formattedKpis }) => {
  // n8n'den gelen gerçek KPI verilerini kullan, yoksa hesapla
  const totalCampaigns = kpis?.total_campaigns || campaigns.length;
  const activeCampaigns = kpis?.active_campaigns || campaigns.filter(c => c.status === 'active').length;
  const totalSpent = kpis?.total_spent || campaigns.reduce((sum, c) => sum + c.spent, 0);
  const totalClicks = kpis?.total_clicks || campaigns.reduce((sum, c) => sum + (c.clicks || 0), 0);
  const totalImpressions = kpis?.total_impressions || campaigns.reduce((sum, c) => sum + (c.impressions || 0), 0);
  const totalConversions = kpis?.total_conversions || campaigns.reduce((sum, c) => sum + (c.conversions || 0), 0);
  
  // CTR hesaplama: n8n'den gelen avg_ctr kullan
  const averageCTR = kpis?.avg_ctr || (totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0);
  
  const averageAiScore = kpis?.ai_score_avg || (campaigns.length > 0 
    ? campaigns.reduce((sum, c) => sum + c.aiScore, 0) / campaigns.length 
    : 0);
  const criticalAlerts = kpis?.critical_alerts || campaigns.reduce((sum, c) => sum + c.alerts.length, 0);

  // Değerleri formatla
  const formatNumber = (num: number) => {
    if (formattedKpis) return num.toString(); // n8n zaten formatlamış
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toFixed(0);
  };

  const formatCurrency = (num: number) => {
    if (num >= 1000) return `₺${(num / 1000).toFixed(1)}K`;
    return `₺${num.toFixed(2)}`;
  };

  const cards = [
    {
      title: 'Toplam Kampanya',
      value: totalCampaigns.toString(),
      icon: TrendingUp,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-500/20',
      borderColor: 'border-blue-500/30'
    },
    {
      title: 'Aktif Kampanya',
      value: activeCampaigns.toString(),
      icon: Activity,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-500/20',
      borderColor: 'border-green-500/30'
    },
    {
      title: 'Toplam Maliyet',
      value: formatCurrency(totalSpent),
      icon: DollarSign,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-500/20',
      borderColor: 'border-orange-500/30'
    },
    {
      title: 'CTR Oranı',
      value: `%${averageCTR.toFixed(2)}`,
      icon: MousePointer,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-500/20',
      borderColor: 'border-purple-500/30'
    },
    {
      title: 'AI Performans Skoru',
      value: `${Math.round(averageAiScore)}`,
      icon: Brain,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-500/20',
      borderColor: 'border-blue-500/30'
    },
    {
      title: 'Kritik Uyarılar',
      value: criticalAlerts.toString(),
      icon: AlertTriangle,
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-500/20',
      borderColor: 'border-red-500/30'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`${card.bgColor} ${card.borderColor} border backdrop-blur-sm rounded-xl p-4 hover:scale-105 transition-all duration-300 cursor-pointer group`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300 text-sm font-medium mb-2">{card.title}</p>
              <p className="text-3xl font-bold text-white">{card.value}</p>
            </div>
            <div className={`p-4 rounded-xl bg-gradient-to-r ${card.color} group-hover:scale-110 transition-transform shadow-lg`}>
              <card.icon className="w-7 h-7 text-white" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default KPICards;