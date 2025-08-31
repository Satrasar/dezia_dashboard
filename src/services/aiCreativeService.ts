export interface AIGenerationRequest {
  action: 'generate' | 'get_history';
  type: 'image-to-image' | 'prompt-to-media';
  prompt: string;
  base_image?: string; // base64 encoded image for image-to-image
  output_type: 'image' | 'video';
  user_id?: string;
}

export interface AIGenerationResponse {
  success: boolean;
  data?: {
    id: string;
    type: 'image' | 'video';
    url: string;
    prompt: string;
    revised_prompt?: string;
    created_at: string;
    dimensions: string;
    format: string;
    processing_time: number;
    ai_model: string;
    user_id: string;
    status?: string;
    prediction_id?: string;
    needs_polling?: boolean;
  };
  error?: {
    message: string;
    type: string;
    code: string;
  };
  timestamp: string;
}

export class AICreativeService {
  private baseUrl = '/api/ai-creative'; // Vite proxy kullan
  private maxRetries = 2;
  private retryDelay = 1000;

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async makeRequest(data: any, attempt: number = 1): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout for AI generation

    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (attempt < this.maxRetries) {
        console.log(`AI Creative API istek denemesi ${attempt} başarısız, ${this.retryDelay}ms sonra tekrar denenecek...`);
        await this.delay(this.retryDelay * attempt);
        return this.makeRequest(data, attempt + 1);
      }
      
      throw error;
    }
  }

  // Convert file to base64
  private async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // Remove data:image/...;base64, prefix
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
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
      
      const base64Image = await this.fileToBase64(imageFile);
      
      const requestData: AIGenerationRequest = {
        action: 'generate',
        type: 'image-to-image',
        prompt,
        base_image: base64Image,
        output_type: outputType,
        user_id: 'dashboard_user'
      };

      const response = await this.makeRequest(requestData);

      if (!response.ok) {
        throw new Error(`AI Creative API hatası (${response.status}): ${response.statusText}`);
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
        },
        timestamp: new Date().toISOString()
      };
    }
  }

  // Generate media from prompt (prompt-to-media)
  async generateFromPrompt(
    prompt: string, 
    outputType: 'image' | 'video' = 'image'
  ): Promise<AIGenerationResponse> {
    try {
      console.log('AI Creative: Prompt-to-Media generation başlatılıyor...', prompt, outputType);
      
      const requestData: AIGenerationRequest = {
        action: 'generate',
        type: 'prompt-to-media',
        prompt,
        output_type: outputType,
        user_id: 'dashboard_user'
      };

      const response = await this.makeRequest(requestData);

      if (!response.ok) {
        throw new Error(`AI Creative API hatası (${response.status}): ${response.statusText}`);
      }

      const result = await response.json();
      console.log('AI Creative: Prompt-to-Media başarılı', result);
      
      return result;

    } catch (error) {
      console.error('AI Creative Prompt-to-Media hatası:', error);
      return {
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Bilinmeyen hata',
          type: 'generation_error',
          code: 'PROMPT_TO_MEDIA_FAILED'
        },
        timestamp: new Date().toISOString()
      };
    }
  }

  // Get generation history
  async getHistory(): Promise<AIGenerationResponse> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`History API hatası (${response.status}): ${response.statusText}`);
      }

      return await response.json();

    } catch (error) {
      console.error('AI Creative History hatası:', error);
      return {
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Bilinmeyen hata',
          type: 'history_error',
          code: 'HISTORY_FETCH_FAILED'
        },
        timestamp: new Date().toISOString()
      };
    }
  }

  // Poll for completion (for async operations like Replicate)
  async pollForCompletion(predictionId: string, maxAttempts: number = 30): Promise<AIGenerationResponse> {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        const response = await fetch(`https://api.replicate.com/v1/predictions/${predictionId}`, {
          headers: {
            'Authorization': `Token ${import.meta.env.VITE_REPLICATE_API_TOKEN}`,
            'Content-Type': 'application/json',
          }
        });

        if (response.ok) {
          const result = await response.json();
          
          if (result.status === 'succeeded' && result.output) {
            return {
              success: true,
              data: {
                id: predictionId,
                type: 'image',
                url: Array.isArray(result.output) ? result.output[0] : result.output,
                prompt: result.input?.prompt || '',
                created_at: new Date().toISOString(),
                dimensions: '1024x1024',
                format: 'PNG',
                processing_time: 0,
                ai_model: 'stable-diffusion',
                user_id: 'dashboard_user',
                status: 'completed'
              },
              timestamp: new Date().toISOString()
            };
          } else if (result.status === 'failed') {
            return {
              success: false,
              error: {
                message: result.error || 'Generation failed',
                type: 'generation_error',
                code: 'GENERATION_FAILED'
              },
              timestamp: new Date().toISOString()
            };
          }
        }

        // Wait 2 seconds before next poll
        await this.delay(2000);
      } catch (error) {
        console.error(`Polling attempt ${attempt + 1} failed:`, error);
      }
    }

    return {
      success: false,
      error: {
        message: 'Generation timeout - please try again',
        type: 'timeout_error',
        code: 'GENERATION_TIMEOUT'
      },
      timestamp: new Date().toISOString()
    };
  }
}

export const aiCreativeService = new AICreativeService();