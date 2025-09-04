export interface AIGenerationRequest {
  formMode: 'image-to-image' | 'text-to-image';
  prompt: string;
  outputType: 'image' | 'video';
  image?: File; // For image-to-image mode
  submittedAt: string;
}

export interface AIGenerationResponse {
  success: boolean;
  url?: string;
  type?: 'image' | 'video';
  outputType?: string;
  message?: string;
  revisedPrompt?: string;
  error?: {
    message: string;
    type: string;
    code: string;
  };
}

export class AICreativeService {
  private baseUrl = '/api/ai-creative'; // Vite proxy kullan
  private maxRetries = 2;
  private retryDelay = 1000;

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async makeRequest(formData: FormData, attempt: number = 1): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout

    console.log('AI Creative API Request:', {
      url: this.baseUrl,
      attempt,
      formDataKeys: Array.from(formData.keys())
    });

    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        body: formData,
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
        return this.makeRequest(formData, attempt + 1);
      }
      
      throw error;
    }
  }

  // Generate image from image (image-to-image)
  async generateFromImage(
    imageFile: File, 
    prompt: string, 
    outputType: 'image' | 'video' = 'image'
  ): Promise<AIGenerationResponse> {
    try {
      console.log('AI Creative: Image-to-Image generation başlatılıyor...', prompt);
      
      const formData = new FormData();
      formData.append('formMode', 'image-to-image');
      formData.append('prompt', prompt);
      formData.append('outputType', outputType);
      formData.append('image', imageFile);
      formData.append('submittedAt', new Date().toISOString());

      const response = await this.makeRequest(formData);

      if (!response.ok) {
        let errorDetails = response.statusText;
        try {
          const errorBody = await response.text();
          console.error('AI Creative API Error Body:', errorBody);
          errorDetails = errorBody || response.statusText;
        } catch (e) {
          console.error('Could not read error response body:', e);
        }
        
        throw new Error(`AI Creative API hatası (${response.status}): ${errorDetails}`);
      }

      const result = await response.json();
      console.log('AI Creative: Image-to-Image başarılı', result);
      
      return result;

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
      
      const formData = new FormData();
      formData.append('formMode', 'text-to-image');
      formData.append('prompt', prompt);
      formData.append('outputType', outputType);
      formData.append('submittedAt', new Date().toISOString());

      const response = await this.makeRequest(formData);

      if (!response.ok) {
        let errorDetails = response.statusText;
        try {
          const errorBody = await response.text();
          console.error('AI Creative API Error Body:', errorBody);
          errorDetails = errorBody || response.statusText;
        } catch (e) {
          console.error('Could not read error response body:', e);
        }
        
        throw new Error(`AI Creative API hatası (${response.status}): ${errorDetails}`);
      }

      const result = await response.json();
      console.log('AI Creative: Text-to-Image başarılı', result);
      
      return result;

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

  // Get generation history (placeholder - n8n workflow'unuzda history endpoint'i yok)
  async getHistory(): Promise<AIGenerationResponse> {
    return {
      success: true,
      message: 'History feature coming soon'
    };
  }
}

export const aiCreativeService = new AICreativeService();