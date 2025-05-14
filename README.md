# IdeaForge Project Hub

## Azure OpenAI Integration

This application includes an AI Assistant feature that uses Azure OpenAI to provide intelligent responses. To set up the Azure OpenAI integration, follow these steps:

### Option 1: Environment Variables (Recommended for Development)

1. Create a `.env` file in the root directory of the project
2. Add the following environment variables:

```
VITE_AZURE_OPENAI_API_KEY=your_api_key_here
VITE_AZURE_OPENAI_ENDPOINT=https://your-resource-name.openai.azure.com/
VITE_AZURE_OPENAI_DEPLOYMENT_NAME=your_deployment_name
VITE_AZURE_OPENAI_API_VERSION=2023-05-15
```

3. Replace the placeholder values with your actual Azure OpenAI credentials

### Option 2: Settings UI (For End Users)

Users can configure their Azure OpenAI credentials directly in the application:

1. Navigate to the Settings page
2. Go to the "API Keys" tab
3. Scroll down to the "Azure OpenAI Configuration" section
4. Enter your Azure OpenAI API Key, Endpoint, Deployment Name, and API Version
5. Click "Save Azure Configuration"

These settings will be stored in the browser's local storage.

### Getting Azure OpenAI Credentials

To obtain Azure OpenAI credentials:

1. Create an Azure OpenAI resource in the Azure portal
2. Deploy a model in the Azure OpenAI Studio
3. Get your API key, endpoint, and deployment name from the Azure portal
4. Use the latest API version (e.g., 2023-05-15)

For more information, refer to the [Azure OpenAI documentation](https://learn.microsoft.com/en-us/azure/ai-services/openai/).

## Development

To run the application locally:

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

The application will be available at http://localhost:8080.

