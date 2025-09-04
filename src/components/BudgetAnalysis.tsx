import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { DollarSign, TrendingUp, AlertTriangle, Target } from 'lucide-react';
import { Campaign } from '../types';
import { useN8nData } from '../hooks/useN8nData';

interface BudgetAnalysisProps {
  campaigns: Campaign[];
}

const BudgetAnalysis: React.FC<BudgetAnalysisProps> = ({ campaigns }) => {
  const { kpis } = useN8nData();
  
  // n8n'den gelen gerçek aylık veriler
  const monthlyBudgetData = kpis?.monthly_budget_data || [
    { month: 'Oca', budget: campaigns.reduce((sum, c) => sum + c.budget, 0) * 0.8, spent: campaigns.reduce((sum, c) => sum + c.spent, 0) * 0.8, efficiency: 95.8 },
    { month: 'Şub', budget: campaigns.reduce((sum, c) => sum + c.budget, 0) * 0.85, spent: campaigns.reduce((sum, c) => sum + c.spent, 0) * 0.85, efficiency: 98.5 },
    { month: 'Mar', budget: campaigns.reduce((sum, c) => sum + c.budget, 0) * 0.9, spent: campaigns.reduce((sum, c) => sum + c.spent, 0) * 0.9, efficiency: 94.3 },
    { month: 'Nis', budget: campaigns.reduce((sum, c) => sum + c.budget, 0) * 0.95, spent: campaigns.reduce((sum, c) => sum + c.spent, 0) * 0.95, efficiency: 96.7 },
    { month: 'May', budget: campaigns.reduce((sum, c) => sum + c.budget, 0), spent: campaigns.reduce((sum, c) => sum + c.spent, 0), efficiency: 98.8 },
    { month: 'Haz', budget: campaigns.reduce((sum, c) => sum + c.budget, 0) * 1.1, spent: campaigns.reduce((sum, c) => sum + c.spent, 0) * 1.05, efficiency: 97.1 },
  ];

  // n8n'den gelen gerçek platform dağılımı
  const facebookCampaigns = campaigns.filter(c => c.platform === 'facebook');
  const instagramCampaigns = campaigns.filter(c => c.platform === 'instagram');
  const totalBudget = campaigns.reduce((sum, c) => sum + c.budget, 0);
  
  const budgetDistribution = kpis?.budget_distribution || [
    { 
      name: 'Facebook Ads', 
      value: totalBudget > 0 ? Math.round((facebookCampaigns.reduce((sum, c) => sum + c.budget, 0) / totalBudget) * 100) : 60, 
      color: '#3b82f6' 
    },
    { 
      name: 'Instagram Ads', 
      value: totalBudget > 0 ? Math.round((instagramCampaigns.reduce((sum, c) => sum + c.budget, 0) / totalBudget) * 100) : 30, 
      color: '#ec4899' 
    },
    { 
      name: 'Rezerv', 
      value: 10, 
      color: '#10b981' 
    },
  ];

  const campaignBudgetData = campaigns.map(campaign => ({
    name: campaign.name.substring(0, 15) + '...',
    budget: campaign.budget,
    spent: campaign.spent,
    remaining: campaign.budget - campaign.spent,
    efficiency: (campaign.spent / campaign.budget) * 100
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center space-x-3">
        <DollarSign className="w-8 h-8 text-blue-400" />
        <h1 className="text-3xl font-bold text-white">Bütçe Analizi</h1>
      </div>

      {/* Budget KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-blue-500/20 border border-blue-500/30 rounded-xl p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-300 text-sm">Toplam Bütçe</p>
              <p className="text-2xl font-bold text-white">₺{campaigns.reduce((sum, c) => sum + c.budget, 0).toFixed(2)}</p>
            </div>
            <DollarSign className="w-8 h-8 text-blue-400" />
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
              <p className="text-green-300 text-sm">Harcanan</p>
              <p className="text-2xl font-bold text-white">₺{campaigns.reduce((sum, c) => sum + c.spent, 0).toFixed(2)}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-400" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-orange-500/20 border border-orange-500/30 rounded-xl p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-300 text-sm">Kalan</p>
              <p className="text-2xl font-bold text-white">₺{campaigns.reduce((sum, c) => sum + (c.budget - c.spent), 0).toFixed(2)}</p>
            </div>
            <Target className="w-8 h-8 text-orange-400" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-red-500/20 border border-red-500/30 rounded-xl p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-300 text-sm">Verimlilik</p>
              <p className="text-2xl font-bold text-white">%{((campaigns.reduce((sum, c) => sum + c.spent, 0) / campaigns.reduce((sum, c) => sum + c.budget, 0)) * 100).toFixed(1)}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-400" />
          </div>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Budget Trend */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="bg-gray-800 border border-gray-700 rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Aylık Bütçe Trendi</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyBudgetData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9ca3af" />
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
                dataKey="budget" 
                stroke="#3b82f6" 
                strokeWidth={3}
                name="Bütçe"
                animationDuration={1500}
              />
              <Line 
                type="monotone" 
                dataKey="spent" 
                stroke="#10b981" 
                strokeWidth={3}
                name="Harcanan"
                animationDuration={1500}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Budget Distribution */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-gray-800 border border-gray-700 rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Bütçe Dağılımı</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={budgetDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
                animationBegin={0}
                animationDuration={1000}
              >
                {budgetDistribution.map((entry, index) => (
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
            {budgetDistribution.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-sm text-gray-300">{item.name}: %{item.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Campaign Budget Details */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.7 }}
        className="bg-gray-800 border border-gray-700 rounded-xl p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-4">Kampanya Bütçe Detayları</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={campaignBudgetData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1f2937', 
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#fff'
              }} 
            />
            <Bar dataKey="budget" fill="#3b82f6" name="Bütçe" radius={[4, 4, 0, 0]} />
            <Bar dataKey="spent" fill="#10b981" name="Harcanan" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </motion.div>
  );
};

export default BudgetAnalysis;