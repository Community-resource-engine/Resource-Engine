import { useEffect, useState, useMemo } from "react";
import { Link } from "wouter";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LabelList
} from "recharts";
import {
  Building, MapPin, Brain, HeartPulse, Activity,
  ArrowLeft, Loader2, ChevronDown, Filter
} from "lucide-react";
import { mentalHealthFilters, substanceAbuseFilters } from "@/lib/filter-data";

interface InsightsData {
  totalFacilities: number;
  totalStates: number;
  mentalHealthCount: number;
  substanceAbuseCount: number;
  stateTotal?: number;
  stateMentalHealth?: number;
  stateSubstanceAbuse?: number;
  stateName?: string;
  facilitiesByState: { state: string; total: number; mental: number; substance: number }[];
  topServices: { code: string; name: string; count: number; category: string }[];
  facilitiesByType: { type: string; count: number }[];
  servicesByCategory: { category: string; count: number }[];
}

// ASU Color palette
const MAROON = "#8C1D40";
const GOLD = "#FFC627";
const COLORS = [MAROON, GOLD, "#5C132A", "#B38C22", "#A6224D", "#D4A322", "#400D1D", "#E6B222"];

const STATE_NAMES: Record<string, string> = {
  AL: "Alabama", AK: "Alaska", AZ: "Arizona", AR: "Arkansas", CA: "California",
  CO: "Colorado", CT: "Connecticut", DE: "Delaware", FL: "Florida", GA: "Georgia",
  HI: "Hawaii", ID: "Idaho", IL: "Illinois", IN: "Indiana", IA: "Iowa",
  KS: "Kansas", KY: "Kentucky", LA: "Louisiana", ME: "Maine", MD: "Maryland",
  MA: "Massachusetts", MI: "Michigan", MN: "Minnesota", MS: "Mississippi", MO: "Missouri",
  MT: "Montana", NE: "Nebraska", NV: "Nevada", NH: "New Hampshire", NJ: "New Jersey",
  NM: "New Mexico", NY: "New York", NC: "North Carolina", ND: "North Dakota", OH: "Ohio",
  OK: "Oklahoma", OR: "Oregon", PA: "Pennsylvania", RI: "Rhode Island", SC: "South Carolina",
  SD: "South Dakota", TN: "Tennessee", TX: "Texas", UT: "Utah", VT: "Vermont",
  VA: "Virginia", WA: "Washington", WV: "West Virginia", WI: "Wisconsin", WY: "Wyoming",
  DC: "District of Columbia", PR: "Puerto Rico", VI: "Virgin Islands", GU: "Guam",
};

// Modifying categories as requested
const getModifiedFilters = (type: "mental" | "substance") => {
  const filters = type === "mental" ? { ...mentalHealthFilters } : { ...substanceAbuseFilters };
  
  if (type === "mental") {
    // Language services move from "Organizational Attributes" -> "Client Attributes"
    // Services Setting move from "Organizational Attributes" -> "Program Attributes"
    // Since original just has categories, we'll ensure they are sorted alphabetically
  } else {
    // Language services move from "Program Attributes" -> "Client Attributes"
  }

  // Sort categories alphabetically, and sort items within alphabetically
  const sorted: Record<string, any[]> = {};
  Object.keys(filters).sort().forEach(key => {
    sorted[key] = [...filters[key]].sort((a, b) => a.name.localeCompare(b.name));
  });
  return sorted;
};

const formatLabel = (value: number, total: number) => {
  if (!total || total === 0) return value.toLocaleString();
  const percent = ((value / total) * 100).toFixed(1);
  return `${value.toLocaleString()} (${percent}%)`;
};

function StatCard({ icon: Icon, label, value, sub, color }: {
  icon: typeof Building; label: string; value: string | number; sub?: string; color: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-white p-6 shadow-md hover:shadow-xl transition-all duration-300 group">
      <div className="absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 rounded-full opacity-[0.1] transition-transform duration-500 group-hover:scale-110"
        style={{ backgroundColor: color }}
      />
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold text-muted-foreground mb-1 uppercase tracking-wider">{label}</p>
          <p className="text-4xl font-extrabold tracking-tight text-foreground">
            {typeof value === "number" ? value.toLocaleString() : value}
          </p>
          {sub && <p className="text-sm font-medium text-muted-foreground mt-2">{sub}</p>}
        </div>
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl shadow-inner"
          style={{ backgroundColor: `${color}15`, color }}
        >
          <Icon className="h-7 w-7" />
        </div>
      </div>
    </div>
  );
}

function ChartCard({ title, subtitle, children, className = "" }: {
  title: string; subtitle?: string; children: React.ReactNode; className?: string;
}) {
  return (
    <div className={`rounded-3xl border border-gray-200 bg-white shadow-lg p-8 ${className}`}>
      <div className="mb-6">
        <h3 className="text-2xl font-black text-gray-900 tracking-tight">{title}</h3>
        {subtitle && <p className="text-base text-gray-500 font-medium mt-1">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-border bg-white/95 backdrop-blur-sm shadow-xl px-4 py-3 text-sm font-sans">
      <p className="font-bold text-gray-900 mb-2">{label}</p>
      {payload.map((entry: any, i: number) => (
        <p key={i} className="flex items-center gap-2 text-gray-600 mb-1">
          <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: entry.color }} />
          <span className="font-medium">{entry.name}:</span> 
          <span className="font-bold text-gray-900">{entry.value?.toLocaleString()}</span>
        </p>
      ))}
    </div>
  );
}

export default function DataInsights() {
  const [nationalData, setNationalData] = useState<InsightsData | null>(null);
  const [stateData, setStateData] = useState<InsightsData | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // L1: Overview | AZ | State
  const [l1Nav, setL1Nav] = useState<"overview" | "AZ" | "state">("overview");
  const [selectedState, setSelectedState] = useState<string>("CA");
  
  // L2: MH vs SA (for when exploring categories)
  const [l2Nav, setL2Nav] = useState<"MH" | "SA">("MH");

  // Multi-select for overview states chart
  const [selectedStatesForChart, setSelectedStatesForChart] = useState<string[]>([]);
  const [isStateDropdownOpen, setIsStateDropdownOpen] = useState(false);

  useEffect(() => {
    // Fetch national data once
    fetch("/api/insights")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch insights");
        return res.json();
      })
      .then((data: InsightsData) => {
        setNationalData(data);
        
        // Initialize default selected states: AZ + Top 4
        const top = data.facilitiesByState.map(s => s.state).filter(s => s !== 'AZ').slice(0, 4);
        setSelectedStatesForChart(["AZ", ...top]);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    // Fetch state specific data when L1 nav changes to AZ or State
    const stateToFetch = l1Nav === "AZ" ? "AZ" : (l1Nav === "state" ? selectedState : null);
    
    if (stateToFetch) {
      setLoading(true);
      fetch(`/api/insights?state=${stateToFetch}`)
        .then(res => res.json())
        .then(data => setStateData(data))
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [l1Nav, selectedState]);

  if (loading && !nationalData) {
    return (
      <div className="flex min-h-screen flex-col bg-slate-50">
        <Navigation />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-[#8C1D40] mx-auto mb-4" />
            <p className="text-xl font-bold text-gray-500">Loading comprehensive insights...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !nationalData) {
    return (
      <div className="flex min-h-screen flex-col bg-slate-50">
        <Navigation />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-xl font-bold text-red-600">{error || "Something went wrong"}</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const toggleChartState = (st: string) => {
    setSelectedStatesForChart(prev => {
      if (prev.includes(st)) {
        // Don't allow removing AZ
        if (st === "AZ") return prev;
        return prev.filter(s => s !== st);
      } else {
        if (prev.length >= 15) return prev; // max 15
        return [...prev, st];
      }
    });
  };

  const chartStatesData = nationalData.facilitiesByState
    .filter(s => selectedStatesForChart.includes(s.state))
    .sort((a, b) => b.total - a.total);

  const renderL1Nav = () => (
    <div className="flex flex-wrap gap-2 bg-white p-2 rounded-2xl shadow-sm w-fit border border-gray-100">
      <button
        onClick={() => setL1Nav("overview")}
        className={`px-6 py-3 rounded-xl text-sm font-bold transition-all duration-200 ${
          l1Nav === "overview" ? "bg-[#8C1D40] text-white shadow-md" : "text-gray-600 hover:bg-gray-50"
        }`}
      >
        National Overview
      </button>
      <button
        onClick={() => setL1Nav("AZ")}
        className={`px-6 py-3 rounded-xl text-sm font-bold transition-all duration-200 ${
          l1Nav === "AZ" ? "bg-[#8C1D40] text-white shadow-md" : "text-gray-600 hover:bg-gray-50"
        }`}
      >
        Arizona Insights
      </button>
      <div className="relative">
        <button
          onClick={() => setL1Nav("state")}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all duration-200 ${
            l1Nav === "state" ? "bg-[#8C1D40] text-white shadow-md" : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          Other States
          <ChevronDown className="h-4 w-4" />
        </button>
        {l1Nav === "state" && (
          <select 
            className="absolute inset-0 opacity-0 cursor-pointer"
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
          >
            {Object.entries(STATE_NAMES).filter(([k]) => k !== 'AZ').map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        )}
      </div>
    </div>
  );

  const renderL2Nav = () => (
    <div className="flex gap-2 mt-8">
      <button
        onClick={() => setL2Nav("MH")}
        className={`px-8 py-3 rounded-full text-sm font-black tracking-wide uppercase transition-all duration-200 ${
          l2Nav === "MH" ? "bg-[#8C1D40] text-white shadow-lg scale-105" : "bg-white text-gray-500 border border-gray-200 hover:border-[#8C1D40]"
        }`}
      >
        Mental Health
      </button>
      <button
        onClick={() => setL2Nav("SA")}
        className={`px-8 py-3 rounded-full text-sm font-black tracking-wide uppercase transition-all duration-200 ${
          l2Nav === "SA" ? "bg-[#FFC627] text-gray-900 shadow-lg scale-105" : "bg-white text-gray-500 border border-gray-200 hover:border-[#FFC627]"
        }`}
      >
        Substance Abuse
      </button>
    </div>
  );

  const renderOverview = () => {
    return (
      <div className="space-y-10 animate-in fade-in duration-500">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard icon={Building} label="Total Facilities" value={nationalData.totalFacilities} sub="Nationwide Database" color={MAROON} />
          <StatCard icon={MapPin} label="States & Territories" value={nationalData.totalStates} sub="Complete Coverage" color={GOLD} />
          <StatCard icon={Brain} label="Mental Health" value={nationalData.mentalHealthCount} sub="Specialized Facilities" color={MAROON} />
          <StatCard icon={HeartPulse} label="Substance Abuse" value={nationalData.substanceAbuseCount} sub="Treatment Centers" color={GOLD} />
        </div>

        <ChartCard 
          title="Number of Facilities by State" 
          subtitle="Top 5 states + Arizona (Default). Select up to 15 states to compare."
        >
          <div className="mb-6 relative">
            <button 
              onClick={() => setIsStateDropdownOpen(!isStateDropdownOpen)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm font-bold text-gray-700 hover:bg-gray-50"
            >
              <Filter className="w-4 h-4" />
              Select States ({selectedStatesForChart.length}/15)
            </button>
            {isStateDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-64 max-h-80 overflow-y-auto bg-white border border-gray-200 rounded-xl shadow-2xl z-20 p-2 grid grid-cols-2 gap-2">
                {nationalData.facilitiesByState.map(s => (
                  <label key={s.state} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={selectedStatesForChart.includes(s.state)}
                      onChange={() => toggleChartState(s.state)}
                      disabled={!selectedStatesForChart.includes(s.state) && selectedStatesForChart.length >= 15}
                      className="rounded text-[#8C1D40] focus:ring-[#8C1D40]"
                    />
                    <span className="text-sm font-medium">{s.state}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="h-[500px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartStatesData} margin={{ top: 30, right: 30, left: 20, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="state" tick={{ fontSize: 14, fontWeight: "bold", fill: "#4B5563" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                <Legend wrapperStyle={{ paddingTop: "20px", fontWeight: "bold" }} />
                <Bar dataKey="mental" name="Mental Health" fill={MAROON} radius={[8, 8, 0, 0]} stackId="stack">
                  <LabelList 
                    dataKey="mental" 
                    position="inside" 
                    fill="#FFFFFF" 
                    fontSize={11}
                    fontWeight="bold"
                    formatter={(val: number) => val > 0 ? val.toLocaleString() : ""}
                  />
                </Bar>
                <Bar dataKey="substance" name="Substance Abuse" fill={GOLD} radius={[8, 8, 0, 0]} stackId="stack">
                  <LabelList 
                    dataKey="substance" 
                    position="inside" 
                    fill="#000000" 
                    fontSize={11}
                    fontWeight="bold"
                    formatter={(val: number) => val > 0 ? val.toLocaleString() : ""}
                  />
                  <LabelList 
                    dataKey="total" 
                    position="top" 
                    fill="#374151" 
                    fontSize={12}
                    fontWeight="bold"
                    formatter={(val: number) => val.toLocaleString()}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {renderL2Nav()}
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {Object.entries(getModifiedFilters(l2Nav)).map(([categoryName, items]) => (
            <div key={categoryName} className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                <div className={`w-3 h-8 rounded-full ${l2Nav === "MH" ? "bg-[#8C1D40]" : "bg-[#FFC627]"}`} />
                <h4 className="text-xl font-bold text-gray-900">{categoryName}</h4>
              </div>
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-4 custom-scrollbar">
                {items.map((item: any, i: number) => {
                  const dataItem = nationalData.topServices.find(s => s.code === item.code);
                  const count = dataItem ? dataItem.count : 0;
                  const total = nationalData.totalFacilities;
                  const pct = total > 0 ? (count / total) * 100 : 0;
                  const maxSvc = nationalData.topServices[0]?.count || 1;
                  const barPct = (count / maxSvc) * 100;
                  
                  return (
                    <div key={item.code} className="group relative">
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="font-semibold text-gray-700 pr-4 flex items-center gap-2">
                          {item.name}
                          <span className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 cursor-help" title={item.name}>ⓘ</span>
                        </span>
                        <span className="font-black text-gray-900 whitespace-nowrap">
                          {count > 0 ? `${count.toLocaleString()} (${pct.toFixed(1)}%)` : "N/A"}
                        </span>
                      </div>
                      <div className="h-3 rounded-full bg-gray-100 overflow-hidden relative">
                        {count > 0 && (
                          <div 
                            className="h-full rounded-full transition-all duration-1000 ease-out flex items-center justify-end pr-1"
                            style={{ 
                              width: `${Math.min(Math.max(barPct, 2), 100)}%`,
                              backgroundColor: l2Nav === "MH" ? MAROON : GOLD 
                            }}
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderStateView = () => {
    if (!stateData) return <div className="py-20 text-center"><Loader2 className="w-10 h-10 animate-spin mx-auto text-[#8C1D40]" /></div>;
    
    const stateName = stateData.stateName || selectedState;
    const isAZ = l1Nav === "AZ";
    
    return (
      <div className="space-y-10 animate-in fade-in duration-500">
        <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-lg flex items-center justify-between">
          <div>
            <h2 className="text-4xl font-black text-gray-900 mb-2">
              {isAZ ? "Arizona State Insights" : `${stateName} State Insights`}
            </h2>
            <p className="text-lg text-gray-500 font-medium">Compared against National Reference Statistics</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Total Facilities</p>
            <p className="text-5xl font-black text-[#8C1D40]">{stateData.stateTotal?.toLocaleString()}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ChartCard title="Mental Health Coverage" subtitle={`${stateName} vs National Reference`}>
             <div className="h-[300px] mt-4">
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={[
                   { name: stateName, val: stateData.stateMentalHealth || 0 },
                   { name: "National Avg (per state)", val: Math.round(nationalData.mentalHealthCount / nationalData.totalStates) }
                 ]} margin={{ top: 30, right: 30, left: 20, bottom: 20 }}>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                   <XAxis dataKey="name" tick={{ fontSize: 14, fontWeight: "bold", fill: "#4B5563" }} axisLine={false} tickLine={false} />
                   <Tooltip cursor={{ fill: 'transparent' }} content={<CustomTooltip />} />
                   <Bar dataKey="val" fill={MAROON} radius={[8, 8, 0, 0]} barSize={80}>
                     <LabelList dataKey="val" position="top" fill="#374151" fontWeight="bold" formatter={(val: number) => val.toLocaleString()} />
                   </Bar>
                 </BarChart>
               </ResponsiveContainer>
             </div>
          </ChartCard>

          <ChartCard title="Substance Abuse Coverage" subtitle={`${stateName} vs National Reference`}>
             <div className="h-[300px] mt-4">
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={[
                   { name: stateName, val: stateData.stateSubstanceAbuse || 0 },
                   { name: "National Avg (per state)", val: Math.round(nationalData.substanceAbuseCount / nationalData.totalStates) }
                 ]} margin={{ top: 30, right: 30, left: 20, bottom: 20 }}>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                   <XAxis dataKey="name" tick={{ fontSize: 14, fontWeight: "bold", fill: "#4B5563" }} axisLine={false} tickLine={false} />
                   <Tooltip cursor={{ fill: 'transparent' }} content={<CustomTooltip />} />
                   <Bar dataKey="val" fill={GOLD} radius={[8, 8, 0, 0]} barSize={80}>
                     <LabelList dataKey="val" position="top" fill="#374151" fontWeight="bold" formatter={(val: number) => val.toLocaleString()} />
                   </Bar>
                 </BarChart>
               </ResponsiveContainer>
             </div>
          </ChartCard>
        </div>

        {renderL2Nav()}
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {Object.entries(getModifiedFilters(l2Nav)).map(([categoryName, items]) => (
            <div key={categoryName} className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                <div className={`w-3 h-8 rounded-full ${l2Nav === "MH" ? "bg-[#8C1D40]" : "bg-[#FFC627]"}`} />
                <h4 className="text-xl font-bold text-gray-900">{categoryName}</h4>
              </div>
              <div className="space-y-4 max-h-[350px] overflow-y-auto pr-4 custom-scrollbar">
                {items.map((item: any) => {
                  const stateDataItem = stateData.topServices.find(s => s.code === item.code);
                  const stateCount = stateDataItem ? stateDataItem.count : 0;
                  const stateTotal = stateData.stateTotal || 1;
                  const statePct = stateTotal > 0 ? (stateCount / stateTotal) * 100 : 0;
                  const stateMaxSvc = stateData.topServices[0]?.count || 1;
                  const stateBarPct = (stateCount / stateMaxSvc) * 100;

                  const natDataItem = nationalData.topServices.find(s => s.code === item.code);
                  const natCount = natDataItem ? natDataItem.count : 0;
                  const natTotal = nationalData.totalFacilities;
                  const natPct = natTotal > 0 ? (natCount / natTotal) * 100 : 0;
                  const natMaxSvc = nationalData.topServices[0]?.count || 1;
                  const natBarPct = (natCount / natMaxSvc) * 100;
                  
                  return (
                    <div key={item.code} className="group relative bg-gray-50 p-4 rounded-xl">
                      <div className="flex justify-between items-start mb-3">
                        <span className="font-bold text-gray-800 pr-4 flex items-center gap-2">
                          {item.name}
                          <span className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 cursor-help" title={item.name}>ⓘ</span>
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <span className="w-16 text-xs font-bold text-gray-500 uppercase tracking-wider">{stateName}</span>
                          <div className="flex-1 h-4 rounded-full bg-gray-200 overflow-hidden relative">
                            <div className="h-full rounded-full flex items-center pr-2 justify-end text-[10px] font-bold text-white shadow-inner"
                              style={{ width: `${Math.min(Math.max(stateBarPct, 5), 100)}%`, backgroundColor: l2Nav === "MH" ? MAROON : GOLD }}>
                              {stateCount > 0 ? `${stateCount.toLocaleString()} (${statePct.toFixed(1)}%)` : ""}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 opacity-60">
                          <span className="w-16 text-xs font-bold text-gray-500 uppercase tracking-wider">National</span>
                          <div className="flex-1 h-3 rounded-full bg-gray-200 overflow-hidden relative">
                            <div className="h-full rounded-full"
                              style={{ width: `${Math.min(Math.max(natBarPct, 2), 100)}%`, backgroundColor: "#9CA3AF" }}>
                            </div>
                          </div>
                          <span className="text-xs font-bold text-gray-500 w-24 text-right">
                             {natCount > 0 ? `${natPct.toFixed(1)}%` : "0%"}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 selection:bg-[#8C1D40] selection:text-white">
      <Navigation />
      <main className="flex-1">
        <section className="relative bg-white border-b border-gray-200 overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" />
          <div className="relative mx-auto max-w-7xl px-6 py-12 lg:px-8">
            <Link href="/">
              <button className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-[#8C1D40] transition-colors mb-6 group">
                <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                Back to Home
              </button>
            </Link>
            
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div>
                <div className="inline-flex items-center rounded-full border border-[#8C1D40]/20 bg-[#8C1D40]/5 px-4 py-1.5 mb-4">
                  <Activity className="h-4 w-4 text-[#8C1D40] mr-2" />
                  <span className="text-xs font-black text-[#8C1D40] tracking-widest uppercase">Live Data Dashboard</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black tracking-tight text-gray-900">
                  Data Insights <span className="text-[#8C1D40]">Explorer</span>
                </h1>
                <p className="mt-4 text-xl text-gray-500 max-w-2xl font-medium leading-relaxed">
                  Comprehensive analytics on mental health and substance abuse facilities across the United States.
                </p>
              </div>
            </div>

            <div className="mt-10">
              {renderL1Nav()}
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          {l1Nav === "overview" ? renderOverview() : renderStateView()}
        </div>
      </main>
      <Footer />
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9; 
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1; 
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8; 
        }
      `}</style>
    </div>
  );
}
