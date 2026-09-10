import { LandingButtons } from "@/components/landing-buttons";
import { ThemeToggle } from "@/components/theme-toggle";

export function Hero() {
  return (
    <header className="relative flex flex-1 flex-col overflow-hidden border-b border-border">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(60% 80% at 15% 0%, color-mix(in oklab, var(--brand-2) 26%, transparent), transparent 60%), radial-gradient(50% 60% at 100% 0%, color-mix(in oklab, var(--brand-7) 22%, transparent), transparent 60%)",
        }}
      />
      <div aria-hidden className="cyber-grid pointer-events-none absolute inset-0 -z-10" />
      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center gap-8 px-6 py-16 text-center sm:px-8">
        <div className="flex w-full items-start justify-end gap-4">
          <ThemeToggle />
        </div>

        <div>
          <h1 className="marquee-glow font-heading text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
            <span className="text-primary">Cage Matcher</span>
          </h1>
          <p className="mt-4 text-base text-muted-foreground sm:text-lg">
            One way to match you with a Nicolas Cage movie.
          </p>
        </div>

        <LandingButtons />
      </div>
      <div className="film-strip" />
    </header>
  );
}
