"use client";

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { User, Clock, Laptop, Mail, Monitor, Cpu } from 'lucide-react';
import type { StudentExamData } from '@/types/exam';
import { cn } from '@/lib/utils';

interface CandidateInfoProps {
  examId?: string;
  studentData?: StudentExamData;
}

export function CandidateInfo({ examId, studentData }: CandidateInfoProps) {
  const { data: examData, isLoading, error } = useQuery({
    queryKey: ['examData', examId],
    queryFn: () => api.getExamDetails(examId!),
    enabled: !!examId && !studentData,
  });

  if (isLoading) {
    return (
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            <User className="h-5 w-5" />
            Candidate Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[280px]">
            <div className="text-sm text-muted-foreground animate-pulse">
              Loading candidate information...
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if ((error && !studentData) || (!examData?.exam && !studentData)) {
    return (
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-transparent" />
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            <User className="h-5 w-5" />
            Candidate Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[280px]">
            <div className="text-sm text-red-500">Error loading candidate information</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const candidateInfo = studentData?.candidateInfo || examData?.exam.students[0];
  if (!candidateInfo) return null;

  const deviceParts = candidateInfo.deviceInfo.split(', ').map(part => {
    const [label, value] = part.split(': ');
    return { label, value };
  });

  return (
    <Card className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <User className="h-5 w-5" />
          Candidate Information
        </CardTitle>
        <CardDescription>
          Active session details
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex items-start space-x-4">
            <div className="mt-1 rounded-full bg-primary/10 p-3">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div className="space-y-1.5">
              <p className="text-base font-semibold leading-none">{candidateInfo.name}</p>
              <div className="flex items-center text-sm text-muted-foreground">
                <Mail className="mr-1.5 h-4 w-4" />
                {candidateInfo.email}
              </div>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="mt-1 rounded-full bg-blue-500/10 p-3">
              <Clock className="h-5 w-5 text-blue-500" />
            </div>
            <div className="space-y-1.5">
              <p className="text-base font-semibold leading-none">Session Started</p>
              <p className="text-sm text-muted-foreground">
                {new Date(candidateInfo.examStartTime).toLocaleString(undefined, {
                  weekday: 'short',
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="mt-1 rounded-full bg-emerald-500/10 p-3">
              <Laptop className="h-5 w-5 text-emerald-500" />
            </div>
            <div className="space-y-2">
              <p className="text-base font-semibold leading-none">System Information</p>
              <div className="grid gap-2">
                {deviceParts.map(({ label, value }, index) => (
                  <div key={index} className="flex items-center gap-3 text-sm">
                    {label.toLowerCase().includes('screen') ? (
                      <Monitor className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Cpu className="h-4 w-4 text-muted-foreground" />
                    )}
                    <div className="flex items-center gap-1.5">
                      <span className="font-medium text-muted-foreground">{label}:</span>
                      <span className="font-medium">{value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 