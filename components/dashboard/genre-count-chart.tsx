"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { CATEGORICAL } from "@/lib/palette";

const TOP_N = 10;

const chartConfig = {
  count: { label: "Films", color: CATEGORICAL[0].dark },
} satisfies ChartConfig;

export function GenreCountChart({
  data,
}: {
  data: { genre: string; count: number }[];
}) {
  const top = data.slice(0, TOP_N);
  const remainder = data.length - top.length;

  return (
    <Card className="py-5">
      <CardHeader className="px-5">
        <CardTitle>Films by genre</CardTitle>
        <CardDescription>
          {remainder > 0
            ? `Top ${TOP_N} genres by film count — see the table for all ${data.length}`
            : "Every genre tag, by film count"}
        </CardDescription>
      </CardHeader>
      <CardContent className="px-5">
        {top.length === 0 ? (
          <div className="flex h-72 items-center justify-center text-sm text-muted-foreground">
            No films match the current filters.
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto w-full"
            style={{ height: Math.max(180, top.length * 32) }}
          >
            <BarChart
              data={top}
              layout="vertical"
              margin={{ left: 8, right: 24, top: 4, bottom: 4 }}
            >
              <CartesianGrid horizontal={false} stroke="var(--border)" />
              <XAxis type="number" tickLine={false} axisLine={false} allowDecimals={false} />
              <YAxis
                type="category"
                dataKey="genre"
                tickLine={false}
                axisLine={false}
                width={100}
              />
              <ChartTooltip
                cursor={{ fill: "var(--muted)" }}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar
                dataKey="count"
                fill="var(--color-count)"
                radius={[0, 4, 4, 0]}
                maxBarSize={20}
              />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
