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
              className="bg-emerald-50 border-2 border-emerald-200 rounded-3xl p-12 text-left hover:border-emerald-500 hover:shadow-2xl transition-all duration-300 group"
              data-testid="link-mental-health-directory"
            >
              <h2 className="text-lg font-semibold text-emerald-800 mb-6 opacity-90">
                Are you looking for an agencies providing mental health services?
              </h2>
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center mb-6 group-hover:bg-emerald-200 group-hover:scale-110 transition-all duration-300">
                <Brain className="w-8 h-8 text-emerald-700" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-emerald-700 transition-colors">
                2024 National Directory of Mental Health Treatment Facilities
              </h3>
              <p className="text-gray-700 leading-relaxed">
                The National Directory of Mental Health Services is a comprehensive listing of mental health treatment facilities across the US for 2024, compiled from the 2023 National Substance Use and Mental Health Services Survey conducted by SAMHSA. It includes federal, state, local government, and private facilities that provide mental health services. Find mental health treatment facilities, psychiatric hospitals, community mental health centers, and counseling services.
              </p>
            </Link>

            <Link
              href="/search/substance-abuse"
              className="bg-blue-50 border-2 border-blue-200 rounded-3xl p-12 text-left hover:border-blue-500 hover:shadow-2xl transition-all duration-300 group"
              data-testid="link-substance-abuse-directory"
            >
              <h2 className="text-lg font-semibold text-blue-800 mb-6 opacity-90">
                Are you looking for an agencies providing substance use treatment services?
              </h2>
              <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center mb-6 group-hover:bg-blue-200 group-hover:scale-110 transition-all duration-300">
                <Pill className="w-8 h-8 text-blue-700" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-700 transition-colors">
                2024 National Directory of Drug and Alcohol Use Treatment Facilities
              </h3>
              <p className="text-gray-700 leading-relaxed">
                This "2024 National Directory of Drug and Alcohol Use Treatment Facilities" is a comprehensive listing of drug and alcohol treatment facilities across the US for 2024, compiled from the 2023 National Substance Use and Mental Health Services Survey conducted by SAMHSA. It includes federal, state, local government, and private facilities that are both state-approved and participated in the survey. Find substance use treatment programs, detoxification services, opioid treatment programs, and recovery support services.
              </p>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
