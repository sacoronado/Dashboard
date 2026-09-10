"use client";

import { Star } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GenreChip } from "@/components/dashboard/genre-chip";
import type { GenreColorMap } from "@/lib/palette";
import type { Film } from "@/lib/types";

const COUNT = 10;

export function TopBottom({
  films,
  colorMap,
}: {
  films: Film[];
  colorMap: GenreColorMap;
}) {
  const byRating = [...films].sort((a, b) => b.imdb_rating - a.imdb_rating);
  const top = byRating.slice(0, COUNT);
  const bottom = byRating.slice(-COUNT).reverse();

  return (
    <Card className="py-5">
      <CardHeader className="px-5">
        <CardTitle>Top vs. bottom rated</CardTitle>
        <CardDescription>Best and worst of the current selection</CardDescription>
      </CardHeader>
      <CardContent className="px-5">
        <Tabs defaultValue="top">
          <TabsList>
            <TabsTrigger value="top">Top {COUNT}</TabsTrigger>
            <TabsTrigger value="bottom">Bottom {COUNT}</TabsTrigger>
          </TabsList>
          <TabsContent value="top">
            <Leaderboard films={top} colorMap={colorMap} />
          </TabsContent>
          <TabsContent value="bottom">
            <Leaderboard films={bottom} colorMap={colorMap} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

function Leaderboard({
  films,
  colorMap,
}: {
  films: Film[];
  colorMap: GenreColorMap;
}) {
  if (films.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        No films match the current filters.
      </p>
    );
  }

  return (
    <ol className="divide-y divide-border">
      {films.map((film, index) => (
        <li key={film.rank} className="flex items-center gap-3 py-2.5">
          <span className="w-5 shrink-0 text-right font-mono text-sm text-muted-foreground tabular-nums">
            {index + 1}
          </span>
          <span className="flex-1 truncate text-sm font-medium">
            {film.title}
          </span>
          <GenreChip
            genre={film.primary_genre}
            colorMap={colorMap}
            className="hidden py-0.5 text-[11px] sm:inline-flex"
          />
          <span className="flex shrink-0 items-center gap-1 font-mono text-sm font-medium tabular-nums">
            <Star className="size-3.5 fill-primary text-primary" />
            {film.imdb_rating.toFixed(1)}
          </span>
        </li>
      ))}
    </ol>
  );
}
