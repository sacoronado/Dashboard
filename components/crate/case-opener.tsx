"use client";

import * as React from "react";
import { PawPrint, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FoilCard } from "@/components/crate/foil-card";
import { GenreChip } from "@/components/dashboard/genre-chip";
import { PosterCard } from "@/components/shared/poster-card";
import { buildGenreColorMap } from "@/lib/palette";
import { randomInt, sample } from "@/lib/pick";
import { getRarity } from "@/lib/rarity";
import type { Film } from "@/lib/types";
import { cn } from "@/lib/utils";

const POOL_SIZE = 15; // distinct random films drawn each time the cage opens
const REPEATS = 6; // how many times that pool loops through the reel
const ITEM_WIDTH = 160;
const ITEM_GAP = 16;
const SLOT_WIDTH = ITEM_WIDTH + ITEM_GAP;
const SPIN_MS = 5600;
// Land on the pool's 2nd-to-last lap — guarantees a full extra lap of
// decoys trailing after the winner instead of stopping right at the end.
const LANDING_REPEAT = REPEATS - 2;

export function CaseOpener({ films }: { films: Film[] }) {
  const colorMap = React.useMemo(
    () => buildGenreColorMap(films.map((f) => f.genres)),
    [films]
  );

  // Ref on the outer clipping box, which is always mounted (both the empty
  // state and the reel render inside it) — measuring from the track itself
  // would read 0 on the very first open(), since the track only mounts once
  // `reel` first goes non-empty, which happens in this same click.
  const containerRef = React.useRef<HTMLDivElement>(null);
  // Empty on both server and first client paint — nothing to mismatch.
  // The reel only ever gets real (random) content from the open() click
  // handler, which runs purely on the client.
  const [reel, setReel] = React.useState<Film[]>([]);
  const [winnerIndex, setWinnerIndex] = React.useState<number | null>(null);
  const [offset, setOffset] = React.useState(0);
  const [spinning, setSpinning] = React.useState(false);
  const [transitioning, setTransitioning] = React.useState(false);

  const winner = winnerIndex !== null ? reel[winnerIndex] : null;
  const opened = reel.length > 0;

  function open() {
    if (spinning || films.length === 0) return;

    const pool = sample(films, Math.min(POOL_SIZE, films.length));
    const winnerPoolIndex = randomInt(0, pool.length - 1);
    const landingRepeat = Math.max(0, Math.min(LANDING_REPEAT, REPEATS - 1));
    const winnerSlot = landingRepeat * pool.length + winnerPoolIndex;
    const strip = Array.from(
      { length: pool.length * REPEATS },
      (_, i) => pool[i % pool.length]
    );

    setSpinning(true);
    setTransitioning(false);
    setWinnerIndex(null);
    setReel(strip);
    setOffset(0);

    // Land the winning slot's center exactly under the marker line, in
    // real pixels against the visible container — not a CSS percentage
    // (which resolves against the track's own, much larger, width).
    const containerWidth = containerRef.current?.clientWidth ?? 0;
    const slotCenter = winnerSlot * SLOT_WIDTH + ITEM_WIDTH / 2;
    const target = slotCenter - containerWidth / 2;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setTransitioning(true);
        setOffset(target);
      });
    });

    window.setTimeout(() => {
      setSpinning(false);
      setWinnerIndex(winnerSlot);
    }, SPIN_MS);
  }

  return (
    <Card className="overflow-hidden py-6">
      <CardContent className="flex flex-col gap-6 px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-lg border border-border bg-muted/30">
          {/* Center marker — only meaningful while the reel is actually moving */}
          <div
            aria-hidden
            className={cn(
              "pointer-events-none absolute top-0 bottom-0 left-1/2 z-20 w-0.5 -translate-x-1/2 bg-primary shadow-[0_0_12px_var(--primary)] transition-opacity duration-300",
              spinning ? "opacity-100" : "opacity-0"
            )}
          />
          {/* Edge fades */}
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-card to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-card to-transparent" />

          <div
            ref={containerRef}
            className={cn(
              "overflow-hidden transition-[height] duration-500 ease-out",
              winner ? "h-[32rem]" : "h-64"
            )}
          >
            {opened ? (
              <div
                className="flex h-full items-center py-4"
                style={{
                  gap: ITEM_GAP,
                  transform: `translateX(${-offset}px)`,
                  transition: transitioning
                    ? `transform ${SPIN_MS}ms cubic-bezier(0.05, 0.83, 0.1, 1)`
                    : "none",
                }}
              >
                {reel.map((film, i) => {
                  const rarity = getRarity(film.imdb_rating);
                  const isWinner = winnerIndex === i;

                  return (
                    <div
                      key={`${film.rank}-${i}`}
                      className={cn("shrink-0", isWinner && "relative z-30")}
                      style={{ width: ITEM_WIDTH }}
                    >
                      {isWinner ? (
                        <FoilCard film={film} rarityColor={rarity.color} scale={2} />
                      ) : (
                        <PosterCard
                          film={film}
                          eager={i < 6}
                          className="rounded-lg transition-shadow duration-300"
                          style={{
                            boxShadow: `0 0 0 2px ${rarity.color}, 0 0 14px color-mix(in oklab, ${rarity.color} 40%, transparent)`,
                          }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground">
                <PawPrint className="size-6" />
                <p className="text-sm">The cage is closed. Let one out.</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <Button size="lg" onClick={open} disabled={spinning} className="gap-2">
            {spinning ? "Letting one out…" : opened ? "Let another one out" : "Let one out of the cage"}
          </Button>

          {winner ? (
            <div className="flex animate-in items-center gap-3 fade-in slide-in-from-bottom-2 duration-500">
              <div className="text-right">
                <p className="font-semibold">{winner.title}</p>
                <div className="flex items-center justify-end gap-2">
                  <span
                    className="text-xs font-bold tracking-wide uppercase"
                    style={{ color: getRarity(winner.imdb_rating).color }}
                  >
                    {getRarity(winner.imdb_rating).name}
                  </span>
                  <GenreChip genre={winner.primary_genre} colorMap={colorMap} />
                  <span className="flex items-center gap-1 text-sm font-medium">
                    <Star
                      className="size-3.5"
                      style={{
                        color: getRarity(winner.imdb_rating).color,
                        fill: getRarity(winner.imdb_rating).color,
                      }}
                    />
                    {winner.imdb_rating.toFixed(1)}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              15 random films load in and loop past a few times — one gets
              loose.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
