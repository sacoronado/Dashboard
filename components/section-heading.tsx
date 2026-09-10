export function SectionHeading({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-6 max-w-2xl">
      <h2 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
        {title}
      </h2>
      {description && (
        <p className="mt-2 text-muted-foreground">{description}</p>
      )}
    </div>
  );
}
