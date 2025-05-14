
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  File, 
  FileText, 
  FilePdf, 
  Plus, 
  Search, 
  Upload, 
  Download, 
  Link,
  FileWord,
  Calendar,
  MoreHorizontal
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Document {
  id: number;
  name: string;
  type: "kb" | "pdf" | "docx" | "pptx";
  size?: string;
  author: string;
  project?: string;
  createdAt: string;
  updatedAt: string;
}

export default function Documents() {
  const [searchTerm, setSearchTerm] = useState("");
  const [newDocDialogOpen, setNewDocDialogOpen] = useState(false);
  
  const documents: Document[] = [
    {
      id: 1,
      name: "Cloud Migration Strategy Guide",
      type: "pdf",
      size: "2.4 MB",
      author: "John Smith",
      project: "Cloud Migration Strategy",
      createdAt: "May 15, 2025",
      updatedAt: "Jun 2, 2025"
    },
    {
      id: 2,
      name: "Network Security Best Practices",
      type: "kb",
      author: "Maria Perez",
      project: "Security Assessment",
      createdAt: "Jun 1, 2025",
      updatedAt: "Jun 1, 2025"
    },
    {
      id: 3,
      name: "Client Requirements Documentation",
      type: "docx",
      size: "1.2 MB",
      author: "Robert Brown",
      project: "Cloud Migration Strategy",
      createdAt: "May 20, 2025",
      updatedAt: "May 25, 2025"
    },
    {
      id: 4,
      name: "Automation Framework Overview",
      type: "pptx",
      size: "4.7 MB",
      author: "David Wang",
      project: "Automation Framework",
      createdAt: "Jun 5, 2025",
      updatedAt: "Jun 8, 2025"
    },
    {
      id: 5,
      name: "Security Testing Results",
      type: "pdf",
      size: "3.1 MB",
      author: "Alice Lee",
      project: "Security Assessment",
      createdAt: "Jun 7, 2025",
      updatedAt: "Jun 7, 2025"
    },
  ];
  
  const filteredDocuments = documents.filter(doc => 
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (doc.project && doc.project.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  const getDocIcon = (type: Document["type"]) => {
    switch (type) {
      case "kb":
        return <FileText size={32} className="text-blue-500" />;
      case "pdf":
        return <FilePdf size={32} className="text-red-500" />;
      case "docx":
        return <FileWord size={32} className="text-blue-700" />;
      case "pptx":
        return <File size={32} className="text-orange-500" />;
    }
  };
  
  const getTypeBadge = (type: Document["type"]) => {
    switch (type) {
      case "kb":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Knowledge Base</Badge>;
      case "pdf":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">PDF</Badge>;
      case "docx":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Word</Badge>;
      case "pptx":
        return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">PowerPoint</Badge>;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Document Foundry</h2>
          <p className="text-muted-foreground">
            Create, manage and access solution development documents
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Upload className="mr-2 h-4 w-4" /> Upload
          </Button>
          <Button className="bg-portal-primary hover:bg-portal-primary/90">
            <Plus className="mr-2 h-4 w-4" /> New Document
          </Button>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="relative grow max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search documents..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Documents</TabsTrigger>
          <TabsTrigger value="kb">Knowledge Base</TabsTrigger>
          <TabsTrigger value="pdf">PDF</TabsTrigger>
          <TabsTrigger value="docx">Word</TabsTrigger>
          <TabsTrigger value="pptx">PowerPoint</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 gap-4">
            {filteredDocuments.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No documents found.</p>
            ) : (
              filteredDocuments.map(doc => (
                <Card key={doc.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6 flex items-center gap-4">
                    {getDocIcon(doc.type)}
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{doc.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            {getTypeBadge(doc.type)}
                            {doc.size && <span className="text-xs text-muted-foreground">{doc.size}</span>}
                          </div>
                        </div>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Download className="mr-2 h-4 w-4" /> Download
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Link className="mr-2 h-4 w-4" /> Copy Link
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <FileText className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      
                      <div className="flex justify-between items-center mt-2">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar size={12} />
                          <span>Updated {doc.updatedAt}</span>
                        </div>
                        
                        <div className="flex items-center">
                          <div className="text-xs">
                            {doc.author}
                          </div>
                          {doc.project && (
                            <Badge variant="outline" className="ml-2 text-xs">
                              {doc.project}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
        <TabsContent value="kb" className="mt-6">
          <div className="grid grid-cols-1 gap-4">
            {filteredDocuments
              .filter(doc => doc.type === "kb")
              .map(doc => (
                <Card key={doc.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6 flex items-center gap-4">
                    {getDocIcon(doc.type)}
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{doc.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            {getTypeBadge(doc.type)}
                            {doc.size && <span className="text-xs text-muted-foreground">{doc.size}</span>}
                          </div>
                        </div>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Download className="mr-2 h-4 w-4" /> Download
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Link className="mr-2 h-4 w-4" /> Copy Link
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <FileText className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      
                      <div className="flex justify-between items-center mt-2">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar size={12} />
                          <span>Updated {doc.updatedAt}</span>
                        </div>
                        
                        <div className="flex items-center">
                          <div className="text-xs">
                            {doc.author}
                          </div>
                          {doc.project && (
                            <Badge variant="outline" className="ml-2 text-xs">
                              {doc.project}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>
        <TabsContent value="pdf" className="mt-6">
          <div className="grid grid-cols-1 gap-4">
            {filteredDocuments
              .filter(doc => doc.type === "pdf")
              .map(doc => (
                <Card key={doc.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6 flex items-center gap-4">
                    {getDocIcon(doc.type)}
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{doc.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            {getTypeBadge(doc.type)}
                            {doc.size && <span className="text-xs text-muted-foreground">{doc.size}</span>}
                          </div>
                        </div>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Download className="mr-2 h-4 w-4" /> Download
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Link className="mr-2 h-4 w-4" /> Copy Link
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <FileText className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      
                      <div className="flex justify-between items-center mt-2">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar size={12} />
                          <span>Updated {doc.updatedAt}</span>
                        </div>
                        
                        <div className="flex items-center">
                          <div className="text-xs">
                            {doc.author}
                          </div>
                          {doc.project && (
                            <Badge variant="outline" className="ml-2 text-xs">
                              {doc.project}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>
        <TabsContent value="docx" className="mt-6">
          <div className="grid grid-cols-1 gap-4">
            {filteredDocuments
              .filter(doc => doc.type === "docx")
              .map(doc => (
                <Card key={doc.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6 flex items-center gap-4">
                    {getDocIcon(doc.type)}
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{doc.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            {getTypeBadge(doc.type)}
                            {doc.size && <span className="text-xs text-muted-foreground">{doc.size}</span>}
                          </div>
                        </div>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Download className="mr-2 h-4 w-4" /> Download
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Link className="mr-2 h-4 w-4" /> Copy Link
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <FileText className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      
                      <div className="flex justify-between items-center mt-2">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar size={12} />
                          <span>Updated {doc.updatedAt}</span>
                        </div>
                        
                        <div className="flex items-center">
                          <div className="text-xs">
                            {doc.author}
                          </div>
                          {doc.project && (
                            <Badge variant="outline" className="ml-2 text-xs">
                              {doc.project}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>
        <TabsContent value="pptx" className="mt-6">
          <div className="grid grid-cols-1 gap-4">
            {filteredDocuments
              .filter(doc => doc.type === "pptx")
              .map(doc => (
                <Card key={doc.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6 flex items-center gap-4">
                    {getDocIcon(doc.type)}
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{doc.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            {getTypeBadge(doc.type)}
                            {doc.size && <span className="text-xs text-muted-foreground">{doc.size}</span>}
                          </div>
                        </div>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Download className="mr-2 h-4 w-4" /> Download
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Link className="mr-2 h-4 w-4" /> Copy Link
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <FileText className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      
                      <div className="flex justify-between items-center mt-2">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar size={12} />
                          <span>Updated {doc.updatedAt}</span>
                        </div>
                        
                        <div className="flex items-center">
                          <div className="text-xs">
                            {doc.author}
                          </div>
                          {doc.project && (
                            <Badge variant="outline" className="ml-2 text-xs">
                              {doc.project}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
