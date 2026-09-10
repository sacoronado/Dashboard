import { Clapperboard, Star, Tags, Trophy } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatTile {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
}

export function StatTiles({
  totalFilms,
  avgRating,
  uniqueGenres,
  topGenre,
}: {
  totalFilms: number;
  avgRating: number;
  uniqueGenres: number;
  topGenre: string;
}) {
  const tiles: StatTile[] = [
    { label: "Films", value: totalFilms.toString(), icon: Clapperboard },
    { label: "Average IMDb rating", value: avgRating.toFixed(2), icon: Star },
    { label: "Genres represented", value: uniqueGenres.toString(), icon: Tags },
    { label: "Most common genre", value: topGenre, icon: Trophy },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {tiles.map((tile) => (
        <Card key={tile.label} className="gap-2 py-5">
          <CardHeader className="px-5">
            <CardTitle className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <tile.icon className="size-3.5" />
              {tile.label}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-5">
            <p
              className={cn(
                "text-3xl font-semibold tracking-tight",
                tile.label === "Most common genre" && "truncate text-2xl"
              )}
            >
              {tile.value}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
