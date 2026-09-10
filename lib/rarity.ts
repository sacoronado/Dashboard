/**
 * CS:GO-style rarity tiers for the case opener — a film's IMDb rating maps
 * to a grade, each with its own border/glow color, mirroring the skin-grade
 * colors players already recognize (mil-spec blue, restricted purple,
 * covert red) with a couple of stand-ins for the tiers CS doesn't use here.
 */
export interface RarityTier {
  name: string;
  color: string;
}

const TIERS = {
  consumer: { name: "Consumer Grade", color: "#4ade80" }, // green
  milSpec: { name: "Mil-Spec", color: "#4b69ff" }, // blue
  restricted: { name: "Restricted", color: "#8847ff" }, // purple
  covert: { name: "Covert", color: "#eb4b4b" }, // red
  exceedinglyRare: { name: "Exceedingly Rare", color: "#ff8c00" }, // orange
} as const satisfies Record<string, RarityTier>;

/**
 * rating < 3.5           -> green (Consumer Grade)
 * 3.5 <= rating <= 4.5    -> blue (Mil-Spec)
 * 4.5 <  rating <= 6      -> purple (Restricted)
 * 6   <  rating <= 7      -> red (Covert)
 * rating > 7              -> orange (Exceedingly Rare)
 */
export function getRarity(rating: number): RarityTier {
  if (rating < 3.5) return TIERS.consumer;
  if (rating <= 4.5) return TIERS.milSpec;
  if (rating <= 6) return TIERS.restricted;
  if (rating <= 7) return TIERS.covert;
  return TIERS.exceedinglyRare;
}
