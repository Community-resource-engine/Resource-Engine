import { useEffect, useState, useMemo } from "react";
import { Link } from "wouter";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Legend, LabelList,
} from "recharts";
import {
  Building, MapPin, Brain, HeartPulse, Activity,
  ArrowLeft, Loader2, ChevronDown, Filter, Info,
} from "lucide-react";
import { mentalHealthFilters, substanceAbuseFilters } from "@/lib/filter-data";
import {
  groupFiltersByAttribute,
  type AttributeBucket,
  type Directory,
} from "@/lib/insights-grouping";

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

// ASU brand palette
const MAROON = "#8C1D40";
const GOLD = "#FFC627";
const MAROON_SOFT = "#F5E6EC";
const GOLD_SOFT = "#FFF6D6";

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

const L2_TO_DIRECTORY: Record<"MH" | "SA", Directory> = {
  MH: "mental",
  SA: "substance",
};

// ---------- Small presentational components ----------

function StatCard({
  icon: Icon, label, value, sub, accent,
}: {
  icon: typeof Building; label: string; value: string | number; sub?: string; accent: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-lg transition-shadow">
      <div
        className="absolute -top-10 -right-10 w-36 h-36 rounded-full opacity-[0.08]"
        style={{ backgroundColor: accent }}
      />
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{label}</p>
          <p className="text-4xl font-extrabold tracking-tight text-gray-900">
            {typeof value === "number" ? value.toLocaleString() : value}
          </p>
          {sub && <p className="text-sm font-medium text-gray-500 mt-2">{sub}</p>}
        </div>
        <div
          className="flex h-12 w-12 items-center justify-center rounded-2xl shrink-0"
          style={{ backgroundColor: `${accent}15`, color: accent }}
        >
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}

function ChartCard({
  title, subtitle, children, className = "", accent,
}: {
  title: string; subtitle?: string; children: React.ReactNode; className?: string; accent?: string;
}) {
  return (
    <div className={`rounded-2xl border border-gray-200 bg-white shadow-sm p-6 ${className}`}>
      <div className="mb-5 flex items-center gap-3">
        {accent && <div className="w-1.5 h-8 rounded-full" style={{ backgroundColor: accent }} />}
        <div>
          <h3 className="text-xl font-black text-gray-900 tracking-tight">{title}</h3>
          {subtitle && <p className="text-sm text-gray-500 font-medium mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {children}
    </div>
  );
}

function CustomTooltip({ active, payload, label, total }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-gray-200 bg-white/95 backdrop-blur-sm shadow-xl px-4 py-3 text-sm">
      <p className="font-bold text-gray-900 mb-2">{label}</p>
      {payload.map((entry: any, i: number) => {
        const v = entry.value ?? 0;
        const pct = total ? ((v / total) * 100).toFixed(1) : null;
        return (
          <p key={i} className="flex items-center gap-2 text-gray-600 mb-1">
            <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: entry.color }} />
            <span className="font-medium">{entry.name}:</span>
            <span className="font-bold text-gray-900">
              {v.toLocaleString()}
              {pct && <span className="text-gray-500"> ({pct}%)</span>}
            </span>
          </p>
        );
      })}
    </div>
  );
}

// ---------- Helpers ----------

const labelWithPct = (val: number, total: number) => {
  if (!val) return "";
  if (!total) return val.toLocaleString();
  const pct = ((val / total) * 100).toFixed(1);
  return `${val.toLocaleString()} (${pct}%)`;
};

// Bar chart for a single directory (top 5 + AZ default, up to 15)
function StateBreakdownChart({
  data, accent, totalForPct, dataKey,
}: {
  data: { state: string; value: number }[];
  accent: string;
  totalForPct: number;
  dataKey: string;
}) {
  return (
    <div className="h-[340px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 28, right: 16, left: 8, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
          <XAxis
            dataKey="state"
            tick={{ fontSize: 12, fontWeight: 700, fill: "#4B5563" }}
            axisLine={false} tickLine={false}
          />
          <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
          <Tooltip
            content={<CustomTooltip total={totalForPct} />}
            cursor={{ fill: "transparent" }}
          />
          <Bar dataKey="value" name={dataKey} fill={accent} radius={[6, 6, 0, 0]}>
            <LabelList
              dataKey="value"
              position="top"
              fill="#374151"
              fontSize={11}
              fontWeight={700}
              formatter={(v: number) => labelWithPct(v, totalForPct)}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// State multi-selector used by Overview (per directory)
function StatePicker({
  allStates, selected, onToggle, accent,
}: {
  allStates: string[];
  selected: string[];
  onToggle: (s: string) => void;
  accent: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-lg bg-white text-xs font-bold text-gray-700 hover:bg-gray-50"
      >
        <Filter className="w-3.5 h-3.5" />
        States ({selected.length}/15)
        <ChevronDown className="w-3.5 h-3.5" />
      </button>
      {open && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div className="absolute top-full right-0 mt-2 w-72 max-h-80 overflow-y-auto bg-white border border-gray-200 rounded-xl shadow-2xl z-20 p-2 grid grid-cols-2 gap-1">
            {allStates.map((st) => {
              const checked = selected.includes(st);
              const disabled = !checked && selected.length >= 15;
              return (
                <label
                  key={st}
                  className={`flex items-center gap-2 p-1.5 rounded-md ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer hover:bg-gray-50"}`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    disabled={disabled}
                    onChange={() => onToggle(st)}
                    className="rounded"
                    style={{ accentColor: accent }}
                  />
                  <span className="text-xs font-medium" title={STATE_NAMES[st] || st}>
                    {st}
                  </span>
                </label>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

// One filter category card. Renders bars with data labels (count + %).
// `getDescription` is used for the visible (i) info icon tooltip.
function CategoryCard({
  category, items, totalFacilities, topServices, accent, defaultAccent, getDescription,
}: {
  category: string;
  items: { code: string; name: string }[];
  totalFacilities: number;
  topServices: { code: string; count: number }[];
  accent: string;
  defaultAccent: string;
  getDescription: (item: { code: string; name: string }) => string;
}) {
  const maxCount = useMemo(
    () => items.reduce((m, it) => Math.max(m, topServices.find((s) => s.code === it.code)?.count ?? 0), 0) || 1,
    [items, topServices],
  );

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-5">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
        <div className="w-1.5 h-6 rounded-full" style={{ backgroundColor: accent }} />
        <h4 className="text-base font-bold text-gray-900">{category}</h4>
        <span className="ml-auto text-xs font-bold text-gray-400">{items.length}</span>
      </div>
      <div className="space-y-3 max-h-[280px] overflow-y-auto pr-2 custom-scrollbar">
        {items.map((item) => {
          const svc = topServices.find((s) => s.code === item.code);
          const count = svc?.count ?? 0;
          const pct = totalFacilities ? (count / totalFacilities) * 100 : 0;
          const barPct = (count / maxCount) * 100;
          const desc = getDescription(item);
          return (
            <div key={item.code} className="group">
              <div className="flex justify-between items-start text-sm mb-1.5 gap-2">
                <span className="font-semibold text-gray-700 leading-snug flex items-start gap-1.5">
                  <span>{item.name}</span>
                  {desc && (
                    <span
                      className="inline-flex items-center justify-center rounded-full w-4 h-4 text-[10px] font-bold text-white cursor-help shrink-0 mt-0.5"
                      style={{ backgroundColor: defaultAccent }}
                      title={desc}
                      aria-label={`Info: ${desc}`}
                    >
                      i
                    </span>
                  )}
                </span>
                <span className="font-black text-gray-900 whitespace-nowrap text-xs">
                  {count > 0 ? `${count.toLocaleString()} (${pct.toFixed(1)}%)` : "—"}
                </span>
              </div>
              <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                {count > 0 && (
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: `${Math.min(Math.max(barPct, 2), 100)}%`,
                      backgroundColor: accent,
                    }}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ---------- Page ----------

export default function DataInsights() {
  const [nationalData, setNationalData] = useState<InsightsData | null>(null);
  const [stateData, setStateData] = useState<InsightsData | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [l1Nav, setL1Nav] = useState<"overview" | "AZ" | "state">("overview");
  const [selectedState, setSelectedState] = useState<string>("CA");
  const [l2Nav, setL2Nav] = useState<"MH" | "SA">("MH");

  // Independent state pickers per directory (top 5 + AZ default each)
  const [mhStates, setMhStates] = useState<string[]>([]);
  const [saStates, setSaStates] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/insights")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch insights");
        return res.json();
      })
      .then((data: InsightsData) => {
        setNationalData(data);
        // Default selection: AZ + top 4 by directory
        const top = (key: "mental" | "substance") =>
          [...data.facilitiesByState]
            .sort((a, b) => b[key] - a[key])
            .map((s) => s.state)
            .filter((s) => s !== "AZ")
            .slice(0, 4);
        setMhStates(["AZ", ...top("mental")]);
        setSaStates(["AZ", ...top("substance")]);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const stateToFetch = l1Nav === "AZ" ? "AZ" : l1Nav === "state" ? selectedState : null;
    if (!stateToFetch) return;
    setLoading(true);
    fetch(`/api/insights?state=${stateToFetch}`)
      .then((res) => res.json())
      .then((data: InsightsData) => setStateData(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [l1Nav, selectedState]);

  if (loading && !nationalData) {
    return (
      <div className="flex min-h-screen flex-col bg-slate-50">
        <Navigation />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-[#8C1D40] mx-auto mb-4" />
            <p className="text-lg font-bold text-gray-500">Loading insights…</p>
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

  // ---- Derived data ----
  const allStateCodes = nationalData.facilitiesByState.map((s) => s.state);

  const toggleState = (setter: (cb: (prev: string[]) => string[]) => void) => (st: string) => {
    setter((prev) => {
      if (prev.includes(st)) {
        if (st === "AZ") return prev; // keep AZ pinned
        return prev.filter((s) => s !== st);
      }
      if (prev.length >= 15) return prev;
      return [...prev, st];
    });
  };

  const mhChartData = nationalData.facilitiesByState
    .filter((s) => mhStates.includes(s.state))
    .sort((a, b) => b.mental - a.mental)
    .map((s) => ({ state: s.state, value: s.mental }));

  const saChartData = nationalData.facilitiesByState
    .filter((s) => saStates.includes(s.state))
    .sort((a, b) => b.substance - a.substance)
    .map((s) => ({ state: s.state, value: s.substance }));

  // ---- L1 nav bar ----
  const renderL1Nav = () => (
    <div className="flex flex-wrap gap-2 bg-white p-2 rounded-2xl shadow-sm w-fit border border-gray-100">
      <button
        onClick={() => setL1Nav("overview")}
        className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
          l1Nav === "overview" ? "bg-[#8C1D40] text-white shadow-md" : "text-gray-600 hover:bg-gray-50"
        }`}
      >
        National Overview
      </button>
      <button
        onClick={() => setL1Nav("AZ")}
        className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
          l1Nav === "AZ" ? "bg-[#8C1D40] text-white shadow-md" : "text-gray-600 hover:bg-gray-50"
        }`}
      >
        Arizona
      </button>
      <div className="relative">
        <button
          onClick={() => setL1Nav("state")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
            l1Nav === "state" ? "bg-[#8C1D40] text-white shadow-md" : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          {l1Nav === "state" ? STATE_NAMES[selectedState] ?? "State" : "Other States"}
          <ChevronDown className="h-4 w-4" />
        </button>
        <select
          className="absolute inset-0 opacity-0 cursor-pointer w-full"
          value={selectedState}
          onChange={(e) => {
            setSelectedState(e.target.value);
            setL1Nav("state");
          }}
        >
          {Object.entries(STATE_NAMES)
            .filter(([k]) => k !== "AZ")
            .sort((a, b) => a[1].localeCompare(b[1]))
            .map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
        </select>
      </div>
    </div>
  );

  // ---- L2 nav (MH vs SA) for the filter explorer section ----
  const renderL2Nav = () => (
    <div className="flex gap-2">
      <button
        onClick={() => setL2Nav("MH")}
        className={`px-6 py-2.5 rounded-full text-sm font-black tracking-wide uppercase transition-all ${
          l2Nav === "MH" ? "bg-[#8C1D40] text-white shadow-lg scale-105" : "bg-white text-gray-500 border border-gray-200 hover:border-[#8C1D40]"
        }`}
      >
        Mental Health
      </button>
      <button
        onClick={() => setL2Nav("SA")}
        className={`px-6 py-2.5 rounded-full text-sm font-black tracking-wide uppercase transition-all ${
          l2Nav === "SA" ? "bg-[#FFC627] text-gray-900 shadow-lg scale-105" : "bg-white text-gray-500 border border-gray-200 hover:border-[#FFC627]"
        }`}
      >
        Substance Abuse
      </button>
    </div>
  );

  // ---- Filter explorer (Client / Program / Organizational Attributes) ----
  const renderFilterExplorer = (data: InsightsData) => {
    const directory = L2_TO_DIRECTORY[l2Nav];
    const raw = directory === "mental" ? mentalHealthFilters : substanceAbuseFilters;
    const buckets: AttributeBucket[] = groupFiltersByAttribute(raw, directory);
    const accent = l2Nav === "MH" ? MAROON : GOLD;
    const totalForPct = (data.stateTotal ?? data.totalFacilities) || 0;

    // Description for the (i) tooltip. For SA the sheet specifically asks for
    // info descriptions on every entity; we expose the full descriptive name
    // (which often spells out the code) plus the code itself, for both pages.
    const getDescription = (item: { code: string; name: string }) =>
      `${item.name} (code: ${item.code})`;

    return (
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-2xl font-black text-gray-900">Filter Explorer</h3>
            <p className="text-sm text-gray-500 font-medium mt-1">
              Grouped under Client / Program / Organizational Attributes, sorted alphabetically.
            </p>
          </div>
          {renderL2Nav()}
        </div>

        {buckets.map((bucket) => (
          <section key={bucket.group}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1.5 h-7 rounded-full" style={{ backgroundColor: accent }} />
              <h4 className="text-xl font-black text-gray-900 tracking-tight">{bucket.group}</h4>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                {bucket.categories.length} categories
              </span>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {bucket.categories.map((c) => (
                <CategoryCard
                  key={c.category}
                  category={c.category}
                  items={c.items}
                  totalFacilities={totalForPct}
                  topServices={data.topServices}
                  accent={accent}
                  defaultAccent={accent === MAROON ? "#8C1D40" : "#B38C22"}
                  getDescription={getDescription}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    );
  };

  // ---- Overview (national) ----
  const renderOverview = () => (
    <div className="space-y-10 animate-in fade-in duration-500">
      {/* Top summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard icon={Building} label="Agencies in Database" value={nationalData.totalFacilities} sub="Nationwide" accent={MAROON} />
        <StatCard icon={MapPin} label="States & Territories" value={nationalData.totalStates} sub="Coverage" accent="#3B5BDB" />
        <StatCard icon={Brain} label="Mental Health" value={nationalData.mentalHealthCount} sub="Agencies providing MH" accent={MAROON} />
        <StatCard icon={HeartPulse} label="Substance Abuse" value={nationalData.substanceAbuseCount} sub="Agencies providing SA" accent={GOLD} />
      </div>

      {/* MH-left / SA-right (responsive: stacks MH-first on mobile) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* MENTAL HEALTH column */}
        <div className="rounded-3xl border-2 p-6 lg:p-7 shadow-sm" style={{ borderColor: MAROON_SOFT, backgroundColor: "#FFFFFF" }}>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl" style={{ backgroundColor: MAROON_SOFT, color: MAROON }}>
                <Brain className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Mental Health</p>
                <p className="text-3xl font-extrabold text-gray-900 leading-tight">
                  {nationalData.mentalHealthCount.toLocaleString()}{" "}
                  <span className="text-base font-bold text-gray-500">
                    ({((nationalData.mentalHealthCount / Math.max(nationalData.totalFacilities, 1)) * 100).toFixed(1)}%)
                  </span>
                </p>
              </div>
            </div>
          </div>
          <ChartCard
            title="Facilities by State"
            subtitle="Top 5 + Arizona by default. Select up to 15."
            accent={MAROON}
          >
            <div className="flex justify-end mb-2">
              <StatePicker
                allStates={allStateCodes}
                selected={mhStates}
                onToggle={toggleState(setMhStates)}
                accent={MAROON}
              />
            </div>
            <StateBreakdownChart
              data={mhChartData}
              accent={MAROON}
              totalForPct={nationalData.mentalHealthCount}
              dataKey="Mental Health"
            />
          </ChartCard>
        </div>

        {/* SUBSTANCE ABUSE column */}
        <div className="rounded-3xl border-2 p-6 lg:p-7 shadow-sm" style={{ borderColor: GOLD_SOFT, backgroundColor: "#FFFFFF" }}>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl" style={{ backgroundColor: GOLD_SOFT, color: "#8C6800" }}>
                <HeartPulse className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Substance Abuse</p>
                <p className="text-3xl font-extrabold text-gray-900 leading-tight">
                  {nationalData.substanceAbuseCount.toLocaleString()}{" "}
                  <span className="text-base font-bold text-gray-500">
                    ({((nationalData.substanceAbuseCount / Math.max(nationalData.totalFacilities, 1)) * 100).toFixed(1)}%)
                  </span>
                </p>
              </div>
            </div>
          </div>
          <ChartCard
            title="Facilities by State"
            subtitle="Top 5 + Arizona by default. Select up to 15."
            accent={GOLD}
          >
            <div className="flex justify-end mb-2">
              <StatePicker
                allStates={allStateCodes}
                selected={saStates}
                onToggle={toggleState(setSaStates)}
                accent={GOLD}
              />
            </div>
            <StateBreakdownChart
              data={saChartData}
              accent={GOLD}
              totalForPct={nationalData.substanceAbuseCount}
              dataKey="Substance Abuse"
            />
          </ChartCard>
        </div>
      </div>

      {/* L2 filter explorer */}
      {renderFilterExplorer(nationalData)}
    </div>
  );

  // ---- State view (AZ or chosen state) ----
  const renderStateView = () => {
    if (!stateData) {
      return (
        <div className="py-20 text-center">
          <Loader2 className="w-10 h-10 animate-spin mx-auto text-[#8C1D40]" />
        </div>
      );
    }
    const stateName = stateData.stateName || selectedState;
    const isAZ = l1Nav === "AZ";
    const stateTotal = stateData.stateTotal || 0;
    const stateMH = stateData.stateMentalHealth || 0;
    const stateSA = stateData.stateSubstanceAbuse || 0;
    const natPerStateMH = nationalData.totalStates ? Math.round(nationalData.mentalHealthCount / nationalData.totalStates) : 0;
    const natPerStateSA = nationalData.totalStates ? Math.round(nationalData.substanceAbuseCount / nationalData.totalStates) : 0;

    return (
      <div className="space-y-10 animate-in fade-in duration-500">
        <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-1">
              {isAZ ? "Arizona Insights" : `${stateName} Insights`}
            </h2>
            <p className="text-base text-gray-500 font-medium">Compared against national reference statistics.</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total Agencies</p>
            <p className="text-4xl font-black text-[#8C1D40]">{stateTotal.toLocaleString()}</p>
          </div>
        </div>

        {/* MH-left / SA-right comparison vs national avg per state */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-3xl border-2 p-6 lg:p-7 shadow-sm" style={{ borderColor: MAROON_SOFT }}>
            <div className="flex items-center gap-3 mb-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl" style={{ backgroundColor: MAROON_SOFT, color: MAROON }}>
                <Brain className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Mental Health · {stateName}</p>
                <p className="text-3xl font-extrabold text-gray-900 leading-tight">
                  {stateMH.toLocaleString()}{" "}
                  <span className="text-base font-bold text-gray-500">
                    ({stateTotal ? ((stateMH / stateTotal) * 100).toFixed(1) : "0"}%)
                  </span>
                </p>
              </div>
            </div>
            <ChartCard title="vs. National Reference" subtitle={`${stateName} vs. avg per state nationwide`} accent={MAROON}>
              <div className="h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { name: stateName, value: stateMH },
                      { name: "National Avg / State", value: natPerStateMH },
                    ]}
                    margin={{ top: 28, right: 16, left: 8, bottom: 8 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fontWeight: 700, fill: "#4B5563" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip total={nationalData.mentalHealthCount} />} cursor={{ fill: "transparent" }} />
                    <Bar dataKey="value" name="Mental Health" fill={MAROON} radius={[6, 6, 0, 0]} barSize={70}>
                      <LabelList
                        dataKey="value"
                        position="top"
                        fill="#374151"
                        fontSize={12}
                        fontWeight={700}
                        formatter={(v: number) => labelWithPct(v, nationalData.mentalHealthCount)}
                      />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          </div>

          <div className="rounded-3xl border-2 p-6 lg:p-7 shadow-sm" style={{ borderColor: GOLD_SOFT }}>
            <div className="flex items-center gap-3 mb-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl" style={{ backgroundColor: GOLD_SOFT, color: "#8C6800" }}>
                <HeartPulse className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Substance Abuse · {stateName}</p>
                <p className="text-3xl font-extrabold text-gray-900 leading-tight">
                  {stateSA.toLocaleString()}{" "}
                  <span className="text-base font-bold text-gray-500">
                    ({stateTotal ? ((stateSA / stateTotal) * 100).toFixed(1) : "0"}%)
                  </span>
                </p>
              </div>
            </div>
            <ChartCard title="vs. National Reference" subtitle={`${stateName} vs. avg per state nationwide`} accent={GOLD}>
              <div className="h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { name: stateName, value: stateSA },
                      { name: "National Avg / State", value: natPerStateSA },
                    ]}
                    margin={{ top: 28, right: 16, left: 8, bottom: 8 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fontWeight: 700, fill: "#4B5563" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip total={nationalData.substanceAbuseCount} />} cursor={{ fill: "transparent" }} />
                    <Bar dataKey="value" name="Substance Abuse" fill={GOLD} radius={[6, 6, 0, 0]} barSize={70}>
                      <LabelList
                        dataKey="value"
                        position="top"
                        fill="#374151"
                        fontSize={12}
                        fontWeight={700}
                        formatter={(v: number) => labelWithPct(v, nationalData.substanceAbuseCount)}
                      />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          </div>
        </div>

        {/* L2 filter explorer scoped to the chosen state */}
        {renderFilterExplorer(stateData)}
      </div>
    );
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 selection:bg-[#8C1D40] selection:text-white">
      <Navigation />
      <main className="flex-1">
        <section className="relative bg-white border-b border-gray-200 overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" />
          <div className="relative mx-auto max-w-7xl px-6 py-10 lg:px-8">
            <Link href="/">
              <button className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-[#8C1D40] transition-colors mb-5 group">
                <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                Back to Home
              </button>
            </Link>

            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div>
                <div className="inline-flex items-center rounded-full border border-[#8C1D40]/20 bg-[#8C1D40]/5 px-3 py-1 mb-3">
                  <Activity className="h-3.5 w-3.5 text-[#8C1D40] mr-2" />
                  <span className="text-[11px] font-black text-[#8C1D40] tracking-widest uppercase">Data Insights Dashboard</span>
                </div>
                <h1 className="text-3xl md:text-5xl font-black tracking-tight text-gray-900">
                  Behavioral Health <span className="text-[#8C1D40]">Insights</span>
                </h1>
                <p className="mt-3 text-base md:text-lg text-gray-500 max-w-2xl font-medium leading-relaxed">
                  Mental health and substance abuse agency coverage across the United States.
                </p>
              </div>
            </div>

            <div className="mt-8">{renderL1Nav()}</div>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
          {l1Nav === "overview" ? renderOverview() : renderStateView()}
        </div>
      </main>
      <Footer />

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 8px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 8px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}</style>
    </div>
  );
}
