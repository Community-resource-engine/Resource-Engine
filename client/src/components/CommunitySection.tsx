import { Building2, Phone, GraduationCap, HeartPulse } from "lucide-react";

export function CommunitySection() {
  const stakeholders = [
    { name: "Regional Health Authorities", icon: Building2, desc: "State and county planners coordinating access to care." },
    { name: "Suicide & Crisis Lines", icon: Phone, desc: "24/7 hotlines helping individuals connect to immediate resources." },
    { name: "Public Universities", icon: GraduationCap, desc: "Research institutions driving data-informed community health." },
    { name: "Behavioral Health Franchises", icon: HeartPulse, desc: "Statewide networks offering targeted behavioral treatments." },
  ];

  return (
    <section className="py-24 bg-slate-50 border-t border-border/50 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Content */}
          <div>
            <span className="text-sm font-bold tracking-widest text-[#8C1D40] uppercase mb-3 block">Serving Our Community</span>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground leading-tight mb-6">
              Supporting the people who <span className="text-[#8C1D40] underline decoration-[#FFC627]/50 underline-offset-4">help people.</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-10">
              We empower stakeholders involved in critical planning efforts to address service disparities experienced by Arizonans across all communities, identities, and regions.
            </p>

            <div className="grid grid-cols-2 gap-4">
              {[
                { value: "4+", label: "Stakeholder Groups", color: "text-[#8C1D40]" },
                { value: "Active", label: "Statewide Coverage", color: "text-blue-600" },
                { value: "CAB", label: "Community Vetted", color: "text-emerald-600" },
                { value: "24/7", label: "Accessible Data", color: "text-purple-600" },
              ].map((stat) => (
                <div key={stat.label} className="bg-white rounded-xl p-5 border border-border shadow-sm flex flex-col justify-center">
                  <div className={`text-3xl font-black mb-1 ${stat.color}`}>{stat.value}</div>
                  <div className="text-sm font-medium text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Stakeholders Grid */}
          <div className="grid sm:grid-cols-2 gap-4">
            {stakeholders.map((s) => (
              <div
                key={s.name}
                className="group relative bg-white rounded-2xl border border-border p-6 shadow-sm hover:shadow-md hover:border-[#8C1D40]/30 transition-all duration-200 cursor-default"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 text-slate-600 group-hover:bg-[#8C1D40]/10 group-hover:text-[#8C1D40] transition-colors">
                  <s.icon className="h-6 w-6" />
                </div>
                <h4 className="font-bold text-foreground mb-2">{s.name}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
