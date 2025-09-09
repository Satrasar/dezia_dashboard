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
  Instagram,
  Upload,
  X,
  Download
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAssets } from '../contexts/AssetsContext';

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
  const { generatedAssets } = useAssets();
  const [selectedCreative, setSelectedCreative] = useState<any>(null);
  const [viewingCreative, setViewingCreative] = useState<any>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedFilePreview, setUploadedFilePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
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

  // AI Creative Studio'dan gelen görselleri kullan + örnek görseller
  const availableCreatives = [
    // Kullanıcının yüklediği dosya
    ...(uploadedFile && uploadedFilePreview ? [{
      id: 'uploaded-file',
      type: uploadedFile.type.startsWith('video/') ? 'video' as const : 'image' as const,
      url: uploadedFilePreview,
      prompt: `Kullanıcı tarafından yüklenen ${uploadedFile.name}`,
      isAIGenerated: false,
      isUserUploaded: true
    }] : []),
    ...generatedAssets.map(asset => ({
      id: asset.id,
      type: asset.type,
      url: asset.url,
      prompt: asset.prompt,
      isAIGenerated: true,
      revisedPrompt: asset.revisedPrompt
    })),
    // Örnek görseller (eğer AI görseli yoksa)
    ...(generatedAssets.length === 0 ? [
      {
        id: 'sample-1',
        type: 'image' as const,
        url: 'https://images.pexels.com/photos/1667088/pexels-photo-1667088.jpeg?auto=compress&cs=tinysrgb&w=400',
        prompt: 'Modern minimalist product showcase',
        isAIGenerated: false
      },
      {
        id: 'sample-2',
        type: 'video' as const,
        url: 'https://images.pexels.com/photos/3945313/pexels-photo-3945313.jpeg?auto=compress&cs=tinysrgb&w=400',
        prompt: 'Dynamic product rotation',
        isAIGenerated: false
      }
    ] : [])
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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      alert('Lütfen sadece görsel veya video dosyası yükleyin');
      return;
    }

    setUploadedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedFilePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      processFile(file);
    }
  };

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
            
            {/* File Upload Section */}
            <div className="mb-6">
              <div className={`border-2 border-dashed rounded-lg p-4 text-center transition-all duration-300 ${
                isDark 
                  ? 'border-gray-600 bg-gray-700/30' 
                  : 'border-gray-300 bg-gray-50'
              } ${
                isDragging 
                  ? isDark 
                    ? 'border-blue-500 bg-blue-500/20 shadow-lg scale-105' 
                    : 'border-blue-400 bg-blue-100 shadow-lg scale-105'
                  : ''
              } hover:${
                isDark 
                  ? 'border-gray-500 bg-gray-700/50' 
                  : 'border-gray-400 bg-gray-100'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
                <div className="flex items-center justify-center space-x-4">
                  <Upload className={`w-6 h-6 ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`} />
                  <div>
                    <label className="cursor-pointer">
                      <span className="text-blue-600 hover:text-blue-700 font-medium">
                        Dosya Yükle
                      </span>
                      <span className={`ml-2 text-sm ${
                        isDark ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        veya sürükleyip bırakın
                      </span>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*,video/*"
                        onChange={handleFileUpload}
                      />
                    </label>
                  </div>
                </div>
                {uploadedFile && (
                  <div className="mt-2 text-sm text-green-600">
                    ✅ {uploadedFile.name} yüklendi
                  </div>
                )}
              </div>
            </div>
            
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
                   onError={(e) => {
                    console.error('Kreatif görsel yükleme hatası (DALL-E URL expired):', creative.url);
                    // Sadece DALL-E URL'leri için fallback kullan
                    if (creative.url.includes('oaidalleapiprodscus.blob.core.windows.net')) {
                      e.currentTarget.src = 'https://images.pexels.com/photos/1667088/pexels-photo-1667088.jpeg?auto=compress&cs=tinysrgb&w=1024&h=1024';
                    }
                   }}
                  />
                  <div className="absolute top-2 right-2">
                    {creative.type === 'image' ? (
                      <ImageIcon className="w-5 h-5 text-white bg-black/50 rounded p-1" />
                    ) : (
                      <Play className="w-5 h-5 text-white bg-black/50 rounded p-1" />
                    )}
                  </div>
                  {/* AI Generated Badge */}
                  {creative.isAIGenerated && (
                    <div className="absolute top-2 left-2">
                      <div className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full flex items-center space-x-1">
                        <Sparkles className="w-3 h-3" />
                        <span>AI</span>
                      </div>
                    </div>
                  )}
                  {/* User Uploaded Badge */}
                  {creative.isUserUploaded && (
                    <div className="absolute top-2 left-2">
                      <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center space-x-1">
                        <Upload className="w-3 h-3" />
                        <span>Yüklendi</span>
                      </div>
                    </div>
                  )}
                  {selectedCreative?.id === creative.id && (
                    <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setViewingCreative(creative);
                          }}
                          className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
                        >
                          <Eye className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    </div>
                  )}
                  {/* Görüntüle butonu - seçili olmasa da */}
                  {selectedCreative?.id !== creative.id && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setViewingCreative(creative);
                      }}
                      className="absolute top-2 left-2 p-1 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                      title="Büyüt"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  )}
                  {/* Prompt Tooltip */}
                  <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-2">
                    <p className="truncate">{creative.prompt}</p>
                  </div>
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
            Aktif Kampanyalar ({campaigns.filter(c => c.status === 'active').length})
          </h3>
          
          <div className="space-y-3">
            {campaigns.filter(campaign => campaign.status === 'active').map((campaign) => (
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

      {/* Kreatif Görüntüleme Modal */}
      {viewingCreative && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setViewingCreative(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="max-w-4xl max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`${
              isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            } border rounded-xl p-6`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <h3 className={`text-lg font-semibold ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    Kreatif Önizleme
                  </h3>
                  {viewingCreative?.isAIGenerated && (
                    <div className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full flex items-center space-x-1">
                      <Sparkles className="w-3 h-3" />
                      <span>AI Generated</span>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setViewingCreative(null)}
                  className={`p-2 rounded-lg transition-colors ${
                    isDark 
                      ? 'hover:bg-gray-700 text-gray-400' 
                      : 'hover:bg-gray-100 text-gray-600'
                  }`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="text-center">
                <img 
                  src={viewingCreative?.url} 
                  alt="Creative preview"
                 className="max-w-full h-auto rounded-lg shadow-lg mx-auto mb-4"
                  style={{ maxHeight: '70vh' }}
                />
                
                <div className={`text-sm space-y-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  <p><strong>Prompt:</strong> {viewingCreative?.prompt}</p>
                  {viewingCreative?.revisedPrompt && (
                    <p><strong>DALL-E Revised:</strong> {viewingCreative?.revisedPrompt}</p>
                  )}
                  <p><strong>Tip:</strong> {viewingCreative?.type === 'image' ? 'Görsel' : 'Video'}</p>
                </div>
                
                <div className="flex justify-center space-x-3 mt-6">
                  <button
                    onClick={() => setSelectedCreative(viewingCreative)}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    <span>Bu Kreatifi Seç</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = viewingCreative?.url || '';
                      link.download = `creative-${viewingCreative?.id}.png`;
                      link.target = '_blank';
                      link.click();
                    }}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>İndir</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default MetaAdsPublisher;