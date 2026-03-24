import { Link } from "wouter";
import { ArrowRight, Search, MapPin, Building, Filter, MessageSquare } from "lucide-react";
import { HeroSection } from "@/components/HeroSection";
import { ValueProposition } from "@/components/ValueProposition";
import { CommunitySection } from "@/components/CommunitySection";
import { Footer } from "@/components/Footer";
import { Navigation } from "@/components/Navigation";

export default function Home() {
  const steps = [
    {
      title: "Select Directory",
      desc: "Choose between Mental Health or Substance Abuse resources based on client needs.",
      icon: Search,
      color: "bg-blue-100 text-blue-700",
    },
    {
      title: "Choose State",
      desc: "Filter down to the specific state where care is required.",
      icon: MapPin,
      color: "bg-emerald-100 text-emerald-700",
    },
    {
      title: "Select Clinic",
      desc: "Find and select the specific care facility from our comprehensive database.",
      icon: Building,
      color: "bg-purple-100 text-purple-700",
    },
    {
      title: "Apply Filters",
      desc: "Select categories and specific service options to pinpoint issues or specialties.",
      icon: Filter,
      color: "bg-amber-100 text-amber-700",
    },
    {
      title: "Add Details",
      desc: "Provide a detailed description of the feedback or issue you are reporting.",
      icon: MessageSquare,
      color: "bg-rose-100 text-rose-700",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navigation />
      <main className="flex-1">
        <HeroSection />
        
        {/* Structured "How This Works" Section */}
        <section className="relative py-24 bg-slate-50 border-y border-border/50 overflow-hidden">
          {/* Decorative background grid */}
          <div className="absolute inset-0 z-0 opacity-[0.03]"
            style={{ backgroundImage: "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
          
          <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-sm font-bold tracking-widest text-primary uppercase mb-3 block">Process</span>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">How This Works</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Follow these five intuitive steps to locate facilities, pinpoint specific services, and contribute valuable community feedback.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {steps.map((step, idx) => (
                <div key={idx} className="relative group">
                  {/* Process connector line (hidden on mobile, visible on lg) */}
                  {idx < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-8 left-[60%] w-[100%] h-[2px] bg-border z-0" />
                  )}
                  
                  <div className="relative z-10 bg-white rounded-2xl p-6 border border-border shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
                    <div className="flex justify-between items-start mb-6">
                      <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${step.color} shadow-inner`}>
                        <step.icon className="w-7 h-7" />
                      </div>
                      <span className="text-4xl font-black text-slate-100 group-hover:text-slate-200 transition-colors">
                        0{idx + 1}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-2">{step.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-16 text-center">
              <Link href="/search">
                <button className="inline-flex flex-col items-center group text-primary font-semibold hover:text-primary/80 transition-colors">
                  <span className="flex items-center gap-2">Start your search <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></span>
                  <div className="h-0.5 w-full bg-primary/20 mt-1 pointer-events-none group-hover:bg-primary/50 transition-colors" />
                </button>
              </Link>
            </div>
          </div>
        </section>

        <ValueProposition />
        <CommunitySection />
      </main>
      <Footer />
    </div>
  );
}
