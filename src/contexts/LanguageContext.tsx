import React, { createContext, useContext, useState, useEffect } from 'react';

interface LanguageContextType {
  language: 'tr' | 'en';
  setLanguage: (lang: 'tr' | 'en') => void;
  t: (key: string) => string;
}

const translations = {
  tr: {
    // Header
    'header.title': 'Dezia Ads Dashboard',
    'header.refresh': 'Verileri Yenile',
    'header.notifications': 'Bildirimler',
    'header.settings': 'Ayarlar',
    'header.profile': 'Profil',
    'header.logout': 'Çıkış Yap',
    'header.lastUpdate': 'Son güncelleme',
    
    // Sidebar
    'sidebar.overview': 'Genel Bakış',
    'sidebar.budget': 'Bütçe Analizi',
    'sidebar.performance': 'Performans Metrikleri',
    'sidebar.automation': 'Otomatik Eylemler',
    'sidebar.ai': 'AI Önerileri',
    'sidebar.reports': 'Raporlar',
    'sidebar.settings': 'Ayarlar',
    'sidebar.status': 'Otomatik Sistem',
    'sidebar.active': 'Aktif ve Çalışıyor',
    
    // KPI Cards
    'kpi.totalCampaigns': 'Toplam Kampanya',
    'kpi.activeCampaigns': 'Aktif Kampanya',
    'kpi.totalCost': 'Toplam Maliyet',
    'kpi.ctrRate': 'CTR Oranı',
    'kpi.aiScore': 'AI Performans Skoru',
    'kpi.criticalAlerts': 'Kritik Uyarılar',
    
    // Google Ads Style Cards
    'ads.clicks': 'Tıklamalar',
    'ads.impressions': 'Gösterimler',
    'ads.conversions': 'Dönüşümler',
    'ads.cost': 'Maliyet',
    'ads.vsLastPeriod': 'önceki döneme göre',
    
    // Filters
    'filter.search': 'Kampanya ara...',
    'filter.allPlatforms': 'Tüm Platformlar',
    'filter.facebook': 'Facebook',
    'filter.instagram': 'Instagram',
    'filter.allStatuses': 'Tüm Durumlar',
    'filter.active': 'Aktif',
    'filter.paused': 'Durdurulmuş',
    'filter.alertLevel': 'Uyarı Seviyesi',
    'filter.critical': 'Kritik',
    'filter.warning': 'Uyarı',
    'filter.normal': 'Normal',
    'filter.budgetHistory': 'Bütçe Geçmişi',
    
    // Campaign Cards
    'campaign.active': 'Aktif',
    'campaign.paused': 'Durdurulmuş',
    'campaign.budgetUsage': 'Bütçe Kullanımı',
    'campaign.used': 'kullanıldı',
    'campaign.pause': 'Durdur',
    'campaign.start': 'Başlat',
    'campaign.view': 'Görüntüle',
    'campaign.settings': 'Ayarlar',
    'campaign.detail': 'Detay',
    
    // Budget Analysis
    'budget.title': 'Bütçe Analizi',
    'budget.totalBudget': 'Toplam Bütçe',
    'budget.spent': 'Harcanan',
    'budget.remaining': 'Kalan',
    'budget.efficiency': 'Verimlilik',
    'budget.monthlyTrend': 'Aylık Bütçe Trendi',
    'budget.distribution': 'Bütçe Dağılımı',
    'budget.campaignDetails': 'Kampanya Bütçe Detayları',
    
    // Performance Metrics
    'performance.title': 'Performans Metrikleri',
    'performance.avgCTR': 'Ortalama CTR',
    'performance.avgCPC': 'Ortalama CPC',
    'performance.totalConversions': 'Toplam Dönüşüm',
    'performance.qualityScore': 'Kalite Skoru',
    'performance.ctrCpcTrend': 'CTR & CPC Trendi',
    'performance.radar': 'Performans Radarı',
    'performance.conversionTrend': 'Dönüşüm & Gösterim Trendi',
    
    // Automation
    'automation.title': 'Otomatik Eylemler',
    'automation.active': 'Aktif Otomasyonlar',
    'automation.totalTriggers': 'Toplam Tetikleme',
    'automation.last24h': 'Son 24 Saat',
    'automation.savings': 'Tasarruf',
    'automation.rules': 'Otomasyon Kuralları',
    'automation.recentActions': 'Son Eylemler',
    'automation.createNew': 'Yeni Otomasyon Oluştur',
    
    // AI Recommendations
    'ai.title': 'AI Önerileri',
    'ai.totalRecommendations': 'Toplam Öneri',
    'ai.highPriority': 'Yüksek Öncelik',
    'ai.avgConfidence': 'Ortalama Güven',
    'ai.potentialIncrease': 'Potansiyel Artış',
    'ai.apply': 'Uygula',
    'ai.reject': 'Reddet',
    
    // Reports
    'reports.title': 'Raporlar',
    'reports.total': 'Toplam Rapor',
    'reports.thisWeek': 'Bu Hafta',
    'reports.totalSize': 'Toplam Boyut',
    'reports.automatic': 'Otomatik',
    'reports.available': 'Mevcut Raporlar',
    'reports.templates': 'Rapor Şablonları',
    'reports.download': 'İndir',
    'reports.create': 'Oluştur',
    
    // Settings
    'settings.title': 'Ayarlar',
    'settings.notifications': 'Bildirim Ayarları',
    'settings.automation': 'Otomasyon Ayarları',
    'settings.account': 'Hesap Ayarları',
    'settings.display': 'Görünüm Ayarları',
    'settings.save': 'Ayarları Kaydet',
    
    // Common
    'common.loading': 'Yükleniyor...',
    'common.error': 'Hata',
    'common.retry': 'Tekrar Dene',
    'common.save': 'Kaydet',
    'common.cancel': 'İptal',
    'common.close': 'Kapat',
    'common.edit': 'Düzenle',
    'common.delete': 'Sil',
    'common.add': 'Ekle',
    'common.search': 'Ara',
    'common.filter': 'Filtrele',
    'common.export': 'Dışa Aktar',
    'common.import': 'İçe Aktar',
  },
  en: {
    // Header
    'header.title': 'Dezia Ads Dashboard',
    'header.refresh': 'Refresh Data',
    'header.notifications': 'Notifications',
    'header.settings': 'Settings',
    'header.profile': 'Profile',
    'header.logout': 'Logout',
    'header.lastUpdate': 'Last update',
    
    // Sidebar
    'sidebar.overview': 'Overview',
    'sidebar.budget': 'Budget Analysis',
    'sidebar.performance': 'Performance Metrics',
    'sidebar.automation': 'Automated Actions',
    'sidebar.ai': 'AI Recommendations',
    'sidebar.reports': 'Reports',
    'sidebar.settings': 'Settings',
    'sidebar.status': 'Automated System',
    'sidebar.active': 'Active and Running',
    
    // KPI Cards
    'kpi.totalCampaigns': 'Total Campaigns',
    'kpi.activeCampaigns': 'Active Campaigns',
    'kpi.totalCost': 'Total Cost',
    'kpi.ctrRate': 'CTR Rate',
    'kpi.aiScore': 'AI Performance Score',
    'kpi.criticalAlerts': 'Critical Alerts',
    
    // Google Ads Style Cards
    'ads.clicks': 'Clicks',
    'ads.impressions': 'Impressions',
    'ads.conversions': 'Conversions',
    'ads.cost': 'Cost',
    'ads.vsLastPeriod': 'vs last period',
    
    // Filters
    'filter.search': 'Search campaigns...',
    'filter.allPlatforms': 'All Platforms',
    'filter.facebook': 'Facebook',
    'filter.instagram': 'Instagram',
    'filter.allStatuses': 'All Statuses',
    'filter.active': 'Active',
    'filter.paused': 'Paused',
    'filter.alertLevel': 'Alert Level',
    'filter.critical': 'Critical',
    'filter.warning': 'Warning',
    'filter.normal': 'Normal',
    'filter.budgetHistory': 'Budget History',
    
    // Campaign Cards
    'campaign.active': 'Active',
    'campaign.paused': 'Paused',
    'campaign.budgetUsage': 'Budget Usage',
    'campaign.used': 'used',
    'campaign.pause': 'Pause',
    'campaign.start': 'Start',
    'campaign.view': 'View',
    'campaign.settings': 'Settings',
    'campaign.detail': 'Detail',
    
    // Budget Analysis
    'budget.title': 'Budget Analysis',
    'budget.totalBudget': 'Total Budget',
    'budget.spent': 'Spent',
    'budget.remaining': 'Remaining',
    'budget.efficiency': 'Efficiency',
    'budget.monthlyTrend': 'Monthly Budget Trend',
    'budget.distribution': 'Budget Distribution',
    'budget.campaignDetails': 'Campaign Budget Details',
    
    // Performance Metrics
    'performance.title': 'Performance Metrics',
    'performance.avgCTR': 'Average CTR',
    'performance.avgCPC': 'Average CPC',
    'performance.totalConversions': 'Total Conversions',
    'performance.qualityScore': 'Quality Score',
    'performance.ctrCpcTrend': 'CTR & CPC Trend',
    'performance.radar': 'Performance Radar',
    'performance.conversionTrend': 'Conversion & Impression Trend',
    
    // Automation
    'automation.title': 'Automated Actions',
    'automation.active': 'Active Automations',
    'automation.totalTriggers': 'Total Triggers',
    'automation.last24h': 'Last 24 Hours',
    'automation.savings': 'Savings',
    'automation.rules': 'Automation Rules',
    'automation.recentActions': 'Recent Actions',
    'automation.createNew': 'Create New Automation',
    
    // AI Recommendations
    'ai.title': 'AI Recommendations',
    'ai.totalRecommendations': 'Total Recommendations',
    'ai.highPriority': 'High Priority',
    'ai.avgConfidence': 'Average Confidence',
    'ai.potentialIncrease': 'Potential Increase',
    'ai.apply': 'Apply',
    'ai.reject': 'Reject',
    
    // Reports
    'reports.title': 'Reports',
    'reports.total': 'Total Reports',
    'reports.thisWeek': 'This Week',
    'reports.totalSize': 'Total Size',
    'reports.automatic': 'Automatic',
    'reports.available': 'Available Reports',
    'reports.templates': 'Report Templates',
    'reports.download': 'Download',
    'reports.create': 'Create',
    
    // Settings
    'settings.title': 'Settings',
    'settings.notifications': 'Notification Settings',
    'settings.automation': 'Automation Settings',
    'settings.account': 'Account Settings',
    'settings.display': 'Display Settings',
    'settings.save': 'Save Settings',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.retry': 'Retry',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.close': 'Close',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.add': 'Add',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.export': 'Export',
    'common.import': 'Import',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<'tr' | 'en'>('tr');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as 'tr' | 'en';
    if (savedLanguage && (savedLanguage === 'tr' || savedLanguage === 'en')) {
      setLanguage(savedLanguage);
    }
  }, []);

  const handleSetLanguage = (lang: 'tr' | 'en') => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['tr']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};