
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { FileText, Calendar, Lightbulb, MessageSquare, File } from 'lucide-react';

const StatsCard = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  color 
}: { 
  title: string; 
  value: string; 
  subtitle: string; 
  icon: any; 
  color: string;
}) => (
  <Card>
    <CardContent className="p-6 flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <h3 className="text-2xl font-bold mt-1">{value}</h3>
        <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
      </div>
      <div className={`w-12 h-12 rounded-lg bg-${color}-100 flex items-center justify-center`}>
        <Icon size={24} className={`text-${color}-500`} />
      </div>
    </CardContent>
  </Card>
);

const ProjectCard = ({
  title,
  description,
  progress,
  date,
  team,
}: {
  title: string;
  description: string;
  progress: number;
  date: string;
  team: string[];
}) => (
  <Card className="overflow-hidden">
    <CardHeader className="pb-2">
      <CardTitle className="text-lg font-medium">{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="mt-2">
        <div className="flex justify-between mb-1">
          <span className="text-xs font-medium">Progress</span>
          <span className="text-xs font-medium">{progress}%</span>
        </div>
        <Progress value={progress} className="h-1.5" />
      </div>
      <div className="mt-4 flex justify-between items-center">
        <div className="text-xs text-muted-foreground">Due: {date}</div>
        <div className="flex -space-x-2">
          {team.map((member, i) => (
            <div 
              key={i} 
              className="w-6 h-6 rounded-full bg-portal-primary flex items-center justify-center text-white text-xs ring-2 ring-white"
            >
              {member}
            </div>
          ))}
        </div>
      </div>
    </CardContent>
  </Card>
);

export default function Dashboard() {
  const recentProjects = [
    {
      title: "Cloud Migration Strategy",
      description: "Developing a migration plan for cloud infrastructure",
      progress: 68,
      date: "Jun 28",
      team: ["JS", "MP", "AL"]
    },
    {
      title: "Security Assessment",
      description: "Conducting security audit for client systems",
      progress: 42,
      date: "Jul 15",
      team: ["RB", "KT"]
    },
    {
      title: "Automation Framework",
      description: "Building automation tools for deployment",
      progress: 93,
      date: "Jun 10",
      team: ["JS", "MP", "DW", "AL"]
    }
  ];

  const upcomingEvents = [
    { title: "Project Review", date: "Today, 2:00 PM", type: "Meeting" },
    { title: "Cloud Migration Launch", date: "Tomorrow, 10:00 AM", type: "Milestone" },
    { title: "Client Presentation", date: "Jun 15, 11:30 AM", type: "Meeting" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Welcome to the Solutions Development Portal.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard 
          title="Projects" 
          value="12" 
          subtitle="+3 this month" 
          icon={FileText} 
          color="blue"
        />
        <StatsCard 
          title="Upcoming Events" 
          value="8" 
          subtitle="Next: Today, 2PM" 
          icon={Calendar} 
          color="indigo"
        />
        <StatsCard 
          title="Ideas" 
          value="24" 
          subtitle="+7 this month" 
          icon={Lightbulb} 
          color="amber"
        />
        <StatsCard 
          title="Documents" 
          value="53" 
          subtitle="+12 this month" 
          icon={File} 
          color="emerald"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Projects</CardTitle>
            <CardDescription>
              Your most recent development projects
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {recentProjects.map((project, i) => (
              <ProjectCard key={i} {...project} />
            ))}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
            <CardDescription>
              Your schedule for the next few days
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {upcomingEvents.map((event, i) => (
              <div key={i} className="flex justify-between items-start py-2">
                <div>
                  <p className="font-medium text-sm">{event.title}</p>
                  <p className="text-xs text-muted-foreground">{event.date}</p>
                </div>
                <span 
                  className={`text-xs px-2 py-1 rounded-full ${
                    event.type === "Meeting" 
                      ? "bg-blue-100 text-blue-700" 
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {event.type}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
