import { Shield, Activity, BarChart3, ArrowRight } from "lucide-react";

export function ValueProposition() {
  const features = [
    {
      icon: Shield,
      title: "Accurate & Helpful Info",
      description: "Managed by social workers and a Community Advisory Board (CAB) to ensure locally known information is incorporated into high-quality datasets.",
      color: "text-blue-600",
      bgClass: "bg-blue-50 border-blue-100",
    },
    {
      icon: Activity,
      title: "Timely Data Updates",
      description: "Users influence resource data through feedback, moderated by the CAB to prevent inaccuracies, maintaining a longitudinal view of service evolution.",
      color: "text-emerald-600",
      bgClass: "bg-emerald-50 border-emerald-100",
    },
    {
      icon: BarChart3,
      title: "Reducing Stress",
      description: "Optimized user interface for efficient searches tailored to client needs, supported by real-time Power BI dashboards on service availability.",
      color: "text-purple-600",
      bgClass: "bg-purple-50 border-purple-100",
    },
  ];

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Subtle top glare */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-16 items-center">
          
          {/* Left Content */}
          <div className="lg:col-span-5 relative z-10">
            <span className="text-sm font-bold tracking-widest text-primary uppercase mb-3 block">Our Technology Solution</span>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground leading-[1.1] mb-6">
              Designed by social workers, for social workers.
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed mb-8">
              We bridge the critical gap between invaluable community knowledge and modern technical architecture.
            </p>
            <div className="inline-flex items-center gap-4 bg-slate-50 border border-border rounded-2xl p-4 pr-6 shadow-sm">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="font-bold text-foreground">Built for Trust</p>
                <p className="text-sm text-muted-foreground">Community vetted data</p>
              </div>
            </div>
          </div>

          {/* Right Features Grid */}
          <div className="lg:col-span-7 grid sm:grid-cols-2 gap-6 relative">
            {features.map((feature, idx) => (
              <div 
                key={feature.title} 
                className={`group rounded-2xl border border-border bg-white p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${idx === 2 ? 'sm:col-span-2 sm:w-1/2 sm:mx-auto' : ''}`}
              >
                <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-xl border ${feature.bgClass} group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`h-7 w-7 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
          
        </div>
      </div>
    </section>
  );
}
