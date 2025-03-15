"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { api } from "@/lib/api-client";
import { ExamsGrid } from "@/components/exam/exams-grid";
import { ExamsTable } from "@/components/exam/exams-table";
import { ViewToggle } from "@/components/exam/view-toggle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ExamsPage() {
  const [view, setView] = useState<"grid" | "table">("grid");
  
  const { data: exams, isLoading, error } = useQuery({
    queryKey: ['exams'],
    queryFn: () => api.getExams(),
    refetchInterval: 10000,
    staleTime: 5000,
  });

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Active Examinations</h1>
          <ViewToggle view={view} onViewChange={setView} />
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Loading exams...</CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (error || !exams) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Active Examinations</h1>
          <ViewToggle view={view} onViewChange={setView} />
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-red-500">Error loading exams</CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Active Examinations</h1>
        <ViewToggle view={view} onViewChange={setView} />
      </div>

      {exams.length === 0 ? (
        <Card>
          <CardContent className="py-6 text-center text-muted-foreground">
            No active examinations found
          </CardContent>
        </Card>
      ) : view === "grid" ? (
        <ExamsGrid exams={exams} />
      ) : (
        <ExamsTable exams={exams} />
      )}
    </div>
  );
}
