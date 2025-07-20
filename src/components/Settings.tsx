import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Bell, Shield, Database, Palette, Globe } from 'lucide-react';

const Settings: React.FC = () => {
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    budget: true,
    performance: true
  });

  const [automation, setAutomation] = useState({
    autoBudget: true,
    autoOptimization: false,
    autoReports: true,
    autoAlerts: true
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center space-x-3">
        <SettingsIcon className="w-8 h-8 text-blue-400" />
        <h1 className="text-3xl font-bold text-white">Ayarlar</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notification Settings */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-gray-800 border border-gray-700 rounded-xl p-6"
        >
          <div className="flex items-center space-x-3 mb-4">
            <Bell className="w-6 h-6 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">Bildirim Ayarları</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">E-posta Bildirimleri</span>
              <button
                onClick={() => setNotifications(prev => ({ ...prev, email: !prev.email }))}
                className={`w-12 h-6 rounded-full transition-colors ${
                  notifications.email ? 'bg-blue-600' : 'bg-gray-600'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  notifications.email ? 'translate-x-6' : 'translate-x-1'
                }`}></div>
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Push Bildirimleri</span>
              <button
                onClick={() => setNotifications(prev => ({ ...prev, push: !prev.push }))}
                className={`w-12 h-6 rounded-full transition-colors ${
                  notifications.push ? 'bg-blue-600' : 'bg-gray-600'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  notifications.push ? 'translate-x-6' : 'translate-x-1'
                }`}></div>
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">SMS Bildirimleri</span>
              <button
                onClick={() => setNotifications(prev => ({ ...prev, sms: !prev.sms }))}
                className={`w-12 h-6 rounded-full transition-colors ${
                  notifications.sms ? 'bg-blue-600' : 'bg-gray-600'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  notifications.sms ? 'translate-x-6' : 'translate-x-1'
                }`}></div>
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Bütçe Uyarıları</span>
              <button
                onClick={() => setNotifications(prev => ({ ...prev, budget: !prev.budget }))}
                className={`w-12 h-6 rounded-full transition-colors ${
                  notifications.budget ? 'bg-blue-600' : 'bg-gray-600'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  notifications.budget ? 'translate-x-6' : 'translate-x-1'
                }`}></div>
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Performans Uyarıları</span>
              <button
                onClick={() => setNotifications(prev => ({ ...prev, performance: !prev.performance }))}
                className={`w-12 h-6 rounded-full transition-colors ${
                  notifications.performance ? 'bg-blue-600' : 'bg-gray-600'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  notifications.performance ? 'translate-x-6' : 'translate-x-1'
                }`}></div>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Automation Settings */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-gray-800 border border-gray-700 rounded-xl p-6"
        >
          <div className="flex items-center space-x-3 mb-4">
            <Shield className="w-6 h-6 text-green-400" />
            <h3 className="text-lg font-semibold text-white">Otomasyon Ayarları</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Otomatik Bütçe Yönetimi</span>
              <button
                onClick={() => setAutomation(prev => ({ ...prev, autoBudget: !prev.autoBudget }))}
                className={`w-12 h-6 rounded-full transition-colors ${
                  automation.autoBudget ? 'bg-green-600' : 'bg-gray-600'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  automation.autoBudget ? 'translate-x-6' : 'translate-x-1'
                }`}></div>
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Otomatik Optimizasyon</span>
              <button
                onClick={() => setAutomation(prev => ({ ...prev, autoOptimization: !prev.autoOptimization }))}
                className={`w-12 h-6 rounded-full transition-colors ${
                  automation.autoOptimization ? 'bg-green-600' : 'bg-gray-600'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  automation.autoOptimization ? 'translate-x-6' : 'translate-x-1'
                }`}></div>
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Otomatik Raporlama</span>
              <button
                onClick={() => setAutomation(prev => ({ ...prev, autoReports: !prev.autoReports }))}
                className={`w-12 h-6 rounded-full transition-colors ${
                  automation.autoReports ? 'bg-green-600' : 'bg-gray-600'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  automation.autoReports ? 'translate-x-6' : 'translate-x-1'
                }`}></div>
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Otomatik Uyarılar</span>
              <button
                onClick={() => setAutomation(prev => ({ ...prev, autoAlerts: !prev.autoAlerts }))}
                className={`w-12 h-6 rounded-full transition-colors ${
                  automation.autoAlerts ? 'bg-green-600' : 'bg-gray-600'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  automation.autoAlerts ? 'translate-x-6' : 'translate-x-1'
                }`}></div>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Account Settings */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-gray-800 border border-gray-700 rounded-xl p-6"
        >
          <div className="flex items-center space-x-3 mb-4">
            <Database className="w-6 h-6 text-purple-400" />
            <h3 className="text-lg font-semibold text-white">Hesap Ayarları</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Şirket Adı</label>
              <input
                type="text"
                defaultValue="Dezia Digital"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">E-posta</label>
              <input
                type="email"
                defaultValue="admin@deziadigital.com"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Zaman Dilimi</label>
              <select className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white">
                <option>UTC+3 (İstanbul)</option>
                <option>UTC+0 (London)</option>
                <option>UTC-5 (New York)</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Display Settings */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-gray-800 border border-gray-700 rounded-xl p-6"
        >
          <div className="flex items-center space-x-3 mb-4">
            <Palette className="w-6 h-6 text-orange-400" />
            <h3 className="text-lg font-semibold text-white">Görünüm Ayarları</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Tema</label>
              <select className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white">
                <option>Koyu Tema</option>
                <option>Açık Tema</option>
                <option>Otomatik</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Dil</label>
              <select className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white">
                <option>Türkçe</option>
                <option>English</option>
                <option>Deutsch</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Para Birimi</label>
              <select className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white">
                <option>TRY (₺)</option>
                <option>USD ($)</option>
                <option>EUR (€)</option>
              </select>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Save Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="flex justify-end"
      >
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors">
          Ayarları Kaydet
        </button>
      </motion.div>
    </motion.div>
  );
};

export default Settings;