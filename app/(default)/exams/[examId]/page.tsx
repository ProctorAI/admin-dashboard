"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { StudentCard } from "@/components/exam/student-card";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AlertTriangle, Users, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { use } from 'react';

interface ExamPageProps {
  params: Promise<{
    examId: string;
  }>;
}

export default function ExamPage({ params: paramsPromise }: ExamPageProps) {
  const params = use(paramsPromise);
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
        <Card>
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
        <Card>
          <CardHeader>
            <CardTitle className="text-red-500">Error loading exam details</CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const { exam } = examDetails;

  const getRiskColor = (score: number) => {
    if (score <= 30) return 'bg-green-100 dark:bg-green-900/30';
    if (score <= 70) return 'bg-yellow-100 dark:bg-yellow-900/30';
    return 'bg-red-100 dark:bg-red-900/30';
  };

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

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{exam.title || 'Untitled Exam'}</h1>
          <p className="text-muted-foreground">{exam.description || 'No description available'}</p>
        </div>
        <div className="flex items-center gap-4">
          <Card className="bg-muted">
            <CardContent className="flex items-center gap-2 p-4">
              <Users className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">{exam.activeStudents} / {exam.totalStudents}</p>
                <p className="text-xs text-muted-foreground">Active Students</p>
              </div>
            </CardContent>
          </Card>
          <Card className={getRiskColor(exam.averageRiskScore)}>
            <CardContent className="flex items-center gap-2 p-4">
              <AlertTriangle className="h-5 w-5" />
              <div>
                <p className="text-sm font-medium">{Math.round(exam.averageRiskScore)}%</p>
                <p className="text-xs">Average Risk</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {exam.students.map((student) => (
          <StudentCard 
            key={student.userId} 
            examId={exam.id} 
            student={student} 
          />
        ))}
      </div>
    </div>
  );
} 