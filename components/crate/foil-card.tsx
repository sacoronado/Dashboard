"use client";

import * as React from "react";

import { PosterCard } from "@/components/shared/poster-card";
import type { Film } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * The winning pull's poster, tilted and lit like a foil trading card /
 * CS:GO skin preview — perspective + a holo sheen that track the cursor.
 * Driven entirely through CSS custom properties set via ref (no React
 * state), so mousemove never triggers a re-render.
 */
export function FoilCard({
  film,
  rarityColor,
  scale = 1,
  className,
}: {
  film: Film;
  rarityColor: string;
  /** Rest-state scale multiplier — the hover tilt/bump still layers on top. */
  scale?: number;
  className?: string;
}) {
  const rootRef = React.useRef<HTMLDivElement>(null);

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = rootRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const rotateY = (px - 0.5) * 26;
    const rotateX = (0.5 - py) * 26;
    el.style.setProperty("--rx", `${rotateX}deg`);
    el.style.setProperty("--ry", `${rotateY}deg`);
    el.style.setProperty("--mx", `${px * 100}%`);
    el.style.setProperty("--my", `${py * 100}%`);
    el.style.setProperty("--op", "1");
  }

  function handleLeave() {
    const el = rootRef.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
    el.style.setProperty("--op", "0");
  }

  return (
    <div
      ref={rootRef}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={cn("foil-card", className)}
      style={
        { "--rarity": rarityColor, "--base-scale": scale } as React.CSSProperties
      }
    >
      <div className="foil-card-inner">
        <PosterCard film={film} eager className="rounded-lg" />
        <div aria-hidden className="foil-sheen pointer-events-none absolute inset-0 rounded-lg" />
        <div aria-hidden className="foil-glare pointer-events-none absolute inset-0 rounded-lg" />
      </div>
    </div>
  );
}
