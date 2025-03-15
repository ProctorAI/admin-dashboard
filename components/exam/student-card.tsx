"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AlertTriangle, Clock, Monitor } from "lucide-react";
import Link from "next/link";
import type { CandidateInfo } from "@/types/exam";

interface StudentCardProps {
  examId: string;
  student: CandidateInfo;
}

export function StudentCard({ examId, student }: StudentCardProps) {
  const riskScore = student.riskScore ?? 0;
  const riskLevel = student.riskLevel ?? 'low';

  return (
    <Link href={`/exams/${examId}/students/${student.userId}`}>
      <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
        <CardHeader>
          <CardTitle className="text-base font-medium flex items-center justify-between">
            <span>{student.name}</span>
            <div className={`flex items-center gap-2 rounded-lg px-2.5 py-1 text-sm ${
              riskLevel === 'high'
                ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                : riskLevel === 'medium'
                ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
            }`}>
              <AlertTriangle className="h-4 w-4" />
              <span>Risk: {Math.round(riskScore)}%</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Started: {new Date(student.examStartTime).toLocaleTimeString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Monitor className="h-4 w-4" />
              <span>{student.deviceInfo}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
} 