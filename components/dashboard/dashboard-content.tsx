"use client";

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { StatsCard } from './stats-card';
import { ExamsList } from './exams-list';
import { Button } from '@/components/ui/button';
import { Users, AlertTriangle, BookOpen, Activity, Gauge } from 'lucide-react';

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
          <span>High Risk Exams ({stats?.highRiskExams || 0})</span>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard 
          label="Active Exams" 
          value={stats?.activeExams || 0}
          unit="exams"
          trend={stats?.examTrend}
          variant="blue"
          icon={BookOpen}
        />
        <StatsCard 
          label="Average Risk Score" 
          value={Number((stats?.averageRiskScore || 0).toFixed(1))}
          unit="risk level"
          trend={stats?.riskTrend}
          variant="red"
          icon={Gauge}
        />
        <StatsCard 
          label="Active Candidates" 
          value={stats?.activeCandidates || 0}
          unit="users"
          trend={stats?.candidateTrend}
          variant="green"
          icon={Users}
        />
        <StatsCard 
          label="High Risk Students" 
          value={stats?.highRiskStudents || 0}
          unit="alerts"
          trend={stats?.highRiskTrend}
          variant="purple"
          icon={AlertTriangle}
        />
      </div>

      <ExamsList />
    </div>
  );
} 