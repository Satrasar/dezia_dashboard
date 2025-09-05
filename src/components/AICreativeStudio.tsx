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
  Play,
  X
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAssets } from '../contexts/AssetsContext';
import { aiCreativeService, AIGenerationResponse } from '../services/aiCreativeService';

const AICreativeStudio: React.FC = () => {
  const { isDark } = useTheme();
  const { generatedAssets, addAsset, removeAsset } = useAssets();
  const [activeTab, setActiveTab] = useState<'image-to-image' | 'prompt-to-media'>('image-to-image');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [imagePrompt, setImagePrompt] = useState('');
  const [textPrompt, setTextPrompt] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [outputType, setOutputType] = useState<'image' | 'video'>('image');
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastGeneratedResult, setLastGeneratedResult] = useState<any>(null);
  const [viewingAsset, setViewingAsset] = useState<any>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target?.result as string);
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
      if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
        processFile(file);
      } else {
        alert('Lütfen sadece görsel veya video dosyası yükleyin');
      }
    }
  };

  const handleGenerate = async () => {
    const currentPrompt = activeTab === 'image-to-image' ? imagePrompt : textPrompt;
    
    if (!currentPrompt || (activeTab === 'image-to-image' && !uploadedImage)) return;

    setIsGenerating(true);
    setLastGeneratedResult(null);
    
    try {
      let result: AIGenerationResponse;
      
      if (activeTab === 'image-to-image' && uploadedImage) {
        console.log('Image-to-Image mode: Converting uploaded image...');
        
        // Convert base64 to File object
        const response = await fetch(uploadedImage);
        const blob = await response.blob();
        const file = new File([blob], 'uploaded-image.png', { type: 'image/png' });
        
        console.log('File prepared:', {
          name: file.name,
          size: file.size,
          type: file.type
        });
        
        result = await aiCreativeService.generateFromImage(file, currentPrompt, outputType);
      } else {
        console.log('Text-to-Image mode: Generating from prompt...');
        result = await aiCreativeService.generateFromPrompt(currentPrompt, outputType);
      }

      console.log('Generation result:', result);

      if (result.success && result.url) {
        console.log('✅ Başarılı! Yeni asset ekleniyor:', result.url);
        
        // Önce sonucu göster - state'i doğru güncelle
        const displayResult = {
          success: true,
          url: result.url,
          type: result.type || outputType,
          outputType: result.outputType || outputType,
          message: result.message || 'Görsel başarıyla oluşturuldu!',
          originalPrompt: currentPrompt,
          revisedPrompt: result.revisedPrompt
        };
        
        console.log('Setting lastGeneratedResult:', displayResult);
        setLastGeneratedResult(displayResult);
        
        // Listeye de ekle
        addAsset({
          type: (result.type || outputType) as 'image' | 'video',
          url: result.url,
          prompt: currentPrompt,
          originalImage: activeTab === 'image-to-image' ? uploadedImage : undefined,
          dimensions: '1024x1024',
          format: 'PNG',
          revisedPrompt: result.revisedPrompt || undefined
        });
        
        // Form temizle
        if (activeTab === 'image-to-image') {
          setImagePrompt('');
        } else {
          setTextPrompt('');
        }
        setUploadedImage(null);
      } else {
        console.error('Response başarısız veya URL yok:', result);
        throw new Error(result.error?.message || 'Oluşturulan içerik URL\'i alınamadı');
      }

    } catch (error) {
      console.error('AI Creative generation hatası:', error);
      
      let errorMessage = 'Bilinmeyen hata';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      console.log('Detaylı hata bilgisi:', {
        error,
        message: errorMessage,
        stack: error instanceof Error ? error.stack : 'No stack trace'
      });
      
      // Kullanıcıya daha açıklayıcı hata mesajı göster
      if (errorMessage.includes('JSON')) {
        alert('❌ Sunucudan geçersiz yanıt alındı. n8n workflow\'unun doğru çalıştığından emin olun.');
      } else if (errorMessage.includes('HTTP 500')) {
        alert('❌ Sunucu hatası. n8n workflow\'unda bir sorun var.');
      } else if (errorMessage.includes('HTTP 404')) {
        alert('❌ AI Creative endpoint bulunamadı. n8n workflow URL\'ini kontrol edin.');
      } else {
        alert('❌ Bir hata oluştu: ' + errorMessage);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = (asset: GeneratedAsset) => {
    console.log('İndiriliyor:', asset.url);
    const link = document.createElement('a');
    link.href = asset.url;
    link.download = `ai-generated-${asset.type}-${asset.id}.${asset.format.toLowerCase()}`;
    link.target = '_blank';
    link.click();
  };

  const handleDelete = (id: string) => {
    console.log('Siliniyor:', id);
    removeAsset(id);
  };

  const handleView = (asset: GeneratedAsset) => {
    console.log('Görüntüleniyor:', asset.url);
    setViewingAsset(asset);
  };

  const handleCopy = (asset: GeneratedAsset) => {
    console.log('URL kopyalanıyor:', asset.url);
    navigator.clipboard.writeText(asset.url).then(() => {
      alert('✅ Görsel URL\'i panoya kopyalandı!');
    }).catch(() => {
      alert('❌ Kopyalama başarısız');
    });
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
                } ${
                  isDragging 
                    ? isDark 
                      ? 'border-blue-500 bg-blue-500/10' 
                      : 'border-blue-400 bg-blue-50'
                    : ''
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
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
                value={activeTab === 'image-to-image' ? imagePrompt : textPrompt}
                onChange={(e) => {
                  if (activeTab === 'image-to-image') {
                    setImagePrompt(e.target.value);
                  } else {
                    setTextPrompt(e.target.value);
                  }
                }}
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
              disabled={isGenerating || !(activeTab === 'image-to-image' ? imagePrompt : textPrompt) || (activeTab === 'image-to-image' && !uploadedImage)}
              className={`w-full flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                isGenerating || !(activeTab === 'image-to-image' ? imagePrompt : textPrompt) || (activeTab === 'image-to-image' && !uploadedImage)
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>⏳ Oluşturuluyor...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>AI ile Oluştur</span>
                </>
              )}
            </button>

            {/* Generated Result Display */}
            {lastGeneratedResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-6 ${
                  isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                } border rounded-lg p-4`}
              >
                <h4 className={`text-lg font-semibold mb-3 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  ✨ Oluşturulan {activeTab === 'image-to-image' ? 'Görsel (Image-to-Image)' : 'Görsel (Text-to-Image)'}
                </h4>
                
                <div className="text-center">
                  <img 
                    src={lastGeneratedResult.url} 
                    alt="Generated content"
                    className="max-w-full h-auto rounded-lg shadow-lg mx-auto mb-4"
                    onError={(e) => {
                      console.error('Sonuç görseli yükleme hatası:', lastGeneratedResult.url);
                      e.currentTarget.src = 'https://images.pexels.com/photos/1667088/pexels-photo-1667088.jpeg?auto=compress&cs=tinysrgb&w=400';
                    }}
                    style={{ maxHeight: '400px' }}
                  />
                  
                  <div className={`text-sm space-y-2 ${
                    isDark ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    <p><strong>Orijinal Prompt:</strong> {lastGeneratedResult.originalPrompt}</p>
                    {lastGeneratedResult.revisedPrompt && (
                      <p><strong>DALL-E Revised:</strong> {lastGeneratedResult.revisedPrompt}</p>
                    )}
                  </div>
                  
                  <div className="flex justify-center space-x-3 mt-4">
                    <button
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = lastGeneratedResult.url;
                        link.download = `ai-generated-${Date.now()}.png`;
                        link.click();
                      }}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span>İndir</span>
                    </button>
                    
                    <button
                      onClick={() => setLastGeneratedResult(null)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                        isDark 
                          ? 'bg-gray-600 hover:bg-gray-500 text-white' 
                          : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                      }`}
                    >
                      <X className="w-4 h-4" />
                      <span>Kapat</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
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
                    onError={(e) => {
                      console.error('Görsel yükleme hatası:', asset.url);
                      e.currentTarget.src = 'https://images.pexels.com/photos/1667088/pexels-photo-1667088.jpeg?auto=compress&cs=tinysrgb&w=1024&h=1024';
                    }}
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
                    {asset.revisedPrompt && (
                      <p className={`text-xs mt-1 truncate ${
                        isDark ? 'text-blue-400' : 'text-blue-600'
                      }`}>
                        DALL-E: {asset.revisedPrompt}
                      </p>
                    )}
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
                      className="p-1 text-blue-500 hover:bg-blue-500/20 rounded transition-colors"
                      title="İndir"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleView(asset)}
                      className="p-1 text-gray-500 hover:bg-gray-500/20 rounded transition-colors"
                      title="Görüntüle"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleCopy(asset)}
                      className="p-1 text-gray-500 hover:bg-gray-500/20 rounded transition-colors"
                      title="Kopyala"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                  <button
                    onClick={() => handleDelete(asset.id)}
                    className="p-1 text-red-500 hover:bg-red-500/20 rounded transition-colors"
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

      {/* Görsel Modal */}
      {viewingAsset && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setViewingAsset(null)}
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
                <h3 className={`text-lg font-semibold ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  Görsel Detayı
                </h3>
                <button
                  onClick={() => setViewingAsset(null)}
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
                  src={viewingAsset.url} 
                  alt="Generated content"
                  className="max-w-full h-auto rounded-lg shadow-lg mx-auto mb-4"
                  style={{ maxHeight: '70vh' }}
                />
                
                <div className={`text-sm space-y-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  <p><strong>Orijinal Prompt:</strong> {viewingAsset.prompt}</p>
                  {viewingAsset.revisedPrompt && (
                    <p><strong>DALL-E Revised:</strong> {viewingAsset.revisedPrompt}</p>
                  )}
                  <p><strong>Boyut:</strong> {viewingAsset.dimensions} • <strong>Format:</strong> {viewingAsset.format}</p>
                  <p><strong>Oluşturulma:</strong> {viewingAsset.createdAt.toLocaleString('tr-TR')}</p>
                </div>
                
                <div className="flex justify-center space-x-3 mt-6">
                  <button
                    onClick={() => handleDownload(viewingAsset)}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>İndir</span>
                  </button>
                  
                  <button
                    onClick={() => handleCopy(viewingAsset)}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                    <span>URL Kopyala</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      handleDelete(viewingAsset.id);
                      setViewingAsset(null);
                    }}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Sil</span>
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

export default AICreativeStudio;