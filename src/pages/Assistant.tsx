
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MessageSquare, Send, Bot, Info } from "lucide-react";
import { ScrollArea } from '@/components/ui/scroll-area';

interface Message {
  id: number;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
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
  
  const handleSendMessage = () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      content: input,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    
    // Simulate AI response (in a real app, this would call an API)
    setTimeout(() => {
      const aiResponse = getAIResponse(input);
      const aiMessage: Message = {
        id: messages.length + 2,
        content: aiResponse,
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
    }, 1000);
  };
  
  const getAIResponse = (userInput: string): string => {
    // Simple response logic - in a real app this would be replaced with an actual API call
    const input = userInput.toLowerCase();
    
    if (input.includes('project') && input.includes('create')) {
      return "I can help you create a new project! To get started, go to the Projects page and click on 'New Project'. You'll need to specify key information like the project name, description, and team members.";
    } else if (input.includes('servicenow') || input.includes('service now')) {
      return "Our platform integrates with ServiceNow to sync project data. Each project in our system has a corresponding ServiceNow ID that keeps information synchronized between systems. You can view these IDs in the project details.";
    } else if (input.includes('document') && (input.includes('create') || input.includes('new'))) {
      return "You can create new documents in the Document Foundry. We support knowledge base articles, Word documents, PDFs, and PowerPoint presentations. You can also link documents to specific projects as deliverables or supporting materials.";
    } else if (input.includes('idea')) {
      return "The Ideas Portal is where you can submit and explore new ideas for managed services. Our AI can help you develop your ideas further by suggesting features, implementation approaches, or potential challenges to consider.";
    } else if (input.includes('calendar') || input.includes('schedule')) {
      return "The Team Calendar shows all important dates, including project launches, deadlines, and scheduled meetings. You can filter events by project or event type to focus on what's relevant to you.";
    } else {
      return "I'm here to help with managing projects, creating documents, developing ideas, and other aspects of solutions development. Could you provide more details about what you need assistance with?";
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
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">AI Assistant</h2>
        <p className="text-muted-foreground">
          Your intelligent assistant for solutions development
        </p>
      </div>
      
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
            <ScrollArea className="h-[500px] px-4 py-2 border-y">
              <div className="space-y-4 py-4">
                {messages.map(message => (
                  <div 
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-[80%] rounded-lg p-4 ${
                        message.sender === 'user' 
                          ? 'bg-portal-primary text-white' 
                          : 'bg-muted'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className={`text-xs mt-1 ${message.sender === 'user' ? 'text-blue-100' : 'text-muted-foreground'}`}>
                        {formatTimestamp(message.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            
            <div className="p-4 flex gap-2">
              <Input 
                placeholder="Type your message..." 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1"
              />
              <Button 
                onClick={handleSendMessage}
                disabled={!input.trim()}
                className="bg-portal-secondary hover:bg-portal-secondary/90"
              >
                <Send className="h-4 w-4" />
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
