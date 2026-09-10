import type { CSSProperties } from "react";
import { Clapperboard } from "lucide-react";

import { cn } from "@/lib/utils";
import type { Film } from "@/lib/types";

export function PosterCard({
  film,
  className,
  style,
  eager = false,
}: {
  film: Film;
  className?: string;
  style?: CSSProperties;
  eager?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative aspect-[2/3] overflow-hidden rounded-lg bg-muted",
        className
      )}
      style={style}
    >
      {film.posterUrl ? (
        // Posters come from OMDb's CDN — an <img> avoids allow-listing an
        // external image domain in next.config for what's otherwise a
        // one-off, non-optimized asset.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={film.posterUrl}
          alt={`${film.title} poster`}
          className="h-full w-full object-cover"
          loading={eager ? "eager" : "lazy"}
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-muted to-card p-3 text-center">
          <Clapperboard className="size-6 shrink-0 text-muted-foreground" />
          <span className="line-clamp-4 text-xs text-muted-foreground">
            {film.title}
          </span>
        </div>
      )}
    </div>
  );
}
