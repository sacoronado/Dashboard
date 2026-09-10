"use client";

import { usePathname, useRouter } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FEATURES } from "@/lib/features";

/** Lets someone jump between the standalone feature pages from anywhere. */
export function FeatureNav() {
  const router = useRouter();
  const pathname = usePathname();
  const current =
    FEATURES.find((f) => f.href === pathname)?.href ?? FEATURES[0].href;

  return (
    <Select value={current} onValueChange={(href) => router.push(href)}>
      <SelectTrigger className="w-full">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {FEATURES.map((feature) => (
          <SelectItem key={feature.slug} value={feature.href}>
            {feature.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
