import { Navigation } from "@/components/navigation"
import { ContactForm } from "@/components/contact-form"
import { Footer } from "@/components/footer"

export const metadata = {
  title: "Contact | Community Resource Engine",
  description: "Submit feedback or report updates to community resource data",
}

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navigation />
      <main className="flex-1">
        <ContactForm />
      </main>
      <Footer />
    </div>
  )
}
