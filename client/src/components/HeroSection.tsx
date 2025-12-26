import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5">
            <span className="text-sm font-medium text-primary">COMMUNITY RESOURCE ENGINE</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            <span className="text-balance">
              Helping people navigate fragmented health, behavioral health, and social service systems.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Achieve accurate, helpful care coordination accessible to all stakeholders. Our goal is to reduce stress for
            professionals and clients by ensuring local provider data is timely and relevant.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/search">
              <Button
                size="lg"
                className="h-12 rounded-full px-8 text-base inline-flex items-center justify-center gap-2"
              >
                <span>Find Resources</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/research">
              <Button variant="outline" size="lg" className="h-12 rounded-full bg-white px-8 text-base">
                View Data Insights
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-accent/50 to-transparent" />
    </section>
  );
}
