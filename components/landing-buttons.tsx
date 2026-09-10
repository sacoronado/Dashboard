"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { BRAND } from "@/lib/palette";
import { FEATURES } from "@/lib/features";
import { randomInt } from "@/lib/pick";

const BUTTON_CLASS =
  "flex flex-col items-center justify-center gap-2 rounded-2xl px-4 py-8 text-center text-base font-semibold transition-transform hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50";

// Four evenly spaced stops off the brand ramp — violet through mint — each
// paired with whichever ink (near-black or near-white) actually reads on it.
const STOPS = [
  { color: BRAND[0], ink: "#faf7ff" }, // #7400b8 violet
  { color: BRAND[3], ink: "#071019" }, // #5390d9 blue
  { color: BRAND[6], ink: "#071019" }, // #56cfe1 cyan
  { color: BRAND[9], ink: "#071019" }, // #80ffdb mint
];

function glowStyle(color: string, ink: string) {
  return {
    backgroundColor: color,
    color: ink,
    boxShadow: `0 0 0 1px color-mix(in oklab, ${color} 70%, transparent), 0 0 26px color-mix(in oklab, ${color} 55%, transparent)`,
  };
}

export function LandingButtons() {
  const router = useRouter();

  function goRandom() {
    const target = FEATURES[randomInt(0, FEATURES.length - 1)];
    router.push(target.href);
  }

  return (
    <div className="grid w-full max-w-2xl grid-cols-2 gap-4 sm:grid-cols-4">
      {FEATURES.map((feature, i) => (
        <Link
          key={feature.slug}
          href={feature.href}
          className={BUTTON_CLASS}
          style={glowStyle(STOPS[i].color, STOPS[i].ink)}
        >
          {feature.label}
        </Link>
      ))}

      <button
        type="button"
        onClick={goRandom}
        className={BUTTON_CLASS}
        style={glowStyle(STOPS[3].color, STOPS[3].ink)}
      >
        <span className="text-3xl" aria-hidden>
          🎲
        </span>
        Random
      </button>
    </div>
  );
}
