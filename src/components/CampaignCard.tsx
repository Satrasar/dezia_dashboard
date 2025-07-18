import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  Brain,
  Eye,
  Settings,
  Facebook,
  Instagram,
  Smartphone
} from 'lucide-react';
import { Campaign } from '../types';
import AIInsightsModal from './AIInsightsModal';

interface CampaignCardProps {
  campaign: Campaign;
}

const CampaignCard: React.FC<CampaignCardProps> = ({ campaign }) => {
  const [showAIModal, setShowAIModal] = useState(false);

  const getAlertColor = (level: string) => {
    switch (level) {
      case 'critical':
        return 'text-red-400 bg-red-500/10 border-red-500/20';
      case 'warning':
        return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      case 'normal':
        return 'text-green-400 bg-green-500/10 border-green-500/20';
      default:
        return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
    }
  };

  const getBudgetBarColor = (level: string) => {
    switch (level) {
      case 'critical':
        return 'from-red-500 to-red-600';
      case 'warning':
        return 'from-yellow-500 to-yellow-600';
      case 'normal':
        return 'from-green-500 to-green-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'Facebook':
        return <Facebook className="w-5 h-5 text-blue-500" />;
      case 'Instagram':
        return <Instagram className="w-5 h-5 text-pink-500" />;
      case 'Meta':
        return <Smartphone className="w-5 h-5 text-purple-500" />;
      default:
        return <Facebook className="w-5 h-5 text-blue-500" />;
    }
  };

  const getPerformanceColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <>
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 p-6 border border-gray-700 hover:border-gray-600 group">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            {getPlatformIcon(campaign.platform)}
            <div>
              <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors duration-300">
                {campaign.campaign_name}
              </h3>
              <p className="text-sm text-gray-400">{campaign.objective}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {campaign.has_alert && (
              <div className={`p-2 rounded-lg border ${getAlertColor(campaign.alert_level)}`}>
                <AlertTriangle className="w-4 h-4" />
              </div>
            )}
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
              campaign.account_status === 'ACTIVE'
                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
            }`}>
              {campaign.account_status === 'ACTIVE' ? 'Aktif' : 'Durdurulmuş'}
            </span>
          </div>
        </div>

        {/* Budget Progress */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-400">Bütçe Kullanımı</span>
            <span className="text-sm font-semibold text-white">
              ₺{campaign.spend.toFixed(2)} / ₺{campaign.daily_budget.toFixed(2)}
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${getBudgetBarColor(campaign.alert_level)} transition-all duration-500 relative`}
              style={{ width: `${Math.min(campaign.budget_usage, 100)}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
            </div>
          </div>
          <div className="flex justify-between items-center mt-1">
            <span className="text-xs text-gray-500">%{campaign.budget_usage.toFixed(1)}</span>
            <span className="text-xs text-gray-500">Kalan: ₺{campaign.remaining_budget.toFixed(2)}</span>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-700/30 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">CTR</span>
              <TrendingUp className="w-4 h-4 text-green-400" />
            </div>
            <div className="text-xl font-bold text-white">{campaign.ctr.toFixed(2)}%</div>
            <div className="text-xs text-gray-500">{campaign.clicks.toLocaleString()} tık</div>
          </div>
          
          <div className="bg-gray-700/30 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">CPC</span>
              <TrendingDown className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-xl font-bold text-white">₺{campaign.cpc.toFixed(2)}</div>
            <div className="text-xs text-gray-500">{campaign.impressions.toLocaleString()} gösterim</div>
          </div>
        </div>

        {/* AI Performance Score */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Brain className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-gray-400">AI Performans Skoru</span>
            </div>
            <span className={`text-lg font-bold ${getPerformanceColor(campaign.performance_score)}`}>
              {campaign.performance_score}/100
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                campaign.performance_score >= 80 
                  ? 'bg-gradient-to-r from-green-500 to-green-600'
                  : campaign.performance_score >= 60
                  ? 'bg-gradient-to-r from-yellow-500 to-yellow-600'
                  : 'bg-gradient-to-r from-red-500 to-red-600'
              }`}
              style={{ width: `${campaign.performance_score}%` }}
            ></div>
          </div>
        </div>

        {/* Alerts */}
        {campaign.has_alert && campaign.alerts.length > 0 && (
          <div className="mb-6">
            <div className="bg-gray-700/30 rounded-xl p-4">
              <div className="flex items-center space-x-2 mb-2">
                <AlertTriangle className={`w-4 h-4 ${
                  campaign.alert_level === 'critical' ? 'text-red-400' :
                  campaign.alert_level === 'warning' ? 'text-yellow-400' : 'text-green-400'
                }`} />
                <span className="text-sm font-semibold text-white">Uyarılar</span>
              </div>
              {campaign.alerts.slice(0, 2).map((alert, index) => (
                <div key={index} className="text-xs text-gray-300 mb-1">
                  • {alert.message}
                </div>
              ))}
              {campaign.alerts.length > 2 && (
                <div className="text-xs text-blue-400 cursor-pointer hover:text-blue-300">
                  +{campaign.alerts.length - 2} daha fazla uyarı
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button className={`p-2 rounded-lg transition-all duration-300 ${
              campaign.account_status === 'ACTIVE'
                ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
            }`}>
              {campaign.account_status === 'ACTIVE' ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
            </button>
            
            <button className="p-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-all duration-300">
              <Eye className="w-4 h-4" />
            </button>
            
            <button className="p-2 rounded-lg bg-gray-500/20 text-gray-400 hover:bg-gray-500/30 transition-all duration-300">
              <Settings className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setShowAIModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-300 text-sm font-semibold flex items-center space-x-2"
          >
            <Brain className="w-4 h-4" />
            <span>AI Önerileri</span>
          </button>
        </div>
      </div>

      <AIInsightsModal
        campaign={campaign}
        isOpen={showAIModal}
        onClose={() => setShowAIModal(false)}
      />
    </>
  );
};

export default CampaignCard;