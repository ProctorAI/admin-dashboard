"use client";

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, AlertTriangle } from "lucide-react";
import Link from "next/link";
import type { ExamData } from "@/types/exam";

interface ExamsGridProps {
  exams: ExamData[];
}

export function ExamsGrid({ exams }: ExamsGridProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {exams.map((exam) => {
        if (!exam) return null;
        
        const startTime = exam.startTime ? new Date(exam.startTime).toLocaleString() : 'Not started';
        const title = exam.title || 'Untitled Exam';
        const activeStudents = exam.activeStudents ?? 0;
        const totalStudents = exam.totalStudents ?? 0;
        const riskScore = exam.averageRiskScore ?? 0;
        const riskLevel = exam.riskLevel ?? 'low';

        return (
          <Card key={exam.id}>
            <CardHeader>
              <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {activeStudents} / {totalStudents} Students
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {riskLevel === 'high' && (
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                  )}
                  <span className={`text-sm ${
                    riskLevel === 'high'
                      ? 'text-red-500'
                      : riskLevel === 'medium'
                      ? 'text-yellow-500'
                      : 'text-green-500'
                  }`}>
                    {Math.round(riskScore)}% Risk
                  </span>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                Started: {startTime}
              </div>
            </CardContent>
            <CardFooter className="justify-end">
              <Link href={`/exams/${exam.id}`}>
                <Button variant="outline" size="sm">
                  Monitor
                </Button>
              </Link>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
} 