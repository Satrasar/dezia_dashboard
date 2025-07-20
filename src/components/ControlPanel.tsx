import React from 'react';
import { Activity, DollarSign, Bell, Brain, Clock } from 'lucide-react';

const ControlPanel: React.FC = () => {
  const systemStatus = [
    { label: 'Ana Sistem Durumu', status: 'active', icon: Activity },
    { label: 'Otomatik Bütçe Artırma', status: 'active', icon: DollarSign },
    { label: 'Uyarı Sistemi', status: 'active', icon: Bell },
    { label: 'AI Analiz', status: 'active', icon: Brain },
  ];

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Sistem Kontrol Paneli</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {systemStatus.map((item, index) => (
          <div key={index} className="bg-gray-700/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <item.icon className="w-5 h-5 text-blue-400" />
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            <p className="text-sm text-gray-300 mb-1">{item.label}</p>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-xs text-green-400 font-medium">Açık</span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gray-700/30 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-400">Son Kontrol</span>
          </div>
          <span className="text-sm text-white font-medium">2 dakika önce</span>
        </div>
        <div className="mt-2 text-xs text-gray-400">
          Son güncelleme: 30 saniye önce
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;