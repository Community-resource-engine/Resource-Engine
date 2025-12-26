import { Navigation } from "@/components/Navigation";
import { ResearchContent } from "@/components/ResearchContent";
import { Footer } from "@/components/Footer";

export default function Research() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navigation />
      <main className="flex-1">
        <ResearchContent />
      </main>
      <Footer />
    </div>
  );
}
