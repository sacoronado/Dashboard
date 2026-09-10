import type { Film } from "@/lib/types";

export function computeStats(films: Film[]) {
  const genreSet = new Set(films.flatMap((f) => f.genres));
  const avgRating =
    films.length > 0
      ? films.reduce((sum, f) => sum + f.imdb_rating, 0) / films.length
      : 0;

  const genreCounts = countByGenre(films);
  const topGenre = genreCounts[0]?.genre ?? "—";

  return {
    totalFilms: films.length,
    avgRating,
    uniqueGenres: genreSet.size,
    topGenre,
  };
}

export function countByGenre(films: Film[]): { genre: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const film of films) {
    for (const genre of film.genres) {
      counts.set(genre, (counts.get(genre) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([genre, count]) => ({ genre, count }))
    .sort((a, b) => b.count - a.count || a.genre.localeCompare(b.genre));
}

export function avgRatingByGenre(
  films: Film[]
): { genre: string; avg: number; count: number }[] {
  const sums = new Map<string, { total: number; count: number }>();
  for (const film of films) {
    for (const genre of film.genres) {
      const entry = sums.get(genre) ?? { total: 0, count: 0 };
      entry.total += film.imdb_rating;
      entry.count += 1;
      sums.set(genre, entry);
    }
  }
  return [...sums.entries()]
    .map(([genre, { total, count }]) => ({ genre, avg: total / count, count }))
    .sort((a, b) => b.avg - a.avg);
}

export interface HistogramBin {
  label: string;
  min: number;
  max: number;
  count: number;
}

export function ratingHistogram(films: Film[], binSize = 0.5): HistogramBin[] {
  if (films.length === 0) return [];

  const min = Math.floor(Math.min(...films.map((f) => f.imdb_rating)) / binSize) * binSize;
  const max = Math.ceil(Math.max(...films.map((f) => f.imdb_rating)) / binSize) * binSize;
  const binCount = Math.max(1, Math.round((max - min) / binSize));

  const bins: HistogramBin[] = Array.from({ length: binCount }, (_, i) => {
    const binMin = min + i * binSize;
    const binMax = binMin + binSize;
    return { label: binMin.toFixed(1), min: binMin, max: binMax, count: 0 };
  });

  for (const film of films) {
    const idx = Math.min(
      binCount - 1,
      Math.max(0, Math.floor((film.imdb_rating - min) / binSize))
    );
    bins[idx].count += 1;
  }

  return bins;
}
