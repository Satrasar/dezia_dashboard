import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Megaphone, 
  Target, 
  Users, 
  DollarSign, 
  Calendar, 
  MapPin,
  Hash,
  FileText,
  Send,
  Eye,
  Settings,
  Sparkles,
  Image as ImageIcon,
  Play,
  Facebook,
  Instagram
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface AdCampaign {
  id: string;
  name: string;
  creative: {
    type: 'image' | 'video';
    url: string;
    title: string;
    description: string;
  };
  targeting: {
    audience: string;
    ageRange: string;
    location: string;
    interests: string[];
  };
  budget: {
    daily: number;
    total: number;
    duration: number;
  };
  platforms: ('facebook' | 'instagram')[];
  status: 'draft' | 'review' | 'active' | 'paused';
  createdAt: Date;
}

const MetaAdsPublisher: React.FC = () => {
  const { isDark } = useTheme();
  const [selectedCreative, setSelectedCreative] = useState<any>(null);
  const [adForm, setAdForm] = useState({
    campaignName: '',
    adTitle: '',
    adDescription: '',
    callToAction: 'LEARN_MORE',
    targetingType: 'auto',
    customAudience: {
      ageMin: 18,
      ageMax: 65,
      location: 'TR',
      interests: [] as string[],
      behaviors: [] as string[]
    },
    budget: {
      type: 'daily',
      amount: 50,
      duration: 7
    },
    platforms: ['facebook', 'instagram'] as ('facebook' | 'instagram')[],
    hashtags: ''
  });

  const [campaigns, setCampaigns] = useState<AdCampaign[]>([
    {
      id: '1',
      name: 'Yaz Koleksiyonu Tanıtımı',
      creative: {
        type: 'image',
        url: 'https://images.pexels.com/photos/1667088/pexels-photo-1667088.jpeg?auto=compress&cs=tinysrgb&w=400',
        title: 'Yeni Yaz Koleksiyonu',
        description: 'En trend parçalarla yazın keyfini çıkarın!'
      },
      targeting: {
        audience: 'Moda Severler',
        ageRange: '25-45',
        location: 'Türkiye',
        interests: ['Moda', 'Alışveriş', 'Lifestyle']
      },
      budget: {
        daily: 75,
        total: 525,
        duration: 7
      },
      platforms: ['facebook', 'instagram'],
      status: 'active',
      createdAt: new Date(Date.now() - 86400000)
    }
  ]);

  const availableCreatives = [
    {
      id: '1',
      type: 'image',
      url: 'https://images.pexels.com/photos/1667088/pexels-photo-1667088.jpeg?auto=compress&cs=tinysrgb&w=400',
      prompt: 'Modern minimalist product showcase'
    },
    {
      id: '2',
      type: 'video',
      url: 'https://images.pexels.com/photos/3945313/pexels-photo-3945313.jpeg?auto=compress&cs=tinysrgb&w=400',
      prompt: 'Dynamic product rotation'
    }
  ];

  const callToActionOptions = [
    { value: 'LEARN_MORE', label: 'Daha Fazla Bilgi' },
    { value: 'SHOP_NOW', label: 'Hemen Satın Al' },
    { value: 'SIGN_UP', label: 'Kayıt Ol' },
    { value: 'DOWNLOAD', label: 'İndir' },
    { value: 'CONTACT_US', label: 'İletişime Geç' }
  ];

  const interestSuggestions = [
    'Moda', 'Teknoloji', 'Spor', 'Seyahat', 'Yemek', 'Müzik', 
    'Sanat', 'Eğitim', 'Sağlık', 'Güzellik', 'Otomobil', 'Emlak'
  ];

  const handleAITargeting = () => {
    // AI ile görsel analizi yaparak hedef kitle önerisi
    const aiSuggestions = {
      ageRange: '25-45',
      interests: ['Moda', 'Lifestyle', 'Alışveriş'],
      behaviors: ['Online Alışveriş Yapanlar', 'Moda Takipçileri']
    };
    
    setAdForm(prev => ({
      ...prev,
      customAudience: {
        ...prev.customAudience,
        ageMin: 25,
        ageMax: 45,
        interests: aiSuggestions.interests,
        behaviors: aiSuggestions.behaviors
      }
    }));
  };

  const handlePublishAd = async () => {
    if (!selectedCreative || !adForm.campaignName || !adForm.adTitle) {
      alert('Lütfen tüm gerekli alanları doldurun');
      return;
    }

    const newCampaign: AdCampaign = {
      id: Date.now().toString(),
      name: adForm.campaignName,
      creative: {
        type: selectedCreative.type,
        url: selectedCreative.url,
        title: adForm.adTitle,
        description: adForm.adDescription
      },
      targeting: {
        audience: adForm.targetingType === 'auto' ? 'AI Önerisi' : 'Özel Hedef Kitle',
        ageRange: `${adForm.customAudience.ageMin}-${adForm.customAudience.ageMax}`,
        location: adForm.customAudience.location === 'TR' ? 'Türkiye' : 'Global',
        interests: adForm.customAudience.interests
      },
      budget: {
        daily: adForm.budget.amount,
        total: adForm.budget.amount * adForm.budget.duration,
        duration: adForm.budget.duration
      },
      platforms: adForm.platforms,
      status: 'review',
      createdAt: new Date()
    };

    setCampaigns(prev => [newCampaign, ...prev]);
    
    // Form sıfırla
    setSelectedCreative(null);
    setAdForm({
      campaignName: '',
      adTitle: '',
      adDescription: '',
      callToAction: 'LEARN_MORE',
      targetingType: 'auto',
      customAudience: {
        ageMin: 18,
        ageMax: 65,
        location: 'TR',
        interests: [],
        behaviors: []
      },
      budget: {
        type: 'daily',
        amount: 50,
        duration: 7
      },
      platforms: ['facebook', 'instagram'],
      hashtags: ''
    });

    alert('Reklam başarıyla Meta Ads\'e gönderildi!');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Megaphone className="w-8 h-8 text-blue-400" />
        <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Meta Ads Yayınlama
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ad Creation Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Creative Selection */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className={`${
              isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            } border rounded-xl p-6`}
          >
            <h3 className={`text-lg font-semibold mb-4 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              1. Kreatif Seçimi
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {availableCreatives.map((creative) => (
                <div
                  key={creative.id}
                  onClick={() => setSelectedCreative(creative)}
                  className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                    selectedCreative?.id === creative.id
                      ? 'border-blue-500 ring-2 ring-blue-500/20'
                      : isDark
                      ? 'border-gray-600 hover:border-gray-500'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <img 
                    src={creative.url} 
                    alt="Creative"
                    className="w-full h-32 object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    {creative.type === 'image' ? (
                      <ImageIcon className="w-5 h-5 text-white bg-black/50 rounded p-1" />
                    ) : (
                      <Play className="w-5 h-5 text-white bg-black/50 rounded p-1" />
                    )}
                  </div>
                  {selectedCreative?.id === creative.id && (
                    <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <Eye className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Ad Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className={`${
              isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            } border rounded-xl p-6`}
          >
            <h3 className={`text-lg font-semibold mb-4 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              2. Reklam İçeriği
            </h3>

            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Kampanya Adı
                </label>
                <input
                  type="text"
                  value={adForm.campaignName}
                  onChange={(e) => setAdForm(prev => ({ ...prev, campaignName: e.target.value }))}
                  placeholder="Kampanya adını girin"
                  className={`w-full rounded-lg border px-3 py-2 ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Reklam Başlığı
                </label>
                <input
                  type="text"
                  value={adForm.adTitle}
                  onChange={(e) => setAdForm(prev => ({ ...prev, adTitle: e.target.value }))}
                  placeholder="Dikkat çekici başlık yazın"
                  className={`w-full rounded-lg border px-3 py-2 ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Reklam Açıklaması
                </label>
                <textarea
                  value={adForm.adDescription}
                  onChange={(e) => setAdForm(prev => ({ ...prev, adDescription: e.target.value }))}
                  placeholder="Ürün/hizmet açıklaması yazın"
                  rows={3}
                  className={`w-full rounded-lg border px-3 py-2 ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Hashtag'ler
                </label>
                <input
                  type="text"
                  value={adForm.hashtags}
                  onChange={(e) => setAdForm(prev => ({ ...prev, hashtags: e.target.value }))}
                  placeholder="#moda #yaz #trend #alışveriş"
                  className={`w-full rounded-lg border px-3 py-2 ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Eylem Çağrısı
                </label>
                <select
                  value={adForm.callToAction}
                  onChange={(e) => setAdForm(prev => ({ ...prev, callToAction: e.target.value }))}
                  className={`w-full rounded-lg border px-3 py-2 ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                  {callToActionOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>

          {/* Targeting */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={`${
              isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            } border rounded-xl p-6`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-lg font-semibold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                3. Hedef Kitle
              </h3>
              <button
                onClick={handleAITargeting}
                className="flex items-center space-x-2 px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                <span>AI Önerisi</span>
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex space-x-4">
                <button
                  onClick={() => setAdForm(prev => ({ ...prev, targetingType: 'auto' }))}
                  className={`flex-1 p-3 rounded-lg border text-center ${
                    adForm.targetingType === 'auto'
                      ? 'border-blue-500 bg-blue-500/20 text-blue-600'
                      : isDark
                      ? 'border-gray-600 text-gray-400 hover:border-gray-500'
                      : 'border-gray-300 text-gray-600 hover:border-gray-400'
                  }`}
                >
                  <Target className="w-5 h-5 mx-auto mb-1" />
                  <span className="text-sm">AI Otomatik</span>
                </button>
                <button
                  onClick={() => setAdForm(prev => ({ ...prev, targetingType: 'custom' }))}
                  className={`flex-1 p-3 rounded-lg border text-center ${
                    adForm.targetingType === 'custom'
                      ? 'border-blue-500 bg-blue-500/20 text-blue-600'
                      : isDark
                      ? 'border-gray-600 text-gray-400 hover:border-gray-500'
                      : 'border-gray-300 text-gray-600 hover:border-gray-400'
                  }`}
                >
                  <Users className="w-5 h-5 mx-auto mb-1" />
                  <span className="text-sm">Özel Hedef</span>
                </button>
              </div>

              {adForm.targetingType === 'custom' && (
                <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        isDark ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Min Yaş
                      </label>
                      <input
                        type="number"
                        value={adForm.customAudience.ageMin}
                        onChange={(e) => setAdForm(prev => ({
                          ...prev,
                          customAudience: { ...prev.customAudience, ageMin: parseInt(e.target.value) }
                        }))}
                        min="13"
                        max="65"
                        className={`w-full rounded-lg border px-3 py-2 ${
                          isDark 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        isDark ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Max Yaş
                      </label>
                      <input
                        type="number"
                        value={adForm.customAudience.ageMax}
                        onChange={(e) => setAdForm(prev => ({
                          ...prev,
                          customAudience: { ...prev.customAudience, ageMax: parseInt(e.target.value) }
                        }))}
                        min="13"
                        max="65"
                        className={`w-full rounded-lg border px-3 py-2 ${
                          isDark 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      İlgi Alanları
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {interestSuggestions.map(interest => (
                        <button
                          key={interest}
                          onClick={() => {
                            const isSelected = adForm.customAudience.interests.includes(interest);
                            setAdForm(prev => ({
                              ...prev,
                              customAudience: {
                                ...prev.customAudience,
                                interests: isSelected
                                  ? prev.customAudience.interests.filter(i => i !== interest)
                                  : [...prev.customAudience.interests, interest]
                              }
                            }));
                          }}
                          className={`px-3 py-1 rounded-full text-sm transition-colors ${
                            adForm.customAudience.interests.includes(interest)
                              ? 'bg-blue-500 text-white'
                              : isDark
                              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          {interest}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Budget & Platforms */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className={`${
              isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            } border rounded-xl p-6`}
          >
            <h3 className={`text-lg font-semibold mb-4 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              4. Bütçe ve Platform
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Günlük Bütçe (₺)
                  </label>
                  <input
                    type="number"
                    value={adForm.budget.amount}
                    onChange={(e) => setAdForm(prev => ({
                      ...prev,
                      budget: { ...prev.budget, amount: parseInt(e.target.value) }
                    }))}
                    min="10"
                    className={`w-full rounded-lg border px-3 py-2 ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Süre (Gün)
                  </label>
                  <input
                    type="number"
                    value={adForm.budget.duration}
                    onChange={(e) => setAdForm(prev => ({
                      ...prev,
                      budget: { ...prev.budget, duration: parseInt(e.target.value) }
                    }))}
                    min="1"
                    className={`w-full rounded-lg border px-3 py-2 ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                </div>

                <div className={`p-3 rounded-lg ${
                  isDark ? 'bg-gray-700/50' : 'bg-gray-50'
                }`}>
                  <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Toplam Bütçe: <span className="font-semibold">₺{adForm.budget.amount * adForm.budget.duration}</span>
                  </p>
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Yayın Platformları
                </label>
                <div className="space-y-2">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={adForm.platforms.includes('facebook')}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setAdForm(prev => ({
                            ...prev,
                            platforms: [...prev.platforms, 'facebook']
                          }));
                        } else {
                          setAdForm(prev => ({
                            ...prev,
                            platforms: prev.platforms.filter(p => p !== 'facebook')
                          }));
                        }
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <Facebook className="w-5 h-5 text-blue-600" />
                    <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>Facebook</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={adForm.platforms.includes('instagram')}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setAdForm(prev => ({
                            ...prev,
                            platforms: [...prev.platforms, 'instagram']
                          }));
                        } else {
                          setAdForm(prev => ({
                            ...prev,
                            platforms: prev.platforms.filter(p => p !== 'instagram')
                          }));
                        }
                      }}
                      className="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                    />
                    <Instagram className="w-5 h-5 text-pink-600" />
                    <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>Instagram</span>
                  </label>
                </div>
              </div>
            </div>

            <button
              onClick={handlePublishAd}
              className="w-full mt-6 flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              <Send className="w-5 h-5" />
              <span>Meta Ads'e Yayınla</span>
            </button>
          </motion.div>
        </div>

        {/* Campaign List */}
        <div className="space-y-4">
          <h3 className={`text-lg font-semibold ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Aktif Kampanyalar ({campaigns.length})
          </h3>
          
          <div className="space-y-3">
            {campaigns.map((campaign) => (
              <motion.div
                key={campaign.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`${
                  isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                } border rounded-lg p-4`}
              >
                <div className="flex items-start space-x-3">
                  <img 
                    src={campaign.creative.url} 
                    alt="Campaign creative"
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className={`font-medium truncate ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                      {campaign.name}
                    </h4>
                    <p className={`text-sm truncate ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {campaign.creative.title}
                    </p>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        campaign.status === 'active' ? 'bg-green-500/20 text-green-400' :
                        campaign.status === 'review' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {campaign.status === 'active' ? 'Aktif' :
                         campaign.status === 'review' ? 'İncelemede' : 'Taslak'}
                      </span>
                      <span className={`text-xs ${
                        isDark ? 'text-gray-500' : 'text-gray-400'
                      }`}>
                        ₺{campaign.budget.daily}/gün
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 mt-3">
                  {campaign.platforms.map(platform => (
                    <div key={platform} className="flex items-center space-x-1">
                      {platform === 'facebook' ? (
                        <Facebook className="w-4 h-4 text-blue-500" />
                      ) : (
                        <Instagram className="w-4 h-4 text-pink-500" />
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MetaAdsPublisher;