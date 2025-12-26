import { Navigation } from "@/components/navigation"
import { SearchInterface } from "@/components/search-interface"
import { Footer } from "@/components/footer"

export const metadata = {
  title: "Find Care | Community Resource Engine",
  description: "Search for mental health and behavioral health agencies in Arizona",
}

export default function SearchPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navigation />
      <main className="flex-1 py-12">
        <SearchInterface />
      </main>
      <Footer />
    </div>
  )
}
