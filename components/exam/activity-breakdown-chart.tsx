"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, CartesianGrid, XAxis, ResponsiveContainer, Rectangle } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Activity, TrendingDown, TrendingUp, Mouse, Keyboard, Layout } from "lucide-react";
import { useMemo } from "react";
import { cn } from "@/lib/utils";

interface ActivityBreakdownProps {
  data: {
    mouseEvents: number;
    keyboardEvents: number;
    windowEvents: number;
    otherEvents: number;
  };
  trends?: {
    mouseEvents: number;
    keyboardEvents: number;
    windowEvents: number;
    otherEvents: number;
    overall: number;
  };
}

interface ChartDataConfig {
  label: string;
  color?: string;
}

const chartConfig = {
  count: {
    label: "Count",
  } as ChartDataConfig,
  mouseEvents: {
    label: "Mouse Events",
    color: "hsl(var(--chart-1))",
  } as ChartDataConfig,
  keyboardEvents: {
    label: "Keyboard Events",
    color: "hsl(var(--chart-2))",
  } as ChartDataConfig,
  windowEvents: {
    label: "Window Events",
    color: "hsl(var(--chart-3))",
  } as ChartDataConfig,
  otherEvents: {
    label: "Other Events",
    color: "hsl(var(--chart-4))",
  } as ChartDataConfig,
} satisfies Record<string, ChartDataConfig>;

export function ActivityBreakdownChart({ data, trends }: ActivityBreakdownProps) {
  const totalEvents = useMemo(() => {
    return Object.values(data).reduce((acc, curr) => acc + curr, 0);
  }, [data]);

  const overallTrend = trends?.overall ?? 0;
  const isIncreasing = overallTrend > 0;
  const TrendIcon = isIncreasing ? TrendingUp : TrendingDown;
  const trendColor = !isIncreasing ? 'text-green-600' : 'text-red-600';
  const trendBg = !isIncreasing ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30';

  // Prepare data for different views
  const allEventsData = useMemo(() => {
    return Object.entries(data)
      .map(([key, value]) => ({
        type: key,
        count: value,
        fill: chartConfig[key as keyof typeof chartConfig]?.color ?? "hsl(var(--muted))",
      }))
      .sort((a, b) => b.count - a.count);
  }, [data]);

  const interactionData = useMemo(() => {
    return [
      { type: "mouseEvents", count: data.mouseEvents, fill: chartConfig.mouseEvents.color },
      { type: "keyboardEvents", count: data.keyboardEvents, fill: chartConfig.keyboardEvents.color },
    ].sort((a, b) => b.count - a.count);
  }, [data]);

  const systemData = useMemo(() => {
    return [
      { type: "windowEvents", count: data.windowEvents, fill: chartConfig.windowEvents.color },
      { type: "otherEvents", count: data.otherEvents, fill: chartConfig.otherEvents.color },
    ].sort((a, b) => b.count - a.count);
  }, [data]);

  return (
    <Card className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-transparent" />
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
              <Activity className="h-5 w-5" />
              Activity Distribution
            </CardTitle>
            <CardDescription>Event type breakdown</CardDescription>
          </div>
          {trends && (
            <div className={cn(
              "flex items-center gap-2 rounded-full px-3 py-1.5",
              trendBg,
              trendColor,
              "font-medium text-sm"
            )}>
              <TrendIcon className="h-4 w-4" />
              <span>{Math.abs(overallTrend).toFixed(1)}%</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All Events</TabsTrigger>
            <TabsTrigger value="interaction">Interaction</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <div className="space-y-4">
              <div className="h-[300px]">
                <ChartContainer config={chartConfig}>
                  <BarChart 
                    data={allEventsData}
                    margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                  >
                    <CartesianGrid vertical={false} stroke="hsl(var(--border))" className="opacity-30" />
                    <XAxis
                      dataKey="type"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={10}
                      tickFormatter={(value) => chartConfig[value as keyof typeof chartConfig]?.label}
                      fontSize={12}
                      stroke="hsl(var(--muted-foreground))"
                    />
                    <ChartTooltip
                      cursor={false}
                      content={({ active, payload }) => {
                        if (!active || !payload?.length) return null;
                        const data = payload[0].payload;
                        const trend = trends?.[data.type as keyof typeof trends];
                        return (
                          <div className="rounded-lg border bg-card p-3 shadow-sm">
                            <div className="grid gap-2">
                              <div className="flex items-center gap-2">
                                <div 
                                  className="h-2 w-2 rounded-full" 
                                  style={{ backgroundColor: data.fill }}
                                />
                                <span className="font-medium">
                                  {chartConfig[data.type as keyof typeof chartConfig].label}:
                                </span>
                                <span>{data.count}</span>
                              </div>
                              {trend !== undefined && (
                                <div className="text-xs text-muted-foreground">
                                  Trend: {trend > 0 ? '+' : ''}{trend.toFixed(1)}%
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      }}
                    />
                    <Bar
                      dataKey="count"
                      radius={[4, 4, 0, 0]}
                      strokeWidth={0}
                      activeBar={({ ...props }) => (
                        <Rectangle
                          {...props}
                          fillOpacity={0.8}
                          stroke={props.fill}
                          strokeDasharray={4}
                          strokeDashoffset={4}
                        />
                      )}
                    />
                  </BarChart>
                </ChartContainer>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="interaction">
            <div className="space-y-4">
              <div className="h-[300px]">
                <ChartContainer config={chartConfig}>
                  <BarChart 
                    data={interactionData}
                    margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                  >
                    <CartesianGrid vertical={false} stroke="hsl(var(--border))" className="opacity-30" />
                    <XAxis
                      dataKey="type"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={10}
                      tickFormatter={(value) => chartConfig[value as keyof typeof chartConfig]?.label}
                      fontSize={12}
                      stroke="hsl(var(--muted-foreground))"
                    />
                    <ChartTooltip
                      cursor={false}
                      content={({ active, payload }) => {
                        if (!active || !payload?.length) return null;
                        const data = payload[0].payload;
                        const trend = trends?.[data.type as keyof typeof trends];
                        return (
                          <div className="rounded-lg border bg-card p-3 shadow-sm">
                            <div className="grid gap-2">
                              <div className="flex items-center gap-2">
                                <div 
                                  className="h-2 w-2 rounded-full" 
                                  style={{ backgroundColor: data.fill }}
                                />
                                <span className="font-medium">
                                  {chartConfig[data.type as keyof typeof chartConfig].label}:
                                </span>
                                <span>{data.count}</span>
                              </div>
                              {trend !== undefined && (
                                <div className="text-xs text-muted-foreground">
                                  Trend: {trend > 0 ? '+' : ''}{trend.toFixed(1)}%
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      }}
                    />
                    <Bar
                      dataKey="count"
                      radius={[4, 4, 0, 0]}
                      strokeWidth={0}
                      activeBar={({ ...props }) => (
                        <Rectangle
                          {...props}
                          fillOpacity={0.8}
                          stroke={props.fill}
                          strokeDasharray={4}
                          strokeDashoffset={4}
                        />
                      )}
                    />
                  </BarChart>
                </ChartContainer>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="system">
            <div className="space-y-4">
              <div className="h-[300px]">
                <ChartContainer config={chartConfig}>
                  <BarChart 
                    data={systemData}
                    margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                  >
                    <CartesianGrid vertical={false} stroke="hsl(var(--border))" className="opacity-30" />
                    <XAxis
                      dataKey="type"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={10}
                      tickFormatter={(value) => chartConfig[value as keyof typeof chartConfig]?.label}
                      fontSize={12}
                      stroke="hsl(var(--muted-foreground))"
                    />
                    <ChartTooltip
                      cursor={false}
                      content={({ active, payload }) => {
                        if (!active || !payload?.length) return null;
                        const data = payload[0].payload;
                        const trend = trends?.[data.type as keyof typeof trends];
                        return (
                          <div className="rounded-lg border bg-card p-3 shadow-sm">
                            <div className="grid gap-2">
                              <div className="flex items-center gap-2">
                                <div 
                                  className="h-2 w-2 rounded-full" 
                                  style={{ backgroundColor: data.fill }}
                                />
                                <span className="font-medium">
                                  {chartConfig[data.type as keyof typeof chartConfig].label}:
                                </span>
                                <span>{data.count}</span>
                              </div>
                              {trend !== undefined && (
                                <div className="text-xs text-muted-foreground">
                                  Trend: {trend > 0 ? '+' : ''}{trend.toFixed(1)}%
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      }}
                    />
                    <Bar
                      dataKey="count"
                      radius={[4, 4, 0, 0]}
                      strokeWidth={0}
                      activeBar={({ ...props }) => (
                        <Rectangle
                          {...props}
                          fillOpacity={0.8}
                          stroke={props.fill}
                          strokeDasharray={4}
                          strokeDashoffset={4}
                        />
                      )}
                    />
                  </BarChart>
                </ChartContainer>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex items-center justify-between text-sm">
        <div className="flex gap-2 font-medium leading-none">
          {isIncreasing ? 'Activity increasing' : 'Activity decreasing'} by {Math.abs(overallTrend).toFixed(1)}%
          <TrendIcon className={cn("h-4 w-4", trendColor)} />
        </div>
        <div className="text-muted-foreground">
          Total events: {totalEvents.toLocaleString()}
        </div>
      </CardFooter>
    </Card>
  );
} 