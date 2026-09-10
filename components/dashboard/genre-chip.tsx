"use client";

import { cn } from "@/lib/utils";
import { genreColor, type GenreColorMap } from "@/lib/palette";
import { useColorMode } from "@/hooks/use-color-mode";

export function GenreChip({
  genre,
  count,
  colorMap,
  selected = false,
  onClick,
  className,
}: {
  genre: string;
  count?: number;
  colorMap: GenreColorMap;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
}) {
  const mode = useColorMode();
  const color = genreColor(genre, colorMap, mode);
  const interactive = Boolean(onClick);

  const Comp = interactive ? "button" : "span";

  return (
    <Comp
      type={interactive ? "button" : undefined}
      onClick={onClick}
      aria-pressed={interactive ? selected : undefined}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium text-foreground transition-colors",
        interactive && "cursor-pointer hover:bg-accent",
        selected
          ? "border-transparent bg-accent ring-1 ring-inset"
          : "border-border bg-transparent",
        className
      )}
      style={selected ? ({ "--tw-ring-color": color } as React.CSSProperties) : undefined}
    >
      <span
        aria-hidden
        className="size-2 shrink-0 rounded-full"
        style={{ backgroundColor: color }}
      />
      {genre}
      {count !== undefined && (
        <span className="text-muted-foreground">{count}</span>
      )}
    </Comp>
  );
}
