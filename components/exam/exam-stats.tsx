"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Users, Shield, Activity, Eye } from "lucide-react";
import type { ExamStats } from "@/types/exam";

interface ExamStatsProps {
  stats: ExamStats;
  activityCount: number;
}

export function ExamStats({ stats, activityCount }: ExamStatsProps) {
  const getRiskBg = (score: number) => {
    if (score <= 30) return 'bg-green-100 dark:bg-green-900/30';
    if (score <= 70) return 'bg-yellow-100 dark:bg-yellow-900/30';
    return 'bg-red-100 dark:bg-red-900/30';
  };

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      <Card className="bg-muted">
        <CardContent className="flex items-center gap-3 p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-medium">{stats.activeStudents} / {stats.totalStudents}</p>
            <p className="text-xs text-muted-foreground">Active Students</p>
          </div>
        </CardContent>
      </Card>

      <Card className={getRiskBg(stats.averageRiskScore)}>
        <CardContent className="flex items-center gap-3 p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/50 dark:bg-black/20">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-medium">{Math.round(stats.averageRiskScore)}%</p>
            <p className="text-xs">Average Risk</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center gap-3 p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/30">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-medium">{activityCount}</p>
            <p className="text-xs text-muted-foreground">Total Activities</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center gap-3 p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-700 dark:bg-green-900/30">
            <Eye className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-medium">Active Monitoring</p>
            <p className="text-xs text-muted-foreground">Real-time Updates</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 