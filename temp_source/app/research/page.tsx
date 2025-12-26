import { Navigation } from "@/components/navigation"
import { ResearchContent } from "@/components/research-content"
import { Footer } from "@/components/footer"

export const metadata = {
  title: "Research | CareWizard",
  description: "Dr. Hyunsung Oh - Principal Investigator, Arizona State University",
}

export default function ResearchPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navigation />
      <main className="flex-1">
        <ResearchContent />
      </main>
      <Footer />
    </div>
  )
}
