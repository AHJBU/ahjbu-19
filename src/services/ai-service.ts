
import { supabase } from '@/lib/supabase';

// Interface for translation request
export interface TranslationRequest {
  text: string;
  sourceLang: string;
  targetLang: string;
}

// Interface for text generation request
export interface TextGenerationRequest {
  prompt: string;
  length?: number;
  temperature?: number;
}

// Interface for AI settings
export interface AISettings {
  apiKey: string;
  provider: 'openai' | 'perplexity' | 'custom';
  model?: string;
  endpoint?: string;
}

// Get AI settings from Supabase
export const getAISettings = async (): Promise<AISettings | null> => {
  try {
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .eq('key', 'ai_settings')
      .single();
    
    if (error || !data) {
      console.error("Error fetching AI settings:", error);
      return null;
    }
    
    return data.value as AISettings;
  } catch (error) {
    console.error("Error in getAISettings:", error);
    return null;
  }
};

// Save AI settings to Supabase
export const saveAISettings = async (settings: AISettings): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('settings')
      .upsert({ key: 'ai_settings', value: settings });
    
    if (error) {
      console.error("Error saving AI settings:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error in saveAISettings:", error);
    return false;
  }
};

// Translate text using AI
export const translateText = async (request: TranslationRequest): Promise<string> => {
  const settings = await getAISettings();
  
  if (!settings || !settings.apiKey) {
    throw new Error('AI settings not configured. Please set up your API key first.');
  }
  
  // For OpenAI
  if (settings.provider === 'openai') {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${settings.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: settings.model || 'gpt-4o',
          messages: [
            {
              role: 'system',
              content: `You are a translator. Translate the following text from ${request.sourceLang} to ${request.targetLang}. Only respond with the translated text, nothing else.`
            },
            {
              role: 'user',
              content: request.text
            }
          ],
          temperature: 0.3,
        })
      });
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message || 'Translation failed');
      }
      
      return data.choices[0].message.content.trim();
    } catch (error) {
      console.error('Translation error:', error);
      throw error;
    }
  }
  
  // For Perplexity
  else if (settings.provider === 'perplexity') {
    try {
      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${settings.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: settings.model || 'llama-3.1-sonar-small-128k-online',
          messages: [
            {
              role: 'system',
              content: `You are a translator. Translate the following text from ${request.sourceLang} to ${request.targetLang}. Only respond with the translated text, nothing else.`
            },
            {
              role: 'user',
              content: request.text
            }
          ],
          temperature: 0.3,
          max_tokens: 4000
        })
      });
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message || 'Translation failed');
      }
      
      return data.choices[0].message.content.trim();
    } catch (error) {
      console.error('Translation error:', error);
      throw error;
    }
  }
  
  // For custom endpoint
  else if (settings.provider === 'custom' && settings.endpoint) {
    try {
      const response = await fetch(settings.endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${settings.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: request.text,
          source_lang: request.sourceLang,
          target_lang: request.targetLang,
        })
      });
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message || 'Translation failed');
      }
      
      return data.translated_text || data.text || '';
    } catch (error) {
      console.error('Translation error:', error);
      throw error;
    }
  }
  
  throw new Error('Invalid AI provider configuration');
};

// Generate text using AI
export const generateText = async (request: TextGenerationRequest): Promise<string> => {
  const settings = await getAISettings();
  
  if (!settings || !settings.apiKey) {
    throw new Error('AI settings not configured. Please set up your API key first.');
  }
  
  // For OpenAI
  if (settings.provider === 'openai') {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${settings.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: settings.model || 'gpt-4o',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful content creator. Generate high-quality content based on the prompt.'
            },
            {
              role: 'user',
              content: request.prompt
            }
          ],
          temperature: request.temperature || 0.7,
          max_tokens: request.length || 1500,
        })
      });
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message || 'Text generation failed');
      }
      
      return data.choices[0].message.content.trim();
    } catch (error) {
      console.error('Text generation error:', error);
      throw error;
    }
  }
  
  // For Perplexity
  else if (settings.provider === 'perplexity') {
    try {
      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${settings.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: settings.model || 'llama-3.1-sonar-small-128k-online',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful content creator. Generate high-quality content based on the prompt.'
            },
            {
              role: 'user',
              content: request.prompt
            }
          ],
          temperature: request.temperature || 0.7,
          max_tokens: request.length || 2000,
        })
      });
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message || 'Text generation failed');
      }
      
      return data.choices[0].message.content.trim();
    } catch (error) {
      console.error('Text generation error:', error);
      throw error;
    }
  }
  
  // For custom endpoint
  else if (settings.provider === 'custom' && settings.endpoint) {
    try {
      const response = await fetch(settings.endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${settings.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: request.prompt,
          length: request.length,
          temperature: request.temperature,
        })
      });
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message || 'Text generation failed');
      }
      
      return data.generated_text || data.text || '';
    } catch (error) {
      console.error('Text generation error:', error);
      throw error;
    }
  }
  
  throw new Error('Invalid AI provider configuration');
};

// Generate image description or suggestions
export const generateImageDescription = async (prompt: string): Promise<string> => {
  return generateText({
    prompt: `Create a detailed image description for: ${prompt}. 
    Include visual details that would help in generating or selecting an image.`,
    temperature: 0.7
  });
};

// Generate SEO suggestions
export const generateSEOSuggestions = async (title: string, content: string): Promise<string> => {
  return generateText({
    prompt: `Generate SEO optimization suggestions for this content. Title: "${title}".
    Content: "${content.substring(0, 1000)}..."
    Provide 5 specific recommendations to improve SEO.`,
    temperature: 0.5
  });
};
