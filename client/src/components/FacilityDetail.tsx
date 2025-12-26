import { useState, useEffect } from "react";
import { MapPin, Phone, ArrowLeft, Building2, Clock, Filter, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useSearch } from "wouter";
import {
  getCategoryServiceNames,
  getRenderableServiceCodes,
  getServiceCategoriesForDirectory,
  getServiceInfo,
} from "@/lib/facility-data";
import { getFacilityById } from "@/lib/api";
import type { Facility } from "@shared/types";

export function FacilityDetail({ facilityId }: { facilityId: string }) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [facility, setFacility] = useState<Facility | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const backPath = params.get("from") || "/search";

  useEffect(() => {
    const fetchFacility = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await getFacilityById(parseInt(facilityId, 10));
        setFacility(data);
      } catch (err) {
        console.error("Error fetching facility:", err);
        setError("Failed to load facility details.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFacility();
  }, [facilityId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-accent/30 to-background py-16 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="text-lg text-muted-foreground">Loading facility details...</span>
        </div>
      </div>
    );
  }

  if (error || !facility) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-accent/30 to-background py-16 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-foreground">
            {error || "Facility not found"}
          </h2>
          <Link href={backPath} className="mt-4 text-primary hover:underline block">
            Return to search
          </Link>
        </div>
      </div>
    );
  }

  const directory = facility.directory_type;
  const serviceCategories = getServiceCategoriesForDirectory(directory);
  const renderableCodes = getRenderableServiceCodes(facility.services || [], directory);

  const getServicesByCategory = (category: string) => {
    const categoryServices = serviceCategories[category] || [];
    return renderableCodes.filter((code) => categoryServices.some((s) => s.code === code));
  };

  const categoriesWithServices = Object.keys(serviceCategories).filter(
    (category) => getServicesByCategory(category).length > 0,
  );

  // If a category becomes empty (e.g., navigating from another facility), fall back to All.
  const safeSelectedCategory =
    selectedCategory && getServicesByCategory(selectedCategory).length > 0
      ? selectedCategory
      : null;

  const displayedServices = safeSelectedCategory
    ? getServicesByCategory(safeSelectedCategory)
    : renderableCodes;

  // “About” highlights (human-friendly)
  const languageNames = getCategoryServiceNames(renderableCodes, "Language Services", directory);
  const smokingNames = getCategoryServiceNames(renderableCodes, "Smoking Policy", directory);
  const careTypeNames = getCategoryServiceNames(renderableCodes, "Type of Care", directory);
  const settingNames = getCategoryServiceNames(renderableCodes, "Service Setting", directory);

  return (
    <div className="min-h-screen bg-gradient-to-b from-accent/30 to-background">
      {/* Header */}
      <div className="bg-white border-b border-border/50">
        <div className="mx-auto max-w-5xl px-6 lg:px-8 py-8">
          <Link href={backPath} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6 cursor-pointer" data-testid="link-back-search">
              <ArrowLeft className="h-4 w-4" />
              Back to search results
          </Link>
          <h1 className="text-3xl font-bold text-foreground">{facility.name1}</h1>
          {facility.name2 && <p className="text-lg text-muted-foreground mt-2">{facility.name2}</p>}
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 lg:px-8 py-12">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Contact info card */}
            <div className="bg-white rounded-xl border border-border/60 shadow-sm overflow-hidden">
              <div className="px-8 py-5 border-b border-border/40 bg-muted/20">
                <h2 className="font-semibold text-foreground flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  Facility Information
                </h2>
              </div>
              <div className="p-8 space-y-6">
                <div className="flex items-start gap-4">
                  <MapPin className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-medium text-foreground mb-1">Address</p>
                    <p className="text-muted-foreground leading-relaxed">
                      {facility.street1}
                      {facility.street2 && <>, {facility.street2}</>}
                      <br />
                      {facility.city}, {facility.state} {facility.zip}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Phone className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-medium text-foreground mb-1">Phone</p>
                    <p className="text-muted-foreground">{facility.phone}</p>
                  </div>
                </div>

                {(facility.intake1 || facility.intake2) && (
                  <div className="flex items-start gap-4">
                    <Clock className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-medium text-foreground mb-1">Intake Lines</p>
                      {facility.intake1 && (
                        <p className="text-muted-foreground">
                          {facility.intake1}{" "}
                          {facility.intake1a && <span className="text-sm">({facility.intake1a})</span>}
                        </p>
                      )}
                      {facility.intake2 && (
                        <p className="text-muted-foreground">
                          {facility.intake2}{" "}
                          {facility.intake2a && <span className="text-sm">({facility.intake2a})</span>}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* About section (human-readable) */}
            <div className="bg-white rounded-xl border border-border/60 shadow-sm overflow-hidden">
              <div className="px-8 py-5 border-b border-border/40 bg-muted/20">
                <h2 className="font-semibold text-foreground">About This Facility</h2>
              </div>
              <div className="p-8 space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  These details are based on directory codes. Call the facility to confirm availability, eligibility, and
                  hours.
                </p>

                <div className="grid gap-3 sm:grid-cols-2">
                  {careTypeNames.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-foreground">Type of care</p>
                      <p className="text-sm text-muted-foreground">{careTypeNames.slice(0, 6).join(", ")}</p>
                    </div>
                  )}
                  {settingNames.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-foreground">Service setting</p>
                      <p className="text-sm text-muted-foreground">{settingNames.slice(0, 6).join(", ")}</p>
                    </div>
                  )}
                  {languageNames.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-foreground">Languages</p>
                      <p className="text-sm text-muted-foreground">{languageNames.slice(0, 10).join(", ")}</p>
                    </div>
                  )}
                  {smokingNames.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-foreground">Smoking & vaping</p>
                      <p className="text-sm text-muted-foreground">{smokingNames.slice(0, 6).join(", ")}</p>
                    </div>
                  )}
                </div>

                {/* {facility.service_code_info && (
                  <details className="rounded-lg border border-border/60 bg-muted/10 p-4">
                    <summary className="cursor-pointer text-sm font-medium text-foreground">
                      Show raw directory codes
                    </summary>
                    <p className="mt-3 text-xs leading-relaxed text-muted-foreground break-words">
                      {facility.service_code_info}
                    </p>
                  </details>
                )} */}
              </div>
            </div>

            {/* Services section */}
            <div className="bg-white rounded-xl border border-border/60 shadow-sm overflow-hidden">
              <div className="px-8 py-5 border-b border-border/40 bg-muted/20">
                <h2 className="font-semibold text-foreground flex items-center gap-2">
                  <Filter className="h-5 w-5 text-primary" />
                  Services Offered
                </h2>
              </div>
              <div className="p-8">
                <div className="flex flex-wrap gap-2 mb-6">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedCategory === null
                        ? "bg-primary text-white"
                        : "bg-muted text-muted-foreground hover:bg-muted/70"
                    }`}
                  >
                    All Services ({renderableCodes.length})
                  </button>
                  {categoriesWithServices.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedCategory === category
                          ? "bg-primary text-white"
                          : "bg-muted text-muted-foreground hover:bg-muted/70"
                      }`}
                    >
                      {category} ({getServicesByCategory(category).length})
                    </button>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2">
                  {displayedServices.map((code) => {
                    const info = getServiceInfo(code, directory);
                    if (!info) return null;
                    return (
                      <span
                        key={code}
                        className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium ${info.color}`}
                      >
                        {info.name}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-border/60 shadow-sm overflow-hidden p-6">
              <h3 className="font-semibold text-foreground mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button className="w-full" asChild>
                  <a href={`tel:${facility.phone}`}>
                    <Phone className="h-4 w-4 mr-2" />
                    Call Facility
                  </a>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(
                      `${facility.street1} ${facility.city} ${facility.state} ${facility.zip}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    Get Directions
                  </a>
                </Button>
              </div>
            </div>

            <div className="bg-primary/5 rounded-xl border border-primary/20 p-6">
              <h3 className="font-semibold text-foreground mb-2">Need Help?</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                If you're in crisis, call the National Suicide Prevention Lifeline at{" "}
                <a href="tel:988" className="font-semibold text-primary hover:underline">
                  988
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
