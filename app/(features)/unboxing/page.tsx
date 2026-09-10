import { CaseOpener } from "@/components/crate/case-opener";
import { SectionHeading } from "@/components/section-heading";
import { FEATURES } from "@/lib/features";
import { getFilmsData } from "@/lib/get-films-data";

export const revalidate = 600;

const feature = FEATURES.find((f) => f.slug === "unboxing")!;

export default async function UnboxingPage() {
  const { films } = await getFilmsData();

  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-10 sm:px-8">
      <SectionHeading title={feature.title} description={feature.description} />
      <CaseOpener films={films} />
    </section>
  );
}
