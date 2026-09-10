import "server-only";

import type { Film } from "@/lib/types";

const OMDB_BASE = "https://www.omdbapi.com/";
const POSTER_REVALIDATE_SECONDS = 60 * 60 * 24 * 30; // posters don't change — cache for 30 days
const CONCURRENCY = 8;

interface OmdbResponse {
  Response: "True" | "False";
  Poster?: string;
}

function extractImdbId(imdbUrl: string): string | null {
  const match = imdbUrl.match(/title\/(tt\d+)/);
  return match ? match[1] : null;
}

async function fetchPoster(imdbUrl: string, apiKey: string): Promise<string | null> {
  const imdbId = extractImdbId(imdbUrl);
  if (!imdbId) return null;

  try {
    const res = await fetch(
      `${OMDB_BASE}?i=${imdbId}&apikey=${apiKey}`,
      { next: { revalidate: POSTER_REVALIDATE_SECONDS } }
    );
    if (!res.ok) return null;

    const data: OmdbResponse = await res.json();
    if (data.Response === "False" || !data.Poster || data.Poster === "N/A") {
      return null;
    }
    return data.Poster;
  } catch {
    return null;
  }
}

async function mapWithConcurrency<T, R>(
  items: T[],
  limit: number,
  fn: (item: T) => Promise<R>
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let cursor = 0;

  async function worker() {
    while (cursor < items.length) {
      const index = cursor++;
      results[index] = await fn(items[index]);
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, worker)
  );
  return results;
}

/**
 * Attaches OMDb poster URLs to each film, matched by the IMDb ID embedded in
 * `imdb_url`. Falls back to leaving `posterUrl` null (per-film, so a single
 * missed match never breaks the rest) when OMDB_API_KEY is unset, a title
 * has no match, or the request fails.
 */
export async function attachPosters(films: Film[]): Promise<Film[]> {
  const apiKey = process.env.OMDB_API_KEY;
  if (!apiKey) return films;

  const posters = await mapWithConcurrency(films, CONCURRENCY, (film) =>
    fetchPoster(film.imdb_url, apiKey)
  );

  return films.map((film, i) => ({ ...film, posterUrl: posters[i] }));
}
