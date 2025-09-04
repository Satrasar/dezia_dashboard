export interface AIGenerationRequest {
  formMode: 'image-to-image' | 'text-to-image';
  prompt: string;
  outputType: 'image' | 'video';
  image?: Array<{
    filename: string;
    mimetype: string;
    size: number;
    data: string; // base64 data without prefix
  }>; // For image-to-image mode
  submittedAt: string;
}

export interface AIGenerationResponse {
  success: boolean;
  url?: string;
  type?: 'image' | 'video';
  outputType?: string;
  message?: string;
  revisedPrompt?: string;
  originalPrompt?: string;
  enhancedPrompt?: string;
  error?: {
    message: string;
    type: string;
    code: string;
  };
}

export class AICreativeService {
  private baseUrl = '/api/ai-creative'; // Use Vite proxy
  private maxRetries = 2;
  private retryDelay = 1000;

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async makeRequest(requestData: AIGenerationRequest, attempt: number = 1): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout

    console.log('AI Creative API Request:', {
      url: this.baseUrl,
      attempt,
      formMode: requestData.formMode,
      hasImage: !!requestData.image,
      promptLength: requestData.prompt.length
    });

    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      
      console.log('AI Creative API Response:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries())
      });
      
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (attempt < this.maxRetries) {
        console.log(`AI Creative API istek denemesi ${attempt} başarısız, ${this.retryDelay}ms sonra tekrar denenecek...`);
        await this.delay(this.retryDelay * attempt);
        return this.makeRequest(requestData, attempt + 1);
      }
      
      throw error;
    }
  }

  // Helper function to convert File to base64
  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }

  // Generate image from image (image-to-image)
  async generateFromImage(
    imageFile: File, 
    prompt: string, 
    outputType: 'image' | 'video' = 'image'
  ): Promise<AIGenerationResponse> {
    try {
      console.log('AI Creative: Image-to-Image generation başlatılıyor...', prompt);
      
      // Convert file to base64
      const base64Data = await this.fileToBase64(imageFile);
      
      // Remove the data:image/jpeg;base64, prefix to get only base64 data
      const base64Only = base64Data.split(',')[1];
      
      const requestData: AIGenerationRequest = {
        formMode: 'image-to-image',
        prompt: prompt,
        outputType: outputType,
        image: [
          {
            filename: imageFile.name,
            mimetype: imageFile.type,
            size: imageFile.size,
            data: base64Only // Only base64 data without prefix
          }
        ],
        submittedAt: new Date().toISOString()
      };

      console.log('Image-to-Image request data:', {
        fileName: imageFile.name,
        fileSize: imageFile.size,
        mimeType: imageFile.type,
        prompt: prompt,
        hasData: base64Only ? 'yes' : 'no',
        dataLength: base64Only.length
      });

      const response = await this.makeRequest(requestData);

      if (!response.ok) {
        let errorDetails = `HTTP ${response.status}: ${response.statusText}`;
        try {
          const errorBody = await response.text();
          
          // Check if response is HTML (n8n error page)
          if (errorBody.includes('<!DOCTYPE html>') || errorBody.includes('<html')) {
            console.error('n8n workflow returned HTML error page:', errorBody);
            errorDetails = `n8n workflow hatası - Lütfen n8n dashboard'unuzda workflow'u kontrol edin. HTTP ${response.status}`;
          } else {
            console.error('AI Creative API Error Body:', errorBody);
            errorDetails = errorBody || response.statusText;
          }
        } catch (e) {
          console.error('Could not read error response body:', e);
        }
        
        throw new Error(errorDetails);
      }

      const result = await response.json();
      console.log('AI Creative: Image-to-Image başarılı', result);
      
      // n8n workflow response formatını kontrol et
      if (result.success && result.url) {
        return {
          success: true,
          url: result.url,
          type: result.type || 'image',
          message: result.message,
          revisedPrompt: result.revisedPrompt,
          originalPrompt: result.originalPrompt || prompt
        };
      } else if (result.imageUrl) {
        // Alternatif response format
        return {
          success: true,
          url: result.imageUrl,
          type: result.outputType || 'image',
          message: result.message || 'Görsel başarıyla oluşturuldu',
          revisedPrompt: result.revisedPrompt
        };
      } else {
        console.error('Unexpected response format:', result);
        throw new Error('Response formatı beklenenden farklı: ' + JSON.stringify(result));
      }

    } catch (error) {
      console.error('AI Creative Image-to-Image hatası:', error);
      return {
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Bilinmeyen hata',
          type: 'generation_error',
          code: 'IMAGE_TO_IMAGE_FAILED'
        }
      };
    }
  }

  // Generate media from prompt (text-to-image)
  async generateFromPrompt(
    prompt: string, 
    outputType: 'image' | 'video' = 'image'
  ): Promise<AIGenerationResponse> {
    try {
      console.log('AI Creative: Text-to-Image generation başlatılıyor...', prompt, outputType);
      
      const requestData: AIGenerationRequest = {
        formMode: 'text-to-image',
        prompt: prompt,
        outputType: outputType,
        submittedAt: new Date().toISOString()
      };

      console.log('Text-to-Image request data:', requestData);

      const response = await this.makeRequest(requestData);

      if (!response.ok) {
        let errorDetails = `HTTP ${response.status}: ${response.statusText}`;
        try {
          const errorBody = await response.text();
          
          // Check if response is HTML (n8n error page)
          if (errorBody.includes('<!DOCTYPE html>') || errorBody.includes('<html')) {
            console.error('n8n workflow returned HTML error page:', errorBody);
            errorDetails = `n8n workflow hatası - Lütfen n8n dashboard'unuzda workflow'u kontrol edin. HTTP ${response.status}`;
          } else {
            console.error('AI Creative API Error Body:', errorBody);
            errorDetails = errorBody || response.statusText;
          }
        } catch (e) {
          console.error('Could not read error response body:', e);
        }
        
        throw new Error(errorDetails);
      }

      const result = await response.json();
      console.log('AI Creative: Text-to-Image başarılı', result);
      
      // n8n workflow response formatını kontrol et
      if (result.success && result.url) {
        return {
          success: true,
          url: result.url,
          type: result.type || 'image',
          message: result.message,
          revisedPrompt: result.revisedPrompt,
          originalPrompt: result.originalPrompt || prompt
        };
      } else if (result.imageUrl) {
        // Alternatif response format
        return {
          success: true,
          url: result.imageUrl,
          type: result.outputType || 'image',
          message: result.message || 'Görsel başarıyla oluşturuldu',
          revisedPrompt: result.revisedPrompt
        };
      } else {
        console.error('Unexpected response format:', result);
        throw new Error('Response formatı beklenenden farklı: ' + JSON.stringify(result));
      }

    } catch (error) {
      console.error('AI Creative Text-to-Image hatası:', error);
      return {
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Bilinmeyen hata',
          type: 'generation_error',
          code: 'TEXT_TO_IMAGE_FAILED'
        }
      };
    }
  }

  // Get generation history (placeholder)
  async getHistory(): Promise<AIGenerationResponse> {
    return {
      success: true,
      message: 'History feature coming soon'
    };
  }
}

export const aiCreativeService = new AICreativeService();