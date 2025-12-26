export function CommunitySection() {
  const stakeholders = [
    "Regional Health Authorities",
    "Suicide & Crisis Lines",
    "Public Universities",
    "Behavioral Health Franchises",
  ];

  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Serving Our Community</h2>
          <p className="mt-4 text-muted-foreground">
            We support stakeholders involved in planning to address service disparities experienced by Arizonans across
            communities and identities.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            {stakeholders.map((stakeholder) => (
              <div
                key={stakeholder}
                className="rounded-full border border-border bg-white px-6 py-3 text-sm font-medium text-foreground shadow-sm"
              >
                {stakeholder}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
