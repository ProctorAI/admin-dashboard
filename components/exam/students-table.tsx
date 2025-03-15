"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Clock, Eye, Activity } from "lucide-react";
import Link from "next/link";
import type { CandidateInfo } from "@/types/exam";
import { cn } from "@/lib/utils";

interface StudentsTableProps {
  examId: string;
  students: CandidateInfo[];
}

export function StudentsTable({ examId, students }: StudentsTableProps) {
  const getRiskColor = (score: number) => {
    if (score <= 30) return 'text-green-500 bg-green-100 dark:bg-green-900/30';
    if (score <= 70) return 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30';
    return 'text-red-500 bg-red-100 dark:bg-red-900/30';
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Student</TableHead>
            <TableHead>Risk Score</TableHead>
            <TableHead className="text-center">Scores</TableHead>
            <TableHead>Start Time</TableHead>
            <TableHead>Device</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student) => (
            <TableRow key={student.userId}>
              <TableCell>
                <div className="font-medium">{student.name}</div>
                <div className="text-sm text-muted-foreground">{student.email}</div>
              </TableCell>
              <TableCell>
                <div className={cn(
                  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                  getRiskColor(student.riskScore)
                )}>
                  {Math.round(student.riskScore)}%
                </div>
              </TableCell>
              <TableCell>
                <div className="flex justify-center gap-4">
                  <div className="text-center">
                    <div className="text-sm font-medium">{Math.round(student.mouseScore)}%</div>
                    <div className="text-xs text-muted-foreground">Mouse</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium">{Math.round(student.keyboardScore)}%</div>
                    <div className="text-xs text-muted-foreground">Keys</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium">{Math.round(student.windowScore)}%</div>
                    <div className="text-xs text-muted-foreground">Window</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  {new Date(student.examStartTime).toLocaleTimeString()}
                </div>
              </TableCell>
              <TableCell className="max-w-[200px] truncate">
                {student.deviceInfo}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Link href={`/exams/${examId}/students/${student.userId}`}>
                    <Button variant="ghost" size="sm">
                      <Activity className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href={`/exams/${examId}/monitor/${student.userId}`}>
                    <Button variant="default" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 