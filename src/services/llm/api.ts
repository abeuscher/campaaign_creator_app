import { Campaign } from '@/types/campaign';

// Define interfaces for common API functionality
export interface LLMAPIConfig {
  apiKey?: string;
  model?: string;
  maxTokens?: number;
}

export interface LLMPrompt {
  content: string;
  systemContext?: string;
}

export interface LLMResponse {
  content: string;
  success: boolean;
  error?: string;
}

// Default models for each provider
const DEFAULT_MODELS = {
  openai: 'gpt-4',
  anthropic: 'claude-3-5-sonnet-20241022',
  mistral: 'mistral-large-latest'
};

// Provider-specific implementations
class MistralAPI {
  private apiKey: string;
  private model: string;

  constructor(config: LLMAPIConfig) {
    this.apiKey = config.apiKey || process.env.NEXT_PUBLIC_MISTRAL_API_KEY || '';
    this.model = config.model || DEFAULT_MODELS.mistral;
  }

  async complete(prompt: LLMPrompt): Promise<LLMResponse> {
    try {
      // Format messages for Mistral
      const messages = [
        ...(prompt.systemContext ? [{ role: 'system', content: prompt.systemContext }] : []),
        { role: 'user', content: prompt.content }
      ];

      const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: this.model,
          messages: messages
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Mistral API error: ${errorData.error?.message || response.statusText}`);
      }

      const data = await response.json();
      return {
        content: data.choices[0].message.content,
        success: true
      };
    } catch (error) {
      console.error('Mistral API error:', error);
      return {
        content: '',
        success: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }
}

class AnthropicAPI {
  private apiKey: string;
  private model: string;
  private maxTokens: number;

  constructor(config: LLMAPIConfig) {
    this.apiKey = config.apiKey || process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY || '';
    this.model = config.model || DEFAULT_MODELS.anthropic;
    this.maxTokens = config.maxTokens || 4096;
  }

  async complete(prompt: LLMPrompt): Promise<LLMResponse> {
    try {
      // Format as Anthropic requires
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: this.model,
          max_tokens: this.maxTokens,
          messages: [{ role: 'user', content: prompt.content }],
          system: prompt.systemContext || ''
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Anthropic API error: ${errorData.error?.message || response.statusText}`);
      }

      const data = await response.json();
      return {
        content: data.content[0].text,
        success: true
      };
    } catch (error) {
      console.error('Anthropic API error:', error);
      return {
        content: '',
        success: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }
}

class OpenAIAPI {
  private apiKey: string;
  private model: string;

  constructor(config: LLMAPIConfig) {
    this.apiKey = config.apiKey || process.env.NEXT_PUBLIC_OPENAI_API_KEY || '';
    this.model = config.model || DEFAULT_MODELS.openai;
  }

  async complete(prompt: LLMPrompt): Promise<LLMResponse> {
    try {
      // Format messages for OpenAI
      const messages = [
        ...(prompt.systemContext ? [{ role: 'system', content: prompt.systemContext }] : []),
        { role: 'user', content: prompt.content }
      ];

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: this.model,
          messages: messages
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`OpenAI API error: ${errorData.error?.message || response.statusText}`);
      }

      const data = await response.json();
      return {
        content: data.choices[0].message.content,
        success: true
      };
    } catch (error) {
      console.error('OpenAI API error:', error);
      return {
        content: '',
        success: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }
}

// Factory for creating API instances
export class LLMAPIFactory {
  static createAPI(provider: 'mistral' | 'anthropic' | 'openai', config: LLMAPIConfig = {}): MistralAPI | AnthropicAPI | OpenAIAPI {
    switch (provider) {
      case 'mistral':
        return new MistralAPI(config);
      case 'anthropic':
        return new AnthropicAPI(config);
      case 'openai':
        return new OpenAIAPI(config);
      default:
        throw new Error(`Unsupported provider: ${provider}`);
    }
  }
}

// Main function to call the LLM API
export async function callLLMApi(
  prompt: string,
  systemContext: string = '',
  provider: 'mistral' | 'anthropic' | 'openai' = 'anthropic',
  config: LLMAPIConfig = {}
): Promise<LLMResponse> {
  const api = LLMAPIFactory.createAPI(provider, config);
  return api.complete({ content: prompt, systemContext });
}

// Helper function to extract JSON from LLM response
export function extractJSONFromResponse(response: string): any {
  try {
    // Look for JSON object in the response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error('No JSON found in response');
  } catch (error) {
    console.error('Error extracting JSON:', error);
    throw error;
  }
}