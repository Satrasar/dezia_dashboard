import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Download, Calendar, Filter } from 'lucide-react';
import { Campaign } from '../types';

interface ReportsProps {
  campaigns: Campaign[];
}

const Reports: React.FC<ReportsProps> = ({ campaigns }) => {
  const reports = [
    {
      id: 1,
      name: 'Haftalık Performans Raporu',
      description: 'Son 7 günün detaylı analizi',
      lastGenerated: '2 saat önce',
      size: '2.4 MB',
      type: 'PDF'
    },
    {
      id: 2,
      name: 'Aylık Bütçe Raporu',
      description: 'Aylık bütçe kullanımı ve optimizasyon önerileri',
      lastGenerated: '1 gün önce',
      size: '1.8 MB',
      type: 'Excel'
    },
    {
      id: 3,
      name: 'Kampanya Karşılaştırma',
      description: 'Tüm kampanyaların karşılaştırmalı analizi',
      lastGenerated: '3 gün önce',
      size: '3.2 MB',
      type: 'PDF'
    },
    {
      id: 4,
      name: 'ROI Analiz Raporu',
      description: 'Yatırım getirisi detaylı analizi',
      lastGenerated: '1 hafta önce',
      size: '2.1 MB',
      type: 'Excel'
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
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <BarChart3 className="w-8 h-8 text-blue-400" />
          <h1 className="text-3xl font-bold text-white">Raporlar</h1>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
          <Download className="w-4 h-4" />
          <span>Yeni Rapor Oluştur</span>
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-blue-500/20 border border-blue-500/30 rounded-xl p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-300 text-sm">Toplam Rapor</p>
              <p className="text-2xl font-bold text-white">{reports.length}</p>
            </div>
            <BarChart3 className="w-8 h-8 text-blue-400" />
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
              <p className="text-green-300 text-sm">Bu Hafta</p>
              <p className="text-2xl font-bold text-white">3</p>
            </div>
            <Calendar className="w-8 h-8 text-green-400" />
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
              <p className="text-purple-300 text-sm">Toplam Boyut</p>
              <p className="text-2xl font-bold text-white">9.5 MB</p>
            </div>
            <Download className="w-8 h-8 text-purple-400" />
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
              <p className="text-orange-300 text-sm">Otomatik</p>
              <p className="text-2xl font-bold text-white">2</p>
            </div>
            <Filter className="w-8 h-8 text-orange-400" />
          </div>
        </motion.div>
      </div>

      {/* Reports List */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="bg-gray-800 border border-gray-700 rounded-xl p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-4">Mevcut Raporlar</h3>
        <div className="space-y-4">
          {reports.map((report) => (
            <div key={report.id} className="bg-gray-700/30 rounded-lg p-4 hover:bg-gray-700/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      report.type === 'PDF' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'
                    }`}>
                      <BarChart3 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-medium text-white">{report.name}</h4>
                      <p className="text-sm text-gray-400">{report.description}</p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-4">
                    <div className="text-sm text-gray-400">
                      <p>{report.lastGenerated}</p>
                      <p>{report.size} • {report.type}</p>
                    </div>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-sm transition-colors">
                      İndir
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Report Templates */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="bg-gray-800 border border-gray-700 rounded-xl p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-4">Rapor Şablonları</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-700/30 rounded-lg p-4 hover:bg-gray-700/50 transition-colors cursor-pointer">
            <h4 className="font-medium text-white mb-2">Performans Özeti</h4>
            <p className="text-sm text-gray-400 mb-3">CTR, CPC, dönüşüm oranları</p>
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm transition-colors">
              Oluştur
            </button>
          </div>
          <div className="bg-gray-700/30 rounded-lg p-4 hover:bg-gray-700/50 transition-colors cursor-pointer">
            <h4 className="font-medium text-white mb-2">Bütçe Analizi</h4>
            <p className="text-sm text-gray-400 mb-3">Harcama detayları ve optimizasyon</p>
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm transition-colors">
              Oluştur
            </button>
          </div>
          <div className="bg-gray-700/30 rounded-lg p-4 hover:bg-gray-700/50 transition-colors cursor-pointer">
            <h4 className="font-medium text-white mb-2">Hedef Kitle</h4>
            <p className="text-sm text-gray-400 mb-3">Demografik analiz ve öneriler</p>
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm transition-colors">
              Oluştur
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Reports;