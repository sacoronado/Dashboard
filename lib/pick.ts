/** Fisher-Yates shuffle — does not mutate the input. */
export function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/** Picks `count` random, distinct items from the list. */
export function sample<T>(items: T[], count: number): T[] {
  return shuffle(items).slice(0, count);
}

/** Random integer in [min, max], inclusive. */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
