
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Lightbulb, Plus, Search, ThumbsUp, MessageSquare } from "lucide-react";
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';

interface Idea {
  id: number;
  title: string;
  description: string;
  category: "process" | "product" | "technical" | "customer";
  votes: number;
  comments: number;
  author: string;
  date: string;
  status: "new" | "evaluating" | "approved" | "implemented" | "rejected";
}

export default function Ideas() {
  const [newIdeaMode, setNewIdeaMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [aiPrompt, setAiPrompt] = useState("");
  
  const ideas: Idea[] = [
    {
      id: 1,
      title: "Automated Deployment Pipeline for Containerized Apps",
      description: "Create a standardized CI/CD pipeline template for all containerized applications that includes security scanning, performance testing, and automated rollbacks.",
      category: "technical",
      votes: 12,
      comments: 5,
      author: "John Smith",
      date: "Jun 2, 2025",
      status: "evaluating"
    },
    {
      id: 2,
      title: "Customer Success Dashboard",
      description: "Build a real-time dashboard showing customer usage metrics, support tickets, and service health to help account managers be more proactive.",
      category: "customer",
      votes: 8,
      comments: 3,
      author: "Maria Perez",
      date: "Jun 5, 2025",
      status: "new"
    },
    {
      id: 3,
      title: "AI-driven Log Analysis",
      description: "Implement an AI system that can analyze log files to predict potential issues before they cause outages.",
      category: "technical",
      votes: 15,
      comments: 7,
      author: "Robert Brown",
      date: "May 30, 2025",
      status: "approved"
    },
    {
      id: 4,
      title: "Cross-team Knowledge Sharing Process",
      description: "Create a formalized process for teams to share knowledge and learnings from projects to prevent repeating mistakes.",
      category: "process",
      votes: 6,
      comments: 2,
      author: "Alice Lee",
      date: "Jun 8, 2025",
      status: "new"
    },
    {
      id: 5,
      title: "Modular Managed Service Framework",
      description: "Develop a framework that allows us to rapidly compose new managed service offerings from existing modules.",
      category: "product",
      votes: 9,
      comments: 4,
      author: "David Wang",
      date: "Jun 1, 2025",
      status: "implemented"
    },
  ];
  
  const filteredIdeas = ideas.filter(idea => 
    idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    idea.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const getCategoryBadge = (category: Idea["category"]) => {
    switch (category) {
      case "process":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Process</Badge>;
      case "product":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Product</Badge>;
      case "technical":
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Technical</Badge>;
      case "customer":
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Customer</Badge>;
    }
  };
  
  const getStatusBadge = (status: Idea["status"]) => {
    switch (status) {
      case "new":
        return <Badge variant="outline" className="border-blue-200 text-blue-700">New</Badge>;
      case "evaluating":
        return <Badge variant="outline" className="border-amber-200 text-amber-700">Evaluating</Badge>;
      case "approved":
        return <Badge variant="outline" className="border-green-200 text-green-700">Approved</Badge>;
      case "implemented":
        return <Badge variant="outline" className="border-indigo-200 text-indigo-700">Implemented</Badge>;
      case "rejected":
        return <Badge variant="outline" className="border-red-200 text-red-700">Rejected</Badge>;
    }
  };
  
  const renderIdeaCard = (idea: Idea) => (
    <Card key={idea.id} className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">{idea.title}</CardTitle>
          {getCategoryBadge(idea.category)}
        </div>
        <CardDescription className="flex items-center justify-between">
          <span>By {idea.author} • {idea.date}</span>
          {getStatusBadge(idea.status)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm mb-4">{idea.description}</p>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="flex items-center gap-1.5">
              <ThumbsUp size={16} />
              <span>{idea.votes}</span>
            </Button>
            <Button variant="ghost" size="sm" className="flex items-center gap-1.5">
              <MessageSquare size={16} />
              <span>{idea.comments}</span>
            </Button>
          </div>
          <Button variant="outline" size="sm">View Details</Button>
        </div>
      </CardContent>
    </Card>
  );
  
  return (
    <div className="space-y-6">
      {!newIdeaMode ? (
        <>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Ideas Portal</h2>
              <p className="text-muted-foreground">
                Explore and contribute to solution development ideas
              </p>
            </div>
            <Button 
              className="bg-portal-primary hover:bg-portal-primary/90"
              onClick={() => setNewIdeaMode(true)}
            >
              <Plus className="mr-2 h-4 w-4" /> New Idea
            </Button>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative grow max-w-md">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search ideas..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <Tabs defaultValue="all" className="w-full">
            <TabsList>
              <TabsTrigger value="all">All Ideas</TabsTrigger>
              <TabsTrigger value="new">New</TabsTrigger>
              <TabsTrigger value="evaluating">Evaluating</TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
              <TabsTrigger value="implemented">Implemented</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="space-y-4 mt-6">
              {filteredIdeas.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No ideas found. Try a different search term.</p>
              ) : (
                filteredIdeas.map(renderIdeaCard)
              )}
            </TabsContent>
            <TabsContent value="new" className="space-y-4 mt-6">
              {filteredIdeas.filter(idea => idea.status === "new").map(renderIdeaCard)}
            </TabsContent>
            <TabsContent value="evaluating" className="space-y-4 mt-6">
              {filteredIdeas.filter(idea => idea.status === "evaluating").map(renderIdeaCard)}
            </TabsContent>
            <TabsContent value="approved" className="space-y-4 mt-6">
              {filteredIdeas.filter(idea => idea.status === "approved").map(renderIdeaCard)}
            </TabsContent>
            <TabsContent value="implemented" className="space-y-4 mt-6">
              {filteredIdeas.filter(idea => idea.status === "implemented").map(renderIdeaCard)}
            </TabsContent>
          </Tabs>
        </>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">Submit New Idea</h2>
            <Button 
              variant="outline"
              onClick={() => setNewIdeaMode(false)}
            >
              Cancel
            </Button>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Idea Details</CardTitle>
              <CardDescription>Submit your new idea for managed services development</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="title">Title</label>
                <Input id="title" placeholder="Give your idea a clear, concise title" />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="category">Category</label>
                <select 
                  id="category" 
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                >
                  <option value="process">Process Improvement</option>
                  <option value="product">Product Development</option>
                  <option value="technical">Technical Solution</option>
                  <option value="customer">Customer Experience</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="description">Description</label>
                <Textarea 
                  id="description" 
                  placeholder="Describe your idea in detail..." 
                  className="min-h-[120px]"
                />
              </div>
              
              <div className="bg-muted/50 p-4 rounded-lg space-y-4">
                <div className="flex items-center gap-2">
                  <Lightbulb size={18} className="text-amber-500" />
                  <h3 className="font-medium">AI Idea Assistant</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Need help developing your idea? Our AI can help you brainstorm, refine, or expand on your concept.
                </p>
                <div className="flex gap-2">
                  <Input 
                    placeholder="Ask the AI for suggestions..."
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                  />
                  <Button className="bg-portal-secondary hover:bg-portal-secondary/90 shrink-0">
                    Ask AI
                  </Button>
                </div>
              </div>
              
              <div className="pt-4 flex justify-end gap-2">
                <Button variant="outline" onClick={() => setNewIdeaMode(false)}>
                  Cancel
                </Button>
                <Button className="bg-portal-primary hover:bg-portal-primary/90">
                  Submit Idea
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
