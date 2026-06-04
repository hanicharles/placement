import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import { SiteNav } from "@/components/site-nav";
import {
  Mail,
  Phone,
  Search,
  Download,
  MapPin,
  Home,
  X,
  Check,
  Eye,
  Columns,
  Grid,
  List,
  ChevronDown,
  ChevronUp,
  Award,
  ExternalLink,
  Filter,
} from "lucide-react";
import { type Specialization, type Student } from "@/data/students";
import { getStudentsFn, checkSessionFn } from "../actions";

export const Route = createFileRoute("/candidates")({
  loader: async () => {
    const students = await getStudentsFn();
    return { students };
  },
  head: () => ({
    meta: [
      { title: "Find Your Candidate — REVA RACE" },
      {
        name: "description",
        content:
          "Browse and filter candidate profiles for the REVA RACE M.Tech / M.Sc cohort in Artificial Intelligence and Cybersecurity.",
      },
      { property: "og:title", content: "Find Your Candidate — REVA RACE" },
      {
        property: "og:description",
        content: "Filter candidates by specialization, skills, and more.",
      },
    ],
  }),
  component: BrochurePage,
});

const SPECIALIZATIONS: Specialization[] = ["Artificial Intelligence", "Cybersecurity"];

function specColor(s: Specialization) {
  if (s === "Artificial Intelligence") return "bg-indigo-50 text-indigo-700 border-indigo-200";
  return "bg-emerald-50 text-emerald-700 border-emerald-200";
}

function BrochurePage() {
  const { students: serverStudents } = Route.useLoaderData() as { students: Student[] };
  const [students, setStudents] = useState<Student[]>(serverStudents);

  useEffect(() => {
    setStudents(serverStudents);
  }, [serverStudents]);

  const [search, setSearch] = useState("");
  const [selectedSpecs, setSelectedSpecs] = useState<Set<Specialization>>(new Set());
  const [gender, setGender] = useState<"All" | "Male" | "Female">("All");
  const [placedOnly, setPlacedOnly] = useState(false);

  const [skillsQuery, setSkillsQuery] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<Set<string>>(new Set());
  const [skillMatchMode, setSkillMatchMode] = useState<"any" | "all">("any");

  // Advanced states
  const [sortBy, setSortBy] = useState<"name" | "skills" | "placed">("name");
  const [layoutMode, setLayoutMode] = useState<"grid" | "list">("grid");
  const [selectedCompare, setSelectedCompare] = useState<Set<string>>(new Set());
  const [compareOpen, setCompareOpen] = useState(false);
  const [quickViewStudent, setQuickViewStudent] = useState<Student | null>(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Active filters count helper
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedSpecs.size > 0) count += selectedSpecs.size;
    if (gender !== "All") count++;
    if (selectedSkills.size > 0) count += selectedSkills.size;
    if (placedOnly) count++;
    return count;
  }, [selectedSpecs, gender, selectedSkills, placedOnly]);

  // Auth State
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    checkSessionFn().then((res) => setIsAdmin(res.isAuthenticated));
  }, []);

  const PLACED_SLUGS = useMemo(() => {
    return new Set(students.filter((s) => !!s.placement).map((s) => s.slug));
  }, [students]);

  const PLACED_BADGE_SLUGS = PLACED_SLUGS;

  const DISPLAY_TOTAL_CANDIDATES = students.length;
  const DISPLAY_AI_CANDIDATES = students.filter((s) => s.specialization === "Artificial Intelligence").length;
  const DISPLAY_CYBER_CANDIDATES = students.filter((s) => s.specialization === "Cybersecurity").length;
  const DISPLAY_PLACED_STUDENTS = PLACED_SLUGS.size;

  // Accordion filters state
  const [expandedFilters, setExpandedFilters] = useState({
    search: true,
    specialization: true,
    gender: true,
    skills: true,
  });

  const toggleFilterExpand = (sec: "search" | "specialization" | "gender" | "skills") => {
    setExpandedFilters((prev) => ({ ...prev, [sec]: !prev[sec] }));
  };

  const skillCatalog = useMemo(() => {
    const m = new Map<string, { label: string; count: number }>();

    for (const st of students) {
      const perStudent = new Set<string>();
      for (const g of st.skills) {
        for (const item of g.items) {
          const label = item.trim();
          const key = label.toLowerCase();
          if (!key) continue;

          perStudent.add(key);
          if (!m.has(key)) m.set(key, { label, count: 0 });
        }
      }

      for (const key of perStudent) {
        const v = m.get(key);
        if (v) v.count += 1;
      }
    }

    return Array.from(m.entries())
      .map(([key, v]) => ({ key, ...v }))
      .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
  }, [students]);

  const skillLabelByKey = useMemo(() => {
    return new Map(skillCatalog.map((s) => [s.key, s.label] as const));
  }, [skillCatalog]);

  const visibleSkills = useMemo(() => {
    const q = skillsQuery.trim().toLowerCase();
    if (!q) return skillCatalog;
    return skillCatalog.filter((s) => s.label.toLowerCase().includes(q));
  }, [skillCatalog, skillsQuery]);

  const toggleSkill = (key: string) => {
    setSelectedSkills((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const filtered = useMemo(() => {
    const out = students.filter((s) => {
      if (placedOnly && !PLACED_SLUGS.has(s.slug)) return false;
      if (selectedSpecs.size && !selectedSpecs.has(s.specialization)) return false;
      if (gender !== "All" && s.gender !== gender) return false;

      if (selectedSkills.size) {
        const studentSkillKeys = new Set<string>();
        for (const g of s.skills) {
          for (const item of g.items) {
            const key = item.trim().toLowerCase();
            if (key) studentSkillKeys.add(key);
          }
        }

        if (skillMatchMode === "any") {
          let ok = false;
          for (const k of selectedSkills) {
            if (studentSkillKeys.has(k)) {
              ok = true;
              break;
            }
          }
          if (!ok) return false;
        } else {
          for (const k of selectedSkills) {
            if (!studentSkillKeys.has(k)) return false;
          }
        }
      }

      if (search) {
        const q = search.toLowerCase();
        const hay = `${s.name} ${s.headline} ${s.about} ${s.location ?? ""} ${s.email ?? ""} ${s.collegeEmail ?? ""} ${s.phone ?? ""} ${s.skills.flatMap((g) => g.items).join(" ")}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }

      return true;
    });

    const sorted = [...out];
    if (sortBy === "name") {
      sorted.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }));
    } else if (sortBy === "skills") {
      sorted.sort((a, b) => {
        const aCount = a.skills.reduce((sum, g) => sum + g.items.length, 0);
        const bCount = b.skills.reduce((sum, g) => sum + g.items.length, 0);
        return bCount - aCount || a.name.localeCompare(b.name, undefined, { sensitivity: "base" });
      });
    } else if (sortBy === "placed") {
      sorted.sort((a, b) => {
        const aPlaced = PLACED_SLUGS.has(a.slug) ? 1 : 0;
        const bPlaced = PLACED_SLUGS.has(b.slug) ? 1 : 0;
        return bPlaced - aPlaced || a.name.localeCompare(b.name, undefined, { sensitivity: "base" });
      });
    }

    return sorted;
  }, [search, selectedSpecs, gender, selectedSkills, skillMatchMode, placedOnly, sortBy]);

  const statCounts = useMemo(() => {
    return {
      total: DISPLAY_TOTAL_CANDIDATES,
      ai: DISPLAY_AI_CANDIDATES,
      cyber: DISPLAY_CYBER_CANDIDATES,
      placed: DISPLAY_PLACED_STUDENTS,
    };
  }, []);

  const toggleSpec = (b: Specialization) => {
    setSelectedSpecs((prev) => {
      const next = new Set(prev);
      if (next.has(b)) next.delete(b);
      else next.add(b);
      return next;
    });
  };

  const resetAllFilters = () => {
    setSearch("");
    setSelectedSpecs(new Set());
    setGender("All");
    setSkillsQuery("");
    setSelectedSkills(new Set());
    setSkillMatchMode("any");
    setPlacedOnly(false);
  };

  const scrollToCards = () => {
    if (typeof document === "undefined") return;
    document.getElementById("candidates")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const applyStatFilter = (kind: "total" | "ai" | "cyber" | "placed") => {
    const isAiActive = !placedOnly && selectedSpecs.size === 1 && selectedSpecs.has("Artificial Intelligence");
    const isCyberActive = !placedOnly && selectedSpecs.size === 1 && selectedSpecs.has("Cybersecurity");
    const isPlacedActive = placedOnly;

    if (
      kind === "total" ||
      (kind === "ai" && isAiActive) ||
      (kind === "cyber" && isCyberActive) ||
      (kind === "placed" && isPlacedActive)
    ) {
      resetAllFilters();
      scrollToCards();
      return;
    }

    setSearch("");
    setSkillsQuery("");
    setSelectedSkills(new Set());
    setGender("All");

    if (kind === "ai") {
      setPlacedOnly(false);
      setSelectedSpecs(new Set(["Artificial Intelligence"]));
    } else if (kind === "cyber") {
      setPlacedOnly(false);
      setSelectedSpecs(new Set(["Cybersecurity"]));
    } else {
      setPlacedOnly(true);
      setSelectedSpecs(new Set());
    }

    scrollToCards();
  };

  const toggleCompare = (slug: string) => {
    setSelectedCompare((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) {
        next.delete(slug);
      } else {
        if (next.size < 3) {
          next.add(slug);
        } else {
          alert("You can compare up to 3 candidates at a time.");
        }
      }
      return next;
    });
  };

  const compareCandidatesList = useMemo(() => {
    return students.filter((s) => selectedCompare.has(s.slug));
  }, [selectedCompare]);

  const exportCSV = () => {
    const headers = ["Name", "Headline", "Specialization", "Gender", "Location", "Email", "College Email", "Phone", "LinkedIn"];
    const rows = filtered.map((s) => [
      s.name, s.headline, s.specialization, s.gender, s.location ?? "",
      s.email ?? "", s.collegeEmail ?? "", s.phone ?? "", s.linkedin ?? "",
    ]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "reva-race-placement-brochure.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const renderFilterContent = () => (
    <div className="space-y-1 divide-y divide-black/5">
      {/* Search Accordion */}
      <div className="p-4">
        <button
          type="button"
          onClick={() => toggleFilterExpand("search")}
          className="w-full flex items-center justify-between text-xs font-bold text-neutral-800 uppercase tracking-wider mb-2 outline-none"
        >
          <span>Search</span>
          {expandedFilters.search ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
        </button>
        {expandedFilters.search && (
          <div className="relative mt-2">
            <Search className="pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Name, skills, summary…"
              className="w-full rounded-lg border border-black/10 bg-white py-2 pl-8 pr-3 text-xs outline-none focus:border-[#FF5900] focus:ring-1 focus:ring-[#FF5900] transition duration-200"
            />
          </div>
        )}
      </div>

      {/* Specialization Accordion */}
      <div className="p-4">
        <button
          type="button"
          onClick={() => toggleFilterExpand("specialization")}
          className="w-full flex items-center justify-between text-xs font-bold text-neutral-800 uppercase tracking-wider mb-2 outline-none"
        >
          <span>Specialization</span>
          {expandedFilters.specialization ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
        </button>
        {expandedFilters.specialization && (
          <div className="space-y-1.5 mt-2">
            {SPECIALIZATIONS.map((b) => {
              const count = students.filter((s) => s.specialization === b).length;
              return (
                <label key={b} className="flex cursor-pointer items-center justify-between text-xs hover:text-[#FF5900] transition-colors py-0.5">
                  <span className="flex items-center gap-2 font-medium">
                    <input
                      type="checkbox"
                      checked={selectedSpecs.has(b)}
                      onChange={() => toggleSpec(b)}
                      className="h-3.5 w-3.5 rounded accent-[#1E3E62] cursor-pointer"
                    />
                    {b}
                  </span>
                  <span className="text-muted-foreground font-bold">({count})</span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* Gender Accordion */}
      <div className="p-4">
        <button
          type="button"
          onClick={() => toggleFilterExpand("gender")}
          className="w-full flex items-center justify-between text-xs font-bold text-neutral-800 uppercase tracking-wider mb-2 outline-none"
        >
          <span>Gender</span>
          {expandedFilters.gender ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
        </button>
        {expandedFilters.gender && (
          <div className="flex gap-4 text-xs mt-2">
            {(["All", "Male", "Female"] as const).map((g) => (
              <label key={g} className="flex cursor-pointer items-center gap-1.5 font-medium hover:text-[#FF5900] transition-colors">
                <input
                  type="radio"
                  name="gender"
                  checked={gender === g}
                  onChange={() => setGender(g)}
                  className="accent-[#1E3E62] cursor-pointer"
                />
                {g}
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Skills Accordion */}
      <div className="p-4">
        <button
          type="button"
          onClick={() => toggleFilterExpand("skills")}
          className="w-full flex items-center justify-between text-xs font-bold text-neutral-800 uppercase tracking-wider mb-2 outline-none"
        >
          <span>Skills</span>
          {expandedFilters.skills ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
        </button>
        {expandedFilters.skills && (
          <div className="space-y-2 mt-2">
            <input
              value={skillsQuery}
              onChange={(e) => setSkillsQuery(e.target.value)}
              placeholder="Filter skills…"
              className="w-full rounded-lg border border-black/10 bg-white px-2 py-2 text-xs outline-none focus:border-[#FF5900] focus:ring-1 focus:ring-[#FF5900] transition duration-200"
            />

            <div className="flex flex-wrap items-center gap-3 text-xs">
              <label className="flex cursor-pointer items-center gap-1.5 font-semibold text-neutral-600">
                <input
                  type="radio"
                  name="skillMatch"
                  checked={skillMatchMode === "any"}
                  onChange={() => setSkillMatchMode("any")}
                  className="accent-[#1E3E62]"
                />
                Any
              </label>
              <label className="flex cursor-pointer items-center gap-1.5 font-semibold text-neutral-600">
                <input
                  type="radio"
                  name="skillMatch"
                  checked={skillMatchMode === "all"}
                  onChange={() => setSkillMatchMode("all")}
                  className="accent-[#1E3E62]"
                />
                All
              </label>

              {selectedSkills.size > 0 && (
                <button
                  type="button"
                  onClick={() => setSelectedSkills(new Set())}
                  className="ml-auto text-[10px] font-bold text-[#FF5900] hover:underline"
                >
                  Clear Selection
                </button>
              )}
            </div>

            {selectedSkills.size > 0 && (
              <div className="flex flex-wrap gap-1">
                {Array.from(selectedSkills)
                  .sort((a, b) => (skillLabelByKey.get(a) ?? a).localeCompare(skillLabelByKey.get(b) ?? b))
                  .map((k) => (
                    <button
                      key={k}
                      type="button"
                      onClick={() => toggleSkill(k)}
                      className="inline-flex items-center gap-0.5 rounded bg-amber-50 border border-amber-200 px-1.5 py-0.5 text-[10px] text-amber-800 font-bold hover:bg-amber-100 transition"
                      title="Remove"
                    >
                      {skillLabelByKey.get(k) ?? k}
                      <X className="h-2.5 w-2.5" />
                    </button>
                  ))}
              </div>
            )}

            <div className="max-h-56 overflow-auto rounded-lg border border-black/5 bg-white p-2 divide-y divide-black/5">
              {visibleSkills.map((sk) => (
                <label key={sk.key} className="flex cursor-pointer items-center justify-between gap-2 py-1.5 text-xs hover:text-[#FF5900] transition-colors">
                  <span className="flex min-w-0 items-center gap-2 font-medium">
                    <input
                      type="checkbox"
                      checked={selectedSkills.has(sk.key)}
                      onChange={() => toggleSkill(sk.key)}
                      className="h-3.5 w-3.5 rounded accent-[#1E3E62] cursor-pointer"
                    />
                    <span className="truncate">{sk.label}</span>
                  </span>
                  <span className="shrink-0 text-muted-foreground font-bold text-[10px]">({sk.count})</span>
                </label>
              ))}

              {visibleSkills.length === 0 && (
                <div className="py-2 text-[10px] text-muted-foreground text-center">
                  No skills match “{skillsQuery.trim()}”
                </div>
              )}
            </div>

            <p className="text-[10px] text-muted-foreground font-semibold">
              Selected skills: {selectedSkills.size} · Total skills: {skillCatalog.length}
            </p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Top bar */}
      <div className="border-b-[3px] border-[#F9BF29] bg-[#12223A] text-white sticky top-0 z-50">
        <div className="mx-auto flex max-w-7xl flex-row items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Link to="/" className="inline-flex items-center gap-2 hover:opacity-95 transition-opacity mr-2">
              <img src="/image/race_tab_logo.png" alt="REVA RACE" className="h-8 w-auto object-contain bg-white/10 rounded p-1" />
            </Link>
            <SiteNav variant="dark" />
          </div>

          <div>
            <button
              onClick={exportCSV}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-[#F9BF29] px-4 py-2 text-xs font-bold text-[#12223A] shadow-sm hover:bg-[#e0ab24] transition duration-200 tracking-wider cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" />
              EXPORT CSV
            </button>
          </div>
        </div>
      </div>

      {/* Hero */}
      <header className="relative w-full overflow-hidden bg-[#1E3E62] text-white">
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, #ffffff 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
        <div className="flex flex-col md:flex-row w-full items-stretch animate-fade-in">
          {/* Left Logo Container */}
          <div className="w-full md:w-[42%] lg:w-[38%] bg-white text-[#1E3E62] relative flex items-center md:[clip-path:polygon(0_0,_100%_0,_82%_100%,_0_100%)] z-10 py-6 px-6 md:py-10 md:pl-8 md:pr-16">
            <div className="flex items-center gap-4 w-full justify-center md:justify-start">
              <img
                src="/image/reva_logi.png"
                alt="REVA University"
                className="h-14 sm:h-16 w-auto object-contain"
              />
            </div>
          </div>

          {/* Right Text Container */}
          <div className="flex-1 flex flex-col justify-center items-center text-center py-10 px-6 md:py-12 md:pr-12 md:pl-4 z-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#F9BF29]/90">
              REVA UNIVERSITY | EXECUTIVE PROGRAMME | 2026
            </p>
            <h1 className="mt-2 text-2xl sm:text-3xl md:text-4xl font-black tracking-wider text-[#F9BF29] uppercase">
              Placement Brochure 2026
            </h1>
            <p className="mt-2 text-sm sm:text-base font-semibold text-white/90 tracking-wide max-w-xl">
              M.Tech / M.Sc in Artificial Intelligence & Cybersecurity
            </p>
            <p className="mt-3 text-xs italic font-serif text-white/60 tracking-wider">
              Excellence · Strategy · Innovation
            </p>
          </div>
        </div>

        {/* Stats strip */}
        <div className="bg-[#12223A] border-t border-b border-white/10 shadow-inner">
          <div className="mx-auto grid max-w-7xl grid-cols-2 sm:grid-cols-4 gap-0">
            <StatButton
              n={statCounts.total}
              label="Candidates Total"
              active={!placedOnly && selectedSpecs.size === 0 && gender === "All" && !search && selectedSkills.size === 0}
              onClick={() => applyStatFilter("total")}
              borderClass="border-r border-b border-white/10 sm:border-b-0"
            />
            <StatButton
              n={statCounts.ai}
              label="Artificial Intelligence"
              active={!placedOnly && selectedSpecs.size === 1 && selectedSpecs.has("Artificial Intelligence")}
              onClick={() => applyStatFilter("ai")}
              borderClass="border-b border-white/10 sm:border-r sm:border-b-0"
            />
            <StatButton
              n={statCounts.cyber}
              label="Cybersecurity"
              active={!placedOnly && selectedSpecs.size === 1 && selectedSpecs.has("Cybersecurity")}
              onClick={() => applyStatFilter("cyber")}
              borderClass="border-r border-white/10"
            />
            <StatButton
              n={statCounts.placed}
              label="Students Placed"
              active={placedOnly}
              onClick={() => applyStatFilter("placed")}
              borderClass=""
            />
          </div>
        </div>
      </header>

      {/* Body */}
      <main className="mx-auto grid max-w-7xl gap-6 px-4 py-8 lg:grid-cols-[300px_1fr]">
        {/* Desktop Sidebar (lg:block hidden) */}
        <aside className="hidden lg:block h-fit rounded-xl border border-black/5 bg-white shadow-sm overflow-hidden">
          <div className="bg-[#1E3E62] px-4 py-3 text-white border-b border-[#F9BF29] flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider">Find Your Candidate</p>
              <p className="text-[10px] text-white/80">Showing {filtered.length} of {DISPLAY_TOTAL_CANDIDATES}</p>
            </div>
            { (search || selectedSpecs.size > 0 || gender !== "All" || selectedSkills.size > 0 || placedOnly) && (
              <button
                type="button"
                onClick={resetAllFilters}
                className="text-[10px] bg-white/10 border border-white/20 rounded px-2 py-0.5 font-bold hover:bg-white/20 transition"
              >
                Reset All
              </button>
            )}
          </div>
          {renderFilterContent()}
        </aside>

        {/* Mobile Filters Drawer Modal (lg:hidden) */}
        {mobileFiltersOpen && (
          <div className="fixed inset-0 z-50 lg:hidden animate-fade-in" role="dialog" aria-modal="true">
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
              onClick={() => setMobileFiltersOpen(false)}
            />
            {/* Sliding Panel */}
            <div className="fixed right-0 top-0 bottom-0 z-50 flex h-full w-full max-w-[320px] flex-col bg-white shadow-2xl outline-none border-l border-black/5 transition-transform duration-300 ease-out">
              <div className="bg-[#1E3E62] px-4 py-4 text-white border-b border-[#F9BF29] flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider">Filters</p>
                  <p className="text-[10px] text-white/80">Showing {filtered.length} of {DISPLAY_TOTAL_CANDIDATES}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(false)}
                  className="rounded-lg p-1 text-white/70 hover:text-white transition hover:bg-white/10"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Scrollable Filters Content */}
              <div className="flex-1 overflow-y-auto space-y-1 divide-y divide-black/5 pb-24 bg-white">
                {renderFilterContent()}
              </div>

              {/* Footer Sticky Button */}
              <div className="absolute bottom-0 left-0 right-0 border-t border-black/5 bg-white p-4 flex gap-2 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
                <button
                  type="button"
                  onClick={() => {
                    resetAllFilters();
                  }}
                  className="flex-1 rounded-lg border border-black/10 py-2.5 text-xs font-bold text-neutral-700 hover:bg-neutral-50 transition"
                >
                  Reset All
                </button>
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(false)}
                  className="flex-1 rounded-lg bg-[#1E3E62] py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#12223A] transition"
                >
                  Show {filtered.length} Results
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <section id="candidates" className="space-y-4">
          {/* Mobile Controls & Search bar (lg:hidden) */}
          <div className="lg:hidden flex flex-col gap-3 bg-white border border-black/5 rounded-xl p-4 shadow-sm">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search candidates by name, skills, summary…"
                className="w-full rounded-lg border border-black/10 bg-neutral-50 py-2.5 pl-10 pr-4 text-xs outline-none focus:border-[#FF5900] focus:ring-1 focus:ring-[#FF5900] transition bg-white"
              />
              {search && (
                <button 
                  type="button"
                  onClick={() => setSearch("")} 
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(true)}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg border border-black/10 bg-white py-2 px-3 text-xs font-bold text-neutral-700 shadow-xs hover:bg-neutral-50 transition"
              >
                <Filter className="h-3.5 w-3.5 text-[#1E3E62]" />
                <span>Filters</span>
                {activeFiltersCount > 0 && (
                  <span className="rounded-full bg-[#FF5900] text-white px-2 py-0.5 text-[9px] font-black leading-none">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={exportCSV}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-black/10 bg-neutral-50 py-2 px-3 text-xs font-bold text-neutral-700 shadow-xs hover:bg-[#1E3E62]/10 transition"
              >
                <Download className="h-3.5 w-3.5 text-neutral-500" />
                <span>Export</span>
              </button>
            </div>
          </div>
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white border border-black/5 rounded-xl p-4 shadow-sm">
            <p className="text-xs text-neutral-600 font-bold">
              Showing <span className="text-[#FF5900] font-black">{filtered.length}</span> of{" "}
              <span className="text-neutral-800 font-black">{DISPLAY_TOTAL_CANDIDATES}</span> candidates
            </p>
            <div className="flex flex-wrap items-center gap-3">
              {/* Sorting Selection */}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-neutral-500 font-bold">Sort By:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="rounded border border-black/10 bg-white px-2 py-1 outline-none font-bold text-neutral-800 cursor-pointer focus:border-[#FF5900] text-xs"
                >
                  <option value="name">Name (A-Z)</option>
                  <option value="skills">Skills Count</option>
                  <option value="placed">Placement Status</option>
                </select>
              </div>

              {/* View Layout Toggle */}
              <div className="flex items-center bg-neutral-100 rounded-lg p-0.5 border border-black/5">
                <button
                  type="button"
                  onClick={() => setLayoutMode("grid")}
                  className={`p-1.5 rounded-md transition-colors ${layoutMode === "grid" ? "bg-white text-[#1E3E62] shadow-sm" : "text-neutral-400 hover:text-neutral-600"}`}
                  title="Grid View"
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setLayoutMode("list")}
                  className={`p-1.5 rounded-md transition-colors ${layoutMode === "list" ? "bg-white text-[#1E3E62] shadow-sm" : "text-neutral-400 hover:text-neutral-600"}`}
                  title="List View"
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Candidates Layout Rendering */}
          {layoutMode === "grid" ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((s) => (
                <article
                  key={s.slug}
                  className="relative flex flex-col rounded-xl border border-black/5 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="mb-2.5 flex flex-wrap items-center gap-1.5 text-[9px] font-black uppercase tracking-wider">
                    <span className={`rounded-md border px-2 py-0.5 ${specColor(s.specialization)}`}>
                      {s.specialization}
                    </span>
                    {PLACED_BADGE_SLUGS.has(s.slug) && (
                      <span className="rounded-md bg-amber-500 text-white px-2 py-0.5 shadow-sm">
                        Placed
                      </span>
                    )}
                    <span className="text-neutral-400 bg-neutral-100 px-1.5 py-0.5 rounded">{s.gender}</span>
                  </div>

                  <h3 className="text-base font-black text-neutral-900 leading-snug flex items-center gap-2.5 flex-wrap">
                    <span>{s.name}</span>
                    <label
                      htmlFor={`comp-${s.slug}`}
                      className="inline-flex items-center gap-1 bg-[#fafafa] border border-black/5 rounded-full px-2 py-0.5 text-[9px] font-bold text-neutral-600 hover:border-black/20 hover:text-neutral-800 transition duration-150 cursor-pointer select-none"
                    >
                      <input
                        type="checkbox"
                        id={`comp-${s.slug}`}
                        checked={selectedCompare.has(s.slug)}
                        onChange={() => toggleCompare(s.slug)}
                        className="h-3 w-3 accent-[#1E3E62] cursor-pointer"
                      />
                      <span>Compare</span>
                    </label>
                  </h3>
                  <p className="text-xs font-semibold text-[#1E3E62] mt-0.5">{s.headline}</p>
                  
                  {s.placement && (
                    <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 border border-emerald-200/60 px-2.5 py-1 text-[11px] font-bold text-emerald-800 shadow-sm w-fit select-none">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                      <span><span className="font-extrabold">{s.placement.company}</span> as <span className="italic">{s.placement.role}</span></span>
                    </div>
                  )}

                  <hr className="my-3 border-black/5" />
                  
                  {s.location && (
                    <div className="mb-2.5 flex items-center gap-1 text-[11px] font-bold text-neutral-500">
                      <MapPin className="h-3 w-3 text-neutral-400" /> {s.location}
                    </div>
                  )}



                  <p className="line-clamp-3 flex-1 text-xs text-neutral-500 font-medium leading-relaxed mb-4">
                    {s.about}
                  </p>

                  <div className="mt-auto pt-3 border-t border-black/5 flex items-center justify-between">
                    <div className="flex gap-1.5">
                      {s.email && (
                        <a
                          href={`mailto:${s.email}`}
                          className="flex h-7.5 w-7.5 items-center justify-center rounded-lg border border-black/5 text-neutral-500 transition hover:border-[#1E3E62] hover:text-[#1E3E62] hover:bg-neutral-50"
                          title="Send Email"
                        >
                          <Mail className="h-3.5 w-3.5" />
                        </a>
                      )}
                      {s.phone && (
                        <a
                          href={`tel:${s.phone}`}
                          className="flex h-7.5 w-7.5 items-center justify-center rounded-lg border border-black/5 text-neutral-500 transition hover:border-[#1E3E62] hover:text-[#1E3E62] hover:bg-neutral-50"
                          title="Call Phone"
                        >
                          <Phone className="h-3.5 w-3.5" />
                        </a>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setQuickViewStudent(s)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-100 border border-black/5 text-neutral-600 hover:bg-neutral-200 transition"
                        title="Quick View Portfolio"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <Link
                        to="/profile/$slug"
                        params={{ slug: s.slug }}
                        className="rounded-lg bg-[#1E3E62] px-3.5 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-[#12223A] transition duration-150 flex items-center justify-center gap-1"
                      >
                        Full Profile
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            /* List Layout Render */
            <div className="flex flex-col gap-3">
              {filtered.map((s) => (
                <article
                  key={s.slug}
                  className="relative flex flex-col md:flex-row items-stretch rounded-xl border border-black/5 bg-white p-5 shadow-sm transition duration-300 hover:shadow-md gap-4"
                >
                  <div className="flex flex-col justify-between flex-1">
                    <div>
                      <div className="mb-2 flex flex-wrap items-center gap-1.5 text-[9px] font-black uppercase tracking-wider">
                        <span className={`rounded-md border px-2 py-0.5 ${specColor(s.specialization)}`}>
                          {s.specialization}
                        </span>
                        {PLACED_BADGE_SLUGS.has(s.slug) && (
                          <span className="rounded-md bg-amber-500 text-white px-2 py-0.5 shadow-sm">
                            Placed
                          </span>
                        )}
                        <span className="text-neutral-400 bg-neutral-100 px-1.5 py-0.5 rounded">{s.gender}</span>
                        {s.location && (
                          <span className="text-neutral-500 bg-neutral-100 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                            <MapPin className="h-2.5 w-2.5 text-neutral-400" /> {s.location}
                          </span>
                        )}
                      </div>

                      <h3 className="text-lg font-black text-neutral-900 leading-snug flex items-center gap-2.5 flex-wrap">
                        <span>{s.name}</span>
                        <label
                          htmlFor={`comp-list-${s.slug}`}
                          className="inline-flex items-center gap-1 bg-[#fafafa] border border-black/5 rounded-full px-2 py-0.5 text-[9px] font-bold text-neutral-600 hover:border-black/20 hover:text-neutral-800 transition duration-150 cursor-pointer select-none"
                        >
                          <input
                            type="checkbox"
                            id={`comp-list-${s.slug}`}
                            checked={selectedCompare.has(s.slug)}
                            onChange={() => toggleCompare(s.slug)}
                            className="h-3 w-3 accent-[#1E3E62] cursor-pointer"
                          />
                          <span>Compare</span>
                        </label>
                      </h3>
                      <p className="text-xs font-bold text-[#1E3E62] mt-0.5">{s.headline}</p>
                      
                      {s.placement && (
                        <div className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 border border-emerald-200/60 px-2.5 py-1 text-[11px] font-bold text-emerald-800 shadow-sm w-fit select-none">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                          </span>
                          <span><span className="font-extrabold">{s.placement.company}</span> as <span className="italic">{s.placement.role}</span></span>
                        </div>
                      )}
                      <p className="text-xs text-neutral-500 font-medium leading-relaxed mt-2 max-w-2xl line-clamp-2">
                        {s.about}
                      </p>
                    </div>

                  </div>

                  <div className="flex flex-row md:flex-col justify-end items-center md:items-end gap-3 pt-3 md:pt-0 border-t md:border-t-0 md:border-l border-black/5 md:pl-4 shrink-0">
                    <div className="flex gap-2">
                      <div className="flex gap-1">
                        {s.email && (
                          <a
                            href={`mailto:${s.email}`}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-black/5 text-neutral-500 transition hover:border-[#1E3E62]"
                            title="Send Email"
                          >
                            <Mail className="h-3.5 w-3.5" />
                          </a>
                        )}
                        {s.phone && (
                          <a
                            href={`tel:${s.phone}`}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-black/5 text-neutral-500 transition hover:border-[#1E3E62]"
                            title="Call Phone"
                          >
                            <Phone className="h-3.5 w-3.5" />
                          </a>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => setQuickViewStudent(s)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-100 border border-black/5 text-neutral-600 hover:bg-neutral-200 transition"
                        title="Quick View"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <Link
                        to="/profile/$slug"
                        params={{ slug: s.slug }}
                        className="rounded-lg bg-[#1E3E62] px-4 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-[#12223A] transition flex items-center justify-center"
                      >
                        View Profile
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {filtered.length === 0 && (
            <div className="rounded-xl border border-dashed border-black/10 bg-white p-12 text-center text-sm text-neutral-400 font-bold shadow-sm">
              No candidates match your active filters. Click reset above to try again.
            </div>
          )}
        </section>
      </main>

      {/* Floating Candidate Compare Bottom Drawer */}
      {selectedCompare.size > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-[#12223A] text-white border-t-3 border-[#F9BF29] shadow-2xl py-4 px-6 z-40 animate-fade-in">
          <div className="mx-auto max-w-5xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-[#F9BF29] text-[#12223A] text-xs font-extrabold h-6 w-6 flex items-center justify-center">
                {selectedCompare.size}
              </span>
              <p className="text-xs font-bold uppercase tracking-wider">Candidates Selected for Comparison</p>
              
              {/* Selected Pills */}
              <div className="hidden md:flex items-center gap-2 ml-4">
                {compareCandidatesList.map((s) => (
                  <span
                    key={s.slug}
                    className="inline-flex items-center gap-1 rounded bg-white/10 px-2.5 py-1 text-xs font-semibold border border-white/10"
                  >
                    {s.name}
                    <button
                      type="button"
                      onClick={() => toggleCompare(s.slug)}
                      className="text-white/60 hover:text-white transition"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSelectedCompare(new Set())}
                className="text-xs font-bold text-white/75 hover:text-white px-3 py-2 border border-white/20 rounded-lg bg-white/5 hover:bg-white/10 transition"
              >
                Clear All
              </button>
              <button
                type="button"
                onClick={() => setCompareOpen(true)}
                className="rounded-lg bg-[#F9BF29] text-[#12223A] font-black text-xs uppercase tracking-wider px-5 py-2.5 hover:bg-[#e0ab24] transition shadow-md flex items-center gap-1.5"
              >
                <Columns className="h-4 w-4" /> Compare Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Candidate Compare Modal */}
      {compareOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-black/5 animate-scale-up">
            {/* Modal Header */}
            <div className="bg-[#12223A] text-white px-6 py-4 flex items-center justify-between border-b border-[#F9BF29]">
              <div className="flex items-center gap-2">
                <Columns className="h-5 w-5 text-[#F9BF29]" />
                <h3 className="text-base font-bold uppercase tracking-wider">Candidate Comparison Grid</h3>
              </div>
              <button
                type="button"
                onClick={() => setCompareOpen(false)}
                className="rounded-lg p-1 text-white/70 hover:text-white hover:bg-white/10 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body Table */}
            <div className="overflow-auto p-6 flex-1">
              {compareCandidatesList.length === 0 ? (
                <p className="text-center text-sm text-neutral-400 font-bold py-10">No candidates selected.</p>
              ) : (
                <div className="border border-black/5 rounded-xl overflow-hidden">
                  <table className="w-full border-collapse text-left text-xs text-neutral-700 bg-white">
                    <thead>
                      <tr className="bg-neutral-50 text-neutral-800 border-b border-black/5">
                        <th className="p-4 font-black uppercase tracking-wider w-[20%]">Metric</th>
                        {compareCandidatesList.map((s) => (
                          <th key={s.slug} className="p-4 font-black uppercase tracking-wider border-l border-black/5 text-center">
                            <p className="text-sm font-black text-neutral-900 leading-none">{s.name}</p>
                            <span className="inline-block mt-2 rounded bg-neutral-100 border border-black/5 text-[9px] px-2 py-0.5 text-neutral-500 font-bold uppercase tracking-wider">
                              {s.specialization}
                            </span>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/5">
                      <tr>
                        <td className="p-4 font-bold text-neutral-900 bg-neutral-50/50">Headline</td>
                        {compareCandidatesList.map((s) => (
                          <td key={s.slug} className="p-4 border-l border-black/5 text-center font-medium italic text-[#1E3E62]">
                            {s.headline}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-4 font-bold text-neutral-900 bg-neutral-50/50">Education</td>
                        {compareCandidatesList.map((s) => (
                          <td key={s.slug} className="p-4 border-l border-black/5 text-left align-top space-y-2">
                            {s.education.map((e, idx) => (
                              <div key={idx} className="border-b border-black/5 last:border-b-0 pb-1.5 last:pb-0">
                                <p className="font-bold text-neutral-900 leading-tight">{e.degree}</p>
                                <p className="text-[10px] text-neutral-500">{e.institute}</p>
                                <p className="text-[9px] text-neutral-400 font-semibold">{e.period}</p>
                              </div>
                            ))}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-4 font-bold text-neutral-900 bg-neutral-50/50">Core Skills</td>
                        {compareCandidatesList.map((s) => (
                          <td key={s.slug} className="p-4 border-l border-black/5 text-left align-top">
                            <div className="flex flex-wrap gap-1.5">
                              {s.skills.flatMap(g => g.items).slice(0, 15).map((sk) => (
                                <span key={sk} className="rounded bg-neutral-50 border border-black/5 px-2 py-0.5 text-[10px] text-neutral-600 font-bold">
                                  {sk}
                                </span>
                              ))}
                              {s.skills.flatMap(g => g.items).length > 15 && (
                                <span className="rounded bg-neutral-100 px-1.5 py-0.5 text-[9px] font-black text-neutral-400">
                                  +{s.skills.flatMap(g => g.items).length - 15} More
                                </span>
                              )}
                            </div>
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-4 font-bold text-neutral-900 bg-neutral-50/50">Work Experience</td>
                        {compareCandidatesList.map((s) => (
                          <td key={s.slug} className="p-4 border-l border-black/5 text-left align-top">
                            {s.workExperience && s.workExperience.length > 0 ? (
                              <div className="space-y-2">
                                {s.workExperience.map((w, idx) => (
                                  <div key={idx}>
                                    <p className="font-bold text-neutral-900 leading-none">{w.role}</p>
                                    <p className="text-[10px] text-neutral-500 italic mt-0.5">{w.company}</p>
                                    {w.period && <p className="text-[9px] text-neutral-400 font-semibold">{w.period}</p>}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-neutral-400 italic">No formal corporate experience listed</p>
                            )}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-4 font-bold text-neutral-900 bg-neutral-50/50">Top Projects</td>
                        {compareCandidatesList.map((s) => (
                          <td key={s.slug} className="p-4 border-l border-black/5 text-left align-top space-y-2">
                            {s.projects.slice(0, 2).map((p, idx) => (
                              <div key={idx} className="border-b border-black/5 last:border-b-0 pb-1.5 last:pb-0">
                                <p className="font-bold text-neutral-900 leading-snug">{p.title}</p>
                                <p className="text-[10px] text-neutral-500 line-clamp-2 mt-0.5 leading-relaxed">{p.bullets[0]}</p>
                              </div>
                            ))}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-4 font-bold text-neutral-900 bg-neutral-50/50">Details</td>
                        {compareCandidatesList.map((s) => (
                          <td key={s.slug} className="p-4 border-l border-black/5 text-center">
                            <Link
                              to="/profile/$slug"
                              params={{ slug: s.slug }}
                              onClick={() => setCompareOpen(false)}
                              className="inline-flex items-center gap-1 text-xs font-bold text-[#FF5900] hover:underline"
                            >
                              View Full Profile <ExternalLink className="h-3 w-3" />
                            </Link>
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Candidate Quick View Modal */}
      {quickViewStudent && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-black/5 animate-scale-up">
            {/* Header */}
            <div className="bg-[#12223A] text-white px-6 py-4 flex items-center justify-between border-b border-[#F9BF29]">
              <div>
                <h3 className="text-sm font-black uppercase tracking-wider">{quickViewStudent.name}</h3>
                <p className="text-[10px] text-[#F9BF29] font-bold mt-0.5">{quickViewStudent.specialization} Specialization</p>
              </div>
              <button
                type="button"
                onClick={() => setQuickViewStudent(null)}
                className="rounded-lg p-1 text-white/70 hover:text-white hover:bg-white/10 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="overflow-auto p-6 space-y-5 text-xs text-neutral-700 leading-relaxed">
              {/* Bio summary */}
              <div>
                <h4 className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5">Professional Bio</h4>
                <p className="text-neutral-800 text-sm font-medium leading-relaxed text-justify bg-neutral-50 p-3.5 rounded-lg border border-black/5">
                  {quickViewStudent.about}
                </p>
              </div>

              {/* Skills summary */}
              <div>
                <h4 className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5">Core Technical Skills</h4>
                <div className="flex flex-wrap gap-1.5">
                  {quickViewStudent.skills.flatMap(g => g.items).map((sk) => (
                    <span key={sk} className="rounded bg-neutral-50 border border-black/5 px-2.5 py-0.5 text-[10px] text-neutral-700 font-semibold shadow-sm">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              {/* Projects highlight */}
              <div>
                <h4 className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-2">Featured Project</h4>
                <div className="border border-black/5 rounded-xl p-4 bg-amber-50/20 border-l-4 border-l-[#F9BF29]">
                  <p className="font-extrabold text-neutral-900 text-sm leading-snug">{quickViewStudent.projects[0].title}</p>
                  <p className="text-neutral-600 font-medium mt-1.5">{quickViewStudent.projects[0].bullets[0]}</p>
                </div>
              </div>

              {/* Education */}
              <div>
                <h4 className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5">Education</h4>
                <div className="space-y-1.5">
                  {quickViewStudent.education.map((e, idx) => (
                    <div key={idx} className="flex justify-between items-baseline border-b border-black/5 last:border-b-0 pb-1">
                      <div>
                        <p className="font-bold text-neutral-900">{e.degree}</p>
                        <p className="text-[10px] text-neutral-500 font-semibold">{e.institute}</p>
                      </div>
                      <span className="text-[10px] text-neutral-400 font-black">{e.period}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-neutral-50 border-t border-black/5 px-6 py-4 flex items-center justify-between">
              <div className="flex gap-2">
                {quickViewStudent.email && (
                  <a
                    href={`mailto:${quickViewStudent.email}`}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-black/10 text-neutral-500 hover:border-[#1E3E62] bg-white transition shadow-sm"
                    title="Send Email"
                  >
                    <Mail className="h-4 w-4" />
                  </a>
                )}
                {quickViewStudent.phone && (
                  <a
                    href={`tel:${quickViewStudent.phone}`}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-black/10 text-neutral-500 hover:border-[#1E3E62] bg-white transition shadow-sm"
                    title="Call Phone"
                  >
                    <Phone className="h-4 w-4" />
                  </a>
                )}
              </div>
              <Link
                to="/profile/$slug"
                params={{ slug: quickViewStudent.slug }}
                onClick={() => setQuickViewStudent(null)}
                className="rounded-lg bg-[#1E3E62] px-5 py-2 text-xs font-black text-white hover:bg-[#12223A] transition shadow-md flex items-center gap-1.5"
              >
                View Full e-Portfolio <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-black/5 bg-white mt-12 py-6 text-center text-xs text-neutral-500 font-bold">
        © REVA University · RACE · race.reva.edu.in
      </footer>
    </div>
  );
}

function StatButton({
  n,
  label,
  active,
  onClick,
  borderClass = "",
}: {
  n: number | string;
  label: string;
  active?: boolean;
  onClick: () => void;
  borderClass?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center justify-center py-4 px-2 text-center transition duration-200 outline-none w-full hover:bg-white/5 ${
        active ? "bg-white/10" : ""
      } ${borderClass}`}
      title={`Filter by ${label}`}
    >
      <div className={`text-2xl md:text-3xl font-extrabold tracking-tight transition-colors ${active ? "text-[#F9BF29]" : "text-white"}`}>
        {n}
      </div>
      <div className={`mt-1 text-[10px] md:text-xs font-semibold uppercase tracking-wider transition-colors ${
        active ? "text-white font-bold" : "text-white/60"
      }`}>
        {label}
      </div>
    </button>
  );
}
