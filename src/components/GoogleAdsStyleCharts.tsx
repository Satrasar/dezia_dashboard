import React from 'react';
import { Campaign } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { TrendingUp, TrendingDown, DollarSign, MousePointer, Eye, Target } from 'lucide-react';

interface GoogleAdsStyleChartsProps {
  campaigns: Campaign[];
  kpis?: any;
  formattedKpis?: any;
}

const GoogleAdsStyleCharts: React.FC<GoogleAdsStyleChartsProps> = ({ campaigns, kpis, formattedKpis }) => {
  const { t } = useLanguage();

  // Calculate metrics from n8n data or fallback to campaign data
  const totalClicks = kpis?.total_clicks || campaigns.reduce((sum, c) => sum + (c.clicks || 0), 0);
  const totalImpressions = kpis?.total_impressions || campaigns.reduce((sum, c) => sum + (c.impressions || 0), 0);
  const totalConversions = kpis?.total_conversions || campaigns.reduce((sum, c) => sum + (c.conversions || 0), 0);
  const totalCost = kpis?.total_spent || campaigns.reduce((sum, c) => sum + c.spent, 0);

  // Format numbers
  const formatNumber = (num: number) => {
    if (formattedKpis) return num.toString();
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toLocaleString();
  };

  const formatCurrency = (num: number) => {
    if (num >= 1000000) return `₺${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `₺${(num / 1000).toFixed(1)}K`;
    return `₺${num.toFixed(2)}`;
  };

  // Mock trend data (in real app, this would come from historical data)
  const getTrendData = (current: number, previous: number = current * 0.9) => {
    const change = ((current - previous) / previous) * 100;
    return {
      change: change.toFixed(1),
      isPositive: change > 0
    };
  };

  const clicksTrend = getTrendData(totalClicks);
  const impressionsTrend = getTrendData(totalImpressions);
  const conversionsTrend = getTrendData(totalConversions);
  const costTrend = getTrendData(totalCost);

  const charts = [
    {
      title: t('clicks'),
      value: formatNumber(totalClicks),
      trend: clicksTrend,
      icon: MousePointer,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      borderColor: 'border-blue-200 dark:border-blue-800'
    },
    {
      title: t('impressions'),
      value: formatNumber(totalImpressions),
      trend: impressionsTrend,
      icon: Eye,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      borderColor: 'border-green-200 dark:border-green-800'
    },
    {
      title: t('conversions'),
      value: formatNumber(totalConversions),
      trend: conversionsTrend,
      icon: Target,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      borderColor: 'border-purple-200 dark:border-purple-800'
    },
    {
      title: t('cost'),
      value: formatCurrency(totalCost),
      trend: costTrend,
      icon: DollarSign,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      borderColor: 'border-orange-200 dark:border-orange-800'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {charts.map((chart, index) => (
        <div
          key={index}
          className={`${chart.bgColor} ${chart.borderColor} border-2 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 cursor-pointer group google-ads-card`}
        >
          <div className="flex items-start justify-between mb-4">
            <div className={`p-3 rounded-xl bg-gradient-to-r ${chart.color} shadow-lg group-hover:scale-110 transition-transform`}>
              <chart.icon className="w-6 h-6 text-white" />
            </div>
            <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
              chart.trend.isPositive 
                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
            }`}>
              {chart.trend.isPositive ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              <span>{chart.trend.change}%</span>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              {chart.title}
            </h3>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {chart.value}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {t('vs_last_period')}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GoogleAdsStyleCharts;