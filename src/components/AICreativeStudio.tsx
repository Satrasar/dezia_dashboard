import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Palette, 
  Upload, 
  Download, 
  Image, 
  Video, 
  Wand2, 
  Eye, 
  Trash2,
  Copy,
  Edit3,
  Sparkles,
  FileImage,
  Play
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { aiCreativeService, AIGenerationResponse } from '../services/aiCreativeService';

interface GeneratedAsset {
  id: string;
  type: 'image' | 'video';
  url: string;
  prompt: string;
  createdAt: Date;
  originalImage?: string;
  dimensions: string;
  format: string;
}

const AICreativeStudio: React.FC = () => {
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState<'image-to-image' | 'prompt-to-media'>('image-to-image');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [outputType, setOutputType] = useState<'image' | 'video'>('image');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState('');
  const [generatedAssets, setGeneratedAssets] = useState<GeneratedAsset[]>([
    {
      id: '1',
      type: 'image',
      url: 'https://images.pexels.com/photos/1667088/pexels-photo-1667088.jpeg?auto=compress&cs=tinysrgb&w=400',
      prompt: 'Modern minimalist product showcase with soft lighting',
      createdAt: new Date(Date.now() - 3600000),
      dimensions: '1080x1080',
      format: 'PNG'
    },
    {
      id: '2',
      type: 'video',
      url: 'https://images.pexels.com/photos/3945313/pexels-photo-3945313.jpeg?auto=compress&cs=tinysrgb&w=400',
      prompt: 'Dynamic product rotation with particles effect',
      createdAt: new Date(Date.now() - 7200000),
      dimensions: '1920x1080',
      format: 'MP4'
    }
  ]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!prompt || (activeTab === 'image-to-image' && !uploadedImage)) return;

    setIsGenerating(true);
    setGenerationProgress('AI modeli hazırlanıyor...');
    
    try {
      let result: AIGenerationResponse;
      
      if (activeTab === 'image-to-image' && uploadedImage) {
        setGenerationProgress('Görsel dönüştürülüyor...');
        
        // Convert base64 to File object
        const response = await fetch(uploadedImage);
        const blob = await response.blob();
        const file = new File([blob], 'uploaded-image.png', { type: 'image/png' });
        
        result = await aiCreativeService.generateFromImage(file, prompt, outputType);
      } else {
        setGenerationProgress('İçerik oluşturuluyor...');
        result = await aiCreativeService.generateFromPrompt(prompt, outputType);
      }

      if (result.success && result.data) {
        // If needs polling (Replicate async)
        if (result.data.needs_polling && result.data.prediction_id) {
          setGenerationProgress('İşlem tamamlanıyor...');
          const pollingResult = await aiCreativeService.pollForCompletion(result.data.prediction_id);
          
          if (pollingResult.success && pollingResult.data) {
            result = pollingResult;
          }
        }

        if (result.data?.url) {
          const newAsset: GeneratedAsset = {
            id: result.data.id,
            type: result.data.type,
            url: result.data.url,
            prompt: result.data.prompt,
            createdAt: new Date(result.data.created_at),
            originalImage: activeTab === 'image-to-image' ? uploadedImage || undefined : undefined,
            dimensions: result.data.dimensions,
            format: result.data.format
          };
          
          setGeneratedAssets(prev => [newAsset, ...prev]);
          setPrompt('');
          setUploadedImage(null);
        } else {
          throw new Error('Oluşturulan içerik URL\'i alınamadı');
        }
      } else {
        throw new Error(result.error?.message || 'AI generation başarısız');
      }

    } catch (error) {
      console.error('AI Creative generation hatası:', error);
      alert(`Hata: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
    } finally {
      setIsGenerating(false);
      setGenerationProgress('');
    }
  };

  const handleDownload = (asset: GeneratedAsset) => {
    // Simulated download
    const link = document.createElement('a');
    link.href = asset.url;
    link.download = `generated-${asset.type}-${asset.id}.${asset.format.toLowerCase()}`;
    link.click();
  };

  const handleDelete = (id: string) => {
    setGeneratedAssets(prev => prev.filter(asset => asset.id !== id));
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
        <Palette className="w-8 h-8 text-blue-400" />
        <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          AI Görsel Oluşturma Stüdyosu
        </h1>
      </div>

      {/* Tabs */}
      <div className={`border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('image-to-image')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'image-to-image'
                ? 'border-blue-500 text-blue-600'
                : isDark
                ? 'border-transparent text-gray-400 hover:text-gray-300'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Image className="w-4 h-4" />
              <span>Görsel → Görsel/Video</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('prompt-to-media')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'prompt-to-media'
                ? 'border-blue-500 text-blue-600'
                : isDark
                ? 'border-transparent text-gray-400 hover:text-gray-300'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Wand2 className="w-4 h-4" />
              <span>Prompt → Görsel/Video</span>
            </div>
          </button>
        </nav>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Creation Panel */}
        <div className="lg:col-span-2">
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
              {activeTab === 'image-to-image' ? 'Görsel Dönüştürme' : 'Prompt ile Oluşturma'}
            </h3>

            {/* Image Upload (only for image-to-image) */}
            {activeTab === 'image-to-image' && (
              <div className="mb-6">
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Orijinal Görsel
                </label>
                <div className={`border-2 border-dashed rounded-lg p-6 text-center ${
                  isDark 
                    ? 'border-gray-600 bg-gray-700/30' 
                    : 'border-gray-300 bg-gray-50'
                }`}>
                  {uploadedImage ? (
                    <div className="relative">
                      <img 
                        src={uploadedImage} 
                        alt="Uploaded" 
                        className="max-h-48 mx-auto rounded-lg"
                      />
                      <button
                        onClick={() => setUploadedImage(null)}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <Upload className={`mx-auto h-12 w-12 ${
                        isDark ? 'text-gray-400' : 'text-gray-400'
                      }`} />
                      <div className="mt-4">
                        <label className="cursor-pointer">
                          <span className="mt-2 block text-sm font-medium text-blue-600">
                            Görsel Yükle
                          </span>
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageUpload}
                          />
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Prompt Input */}
            <div className="mb-6">
              <label className={`block text-sm font-medium mb-2 ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                AI Prompt
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={
                  activeTab === 'image-to-image' 
                    ? "Bu görseli nasıl dönüştürmek istiyorsunuz? Örn: 'Modern minimalist stil, soft lighting, premium görünüm'"
                    : "Nasıl bir görsel/video oluşturmak istiyorsunuz? Örn: 'Lüks parfüm şişesi, altın detaylar, siyah arka plan'"
                }
                rows={4}
                className={`w-full rounded-lg border px-3 py-2 ${
                  isDark 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
            </div>

            {/* Output Type Selection */}
            <div className="mb-6">
              <label className={`block text-sm font-medium mb-2 ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Çıktı Türü
              </label>
              <div className="flex space-x-4">
                <button
                  onClick={() => setOutputType('image')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg border ${
                    outputType === 'image'
                      ? 'border-blue-500 bg-blue-500/20 text-blue-600'
                      : isDark
                      ? 'border-gray-600 text-gray-400 hover:border-gray-500'
                      : 'border-gray-300 text-gray-600 hover:border-gray-400'
                  }`}
                >
                  <FileImage className="w-4 h-4" />
                  <span>Görsel</span>
                </button>
                <button
                  onClick={() => setOutputType('video')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg border ${
                    outputType === 'video'
                      ? 'border-blue-500 bg-blue-500/20 text-blue-600'
                      : isDark
                      ? 'border-gray-600 text-gray-400 hover:border-gray-500'
                      : 'border-gray-300 text-gray-600 hover:border-gray-400'
                  }`}
                >
                  <Play className="w-4 h-4" />
                  <span>Video</span>
                </button>
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt || (activeTab === 'image-to-image' && !uploadedImage)}
              className={`w-full flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                isGenerating || !prompt || (activeTab === 'image-to-image' && !uploadedImage)
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>{generationProgress || 'Oluşturuluyor...'}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>AI ile Oluştur</span>
                </>
              )}
            </button>
          </motion.div>
        </div>

        {/* Generated Assets */}
        <div className="space-y-4">
          <h3 className={`text-lg font-semibold ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Oluşturulan İçerikler ({generatedAssets.length})
          </h3>
          
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {generatedAssets.map((asset) => (
              <motion.div
                key={asset.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`${
                  isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                } border rounded-lg p-3`}
              >
                <div className="flex items-start space-x-3">
                  <img 
                    src={asset.url} 
                    alt="Generated content"
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      {asset.type === 'image' ? (
                        <FileImage className="w-4 h-4 text-blue-500" />
                      ) : (
                        <Play className="w-4 h-4 text-green-500" />
                      )}
                      <span className={`text-xs ${
                        isDark ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {asset.dimensions} • {asset.format}
                      </span>
                    </div>
                    <p className={`text-sm truncate ${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {asset.prompt}
                    </p>
                    <p className={`text-xs mt-1 ${
                      isDark ? 'text-gray-500' : 'text-gray-400'
                    }`}>
                      {asset.createdAt.toLocaleString('tr-TR')}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleDownload(asset)}
                      className="p-1 text-blue-500 hover:bg-blue-500/20 rounded"
                      title="İndir"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      className="p-1 text-gray-500 hover:bg-gray-500/20 rounded"
                      title="Görüntüle"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      className="p-1 text-gray-500 hover:bg-gray-500/20 rounded"
                      title="Kopyala"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                  <button
                    onClick={() => handleDelete(asset.id)}
                    className="p-1 text-red-500 hover:bg-red-500/20 rounded"
                    title="Sil"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AICreativeStudio;