import React from 'react';
import { motion } from 'framer-motion';
import { Brain, TrendingUp, Target, DollarSign, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { Campaign } from '../types';
import { useTheme } from '../contexts/ThemeContext';

interface AIRecommendationsProps {
  campaigns: Campaign[];
}

const AIRecommendations: React.FC<AIRecommendationsProps> = ({ campaigns }) => {
  const { isDark } = useTheme();

  const recommendations = [
    {
      id: 1,
      type: 'budget',
      priority: 'high',
      campaign: 'Yaz Kampanyası 2024',
      title: 'Bütçe Artırımı Önerisi',
      description: 'CTR %2.10 ile hedefin üzerinde performans gösteriyor. Bütçeyi %25 artırarak daha fazla dönüşüm elde edebilirsiniz.',
      impact: '+15 dönüşüm/gün',
      confidence: 92,
      icon: DollarSign,
      color: 'green'
    },
    {
      id: 2,
      type: 'targeting',
      priority: 'medium',
      campaign: 'Mobil Uygulama Tanıtımı',
      title: 'Hedef Kitle Optimizasyonu',
      description: '25-34 yaş grubunda %40 daha yüksek dönüşüm oranı. Bu segmente odaklanmayı artırın.',
      impact: '+8% dönüşüm oranı',
      confidence: 87,
      icon: Target,
      color: 'blue'
    },
    {
      id: 3,
      type: 'timing',
      priority: 'medium',
      campaign: 'E-ticaret Sonbahar',
      title: 'Zaman Dilimi Ayarlaması',
      description: 'Akşam 18:00-22:00 arası %60 daha iyi performans. Bütçe dağılımını bu saatlere yoğunlaştırın.',
      impact: '+12% CTR artışı',
      confidence: 78,
      icon: Clock,
      color: 'orange'
    },
    {
      id: 4,
      type: 'creative',
      priority: 'high',
      campaign: 'E-ticaret Sonbahar',
      title: 'Kreatif Yenileme Gerekli',
      description: 'Mevcut görseller 14 gündür kullanılıyor. Kreatif yorgunluğu nedeniyle CTR düşüyor.',
      impact: '+25% CTR artışı',
      confidence: 95,
      icon: TrendingUp,
      color: 'red'
    },
    {
      id: 5,
      type: 'bidding',
      priority: 'low',
      campaign: 'Mobil Uygulama Tanıtımı',
      title: 'Teklif Stratejisi Optimizasyonu',
      description: 'Otomatik teklif stratejisine geçerek %15 daha düşük CPC elde edebilirsiniz.',
      impact: '-15% CPC azalışı',
      confidence: 73,
      icon: TrendingUp,
      color: 'purple'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return isDark ? 'text-red-400' : 'text-red-600';
      case 'medium': return isDark ? 'text-yellow-400' : 'text-yellow-600';
      case 'low': return isDark ? 'text-green-400' : 'text-green-600';
      default: return isDark ? 'text-gray-400' : 'text-gray-600';
    }
  };

  const getRecommendationColor = (color: string) => {
    const colors = {
      green: isDark ? 'from-green-500/20 to-green-600/20 border-green-500/30' : 'from-green-50 to-green-100 border-green-200',
      blue: isDark ? 'from-blue-500/20 to-blue-600/20 border-blue-500/30' : 'from-blue-50 to-blue-100 border-blue-200',
      orange: isDark ? 'from-orange-500/20 to-orange-600/20 border-orange-500/30' : 'from-orange-50 to-orange-100 border-orange-200',
      red: isDark ? 'from-red-500/20 to-red-600/20 border-red-500/30' : 'from-red-50 to-red-100 border-red-200',
      purple: isDark ? 'from-purple-500/20 to-purple-600/20 border-purple-500/30' : 'from-purple-50 to-purple-100 border-purple-200'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Brain className="w-8 h-8 text-blue-400" />
        <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          AI Önerileri
        </h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className={`${
            isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          } border rounded-xl p-4`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Toplam Öneri
              </p>
              <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {recommendations.length}
              </p>
            </div>
            <Brain className="w-8 h-8 text-blue-400" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={`${
            isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          } border rounded-xl p-4`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Yüksek Öncelik
              </p>
              <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {recommendations.filter(r => r.priority === 'high').length}
              </p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-400" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className={`${
            isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          } border rounded-xl p-4`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Ortalama Güven
              </p>
              <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                %{Math.round(recommendations.reduce((sum, r) => sum + r.confidence, 0) / recommendations.length)}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className={`${
            isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          } border rounded-xl p-4`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Potansiyel Artış
              </p>
              <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                +32%
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-400" />
          </div>
        </motion.div>
      </div>

      {/* Recommendations List */}
      <div className="space-y-4">
        {recommendations.map((recommendation, index) => (
          <motion.div
            key={recommendation.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 * index }}
            className={`bg-gradient-to-r ${getRecommendationColor(recommendation.color)} border rounded-xl p-6 hover:scale-[1.02] transition-all duration-300`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4 flex-1">
                <div className={`p-3 rounded-lg ${
                  isDark ? 'bg-gray-700/50' : 'bg-white/50'
                }`}>
                  <recommendation.icon className="w-6 h-6 text-blue-500" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className={`font-semibold text-lg ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                      {recommendation.title}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(recommendation.priority)}`}>
                      {recommendation.priority === 'high' ? 'Yüksek' : 
                       recommendation.priority === 'medium' ? 'Orta' : 'Düşük'} Öncelik
                    </span>
                  </div>
                  
                  <p className={`text-sm mb-3 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    <span className="font-medium">{recommendation.campaign}</span> • {recommendation.description}
                  </p>
                  
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2">
                      <span className={`text-sm font-medium ${
                        isDark ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        Beklenen Etki:
                      </span>
                      <span className="text-sm font-semibold text-green-500">
                        {recommendation.impact}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className={`text-sm font-medium ${
                        isDark ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        Güven:
                      </span>
                      <span className="text-sm font-semibold text-blue-500">
                        %{recommendation.confidence}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
                  Uygula
                </button>
                <button className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isDark 
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}>
                  Reddet
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default AIRecommendations;