import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Play, Pause, Settings, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

const AutomatedActions: React.FC = () => {
  const [automations, setAutomations] = useState([
    {
      id: 1,
      name: 'Otomatik Bütçe Artırma',
      description: 'CTR %2.5\'i geçtiğinde bütçeyi %20 artır',
      status: 'active',
      lastTriggered: '2 saat önce',
      triggerCount: 15
    },
    {
      id: 2,
      name: 'Düşük Performans Uyarısı',
      description: 'CTR %1\'in altına düştüğünde bildirim gönder',
      status: 'active',
      lastTriggered: '1 gün önce',
      triggerCount: 3
    },
    {
      id: 3,
      name: 'Bütçe Tükenmesi Uyarısı',
      description: 'Bütçe %90\'ı geçtiğinde kampanyayı durdur',
      status: 'paused',
      lastTriggered: '3 gün önce',
      triggerCount: 8
    },
    {
      id: 4,
      name: 'Gece Modu Optimizasyonu',
      description: '00:00-06:00 arası bütçeyi %50 azalt',
      status: 'active',
      lastTriggered: '8 saat önce',
      triggerCount: 45
    }
  ]);

  const toggleAutomation = (id: number) => {
    setAutomations(prev => prev.map(automation => 
      automation.id === id 
        ? { ...automation, status: automation.status === 'active' ? 'paused' : 'active' }
        : automation
    ));
  };

  const recentActions = [
    {
      id: 1,
      action: 'Bütçe artırıldı',
      campaign: 'Yaz Kampanyası 2024',
      time: '2 saat önce',
      type: 'success'
    },
    {
      id: 2,
      action: 'Düşük CTR uyarısı',
      campaign: 'E-ticaret Sonbahar',
      time: '1 gün önce',
      type: 'warning'
    },
    {
      id: 3,
      action: 'Kampanya durduruldu',
      campaign: 'Mobil Uygulama',
      time: '2 gün önce',
      type: 'error'
    },
    {
      id: 4,
      action: 'Gece modu aktif',
      campaign: 'Tüm kampanyalar',
      time: '8 saat önce',
      type: 'info'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Zap className="w-8 h-8 text-blue-400" />
        <h1 className="text-3xl font-bold text-white">Otomatik Eylemler</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-green-500/20 border border-green-500/30 rounded-xl p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-300 text-sm">Aktif Otomasyonlar</p>
              <p className="text-2xl font-bold text-white">{automations.filter(a => a.status === 'active').length}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-blue-500/20 border border-blue-500/30 rounded-xl p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-300 text-sm">Toplam Tetikleme</p>
              <p className="text-2xl font-bold text-white">{automations.reduce((sum, a) => sum + a.triggerCount, 0)}</p>
            </div>
            <Zap className="w-8 h-8 text-blue-400" />
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
              <p className="text-orange-300 text-sm">Son 24 Saat</p>
              <p className="text-2xl font-bold text-white">8</p>
            </div>
            <Clock className="w-8 h-8 text-orange-400" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-purple-500/20 border border-purple-500/30 rounded-xl p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-300 text-sm">Tasarruf</p>
              <p className="text-2xl font-bold text-white">₺1,250</p>
            </div>
            <Settings className="w-8 h-8 text-purple-400" />
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Automation Rules */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="bg-gray-800 border border-gray-700 rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Otomasyon Kuralları</h3>
          <div className="space-y-4">
            {automations.map((automation) => (
              <div key={automation.id} className="bg-gray-700/30 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-white">{automation.name}</h4>
                  <button
                    onClick={() => toggleAutomation(automation.id)}
                    className={`flex items-center space-x-1 px-3 py-1 rounded-lg text-sm transition-colors ${
                      automation.status === 'active'
                        ? 'bg-green-600 hover:bg-green-700 text-white'
                        : 'bg-gray-600 hover:bg-gray-500 text-white'
                    }`}
                  >
                    {automation.status === 'active' ? (
                      <>
                        <Pause className="w-4 h-4" />
                        <span>Aktif</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        <span>Pasif</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="text-sm text-gray-400 mb-3">{automation.description}</p>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Son tetikleme: {automation.lastTriggered}</span>
                  <span>Toplam: {automation.triggerCount} kez</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Actions */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-gray-800 border border-gray-700 rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Son Eylemler</h3>
          <div className="space-y-4">
            {recentActions.map((action) => (
              <div key={action.id} className="flex items-center space-x-3 p-3 bg-gray-700/30 rounded-lg">
                <div className={`w-2 h-2 rounded-full ${
                  action.type === 'success' ? 'bg-green-400' :
                  action.type === 'warning' ? 'bg-yellow-400' :
                  action.type === 'error' ? 'bg-red-400' : 'bg-blue-400'
                }`}></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">{action.action}</p>
                  <p className="text-xs text-gray-400">{action.campaign}</p>
                </div>
                <span className="text-xs text-gray-500">{action.time}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Create New Automation */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.7 }}
        className="bg-gray-800 border border-gray-700 rounded-xl p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-4">Yeni Otomasyon Oluştur</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Tetikleyici</label>
            <select className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white">
              <option>CTR değişimi</option>
              <option>Bütçe kullanımı</option>
              <option>Dönüşüm oranı</option>
              <option>Zaman bazlı</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Koşul</label>
            <select className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white">
              <option>Büyükse</option>
              <option>Küçükse</option>
              <option>Eşitse</option>
              <option>Arasındaysa</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Eylem</label>
            <select className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white">
              <option>Bütçe artır</option>
              <option>Bütçe azalt</option>
              <option>Kampanya durdur</option>
              <option>Bildirim gönder</option>
            </select>
          </div>
        </div>
        <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors">
          Otomasyon Oluştur
        </button>
      </motion.div>
    </motion.div>
  );
};

export default AutomatedActions;