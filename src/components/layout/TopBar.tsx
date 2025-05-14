
import React from 'react';
import { Bell, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const TopBar = () => {
  return (
    <div className="h-16 border-b border-gray-200 flex items-center justify-between px-6 bg-white">
      <div className="w-96">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search..." 
            className="pl-10 bg-gray-50 border-0"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          size="icon" 
          className="relative"
        >
          <Bell size={18} />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-portal-primary text-white text-xs flex items-center justify-center rounded-full">
            3
          </span>
        </Button>
        
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-portal-secondary text-white rounded-full flex items-center justify-center">
            <span className="font-medium text-sm">JS</span>
          </div>
          <div>
            <p className="text-sm font-medium">John Smith</p>
            <p className="text-xs text-gray-500">Administrator</p>
          </div>
        </div>
      </div>
    </div>
  );
};
