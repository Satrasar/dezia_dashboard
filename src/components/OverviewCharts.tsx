import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { Campaign } from '../types';

interface OverviewChartsProps {
  campaigns: Campaign[];
}

const OverviewCharts: React.FC<OverviewChartsProps> = ({ campaigns }) => {
  // Daily spend data for the last 7 days
  const dailySpendData = [
    { day: 'Pts', spend: 45.30, ctr: 2.1, conversions: 12 },
    { day: 'Sal', spend: 52.15, ctr: 2.3, conversions: 15 },
    { day: 'Çar', spend: 48.90, ctr: 1.9, conversions: 11 },
    { day: 'Per', spend: 65.20, ctr: 2.5, conversions: 18 },
    { day: 'Cum', spend: 42.80, ctr: 2.0, conversions: 10 },
    { day: 'Cts', spend: 38.60, ctr: 1.8, conversions: 9 },
    { day: 'Paz', spend: 35.20, ctr: 1.7, conversions: 8 },
  ];

  // Campaign status distribution
  const statusData = [
    { name: 'Aktif', value: campaigns.filter(c => c.status === 'active').length, color: '#10b981' },
    { name: 'Durdurulmuş', value: campaigns.filter(c => c.status === 'paused').length, color: '#f59e0b' },
    { name: 'Bütçe Kritik', value: campaigns.filter(c => c.alerts.length > 0).length, color: '#ef4444' },
  ];

  // Platform performance
  const platformData = [
    { platform: 'Facebook', spend: 180.50, conversions: 45, ctr: 2.1 },
    { platform: 'Instagram', spend: 125.30, conversions: 32, ctr: 1.9 },
  ];

  const COLORS = ['#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Daily Spend Trend */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="lg:col-span-2 bg-gray-800 border border-gray-700 rounded-xl p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-4">Günlük Harcama Trendi</h3>
        <ResponsiveContainer width="100%" height={300}>
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
              strokeWidth={3}
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6 }}
              activeDot={{ r: 8, stroke: '#3b82f6', strokeWidth: 2 }}
              animationDuration={1500}
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Campaign Status Distribution */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-gray-800 border border-gray-700 rounded-xl p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-4">Kampanya Durumu</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={statusData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
              animationBegin={0}
              animationDuration={1500}
            >
              {statusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1f2937', 
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#fff'
              }} 
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex flex-col space-y-2 mt-4">
          {statusData.map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: item.color }}
              ></div>
              <span className="text-sm text-gray-300">{item.name}: {item.value}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Platform Performance */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="lg:col-span-3 bg-gray-800 border border-gray-700 rounded-xl p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-4">Platform Performansı</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={platformData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="platform" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1f2937', 
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#fff'
              }} 
            />
            <Bar dataKey="spend" fill="#3b82f6" radius={[4, 4, 0, 0]} animationDuration={1500} />
            <Bar dataKey="conversions" fill="#10b981" radius={[4, 4, 0, 0]} animationDuration={1500} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
};

export default OverviewCharts;