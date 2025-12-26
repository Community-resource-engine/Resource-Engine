"use client"

import { useState } from "react"
import { MapPin, Phone, ArrowLeft, Building2, Clock, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { getFacilityById, getServiceInfo, serviceCategories } from "@/lib/facility-data"

export function FacilityDetail({ facilityId }: { facilityId: string }) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const facility = getFacilityById(facilityId)

  if (!facility) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-accent/30 to-background py-16 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-foreground">Facility not found</h2>
          <Link href="/search" className="mt-4 text-primary hover:underline">
            Return to search
          </Link>
        </div>
      </div>
    )
  }

  const getServicesByCategory = (category: string) => {
    const categoryServices = serviceCategories[category as keyof typeof serviceCategories] || []
    return facility.services.filter((code) => categoryServices.some((s) => s.code === code))
  }

  const categoriesWithServices = Object.keys(serviceCategories).filter(
    (category) => getServicesByCategory(category).length > 0,
  )

  const displayedServices = selectedCategory ? getServicesByCategory(selectedCategory) : facility.services

  return (
    <div className="min-h-screen bg-gradient-to-b from-accent/30 to-background">
      {/* Header */}
      <div className="bg-white border-b border-border/50">
        <div className="mx-auto max-w-5xl px-6 lg:px-8 py-8">
          <Link
            href="/search"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6"
          >
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

            {/* About section */}
            {facility.service_code_info && (
              <div className="bg-white rounded-xl border border-border/60 shadow-sm overflow-hidden">
                <div className="px-8 py-5 border-b border-border/40 bg-muted/20">
                  <h2 className="font-semibold text-foreground">About This Facility</h2>
                </div>
                <div className="p-8">
                  <p className="text-muted-foreground leading-relaxed">{facility.service_code_info}</p>
                </div>
              </div>
            )}

            {/* Services section */}
            <div className="bg-white rounded-xl border border-border/60 shadow-sm overflow-hidden">
              <div className="px-8 py-5 border-b border-border/40 bg-muted/20">
                <h2 className="font-semibold text-foreground flex items-center gap-2">
                  <Filter className="h-5 w-5 text-primary" />
                  Services Offered
                </h2>
              </div>
              <div className="p-8">
                {/* Category filter */}
                <div className="mb-6">
                  <p className="text-sm text-muted-foreground mb-3">Filter by category:</p>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={selectedCategory === null ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(null)}
                      className="rounded-full"
                    >
                      All Services
                    </Button>
                    {categoriesWithServices.map((category) => (
                      <Button
                        key={category}
                        variant={selectedCategory === category ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedCategory(category)}
                        className="rounded-full"
                      >
                        {category}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Services list */}
                <div className="space-y-3">
                  {displayedServices.map((code) => {
                    const info = getServiceInfo(code)
                    return (
                      <div
                        key={code}
                        className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/40"
                      >
                        <span className={`px-3 py-1 rounded-md text-xs font-semibold ${info.color}`}>{code}</span>
                        <span className="text-foreground">{info.name}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-border/60 shadow-sm p-6 sticky top-6">
              <h3 className="font-semibold text-foreground mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button className="w-full" asChild>
                  <a href={`tel:${facility.phone.replace(/\D/g, "")}`}>
                    <Phone className="h-4 w-4 mr-2" />
                    Call Now
                  </a>
                </Button>
                <Button variant="outline" className="w-full bg-transparent" asChild>
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(
                      `${facility.street1} ${facility.city} ${facility.state} ${facility.zip}`,
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

            {/* Services summary */}
            <div className="bg-white rounded-xl border border-border/60 shadow-sm p-6">
              <h3 className="font-semibold text-foreground mb-4">Services Summary</h3>
              <div className="space-y-2">
                {categoriesWithServices.slice(0, 5).map((category) => (
                  <div key={category} className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">{category}</span>
                    <span className="font-medium text-foreground">{getServicesByCategory(category).length}</span>
                  </div>
                ))}
                {categoriesWithServices.length > 5 && (
                  <p className="text-xs text-muted-foreground pt-2">
                    +{categoriesWithServices.length - 5} more categories
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
