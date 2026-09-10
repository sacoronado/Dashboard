"use client";

import { Search, X } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { GenreChip } from "@/components/dashboard/genre-chip";
import type { GenreColorMap } from "@/lib/palette";

export function Filters({
  allGenres,
  colorMap,
  search,
  onSearchChange,
  minRating,
  onMinRatingChange,
  selectedGenres,
  onToggleGenre,
  onReset,
}: {
  allGenres: string[];
  colorMap: GenreColorMap;
  search: string;
  onSearchChange: (value: string) => void;
  minRating: number;
  onMinRatingChange: (value: number) => void;
  selectedGenres: Set<string>;
  onToggleGenre: (genre: string) => void;
  onReset: () => void;
}) {
  const isFiltered = search !== "" || minRating > 0 || selectedGenres.size > 0;

  return (
    <Card className="py-5">
      <CardContent className="flex flex-col gap-5 px-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search titles…"
              className="pl-9"
            />
          </div>

          <div className="flex min-w-56 items-center gap-3">
            <span className="shrink-0 text-sm text-muted-foreground">
              Min. rating
            </span>
            <Slider
              value={[minRating]}
              min={0}
              max={10}
              step={0.1}
              onValueChange={([v]) => onMinRatingChange(v)}
              className="flex-1"
            />
            <span className="w-9 shrink-0 text-right text-sm font-medium tabular-nums">
              {minRating.toFixed(1)}
            </span>
          </div>

          {isFiltered && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onReset}
              className="gap-1.5 text-muted-foreground"
            >
              <X className="size-3.5" />
              Reset
            </Button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {allGenres.map((genre) => (
            <GenreChip
              key={genre}
              genre={genre}
              colorMap={colorMap}
              selected={selectedGenres.has(genre)}
              onClick={() => onToggleGenre(genre)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
