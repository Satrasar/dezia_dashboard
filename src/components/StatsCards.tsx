import React from 'react';
import { Target, TrendingUp, DollarSign, AlertTriangle, Brain, Activity } from 'lucide-react';
import { DashboardStats } from '../types';

interface StatsCardsProps {
  stats: DashboardStats;
}

const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  const cards = [
    {
      title: 'Toplam Kampanya',
      value: stats.total_campaigns,
      icon: Target,
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-500/10 to-blue-600/10',
      iconColor: 'text-blue-400',
    },
    {
      title: 'Aktif Kampanya',
      value: stats.active_campaigns,
      icon: TrendingUp,
      gradient: 'from-green-500 to-green-600',
      bgGradient: 'from-green-500/10 to-green-600/10',
      iconColor: 'text-green-400',
    },
    {
      title: 'Toplam Harcama',
      value: `₺${stats.total_spend.toFixed(2)}`,
      icon: DollarSign,
      gradient: 'from-orange-500 to-orange-600',
      bgGradient: 'from-orange-500/10 to-orange-600/10',
      iconColor: 'text-orange-400',
    },
    {
      title: 'Ortalama CTR',
      value: `${stats.avg_ctr.toFixed(2)}%`,
      icon: Activity,
      gradient: 'from-purple-500 to-purple-600',
      bgGradient: 'from-purple-500/10 to-purple-600/10',
      iconColor: 'text-purple-400',
    },
    {
      title: 'Performans Skoru',
      value: `${stats.avg_performance_score.toFixed(0)}/100`,
      icon: Brain,
      gradient: 'from-indigo-500 to-indigo-600',
      bgGradient: 'from-indigo-500/10 to-indigo-600/10',
      iconColor: 'text-indigo-400',
    },
    {
      title: 'Kritik Uyarılar',
      value: stats.critical_alerts,
      icon: AlertTriangle,
      gradient: 'from-red-500 to-red-600',
      bgGradient: 'from-red-500/10 to-red-600/10',
      iconColor: 'text-red-400',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 p-6 border border-gray-700 hover:border-gray-600 group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-xl bg-gradient-to-r ${card.bgGradient} group-hover:scale-110 transition-transform duration-300`}>
              <card.icon className={`w-6 h-6 ${card.iconColor}`} />
            </div>
            <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${card.gradient} animate-pulse`}></div>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-400 mb-2">
              {card.title}
            </p>
            <p className="text-2xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 transition-all duration-300">
              {card.value}
            </p>
          </div>
          
          <div className="mt-4">
            <div className={`w-full h-1 bg-gradient-to-r ${card.gradient} rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-300`}></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;