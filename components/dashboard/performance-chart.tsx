"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { TrendingUp, TrendingDown } from "lucide-react";

interface PerformanceData {
  day: string;
  score: number;
  average: number;
}

interface PerformanceChartProps {
  data: PerformanceData[];
  currentScore: number;
}

export function PerformanceChart({ data, currentScore }: PerformanceChartProps) {
  const lastWeekScore = data[0]?.score || 0;
  const scoreChange = ((currentScore - lastWeekScore) / lastWeekScore) * 100;
  const isImproving = scoreChange > 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-base font-medium">Performance Trend</CardTitle>
          <p className="text-sm text-muted-foreground">Last 7 days activity</p>
        </div>
        <div className={`flex items-center gap-2 rounded-lg px-2.5 py-1 text-sm ${
          isImproving 
            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
            : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
        }`}>
          {isImproving ? (
            <TrendingUp className="h-4 w-4" />
          ) : (
            <TrendingDown className="h-4 w-4" />
          )}
          <span className="font-medium">{Math.abs(scoreChange).toFixed(1)}%</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-6 flex items-center justify-end gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-blue-500" />
            <span>Your score</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-slate-300 dark:bg-slate-600" />
            <span>Average score</span>
          </div>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <defs>
                <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis
                dataKey="day"
                stroke="#94a3b8"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#94a3b8"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  return (
                    <div className="rounded-lg border bg-white p-2 shadow-sm dark:bg-slate-800">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center gap-1">
                          <div className="h-2 w-2 rounded-full bg-blue-500" />
                          <span className="text-sm font-medium">Score:</span>
                          <span className="text-sm">{payload[0].value}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="h-2 w-2 rounded-full bg-slate-300 dark:bg-slate-600" />
                          <span className="text-sm font-medium">Avg:</span>
                          <span className="text-sm">{payload[1].value}</span>
                        </div>
                      </div>
                    </div>
                  );
                }}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#3B82F6"
                strokeWidth={2}
                fill="url(#scoreGradient)"
                dot={{
                  fill: "#3B82F6",
                  strokeWidth: 2,
                  r: 4,
                  stroke: "#ffffff"
                }}
                activeDot={{
                  r: 6,
                  stroke: "#3B82F6",
                  strokeWidth: 2,
                  fill: "#ffffff"
                }}
              />
              <Line
                type="monotone"
                dataKey="average"
                stroke="#94a3b8"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
} 