import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { Campaign } from '../types';
import { X, TrendingUp, Users, Smartphone, Clock } from 'lucide-react';

interface CampaignDetailModalProps {
  campaign: Campaign;
  onClose: () => void;
}

const CampaignDetailModal: React.FC<CampaignDetailModalProps> = ({ campaign, onClose }) => {
  // Mock data for charts and analytics
  const dailySpendData = [
    { day: 'Pts', spend: 25.30 },
    { day: 'Sal', spend: 32.15 },
    { day: 'Çar', spend: 28.90 },
    { day: 'Per', spend: 35.20 },
    { day: 'Cum', spend: 22.80 },
    { day: 'Cts', spend: 18.60 },
    { day: 'Paz', spend: 15.20 },
  ];

  const audienceData = [
    { age: '18-24', male: 35, female: 45 },
    { age: '25-34', male: 50, female: 60 },
    { age: '35-44', male: 40, female: 30 },
    { age: '45-54', male: 25, female: 20 },
  ];

  const deviceData = [
    { device: 'Mobil', percentage: 65, performance: 'İyi' },
    { device: 'Masaüstü', percentage: 25, performance: 'Çok İyi' },
    { device: 'Tablet', percentage: 10, performance: 'Orta' },
  ];

  const aiRecommendations = [
    'Mobil kullanıcılar için görsel optimizasyonu yapın',
    'Akşam saatlerinde bütçe artırımı yapılabilir',
    '25-34 yaş grubuna odaklanmayı artırın',
    'CTA metinlerini test etmeyi deneyin'
  ];

  const COLORS = ['#3b82f6', '#ef4444', '#f59e0b'];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-gray-800 border border-gray-700 rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div>
            <h2 className="text-2xl font-bold text-white">{campaign.name}</h2>
            <p className="text-gray-400">{campaign.objective} • {campaign.platform}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Performance Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Daily Spend Chart */}
            <div className="bg-gray-700/30 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Günlük Harcama Trendi
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={dailySpendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="day" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1f2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#fff'
                    }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="spend" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                    animationDuration={1500}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Performance Metrics */}
            <div className="bg-gray-700/30 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-4">Performans Metrikleri</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-400">{campaign.ctr.toFixed(2)}%</p>
                  <p className="text-sm text-gray-400">CTR</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-400">₺{campaign.cpc.toFixed(2)}</p>
                  <p className="text-sm text-gray-400">CPC</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-400">{campaign.aiScore}</p>
                  <p className="text-sm text-gray-400">AI Skoru</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-400">{Math.round((campaign.spent / campaign.budget) * 100)}%</p>
                  <p className="text-sm text-gray-400">Bütçe</p>
                </div>
              </div>
            </div>
          </div>

          {/* Audience Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Age/Gender Distribution */}
            <div className="bg-gray-700/30 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Yaş/Cinsiyet Dağılımı
              </h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={audienceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="age" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1f2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#fff'
                    }} 
                  />
                  <Bar dataKey="male" fill="#3b82f6" name="Erkek" />
                  <Bar dataKey="female" fill="#ec4899" name="Kadın" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Device Performance */}
            <div className="bg-gray-700/30 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Smartphone className="w-5 h-5 mr-2" />
                Cihaz Performansı
              </h3>
              <div className="space-y-4">
                {deviceData.map((data, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-300">{data.device}</span>
                        <span className="text-gray-400">%{data.percentage}</span>
                      </div>
                      <div className="w-full bg-gray-600 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            data.performance === 'Çok İyi' ? 'bg-green-500' :
                            data.performance === 'İyi' ? 'bg-blue-500' : 'bg-yellow-500'
                          }`}
                          style={{ width: `${data.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                    <span className={`ml-4 text-xs px-2 py-1 rounded ${
                      data.performance === 'Çok İyi' ? 'bg-green-500/20 text-green-400' :
                      data.performance === 'İyi' ? 'bg-blue-500/20 text-blue-400' : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {data.performance}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI Recommendations */}
          <div className="bg-gray-700/30 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              AI Önerileri
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {aiRecommendations.map((recommendation, index) => (
                <div key={index} className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                  <p className="text-sm text-blue-300">{recommendation}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CampaignDetailModal;