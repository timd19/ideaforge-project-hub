// Environment and local storage configuration utility

interface AzureOpenAIConfig {
  apiKey: string;
  endpoint: string;
  deploymentName: string;
  apiVersion: string;
}

// Get Azure OpenAI configuration from environment variables or local storage
export const getAzureOpenAIConfig = (): AzureOpenAIConfig => {
  // First try to get from environment variables
  const envApiKey = import.meta.env.VITE_AZURE_OPENAI_API_KEY;
  const envEndpoint = import.meta.env.VITE_AZURE_OPENAI_ENDPOINT;
  const envDeploymentName = import.meta.env.VITE_AZURE_OPENAI_DEPLOYMENT_NAME;
  const envApiVersion = import.meta.env.VITE_AZURE_OPENAI_API_VERSION;

  // If all environment variables are set, use them
  if (envApiKey && envEndpoint && envDeploymentName && envApiVersion) {
    return {
      apiKey: envApiKey,
      endpoint: envEndpoint,
      deploymentName: envDeploymentName,
      apiVersion: envApiVersion
    };
  }

  // Otherwise, try to get from local storage
  try {
    const storedApiKey = localStorage.getItem('azureOpenAI_apiKey');
    const storedEndpoint = localStorage.getItem('azureOpenAI_endpoint');
    const storedDeploymentName = localStorage.getItem('azureOpenAI_deploymentName');
    const storedApiVersion = localStorage.getItem('azureOpenAI_apiVersion');

    return {
      apiKey: storedApiKey || '',
      endpoint: storedEndpoint || '',
      deploymentName: storedDeploymentName || '',
      apiVersion: storedApiVersion || '2023-05-15'
    };
  } catch (error) {
    console.error('Error accessing localStorage:', error);
    return {
      apiKey: '',
      endpoint: '',
      deploymentName: '',
      apiVersion: '2023-05-15'
    };
  }
};

// Save Azure OpenAI configuration to local storage
export const saveAzureOpenAIConfig = (config: AzureOpenAIConfig): void => {
  try {
    localStorage.setItem('azureOpenAI_apiKey', config.apiKey);
    localStorage.setItem('azureOpenAI_endpoint', config.endpoint);
    localStorage.setItem('azureOpenAI_deploymentName', config.deploymentName);
    localStorage.setItem('azureOpenAI_apiVersion', config.apiVersion);
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

