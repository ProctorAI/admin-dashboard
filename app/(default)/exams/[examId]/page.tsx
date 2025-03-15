"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { StudentCard } from "@/components/exam/student-card";
import { ExamStats } from "@/components/exam/exam-stats";
import { ActivityOverview } from "@/components/exam/activity-overview";
import { StudentsTable } from "@/components/exam/students-table";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { 
  AlertTriangle, 
  Users, 
  ArrowLeft, 
  LayoutGrid, 
  Table2, 
  Clock, 
  Shield, 
  Activity,
  Eye,
  MousePointer,
  Keyboard,
  MonitorUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { use, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface ExamPageProps {
  params: Promise<{
    examId: string;
  }>;
}

export default function ExamPage({ params: paramsPromise }: ExamPageProps) {
  const params = use(paramsPromise);
  const [view, setView] = useState<'cards' | 'table'>('cards');
  
  const { data: examDetails, isLoading, error } = useQuery({
    queryKey: ['examDetails', params.examId],
    queryFn: () => api.getExamDetails(params.examId),
    refetchInterval: 10000,
    staleTime: 5000,
  });

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
        <Card className="relative overflow-hidden">
          <CardHeader>
            <CardTitle>Loading exam details...</CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (error || !examDetails) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
        <Card className="border-red-200 dark:border-red-800">
          <CardHeader>
            <CardTitle className="text-red-500">Error loading exam details</CardTitle>
            <CardDescription className="text-red-400">
              {error?.message || 'Failed to load exam data'}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const { exam } = examDetails;

  const getRiskColor = (score: number) => {
    if (score <= 30) return 'text-green-500 bg-green-100 dark:bg-green-900/30';
    if (score <= 70) return 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30';
    return 'text-red-500 bg-red-100 dark:bg-red-900/30';
  };

  const getRiskBg = (score: number) => {
    if (score <= 30) return 'bg-green-100 dark:bg-green-900/30';
    if (score <= 70) return 'bg-yellow-100 dark:bg-yellow-900/30';
    return 'bg-red-100 dark:bg-red-900/30';
  };

  const getActivityStats = () => {
    const totalMouseEvents = exam.students.reduce((acc, student) => {
      const studentData = examDetails.studentData.find(s => s.id === student.userId);
      return acc + (studentData?.activityStats?.mouseEvents || 0);
    }, 0);
    
    const totalKeyboardEvents = exam.students.reduce((acc, student) => {
      const studentData = examDetails.studentData.find(s => s.id === student.userId);
      return acc + (studentData?.activityStats?.keyboardEvents || 0);
    }, 0);
    
    const totalWindowEvents = exam.students.reduce((acc, student) => {
      const studentData = examDetails.studentData.find(s => s.id === student.userId);
      return acc + (studentData?.activityStats?.windowEvents || 0);
    }, 0);
    
    return { totalMouseEvents, totalKeyboardEvents, totalWindowEvents };
  };

  const stats = getActivityStats();
  const totalActivities = stats.totalMouseEvents + stats.totalKeyboardEvents + stats.totalWindowEvents;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <Button
            variant={view === 'cards' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setView('cards')}
          >
            <LayoutGrid className="h-4 w-4 mr-2" />
            Cards
          </Button>
          <Button
            variant={view === 'table' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setView('table')}
          >
            <Table2 className="h-4 w-4 mr-2" />
            Table
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{exam.title || 'Untitled Exam'}</h1>
          <p className="text-muted-foreground">{exam.description || 'No description available'}</p>
        </div>

        <ExamStats 
          stats={{
            activeStudents: exam.activeStudents,
            totalStudents: exam.totalStudents,
            averageRiskScore: exam.averageRiskScore
          }}
          activityCount={totalActivities}
        />

        <ActivityOverview stats={stats} />

        <Card>
          <CardHeader className="pb-0">
            <div className="flex items-center justify-between">
              <CardTitle>Students</CardTitle>
              <CardDescription className="text-sm font-medium">
                {exam.students.length} Total
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {view === 'cards' ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {exam.students.map((student) => (
                  <StudentCard 
                    key={student.userId} 
                    examId={exam.id} 
                    student={student} 
                  />
                ))}
              </div>
            ) : (
              <StudentsTable examId={exam.id} students={exam.students} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 