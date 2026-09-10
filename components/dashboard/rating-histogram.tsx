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
import type { HistogramBin } from "@/lib/aggregate";
import { SEQUENTIAL_BLUE } from "@/lib/palette";

const chartConfig = {
  count: { label: "Films", color: SEQUENTIAL_BLUE[3] },
} satisfies ChartConfig;

export function RatingHistogram({ bins }: { bins: HistogramBin[] }) {
  return (
    <Card className="py-5">
      <CardHeader className="px-5">
        <CardTitle>Rating distribution</CardTitle>
        <CardDescription>
          How many films land at each IMDb rating band
        </CardDescription>
      </CardHeader>
      <CardContent className="px-5">
        {bins.length === 0 ? (
          <EmptyState />
        ) : (
          <ChartContainer config={chartConfig} className="aspect-auto h-64 w-full">
            <BarChart data={bins} margin={{ left: 0, right: 8, top: 4 }}>
              <CartesianGrid vertical={false} stroke="var(--border)" />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                interval="preserveStartEnd"
              />
              <YAxis tickLine={false} axisLine={false} width={28} allowDecimals={false} />
              <ChartTooltip
                cursor={{ fill: "var(--muted)" }}
                content={
                  <ChartTooltipContent
                    labelFormatter={(label) => `Rating ${label}–${(Number(label) + 0.5).toFixed(1)}`}
                  />
                }
              />
              <Bar dataKey="count" fill="var(--color-count)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}

function EmptyState() {
  return (
    <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
      No films match the current filters.
    </div>
  );
}
