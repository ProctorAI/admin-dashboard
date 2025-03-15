import Link from 'next/link';
import { AlertTriangle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ExamData } from '@/types/exam';

interface ExamCardProps {
  exam: ExamData;
}

export function ExamCard({ exam }: ExamCardProps) {
  const startTime = exam.startTime ? new Date(exam.startTime).toLocaleString() : 'Not started';
  const title = exam.title || 'Untitled Exam';
  const activeStudents = exam.activeStudents ?? 0;
  const totalStudents = exam.totalStudents ?? 0;
  const riskScore = exam.averageRiskScore ?? 0;
  const riskLevel = exam.riskLevel ?? 'low';

  const getRiskColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'high':
        return 'text-red-500 bg-red-50';
      case 'medium':
        return 'text-yellow-500 bg-yellow-50';
      case 'low':
        return 'text-green-500 bg-green-50';
      default:
        return 'text-gray-500 bg-gray-50';
    }
  };

  return (
    <div className="flex items-center justify-between rounded-lg border bg-card p-4 transition-colors hover:bg-accent/5">
      <div className="space-y-1">
        <h3 className="font-medium tracking-tight">{title}</h3>
        <p className="text-sm text-muted-foreground">
          Started: {startTime}
        </p>
        <div className="flex gap-4 text-xs text-muted-foreground">
          <p>
            Active Students: {activeStudents} / {totalStudents}
          </p>
          <p>
            Risk Score: {riskScore.toFixed(1)}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className={`flex items-center gap-2 rounded-full px-3 py-1 ${getRiskColor(riskLevel)}`}>
          {riskLevel === 'high' && <AlertTriangle className="h-4 w-4" />}
          <span className="text-sm font-medium capitalize">{riskLevel} Risk</span>
        </div>
        <Link href={`/exams/${exam.id}`}>
          <Button variant="outline" size="sm">
            Monitor
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
} 