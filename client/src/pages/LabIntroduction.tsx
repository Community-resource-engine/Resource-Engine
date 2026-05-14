import { Navigation } from "@/components/Navigation";
import { LabIntroductionContent } from "@/components/LabIntroductionContent";
import { Footer } from "@/components/Footer";

export default function LabIntroduction() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navigation />
      <main className="flex-1">
        <LabIntroductionContent />
      </main>
      <Footer />
    </div>
  );
}
