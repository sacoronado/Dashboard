"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts";

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
import { DIVERGING } from "@/lib/palette";
import { useColorMode } from "@/hooks/use-color-mode";

const chartConfig = {
  delta: { label: "Δ vs. average" },
} satisfies ChartConfig;

export function GenreRatingChart({
  data,
  overallAvg,
}: {
  data: { genre: string; avg: number; count: number }[];
  overallAvg: number;
}) {
  const mode = useColorMode();
  const rows = data
    .map((d) => ({ ...d, delta: d.avg - overallAvg }))
    .sort((a, b) => b.delta - a.delta);

  return (
    <Card className="py-5">
      <CardHeader className="px-5">
        <CardTitle>Genre rating vs. overall average</CardTitle>
        <CardDescription>
          Average IMDb rating per genre, relative to the {overallAvg.toFixed(2)}{" "}
          overall average
        </CardDescription>
      </CardHeader>
      <CardContent className="px-5">
        {rows.length === 0 ? (
          <div className="flex h-72 items-center justify-center text-sm text-muted-foreground">
            No films match the current filters.
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto w-full"
            style={{ height: Math.max(180, rows.length * 32) }}
          >
            <BarChart
              data={rows}
              layout="vertical"
              margin={{ left: 8, right: 24, top: 4, bottom: 4 }}
            >
              <CartesianGrid horizontal={false} stroke="var(--border)" />
              <XAxis
                type="number"
                tickLine={false}
                axisLine={false}
                tickFormatter={(v: number) => (v > 0 ? `+${v}` : `${v}`)}
              />
              <YAxis
                type="category"
                dataKey="genre"
                tickLine={false}
                axisLine={false}
                width={100}
              />
              <ReferenceLine x={0} stroke="var(--muted-foreground)" />
              <ChartTooltip
                cursor={{ fill: "var(--muted)" }}
                content={
                  <ChartTooltipContent
                    hideLabel
                    formatter={(value, _name, item) => (
                      <div className="flex w-full items-center justify-between gap-3">
                        <span className="text-muted-foreground">
                          {item.payload.genre}
                        </span>
                        <span className="font-mono font-medium text-foreground tabular-nums">
                          {item.payload.avg.toFixed(2)} (
                          {Number(value) > 0 ? "+" : ""}
                          {Number(value).toFixed(2)})
                        </span>
                      </div>
                    )}
                  />
                }
              />
              <Bar dataKey="delta" radius={4} maxBarSize={20}>
                {rows.map((row) => (
                  <Cell
                    key={row.genre}
                    fill={
                      row.delta >= 0
                        ? DIVERGING.positive[mode]
                        : DIVERGING.negative[mode]
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
