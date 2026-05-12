import { Link } from "wouter";
import { ArrowRight, BarChart2 } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-white min-h-[90vh] flex items-center justify-center">
      {/* Background Image Setup */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1920&q=80')" }}
      />
      
      {/* Semi-transparent overlay to ensure text readability */}
      <div className="absolute inset-0 z-0 bg-white/90 backdrop-blur-md" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-24 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text Content */}
          <div className="lg:col-span-7">
            {/* Badge */}
            <div className="mb-8 inline-flex items-center rounded-full border border-primary/20 bg-primary/5 shadow-sm px-4 py-2">
              <span className="flex h-2 w-2 rounded-full bg-primary/80 animate-pulse mr-2" />
              <span className="text-sm font-bold text-primary tracking-wide">CARECONNECTAZ: FIND BEHAVIORAL HEALTH SERVICES WHERE YOU LIVE</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl leading-[1.1] mb-8">
              Navigate Care. <br />
              <span className="text-primary relative inline-block">
                Find Resources.
                <div className="absolute -bottom-2 left-0 w-full h-2 bg-[#FFC627]/30 rounded-full" />
              </span><br />
              Help People.
            </h1>

            {/* Subtitle */}
            <p className="max-w-xl text-lg md:text-xl leading-relaxed text-muted-foreground mb-10">
              Helping people navigate fragmented health, behavioral health, and social service systems. 
              Achieve accurate, helpful care coordination accessible to all stakeholders.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/search">
                <button className="h-14 rounded-full px-8 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 inline-flex items-center justify-center gap-2 transition-all duration-200 hover:-translate-y-0.5">
                  <span>Start Searching</span>
                  <ArrowRight className="h-5 w-5" />
                </button>
              </Link>
              <Link href="/lab-introduction">
                <button className="h-14 rounded-full bg-white border border-border hover:bg-slate-50 px-8 text-base font-semibold text-foreground shadow-sm inline-flex items-center justify-center gap-2 transition-all duration-200">
                  <BarChart2 className="h-5 w-5 text-muted-foreground" />
                  <span>View Lab Introduction</span>
                </button>
              </Link>
            </div>
          </div>

          {/* Right Visual Floating Element */}
          <div className="hidden lg:block lg:col-span-5 relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent rounded-full blur-3xl" />
            
            <div className="relative rounded-2xl border border-border/50 bg-white/70 backdrop-blur-xl shadow-2xl p-8 transform rotate-2 hover:rotate-0 transition-transform duration-500">
              <div className="flex items-center justify-between border-b border-border/50 pb-4 mb-6">
                <div>
                  <h3 className="font-bold text-foreground">Verified Data</h3>
                  <p className="text-xs text-muted-foreground">Community updated</p>
                </div>
                <div className="h-10 w-10 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-bold">✓</div>
              </div>
              
              <div className="space-y-4">
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-primary/60 w-3/4 rounded-full" />
                </div>
                <div className="h-2 w-[85%] bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#FFC627]/60 w-1/2 rounded-full" />
                </div>
                <div className="h-2 w-[60%] bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-400 w-full rounded-full" />
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-border/50 flex justify-between items-center text-sm font-semibold">
                <span className="text-muted-foreground">Active Facilities</span>
                <span className="text-primary text-xl">17,000+</span>
              </div>
            </div>
            
            {/* Secondary Floating Card */}
            <div className="absolute -bottom-10 -left-10 rounded-xl border border-border/50 bg-white shadow-xl p-5 transform -rotate-3 hover:rotate-0 transition-transform duration-500 delay-100">
               <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 font-bold">50</div>
                 <div>
                   <p className="font-bold text-sm text-foreground">States Covered</p>
                   <p className="text-xs text-muted-foreground">Nationwide reach</p>
                 </div>
               </div>
            </div>
          </div>
          
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
