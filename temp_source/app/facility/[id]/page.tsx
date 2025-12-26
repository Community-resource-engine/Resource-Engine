import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { FacilityDetail } from "@/components/facility-detail"

export const metadata = {
  title: "Facility Details | Community Resource Engine",
  description: "View detailed information about this healthcare facility",
}

export default function FacilityPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navigation />
      <main className="flex-1">
        <FacilityDetail facilityId={params.id} />
      </main>
      <Footer />
    </div>
  )
}
