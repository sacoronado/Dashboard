"use client";

import * as React from "react";
import { Shuffle, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { GenreChip } from "@/components/dashboard/genre-chip";
import { PosterCard } from "@/components/shared/poster-card";
import { BRAND, buildGenreColorMap } from "@/lib/palette";
import { randomInt } from "@/lib/pick";
import type { Film } from "@/lib/types";
import { cn } from "@/lib/utils";

const SIZE = 480;
const CENTER = SIZE / 2;
const RADIUS = SIZE / 2 - 10;
const SPIN_MS = 5200;
const EXTRA_SPINS = 6;
const BULB_COUNT = 32;

// Rounded to 3 decimals: Math.cos/sin can differ in their last float digit
// between server (Node) and client (browser) engine builds, which otherwise
// turns into a full string mismatch in the `d` attribute and a hydration error.
const round = (n: number) => Math.round(n * 1000) / 1000;

function wedgePath(index: number, count: number): string {
  const segment = 360 / count;
  const start = -90 + index * segment;
  const end = start + segment;
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const x1 = round(CENTER + RADIUS * Math.cos(toRad(start)));
  const y1 = round(CENTER + RADIUS * Math.sin(toRad(start)));
  const x2 = round(CENTER + RADIUS * Math.cos(toRad(end)));
  const y2 = round(CENTER + RADIUS * Math.sin(toRad(end)));
  const largeArc = segment > 180 ? 1 : 0;

  return `M ${CENTER} ${CENTER} L ${x1} ${y1} A ${RADIUS} ${RADIUS} 0 ${largeArc} 1 ${x2} ${y2} Z`;
}

export function RouletteWheel({ films }: { films: Film[] }) {
  const colorMap = React.useMemo(
    () => buildGenreColorMap(films.map((f) => f.genres)),
    [films]
  );

  const [rotation, setRotation] = React.useState(0);
  const [spinning, setSpinning] = React.useState(false);
  const [winner, setWinner] = React.useState<Film | null>(null);
  const rotationRef = React.useRef(0);

  const segment = 360 / films.length;
  const bulbs = React.useMemo(
    () =>
      Array.from({ length: BULB_COUNT }, (_, i) => (i * 360) / BULB_COUNT),
    []
  );

  function spin() {
    if (spinning || films.length === 0) return;
    setSpinning(true);
    setWinner(null);

    const index = randomInt(0, films.length - 1);
    const targetLocalAngle = index * segment + segment / 2;
    const currentMod = ((rotationRef.current % 360) + 360) % 360;
    let delta = (-targetLocalAngle - currentMod) % 360;
    if (delta <= 0) delta += 360;

    const next = rotationRef.current + EXTRA_SPINS * 360 + delta;
    rotationRef.current = next;
    setRotation(next);

    window.setTimeout(() => {
      setSpinning(false);
      setWinner(films[index]);
    }, SPIN_MS);
  }

  return (
    <Card className="overflow-hidden py-6">
      <CardContent className="flex flex-col items-center gap-8 px-4 lg:flex-row lg:items-center lg:justify-center lg:gap-12">
        <div
          className="relative shrink-0"
          style={{ width: SIZE, maxWidth: "92vw" }}
        >
          <div className="aspect-square w-full" style={{ maxWidth: SIZE }}>
            {/* Pointer */}
            <div
              aria-hidden
              className="absolute top-0 left-1/2 z-10 -translate-x-1/2 -translate-y-1/3"
              style={{
                width: 0,
                height: 0,
                borderLeft: "14px solid transparent",
                borderRight: "14px solid transparent",
                borderTop: "22px solid var(--primary)",
                filter:
                  "drop-shadow(0 2px 4px color-mix(in oklab, black 40%, transparent))",
              }}
            />

            {/* Marquee bulb ring */}
            <div className="absolute inset-0">
              {bulbs.map((deg, i) => (
                <span
                  key={deg}
                  aria-hidden
                  className={cn(
                    "absolute top-1/2 left-1/2 size-2 rounded-full",
                    spinning
                      ? i % 2 === 0
                        ? "animate-pulse bg-primary"
                        : "bg-primary/30"
                      : "bg-primary/50"
                  )}
                  style={{
                    transform: `rotate(${deg}deg) translate(${SIZE / 2 - 4}px) rotate(-${deg}deg)`,
                    transformOrigin: "0 0",
                    marginLeft: "-4px",
                    marginTop: "-4px",
                  }}
                />
              ))}
            </div>

            <div
              className="h-full w-full"
              style={{
                transform: `rotate(${rotation}deg)`,
                transition: spinning
                  ? `transform ${SPIN_MS}ms cubic-bezier(0.1, 0.7, 0.1, 1)`
                  : "none",
              }}
            >
              <svg
                viewBox={`0 0 ${SIZE} ${SIZE}`}
                className="h-full w-full drop-shadow-xl"
              >
                {films.map((film, i) => (
                  <path
                    key={film.rank}
                    d={wedgePath(i, films.length)}
                    fill={BRAND[i % BRAND.length]}
                    stroke="var(--background)"
                    strokeWidth={1}
                  />
                ))}
                <circle
                  cx={CENTER}
                  cy={CENTER}
                  r={36}
                  fill="var(--card)"
                  stroke="var(--primary)"
                  strokeWidth={3}
                />
              </svg>
            </div>

            <Button
              onClick={spin}
              disabled={spinning}
              size="icon"
              className="absolute top-1/2 left-1/2 size-16 -translate-x-1/2 -translate-y-1/2 rounded-full shadow-lg"
              aria-label="Spin the wheel"
            >
              <Shuffle
                className={cn("size-6", spinning && "animate-spin")}
              />
            </Button>
          </div>
        </div>

        <div className="flex w-full max-w-sm flex-col gap-4">
          <Button
            size="lg"
            onClick={spin}
            disabled={spinning}
            className="gap-2"
          >
            <Shuffle className="size-4" />
            {spinning ? "Spinning…" : winner ? "Spin again" : "Spin the wheel"}
          </Button>

          {winner ? (
            <div className="flex animate-in gap-4 fade-in slide-in-from-bottom-2 duration-500">
              <PosterCard film={winner} className="w-28 shrink-0" eager />
              <div className="flex min-w-0 flex-col gap-1.5 pt-1">
                <p className="text-xs text-muted-foreground">The wheel says…</p>
                <p className="truncate text-lg font-semibold">
                  {winner.title}
                </p>
                <div className="flex items-center gap-1 text-sm font-medium">
                  <Star className="size-3.5 fill-primary text-primary" />
                  {winner.imdb_rating.toFixed(1)}
                </div>
                <GenreChip
                  genre={winner.primary_genre}
                  colorMap={colorMap}
                  className="mt-1 w-fit"
                />
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              {films.length} films on the wheel. Give it a spin — every
              wedge is a Nicolas Cage movie.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
