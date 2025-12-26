import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Link } from "wouter";
import { Brain, Pill } from "lucide-react";

export default function DirectorySelection() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navigation />
      <main className="flex-1 py-12">
        <div className="min-h-[80vh] flex flex-col justify-center py-24">
          <div className="text-center mb-20">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Choose a Directory</h1>
            <p className="text-lg text-gray-600 max-w-xl mx-auto">
              Select the type of services you are looking for to begin your search
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto w-full px-8">
            <Link
              href="/search/mental-health"
              className="bg-white border-2 border-gray-200 rounded-3xl p-12 text-left hover:border-primary hover:shadow-2xl transition-all duration-300 group"
              data-testid="link-mental-health-directory"
            >
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mb-6 group-hover:bg-emerald-100 group-hover:scale-110 transition-all duration-300">
                <Brain className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors">
                National Directory of Mental Health Services
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Find mental health treatment facilities, psychiatric hospitals, community mental health centers, and
                counseling services.
              </p>
            </Link>

            <Link
              href="/search/substance-abuse"
              className="bg-white border-2 border-gray-200 rounded-3xl p-12 text-left hover:border-primary hover:shadow-2xl transition-all duration-300 group"
              data-testid="link-substance-abuse-directory"
            >
              <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-6 group-hover:bg-blue-100 group-hover:scale-110 transition-all duration-300">
                <Pill className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors">
                National Directory of Substance Abuse and Alcohol Treatment
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Find substance use treatment programs, detoxification services, opioid treatment programs, and recovery
                support services.
              </p>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
