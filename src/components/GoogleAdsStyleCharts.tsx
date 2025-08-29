import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Activity, Eye, MousePointer, DollarSign } from 'lucide-react';

interface GoogleAdsStyleChartsProps {
  formattedKpis?: any;
  kpis?: any;
}

const GoogleAdsStyleCharts: React.FC<GoogleAdsStyleChartsProps> = ({ formattedKpis, kpis }) => {
  // n8n'den gelen formatlanmış KPI verilerini kullan
  const cards = [
    {
      title: 'Clicks',
      value: formattedKpis?.clicks?.value || '0',
      rawValue: formattedKpis?.clicks?.raw_value || 0,
      trend: formattedKpis?.clicks?.trend || 'up',
      changePercent: formattedKpis?.clicks?.change_percent || '0%',
      color: formattedKpis?.clicks?.color || '#4F84FF',
      icon: MousePointer,
      bgGradient: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Impressions',
      value: formattedKpis?.impressions?.value || '0',
      rawValue: formattedKpis?.impressions?.raw_value || 0,
      trend: formattedKpis?.impressions?.trend || 'up',
      changePercent: formattedKpis?.impressions?.change_percent || '0%',
      color: formattedKpis?.impressions?.color || '#FF6B6B',
      icon: Eye,
      bgGradient: 'from-red-500 to-red-600'
    },
    {
      title: 'Conversions',
      value: formattedKpis?.conversions?.value || '0',
      rawValue: formattedKpis?.conversions?.raw_value || 0,
      trend: formattedKpis?.conversions?.trend || 'up',
      changePercent: formattedKpis?.conversions?.change_percent || '0%',
      color: formattedKpis?.conversions?.color || '#FFB946',
      icon: Activity,
      bgGradient: 'from-yellow-500 to-orange-600'
    },
    {
      title: 'Cost',
      value: formattedKpis?.cost?.value || '$0',
      rawValue: formattedKpis?.cost?.raw_value || 0,
      trend: formattedKpis?.cost?.trend || 'down',
      changePercent: formattedKpis?.cost?.change_percent || '0%',
      color: formattedKpis?.cost?.color || '#51CF66',
      icon: DollarSign,
      bgGradient: 'from-green-500 to-green-600'
    }
  ];

  const getTrendIcon = (trend: string) => {
    return trend === 'up' ? TrendingUp : TrendingDown;
  };

  const getTrendColor = (trend: string) => {
    return trend === 'up' ? 'text-green-400' : 'text-red-400';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card, index) => {
        const TrendIcon = getTrendIcon(card.trend);
        
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`bg-gradient-to-br ${card.bgGradient} rounded-2xl p-6 text-white hover:scale-105 transition-all duration-300 cursor-pointer shadow-lg`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium opacity-90">{card.title}</h3>
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <card.icon className="w-5 h-5" />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="text-3xl font-bold">
                {card.value}
              </div>
              
              <div className="flex items-center space-x-2">
                <div className={`flex items-center space-x-1 ${getTrendColor(card.trend)}`}>
                  <TrendIcon className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {card.changePercent}
                  </span>
                </div>
                <span className="text-sm opacity-75">vs last period</span>
              </div>
            </div>
            
            {/* Progress bar for visual appeal */}
            <div className="mt-4 w-full bg-white/20 rounded-full h-1">
              <div 
                className="bg-white rounded-full h-1 transition-all duration-1000"
                style={{ 
                  width: `${Math.min((card.rawValue / Math.max(...cards.map(c => c.rawValue))) * 100, 100)}%` 
                }}
              ></div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default GoogleAdsStyleCharts;