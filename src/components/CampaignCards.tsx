import React from 'react';
import { Campaign } from '../types';
import { 
  Play, 
  Pause, 
  Eye, 
  Settings, 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Facebook,
  Instagram
} from 'lucide-react';

interface CampaignCardsProps {
  campaigns: Campaign[];
  onToggleStatus: (id: number) => void;
  onViewDetails: (campaign: Campaign) => void;
}

const CampaignCards: React.FC<CampaignCardsProps> = ({ 
  campaigns, 
  onToggleStatus, 
  onViewDetails 
}) => {
  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'facebook':
        return <Facebook className="w-5 h-5 text-blue-500" />;
      case 'instagram':
        return <Instagram className="w-5 h-5 text-pink-500" />;
      default:
        return <Facebook className="w-5 h-5 text-blue-500" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'paused':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getAIScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {campaigns.map((campaign) => {
        const budgetPercentage = (campaign.spent / campaign.budget) * 100;
        
        return (
          <div
            key={campaign.id}
            className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:bg-gray-750 transition-all duration-300 hover:scale-105"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                {getPlatformIcon(campaign.platform)}
                <div>
                  <h3 className="font-semibold text-lg text-white">{campaign.name}</h3>
                  <p className="text-sm text-gray-400">{campaign.objective}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusIcon(campaign.status)}
                <span className={`text-sm font-medium ${
                  campaign.status === 'active' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {campaign.status === 'active' ? 'Aktif' : 'Durdurulmuş'}
                </span>
              </div>
            </div>

            {/* Budget Progress */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-400">Bütçe Kullanımı</span>
                <span className="text-sm font-medium">
                  ₺{campaign.spent.toFixed(2)} / ₺{campaign.budget.toFixed(2)}
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(budgetPercentage)}`}
                  style={{ width: `${Math.min(budgetPercentage, 100)}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-400 mt-1">%{budgetPercentage.toFixed(1)} kullanıldı</p>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-700/50 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">CTR</span>
                  <TrendingUp className="w-4 h-4 text-green-400" />
                </div>
                <p className="text-lg font-semibold text-white">%{campaign.ctr.toFixed(2)}</p>
              </div>
              <div className="bg-gray-700/50 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">CPC</span>
                  <TrendingDown className="w-4 h-4 text-red-400" />
                </div>
                <p className="text-lg font-semibold text-white">₺{campaign.cpc.toFixed(2)}</p>
              </div>
            </div>

            {/* AI Performance */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-400">AI Performans</span>
                <span className="text-sm font-medium">{campaign.aiScore}/100</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${getAIScoreColor(campaign.aiScore)}`}
                  style={{ width: `${campaign.aiScore}%` }}
                ></div>
              </div>
            </div>

            {/* Alerts */}
            {campaign.alerts.length > 0 && (
              <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-3 mb-4">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm font-medium text-yellow-400">Uyarılar</span>
                </div>
                {campaign.alerts.map((alert, index) => (
                  <p key={index} className="text-xs text-yellow-300">{alert}</p>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2 mt-4">
              <button
                onClick={() => onToggleStatus(campaign.id)}
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  campaign.status === 'active'
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                {campaign.status === 'active' ? (
                  <>
                    <Pause className="w-4 h-4" />
                    <span>Durdur</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    <span>Başlat</span>
                  </>
                )}
              </button>

              <button className="flex items-center space-x-1 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-xs font-medium transition-colors">
                <Eye className="w-4 h-4" />
                <span>Görüntüle</span>
              </button>

              <button className="flex items-center space-x-1 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-xs font-medium transition-colors">
                <Settings className="w-4 h-4" />
                <span>Ayarlar</span>
              </button>

              <button
                onClick={() => onViewDetails(campaign)}
                className="flex items-center space-x-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-colors"
              >
                <BarChart3 className="w-4 h-4" />
                <span>Detay</span>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CampaignCards;