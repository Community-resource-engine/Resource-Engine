import { Shield, Activity, BarChart3 } from "lucide-react";

export function ValueProposition() {
  const features = [
    {
      icon: Shield,
      title: "Accurate & Helpful Info",
      description:
        "Managed by social workers and a Community Advisory Board (CAB) to ensure locally known information is incorporated into high-quality datasets.",
    },
    {
      icon: Activity,
      title: "Timely Data Updates",
      description:
        "Users influence resource data through feedback, moderated by the CAB to prevent inaccuracies, maintaining a longitudinal view of service evolution.",
    },
    {
      icon: BarChart3,
      title: "Reducing Stress",
      description:
        "Optimized user interface for efficient searches tailored to client needs, supported by real-time Power BI dashboards on service availability.",
    },
  ];

  return (
    <section className="bg-accent/30 py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Our Technology Solution</h2>
          <p className="mt-4 text-muted-foreground">
            Designed by social workers for social workers, bridging the gap between community knowledge and technical
            architecture.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-5xl gap-8 lg:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="rounded-xl bg-white p-8 shadow-sm">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">{feature.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
