"use client";

import * as React from "react";

import { Filters } from "@/components/dashboard/filters";
import { StatTiles } from "@/components/dashboard/stat-tiles";
import { RatingHistogram } from "@/components/dashboard/rating-histogram";
import { GenreCountChart } from "@/components/dashboard/genre-count-chart";
import { GenreRatingChart } from "@/components/dashboard/genre-rating-chart";
import { TopBottom } from "@/components/dashboard/top-bottom";
import { FilmsTable } from "@/components/dashboard/films-table";
import {
  avgRatingByGenre,
  computeStats,
  countByGenre,
  ratingHistogram,
} from "@/lib/aggregate";
import { buildGenreColorMap } from "@/lib/palette";
import type { Film } from "@/lib/types";

export function Dashboard({ films }: { films: Film[] }) {
  const [search, setSearch] = React.useState("");
  const [minRating, setMinRating] = React.useState(0);
  const [selectedGenres, setSelectedGenres] = React.useState<Set<string>>(
    new Set()
  );

  // Colors and the filter chip order are derived from the FULL dataset so a
  // genre's color never repaints when the active filter narrows the results.
  const colorMap = React.useMemo(
    () => buildGenreColorMap(films.map((f) => f.genres)),
    [films]
  );
  const allGenres = React.useMemo(() => [...colorMap.keys()], [colorMap]);
  const overallAvg = React.useMemo(
    () => computeStats(films).avgRating,
    [films]
  );

  const filtered = React.useMemo(() => {
    const query = search.trim().toLowerCase();
    return films.filter((film) => {
      if (film.imdb_rating < minRating) return false;
      if (query && !film.title.toLowerCase().includes(query)) return false;
      if (
        selectedGenres.size > 0 &&
        !film.genres.some((g) => selectedGenres.has(g))
      )
        return false;
      return true;
    });
  }, [films, search, minRating, selectedGenres]);

  const stats = React.useMemo(() => computeStats(filtered), [filtered]);
  const genreCounts = React.useMemo(() => countByGenre(filtered), [filtered]);
  const genreRatings = React.useMemo(
    () => avgRatingByGenre(filtered),
    [filtered]
  );
  const histogram = React.useMemo(() => ratingHistogram(filtered), [filtered]);

  function toggleGenre(genre: string) {
    setSelectedGenres((prev) => {
      const next = new Set(prev);
      if (next.has(genre)) next.delete(genre);
      else next.add(genre);
      return next;
    });
  }

  function resetFilters() {
    setSearch("");
    setMinRating(0);
    setSelectedGenres(new Set());
  }

  return (
    <div className="flex flex-col gap-6">
      <StatTiles
        totalFilms={stats.totalFilms}
        avgRating={stats.avgRating}
        uniqueGenres={stats.uniqueGenres}
        topGenre={stats.topGenre}
      />

      <Filters
        allGenres={allGenres}
        colorMap={colorMap}
        search={search}
        onSearchChange={setSearch}
        minRating={minRating}
        onMinRatingChange={setMinRating}
        selectedGenres={selectedGenres}
        onToggleGenre={toggleGenre}
        onReset={resetFilters}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <RatingHistogram bins={histogram} />
        <TopBottom films={filtered} colorMap={colorMap} />
        <GenreCountChart data={genreCounts} />
        <GenreRatingChart data={genreRatings} overallAvg={overallAvg} />
      </div>

      <FilmsTable id="catalog" films={filtered} colorMap={colorMap} />
    </div>
  );
}
