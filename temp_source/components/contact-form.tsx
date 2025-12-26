"use client"

import type React from "react"
import { useState } from "react"
import { Send, CheckCircle, Mail, Building, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const feedbackCategories = [
  { value: "type_of_care", label: "Type of Care" },
  { value: "service_setting", label: "Service Setting" },
  { value: "facility_type", label: "Facility Type" },
  { value: "treatment_approach", label: "Treatment Approach" },
  { value: "payment_insurance", label: "Payment/Insurance" },
  { value: "population_served", label: "Population Served" },
  { value: "language_services", label: "Language Services" },
  { value: "agency_update", label: "Agency Information Update" },
  { value: "new_agency", label: "Suggest New Agency" },
  { value: "general", label: "General Feedback" },
]

export function ContactForm() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    category: "",
    agencyName: "",
    message: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitted(true)
  }

  if (isSubmitted) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-accent/20">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="mb-2 text-xl font-semibold text-foreground">Feedback Submitted</h2>
          <p className="mb-6 text-muted-foreground">Thank you for your feedback. We'll review it shortly.</p>
          <Button
            variant="outline"
            onClick={() => {
              setIsSubmitted(false)
              setFormData({ name: "", email: "", category: "", agencyName: "", message: "" })
            }}
          >
            Submit Another
          </Button>
        </div>
      </div>
    )
  }

  const showAgencyField = formData.category === "agency_update" || formData.category === "new_agency"

  return (
    <div className="min-h-screen bg-gradient-to-b from-accent/30 to-background">
      <div className="bg-white border-b border-border/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl font-bold text-foreground">Contact Us</h1>
          <p className="mt-1 text-muted-foreground">Help improve our database by providing feedback</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          {/* Form */}
          <div className="rounded-xl bg-white p-8 border border-border/60 shadow-sm">
            <h2 className="mb-6 text-lg font-semibold text-foreground">Submit Feedback</h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Your name"
                    className="mt-1.5 h-11"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="your@email.com"
                    className="mt-1.5 h-11"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="category">Feedback Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger className="mt-1.5 h-11">
                    <SelectValue placeholder="Select a category..." />
                  </SelectTrigger>
                  <SelectContent>
                    {feedbackCategories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {showAgencyField && (
                <div>
                  <Label htmlFor="agencyName">Agency Name</Label>
                  <Input
                    id="agencyName"
                    value={formData.agencyName}
                    onChange={(e) => setFormData({ ...formData, agencyName: e.target.value })}
                    placeholder="Name of the agency"
                    className="mt-1.5 h-11"
                  />
                </div>
              )}

              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Describe your feedback, suggested updates, or new information..."
                  className="mt-1.5 min-h-[140px]"
                  required
                />
              </div>

              <Button type="submit" className="h-11 px-8 inline-flex items-center justify-center gap-2">
                <Send className="h-4 w-4" />
                <span>Submit Feedback</span>
              </Button>
            </form>
          </div>

          <div className="space-y-6">
            <div className="rounded-xl bg-white p-6 border border-border/60 shadow-sm">
              <h3 className="mb-4 font-semibold text-foreground">Contact Information</h3>
              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <User className="mt-0.5 h-4 w-4 text-primary" />
                  <div>
                    <p className="font-medium text-foreground">Dr. Hyunsung Oh</p>
                    <p className="text-muted-foreground">Principal Investigator</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Building className="mt-0.5 h-4 w-4 text-primary" />
                  <div>
                    <p className="text-muted-foreground">School of Social Work</p>
                    <p className="text-muted-foreground">Arizona State University</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-4 w-4 text-primary" />
                  <a href="mailto:hyunsung@asu.edu" className="text-primary hover:underline">
                    hyunsung@asu.edu
                  </a>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-primary/5 p-6 border border-primary/10">
              <h3 className="mb-2 font-semibold text-foreground">Why Your Feedback Matters</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Your input helps us maintain accurate, up-to-date information about community resources. The Community
                Advisory Board reviews all submissions to ensure data quality.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
