import axios from 'axios';
import { getAzureOpenAIConfig } from '@/utils/envConfig';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ChatCompletionRequest {
  messages: ChatMessage[];
  max_tokens?: number;
  temperature?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
  stop?: string[];
}

interface ChatCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export const getAzureOpenAIResponse = async (userMessage: string): Promise<string> => {
  try {
    const config = getAzureOpenAIConfig();
    const { apiKey, endpoint, deploymentName, apiVersion } = config;

    if (!apiKey || !endpoint || !deploymentName) {
      console.error('Azure OpenAI credentials not found');
      return "I'm having trouble connecting to my AI services. Please check your Azure OpenAI configuration in the Settings page.";
    }

    const url = `${endpoint}openai/deployments/${deploymentName}/chat/completions?api-version=${apiVersion}`;

    const systemMessage: ChatMessage = {
      role: 'system',
      content: "You are a Solutions Development Assistant that helps users with projects, ideas, documents, and platform features. Provide helpful, concise responses about project management, ServiceNow integration, document creation, calendar events, idea development, and platform features."
    };

    const messages: ChatMessage[] = [
      systemMessage,
      { role: 'user', content: userMessage }
    ];

    const requestBody: ChatCompletionRequest = {
      messages,
      max_tokens: 800,
      temperature: 0.7,
    };

    const response = await axios.post<ChatCompletionResponse>(
      url,
      requestBody,
      {
        headers: {
          'Content-Type': 'application/json',
          'api-key': apiKey,
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error calling Azure OpenAI:', error);
    if (axios.isAxiosError(error) && error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
      
      if (error.response.status === 401) {
        return "Authentication failed. Please check your Azure OpenAI API key in the Settings page.";
      } else if (error.response.status === 404) {
        return "Could not find the specified Azure OpenAI deployment. Please check your endpoint and deployment name in the Settings page.";
      }
    }
    
    return "I'm sorry, I encountered an error while processing your request. Please check your Azure OpenAI configuration in the Settings page.";
  }
};
