import "server-only";

import { getFilms } from "@/lib/films";
import { attachPosters } from "@/lib/posters";
import type { DataSource, Film } from "@/lib/types";

/** Loads the filmography and attaches posters — shared by every feature page. */
export async function getFilmsData(): Promise<{
  films: Film[];
  source: DataSource;
}> {
  const { films: rawFilms, source } = await getFilms();
  const films = await attachPosters(rawFilms);
  return { films, source };
}
