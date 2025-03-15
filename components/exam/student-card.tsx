"use client";

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { AlertTriangle, Clock, Monitor, Activity, Shield, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { CandidateInfo } from "@/types/exam";
import { Progress } from "@/components/ui/progress";

interface StudentCardProps {
  examId: string;
  student: CandidateInfo;
}

export function StudentCard({ examId, student }: StudentCardProps) {
  const riskScore = student.riskScore ?? 0;
  const riskLevel = student.riskLevel ?? 'low';
  const mouseScore = student.mouseScore ?? 0;
  const keyboardScore = student.keyboardScore ?? 0;
  const windowScore = student.windowScore ?? 0;

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high':
        return 'text-red-700 bg-red-100 dark:bg-red-900/30 dark:text-red-400';
      case 'medium':
        return 'text-yellow-700 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400';
      default:
        return 'text-green-700 bg-green-100 dark:bg-green-900/30 dark:text-green-400';
    }
  };

  return (
    <Card className="group overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-base font-medium">{student.name}</CardTitle>
            <CardDescription>{student.email}</CardDescription>
          </div>
          <div className={`flex items-center gap-2 rounded-full px-3 py-1 text-sm ${getRiskColor(riskLevel)}`}>
            <Shield className="h-4 w-4" />
            <span>{Math.round(riskScore)}%</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-2">
          <div className="space-y-1 text-center p-2 rounded-lg bg-muted">
            <div className="text-sm font-medium">{Math.round(mouseScore)}%</div>
            <div className="text-xs text-muted-foreground">Mouse</div>
          </div>
          <div className="space-y-1 text-center p-2 rounded-lg bg-muted">
            <div className="text-sm font-medium">{Math.round(keyboardScore)}%</div>
            <div className="text-xs text-muted-foreground">Keyboard</div>
          </div>
          <div className="space-y-1 text-center p-2 rounded-lg bg-muted">
            <div className="text-sm font-medium">{Math.round(windowScore)}%</div>
            <div className="text-xs text-muted-foreground">Window</div>
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Started: {new Date(student.examStartTime).toLocaleTimeString()}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Monitor className="h-4 w-4" />
            <span className="truncate">{student.deviceInfo}</span>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Link href={`/exams/${examId}/students/${student.userId}`} className="flex-1">
            <Button variant="secondary" className="w-full gap-2">
              <Activity className="h-4 w-4" />
              View Details
            </Button>
          </Link>
          <Link href={`/exams/${examId}/monitor/${student.userId}`} className="flex-1">
            <Button variant="default" className="w-full gap-2">
              <Eye className="h-4 w-4" />
              Monitor
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
} 