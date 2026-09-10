import { Hero } from "@/components/hero";

export const revalidate = 600; // matches the original app's 10-minute cache TTL

export default function Home() {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <Hero />
    </div>
  );
}
