"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { TrendingUp, TrendingDown } from "lucide-react";
import { 
  ChartConfig, 
  ChartContainer, 
  ChartTooltip, 
  ChartLegend,
  ChartLegendContent,
  ChartTooltipContent 
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

interface RiskTrendProps {
  data: Array<{ 
    timestamp: string; 
    score: number;
    mouseScore: number;
    keyboardScore: number;
    windowScore: number;
  }>;
}

type MetricKey = "totalRisk" | "mouseScore" | "keyboardScore" | "windowScore";

const chartConfig = {
  totalRisk: {
    label: "Total Risk",
    color: "hsl(0 92% 60%)",
  },
  mouseScore: {
    label: "Mouse Activity",
    color: "hsl(217 91% 60%)",
  },
  keyboardScore: {
    label: "Keyboard Activity",
    color: "hsl(142 71% 45%)",
  },
  windowScore: {
    label: "Window Activity",
    color: "hsl(47 95% 53%)",
  },
} satisfies ChartConfig;

export function RiskTrendChart({ data }: RiskTrendProps) {
  const [timeRange, setTimeRange] = React.useState("30m");

  // Filter data based on time range
  const filterData = (data: any[], minutes: number) => {
    const cutoff = new Date(Date.now() - minutes * 60 * 1000);
    return data.filter(item => new Date(item.timestamp) >= cutoff);
  };

  const getFilteredData = () => {
    switch (timeRange) {
      case "15m":
        return filterData(data, 15);
      case "1h":
        return filterData(data, 60);
      default:
        return filterData(data, 30);
    }
  };

  const filteredData = getFilteredData();
  
  // Format data for charts
  const formattedData = filteredData.map(item => ({
    time: new Date(item.timestamp).toLocaleTimeString(),
    totalRisk: item.score,
    mouseScore: item.mouseScore,
    keyboardScore: item.keyboardScore,
    windowScore: item.windowScore,
  }));

  // Calculate trends
  const calculateTrend = (metric: MetricKey) => {
    const recentValues = formattedData.slice(-5);
    const olderValues = formattedData.slice(-10, -5);
    const recentAvg = recentValues.reduce((acc, curr) => acc + curr[metric], 0) / recentValues.length;
    const olderAvg = olderValues.reduce((acc, curr) => acc + curr[metric], 0) / olderValues.length;
    return ((recentAvg - olderAvg) / olderAvg) * 100;
  };

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Risk Score Analysis</CardTitle>
          <CardDescription>Real-time monitoring of risk indicators</CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[160px] rounded-lg sm:ml-auto">
            <SelectValue placeholder="Last 30 minutes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="15m">Last 15 minutes</SelectItem>
            <SelectItem value="30m">Last 30 minutes</SelectItem>
            <SelectItem value="1h">Last hour</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="combined" className="space-y-4">
          <div className="border-b px-6 py-2">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="combined" className="rounded-lg w-full">Combined Risk</TabsTrigger>
              <TabsTrigger value="individual" className="rounded-lg w-full">Individual Scores</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="combined" className="px-6">
            <ChartContainer config={chartConfig} className="aspect-auto h-[300px] w-full">
              <AreaChart data={formattedData}>
                <defs>
                  <linearGradient id="fillRisk" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-totalRisk)" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="var(--color-totalRisk)" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="time"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => value.slice(0, 5)}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  domain={[0, 100]}
                  tickMargin={8}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent />}
                />
                <Area
                  type="monotone"
                  dataKey="totalRisk"
                  stroke="var(--color-totalRisk)"
                  fill="url(#fillRisk)"
                  fillOpacity={0.4}
                  strokeWidth={2}
                />
              </AreaChart>
            </ChartContainer>
            <div className="mt-4 flex items-center justify-between text-sm">
              <div className={`flex items-center gap-2 font-medium ${
                calculateTrend('totalRisk') <= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                Risk {calculateTrend('totalRisk') <= 0 ? 'decreasing' : 'increasing'} 
                by {Math.abs(calculateTrend('totalRisk')).toFixed(1)}%
                {calculateTrend('totalRisk') <= 0 ? 
                  <TrendingDown className="h-4 w-4" /> : 
                  <TrendingUp className="h-4 w-4" />
                }
              </div>
              <div className="text-muted-foreground">
                Current Risk Score: {formattedData[formattedData.length - 1]?.totalRisk.toFixed(1)}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="individual" className="px-6">
            <ChartContainer config={chartConfig} className="aspect-auto h-[300px] w-full">
              <AreaChart data={formattedData}>
                <defs>
                  {(Object.entries(chartConfig) as Array<[MetricKey, { color: string }]>).map(([key, config]) => (
                    <linearGradient key={key} id={`fill${key}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={config.color} stopOpacity={0.8} />
                      <stop offset="95%" stopColor={config.color} stopOpacity={0.1} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="time"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => value.slice(0, 5)}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  domain={[0, 100]}
                  tickMargin={8}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent />}
                />
                {(['mouseScore', 'keyboardScore', 'windowScore'] as const).map((key) => (
                  <Area
                    key={key}
                    type="monotone"
                    dataKey={key}
                    stroke={`var(--color-${key})`}
                    fill={`url(#fill${key})`}
                    fillOpacity={0.4}
                    strokeWidth={2}
                  />
                ))}
                <ChartLegend content={<ChartLegendContent />} />
              </AreaChart>
            </ChartContainer>
            <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
              {(['mouseScore', 'keyboardScore', 'windowScore'] as const).map((metric) => (
                <div key={metric} className="flex flex-col gap-1">
                  <div className="font-medium">{chartConfig[metric].label}</div>
                  <div className={`flex items-center gap-1 ${
                    calculateTrend(metric) <= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {Math.abs(calculateTrend(metric)).toFixed(1)}%
                    {calculateTrend(metric) <= 0 ? 
                      <TrendingDown className="h-3 w-3" /> : 
                      <TrendingUp className="h-3 w-3" />
                    }
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}