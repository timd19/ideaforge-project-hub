
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Plus, Clock, Check, AlertCircle } from "lucide-react";
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

type Status = "active" | "completed" | "delayed";

interface Project {
  id: number;
  title: string;
  description: string;
  progress: number;
  status: Status;
  serviceNowId: string;
  dueDate: string;
  teamMembers: string[];
  documents: number;
}

export default function Projects() {
  const [filter, setFilter] = useState("");
  
  const projects: Project[] = [
    {
      id: 1,
      title: "Cloud Migration Strategy",
      description: "Developing a migration plan for cloud infrastructure",
      progress: 68,
      status: "active",
      serviceNowId: "PRJ0023451",
      dueDate: "Jun 28, 2025",
      teamMembers: ["JS", "MP", "AL"],
      documents: 7
    },
    {
      id: 2,
      title: "Security Assessment",
      description: "Conducting security audit for client systems",
      progress: 42,
      status: "active",
      serviceNowId: "PRJ0023452",
      dueDate: "Jul 15, 2025",
      teamMembers: ["RB", "KT"],
      documents: 3
    },
    {
      id: 3,
      title: "Automation Framework",
      description: "Building automation tools for deployment",
      progress: 93,
      status: "active",
      serviceNowId: "PRJ0023453",
      dueDate: "Jun 10, 2025",
      teamMembers: ["JS", "MP", "DW", "AL"],
      documents: 12
    },
    {
      id: 4,
      title: "Network Redesign",
      description: "Redesigning network architecture for scalability",
      progress: 100,
      status: "completed",
      serviceNowId: "PRJ0023449",
      dueDate: "May 30, 2025",
      teamMembers: ["JS", "KT"],
      documents: 8
    },
    {
      id: 5,
      title: "Disaster Recovery Plan",
      description: "Creating a comprehensive DR strategy",
      progress: 25,
      status: "delayed",
      serviceNowId: "PRJ0023450",
      dueDate: "May 20, 2025",
      teamMembers: ["MP", "AL", "RB"],
      documents: 5
    },
  ];
  
  const filteredProjects = projects.filter(project => 
    project.title.toLowerCase().includes(filter.toLowerCase()) ||
    project.description.toLowerCase().includes(filter.toLowerCase()) ||
    project.serviceNowId.toLowerCase().includes(filter.toLowerCase())
  );
  
  const statusIcon = (status: Status) => {
    switch (status) {
      case "active":
        return <Clock size={14} className="text-blue-500" />;
      case "completed":
        return <Check size={14} className="text-green-500" />;
      case "delayed":
        return <AlertCircle size={14} className="text-amber-500" />;
    }
  };
  
  const statusBadge = (status: Status) => {
    switch (status) {
      case "active":
        return <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700">Active</Badge>;
      case "completed":
        return <Badge variant="outline" className="border-green-200 bg-green-50 text-green-700">Completed</Badge>;
      case "delayed":
        return <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700">Delayed</Badge>;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Projects</h2>
          <p className="text-muted-foreground">
            Manage and track your solution development projects
          </p>
        </div>
        <Button className="bg-portal-primary hover:bg-portal-primary/90">
          <Plus className="mr-2 h-4 w-4" /> New Project
        </Button>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="relative grow max-w-md">
          <FileText className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            className="pl-10"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
      </div>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Projects</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="delayed">Delayed</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-4 mt-6">
          {filteredProjects.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No projects found.</p>
          ) : (
            filteredProjects.map(project => (
              <Card key={project.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      {project.title}
                    </CardTitle>
                    {statusBadge(project.status)}
                  </div>
                  <CardDescription className="flex items-center justify-between">
                    <span>{project.description}</span>
                    <span className="text-xs font-medium">{project.serviceNowId}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs font-medium">Progress</span>
                    <span className="text-xs font-medium">{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-1.5" />
                  
                  <div className="mt-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className="flex -space-x-2">
                        {project.teamMembers.map((member, i) => (
                          <div 
                            key={i} 
                            className="w-6 h-6 rounded-full bg-portal-primary flex items-center justify-center text-white text-xs ring-2 ring-white"
                          >
                            {member}
                          </div>
                        ))}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {project.documents} documents
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      {statusIcon(project.status)}
                      <span>Due: {project.dueDate}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
        <TabsContent value="active" className="space-y-4 mt-6">
          {filteredProjects
            .filter(p => p.status === "active")
            .map(project => (
              <Card key={project.id} className="overflow-hidden hover:shadow-md transition-shadow">
                {/* Same card content as above */}
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      {project.title}
                    </CardTitle>
                    {statusBadge(project.status)}
                  </div>
                  <CardDescription className="flex items-center justify-between">
                    <span>{project.description}</span>
                    <span className="text-xs font-medium">{project.serviceNowId}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs font-medium">Progress</span>
                    <span className="text-xs font-medium">{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-1.5" />
                  
                  <div className="mt-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className="flex -space-x-2">
                        {project.teamMembers.map((member, i) => (
                          <div 
                            key={i} 
                            className="w-6 h-6 rounded-full bg-portal-primary flex items-center justify-center text-white text-xs ring-2 ring-white"
                          >
                            {member}
                          </div>
                        ))}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {project.documents} documents
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      {statusIcon(project.status)}
                      <span>Due: {project.dueDate}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </TabsContent>
        <TabsContent value="completed" className="space-y-4 mt-6">
          {filteredProjects
            .filter(p => p.status === "completed")
            .map(project => (
              <Card key={project.id} className="overflow-hidden hover:shadow-md transition-shadow">
                {/* Same card content as above */}
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      {project.title}
                    </CardTitle>
                    {statusBadge(project.status)}
                  </div>
                  <CardDescription className="flex items-center justify-between">
                    <span>{project.description}</span>
                    <span className="text-xs font-medium">{project.serviceNowId}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs font-medium">Progress</span>
                    <span className="text-xs font-medium">{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-1.5" />
                  
                  <div className="mt-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className="flex -space-x-2">
                        {project.teamMembers.map((member, i) => (
                          <div 
                            key={i} 
                            className="w-6 h-6 rounded-full bg-portal-primary flex items-center justify-center text-white text-xs ring-2 ring-white"
                          >
                            {member}
                          </div>
                        ))}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {project.documents} documents
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      {statusIcon(project.status)}
                      <span>Due: {project.dueDate}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </TabsContent>
        <TabsContent value="delayed" className="space-y-4 mt-6">
          {filteredProjects
            .filter(p => p.status === "delayed")
            .map(project => (
              <Card key={project.id} className="overflow-hidden hover:shadow-md transition-shadow">
                {/* Same card content as above */}
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      {project.title}
                    </CardTitle>
                    {statusBadge(project.status)}
                  </div>
                  <CardDescription className="flex items-center justify-between">
                    <span>{project.description}</span>
                    <span className="text-xs font-medium">{project.serviceNowId}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs font-medium">Progress</span>
                    <span className="text-xs font-medium">{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-1.5" />
                  
                  <div className="mt-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className="flex -space-x-2">
                        {project.teamMembers.map((member, i) => (
                          <div 
                            key={i} 
                            className="w-6 h-6 rounded-full bg-portal-primary flex items-center justify-center text-white text-xs ring-2 ring-white"
                          >
                            {member}
                          </div>
                        ))}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {project.documents} documents
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      {statusIcon(project.status)}
                      <span>Due: {project.dueDate}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
