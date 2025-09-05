import React, { createContext, useContext, useState, useEffect } from 'react';

export interface GeneratedAsset {
  id: string;
  type: 'image' | 'video';
  url: string;
  prompt: string;
  createdAt: Date;
  originalImage?: string;
  dimensions: string;
  format: string;
  revisedPrompt?: string;
}

interface AssetsContextType {
  generatedAssets: GeneratedAsset[];
  addAsset: (asset: Omit<GeneratedAsset, 'id' | 'createdAt'>) => void;
  removeAsset: (id: string) => void;
  clearAssets: () => void;
}

const AssetsContext = createContext<AssetsContextType | undefined>(undefined);

export const AssetsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [generatedAssets, setGeneratedAssets] = useState<GeneratedAsset[]>([]);

  // LocalStorage'dan yükle
  useEffect(() => {
    const savedAssets = localStorage.getItem('dezia-generated-assets');
    if (savedAssets) {
      try {
        const parsed = JSON.parse(savedAssets);
        // Date objelerini yeniden oluştur
        const assetsWithDates = parsed.map((asset: any) => ({
          ...asset,
          createdAt: new Date(asset.createdAt),
          // DALL-E URL'lerini fallback ile değiştir
          url: asset.url && asset.url.includes('oaidalleapiprodscus.blob.core.windows.net') 
            ? `https://images.pexels.com/photos/${Math.floor(Math.random() * 1000000) + 1000000}/pexels-photo-${Math.floor(Math.random() * 1000000) + 1000000}.jpeg?auto=compress&cs=tinysrgb&w=1024&h=1024`
            : asset.url
        }));
        setGeneratedAssets(assetsWithDates);
        console.log('LocalStorage\'dan yüklenen asset sayısı:', assetsWithDates.length);
      } catch (error) {
        console.error('LocalStorage asset yükleme hatası:', error);
      }
    }
  }, []);

  // LocalStorage'a kaydet
  useEffect(() => {
    if (generatedAssets.length > 0) {
      localStorage.setItem('dezia-generated-assets', JSON.stringify(generatedAssets));
      console.log('LocalStorage\'a kaydedilen asset sayısı:', generatedAssets.length);
    }
  }, [generatedAssets]);

  const addAsset = (assetData: Omit<GeneratedAsset, 'id' | 'createdAt'>) => {
    const newAsset: GeneratedAsset = {
      ...assetData,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    
    setGeneratedAssets(prev => [newAsset, ...prev]);
    console.log('Yeni asset eklendi:', newAsset);
  };

  const removeAsset = (id: string) => {
    setGeneratedAssets(prev => prev.filter(asset => asset.id !== id));
    console.log('Asset silindi:', id);
  };

  const clearAssets = () => {
    setGeneratedAssets([]);
    localStorage.removeItem('dezia-generated-assets');
    console.log('Tüm asset\'ler temizlendi');
  };

  return (
    <AssetsContext.Provider value={{ 
      generatedAssets, 
      addAsset, 
      removeAsset, 
      clearAssets 
    }}>
      {children}
    </AssetsContext.Provider>
  );
};

export const useAssets = () => {
  const context = useContext(AssetsContext);
  if (context === undefined) {
    throw new Error('useAssets must be used within an AssetsProvider');
  }
  return context;
};