"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { ActivityChart } from "@/components/exam/activity-chart";
import { RecentEvents } from "@/components/exam/recent-events";
import { CandidateInfo } from "@/components/exam/candidate-info";
import { RiskScore } from "@/components/exam/risk-score";
import { RiskRadarChart } from "@/components/exam/risk-radar-chart";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { use } from 'react';
import { ActivityBreakdownChart } from "@/components/exam/activity-breakdown-chart";
import { RiskTrendChart } from "@/components/exam/risk-trend-chart";
import { WindowSizeChart } from "@/components/exam/window-size-chart";
import { ActivityHeatmap } from "@/components/exam/activity-heatmap";
import { ExamFeaturesChart } from "@/components/exam/exam-features-chart";

interface StudentExamPageProps {
  params: Promise<{
    examId: string;
    userId: string;
  }>;
}

export default function StudentExamPage({ params: paramsPromise }: StudentExamPageProps) {
  const params = use(paramsPromise);
  const { data: studentData, isLoading, error } = useQuery({
    queryKey: ['studentExamData', params.examId, params.userId],
    queryFn: () => api.getStudentExamData(params.examId, params.userId),
    refetchInterval: 10000,
    staleTime: 5000,
  });

  if (isLoading || !studentData) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <Link href={`/exams/${params.examId}`}>
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Exam Overview
            </Button>
          </Link>
        </div>
        <p>Loading student data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <Link href={`/exams/${params.examId}`}>
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Exam Overview
            </Button>
          </Link>
        </div>
        <p className="text-red-500">Error loading student data</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link href={`/exams/${params.examId}`}>
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Exam Overview
            </Button>
          </Link>
          <h1 className="text-2xl font-bold mt-2">Student Monitoring</h1>
          <p className="text-muted-foreground">Student ID: {params.userId}</p>
        </div>
      </div>

      <Tabs defaultValue="monitoring" className="space-y-6">
        <TabsList>
          <TabsTrigger value="monitoring">Live Monitoring</TabsTrigger>
          <TabsTrigger value="events">Recent Events</TabsTrigger>
        </TabsList>

        <TabsContent value="monitoring" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <CandidateInfo studentData={studentData} />
            <RiskScore studentData={studentData} />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <RiskTrendChart data={studentData.riskScoreHistory} />
            <RiskRadarChart 
              riskScore={studentData.riskScore}
              mouseScore={studentData.mouseScore}
              keyboardScore={studentData.keyboardScore}
              windowScore={studentData.windowScore}
              activityStats={studentData.activityStats}
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <ActivityChart timeSeriesData={studentData.timeSeriesData} />
            <ActivityBreakdownChart data={studentData.activityBreakdown} />
          </div>



          <div className="grid gap-6 md:grid-cols-2">
            <WindowSizeChart 
              data={studentData.screenSizeHistory}
            screenWidth={studentData.deviceInfo.screenWidth!}
              screenHeight={studentData.deviceInfo.screenHeight!}
            />
            <ExamFeaturesChart 
              examId={params.examId}
              intervalSeconds={30}
              windowSizeSeconds={1800}
            />
          </div>
        </TabsContent>

        <TabsContent value="events">
          <div className="grid gap-6">
            <RecentEvents activities={studentData.recentActivities} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 