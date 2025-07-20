import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Target, TrendingUp, MousePointer, Eye } from 'lucide-react';
import { Campaign } from '../types';

interface PerformanceMetricsProps {
  campaigns: Campaign[];
}

const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({ campaigns }) => {
  const performanceData = [
    { day: 'Pts', ctr: 2.1, cpc: 1.85, conversions: 12, impressions: 5420 },
    { day: 'Sal', ctr: 2.3, cpc: 1.92, conversions: 15, impressions: 6230 },
    { day: 'Çar', ctr: 1.9, cpc: 2.10, conversions: 11, impressions: 5890 },
    { day: 'Per', ctr: 2.5, cpc: 1.75, conversions: 18, impressions: 7120 },
    { day: 'Cum', ctr: 2.0, cpc: 1.88, conversions: 10, impressions: 5650 },
    { day: 'Cts', ctr: 1.8, cpc: 2.05, conversions: 9, impressions: 5340 },
    { day: 'Paz', ctr: 1.7, cpc: 2.15, conversions: 8, impressions: 4980 },
  ];

  const radarData = [
    { metric: 'CTR', value: 85, fullMark: 100 },
    { metric: 'Conversion Rate', value: 78, fullMark: 100 },
    { metric: 'Quality Score', value: 92, fullMark: 100 },
    { metric: 'Relevance', value: 88, fullMark: 100 },
    { metric: 'Landing Page', value: 75, fullMark: 100 },
    { metric: 'Ad Strength', value: 82, fullMark: 100 },
  ];

  const avgCTR = campaigns.reduce((sum, c) => sum + c.ctr, 0) / campaigns.length;
  const avgCPC = campaigns.reduce((sum, c) => sum + c.cpc, 0) / campaigns.length;
  const totalConversions = 83; // Mock data
  const avgQualityScore = 8.5; // Mock data

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Target className="w-8 h-8 text-blue-400" />
        <h1 className="text-3xl font-bold text-white">Performans Metrikleri</h1>
      </div>

      {/* Performance KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-blue-500/20 border border-blue-500/30 rounded-xl p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-300 text-sm">Ortalama CTR</p>
              <p className="text-2xl font-bold text-white">%{avgCTR.toFixed(2)}</p>
            </div>
            <MousePointer className="w-8 h-8 text-blue-400" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-green-500/20 border border-green-500/30 rounded-xl p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-300 text-sm">Ortalama CPC</p>
              <p className="text-2xl font-bold text-white">₺{avgCPC.toFixed(2)}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-400" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-purple-500/20 border border-purple-500/30 rounded-xl p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-300 text-sm">Toplam Dönüşüm</p>
              <p className="text-2xl font-bold text-white">{totalConversions}</p>
            </div>
            <Target className="w-8 h-8 text-purple-400" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-orange-500/20 border border-orange-500/30 rounded-xl p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-300 text-sm">Kalite Skoru</p>
              <p className="text-2xl font-bold text-white">{avgQualityScore}/10</p>
            </div>
            <Eye className="w-8 h-8 text-orange-400" />
          </div>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CTR & CPC Trend */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="bg-gray-800 border border-gray-700 rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4">CTR & CPC Trendi</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceData}>
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
                dataKey="ctr" 
                stroke="#3b82f6" 
                strokeWidth={3}
                name="CTR (%)"
                animationDuration={1500}
              />
              <Line 
                type="monotone" 
                dataKey="cpc" 
                stroke="#ef4444" 
                strokeWidth={3}
                name="CPC (₺)"
                animationDuration={1500}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Performance Radar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-gray-800 border border-gray-700 rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Performans Radarı</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#374151" />
              <PolarAngleAxis dataKey="metric" tick={{ fill: '#9ca3af', fontSize: 12 }} />
              <PolarRadiusAxis 
                angle={90} 
                domain={[0, 100]} 
                tick={{ fill: '#9ca3af', fontSize: 10 }}
              />
              <Radar
                name="Performans"
                dataKey="value"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.3}
                strokeWidth={2}
                animationDuration={1500}
              />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Conversion & Impressions Trend */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.7 }}
        className="bg-gray-800 border border-gray-700 rounded-xl p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-4">Dönüşüm & Gösterim Trendi</h3>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={performanceData}>
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
            <Area
              type="monotone"
              dataKey="impressions"
              stackId="1"
              stroke="#8b5cf6"
              fill="#8b5cf6"
              fillOpacity={0.3}
              name="Gösterimler"
              animationDuration={1500}
            />
            <Area
              type="monotone"
              dataKey="conversions"
              stackId="2"
              stroke="#10b981"
              fill="#10b981"
              fillOpacity={0.6}
              name="Dönüşümler"
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>
    </motion.div>
  );
};

export default PerformanceMetrics;