"use client";

import { TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Area, AreaChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface WindowSizeChartProps {
  data: Array<{
    timestamp: string;
    windowWidth: number;
    windowHeight: number;
  }>;
  screenWidth: number;
  screenHeight: number;
}

const chartConfig = {
  width: {
    label: "Width",
    color: "hsl(var(--chart-1))",
  },
  height: {
    label: "Height",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function WindowSizeChart({ data, screenWidth, screenHeight }: WindowSizeChartProps) {
  const formattedData = data.map(item => ({
    time: new Date(item.timestamp).toLocaleTimeString(),
    width: item.windowWidth,
    height: item.windowHeight,
  }));

  // Calculate trend
  const latestWidth = formattedData[formattedData.length - 1]?.width;
  const prevWidth = formattedData[formattedData.length - 2]?.width;
  const widthTrend = prevWidth ? ((latestWidth - prevWidth) / prevWidth) * 100 : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Window Size Changes</CardTitle>
        <CardDescription>Screen Resolution: {screenWidth}×{screenHeight}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={formattedData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
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
                domain={[0, Math.max(screenWidth, screenHeight)]}
                tickMargin={8}
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <defs>
                <linearGradient id="fillWidth" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-width)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--color-width)" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="fillHeight" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-height)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--color-height)" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <Area
                type="stepAfter"
                dataKey="height"
                stroke="var(--color-height)"
                fill="url(#fillHeight)"
                fillOpacity={0.4}
                strokeWidth={2}
              />
              <Area
                type="stepAfter"
                dataKey="width"
                stroke="var(--color-width)"
                fill="url(#fillWidth)"
                fillOpacity={0.4}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              {widthTrend > 0 ? (
                <>Window size increased by {widthTrend.toFixed(1)}% <TrendingUp className="h-4 w-4" /></>
              ) : (
                <>Window size decreased by {Math.abs(widthTrend).toFixed(1)}% <TrendingDown className="h-4 w-4" /></>
              )}
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              Current: {latestWidth}×{formattedData[formattedData.length - 1]?.height}
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
} 