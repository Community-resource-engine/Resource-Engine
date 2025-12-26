import { Navigation } from "@/components/Navigation";
import { SearchInterface } from "@/components/SearchInterface";
import { Footer } from "@/components/Footer";

export default function Search() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navigation />
      <main className="flex-1 py-12">
        <SearchInterface />
      </main>
      <Footer />
    </div>
  );
}
