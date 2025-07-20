import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useTheme } from '../contexts/ThemeContext';

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  color: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, changeType, color }) => {
  const { isDark } = useTheme();
  
  const getChangeColor = () => {
    if (changeType === 'positive') return 'text-green-500';
    if (changeType === 'negative') return 'text-red-500';
    return isDark ? 'text-gray-400' : 'text-gray-600';
  };

  return (
    <div className={`${color} text-white p-4 rounded-lg`}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-medium opacity-90">{title}</span>
        <span className="text-xs opacity-75">▼</span>
      </div>
      <div className="text-2xl font-bold mb-1">{value}</div>
      <div className={`text-xs ${getChangeColor()}`}>
        {changeType === 'positive' ? '▲' : changeType === 'negative' ? '▼' : '●'} {change}
      </div>
    </div>
  );
};

const GoogleAdsStyleCharts: React.FC = () => {
  const { isDark } = useTheme();

  const multiLineData = [
    { date: 'May 1', clicks: 85, impressions: 95, conversions: 88, cost: 92 },
    { date: 'May 5', clicks: 88, impressions: 92, conversions: 85, cost: 89 },
    { date: 'May 10', clicks: 92, impressions: 88, conversions: 95, cost: 85 },
    { date: 'May 15', clicks: 95, impressions: 85, conversions: 92, cost: 88 },
    { date: 'May 20', clicks: 88, impressions: 92, conversions: 88, cost: 95 },
    { date: 'May 25', clicks: 92, impressions: 95, conversions: 85, cost: 92 },
    { date: 'May 31', clicks: 98, impressions: 88, conversions: 92, cost: 85 },
  ];

  const barData = [
    { name: 'Acme Dental', value: 110 },
    { name: 'Acme Law', value: 108 },
    { name: 'Default', value: 105 },
    { name: 'Acme Auto Body', value: 95 },
  ];

  const performanceData = [
    { metric: 'View-Through Conv.', value: '752', change: '1%', changeType: 'negative' as const },
    { metric: 'Avg CPC', value: '$194.86', change: '6%', changeType: 'negative' as const },
    { metric: 'Clicks', value: '194', change: '70%', changeType: 'positive' as const },
    { metric: 'Conversion Rate', value: '19.02%', change: '435%', changeType: 'positive' as const },
    { metric: 'Conversions', value: '262', change: '296%', changeType: 'positive' as const },
    { metric: 'Cost', value: '$1,341.00', change: '4%', changeType: 'negative' as const },
    { metric: 'Cost / Conversion', value: '$214.14', change: '4%', changeType: 'negative' as const },
    { metric: 'Impressions', value: '128', change: '128%', changeType: 'positive' as const },
  ];

  return (
    <div className="space-y-6">
      {/* Top Metrics Bar */}
      <div className="grid grid-cols-4 gap-1 rounded-lg overflow-hidden">
        <MetricCard
          title="Clicks"
          value="944"
          change="▼"
          changeType="neutral"
          color="bg-blue-500"
        />
        <MetricCard
          title="Impressions"
          value="33.6K"
          change="▼"
          changeType="neutral"
          color="bg-red-500"
        />
        <MetricCard
          title="Conversions"
          value="28.06"
          change="▼"
          changeType="neutral"
          color="bg-yellow-500"
        />
        <MetricCard
          title="Cost"
          value="$1.32K"
          change="▼"
          changeType="neutral"
          color="bg-green-500"
        />
      </div>

      {/* Multi-line Chart */}
      <div className={`${
        isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      } border rounded-xl p-6`}>
        <h3 className={`text-lg font-semibold mb-4 ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>
          Performance Trends
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={multiLineData}>
            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#e5e7eb'} />
            <XAxis 
              dataKey="date" 
              stroke={isDark ? '#9ca3af' : '#6b7280'} 
              fontSize={12}
            />
            <YAxis 
              stroke={isDark ? '#9ca3af' : '#6b7280'} 
              fontSize={12}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: isDark ? '#1f2937' : '#ffffff', 
                border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
                borderRadius: '8px',
                color: isDark ? '#fff' : '#000'
              }} 
            />
            <Line 
              type="monotone" 
              dataKey="clicks" 
              stroke="#3b82f6" 
              strokeWidth={2}
              dot={false}
              animationDuration={1500}
            />
            <Line 
              type="monotone" 
              dataKey="impressions" 
              stroke="#ef4444" 
              strokeWidth={2}
              dot={false}
              animationDuration={1500}
            />
            <Line 
              type="monotone" 
              dataKey="conversions" 
              stroke="#10b981" 
              strokeWidth={2}
              dot={false}
              animationDuration={1500}
            />
            <Line 
              type="monotone" 
              dataKey="cost" 
              stroke="#f59e0b" 
              strokeWidth={2}
              dot={false}
              animationDuration={1500}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className={`${
          isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        } border rounded-xl p-6`}>
          <h3 className={`text-lg font-semibold mb-4 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            View-Through Conv.
          </h3>
          <div className="mb-4">
            <span className={`text-3xl font-bold ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              429
            </span>
            <span className="text-green-500 text-sm ml-2">0%</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={barData}>
              <XAxis 
                dataKey="name" 
                stroke={isDark ? '#9ca3af' : '#6b7280'} 
                fontSize={12}
              />
              <YAxis 
                stroke={isDark ? '#9ca3af' : '#6b7280'} 
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: isDark ? '#1f2937' : '#ffffff', 
                  border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
                  borderRadius: '8px',
                  color: isDark ? '#fff' : '#000'
                }} 
              />
              <Bar 
                dataKey="value" 
                fill="#3b82f6" 
                radius={[4, 4, 0, 0]}
                animationDuration={1500}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Performance Metrics Grid */}
        <div className={`${
          isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        } border rounded-xl p-6`}>
          <h3 className={`text-lg font-semibold mb-4 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Performance Metrics
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {performanceData.map((item, index) => (
              <div 
                key={index}
                className={`p-3 rounded-lg border ${
                  isDark ? 'border-gray-700 bg-gray-700/30' : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className={`text-xs mb-1 ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {item.metric}
                </div>
                <div className={`text-lg font-bold ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  {item.value}
                </div>
                <div className={`text-xs ${
                  item.changeType === 'positive' ? 'text-green-500' : 
                  item.changeType === 'negative' ? 'text-red-500' : 
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {item.changeType === 'positive' ? '▲' : '▼'} {item.change}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoogleAdsStyleCharts;