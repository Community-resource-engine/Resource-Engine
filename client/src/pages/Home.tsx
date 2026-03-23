import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";
import { ValueProposition } from "@/components/ValueProposition";
import { CommunitySection } from "@/components/CommunitySection";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navigation />
      <main className="flex-1">
        <HeroSection />
        <section className="py-16 bg-white border-y border-border/50">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="rounded-2xl bg-primary/5 p-10 border border-primary/10 max-w-4xl mx-auto shadow-sm">
              <h2 className="mb-6 text-3xl font-bold tracking-tight text-foreground text-center">How This Works</h2>
              <ol className="text-lg leading-relaxed text-muted-foreground space-y-4 list-decimal list-inside ml-4 marker:text-primary marker:font-bold">
                <li><span className="text-foreground font-medium">Select the directory type</span> (Mental Health or Substance Abuse)</li>
                <li><span className="text-foreground font-medium">Choose the state</span> where the facility is located</li>
                <li><span className="text-foreground font-medium">Search for and select</span> the specific clinic</li>
                <li><span className="text-foreground font-medium">Select filter categories</span> and service options to report issues about</li>
                <li><span className="text-foreground font-medium">Add a detailed description</span> of the issue</li>
              </ol>
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
