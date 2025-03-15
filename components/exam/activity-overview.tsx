"use client";

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { MousePointer, Keyboard, MonitorUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface ActivityStats {
  totalMouseEvents: number;
  totalKeyboardEvents: number;
  totalWindowEvents: number;
}

export function ActivityOverview({ stats }: { stats: ActivityStats }) {
  const total = stats.totalMouseEvents + stats.totalKeyboardEvents + stats.totalWindowEvents;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Overview</CardTitle>
        <CardDescription>Distribution of student activities</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <MousePointer className="h-4 w-4 text-blue-500" />
                <span>Mouse Events</span>
              </div>
              <span className="font-medium">{stats.totalMouseEvents}</span>
            </div>
            <Progress 
              value={total > 0 ? (stats.totalMouseEvents / total * 100) : 0} 
              className="bg-blue-100" 
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Keyboard className="h-4 w-4 text-purple-500" />
                <span>Keyboard Events</span>
              </div>
              <span className="font-medium">{stats.totalKeyboardEvents}</span>
            </div>
            <Progress 
              value={total > 0 ? (stats.totalKeyboardEvents / total * 100) : 0} 
              className="bg-purple-100" 
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <MonitorUp className="h-4 w-4 text-yellow-500" />
                <span>Window Events</span>
              </div>
              <span className="font-medium">{stats.totalWindowEvents}</span>
            </div>
            <Progress 
              value={total > 0 ? (stats.totalWindowEvents / total * 100) : 0} 
              className="bg-yellow-100" 
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 