import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MessageSquare, Send, Bot, Info, AlertTriangle, Zap } from "lucide-react";
import { ScrollArea } from '@/components/ui/scroll-area';
import { getAzureOpenAIResponse, streamAzureOpenAIResponse } from '@/services/azureOpenAI';
import { debug, error, info, getLogs, exportLogs } from '@/utils/logger';
import { toast } from 'sonner';
import { MarkdownRenderer } from '@/components/ui/markdown-renderer';

interface Message {
  id: number;
  content: string;
  sender: 'user' | 'ai' | 'system';
  timestamp: Date;
}

interface ExampleQuery {
  text: string;
  icon?: React.ReactNode;
}

export default function Assistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      content: "Hello! I'm your Solutions Development Assistant. I can help you with projects, ideas, documents, and more. What can I assist you with today?",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'error' | 'checking'>('checking');
  const [showDebugPanel, setShowDebugPanel] = useState(false);
  const [useStreaming, setUseStreaming] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  // Example queries that can be clicked
  const exampleQueries: ExampleQuery[] = [
    { text: "How can I create a new project?", icon: <Zap size={14} /> },
    { text: "Tell me about ServiceNow integration", icon: <Zap size={14} /> },
    { text: "What document templates are available?", icon: <Zap size={14} /> },
    { text: "How do I schedule a team meeting?", icon: <Zap size={14} /> },
  ];
  
  // Check connection status on component mount
  useEffect(() => {
    checkConnectionStatus();
  }, []);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  const checkConnectionStatus = async () => {
    try {
      debug('Checking connection status');
      // Simple ping to check if we can connect to Azure OpenAI
      const testResponse = await getAzureOpenAIResponse('ping');
      if (testResponse) {
        info('Connection test successful');
        setConnectionStatus('connected');
      } else {
        error('Connection test failed - empty response');
        setConnectionStatus('error');
        addSystemMessage("Warning: Unable to connect to AI service. Please check your settings.");
      }
    } catch (err) {
      error('Connection test failed with error', err);
      setConnectionStatus('error');
      addSystemMessage("Warning: Unable to connect to AI service. Please check your settings.");
    }
  };
  
  const addSystemMessage = (content: string) => {
    const systemMessage: Message = {
      id: messages.length + 1,
      content,
      sender: 'system',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, systemMessage]);
  };
  
  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;
    
    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      content: input,
      sender: 'user',
      timestamp: new Date()
    };
    
    debug('Sending user message', { messageId: userMessage.id, content: input });
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    if (useStreaming) {
      // Create a placeholder message for streaming
      const streamingMessageId = messages.length + 2;
      const streamingMessage: Message = {
        id: streamingMessageId,
        content: '',
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, streamingMessage]);
      
      try {
        await streamAzureOpenAIResponse(
          userMessage.content,
          // On chunk received
          (chunk: string) => {
            setMessages(prev => {
              const updatedMessages = [...prev];
              const messageIndex = updatedMessages.findIndex(m => m.id === streamingMessageId);
              
              if (messageIndex !== -1) {
                updatedMessages[messageIndex] = {
                  ...updatedMessages[messageIndex],
                  content: updatedMessages[messageIndex].content + chunk
                };
              }
              
              return updatedMessages;
            });
          },
          // On complete
          () => {
            setIsLoading(false);
            info('Streaming response completed');
          },
          // On error
          (errorMessage: string) => {
            setIsLoading(false);
            error('Error in streaming response', { errorMessage });
            
            // Replace the streaming message with an error message
            setMessages(prev => {
              const updatedMessages = [...prev];
              const messageIndex = updatedMessages.findIndex(m => m.id === streamingMessageId);
              
              if (messageIndex !== -1) {
                updatedMessages[messageIndex] = {
                  ...updatedMessages[messageIndex],
                  content: errorMessage,
                  sender: 'system'
                };
              }
              
              return updatedMessages;
            });
          }
        );
      } catch (err) {
        setIsLoading(false);
        error('Exception in streaming response', err);
        
        // Replace the streaming message with an error message
        setMessages(prev => {
          const updatedMessages = [...prev];
          const messageIndex = updatedMessages.findIndex(m => m.id === streamingMessageId);
          
          if (messageIndex !== -1) {
            updatedMessages[messageIndex] = {
              ...updatedMessages[messageIndex],
              content: "I'm sorry, I encountered an error while processing your request. Please try again later.",
              sender: 'system'
            };
          }
          
          return updatedMessages;
        });
      }
    } else {
      // Non-streaming approach
      try {
        // Get response from Azure OpenAI
        info('Requesting AI response');
        const aiResponse = await getAzureOpenAIResponse(input);
        
        if (!aiResponse) {
          throw new Error('Empty response received from AI service');
        }
        
        const aiMessage: Message = {
          id: messages.length + 2,
          content: aiResponse,
          sender: 'ai',
          timestamp: new Date()
        };
        
        info('AI response received', { messageId: aiMessage.id, contentLength: aiResponse.length });
        setMessages(prev => [...prev, aiMessage]);
      } catch (err: any) {
        error('Error getting AI response', { 
          error: err.message || 'Unknown error',
          stack: err.stack
        });
        
        // Add error message
        const errorMessage: Message = {
          id: messages.length + 2,
          content: "I'm sorry, I encountered an error while processing your request. Please try again later or check the debug panel for more information.",
          sender: 'system',
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  const formatTimestamp = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const toggleDebugPanel = () => {
    setShowDebugPanel(prev => !prev);
    if (!showDebugPanel) {
      debug('Debug panel opened');
    }
  };
  
  const copyLogs = () => {
    const logsText = exportLogs();
    navigator.clipboard.writeText(logsText)
      .then(() => {
        toast.success('Logs copied to clipboard');
        debug('Logs copied to clipboard');
      })
      .catch(err => {
        toast.error('Failed to copy logs');
        error('Failed to copy logs', err);
      });
  };
  
  const handleExampleClick = (example: string) => {
    setInput(example);
    // Optional: Auto-send the example
    // setTimeout(() => {
    //   handleSendMessage();
    // }, 100);
  };
  
  const toggleStreaming = () => {
    setUseStreaming(prev => !prev);
    debug(`Streaming ${!useStreaming ? 'enabled' : 'disabled'}`);
    toast.info(`Streaming ${!useStreaming ? 'enabled' : 'disabled'}`);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">AI Assistant</h2>
          <p className="text-muted-foreground">
            Your intelligent assistant for solutions development
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className={`h-3 w-3 rounded-full ${
            connectionStatus === 'connected' ? 'bg-green-500' : 
            connectionStatus === 'error' ? 'bg-red-500' : 'bg-yellow-500'
          }`}></div>
          <span className="text-sm text-muted-foreground">
            {connectionStatus === 'connected' ? 'Connected' : 
             connectionStatus === 'error' ? 'Connection Error' : 'Checking...'}
          </span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={toggleStreaming}
            className="ml-2"
          >
            {useStreaming ? 'Disable Streaming' : 'Enable Streaming'}
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={toggleDebugPanel}
            className="ml-2"
          >
            {showDebugPanel ? 'Hide Debug' : 'Show Debug'}
          </Button>
        </div>
      </div>
      
      {showDebugPanel && (
        <Card className="bg-slate-950 text-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex justify-between items-center">
              <span>Debug Panel</span>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={copyLogs}
                className="text-slate-200 hover:text-white hover:bg-slate-800"
              >
                Copy Logs
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[200px]">
              <pre className="text-xs font-mono">
                {getLogs().map((log, index) => (
                  <div key={index} className={`py-1 ${
                    log.level === 'ERROR' ? 'text-red-400' :
                    log.level === 'WARN' ? 'text-yellow-400' :
                    log.level === 'INFO' ? 'text-blue-400' :
                    'text-slate-400'
                  }`}>
                    [{log.timestamp}] [{log.level}] {log.message}
                    {log.data && (
                      <div className="pl-4 text-slate-500">
                        {JSON.stringify(log.data, null, 2)}
                      </div>
                    )}
                  </div>
                ))}
              </pre>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="md:col-span-3">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-portal-secondary" />
              <span>Solutions Development Assistant</span>
            </CardTitle>
            <CardDescription>
              Ask me anything about projects, documents, ideas, or platform features
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[500px] px-4 py-2 border-y" ref={scrollAreaRef}>
              <div className="space-y-4 py-4">
                {messages.map(message => {
                  const isStreaming = message.sender === 'ai' && isLoading && message.id === messages[messages.length - 1].id;
                  
                  return (
                    <div 
                      key={message.id}
                      className={`flex ${
                        message.sender === 'user' ? 'justify-end' : 
                        message.sender === 'system' ? 'justify-center' : 'justify-start'
                      }`}
                    >
                      <div 
                        className={`${
                          message.sender === 'user' 
                            ? 'max-w-[80%] bg-portal-primary text-white rounded-lg p-4' : 
                          message.sender === 'system'
                            ? 'max-w-[90%] bg-amber-50 border border-amber-200 text-amber-800 rounded-lg p-3 flex items-start gap-2'
                            : 'max-w-[80%] bg-muted rounded-lg p-4'
                        }`}
                      >
                        {message.sender === 'system' && (
                          <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                        )}
                        <div>
                          <div className="message-content">
                            {message.sender === 'ai' ? (
                              <MarkdownRenderer 
                                content={message.content} 
                                isStreaming={isStreaming} 
                              />
                            ) : (
                              <p>{message.content}</p>
                            )}
                          </div>
                          <p className={`text-xs mt-1 ${
                            message.sender === 'user' ? 'text-blue-100' : 
                            message.sender === 'system' ? 'text-amber-600' : 'text-muted-foreground'
                          }`}>
                            {formatTimestamp(message.timestamp)}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {isLoading && !useStreaming && (
                  <div className="flex justify-start">
                    <div className="max-w-[80%] rounded-lg p-4 bg-muted">
                      <p className="text-sm flex items-center gap-2">
                        <span className="animate-pulse">•</span>
                        <span className="animate-pulse delay-100">•</span>
                        <span className="animate-pulse delay-200">•</span>
                      </p>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
            
            {/* Example queries */}
            <div className="p-3 border-b flex flex-wrap gap-2 justify-center">
              {exampleQueries.map((example, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-xs flex items-center gap-1"
                  onClick={() => handleExampleClick(example.text)}
                >
                  {example.icon}
                  {example.text}
                </Button>
              ))}
            </div>
            
            <div className="p-4 flex gap-2">
              <Input 
                placeholder="Type your message..." 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1"
                disabled={isLoading || connectionStatus === 'error'}
              />
              <Button 
                onClick={handleSendMessage}
                disabled={!input.trim() || isLoading || connectionStatus === 'error'}
                className="bg-portal-secondary hover:bg-portal-secondary/90"
              >
                {isLoading && !useStreaming ? (
                  <span className="animate-spin">◌</span>
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Assistant Capabilities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-medium text-sm flex items-center gap-2">
                <MessageSquare size={16} className="text-portal-primary" />
                <span>Ask about:</span>
              </h3>
              <ul className="text-sm space-y-1 pl-6 list-disc text-muted-foreground">
                <li>Project management</li>
                <li>ServiceNow integration</li>
                <li>Document creation</li>
                <li>Calendar events</li>
                <li>Idea development</li>
                <li>Platform features</li>
              </ul>
            </div>
            
            <div className="bg-amber-50 p-3 rounded-md border border-amber-200">
              <div className="flex items-center gap-2 text-amber-800 text-sm font-medium mb-1">
                <Info size={14} />
                <span>Tip</span>
              </div>
              <p className="text-xs text-amber-700">
                Try asking specific questions about features or how to accomplish tasks in the portal for the most helpful responses.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
