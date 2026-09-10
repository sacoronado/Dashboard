"use client";

import { useTheme } from "next-themes";

import { useMounted } from "@/hooks/use-mounted";

/** Resolved light/dark mode for chart color lookups, stable during SSR. */
export function useColorMode(): "light" | "dark" {
  const { resolvedTheme } = useTheme();
  const mounted = useMounted();

  if (!mounted) return "dark";
  return resolvedTheme === "light" ? "light" : "dark";
}
