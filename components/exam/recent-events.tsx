"use client";

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { AlertTriangle, MousePointer, Keyboard, Clock, MonitorUp, ArrowUpRight } from 'lucide-react';
import type { ActivityEvent } from '@/types/exam';
import { cn } from '@/lib/utils';

interface RecentEventsProps {
  activities: ActivityEvent[];
}

export function RecentEvents({ activities }: RecentEventsProps) {
  const getEventIcon = (type: string) => {
    switch (type) {
      case 'mouse_move':
        return MousePointer;
      case 'key_press':
        return Keyboard;
      case 'window_state_change':
        return MonitorUp;
      case 'tab_switch':
        return ArrowUpRight;
      default:
        return AlertTriangle;
    }
  };

  const getEventColor = (type: string, state?: string) => {
    switch (type) {
      case 'window_state_change':
        return state === 'blurred' ? 'text-red-500 bg-red-100 dark:bg-red-500/20' : 'text-green-500 bg-green-100 dark:bg-green-500/20';
      case 'tab_switch':
        return 'text-yellow-500 bg-yellow-100 dark:bg-yellow-500/20';
      case 'mouse_move':
        return 'text-blue-500 bg-blue-100 dark:bg-blue-500/20';
      case 'key_press':
        return 'text-purple-500 bg-purple-100 dark:bg-purple-500/20';
      default:
        return 'text-gray-500 bg-gray-100 dark:bg-gray-500/20';
    }
  };

  const formatEventText = (event: ActivityEvent) => {
    switch (event.type) {
      case 'window_state_change':
        return `Window ${event.data?.state}`;
      case 'mouse_move':
        return `Mouse moved to (${event.data?.x}, ${event.data?.y})`;
      case 'key_press':
        return `Key pressed: ${event.data?.key_type}`;
      case 'tab_switch':
        return `Tab switched`;
      default:
        return event.type;
    }
  };

  // Sort activities by timestamp in descending order and take the first 10
  const recentActivities = [...activities]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 10);

  return (
    <Card className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-transparent" />
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg font-semibold">Recent Activities</CardTitle>
            <CardDescription>Last 10 recorded events</CardDescription>
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30">
            {recentActivities.length}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recentActivities.map((event: ActivityEvent, index) => {
            const Icon = getEventIcon(event.type);
            const eventDate = new Date(event.timestamp);
            const colorClass = getEventColor(event.type, event.data?.state);
            
            return (
              <div 
                key={event.id} 
                className={cn(
                  "group flex items-start gap-4 rounded-lg border p-3",
                  "transition-all duration-200 hover:bg-muted/50",
                  "animate-in fade-in-50",
                  index === 0 && "border-blue-200 dark:border-blue-500/30"
                )}
                style={{
                  animationDelay: `${index * 50}ms`,
                  animationFillMode: 'backwards'
                }}
              >
                <div className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full",
                  colorClass
                )}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="font-medium leading-none tracking-tight">
                    {formatEventText(event)}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <time dateTime={event.timestamp}>
                      {eventDate.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit', 
                        second: '2-digit' 
                      })}
                    </time>
                  </div>
                </div>
                <div className={cn(
                  "opacity-0 transition-opacity group-hover:opacity-100",
                  "text-xs font-medium",
                  colorClass
                )}>
                  {Math.round((Date.now() - eventDate.getTime()) / 1000)}s ago
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
} 