"use client";

import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExamData } from '@/types/exam';
import { ExamCard } from './exam-card';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/lib/api-client';

export function ExamsList() {
  const { data: exams, isLoading, error } = useQuery<ExamData[]>({
    queryKey: ['exams'],
    queryFn: api.getExams,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  if (error) {
    console.error('Error in ExamsList:', error);
    return (
      <Card className="col-span-3 h-[450px]">
        <CardHeader>
          <CardTitle>Active Exams</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-[350px] items-center justify-center">
            <p className="text-destructive">Error loading exams. Please try again later.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="col-span-3 h-[450px]">
        <CardHeader>
          <CardTitle>Active Exams</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-[100px] w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!exams || exams.length === 0) {
    return (
      <Card className="col-span-3 h-[450px]">
        <CardHeader>
          <CardTitle>Active Exams</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-[350px] items-center justify-center">
            <p className="text-muted-foreground">No active exams at the moment.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-3 h-[450px]">
      <CardHeader>
        <CardTitle>Active Exams</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 overflow-auto pr-2" style={{ maxHeight: '350px' }}>
          {exams.map((exam) => (
            <ExamCard key={exam.id} exam={exam} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 