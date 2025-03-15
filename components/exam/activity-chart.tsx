"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import { Activity, TrendingDown, TrendingUp } from 'lucide-react';
import type { TimeSeriesDataPoint } from '@/types/exam';
import { cn } from '@/lib/utils';

interface ActivityChartProps {
  timeSeriesData: TimeSeriesDataPoint[];
}

const chartConfig = {
  totalActivity: {
    label: "Total Activity",
    color: "hsl(217 91% 60%)", // blue-500
  },
  suspiciousEvents: {
    label: "Suspicious Events",
    color: "hsl(0 84.2% 60.2%)", // red-500
  },
};

export function ActivityChart({ timeSeriesData }: ActivityChartProps) {
  // Calculate the trend
  const latestTotal = timeSeriesData[timeSeriesData.length - 1]?.totalActivity || 0;
  const earliestTotal = timeSeriesData[0]?.totalActivity || 0;
  const activityChange = earliestTotal ? ((latestTotal - earliestTotal) / earliestTotal) * 100 : 0;
  const isIncreasing = activityChange > 0;

  const TrendIcon = isIncreasing ? TrendingUp : TrendingDown;
  const trendColor = !isIncreasing ? 'text-green-600' : 'text-red-600';
  const trendBg = !isIncreasing ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30';

  return (
    <Card className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-transparent" />
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
              <Activity className="h-5 w-5" />
              Activity Monitoring
            </CardTitle>
            <CardDescription>Current exam session</CardDescription>
          </div>
          <div className={cn(
            "flex items-center gap-2 rounded-full px-3 py-1.5",
            trendBg,
            trendColor,
            "font-medium text-sm"
          )}>
            <TrendIcon className="h-4 w-4" />
            <span>{Math.abs(activityChange).toFixed(1)}%</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-6 flex items-center justify-end gap-4 text-sm">
          {Object.entries(chartConfig).map(([key, config]) => (
            <div key={key} className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full" style={{ backgroundColor: config.color }} />
              <span className="font-medium">{config.label}</span>
            </div>
          ))}
        </div>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart 
              data={timeSeriesData} 
              margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                vertical={false} 
                stroke="hsl(var(--border))" 
                className="opacity-30"
              />
              <XAxis
                dataKey="timestamp"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
                }}
                tickMargin={8}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
                tickMargin={8}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const data = payload[0].payload as TimeSeriesDataPoint;
                  return (
                    <div className="rounded-lg border bg-card p-3 shadow-sm">
                      <div className="grid gap-2">
                        {Object.entries(chartConfig).map(([key, config]) => (
                          <div key={key} className="flex items-center gap-2">
                            <div 
                              className="h-2 w-2 rounded-full" 
                              style={{ backgroundColor: config.color }}
                            />
                            <span className="font-medium">{config.label}:</span>
                            <span>{data[key as keyof TimeSeriesDataPoint]}</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-2 text-xs text-muted-foreground">
                        {new Date(data.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  );
                }}
              />
              <Line
                type="monotone"
                dataKey="totalActivity"
                stroke={chartConfig.totalActivity.color}
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="suspiciousEvents"
                stroke={chartConfig.suspiciousEvents.color}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-1.5">
            <div className="flex items-center gap-2 font-medium leading-none">
              {isIncreasing ? 'Activity increasing' : 'Activity decreasing'} by {Math.abs(activityChange).toFixed(1)}%
              <TrendIcon className={cn("h-4 w-4", trendColor)} />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              Showing activity trends for the current session
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
} 