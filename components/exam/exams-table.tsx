"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { ExamData } from "@/types/exam";

interface ExamsTableProps {
  exams: ExamData[];
}

export function ExamsTable({ exams }: ExamsTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Exam Title</TableHead>
            <TableHead>Start Time</TableHead>
            <TableHead>Students</TableHead>
            <TableHead>Risk Level</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {exams.map((exam) => (
            <TableRow key={exam.id}>
              <TableCell className="font-medium">{exam.title || 'Untitled Exam'}</TableCell>
              <TableCell>{new Date(exam.startTime).toLocaleString()}</TableCell>
              <TableCell>{exam.activeStudents} / {exam.totalStudents}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {exam.averageRiskScore > 0.7 && (
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                  )}
                  <span className={`${
                    exam.averageRiskScore > 0.7 
                      ? 'text-red-500'
                      : exam.averageRiskScore > 0.4
                      ? 'text-yellow-500'
                      : 'text-green-500'
                  }`}>
                    {(exam.averageRiskScore * 100).toFixed(0)}%
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <Link href={`/exams/${exam.id}`}>
                  <Button variant="outline" size="sm">
                    Monitor
                  </Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 