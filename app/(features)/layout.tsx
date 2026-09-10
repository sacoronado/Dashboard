import type { ReactNode } from "react";
import { Cat } from "lucide-react";
import Link from "next/link";

import { FeatureNav } from "@/components/feature-nav";
import { ThemeToggle } from "@/components/theme-toggle";

export default function FeaturesLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-full flex-1 flex-col lg:flex-row">
      <aside className="flex shrink-0 flex-col gap-6 border-b border-border bg-sidebar px-6 py-6 shadow-[inset_0_-1px_0_0_color-mix(in_oklab,var(--brand-7)_30%,transparent)] lg:w-64 lg:border-r lg:border-b-0 lg:px-5 lg:py-8 lg:shadow-[inset_-1px_0_0_0_color-mix(in_oklab,var(--brand-7)_30%,transparent)]">
        <div className="flex items-center justify-between gap-3 lg:flex-col lg:items-start lg:gap-4">
          <Link
            href="/"
            className="font-heading flex items-center gap-1.5 text-sm font-bold tracking-tight hover:text-primary"
          >
            <Cat className="size-4 text-primary" />
            Cage Matcher
          </Link>
          <ThemeToggle />
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
            Jump to
          </span>
          <FeatureNav />
        </div>
      </aside>

      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}
