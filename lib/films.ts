import "server-only";

import { readFile } from "node:fs/promises";
import path from "node:path";

import { createClient } from "@supabase/supabase-js";

import type { DataSource, Film } from "@/lib/types";

function splitGenres(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === "string" && value.length > 0) return value.split("|");
  return [];
}

async function loadFromCsv(): Promise<Film[]> {
  const csvPath = path.join(process.cwd(), "data", "films.csv");
  const raw = await readFile(csvPath, "utf-8");
  const [headerLine, ...lines] = raw.trim().split(/\r?\n/);
  const headers = headerLine.split(",");

  return lines
    .filter((line) => line.trim().length > 0)
    .map((line) => {
      const cells = line.split(",");
      const row = Object.fromEntries(headers.map((h, i) => [h, cells[i]]));
      return {
        rank: Number(row.rank),
        title: row.title,
        imdb_rating: Number(row.imdb_rating),
        genres: splitGenres(row.genres),
        primary_genre: row.primary_genre,
        imdb_url: row.imdb_url,
        posterUrl: null,
      } satisfies Film;
    });
}

async function loadFromSupabase(url: string, key: string): Promise<Film[]> {
  const supabase = createClient(url, key);
  const { data, error } = await supabase
    .from("films")
    .select("rank, title, imdb_rating, genres, primary_genre, imdb_url")
    .order("rank");

  if (error) {
    throw new Error(`Supabase query failed: ${error.message}`);
  }

  return (data ?? []).map(
    (row): Film => ({
      rank: row.rank,
      title: row.title,
      imdb_rating: row.imdb_rating,
      genres: splitGenres(row.genres),
      primary_genre: row.primary_genre,
      imdb_url: row.imdb_url,
      posterUrl: null,
    })
  );
}

/**
 * Loads the filmography from Supabase when credentials are configured,
 * falling back to the bundled CSV snapshot for local development —
 * mirroring the fallback behavior of the original Streamlit app.
 */
export async function getFilms(): Promise<{ films: Film[]; source: DataSource }> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_KEY;

  if (url && key) {
    return { films: await loadFromSupabase(url, key), source: "supabase" };
  }

  return { films: await loadFromCsv(), source: "csv" };
}
