"use client";

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import { AlertTriangle, AlertOctagon, ShieldCheck, Shield, Activity } from 'lucide-react';
import type { StudentExamData } from '@/types/exam';
import { RadialBarChart, RadialBar, PolarAngleAxis } from 'recharts';
import { cn } from '@/lib/utils';

interface RiskScoreProps {
  examId?: string;
  studentData?: StudentExamData;
}

export function RiskScore({ examId, studentData }: RiskScoreProps) {
  const { data: examData, isLoading } = useQuery({
    queryKey: ['examData', examId],
    queryFn: () => api.getExamDetails(examId!),
    enabled: !!examId && !studentData,
  });

  if (isLoading) {
    return (
      <Card className="relative overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            <Activity className="h-5 w-5" />
            Risk Assessment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[250px]">
            <div className="text-sm text-muted-foreground animate-pulse">
              Calculating risk score...
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const riskScore = studentData ? studentData.riskScore : examData?.exam.averageRiskScore;
  const riskLevel = studentData ? studentData.riskLevel : examData?.exam.riskLevel;
  if (!riskScore) return null;

  const percentage = Math.round(riskScore);
  const data = [{ value: percentage }];

  const getRiskColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'low':
        return 'hsl(142.1 76.2% 36.3%)';  // green-600
      case 'medium':
        return 'hsl(37 92% 50%)';  // yellow-500
      case 'high':
        return 'hsl(0 84.2% 60.2%)';  // red-500
      default:
        return 'hsl(37 92% 50%)';  // default to yellow
    }
  };

  const getRiskInfo = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'low':
        return {
          icon: ShieldCheck,
          color: 'text-green-600',
          bgColor: 'bg-green-500/10',
          description: 'Normal activity patterns detected'
        };
      case 'medium':
        return {
          icon: AlertTriangle,
          color: 'text-yellow-500',
          bgColor: 'bg-yellow-500/10',
          description: 'Some suspicious activities detected'
        };
      case 'high':
        return {
          icon: AlertOctagon,
          color: 'text-red-500',
          bgColor: 'bg-red-500/10',
          description: 'Multiple suspicious behaviors detected'
        };
      default:
        return {
          icon: Shield,
          color: 'text-yellow-500',
          bgColor: 'bg-yellow-500/10',
          description: 'Monitoring in progress'
        };
    }
  };

  const { icon: StatusIcon, color: statusColor, bgColor, description } = getRiskInfo(riskLevel || 'medium');
  const color = getRiskColor(riskLevel || 'medium');

  return (
    <Card className="relative overflow-hidden">
      <div className={cn(
        "absolute inset-0 opacity-[0.08]",
        "bg-[radial-gradient(circle_at_50%_120%,var(--gradient-start),transparent_70%)]",
      )}
      style={{
        '--gradient-start': color
      } as React.CSSProperties}
      />
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
              <Activity className="h-5 w-5" />
              Risk Assessment
            </CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <div className={cn("rounded-full p-2.5", bgColor)}>
            <StatusIcon className={cn("h-6 w-6", statusColor)} />
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col items-center pt-4">
        <div className="relative w-56 h-56">
          <RadialBarChart
            width={224}
            height={224}
            innerRadius={85}
            outerRadius={110}
            data={data}
            startAngle={180}
            endAngle={0}
          >
            <PolarAngleAxis
              type="number"
              domain={[0, 100]}
              angleAxisId={0}
              tick={false}
            />
            <RadialBar
              background
              dataKey="value"
              angleAxisId={0}
              fill={color}
              cornerRadius={8}
              className={cn(
                "[&_.background-sector]:fill-muted/20",
                "transition-all duration-500 ease-in-out"
              )}
            />
          </RadialBarChart>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-center">
              <span className="text-5xl font-bold tracking-tight">{percentage}</span>
              <span className="text-2xl font-medium ml-0.5">%</span>
            </div>
            <span className="text-sm font-medium text-muted-foreground mt-2">Risk Score</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="justify-center pb-6">
        <div className={cn(
          "flex items-center gap-2 rounded-full px-4 py-2",
          bgColor,
          statusColor,
          "font-semibold text-sm"
        )}>
          <StatusIcon className="h-4 w-4" />
          <span className="capitalize">{riskLevel || 'Medium'} Risk Level</span>
        </div>
      </CardFooter>
    </Card>
  );
} 