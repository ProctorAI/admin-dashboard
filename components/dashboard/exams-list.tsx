"use client";

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import type { ExamData } from '@/types/exam';

export function ExamsList() {
  const { data: exams, isLoading } = useQuery<ExamData[]>({
    queryKey: ['exams'],
    queryFn: () => api.getExams(),
    refetchInterval: 10000,
    staleTime: 5000,
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Active Examinations</CardTitle>
        </CardHeader>
        <CardContent>Loading exams...</CardContent>
      </Card>
    );
  }

  if (!exams?.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Active Examinations</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No active exams found.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Examinations</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {exams.map((exam) => {
            if (!exam) return null;
            
            const startTime = exam.startTime ? new Date(exam.startTime).toLocaleString() : 'Not started';
            const title = exam.title || 'Untitled Exam';
            const activeStudents = exam.activeStudents ?? 0;
            const totalStudents = exam.totalStudents ?? 0;
            const riskScore = exam.averageRiskScore ?? 0;
            const riskLevel = exam.riskLevel ?? 'low';

            return (
              <div key={exam.id} className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <h3 className="font-medium">{title}</h3>
                  <p className="text-sm text-muted-foreground">
                    Started: {startTime}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Active Students: {activeStudents} / {totalStudents}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  {riskLevel === 'high' && (
                    <div className="flex items-center gap-2 text-red-500">
                      <AlertTriangle className="h-5 w-5" />
                      <span className="text-sm font-medium">High Risk</span>
                    </div>
                  )}
                  <Link href={`/exams/${exam.id}`}>
                    <Button variant="outline" size="sm">
                      Monitor
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
} 