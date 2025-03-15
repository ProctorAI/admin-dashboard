"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, PolarRadiusAxis } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { TrendingUp, TrendingDown, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

interface RiskRadarChartProps {
  riskScore: number;
  mouseScore: number;
  keyboardScore: number;
  windowScore: number;
  activityStats: {
    focusPercentage: number;
    mouseMovementFrequency: number;
    keystrokeFrequency: number;
    windowSwitchFrequency: number;
  };
}

const chartConfig = {
  metrics: {
    label: "Risk Metrics",
    color: "hsl(0 94% 65%)",
  },
  activity: {
    label: "Activity Metrics",
    color: "hsl(217 91% 65%)",
  },
} satisfies ChartConfig;

export function RiskRadarChart({ 
  riskScore, 
  mouseScore, 
  keyboardScore, 
  windowScore,
  activityStats 
}: RiskRadarChartProps) {
  const chartData = [
    {
      metric: "Risk Score",
      risk: riskScore,
      activity: activityStats.focusPercentage,
    },
    {
      metric: "Mouse Activity",
      risk: mouseScore,
      activity: activityStats.mouseMovementFrequency * 10,
    },
    {
      metric: "Keyboard Activity",
      risk: keyboardScore,
      activity: activityStats.keystrokeFrequency * 10,
    },
    {
      metric: "Window Activity",
      risk: windowScore,
      activity: activityStats.windowSwitchFrequency * 10,
    },
  ];

  const riskLevel = riskScore > 75 ? "high" : riskScore > 50 ? "medium" : "low";
  const riskColor = {
    high: "text-red-500",
    medium: "text-yellow-500",
    low: "text-green-500"
  }[riskLevel];

  const avgRisk = (riskScore + mouseScore + keyboardScore + windowScore) / 4;
  const avgActivity = Object.values(activityStats).reduce((a, b) => a + b, 0) / 4;
  const trend = ((avgRisk - avgActivity) / avgActivity) * 100;
  const isIncreasing = trend > 0;

  return (
    <Card className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-transparent" />
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-red-500" />
              <CardTitle className="text-lg font-semibold">Risk & Activity Analysis</CardTitle>
            </div>
            <CardDescription>Comprehensive monitoring metrics</CardDescription>
          </div>
          <div className={cn(
            "flex items-center gap-2 rounded-full px-3 py-1.5",
            riskLevel === "high" ? "bg-red-100 text-red-700 dark:bg-red-500/20" :
            riskLevel === "medium" ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20" :
            "bg-green-100 text-green-700 dark:bg-green-500/20",
            "text-sm font-medium"
          )}>
            {riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)} Risk Level
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square h-[350px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <PolarGrid gridType="circle" stroke="hsl(var(--border))" className="opacity-20" />
              <PolarAngleAxis
                dataKey="metric"
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 100]}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                tickCount={5}
                stroke="hsl(var(--border))"
                className="opacity-20"
              />
              <ChartTooltip content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const data = payload[0].payload as {
                  metric: string;
                  risk: number;
                  activity: number;
                };
                return (
                  <div className="rounded-lg border bg-card p-3 shadow-sm">
                    <div className="grid gap-2">
                      <div className="font-medium">{data.metric}</div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <div className="text-xs text-muted-foreground">Risk Score</div>
                          <div className="text-sm font-medium">{data.risk.toFixed(1)}</div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-xs text-muted-foreground">Activity Level</div>
                          <div className="text-sm font-medium">{data.activity.toFixed(1)}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }} />
              <Radar
                name="Risk Metrics"
                dataKey="risk"
                stroke={chartConfig.metrics.color}
                fill={chartConfig.metrics.color}
                fillOpacity={0.15}
                strokeWidth={2}
              />
              <Radar
                name="Activity Metrics"
                dataKey="activity"
                stroke={chartConfig.activity.color}
                fill={chartConfig.activity.color}
                fillOpacity={0.1}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </ChartContainer>
        <div className="mt-6 flex items-center justify-between text-sm">
          <div className={cn(
            "flex items-center gap-2 rounded-full px-3 py-1.5",
            !isIncreasing ? 'bg-green-100 text-green-700 dark:bg-green-900/30' : 'bg-red-100 text-red-700 dark:bg-red-900/30',
            "font-medium"
          )}>
            Risk {!isIncreasing ? 'decreasing' : 'increasing'} by {Math.abs(trend).toFixed(1)}%
            {!isIncreasing ? 
              <TrendingDown className="h-4 w-4" /> : 
              <TrendingUp className="h-4 w-4" />
            }
          </div>
          <div className={cn(
            "flex items-center gap-2 rounded-full px-3 py-1.5 font-medium",
            riskColor
          )}>
            Overall Risk: {riskScore.toFixed(1)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 