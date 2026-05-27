import { useState } from "react";
import { Mail, Phone, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import hyungsungImage from "@/assets/hyunsung-oh.jpg";

const researchAreas = [
  "Practice-Oriented AI in Social Work and Behavioral Health Settings",
  "Health Disparities and Social Context",
  "Racial/Ethnic Minorities living with Mental/Physical Chronic Illness",
  "Health Disparities during the COVID-19 Pandemic",
];

interface ResearchGrant {
  period: string;
  role: string;
  title: string;
  agency: string;
  totalFunding?: string;
  opportunityTitle?: string;
  recRidIia?: string;
  leadingPI?: string;
  coPIs?: string;
  description?: string;
  url?: string;
}

const activeGrants: ResearchGrant[] = [
  {
    period: "March 2026 – June 2026",
    role: "Principal Investigator",
    title: "Understanding AI Adoption in Social Work Education and Practice: A Mixed-Methods Study",
    agency: "Arizona State University School of Social Work (SSW)",
    totalFunding: "$29,718",
    opportunityTitle: "Scholarly Opportunities for Advancing Research (SOAR)",
    recRidIia: "In-University Grant, Not Applicable",
  },
  {
    period: "October 2025 – June 2026",
    role: "Principal Investigator",
    title: "AI-Integrated Social Work Curriculum: A Stakeholder Driven Approach",
    agency: "The Learning Engineering Institute, Arizona State University",
    totalFunding: "$8,000",
    opportunityTitle: "Learning Engineering Principled Innovation Grant Program",
    recRidIia: "In-University Grant, Not Applicable",
  },
];

const activeUnfunded: ResearchGrant[] = [
  {
    period: "January 2025 – present",
    role: "Principal Investigator",
    title: "CareConnectAZ.com",
    agency: "",
    url: "http://www.CareConnectAZ.com",
    description: "Led the design and development of a web-based, searchable directory to address gaps in access to mental health and substance use treatment resources across Arizona and other states. The platform enables need-based searches by population served, treatment modality, and service characteristics, serving as a foundation for future evaluation and external funding.",
  },
  {
    period: "August 2025 – present",
    role: "Principal Investigator",
    title: "Integrating AI LLMs in Social Work Education: Building Data Analytics and Business Solution Skills",
    agency: "No external funding",
    description: "Worked with undergraduate social work students to develop a community resource referral search engine using an AI LLM. Through this project, explored how AI can enhance professional skills in data analytics and business solutions that are directly applicable to social work practice.",
  },
];

const completedGrants: ResearchGrant[] = [
  {
    period: "2021 – 2023",
    role: "Co-Principal Investigator",
    title: "Apoyo for Latin American Asylum-Seekers: a Pilot Study",
    agency: "National Institutes of Health (NIH)",
    totalFunding: "$280,432",
    leadingPI: "Susan Pepin",
    opportunityTitle: "The RADx-UP CDCC Rapid Research Pilot Program",
    recRidIia: "35%/35%/35%",
  },
  {
    period: "2021 – 2023",
    role: "Co-Principal Investigator",
    title: "Eliminating COVID-19 disparities in partnership with underserved/vulnerable transnational communities of Arizona",
    agency: "National Institutes of Health (NIH)",
    totalFunding: "$1,985,102",
    leadingPI: "Flavio F. Marsiglia",
    opportunityTitle: "NOSI: Emergency Competitive Revisions for Community-engaged COVID-19 Testing Interventions among Underserved and Vulnerable Populations – RADx-UP Phase II",
    recRidIia: "30%/30%/30%",
  },
  {
    period: "2021 – 2023",
    role: "Co-Investigator",
    title: "Back to ECE Safely with SAGE: Reducing COVID-19 Transmission in Hispanic and Low-income Preschoolers",
    agency: "National Institutes of Health (NIH)",
    totalFunding: "$2,998,548",
    leadingPI: "Rebecca Lee",
    opportunityTitle: "RADx-UP Return to School Diagnostic Testing Approaches",
    recRidIia: "5%/5%/5%",
  },
  {
    period: "2020 – 2024",
    role: "Co-Principal Investigator",
    title: "Eliminating COVID-19 disparities in Arizona in partnership with underserved/vulnerable communities",
    agency: "National Institutes of Health (NIH)",
    totalFunding: "$4,707,512",
    leadingPI: "Flavio F. Marsiglia",
    opportunityTitle: "NOSI: Limited Competition for Emergency Competitive Revisions for Community-Engaged Research on COVID-19 Testing among Underserved and/or Vulnerable Populations",
    recRidIia: "20%/20%/20%",
  },
  {
    period: "2019 – 2024",
    role: "Co-Investigator",
    title: "Pacific Southwest Addiction Technology Transfer Center",
    agency: "Substance Abuse & Mental Health Services Administration (SAMHSA)",
    totalFunding: "$450,000 (sub-award, pass through UCLA-ISAP)",
    coPIs: "Michael Shafer (ASU); Beth Rutkowski (UCLA ISAP)",
    recRidIia: "0%/0%/0%",
  },
  {
    period: "2018 – 2020",
    role: "Principal Investigator",
    title: "Uncovering Functions of Social Networks Associated with Diabetes Management among Latino Patients with Type 2 Diabetes Mellitus",
    agency: "NIH/NIMHD via Southwest Interdisciplinary Research Center (SIRC)",
    totalFunding: "$50,000",
    leadingPI: "Flavio F. Marsiglia (parent grant)",
    recRidIia: "0%/0%/0%",
  },
];


const education = [
  { 
    degree: "Ph.D. in Social Work", 
    institution: "University of Southern California", 
    year: "2014",
  },
  { degree: "M.S.W. in Social Work", institution: "Yonsei University, Seoul", year: "2009" },
];

const publications = [
  {
    authors: "Shin, S., Ahn, S., Oh, H., & Joung, J.",
    year: "2025",
    title: "Between hope and trauma at the last resort: A Qualitative meta-synthesis of patient experiences with electroconvulsive therapy",
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
    title: "Perceptions of health insurance among self-employed Korean immigrants from South Korea in the United States",
    journal: "Health Education and Behavior, 51(1), 167-175",
  },
  {
    authors: "Marsiglia, F. F., Oh, H., León, T., & Gonzalez, E.",
    year: "2024",
    title: "Reaching vulnerable and underserved communities in the US Southwest through a successful COVID-19 community-academic partnership",
    journal: "American Journal of Public Health, 114(S5), S388-S391",
  },
  {
    authors: "Oh, H., Cho, Y., Bae, J., Holley, L. C., Shafer, M., Kim, K., & Lee, Y.",
    year: "2024",
    title: "Impact of statutory revisions to family-petitioned civil commitment in South Korea",
    journal: "International Journal of Law and Psychiatry, 94, 101982",
  },
  {
    authors: "Oh, H., Marsiglia, F. F., Pepin, S., Ayers, S., & Wu, S.",
    year: "2024",
    title: "Health behavior and attitudes during the COVID-19 pandemic among vulnerable and underserved Latinx in the Southwest USA",
    journal: "Prevention Science, 25(2), 279-290",
  },
  {
    authors: "Shafer, M. S., Oh, H., Sturtevant, H., Freese, T., & Rutkowski, B.",
    year: "2024",
    title: "Patterns and predictors of sustained training and technical assistance engagement among addiction treatment and affiliated providers",
    journal: "The Journal of Behavioral Health Services & Research, 51(2), 264-274",
  },
  {
    authors: "Hernandez-Salinas, C., Marsiglia, F. F., Oh, H., Campos, A. P., & De La Rosa, K.",
    year: "2023",
    title: "Community health workers as puentes/bridges to increase COVID-19 health equity in Latinx communities of the Southwest U.S.",
    journal: "Journal of Community Health, 48(3), 398-413",
  },
  {
    authors: "Goldman, J. L., Kalu, I. C., Schuster, J. E., et al.",
    year: "2023",
    title: "Building school-academic partnerships to implement COVID-19 testing in underserved populations",
    journal: "Pediatrics, 152(Supplement 1), e2022060352C",
  },
  {
    authors: "Lee, R. E., Todd, M., Oh, H., Han, S., Santana, M., et al.",
    year: "2023",
    title: "Acceptability and feasibility of saliva-delivered pcr coronavirus 2019 tests for young children",
    journal: "Pediatrics, 152(Supplement 1)",
  },
  {
    authors: "Shen, F. L., Shu, J., Lee, M., Oh, H., Li, M., Runger, G., Marsiglia, F. F., & Liu, L.",
    year: "2023",
    title: "Evolution of COVID-19 health disparities in Arizona",
    journal: "Journal of Immigrant and Minority Health, 25(4), 862-869",
  },
  {
    authors: "Choi, H., & Oh, H.",
    year: "2022",
    title: "Mental health care for children and adolescents during the COVID-19 pandemic: Experiences and challenges",
    journal: "Journal of Korean Academic Nursing, 52(4), 359-362",
  },
  {
    authors: "Oh, H., Kim, M., Kim, J., Choi, H., Kim, H. S., Holley, L. C., & Kweon, O. Y.",
    year: "2022",
    title: "Lack of continuity of care experienced by people diagnosed with schizophrenia in South Korea",
    journal: "Health & Social Care in the Community, 30(3), e760-e769",
  },
  {
    authors: "Oh, H., Um, M. Y., & Garbe, R.",
    year: "2021",
    title: "Social networks and chronic illness management among low-income tenants in publicly subsidized housing: Findings from a pilot study",
    journal: "Social Work in Public Health, 36(3), 405-418",
  },
  {
    authors: "Lopez, K., & Oh, H.",
    year: "2021",
    title: "Developmental disabilities in the context of Fragile Families: Racial and ethnic disparities at age 9",
    journal: "Social Work Research, 45(4), 293-305",
  },
  {
    authors: "Oh, H.",
    year: "2021",
    title: "Book Review: Evidence-based practices for social workers: An interdisciplinary approach",
    journal: "Research on Social Work Practice, 31(1), 108-110",
  },
  {
    authors: "Oh, H., Poola, C., Messing, J., Ferguson, K., & Bonifas, R.",
    year: "2021",
    title: "Correlates of attitudes toward evidence-based practice among MSW students preparing for direct practice",
    journal: "Journal of Social Work Education, 57(4), 707-719",
  },
  {
    authors: "Oh, H., Trinh, M., Vang, C., & Becerra, D.",
    year: "2020",
    title: "Addressing barriers to access primary care for Latinos in the U.S.: An agent-based model",
    journal: "Journal of the Society for Social Work and Research, 11(2), 165-184",
  },
  {
    authors: "Oh, H. & Park, S.",
    year: "2020",
    title: "Gender and stress-buffering of social capital toward depression among precarious workers in South Korea",
    journal: "WORK: A Journal of Prevention, Assessment, and Rehabilitation, 66(1), 53-62",
  },
  {
    authors: "Xiang, X., An, R., & Oh, H.",
    year: "2020",
    title: "The bidirectional relationship between depressive symptoms and homebound status among older adults",
    journal: "The Journal of Gerontology: Series B, 75(2), 357-366",
  },
];

const PUBLICATIONS_PER_PAGE = 10;

export function LabIntroductionContent() {
  const [currentPage, setCurrentPage] = useState(1);
  
  const totalPages = Math.ceil(publications.length / PUBLICATIONS_PER_PAGE);
  const startIndex = (currentPage - 1) * PUBLICATIONS_PER_PAGE;
  const paginatedPublications = publications.slice(startIndex, startIndex + PUBLICATIONS_PER_PAGE);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Lab Introduction</h1>
        <p className="mt-1 text-sm text-muted-foreground">Principal investigator and research background</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <div className="rounded-lg border border-border bg-card p-5">
            <div className="flex items-center gap-4">
              <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-full bg-muted">
                <img
                  src={hyungsungImage}
                  alt="Dr. Hyunsung Oh"
                  className="object-cover w-full h-full"
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

        <div className="lg:col-span-2">
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

          {/* Research Projects Section */}
          <section className="mb-6">
            <h3 className="mb-4 text-sm font-medium uppercase tracking-wide text-muted-foreground">Active Research Projects</h3>

            {/* Funded/Ongoing Grants */}
            <div className="mb-5">
              <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-primary/80 border-b border-border pb-1">Grants (Funded / Ongoing)</h4>
              <div className="space-y-3">
                {activeGrants.map((g, idx) => (
                  <div key={idx} className="rounded-lg border border-border bg-card p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium leading-snug text-foreground">{g.title}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{g.role} · {g.agency}</p>
                        {g.totalFunding && <p className="mt-1 text-xs text-muted-foreground">Total funding: {g.totalFunding}</p>}
                        {g.opportunityTitle && <p className="mt-0.5 text-xs italic text-muted-foreground">{g.opportunityTitle}</p>}
                        {g.recRidIia && <p className="mt-0.5 text-xs text-muted-foreground">REC/RID/IIA: {g.recRidIia}</p>}
                      </div>
                      <span className="shrink-0 rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">{g.period}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Research Without External Funding */}
            <div className="mb-5">
              <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-primary/80 border-b border-border pb-1">Research Projects Without External Funding</h4>
              <div className="space-y-3">
                {activeUnfunded.map((g, idx) => (
                  <div key={idx} className="rounded-lg border border-border bg-card p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium leading-snug text-foreground">{g.title}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{g.role}{g.agency ? ` · ${g.agency}` : ""}</p>
                        {g.url && (
                          <a href={g.url} target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex items-center gap-1 text-xs text-primary hover:underline">
                            <ExternalLink className="h-3 w-3" />{g.url}
                          </a>
                        )}
                        {g.description && <p className="mt-1 text-xs text-muted-foreground">{g.description}</p>}
                      </div>
                      <span className="shrink-0 rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">{g.period}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Completed Research Projects */}
          <section className="mb-6">
            <h3 className="mb-4 text-sm font-medium uppercase tracking-wide text-muted-foreground">Completed Research Projects</h3>
            <div>
              <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-primary/80 border-b border-border pb-1">Grants (Funded / Ended)</h4>
              <div className="space-y-3">
                {completedGrants.map((g, idx) => (
                  <div key={idx} className="rounded-lg border border-border bg-card p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium leading-snug text-foreground">{g.title}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{g.role}{g.leadingPI ? ` (Leading PI: ${g.leadingPI})` : ""}{g.coPIs ? ` · Co-PIs: ${g.coPIs}` : ""} · {g.agency}</p>
                        {g.totalFunding && <p className="mt-1 text-xs text-muted-foreground">Total funding: {g.totalFunding}</p>}
                        {g.opportunityTitle && <p className="mt-0.5 text-xs italic text-muted-foreground">{g.opportunityTitle}</p>}
                        {g.recRidIia && <p className="mt-0.5 text-xs text-muted-foreground">REC/RID/IIA: {g.recRidIia}</p>}
                      </div>
                      <span className="shrink-0 rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">{g.period}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>


          <section>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                Selected Publications
              </h3>
              <span className="text-xs text-muted-foreground">
                Showing {startIndex + 1}-{Math.min(startIndex + PUBLICATIONS_PER_PAGE, publications.length)} of {publications.length}
              </span>
            </div>
            <div className="space-y-3">
              {paginatedPublications.map((pub, idx) => (
                <div key={startIndex + idx} className="rounded-lg border border-border bg-card p-4">
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

            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      type="button"
                      onClick={() => setCurrentPage(page)}
                      className={`w-8 h-8 text-sm font-medium rounded-lg transition-colors ${
                        currentPage === page
                          ? "bg-primary text-white"
                          : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
