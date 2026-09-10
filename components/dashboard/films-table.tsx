"use client";

import * as React from "react";
import { ArrowUpDown, ExternalLink } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { GenreChip } from "@/components/dashboard/genre-chip";
import type { GenreColorMap } from "@/lib/palette";
import type { Film } from "@/lib/types";

type SortKey = "rank" | "title" | "imdb_rating";

export function FilmsTable({
  id,
  films,
  colorMap,
}: {
  id?: string;
  films: Film[];
  colorMap: GenreColorMap;
}) {
  const [sortKey, setSortKey] = React.useState<SortKey>("rank");
  const [ascending, setAscending] = React.useState(true);

  const sorted = React.useMemo(() => {
    const copy = [...films];
    copy.sort((a, b) => {
      const dir = ascending ? 1 : -1;
      if (sortKey === "title") return a.title.localeCompare(b.title) * dir;
      return (a[sortKey] - b[sortKey]) * dir;
    });
    return copy;
  }, [films, sortKey, ascending]);

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setAscending((a) => !a);
    } else {
      setSortKey(key);
      setAscending(key !== "imdb_rating");
    }
  }

  return (
    <Card id={id} className="py-5">
      <CardHeader className="px-5">
        <CardTitle>Full catalog</CardTitle>
        <CardDescription>
          {films.length} film{films.length === 1 ? "" : "s"} matching the
          current filters
        </CardDescription>
      </CardHeader>
      <CardContent className="px-5">
        <ScrollArea className="h-[520px] rounded-md border border-border">
          <Table>
            <TableHeader className="sticky top-0 z-10 bg-card">
              <TableRow>
                <SortableHead
                  label="Rank"
                  active={sortKey === "rank"}
                  ascending={ascending}
                  onClick={() => toggleSort("rank")}
                  className="w-16"
                />
                <SortableHead
                  label="Title"
                  active={sortKey === "title"}
                  ascending={ascending}
                  onClick={() => toggleSort("title")}
                />
                <SortableHead
                  label="Rating"
                  active={sortKey === "imdb_rating"}
                  ascending={ascending}
                  onClick={() => toggleSort("imdb_rating")}
                  className="w-24 text-right"
                  align="right"
                />
                <TableHead>Genres</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {sorted.map((film) => (
                <TableRow key={film.rank}>
                  <TableCell className="font-mono text-muted-foreground tabular-nums">
                    {film.rank}
                  </TableCell>
                  <TableCell className="font-medium">{film.title}</TableCell>
                  <TableCell className="text-right font-mono tabular-nums">
                    {film.imdb_rating.toFixed(1)}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {film.genres.map((genre) => (
                        <GenreChip
                          key={genre}
                          genre={genre}
                          colorMap={colorMap}
                          className="py-0.5 text-[11px]"
                        />
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button asChild variant="ghost" size="icon" className="size-7">
                      <a
                        href={film.imdb_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Open ${film.title} on IMDb`}
                      >
                        <ExternalLink className="size-3.5" />
                      </a>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {sorted.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No films match the current filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

function SortableHead({
  label,
  active,
  ascending,
  onClick,
  className,
  align,
}: {
  label: string;
  active: boolean;
  ascending: boolean;
  onClick: () => void;
  className?: string;
  align?: "right";
}) {
  return (
    <TableHead className={className}>
      <button
        type="button"
        onClick={onClick}
        className={`inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground ${
          align === "right" ? "flex-row-reverse" : ""
        }`}
      >
        {label}
        <ArrowUpDown
          className={`size-3 ${active ? "text-primary" : "opacity-40"}`}
          style={
            active ? { transform: ascending ? "scaleY(-1)" : undefined } : undefined
          }
        />
      </button>
    </TableHead>
  );
}
