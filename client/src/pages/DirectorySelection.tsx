import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Link } from "wouter";
import { Brain, HeartPulse, ArrowRight } from "lucide-react";

export default function DirectorySelection() {
  return (
    <div className="flex min-h-screen flex-col bg-[#FDFDFD]">
      <Navigation />
      
      <main className="flex-1 flex flex-col relative overflow-hidden selection:bg-primary/10">
        
        {/* Extremely premium background decoration */}
        <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-slate-50 to-transparent pointer-events-none" />
        <div className="absolute -top-[300px] left-1/2 -translate-x-1/2 w-[1000px] h-[600px] opacity-20 bg-gradient-to-b from-primary/20 via-primary/5 to-transparent blur-3xl pointer-events-none rounded-full" />
        
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center py-20 px-6 lg:px-8 max-w-5xl mx-auto w-full">
          
          <div className="flex flex-col items-center text-center mb-16 space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 max-w-3xl leading-[1.1]">
              What kind of care are you <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">looking for?</span>
            </h1>
            <p className="text-lg text-slate-500 max-w-2xl leading-relaxed">
              Choose a pathway below to access the 2024 National Directories, featuring thousands of community-vetted facilities.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 w-full max-w-5xl relative">
            
            {/* Ambient glow behind cards */}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-transparent to-blue-500/5 blur-3xl -z-10" />

            {/* Mental Health Card */}
            <Link
              href="/search/mental-health"
              className="group relative flex flex-col p-8 rounded-[2rem] bg-white border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-500 overflow-hidden"
              data-testid="link-mental-health-directory"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative w-16 h-16 rounded-2xl bg-white border border-slate-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)] flex items-center justify-center mb-6 group-hover:scale-105 group-hover:border-emerald-200 transition-all duration-500 z-10">
                <Brain className="w-8 h-8 text-emerald-600" strokeWidth={1.5} />
                <div className="absolute inset-0 rounded-2xl bg-emerald-400/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              <p className="relative z-10 text-sm font-semibold text-emerald-600 mb-2 tracking-wide uppercase">
                Are you looking for an agencies providing mental health services?
              </p>

              <h2 className="relative z-10 text-2xl font-bold text-slate-900 mb-4 tracking-tight leading-snug">
                2024 National Directory of Mental Health Treatment Facilities
              </h2>
              
              <p className="relative z-10 text-[14px] text-slate-500 leading-relaxed mb-8 flex-1">
                The National Directory of Mental Health Services is a comprehensive listing of mental health treatment facilities across the US for 2024, compiled from the 2023 National Substance Use and Mental Health Services Survey conducted by SAMHSA. It includes federal, state, local government, and private facilities that provide mental health services. Find mental health treatment facilities, psychiatric hospitals, community mental health centers, and counseling services.
              </p>

              <div className="relative z-10 flex items-center gap-2 text-sm font-semibold text-slate-900 group-hover:text-emerald-700 transition-colors">
                <span className="relative pb-0.5 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-bottom-left after:scale-x-0 after:bg-emerald-600 after:transition-transform after:duration-300 group-hover:after:scale-x-100">
                  Select Mental Health
                </span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </Link>

            {/* Substance Abuse Card */}
            <Link
              href="/search/substance-abuse"
              className="group relative flex flex-col p-8 rounded-[2rem] bg-white border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-500 overflow-hidden"
              data-testid="link-substance-abuse-directory"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative w-16 h-16 rounded-2xl bg-white border border-slate-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)] flex items-center justify-center mb-6 group-hover:scale-105 group-hover:border-blue-200 transition-all duration-500 z-10">
                <HeartPulse className="w-8 h-8 text-blue-600" strokeWidth={1.5} />
                <div className="absolute inset-0 rounded-2xl bg-blue-400/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              <p className="relative z-10 text-sm font-semibold text-blue-600 mb-2 tracking-wide uppercase">
                Are you looking for an agencies providing substance use treatment services?
              </p>

              <h2 className="relative z-10 text-2xl font-bold text-slate-900 mb-4 tracking-tight leading-snug">
                2024 National Directory of Drug and Alcohol Use Treatment Facilities
              </h2>
              
              <p className="relative z-10 text-[14px] text-slate-500 leading-relaxed mb-8 flex-1">
                This "2024 National Directory of Drug and Alcohol Use Treatment Facilities" is a comprehensive listing of drug and alcohol treatment facilities across the US for 2024, compiled from the 2023 National Substance Use and Mental Health Services Survey conducted by SAMHSA. It includes federal, state, local government, and private facilities that are both state-approved and participated in the survey. Find substance use treatment programs, detoxification services, opioid treatment programs, and recovery support services.
              </p>

              <div className="relative z-10 flex items-center gap-2 text-sm font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">
                <span className="relative pb-0.5 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-bottom-left after:scale-x-0 after:bg-blue-600 after:transition-transform after:duration-300 group-hover:after:scale-x-100">
                  Select Substance Use
                </span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </Link>

          </div>
          
          {/* Extremely subtle legal footnote */}
          <div className="mt-20 text-center max-w-2xl px-6">
            <p className="text-[13px] text-slate-400 leading-relaxed border-t border-slate-100 pt-8">
              Data sourced directly from the <span className="font-medium text-slate-500">2023 National Substance Use and Mental Health Services Survey</span> administered by SAMHSA. Verified public, private, or government facilities.
            </p>
          </div>

        </div>
      </main>
      
      <Footer />
    </div>
  );
}
