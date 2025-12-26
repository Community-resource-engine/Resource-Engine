import { useState, useRef, useEffect } from "react";
import { Link } from "wouter";
import {
  ChevronDown,
  ChevronLeft,
  Filter,
  MapPin,
  Phone,
  Search,
  X,
  ArrowRight,
  Check,
  Brain,
  Pill,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getServiceInfo as getServiceInfoFromLib } from "@/lib/facility-data";
import { searchFacilities } from "@/lib/api";
import { mentalHealthFilters, substanceAbuseFilters } from "@/lib/filter-data";
import type { Facility } from "@shared/types";

// Helper components
function MultiSelectDropdown({
  label,
  options,
  selected,
  onToggle,
  categoryColor,
}: {
  label: string;
  options: { code: string; name: string }[];
  selected: string[];
  onToggle: (code: string) => void;
  categoryColor: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedCount = options.filter((opt) => selected.includes(opt.code)).length;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full text-left px-4 py-3 rounded-xl border transition-all duration-200 flex items-center justify-between group ${
          selectedCount > 0 ? "border-primary bg-primary/5" : "border-gray-200 bg-white hover:border-gray-300"
        }`}
      >
        <div>
          <span className={`block text-sm font-medium ${selectedCount > 0 ? "text-primary" : "text-gray-700"}`}>
            Select options
          </span>
          {selectedCount > 0 && <span className="text-xs text-primary mt-0.5">{selectedCount} selected</span>}
        </div>
        <ChevronDown
          className={`h-4 w-4 transition-transform duration-200 ${
            selectedCount > 0 ? "text-primary" : "text-gray-400 group-hover:text-gray-600"
          } ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-xl max-h-80 overflow-y-auto p-2 animate-in fade-in zoom-in-95 duration-200">
          {options.map((option) => {
            const isSelected = selected.includes(option.code);
            return (
              <button
                key={option.code}
                type="button"
                onClick={() => onToggle(option.code)}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors flex items-start gap-3 hover:bg-gray-50 ${
                  isSelected ? "bg-gray-50" : ""
                }`}
              >
                <div
                  className={`w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                    isSelected ? "bg-primary border-primary" : "border-gray-300 bg-white"
                  }`}
                >
                  {isSelected && <Check className="h-3.5 w-3.5 text-white" />}
                </div>
                <span className={isSelected ? "text-gray-900 font-medium" : "text-gray-600"}>{option.name}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ResultCard({
  result,
  getServiceInfo,
}: {
  result: any;
  getServiceInfo: (code: string) => any;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-shadow duration-300 group">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors">
                <Link href={`/facility/${result.id}`}>{result.name1}</Link>
              </h3>
              {result.name2 && <p className="text-gray-500 font-medium">{result.name2}</p>}
            </div>
            {result.distance && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                {result.distance} miles
              </span>
            )}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm text-gray-600 mb-6">
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 mt-0.5 text-gray-400" />
              <span>
                {result.street1}
                {result.street2 && `, ${result.street2}`}, {result.city}, {result.state} {result.zip}
              </span>
            </div>
            <div className="hidden sm:block text-gray-300">|</div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gray-400" />
              <a href={`tel:${result.phone}`} className="hover:text-primary hover:underline">
                {result.phone}
              </a>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Key Services</p>
            <div className="flex flex-wrap gap-2">
              {result.services.slice(0, 8).map((code: string) => {
                const info = getServiceInfo(code);
                return (
                  <span
                    key={code}
                    className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${info.color}`}
                  >
                    {info.name}
                  </span>
                );
              })}
              {result.services.length > 8 && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-600">
                  +{result.services.length - 8} more
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center gap-3 md:w-48 md:border-l md:border-gray-100 md:pl-6">
          <Link href={`/facility/${result.id}`}>
            <Button className="w-full rounded-xl" size="lg">
              View Details
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
          <Button variant="outline" className="w-full rounded-xl bg-white" asChild>
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(
                `${result.street1} ${result.city} ${result.state} ${result.zip}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Directions
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}

const CATEGORY_COLORS: Record<string, string> = {
  "Type of Care": "bg-blue-50 text-blue-700 border-blue-200",
  "Service Setting": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Facility Type": "bg-purple-50 text-purple-700 border-purple-200",
  "Treatment Approaches": "bg-amber-50 text-amber-700 border-amber-200",
  Pharmacotherapies: "bg-rose-50 text-rose-700 border-rose-200",
  "Emergency Services": "bg-indigo-50 text-indigo-700 border-indigo-200",
  "Facility Operation": "bg-cyan-50 text-cyan-700 border-cyan-200",
  "Licenses/Certs": "bg-teal-50 text-teal-700 border-teal-200",
  "Payment Accepted": "bg-sky-50 text-sky-700 border-sky-200",
  "Payment Assistance": "bg-lime-50 text-lime-700 border-lime-200",
  "Special Programs": "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200",
  "Assessment": "bg-violet-50 text-violet-700 border-violet-200",
  "Testing": "bg-orange-50 text-orange-700 border-orange-200",
  "Ancillary Services": "bg-slate-50 text-slate-700 border-slate-200",
  "Age Groups": "bg-pink-50 text-pink-700 border-pink-200",
  "Language Services": "bg-yellow-50 text-yellow-700 border-yellow-200",
  "Smoking Policy": "bg-gray-50 text-gray-700 border-gray-200",
  "Detoxification Services": "bg-red-50 text-red-700 border-red-200",
  Hospitals: "bg-green-50 text-green-700 border-green-200",
};

// Data structures from original file (re-defined here to avoid truncation issues and make self-contained)
const mentalHealthData = {
  "Type of Care": [
    { code: "SA", name: "Substance use treatment" },
    { code: "MH", name: "Mental health treatment" },
    { code: "SUMH", name: "Treatment for co-occurring substance use plus serious mental health illness" },
  ],
  "Service Setting": [
    { code: "HI", name: "Hospital inpatient/24-hour hospital inpatient" },
    { code: "OP", name: "Outpatient" },
    { code: "PHDT", name: "Partial hospitalization/day treatment" },
    { code: "RES", name: "Residential/24-hour residential" },
  ],
  "Facility Type": [
    { code: "CMHC", name: "Community mental health center" },
    { code: "CBHC", name: "Certified Community Behavioral Health Clinic" },
    { code: "MSMH", name: "Multi-setting mental health facility" },
    { code: "OMH", name: "Outpatient mental health facility" },
    { code: "ORES", name: "Other residential treatment facility" },
    { code: "PH", name: "Partial hospitalization/day treatment" },
    { code: "PSY", name: "Psychiatric hospital" },
    { code: "RTCA", name: "Residential treatment center (RTC) for adults" },
    { code: "RTCC", name: "Residential treatment center (RTC) for children" },
    { code: "IPSY", name: "Separate inpatient psychiatric unit of a general hospital" },
    { code: "SHP", name: "State hospital" },
    { code: "VAHC", name: "Veterans Affairs Medical Center or other VA healthcare facility" },
  ],
  "Treatment Approaches": [
    { code: "AT", name: "Activity therapy" },
    { code: "CBT", name: "Cognitive behavioral therapy" },
    { code: "CRT", name: "Cognitive remediation therapy" },
    { code: "CFT", name: "Couples/family therapy" },
    { code: "DBT", name: "Dialectical behavior therapy" },
    { code: "ECT", name: "Electroconvulsive therapy" },
    { code: "EMDR", name: "Eye Movement Desensitization and Reprocessing therapy" },
    { code: "GT", name: "Group therapy" },
    { code: "IDD", name: "Integrated Mental and Substance Use Disorder treatment" },
    { code: "IPT", name: "Individual psychotherapy" },
    { code: "KIT", name: "Ketamine Infusion Therapy" },
    { code: "TMS", name: "Transcranial Magnetic Stimulation" },
    { code: "TELE", name: "Telemedicine/telehealth therapy" },
    { code: "AIM", name: "Abnormal involuntary movement scale" },
  ],
  Pharmacotherapies: [
    { code: "CHLOR", name: "Chlorpromazine" },
    { code: "DROPE", name: "Droperidol" },
    { code: "FLUPH", name: "Fluphenazine" },
    { code: "HALOP", name: "Haloperidol" },
    { code: "LOXAP", name: "Loxapine" },
    { code: "PERPH", name: "Perphenazine" },
    { code: "PIMOZ", name: "Pimozide" },
    { code: "PROCH", name: "Prochlorperazine" },
    { code: "THIOT", name: "Thiothixene" },
    { code: "THIOR", name: "Thioridazine" },
    { code: "TRIFL", name: "Trifluoperazine" },
    { code: "ARIPI", name: "Aripiprazole" },
    { code: "ASENA", name: "Asenapine" },
    { code: "BREXP", name: "Brexpiprazole" },
    { code: "CARIP", name: "Cariprazine" },
    { code: "CLOZA", name: "Clozapine" },
    { code: "ILOPE", name: "Iloperidone" },
    { code: "LURAS", name: "Lurasidone" },
    { code: "OLANZ", name: "Olanzapine" },
    { code: "OLANZF", name: "Olanzapine/Fluoxetine combination" },
    { code: "PALIP", name: "Paliperidone" },
    { code: "QUETI", name: "Quetiapine" },
    { code: "RISPE", name: "Risperidone" },
    { code: "ZIPRA", name: "Ziprasidone" },
    { code: "NRT", name: "Nicotine replacement" },
    { code: "NSC", name: "Non-nicotine smoking/tobacco cessation" },
    { code: "ANTPYCH", name: "Antipsychotics used in treatment of SMI" },
  ],
  "Emergency Services": [
    { code: "CIT", name: "Crisis intervention team" },
    { code: "PEON", name: "Psychiatric emergency onsite services" },
    { code: "PEOFF", name: "Psychiatric emergency mobile/off-site services" },
    { code: "WI", name: "Psychiatric emergency walk-in services" },
  ],
  "Facility Operation": [
    { code: "DDF", name: "Department of Defense" },
    { code: "LCCG", name: "Local, county, or community government" },
    { code: "IH", name: "Indian Health Services" },
    { code: "PVTP", name: "Private for-profit organization" },
    { code: "PVTN", name: "Private non-profit organization" },
    { code: "STG", name: "State government" },
    { code: "TBG", name: "Tribal government" },
    { code: "FED", name: "Federal Government" },
    { code: "VAMC", name: "U.S. Department of Veterans Affairs" },
  ],
  "Licenses/Certs": [
    { code: "FQHC", name: "Federally Qualified Health Center" },
    { code: "MHC", name: "Mental health clinic or mental health center" },
  ],
  "Payment Accepted": [
    { code: "CLF", name: "County or local government funds" },
    { code: "CMHG", name: "Community Mental Health Block Grants" },
    { code: "CSBG", name: "Community Service Block Grants" },
    { code: "FG", name: "Federal Grants" },
    { code: "ITU", name: "IHS/Tribal/Urban (ITU) funds" },
    { code: "MC", name: "Medicare" },
    { code: "MD", name: "Medicaid" },
    { code: "MI", name: "Federal military insurance (TRICARE)" },
    { code: "OSF", name: "Other State funds" },
    { code: "PI", name: "Private health insurance" },
    { code: "PCF", name: "Private or Community foundation" },
    { code: "SCJJ", name: "State corrections or juvenile justice funds" },
    { code: "SEF", name: "State education agency funds" },
    { code: "SF", name: "Cash or self-payment" },
    { code: "SI", name: "State-financed health insurance plan other than Medicaid" },
    { code: "SMHA", name: "State mental health agency funds" },
    { code: "SWFS", name: "State welfare or child and family services funds" },
    { code: "VAF", name: "U.S. Department of VA funds" },
  ],
  "Payment Assistance": [
    { code: "PA", name: "Payment assistance (check with facility for details)" },
    { code: "SS", name: "Sliding fee scale (fee is based on income and other factors)" },
  ],
  "Special Programs": [
    { code: "TAY", name: "Young adults" },
    { code: "SE", name: "Seniors or older adults" },
    { code: "GL", name: "Lesbian, gay, bisexual, transgender, or queer/questioning (LGBTQ)" },
    { code: "VET", name: "Veterans" },
    { code: "ADM", name: "Active duty military" },
    { code: "MF", name: "Members of military families" },
    { code: "CJ", name: "Criminal justice (other than DUI/DWI)/Forensic clients" },
    { code: "CO", name: "Clients with co-occurring mental and substance use disorders" },
    { code: "HV", name: "Clients with HIV or AIDS" },
    { code: "DV", name: "Clients who have experienced intimate partner violence, domestic violence" },
    { code: "TRMA", name: "Clients who have experienced trauma" },
    { code: "TBI", name: "Persons with traumatic brain injury (TBI)" },
    { code: "ALZ", name: "Persons with Alzheimer's or dementia" },
    { code: "PED", name: "Persons with eating disorders" },
    { code: "PEFP", name: "Persons experiencing first-episode psychosis" },
    { code: "PTSD", name: "Persons with post-traumatic stress disorder (PTSD)" },
    { code: "SED", name: "Children/adolescents with serious emotional disturbance (SED)" },
    { code: "SMI", name: "Persons 18 and older with serious mental illness (SMI)" },
  ],
  "Assessment/Pre-treatment": [{ code: "STU", name: "Screening for tobacco use" }],
  Testing: [
    { code: "HIVT", name: "HIV testing" },
    { code: "STDT", name: "STD testing" },
    { code: "TBS", name: "TB screening" },
    { code: "MST", name: "Metabolic syndrome monitoring" },
    { code: "HBT", name: "Testing for Hepatitis B (HBV)" },
    { code: "HCT", name: "Testing for Hepatitis C (HCV)" },
    { code: "LABT", name: "Laboratory testing" },
  ],
  "Ancillary Services": [
    { code: "HS", name: "Housing services" },
    { code: "PEER", name: "Mentoring/peer support" },
    { code: "TCC", name: "Smoking/vaping/tobacco cessation counseling" },
    { code: "ACT", name: "Assertive community treatment" },
    { code: "AOT", name: "Assisted Outpatient Treatment" },
    { code: "CDM", name: "Chronic disease/illness management" },
    { code: "COOT", name: "Court-ordered outpatient treatment" },
    { code: "DEC", name: "Diet and exercise counseling" },
    { code: "FPSY", name: "Family psychoeducation" },
    { code: "ICM", name: "Intensive case management" },
    { code: "IMR", name: "Illness management and recovery" },
    { code: "LAD", name: "Legal advocacy" },
    { code: "PRS", name: "Psychosocial rehabilitation services" },
    { code: "SEMP", name: "Supported employment" },
    { code: "SH", name: "Supported housing" },
    { code: "TPC", name: "Therapeutic foster care" },
    { code: "VRS", name: "Vocational rehabilitation services" },
    { code: "CM", name: "Case management service" },
    { code: "IPC", name: "Integrated primary care services" },
    { code: "SPS", name: "Suicide prevention services" },
    { code: "ES", name: "Education services" },
  ],
  "Age Groups": [
    { code: "CHLD", name: "Children/Adolescents" },
    { code: "YAD", name: "Young Adults" },
    { code: "ADLT", name: "Adults" },
    { code: "SNR", name: "Seniors" },
  ],
  "Language Services": [
    { code: "SP", name: "Spanish" },
    { code: "AH", name: "Sign language services for the deaf and hard of hearing" },
    { code: "NX", name: "American Indian or Alaska Native languages" },
    { code: "FX", name: "Other languages (excluding Spanish)" },
  ],
  "Facility Smoking Policy": [
    { code: "SMON", name: "Smoking not permitted" },
    { code: "SMOP", name: "Smoking permitted without restriction" },
    { code: "SMPD", name: "Smoking permitted in designated area" },
  ],
};

const substanceAbuseData = {
  "Type of Care": [
    { code: "SA", name: "Substance use treatment" },
    { code: "DT", name: "Detoxification" },
    { code: "HH", name: "Transitional housing, halfway house, or sober home" },
    { code: "SUMH", name: "Treatment for co-occurring substance use plus serious mental health illness" },
  ],
  "Service Setting": [
    { code: "HI", name: "Hospital inpatient/24-hour hospital inpatient" },
    { code: "OP", name: "Outpatient" },
    { code: "RES", name: "Residential/24-hour residential" },
    { code: "HID", name: "Hospital inpatient detoxification" },
    { code: "HIT", name: "Hospital inpatient treatment" },
    { code: "OD", name: "Outpatient detoxification" },
    { code: "ODT", name: "Outpatient day treatment or partial hospitalization" },
    { code: "OIT", name: "Intensive outpatient treatment" },
    { code: "OMB", name: "Outpatient methadone/buprenorphine or naltrexone treatment" },
    { code: "ORT", name: "Regular outpatient treatment" },
    { code: "RD", name: "Residential detoxification" },
    { code: "RL", name: "Long-term residential" },
    { code: "RS", name: "Short-term residential" },
  ],
  // ... (Include other substance abuse categories as needed)
};

export function SearchInterface() {
  const [step, setStep] = useState<"directory" | "search">("directory");
  const [directory, setDirectory] = useState<"mental" | "substance" | null>(null);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAllFilters, setShowAllFilters] = useState(false);
  const [state, setState] = useState("AZ");
  const [results, setResults] = useState<Facility[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const resultsPerPage = 10;

  // Combine data sources based on directory selection
  const categoriesForDisplay = directory === "mental" ? mentalHealthFilters : substanceAbuseFilters;

  const toggleFilter = (code: string) => {
    setSelectedFilters((prev) =>
      prev.includes(code) ? prev.filter((f) => f !== code) : [...prev, code]
    );
  };

  const removeFilter = (code: string) => {
    setSelectedFilters((prev) => prev.filter((f) => f !== code));
  };

  const getServiceInfo = (code: string): { code: string; name: string; category: string; color: string } => {
    const serviceInfo = getServiceInfoFromLib(code, directory);
    if (serviceInfo) return serviceInfo;
    return { code, name: code, category: "Unknown", color: "bg-gray-50 text-gray-700 border-gray-200" };
  };

  const handleSearch = async () => {
    setHasSearched(true);
    setCurrentPage(1);
    setIsLoading(true);
    setError(null);

    try {
      const result = await searchFacilities({
        state,
        searchQuery: searchQuery || undefined,
        services: selectedFilters.length > 0 ? selectedFilters : undefined,
        limit: resultsPerPage,
        offset: 0,
      });

      setResults(result.facilities);
      setTotalResults(result.total);
    } catch (err) {
      console.error("Error searching facilities:", err);
      setError("Failed to search facilities. Please try again.");
      setResults([]);
      setTotalResults(0);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch results when page changes
  useEffect(() => {
    if (!hasSearched) return;

    const fetchPage = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await searchFacilities({
          state,
          searchQuery: searchQuery || undefined,
          services: selectedFilters.length > 0 ? selectedFilters : undefined,
          limit: resultsPerPage,
          offset: (currentPage - 1) * resultsPerPage,
        });

        setResults(result.facilities);
        setTotalResults(result.total);
      } catch (err) {
        console.error("Error fetching page:", err);
        setError("Failed to load results. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPage();
  }, [currentPage]);

  const resetFilters = () => {
    setSelectedFilters([]);
    setSearchQuery("");
    setCurrentPage(1);
    setResults([]);
    setTotalResults(0);
    setHasSearched(false);
  };

  if (step === "directory") {
    return (
      <div className="min-h-[80vh] flex flex-col justify-center py-24">
        <div className="text-center mb-20">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Choose a Directory</h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            Select the type of services you are looking for to begin your search
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto w-full px-8">
          <button
            type="button"
            onClick={() => {
              setDirectory("mental");
              setStep("search");
            }}
            className="bg-white border-2 border-gray-200 rounded-3xl p-12 text-left hover:border-primary hover:shadow-2xl transition-all duration-300 group"
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
          </button>

          <button
            type="button"
            onClick={() => {
              setDirectory("substance");
              setStep("search");
            }}
            className="bg-white border-2 border-gray-200 rounded-3xl p-12 text-left hover:border-primary hover:shadow-2xl transition-all duration-300 group"
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
          </button>
        </div>
      </div>
    );
  }

  const categoryEntries = Object.entries(categoriesForDisplay);
  const visibleCategories = showAllFilters ? categoryEntries : categoryEntries.slice(0, 4);

  const totalPages = Math.ceil(totalResults / resultsPerPage);
  const startIndex = (currentPage - 1) * resultsPerPage;

  return (
    <div className="max-w-6xl mx-auto px-8 lg:px-12">
      {/* Back Button */}
      <button
        type="button"
        onClick={() => {
          setStep("directory");
          setDirectory(null);
          setSelectedFilters([]);
          setHasSearched(false);
          setCurrentPage(1);
        }}
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="text-sm font-medium">Back to Directory Selection</span>
      </button>

      {/* Header */}
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          {directory === "mental"
            ? "National Directory of Mental Health Services"
            : "National Directory of Substance Abuse and Alcohol Treatment"}
        </h1>
        <p className="text-gray-600 text-lg">Search verified treatment facilities in your area</p>
      </div>

      {/* Search Card */}
      <div className="bg-white border border-gray-200 rounded-3xl p-10 mb-12 shadow-sm">
        {/* Basic Filters Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
          <div className="lg:col-span-3">
            <label className="block text-sm font-semibold text-gray-700 mb-3">State</label>
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all"
            >
              <option value="AZ">Arizona</option>
              <option value="CA">California</option>
              <option value="NV">Nevada</option>
              <option value="NM">New Mexico</option>
              <option value="TX">Texas</option>
            </select>
          </div>
          <div className="lg:col-span-9">
            <label className="block text-sm font-semibold text-gray-700 mb-3">Name or City</label>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by facility name or city..."
                className="w-full h-12 pl-12 pr-4 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all"
              />
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="border-t border-gray-100 pt-10">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Filter className="h-5 w-5 text-primary" />
              <span className="text-sm font-semibold text-gray-900">Filter by Category & Services</span>
            </div>
            {categoryEntries.length > 4 && (
              <button
                type="button"
                onClick={() => setShowAllFilters(!showAllFilters)}
                className="text-sm text-primary font-medium hover:underline"
              >
                {showAllFilters ? "Show less" : `Show all ${categoryEntries.length} categories`}
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {visibleCategories.map(([categoryName, services]) => (
              <div key={categoryName}>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  {categoryName}
                </label>
                <MultiSelectDropdown
                  label={categoryName}
                  options={services}
                  selected={selectedFilters}
                  onToggle={toggleFilter}
                  categoryColor={CATEGORY_COLORS[categoryName] || "bg-gray-50 text-gray-700 border-gray-200"}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Selected Filters */}
        {selectedFilters.length > 0 && (
          <div className="border-t border-gray-100 pt-8 mt-10">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Active Filters</p>
            <div className="flex flex-wrap gap-3">
              {selectedFilters.map((code) => {
                const info = getServiceInfo(code);
                return (
                  <span
                    key={code}
                    className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full border ${info.color}`}
                  >
                    <span className="font-semibold">{info.name}</span>
                    <span className="opacity-60">·</span>
                    <span className="opacity-70 text-xs">{info.category}</span>
                    <button
                      type="button"
                      onClick={() => removeFilter(code)}
                      className="ml-1 hover:opacity-70 transition-opacity"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="border-t border-gray-100 pt-8 mt-10 flex items-center justify-between">
          <p className="text-sm text-gray-500">Data sourced from SAMHSA Treatment Locator</p>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={resetFilters}
              className="text-sm text-gray-600 font-medium hover:text-gray-900 transition-colors"
            >
              Reset filters
            </button>
            <button
              type="button"
              onClick={handleSearch}
              className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors shadow-sm"
            >
              <Search className="h-4 w-4" />
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      {hasSearched && (
        <div className="mb-16">
          {isLoading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-3 text-gray-600">Searching facilities...</span>
            </div>
          )}

          {error && !isLoading && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
              <p className="text-red-700">{error}</p>
              <Button onClick={handleSearch} className="mt-4">
                Try Again
              </Button>
            </div>
          )}

          {!isLoading && !error && (
            <>
              <p className="text-gray-600 mb-10 text-lg">
                Found <span className="font-bold text-gray-900">{totalResults}</span> results
                {totalResults > resultsPerPage && (
                  <span className="text-gray-500">
                    {" "}
                    (showing {startIndex + 1}-{Math.min(startIndex + resultsPerPage, totalResults)})
                  </span>
                )}
              </p>
              {results.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No facilities found matching your criteria.</p>
                  <p className="text-gray-400 mt-2">Try adjusting your filters or search query.</p>
                </div>
              )}
              <div className="flex flex-col gap-6">
                {results.map((result) => (
                  <ResultCard key={result.id} result={result} getServiceInfo={getServiceInfo} />
                ))}
              </div>
            </>
          )}

          {totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 text-sm font-medium rounded-lg transition-colors ${
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
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!hasSearched && (
        <div className="text-center py-24">
          <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-8">
            <Search className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">Ready to search</h3>
          <p className="text-gray-600 max-w-lg mx-auto text-lg">
            Use the filters above to find treatment facilities that match your criteria, then click Search to view
            results.
          </p>
        </div>
      )}
    </div>
  );
}
