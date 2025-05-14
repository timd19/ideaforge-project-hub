
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from '@/components/ui/badge';

interface Event {
  id: number;
  title: string;
  description: string;
  date: Date;
  type: "meeting" | "launch" | "deadline" | "milestone";
  project?: string;
}

export default function Calendar() {
  const [date, setDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  // Sample events data
  const events: Event[] = [
    {
      id: 1,
      title: "Project Review Meeting",
      description: "Monthly review for Cloud Migration project",
      date: new Date(2025, 5, 15, 14, 0), // June 15, 2025, 2:00 PM
      type: "meeting",
      project: "Cloud Migration Strategy"
    },
    {
      id: 2,
      title: "Security Assessment Due",
      description: "Final deadline for security audit delivery",
      date: new Date(2025, 6, 15, 0, 0), // July 15, 2025
      type: "deadline",
      project: "Security Assessment"
    },
    {
      id: 3,
      title: "Cloud Migration Launch",
      description: "Go-live for the cloud migration project",
      date: new Date(2025, 5, 28, 10, 0), // June 28, 2025, 10:00 AM
      type: "launch",
      project: "Cloud Migration Strategy"
    },
    {
      id: 4,
      title: "Automation Framework Demo",
      description: "Demo of completed automation tools",
      date: new Date(2025, 5, 10, 15, 30), // June 10, 2025, 3:30 PM
      type: "milestone",
      project: "Automation Framework"
    },
    {
      id: 5,
      title: "Client Presentation",
      description: "Present security findings to client",
      date: new Date(2025, 5, 20, 11, 0), // June 20, 2025, 11:00 AM
      type: "meeting",
      project: "Security Assessment"
    },
  ];

  // Helper to get events for the selected date
  const getSelectedDateEvents = () => {
    if (!selectedDate) return [];
    
    return events.filter(event => 
      event.date.getDate() === selectedDate.getDate() &&
      event.date.getMonth() === selectedDate.getMonth() &&
      event.date.getFullYear() === selectedDate.getFullYear()
    ).sort((a, b) => a.date.getTime() - b.date.getTime());
  };
  
  // Helper to check if a date has events
  const hasEvents = (day: Date) => {
    return events.some(event => 
      event.date.getDate() === day.getDate() &&
      event.date.getMonth() === day.getMonth() &&
      event.date.getFullYear() === day.getFullYear()
    );
  };
  
  // Helper to format time
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Helper to get type badge
  const getTypeBadge = (type: Event["type"]) => {
    switch (type) {
      case "meeting":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Meeting</Badge>;
      case "launch":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Launch</Badge>;
      case "deadline":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Deadline</Badge>;
      case "milestone":
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Milestone</Badge>;
    }
  };
  
  const selectedDateEvents = getSelectedDateEvents();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Team Calendar</h2>
          <p className="text-muted-foreground">
            View and manage team events, launches, and deadlines
          </p>
        </div>
        <Button className="bg-portal-primary hover:bg-portal-primary/90">
          <Plus className="mr-2 h-4 w-4" /> Add Event
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Calendar</CardTitle>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => {
                    const prevMonth = new Date(date);
                    prevMonth.setMonth(prevMonth.getMonth() - 1);
                    setDate(prevMonth);
                  }}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={() => setDate(new Date())}
                >
                  Today
                </Button>
                
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => {
                    const nextMonth = new Date(date);
                    nextMonth.setMonth(nextMonth.getMonth() + 1);
                    setDate(nextMonth);
                  }}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <CardDescription>
              {date.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CalendarComponent
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              month={date}
              onMonthChange={setDate}
              className="rounded-md border"
              components={{
                DayContent: (props) => {
                  const dayHasEvents = hasEvents(props.date);
                  return (
                    <div className="relative">
                      <div>{props.date.getDate()}</div>
                      {dayHasEvents && (
                        <div className="absolute top-7 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-portal-primary rounded-full"></div>
                      )}
                    </div>
                  );
                },
              }}
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>
              {selectedDate 
                ? selectedDate.toLocaleString('default', { weekday: 'long', month: 'long', day: 'numeric' })
                : "Select a date"}
            </CardTitle>
            <CardDescription>
              {selectedDateEvents.length === 0 
                ? "No events scheduled"
                : `${selectedDateEvents.length} events scheduled`}
            </CardDescription>
          </CardHeader>
          <CardContent className="max-h-[500px] overflow-y-auto">
            <div className="space-y-4">
              {selectedDateEvents.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No events for this date.</p>
              ) : (
                selectedDateEvents.map(event => (
                  <div key={event.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium">{event.title}</h3>
                      {getTypeBadge(event.type)}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{event.description}</p>
                    <div className="flex items-center justify-between text-xs">
                      <div className="text-muted-foreground">{formatTime(event.date)}</div>
                      {event.project && (
                        <Badge variant="outline">{event.project}</Badge>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
