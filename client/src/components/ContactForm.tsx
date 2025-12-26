import { useState, useEffect, useRef } from "react";
import { Send, CheckCircle, Mail, Building, Loader2, Search, ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import hyungsungImage from "@/assets/hyunsung-oh.jpg";
import { mentalHealthFilters, substanceAbuseFilters } from "@/lib/filter-data";

const STATE_OPTIONS = [
  { value: "AL", label: "Alabama" },
  { value: "AK", label: "Alaska" },
  { value: "AZ", label: "Arizona" },
  { value: "AR", label: "Arkansas" },
  { value: "CA", label: "California" },
  { value: "CO", label: "Colorado" },
  { value: "CT", label: "Connecticut" },
  { value: "DE", label: "Delaware" },
  { value: "FL", label: "Florida" },
  { value: "GA", label: "Georgia" },
  { value: "HI", label: "Hawaii" },
  { value: "ID", label: "Idaho" },
  { value: "IL", label: "Illinois" },
  { value: "IN", label: "Indiana" },
  { value: "IA", label: "Iowa" },
  { value: "KS", label: "Kansas" },
  { value: "KY", label: "Kentucky" },
  { value: "LA", label: "Louisiana" },
  { value: "ME", label: "Maine" },
  { value: "MD", label: "Maryland" },
  { value: "MA", label: "Massachusetts" },
  { value: "MI", label: "Michigan" },
  { value: "MN", label: "Minnesota" },
  { value: "MS", label: "Mississippi" },
  { value: "MO", label: "Missouri" },
  { value: "MT", label: "Montana" },
  { value: "NE", label: "Nebraska" },
  { value: "NV", label: "Nevada" },
  { value: "NH", label: "New Hampshire" },
  { value: "NJ", label: "New Jersey" },
  { value: "NM", label: "New Mexico" },
  { value: "NY", label: "New York" },
  { value: "NC", label: "North Carolina" },
  { value: "ND", label: "North Dakota" },
  { value: "OH", label: "Ohio" },
  { value: "OK", label: "Oklahoma" },
  { value: "OR", label: "Oregon" },
  { value: "PA", label: "Pennsylvania" },
  { value: "RI", label: "Rhode Island" },
  { value: "SC", label: "South Carolina" },
  { value: "SD", label: "South Dakota" },
  { value: "TN", label: "Tennessee" },
  { value: "TX", label: "Texas" },
  { value: "UT", label: "Utah" },
  { value: "VT", label: "Vermont" },
  { value: "VA", label: "Virginia" },
  { value: "WA", label: "Washington" },
  { value: "WV", label: "West Virginia" },
  { value: "WI", label: "Wisconsin" },
  { value: "WY", label: "Wyoming" },
  { value: "DC", label: "District of Columbia" },
];

interface Clinic {
  id: number;
  name: string;
  city: string;
  services: string[];
}

function getServiceInfo(code: string, directoryType: string): { code: string; name: string; category: string } {
  const filters = directoryType === "mental" ? mentalHealthFilters : substanceAbuseFilters;
  for (const [category, options] of Object.entries(filters)) {
    const found = options.find(opt => opt.code === code);
    if (found) {
      return { code, name: found.name, category };
    }
  }
  return { code, name: code, category: "Unknown" };
}

function SearchableDropdown({
  options,
  value,
  onChange,
  placeholder,
  renderOption,
  filterFn,
  loading = false,
  testId,
}: {
  options: any[];
  value: any;
  onChange: (value: any) => void;
  placeholder: string;
  renderOption: (option: any) => string;
  filterFn?: (option: any, search: string) => boolean;
  loading?: boolean;
  testId?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = searchTerm && filterFn
    ? options.filter(opt => filterFn(opt, searchTerm))
    : options;

  const displayValue = value ? renderOption(value) : "";

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
          }
        }}
        className="w-full text-left px-4 py-3 rounded-lg border border-gray-200 bg-white hover:border-gray-300 transition-all duration-200 flex items-center justify-between"
        data-testid={testId}
      >
        <span className={`text-sm ${value ? "text-gray-900" : "text-gray-500"}`}>
          {displayValue || placeholder}
        </span>
        <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg py-2 max-h-64 overflow-auto">
          {filterFn && (
            <div className="px-3 pb-2 border-b border-gray-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  ref={inputRef}
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Type to search..."
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  data-testid={`${testId}-search`}
                />
              </div>
            </div>
          )}
          
          {loading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
              <span className="ml-2 text-sm text-gray-500">Loading...</span>
            </div>
          ) : filteredOptions.length === 0 ? (
            <div className="py-4 text-center text-sm text-gray-500">
              No options found
            </div>
          ) : (
            filteredOptions.map((option, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                  setSearchTerm("");
                }}
                className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors"
              >
                {renderOption(option)}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

interface SelectedFilter {
  code: string;
  name: string;
  category: string;
}

export function ContactForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [loadingClinics, setLoadingClinics] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    directoryType: "" as "" | "mental" | "substance",
    state: "",
    clinic: null as Clinic | null,
    selectedFilters: [] as SelectedFilter[],
    message: "",
  });
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  useEffect(() => {
    if (formData.state && formData.directoryType) {
      const fetchClinics = async () => {
        setLoadingClinics(true);
        try {
          const response = await fetch(
            `/api/clinics?state=${formData.state}&directory=${formData.directoryType}`
          );
          const data = await response.json();
          setClinics(data.clinics || []);
        } catch (err) {
          console.error("Error fetching clinics:", err);
          setClinics([]);
        } finally {
          setLoadingClinics(false);
        }
      };
      fetchClinics();
    } else {
      setClinics([]);
    }
  }, [formData.state, formData.directoryType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const directoryLabel = formData.directoryType === "mental" ? "Mental Health Services" : "Substance Abuse Treatment";
      const stateLabel = STATE_OPTIONS.find(s => s.value === formData.state)?.label || formData.state;
      
      const filtersByCategory = formData.selectedFilters.reduce((acc, filter) => {
        if (!acc[filter.category]) acc[filter.category] = [];
        acc[filter.category].push(filter.name);
        return acc;
      }, {} as Record<string, string[]>);
      
      const filtersText = Object.entries(filtersByCategory)
        .map(([category, names]) => `${category}: ${names.join(", ")}`)
        .join("\n");

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          category: "service_feedback",
          agencyName: formData.clinic?.name || "",
          message: `Directory Type: ${directoryLabel}\nState: ${stateLabel}\nClinic: ${formData.clinic?.name || "Not specified"} (${formData.clinic?.city || "N/A"})\n\nSelected Service Filters:\n${filtersText || "None selected"}\n\nMessage:\n${formData.message}`,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to send feedback");
      }

      setIsSubmitted(true);
    } catch (err) {
      console.error("Error submitting feedback:", err);
      setError(err instanceof Error ? err.message : "Failed to send feedback. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setIsSubmitted(false);
    setFormData({
      name: "",
      email: "",
      directoryType: "",
      state: "",
      clinic: null,
      selectedFilters: [],
      message: "",
    });
    setSelectedCategory("");
    setClinics([]);
  };

  const currentFilters = formData.directoryType === "mental" ? mentalHealthFilters : substanceAbuseFilters;
  const categories = Object.keys(currentFilters).sort();
  const categoryOptions = selectedCategory ? currentFilters[selectedCategory] || [] : [];

  const addFilter = (option: { code: string; name: string }) => {
    const exists = formData.selectedFilters.some(f => f.code === option.code);
    if (!exists) {
      setFormData({
        ...formData,
        selectedFilters: [...formData.selectedFilters, { ...option, category: selectedCategory }],
      });
    }
  };

  const removeFilter = (code: string) => {
    setFormData({
      ...formData,
      selectedFilters: formData.selectedFilters.filter(f => f.code !== code),
    });
  };

  if (isSubmitted) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-accent/20">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="mb-2 text-xl font-semibold text-foreground">Feedback Submitted</h2>
          <p className="mb-6 text-muted-foreground">Thank you for your feedback. We'll review it shortly.</p>
          <Button variant="outline" onClick={resetForm} data-testid="button-submit-another">
            Submit Another
          </Button>
        </div>
      </div>
    );
  }

  const clinicServices = formData.clinic?.services || [];
  const serviceOptions = clinicServices.map(code => getServiceInfo(code, formData.directoryType));

  return (
    <div className="min-h-screen bg-gradient-to-b from-accent/30 to-background">
      <div className="bg-white border-b border-border/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl font-bold text-foreground">Provide Feedback</h1>
          <p className="mt-1 text-muted-foreground">Help us improve our facility directory by reporting issues or updates</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <div className="rounded-xl bg-white p-8 border border-border/60 shadow-sm">
            <h2 className="mb-6 text-lg font-semibold text-foreground">Submit Facility Feedback</h2>

            {error && (
              <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <Label htmlFor="name">Your Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your name"
                    className="mt-1.5 h-11"
                    required
                    data-testid="input-name"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="your@email.com"
                    className="mt-1.5 h-11"
                    required
                    data-testid="input-email"
                  />
                </div>
              </div>

              <div className="border-t border-gray-100 pt-6">
                <p className="text-sm font-semibold text-gray-700 mb-4">Select Facility</p>
                
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <Label>Directory Type</Label>
                    <div className="mt-1.5">
                      <SearchableDropdown
                        options={[
                          { value: "mental", label: "Mental Health Services" },
                          { value: "substance", label: "Substance Abuse Treatment" },
                        ]}
                        value={formData.directoryType ? { value: formData.directoryType, label: formData.directoryType === "mental" ? "Mental Health Services" : "Substance Abuse Treatment" } : null}
                        onChange={(opt) => { setFormData({ ...formData, directoryType: opt.value, state: "", clinic: null, selectedFilters: [] }); setSelectedCategory(""); }}
                        placeholder="Select directory type..."
                        renderOption={(opt) => opt.label}
                        testId="select-directory-type"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>State</Label>
                    <div className="mt-1.5">
                      <SearchableDropdown
                        options={STATE_OPTIONS}
                        value={formData.state ? STATE_OPTIONS.find(s => s.value === formData.state) : null}
                        onChange={(opt) => { setFormData({ ...formData, state: opt.value, clinic: null, selectedFilters: [] }); setSelectedCategory(""); }}
                        placeholder={formData.directoryType ? "Select state..." : "Select directory type first"}
                        renderOption={(opt) => opt.label}
                        filterFn={(opt, search) => opt.label.toLowerCase().includes(search.toLowerCase())}
                        testId="select-state"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-5">
                  <Label>Clinic/Facility</Label>
                  <div className="mt-1.5">
                    <SearchableDropdown
                      options={clinics}
                      value={formData.clinic}
                      onChange={(clinic) => {
                        setFormData({ ...formData, clinic, selectedFilters: [] });
                        if (categories.length > 0) setSelectedCategory(categories[0]);
                      }}
                      placeholder={formData.state ? (loadingClinics ? "Loading clinics..." : "Search for a clinic...") : "Select state first"}
                      renderOption={(clinic: Clinic) => `${clinic.name} - ${clinic.city}`}
                      filterFn={(clinic: Clinic, search) =>
                        clinic.name.toLowerCase().includes(search.toLowerCase()) ||
                        clinic.city.toLowerCase().includes(search.toLowerCase())
                      }
                      loading={loadingClinics}
                      testId="select-clinic"
                    />
                  </div>
                </div>
              </div>

              {formData.clinic && (
                <div className="border-t border-gray-100 pt-6">
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{formData.clinic.name}</p>
                        <p className="text-sm text-gray-500">{formData.clinic.city}, {formData.state}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => { setFormData({ ...formData, clinic: null, selectedFilters: [] }); setSelectedCategory(""); }}
                        className="text-gray-400 hover:text-gray-600"
                        data-testid="button-clear-clinic"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    {serviceOptions.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Available Services</p>
                        <div className="flex flex-wrap gap-1.5">
                          {serviceOptions.slice(0, 8).map((service) => (
                            <span
                              key={service.code}
                              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary"
                            >
                              {service.name}
                            </span>
                          ))}
                          {serviceOptions.length > 8 && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                              +{serviceOptions.length - 8} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <Label>Select Service Filters to Report Issues</Label>
                    <p className="text-sm text-gray-500">Choose the categories and services you'd like to report issues about</p>
                    
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <Label className="text-xs text-gray-500">Filter Category</Label>
                        <div className="mt-1.5">
                          <SearchableDropdown
                            options={categories.map(c => ({ value: c, label: c }))}
                            value={selectedCategory ? { value: selectedCategory, label: selectedCategory } : null}
                            onChange={(opt) => setSelectedCategory(opt.value)}
                            placeholder="Select a category..."
                            renderOption={(opt) => opt.label}
                            testId="select-filter-category"
                          />
                        </div>
                      </div>

                      <div>
                        <Label className="text-xs text-gray-500">Service Option</Label>
                        <div className="mt-1.5">
                          <SearchableDropdown
                            options={categoryOptions}
                            value={null}
                            onChange={(opt) => addFilter(opt)}
                            placeholder={selectedCategory ? "Select an option to add..." : "Select category first"}
                            renderOption={(opt) => opt.name}
                            filterFn={(opt, search) => opt.name.toLowerCase().includes(search.toLowerCase())}
                            testId="select-filter-option"
                          />
                        </div>
                      </div>
                    </div>

                    {formData.selectedFilters.length > 0 && (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Selected Filters</p>
                        <div className="flex flex-wrap gap-2">
                          {formData.selectedFilters.map((filter) => (
                            <span
                              key={filter.code}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-primary/10 text-primary border border-primary/20"
                            >
                              <span>{filter.name}</span>
                              <span className="text-xs text-primary/60">· {filter.category}</span>
                              <button
                                type="button"
                                onClick={() => removeFilter(filter.code)}
                                className="ml-1 hover:bg-primary/20 rounded-full p-0.5"
                                data-testid={`remove-filter-${filter.code}`}
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="border-t border-gray-100 pt-6">
                <Label htmlFor="message">Detailed Description</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Please describe the issue or update in detail. Include any specific information that would help us verify and correct the data..."
                  className="mt-1.5 min-h-[140px]"
                  required
                  data-testid="input-message"
                />
              </div>

              <Button
                type="submit"
                className="h-11 px-8 inline-flex items-center justify-center gap-2"
                disabled={isSubmitting || !formData.clinic || formData.selectedFilters.length === 0}
                data-testid="button-submit-feedback"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>Submit Feedback</span>
                  </>
                )}
              </Button>
            </form>
          </div>

          <div className="space-y-6">
            <div className="rounded-xl bg-white p-6 border border-border/60 shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={hyungsungImage}
                  alt="Dr. Hyunsung Oh"
                  className="w-16 h-16 rounded-full object-cover border-2 border-primary"
                />
                <div>
                  <p className="font-semibold text-foreground">Dr. Hyunsung Oh</p>
                  <p className="text-sm text-muted-foreground">Principal Investigator</p>
                </div>
              </div>
              <div className="space-y-3 text-sm border-t border-border/50 pt-4">
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
              <h3 className="mb-2 font-semibold text-foreground">How This Works</h3>
              <ol className="text-sm leading-relaxed text-muted-foreground space-y-2 list-decimal list-inside">
                <li>Select the directory type (Mental Health or Substance Abuse)</li>
                <li>Choose the state where the facility is located</li>
                <li>Search for and select the specific clinic</li>
                <li>Select filter categories and service options to report issues about</li>
                <li>Add a detailed description of the issue</li>
              </ol>
            </div>

            <div className="rounded-xl bg-amber-50 p-6 border border-amber-100">
              <h3 className="mb-2 font-semibold text-amber-800">Data Quality</h3>
              <p className="text-sm leading-relaxed text-amber-700">
                Your feedback helps maintain accurate, up-to-date information about community resources. All submissions are reviewed by our research team.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
