import Image from "next/image"
import { Mail, Phone } from "lucide-react"

const researchAreas = [
  "Practice-Oriented AI in Social Work and Behavioral Health Settings",
  "Health Disparities and Social Context",
  "Racial/Ethnic Minorities living with Mental/Physical Chronic Illness",
  "Health Disparities during the COVID-19 Pandemic",
]

const education = [
  { degree: "Ph.D. in Social Work", institution: "University of Southern California", year: "2014" },
  { degree: "M.S.W. in Social Work", institution: "Yonsei University, Seoul", year: "2009" },
]

const publications = [
  {
    authors: "Shin, S., Ahn, S., Oh, H., & Joung, J.",
    year: "2025",
    title:
      "Between hope and trauma at the last resort: A Qualitative meta-synthesis of patient experiences with electroconvulsive therapy",
    journal: "Journal of Psychosocial Nursing and Mental Health Services, 1-8",
  },
  {
    authors: "Marroquín, J. M., Lechuga-Peña, S., Oh, H., & Marsiglia, F. F.",
    year: "2025",
    title: "Advancing health equity for Latinx autistic adults in the United States through an intersectionality lens",
    journal: "Social Work",
  },
  {
    authors: "Boby, M., Oh, H., Marsiglia, F., & Liu, L.",
    year: "2024",
    title: "Bridging social capital among Facebook users and COVID-19 cases growth in Arizona",
    journal: "Social Science and Medicine, 360, 117313",
  },
  {
    authors: "Jeong, C. H., Oh, H., Palinkas, L. A., & Lusenhop, W.",
    year: "2024",
    title:
      "Perceptions of health insurance among self-employed Korean immigrants from South Korea in the United States",
    journal: "Health Education and Behavior, 51(1), 167-175",
  },
]

export function ResearchContent() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Research</h1>
        <p className="mt-1 text-sm text-muted-foreground">Principal investigator and research background</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Profile Card - Sidebar */}
        <div className="lg:col-span-1">
          <div className="rounded-lg border border-border bg-card p-5">
            <div className="flex items-center gap-4">
              <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-full bg-muted">
                <Image
                  src="/professional-headshot-of-asian-male-professor.jpg"
                  alt="Dr. Hyunsung Oh"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h2 className="font-semibold text-foreground">Dr. Hyunsung Oh</h2>
                <p className="text-sm text-primary">Associate Professor</p>
                <p className="text-xs text-muted-foreground">Arizona State University</p>
              </div>
            </div>

            <div className="mt-4 space-y-2 border-t border-border/50 pt-4 text-sm">
              <a
                href="mailto:hyunsung@asu.edu"
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
              >
                <Mail className="h-4 w-4" />
                hyunsung@asu.edu
              </a>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                602-496-0518
              </div>
            </div>

            {/* Education */}
            <div className="mt-4 border-t border-border/50 pt-4">
              <h3 className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">Education</h3>
              <div className="space-y-2">
                {education.map((edu, idx) => (
                  <div key={idx} className="text-sm">
                    <p className="font-medium text-foreground">{edu.degree}</p>
                    <p className="text-xs text-muted-foreground">
                      {edu.institution}, {edu.year}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Research Areas */}
          <section className="mb-6">
            <h3 className="mb-3 text-sm font-medium uppercase tracking-wide text-muted-foreground">Research Areas</h3>
            <div className="grid gap-2 sm:grid-cols-2">
              {researchAreas.map((area, idx) => (
                <div
                  key={idx}
                  className="rounded-md border border-border bg-muted/30 px-3 py-2 text-sm text-foreground"
                >
                  {area}
                </div>
              ))}
            </div>
          </section>

          {/* Publications */}
          <section>
            <h3 className="mb-3 text-sm font-medium uppercase tracking-wide text-muted-foreground">
              Selected Publications
            </h3>
            <div className="space-y-3">
              {publications.map((pub, idx) => (
                <div key={idx} className="rounded-lg border border-border bg-card p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium leading-snug text-foreground">{pub.title}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{pub.authors}</p>
                      <p className="mt-1 text-xs italic text-muted-foreground">{pub.journal}</p>
                    </div>
                    <span className="shrink-0 rounded bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                      {pub.year}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
