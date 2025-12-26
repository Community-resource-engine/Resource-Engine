import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { SearchResults } from "@/components/SearchResults";

export default function SubstanceAbuseSearch() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navigation />
      <main className="flex-1 py-12">
        <SearchResults directory="substance" />
      </main>
      <Footer />
    </div>
  );
}
