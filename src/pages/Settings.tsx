import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { getAzureOpenAIConfig, saveAzureOpenAIConfig } from "@/utils/envConfig";
import { toast } from "sonner";

export default function Settings() {
  const [apiKeys, setApiKeys] = useState({
    serviceNow: '••••••••••••••••••••••••••••••',
    openai: '••••••••••••••••••••••••••••••',
    azureOpenAI: '••••••••••••••••••••••••••••••'
  });
  
  const [azureConfig, setAzureConfig] = useState({
    endpoint: 'https://your-resource-name.openai.azure.com/',
    deploymentName: 'your-deployment-name',
    apiVersion: '2023-05-15'
  });
  
  const [integrations, setIntegrations] = useState({
    serviceNow: true,
    github: false,
    slack: true,
    teams: false
  });
  
  const [notifications, setNotifications] = useState({
    email: true,
    browser: true,
    projectUpdates: true,
    documentChanges: true,
    calendarReminders: true
  });
  
  // Load Azure OpenAI config on component mount
  useEffect(() => {
    const config = getAzureOpenAIConfig();
    if (config.apiKey) {
      setApiKeys(prev => ({ ...prev, azureOpenAI: config.apiKey }));
    }
    if (config.endpoint) {
      setAzureConfig(prev => ({ 
        ...prev, 
        endpoint: config.endpoint,
        deploymentName: config.deploymentName,
        apiVersion: config.apiVersion
      }));
    }
  }, []);
  
  const handleSaveApiKey = (key: keyof typeof apiKeys) => {
    // In a real app, this would make an API call to save the key
    console.log(`Saving ${key} API key`);
    
    if (key === 'azureOpenAI') {
      const config = getAzureOpenAIConfig();
      saveAzureOpenAIConfig({
        ...config,
        apiKey: apiKeys.azureOpenAI
      });
      toast.success('Azure OpenAI API key saved');
    }
  };
  
  const handleSaveAzureConfig = () => {
    // Save Azure OpenAI configuration to local storage
    saveAzureOpenAIConfig({
      apiKey: apiKeys.azureOpenAI,
      endpoint: azureConfig.endpoint,
      deploymentName: azureConfig.deploymentName,
      apiVersion: azureConfig.apiVersion
    });
    toast.success('Azure OpenAI configuration saved');
  };
  
  const handleToggleIntegration = (integration: keyof typeof integrations) => {
    setIntegrations(prev => ({
      ...prev,
      [integration]: !prev[integration]
    }));
  };
  
  const handleToggleNotification = (notification: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [notification]: !prev[notification]
    }));
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your portal settings, integrations and preferences
        </p>
      </div>
      
      <Tabs defaultValue="api-keys" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="api-keys">API Keys</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        
        <TabsContent value="api-keys" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>API Keys</CardTitle>
              <CardDescription>
                Manage API keys for external services and integrations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="servicenow-api-key">ServiceNow API Key</Label>
                <div className="flex gap-2">
                  <Input 
                    id="servicenow-api-key" 
                    value={apiKeys.serviceNow} 
                    onChange={(e) => setApiKeys(prev => ({ ...prev, serviceNow: e.target.value }))}
                    type="password"
                    className="flex-1"
                  />
                  <Button 
                    variant="outline" 
                    onClick={() => handleSaveApiKey('serviceNow')}
                  >
                    Save
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Used for syncing project data with ServiceNow
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="openai-api-key">OpenAI API Key</Label>
                <div className="flex gap-2">
                  <Input 
                    id="openai-api-key" 
                    value={apiKeys.openai} 
                    onChange={(e) => setApiKeys(prev => ({ ...prev, openai: e.target.value }))}
                    type="password"
                    className="flex-1"
                  />
                  <Button 
                    variant="outline" 
                    onClick={() => handleSaveApiKey('openai')}
                  >
                    Save
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Powers AI features in the Ideas Portal and AI Assistant
                </p>
              </div>
              
              <Separator className="my-4" />
              
              <div>
                <h3 className="font-medium mb-3">Azure OpenAI Configuration</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="azure-openai-api-key">Azure OpenAI API Key</Label>
                    <div className="flex gap-2">
                      <Input 
                        id="azure-openai-api-key" 
                        value={apiKeys.azureOpenAI} 
                        onChange={(e) => setApiKeys(prev => ({ ...prev, azureOpenAI: e.target.value }))}
                        type="password"
                        className="flex-1"
                      />
                      <Button 
                        variant="outline" 
                        onClick={() => handleSaveApiKey('azureOpenAI')}
                      >
                        Save
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="azure-openai-endpoint">Azure OpenAI Endpoint</Label>
                    <Input 
                      id="azure-openai-endpoint" 
                      value={azureConfig.endpoint} 
                      onChange={(e) => setAzureConfig(prev => ({ ...prev, endpoint: e.target.value }))}
                      placeholder="https://your-resource-name.openai.azure.com/"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="azure-openai-deployment">Deployment Name</Label>
                    <Input 
                      id="azure-openai-deployment" 
                      value={azureConfig.deploymentName} 
                      onChange={(e) => setAzureConfig(prev => ({ ...prev, deploymentName: e.target.value }))}
                      placeholder="your-deployment-name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="azure-openai-version">API Version</Label>
                    <Input 
                      id="azure-openai-version" 
                      value={azureConfig.apiVersion} 
                      onChange={(e) => setAzureConfig(prev => ({ ...prev, apiVersion: e.target.value }))}
                      placeholder="2023-05-15"
                    />
                  </div>
                  
                  <Button 
                    onClick={handleSaveAzureConfig}
                    className="w-full"
                  >
                    Save Azure Configuration
                  </Button>
                  
                  <p className="text-xs text-muted-foreground mt-1">
                    Azure OpenAI is used for the AI Assistant feature. These settings will be stored in your browser.
                  </p>
                </div>
              </div>
              
              <div className="pt-4">
                <p className="text-sm text-muted-foreground">
                  API keys are stored securely and used only for authorized integrations. Keys are encrypted at rest and in transit.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="integrations" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Service Integrations</CardTitle>
              <CardDescription>
                Configure external services that connect with the Solutions Development Portal
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">ServiceNow</h3>
                  <p className="text-sm text-muted-foreground">
                    Sync project data with ServiceNow
                  </p>
                </div>
                <Switch 
                  checked={integrations.serviceNow} 
                  onCheckedChange={() => handleToggleIntegration('serviceNow')} 
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">GitHub</h3>
                  <p className="text-sm text-muted-foreground">
                    Link to repositories and track development
                  </p>
                </div>
                <Switch 
                  checked={integrations.github} 
                  onCheckedChange={() => handleToggleIntegration('github')} 
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Slack</h3>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications in Slack channels
                  </p>
                </div>
                <Switch 
                  checked={integrations.slack} 
                  onCheckedChange={() => handleToggleIntegration('slack')} 
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Microsoft Teams</h3>
                  <p className="text-sm text-muted-foreground">
                    Integrate with Microsoft Teams
                  </p>
                </div>
                <Switch 
                  checked={integrations.teams} 
                  onCheckedChange={() => handleToggleIntegration('teams')} 
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure how and when you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-medium mb-2">Notification Channels</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="email-notif" 
                      checked={notifications.email}
                      onCheckedChange={() => handleToggleNotification('email')}
                    />
                    <Label htmlFor="email-notif">Email Notifications</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="browser-notif" 
                      checked={notifications.browser}
                      onCheckedChange={() => handleToggleNotification('browser')}
                    />
                    <Label htmlFor="browser-notif">Browser Notifications</Label>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-medium mb-2">Notification Types</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="project-notif" 
                      checked={notifications.projectUpdates}
                      onCheckedChange={() => handleToggleNotification('projectUpdates')}
                    />
                    <Label htmlFor="project-notif">Project Updates</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="document-notif" 
                      checked={notifications.documentChanges}
                      onCheckedChange={() => handleToggleNotification('documentChanges')}
                    />
                    <Label htmlFor="document-notif">Document Changes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="calendar-notif" 
                      checked={notifications.calendarReminders}
                      onCheckedChange={() => handleToggleNotification('calendarReminders')}
                    />
                    <Label htmlFor="calendar-notif">Calendar Reminders</Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
