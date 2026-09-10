/**
 * Single source of truth for the three standalone feature pages — driving
 * the landing page buttons, the sidebar dropdown nav, and each page's own
 * heading copy so all three stay in sync.
 */
export interface FeatureDef {
  slug: "roulette" | "unboxing" | "stats";
  href: "/roulette" | "/unboxing" | "/stats";
  label: string;
  title: string;
  description: string;
}

export const FEATURES: FeatureDef[] = [
  {
    slug: "roulette",
    href: "/roulette",
    label: "Roulette",
    title: "Spin the wheel",
    description:
      "Every film in the catalog gets a wedge. Give it a spin and see what you're watching tonight.",
  },
  {
    slug: "unboxing",
    href: "/unboxing",
    label: "Uncage Him",
    title: "Open the cage",
    description:
      "Fifteen films load in at random and cycle past — one breaks loose and lands center.",
  },
  {
    slug: "stats",
    href: "/stats",
    label: "Stats",
    title: "Stats for nerds",
    description: "The full catalog — filterable, sortable, chartable.",
  },
];
