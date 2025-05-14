
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  FileText, 
  Lightbulb, 
  MessageSquare, 
  Settings, 
  File 
} from 'lucide-react';
import { cn } from '@/lib/utils';

type NavItemProps = {
  to: string;
  icon: React.ElementType;
  label: string;
};

const NavItem = ({ to, icon: Icon, label }: NavItemProps) => {
  return (
    <NavLink 
      to={to} 
      className={({ isActive }) => cn(
        "flex items-center gap-3 px-3 py-2 rounded-md text-sidebar-foreground transition-colors",
        isActive 
          ? "bg-sidebar-accent text-white font-medium" 
          : "hover:bg-sidebar-accent/50"
      )}
    >
      <Icon size={18} />
      <span>{label}</span>
    </NavLink>
  );
};

export const Sidebar = () => {
  return (
    <div className="h-screen w-64 bg-sidebar flex flex-col border-r border-sidebar-border">
      <div className="p-5 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-gradient-to-br from-portal-primary to-portal-secondary flex items-center justify-center">
            <span className="text-white font-bold">SD</span>
          </div>
          <h1 className="text-white font-bold text-lg">Solutions Dev</h1>
        </div>
      </div>
      
      <div className="flex-1 py-6 px-3 flex flex-col gap-1">
        <NavItem to="/" icon={LayoutDashboard} label="Dashboard" />
        <NavItem to="/projects" icon={FileText} label="Projects" />
        <NavItem to="/calendar" icon={Calendar} label="Team Calendar" />
        <NavItem to="/ideas" icon={Lightbulb} label="Ideas Portal" />
        <NavItem to="/documents" icon={File} label="Document Foundry" />
        <NavItem to="/assistant" icon={MessageSquare} label="AI Assistant" />
      </div>
      
      <div className="p-4 border-t border-sidebar-border">
        <NavItem to="/settings" icon={Settings} label="Settings" />
      </div>
    </div>
  );
};
