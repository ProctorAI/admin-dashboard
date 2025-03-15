"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip } from "recharts";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";

interface ActivityHeatmapProps {
  timeSeriesData: Array<{
    hour: number;
    minute: number;
    totalActivity: number;
    suspiciousEvents: number;
  }>;
}

const chartConfig = {
  activity: {
    label: "Activity Level",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function ActivityHeatmap({ timeSeriesData }: ActivityHeatmapProps) {
  const formattedData = timeSeriesData.map(point => ({
    x: point.hour,
    y: point.minute,
    z: point.totalActivity,
    suspicious: point.suspiciousEvents,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Heatmap</CardTitle>
        <CardDescription>Activity distribution over time</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart
              margin={{
                top: 20,
                right: 20,
                bottom: 20,
                left: 20,
              }}
            >
              <XAxis
                type="number"
                dataKey="x"
                name="hour"
                domain={[0, 23]}
                tickCount={24}
                label={{ value: 'Hour', position: 'bottom' }}
              />
              <YAxis
                type="number"
                dataKey="y"
                name="minute"
                domain={[0, 59]}
                tickCount={12}
                label={{ value: 'Minute', angle: -90, position: 'left' }}
              />
              <ZAxis
                type="number"
                dataKey="z"
                range={[50, 500]}
              />
              <Tooltip
                cursor={{ strokeDasharray: '3 3' }}
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const data = payload[0].payload;
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                      <div className="grid gap-2">
                        <div className="text-sm font-medium">
                          Time: {`${data.x.toString().padStart(2, '0')}:${data.y.toString().padStart(2, '0')}`}
                        </div>
                        <div className="text-sm">
                          Activity: {data.z}
                        </div>
                        <div className="text-sm">
                          Suspicious Events: {data.suspicious}
                        </div>
                      </div>
                    </div>
                  );
                }}
              />
              <Scatter
                data={formattedData}
                fill="var(--color-activity)"
              />
            </ScatterChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
} 