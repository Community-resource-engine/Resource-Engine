import { Navigation } from "@/components/Navigation";
import { FacilityDetail } from "@/components/FacilityDetail";
import { Footer } from "@/components/Footer";
import { useRoute } from "wouter";

export default function FacilityDetailPage() {
  const [match, params] = useRoute("/facility/:id");

  if (!match) return null;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navigation />
      <main className="flex-1">
        <FacilityDetail facilityId={params.id} />
      </main>
      <Footer />
    </div>
  );
}
