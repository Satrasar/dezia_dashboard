import React from 'react';
import { Campaign } from '../types';
import { TrendingUp, Activity, DollarSign, MousePointer, Brain, AlertTriangle } from 'lucide-react';

interface KPICardsProps {
  campaigns: Campaign[];
}

const KPICards: React.FC<KPICardsProps> = ({ campaigns }) => {
  const totalCampaigns = campaigns.length;
  const activeCampaigns = campaigns.filter(c => c.status === 'active').length;
  const totalSpent = campaigns.reduce((sum, c) => sum + c.spent, 0);
  const averageCTR = campaigns.reduce((sum, c) => sum + c.ctr, 0) / campaigns.length;
  const averageAiScore = campaigns.reduce((sum, c) => sum + c.aiScore, 0) / campaigns.length;
  const criticalAlerts = campaigns.reduce((sum, c) => sum + c.alerts.length, 0);

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
      title: 'Toplam Harcama',
      value: `₺${totalSpent.toFixed(2)}`,
      icon: DollarSign,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-500/20',
      borderColor: 'border-orange-500/30'
    },
    {
      title: 'Ortalama CTR',
      value: `%${averageCTR.toFixed(2)}`,
      icon: MousePointer,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-500/20',
      borderColor: 'border-purple-500/30'
    },
    {
      title: 'AI Performans Skoru',
      value: `${Math.round(averageAiScore)}/100`,
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
              <p className="text-gray-300 text-sm font-medium mb-1">{card.title}</p>
              <p className="text-2xl font-bold text-white">{card.value}</p>
            </div>
            <div className={`p-3 rounded-lg bg-gradient-to-r ${card.color} group-hover:scale-110 transition-transform`}>
              <card.icon className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default KPICards;