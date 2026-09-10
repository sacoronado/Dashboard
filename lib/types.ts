export interface Film {
  rank: number;
  title: string;
  imdb_rating: number;
  genres: string[];
  primary_genre: string;
  imdb_url: string;
  /** OMDb poster URL, or null if unavailable (no API key, no match, etc.). */
  posterUrl: string | null;
}

export type DataSource = "supabase" | "csv";
