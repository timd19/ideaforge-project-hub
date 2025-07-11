import axios from 'axios';
import { getAzureOpenAIConfig } from '@/utils/envConfig';
import { error, debug, info } from '@/utils/logger';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ChatCompletionRequest {
  messages: ChatMessage[];
  max_completion_tokens?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
  stop?: string[];
  stream?: boolean;
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

interface StreamChunk {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    delta: {
      role?: string;
      content?: string;
    };
    finish_reason: string | null;
  }[];
}

export const getAzureOpenAIResponse = async (userMessage: string): Promise<string> => {
  debug('Starting Azure OpenAI request', { userMessage });
  
  try {
    const config = getAzureOpenAIConfig();
    const { apiKey, endpoint, deploymentName, apiVersion } = config;

    if (!apiKey || !endpoint || !deploymentName) {
      error('Azure OpenAI credentials not found', { 
        hasApiKey: !!apiKey, 
        hasEndpoint: !!endpoint, 
        hasDeploymentName: !!deploymentName 
      });
      return "I'm having trouble connecting to my AI services. Please check your Azure OpenAI configuration in the Settings page.";
    }

    const url = `${endpoint}openai/deployments/${deploymentName}/chat/completions?api-version=${apiVersion}`;
    debug('Azure OpenAI request URL', { url, apiVersion });

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
      max_completion_tokens: 800
    };

    debug('Sending request to Azure OpenAI', { 
      deploymentName, 
      messageCount: messages.length,
      requestConfig: { max_completion_tokens: requestBody.max_completion_tokens }
    });

    const response = await axios.post<ChatCompletionResponse>(
      url,
      requestBody,
      {
        headers: {
          'Content-Type': 'application/json',
          'api-key': apiKey,
        },
        timeout: 30000, // 30 second timeout
      }
    );

    info('Azure OpenAI response received', { 
      status: response.status,
      tokenUsage: response.data.usage,
      finishReason: response.data.choices[0].finish_reason
    });

    return response.data.choices[0].message.content;
  } catch (err) {
    const errorObj: any = err;
    
    // Detailed error logging
    error('Error calling Azure OpenAI', { 
      name: errorObj.name,
      message: errorObj.message,
      stack: errorObj.stack,
      isAxiosError: axios.isAxiosError(errorObj)
    });
    
    if (axios.isAxiosError(errorObj)) {
      const axiosError = errorObj;
      
      // Log request details if available
      if (axiosError.config) {
        error('Request details', {
          method: axiosError.config.method,
          url: axiosError.config.url,
          headers: 
            axiosError.config.headers ? 
              { ...axiosError.config.headers, 'api-key': '[REDACTED]' } : 
              'No headers',
          timeout: axiosError.config.timeout
        });
      }
      
      // Log response details if available
      if (axiosError.response) {
        error('Response error details', {
          status: axiosError.response.status,
          statusText: axiosError.response.statusText,
          data: axiosError.response.data,
          headers: axiosError.response.headers
        });
        
        // Return specific error messages based on status code
        if (axiosError.response.status === 401) {
          return "Authentication failed. Please check your Azure OpenAI API key in the Settings page.";
        } else if (axiosError.response.status === 404) {
          return "Could not find the specified Azure OpenAI deployment. Please check your endpoint and deployment name in the Settings page.";
        } else if (axiosError.response.status === 400) {
          return "Bad request to Azure OpenAI. Please check your configuration and try again.";
        } else if (axiosError.response.status === 429) {
          return "Rate limit exceeded. Please try again in a few moments.";
        } else if (axiosError.response.status >= 500) {
          return "Azure OpenAI service is currently experiencing issues. Please try again later.";
        }
      } else if (axiosError.request) {
        // Request was made but no response received
        error('No response received', { request: axiosError.request });
        return "No response received from Azure OpenAI. Please check your internet connection and try again.";
      }
    }
    
    // Generic error message as fallback
    return "I'm sorry, I encountered an error while processing your request. Please check your Azure OpenAI configuration in the Settings page.";
  }
};

// New function for streaming responses
export const streamAzureOpenAIResponse = async (
  userMessage: string, 
  onChunk: (chunk: string) => void,
  onComplete: () => void,
  onError: (errorMessage: string) => void
): Promise<void> => {
  debug('Starting Azure OpenAI streaming request', { userMessage });
  
  try {
    const config = getAzureOpenAIConfig();
    const { apiKey, endpoint, deploymentName, apiVersion } = config;

    if (!apiKey || !endpoint || !deploymentName) {
      error('Azure OpenAI credentials not found', { 
        hasApiKey: !!apiKey, 
        hasEndpoint: !!endpoint, 
        hasDeploymentName: !!deploymentName 
      });
      onError("I'm having trouble connecting to my AI services. Please check your Azure OpenAI configuration in the Settings page.");
      return;
    }

    const url = `${endpoint}openai/deployments/${deploymentName}/chat/completions?api-version=${apiVersion}`;
    debug('Azure OpenAI streaming request URL', { url, apiVersion });

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
      stream: true, // Enable streaming
    };

    debug('Sending streaming request to Azure OpenAI', { 
      deploymentName, 
      messageCount: messages.length,
      requestConfig: { 
        max_tokens: requestBody.max_tokens, 
        temperature: requestBody.temperature,
        stream: requestBody.stream
      }
    });

    const response = await axios.post(
      url,
      requestBody,
      {
        headers: {
          'Content-Type': 'application/json',
          'api-key': apiKey,
          'Accept': 'text/event-stream'
        },
        responseType: 'stream',
        timeout: 60000, // 60 second timeout for streaming
      }
    );

    let buffer = '';
    
    response.data.on('data', (chunk: Buffer) => {
      const chunkText = chunk.toString();
      buffer += chunkText;
      
      // Process complete chunks
      const lines = buffer.split('\n');
      buffer = lines.pop() || ''; // Keep the last incomplete line in the buffer
      
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.substring(6);
          
          // Check for the [DONE] message
          if (data.trim() === '[DONE]') {
            debug('Streaming completed');
            onComplete();
            return;
          }
          
          try {
            const parsed: StreamChunk = JSON.parse(data);
            const content = parsed.choices[0]?.delta?.content || '';
            if (content) {
              onChunk(content);
            }
          } catch (e) {
            debug('Error parsing stream chunk', { chunk: data, error: e });
          }
        }
      }
    });
    
    response.data.on('end', () => {
      debug('Stream ended');
      onComplete();
    });
    
    response.data.on('error', (err: Error) => {
      error('Stream error', { error: err });
      onError("Error in streaming response. Please try again.");
    });
    
  } catch (err) {
    const errorObj: any = err;
    
    // Detailed error logging
    error('Error setting up streaming response', { 
      name: errorObj.name,
      message: errorObj.message,
      stack: errorObj.stack,
      isAxiosError: axios.isAxiosError(errorObj)
    });
    
    let errorMessage = "I'm sorry, I encountered an error while processing your request. Please check your Azure OpenAI configuration in the Settings page.";
    
    if (axios.isAxiosError(errorObj) && errorObj.response) {
      const status = errorObj.response.status;
      
      if (status === 401) {
        errorMessage = "Authentication failed. Please check your Azure OpenAI API key in the Settings page.";
      } else if (status === 404) {
        errorMessage = "Could not find the specified Azure OpenAI deployment. Please check your endpoint and deployment name in the Settings page.";
      } else if (status === 400) {
        errorMessage = "Bad request to Azure OpenAI. Please check your configuration and try again.";
      } else if (status === 429) {
        errorMessage = "Rate limit exceeded. Please try again in a few moments.";
      } else if (status >= 500) {
        errorMessage = "Azure OpenAI service is currently experiencing issues. Please try again later.";
      }
    }
    
    onError(errorMessage);
  }
};
