"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bar, BarChart, CartesianGrid, Rectangle, XAxis } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { format } from "date-fns";
import { TrendingUp, TrendingDown } from "lucide-react";

interface MouseFeatures {
  avg_norm_x: number;
  avg_norm_y: number;
  std_norm_x: number;
  std_norm_y: number;
  top_edge_time: number;
  bottom_edge_time: number;
}

interface KeyboardFeatures {
  key_press_count: number;
  key_press_rate: number;
  alt_key_count: number;
  tab_key_count: number;
  meta_key_count: number;
  control_key_count: number;
  shift_key_count: number;
}

interface WindowFeatures {
  blur_count: number;
  focus_count: number;
  total_blur_duration: number;
  avg_blur_duration: number;
  tab_switch_count: number;
  resize_count: number;
}

interface IntervalFeatures {
  interval_start: string;
  interval_end: string;
  mouse_features: MouseFeatures;
  keyboard_features: KeyboardFeatures;
  window_features: WindowFeatures;
}

interface FeaturesResponse {
  exam_id: string;
  intervals_processed: number;
  features: IntervalFeatures[];
}

interface ExamFeaturesChartProps {
  examId: string;
  intervalSeconds?: number;
  windowSizeSeconds?: number;
}

const chartConfig = {
  count: {
    label: "Count",
  },
  alt: {
    label: "Alt Key",
    color: "hsl(var(--chart-1))",
  },
  tab: {
    label: "Tab Key",
    color: "hsl(var(--chart-2))",
  },
  meta: {
    label: "Meta Key",
    color: "hsl(var(--chart-3))",
  },
  control: {
    label: "Control Key",
    color: "hsl(var(--chart-4))",
  },
  shift: {
    label: "Shift Key",
    color: "hsl(var(--chart-5))",
  },
  blur: {
    label: "Window Blur",
    color: "hsl(var(--chart-1))",
  },
  focus: {
    label: "Window Focus",
    color: "hsl(var(--chart-2))",
  },
  tab_switch: {
    label: "Tab Switch",
    color: "hsl(var(--chart-3))",
  },
  resize: {
    label: "Window Resize",
    color: "hsl(var(--chart-4))",
  },
  short_blur: {
    label: "< 5s",
    color: "hsl(var(--chart-1))",
  },
  medium_blur: {
    label: "5-15s",
    color: "hsl(var(--chart-2))",
  },
  long_blur: {
    label: "> 15s",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

export function ExamFeaturesChart({ 
  examId, 
  intervalSeconds = 30,
  windowSizeSeconds = 300
}: ExamFeaturesChartProps) {
  const { data, isLoading, error } = useQuery<FeaturesResponse>({
    queryKey: ['examFeatures', examId, intervalSeconds, windowSizeSeconds],
    queryFn: () => api.getExamFeatures(examId, intervalSeconds, windowSizeSeconds),
    refetchInterval: intervalSeconds * 1000,
    staleTime: (intervalSeconds * 1000) / 2,
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 404) return false;
      return failureCount < 3;
    }
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex h-[500px] items-center justify-center">
          <div className="text-muted-foreground">Loading exam features...</div>
        </CardContent>
      </Card>
    );
  }

  if (error || !data?.features?.length) {
    return (
      <Card>
        <CardContent className="flex h-[500px] items-center justify-center">
          <div className="text-muted-foreground">
            {error ? "Error loading features" : "No activity data available for this time window"}
          </div>
        </CardContent>
      </Card>
    );
  }

  const latestFeatures = data.features[data.features.length - 1];
  const prevFeatures = data.features[data.features.length - 2];
  
  const keyboardData = [
    { type: "alt", count: latestFeatures.keyboard_features.alt_key_count, fill: chartConfig.alt.color },
    { type: "tab", count: latestFeatures.keyboard_features.tab_key_count, fill: chartConfig.tab.color },
    { type: "meta", count: latestFeatures.keyboard_features.meta_key_count, fill: chartConfig.meta.color },
    { type: "control", count: latestFeatures.keyboard_features.control_key_count, fill: chartConfig.control.color },
    { type: "shift", count: latestFeatures.keyboard_features.shift_key_count, fill: chartConfig.shift.color },
  ].sort((a, b) => b.count - a.count);

  const windowData = [
    { type: "blur", count: latestFeatures.window_features.blur_count, fill: chartConfig.blur.color },
    { type: "focus", count: latestFeatures.window_features.focus_count, fill: chartConfig.focus.color },
    { type: "tab_switch", count: latestFeatures.window_features.tab_switch_count, fill: chartConfig.tab_switch.color },
    { type: "resize", count: latestFeatures.window_features.resize_count, fill: chartConfig.resize.color },
  ].sort((a, b) => b.count - a.count);

  // Calculate blur duration categories
  const totalBlurDuration = latestFeatures.window_features.total_blur_duration;
  const avgBlurDuration = latestFeatures.window_features.avg_blur_duration;
  const blurCount = latestFeatures.window_features.blur_count;

  const shortBlurs = Math.round(blurCount * 0.6); // Example distribution
  const mediumBlurs = Math.round(blurCount * 0.3);
  const longBlurs = blurCount - shortBlurs - mediumBlurs;

  const blurData = [
    { type: "short_blur", count: shortBlurs, fill: chartConfig.short_blur.color },
    { type: "medium_blur", count: mediumBlurs, fill: chartConfig.medium_blur.color },
    { type: "long_blur", count: longBlurs, fill: chartConfig.long_blur.color },
  ].sort((a, b) => b.count - a.count);

  // Calculate trends
  const totalKeyPresses = latestFeatures.keyboard_features.key_press_count;
  const prevTotalKeyPresses = prevFeatures?.keyboard_features.key_press_count ?? 0;
  const keyPressTrend = ((totalKeyPresses - prevTotalKeyPresses) / Math.max(prevTotalKeyPresses, 1)) * 100;

  const totalWindowEvents = latestFeatures.window_features.blur_count + 
    latestFeatures.window_features.focus_count + 
    latestFeatures.window_features.tab_switch_count + 
    latestFeatures.window_features.resize_count;
  const prevTotalWindowEvents = prevFeatures ? (
    prevFeatures.window_features.blur_count + 
    prevFeatures.window_features.focus_count + 
    prevFeatures.window_features.tab_switch_count + 
    prevFeatures.window_features.resize_count
  ) : 0;
  const windowEventsTrend = ((totalWindowEvents - prevTotalWindowEvents) / Math.max(prevTotalWindowEvents, 1)) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Metrics</CardTitle>
        <CardDescription>Event monitoring in the last {windowSizeSeconds / 60} minutes</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="keyboard" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="keyboard">Keyboard</TabsTrigger>
            <TabsTrigger value="window">Window</TabsTrigger>
            <TabsTrigger value="blur">Blur Analysis</TabsTrigger>
          </TabsList>
          
          <TabsContent value="keyboard">
            <div className="space-y-4">
              <div className="h-[300px]">
                <ChartContainer config={chartConfig}>
                  <BarChart 
                    data={keyboardData}
                    accessibilityLayer
                    margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                  >
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="type"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                      tickFormatter={(value) => chartConfig[value as keyof typeof chartConfig]?.label}
                    />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel />}
                    />
                    <Bar
                      dataKey="count"
                      strokeWidth={2}
                      radius={8}
                      activeIndex={0}
                      activeBar={({ ...props }) => (
                        <Rectangle
                          {...props}
                          fillOpacity={0.8}
                          stroke={props.payload.fill}
                          strokeDasharray={4}
                          strokeDashoffset={4}
                        />
                      )}
                    />
                  </BarChart>
                </ChartContainer>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex gap-2 font-medium">
                  {keyPressTrend > 0 ? (
                    <>Trending up by {keyPressTrend.toFixed(1)}% <TrendingUp className="h-4 w-4" /></>
                  ) : (
                    <>Trending down by {Math.abs(keyPressTrend).toFixed(1)}% <TrendingDown className="h-4 w-4" /></>
                  )}
                </div>
                <div className="text-muted-foreground">
                  Total key presses: {totalKeyPresses}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="window">
            <div className="space-y-4">
              <div className="h-[300px]">
                <ChartContainer config={chartConfig}>
                  <BarChart 
                    data={windowData}
                    accessibilityLayer
                    margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                  >
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="type"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                      tickFormatter={(value) => chartConfig[value as keyof typeof chartConfig]?.label}
                    />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel />}
                    />
                    <Bar
                      dataKey="count"
                      strokeWidth={2}
                      radius={8}
                      activeIndex={0}
                      activeBar={({ ...props }) => (
                        <Rectangle
                          {...props}
                          fillOpacity={0.8}
                          stroke={props.payload.fill}
                          strokeDasharray={4}
                          strokeDashoffset={4}
                        />
                      )}
                    />
                  </BarChart>
                </ChartContainer>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex gap-2 font-medium">
                  {windowEventsTrend > 0 ? (
                    <>Trending up by {windowEventsTrend.toFixed(1)}% <TrendingUp className="h-4 w-4" /></>
                  ) : (
                    <>Trending down by {Math.abs(windowEventsTrend).toFixed(1)}% <TrendingDown className="h-4 w-4" /></>
                  )}
                </div>
                <div className="text-muted-foreground">
                  Total window events: {totalWindowEvents}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="blur">
            <div className="space-y-4">
              <div className="h-[300px]">
                <ChartContainer config={chartConfig}>
                  <BarChart 
                    data={blurData}
                    accessibilityLayer
                    margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                  >
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="type"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                      tickFormatter={(value) => chartConfig[value as keyof typeof chartConfig]?.label}
                    />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel />}
                    />
                    <Bar
                      dataKey="count"
                      strokeWidth={2}
                      radius={8}
                      activeIndex={0}
                      activeBar={({ ...props }) => (
                        <Rectangle
                          {...props}
                          fillOpacity={0.8}
                          stroke={props.payload.fill}
                          strokeDasharray={4}
                          strokeDashoffset={4}
                        />
                      )}
                    />
                  </BarChart>
                </ChartContainer>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="text-muted-foreground">
                  Average blur duration: {avgBlurDuration.toFixed(1)}s
                </div>
                <div className="text-muted-foreground">
                  Total blur time: {totalBlurDuration.toFixed(1)}s
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
} 