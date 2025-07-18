import React from 'react';
import { X, Brain, TrendingUp, AlertTriangle, Lightbulb, Target, DollarSign } from 'lucide-react';
import { Campaign } from '../types';

interface AIInsightsModalProps {
  campaign: Campaign;
  isOpen: boolean;
  onClose: () => void;
}

const AIInsightsModal: React.FC<AIInsightsModalProps> = ({ campaign, isOpen, onClose }) => {
  if (!isOpen) return null;

  const getRiskColor = (score: number) => {
    if (score <= 30) return 'text-green-400';
    if (score <= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getRiskBgColor = (score: number) => {
    if (score <= 30) return 'from-green-500 to-green-600';
    if (score <= 60) return 'from-yellow-500 to-yellow-600';
    return 'from-red-500 to-red-600';
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">AI Analiz & Öneriler</h2>
              <p className="text-gray-400">{campaign.campaign_name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Performance & Risk Scores */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-700/30 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <TrendingUp className="w-6 h-6 text-green-400" />
                <h3 className="text-lg font-semibold text-white">Performans Skoru</h3>
              </div>
              <div className="text-3xl font-bold text-green-400 mb-2">
                {campaign.performance_score}/100
              </div>
              <div className="w-full bg-gray-600 rounded-full h-3">
                <div
                  className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-all duration-500"
                  style={{ width: `${campaign.performance_score}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-gray-700/30 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <AlertTriangle className={`w-6 h-6 ${getRiskColor(campaign.risk_score)}`} />
                <h3 className="text-lg font-semibold text-white">Risk Skoru</h3>
              </div>
              <div className={`text-3xl font-bold mb-2 ${getRiskColor(campaign.risk_score)}`}>
                {campaign.risk_score}/100
              </div>
              <div className="w-full bg-gray-600 rounded-full h-3">
                <div
                  className={`h-full bg-gradient-to-r ${getRiskBgColor(campaign.risk_score)} rounded-full transition-all duration-500`}
                  style={{ width: `${campaign.risk_score}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Trends */}
          <div className="bg-gray-700/30 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <TrendingUp className="w-6 h-6 text-blue-400" />
              <h3 className="text-lg font-semibold text-white">Trendler</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {campaign.trends.map((trend, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-600/30 rounded-lg">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span className="text-gray-300">{trend}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Anomalies */}
          {campaign.anomalies.length > 0 && (
            <div className="bg-gray-700/30 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <AlertTriangle className="w-6 h-6 text-yellow-400" />
                <h3 className="text-lg font-semibold text-white">Anomaliler</h3>
              </div>
              <div className="space-y-3">
                {campaign.anomalies.map((anomaly, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                    <AlertTriangle className="w-4 h-4 text-yellow-400" />
                    <span className="text-gray-300">{anomaly}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI Insights */}
          <div className="bg-gray-700/30 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Brain className="w-6 h-6 text-purple-400" />
              <h3 className="text-lg font-semibold text-white">AI Görüşleri</h3>
            </div>
            <div className="space-y-3">
              {campaign.ai_insights.map((insight, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                  <Brain className="w-4 h-4 text-purple-400 mt-0.5" />
                  <span className="text-gray-300">{insight}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Smart Recommendations */}
          <div className="bg-gray-700/30 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Lightbulb className="w-6 h-6 text-yellow-400" />
              <h3 className="text-lg font-semibold text-white">Akıllı Öneriler</h3>
            </div>
            <div className="space-y-3">
              {campaign.smart_recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start space-x-3 p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg hover:border-blue-400/40 transition-colors">
                  <Lightbulb className="w-4 h-4 text-yellow-400 mt-0.5" />
                  <div className="flex-1">
                    <span className="text-gray-300">{recommendation}</span>
                  </div>
                  <button className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors text-sm">
                    Uygula
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Budget Automation */}
          {campaign.budget_increase !== 0 && (
            <div className="bg-gray-700/30 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <DollarSign className="w-6 h-6 text-green-400" />
                <h3 className="text-lg font-semibold text-white">Bütçe Otomasyonu</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-sm text-gray-400 mb-1">Mevcut Bütçe</div>
                  <div className="text-xl font-bold text-white">₺{campaign.current_budget}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-400 mb-1">Önerilen Bütçe</div>
                  <div className="text-xl font-bold text-green-400">₺{campaign.new_budget}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-400 mb-1">Değişim</div>
                  <div className={`text-xl font-bold ${campaign.budget_increase > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {campaign.budget_increase > 0 ? '+' : ''}₺{campaign.budget_increase}
                  </div>
                </div>
              </div>
              
              {campaign.success_reasons.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-white mb-2">Başarı Nedenleri:</h4>
                  <div className="space-y-2">
                    {campaign.success_reasons.map((reason, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Target className="w-3 h-3 text-green-400" />
                        <span className="text-sm text-gray-300">{reason}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Kapat
          </button>
          <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300">
            Önerileri Uygula
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIInsightsModal;