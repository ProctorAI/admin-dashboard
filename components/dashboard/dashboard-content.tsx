"use client";

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { StatsCard } from './stats-card';
import { ExamsList } from './exams-list';
import { Button } from '@/components/ui/button';
import { Users, AlertTriangle, BookOpen, Activity } from 'lucide-react';

export function DashboardContent() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: api.getDashboardStats,
    refetchInterval: 30000
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-background/50 p-6 md:p-8 lg:p-10 space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Proctor Dashboard</h1>
          <p className="text-muted-foreground">Overview of all examinations</p>
        </div>
        <Button size="sm" className="gap-2" variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <span>High Risk Exams</span>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard 
          label="Active Exams" 
          value={stats?.activeExams || 0}
          unit="exams"
          variant="blue"
          icon={BookOpen}
        />
        <StatsCard 
          label="Total Suspicious Events" 
          value={stats?.suspiciousEvents || 0}
          unit="alerts"
          variant="red"
          icon={AlertTriangle}
        />
        <StatsCard 
          label="Active Candidates" 
          value={stats?.totalCandidates || 0}
          unit="users"
          variant="green"
          icon={Users}
        />
        <StatsCard 
          label="System Status" 
          value={100}
          unit="%"
          variant="purple"
          icon={Activity}
        />
      </div>

      <ExamsList />
    </div>
  );
} 