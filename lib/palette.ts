/**
 * Site brand ramp — https://coolors.co/palette/7400b8-6930c3-5e60ce-5390d9-
 * 4ea8de-48bfe3-56cfe1-64dfdf-72efdd-80ffdb. Fixed, mode-independent neon
 * swatches used for on-brand UI accents (landing buttons, glows) — kept
 * separate from the categorical/sequential sets below, which stay tuned for
 * chart legibility rather than brand. Mirrored in CSS as `--brand-1..10` in
 * app/globals.css.
 */
export const BRAND = [
  "#7400b8",
  "#6930c3",
  "#5e60ce",
  "#5390d9",
  "#4ea8de",
  "#48bfe3",
  "#56cfe1",
  "#64dfdf",
  "#72efdd",
  "#80ffdb",
] as const;

/**
 * Validated data-viz palette (see the `dataviz` skill's `references/palette.md`).
 * Categorical hues are assigned in this fixed order — never cycled, never
 * re-ranked when a filter changes what's on screen.
 */

export const CATEGORICAL: { light: string; dark: string }[] = [
  { light: "#2a78d6", dark: "#3987e5" }, // blue
  { light: "#eb6834", dark: "#d95926" }, // orange
  { light: "#1baf7a", dark: "#199e70" }, // aqua
  { light: "#eda100", dark: "#c98500" }, // yellow / gold
  { light: "#e87ba4", dark: "#d55181" }, // magenta
  { light: "#008300", dark: "#008300" }, // green
  { light: "#4a3aa7", dark: "#9085e9" }, // violet
];

/** Genres beyond the token ceiling fold into this neutral "Other" swatch. */
export const OTHER_SWATCH = { light: "#898781", dark: "#898781" };

/** Single-hue sequential ramp (blue), light -> dark, for magnitude encodings. */
export const SEQUENTIAL_BLUE = [
  "#cde2fb",
  "#9ec5f4",
  "#6da7ec",
  "#3987e5",
  "#256abf",
  "#184f95",
  "#0d366b",
];

/** Diverging pair for above/below-baseline comparisons. */
export const DIVERGING = {
  positive: { light: "#2a78d6", dark: "#3987e5" }, // blue
  negative: { light: "#e34948", dark: "#e66767" }, // red
  midpoint: { light: "#f0efec", dark: "#383835" },
};

export type GenreColorMap = Map<string, number>;

/**
 * Assigns each genre a fixed categorical slot by overall frequency across the
 * FULL dataset (never the filtered one), so a genre's color never repaints
 * when the active filter changes which genres are visible.
 */
export function buildGenreColorMap(allGenres: string[][]): GenreColorMap {
  const counts = new Map<string, number>();
  for (const genres of allGenres) {
    for (const genre of genres) {
      counts.set(genre, (counts.get(genre) ?? 0) + 1);
    }
  }

  const ranked = [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([genre]) => genre);

  const map: GenreColorMap = new Map();
  ranked.forEach((genre, index) => map.set(genre, index));
  return map;
}

export function genreColor(
  genre: string,
  map: GenreColorMap,
  mode: "light" | "dark"
): string {
  const slot = map.get(genre);
  if (slot === undefined || slot >= CATEGORICAL.length) {
    return OTHER_SWATCH[mode];
  }
  return CATEGORICAL[slot][mode];
}
