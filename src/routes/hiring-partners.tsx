import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import { SiteNav } from "@/components/site-nav";
import {
  ArrowLeft,
  Search,
  Building2,
  ExternalLink,
  ChevronRight,
  Shield,
  Briefcase,
  Users,
  Compass,
  Cpu,
  GraduationCap
} from "lucide-react";
import { getHiringPartnersFn, type Partner } from "../actions";

export const Route = createFileRoute("/hiring-partners")({
  loader: async () => {
    const partners = await getHiringPartnersFn();
    return { partners };
  },
  component: HiringPartnersPage,
  head: () => ({
    meta: [
      { title: "Hiring Partners — REVA RACE" },
      {
        name: "description",
        content: "Explore the global organizations and enterprise partners that recruit from REVA Academy for Corporate Excellence (RACE).",
      },
    ],
  }),
});

const CATEGORIES = [
  "All",
  "Technology & Software",
  "Research & Academics",
  "Consulting & Finance",
  "Cybersecurity & Ops",
  "Healthcare & Biotech",
  "Engineering & Logistics"
] as const;

function CompanyLogo({ partner, className }: { partner: any; className?: string }) {
  const [error, setError] = useState(false);
  
  if (partner.logoUrl && !error) {
    return (
      <img
        src={partner.logoUrl}
        alt={partner.name}
        onError={() => setError(true)}
        className={className || "h-full w-auto object-contain max-h-10 rounded"}
      />
    );
  }
  
  return (
    <div className={`h-11 w-11 rounded-xl bg-gradient-to-br ${partner.themeColor} text-white font-black text-lg flex items-center justify-center shadow-sm shrink-0`}>
      {partner.logoLetter || partner.name.charAt(0)}
    </div>
  );
}

function HiringPartnersPage() {
  const { partners: serverPartners } = Route.useLoaderData() as { partners: Partner[] };
  const [partners, setPartners] = useState<Partner[]>(serverPartners);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const overridesStr = localStorage.getItem("reva_setting_hiring_partners");
      if (overridesStr) {
        try {
          setPartners(JSON.parse(overridesStr));
        } catch (e) {
          console.error("Failed to parse local hiring partners", e);
        }
      }
    }
  }, [serverPartners]);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const filteredPartners = useMemo(() => {
    return partners.filter((partner) => {
      const matchesSearch = partner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            partner.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === "All" || partner.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [partners, searchQuery, activeCategory]);

  return (
    <div className="min-h-screen bg-white pb-20 font-sans antialiased flex flex-col">
      {/* Top Navigation strip */}
      <div className="border-b-[3px] border-[#FF5900] bg-[#FFFBDC] text-neutral-800 shadow-sm sticky top-0 z-50 backdrop-blur-md bg-opacity-95">
        <div className="mx-auto flex max-w-6xl flex-row items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 rounded border border-black/15 bg-white/40 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-neutral-700 hover:bg-white/80 transition shadow-sm mr-2"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back
            </Link>
            <SiteNav variant="light" />
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-white rounded px-2.5 py-1 flex items-center justify-center h-12">
              <img src="/image/reva_logi.png" alt="REVA University" className="h-full w-auto object-contain" />
            </div>
          </div>
        </div>
      </div>

      {/* Hero Header */}
      <div className="bg-[#1E3E62] border-b-4 border-[#F9BF29] py-16 px-4 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, #ffffff 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
        <div className="max-w-3xl mx-auto relative z-10 space-y-4">
          <span className="rounded bg-gradient-to-r from-amber-400 to-[#F9BF29] text-[#12223A] text-[9px] font-black uppercase tracking-wider px-2.5 py-1 shadow-sm">
            RACE Placement Network
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-wide">
            Hiring Partners
          </h1>
          <p className="text-sm sm:text-base text-neutral-200 font-medium max-w-xl mx-auto leading-relaxed">
            We partner with global technology giants, research institutions, and industry innovators to bridge elite corporate talent with career transitions.
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-6xl w-full mx-auto px-4 mt-12 flex-1 space-y-8">
        {/* Toolbar: Search and Filter */}
        <div className="bg-white border border-black/5 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search partners by company name or technology..."
                className="w-full rounded-xl border border-black/10 bg-white py-3 pl-11 pr-4 text-xs outline-none focus:border-[#1E3E62] focus:ring-1 focus:ring-[#1E3E62]"
              />
            </div>
            <div className="text-xs text-neutral-400 font-bold uppercase tracking-wider select-none shrink-0">
              Showing {filteredPartners.length} of {partners.length} partners
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-black/5">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition duration-200 cursor-pointer ${
                  activeCategory === cat
                    ? "bg-[#1E3E62] text-white shadow-sm"
                    : "bg-neutral-100 hover:bg-neutral-200 text-neutral-600"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Partners Grid */}
        {filteredPartners.length === 0 ? (
          <div className="py-20 text-center text-xs text-neutral-400 font-bold uppercase tracking-widest bg-white rounded-2xl border border-black/5">
            No partners found matching your search criteria.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPartners.map((partner, idx) => (
              <div
                key={idx}
                className="bg-white border border-black/5 rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  {/* Top Header Card */}
                  <div className="flex items-center justify-between gap-3">
                    <CompanyLogo partner={partner} />
                    <div className="flex flex-col items-end gap-1">
                      <span className="rounded bg-[#FFFBDC] border border-[#FFAA6E]/15 px-2.5 py-0.5 text-[9px] font-black uppercase text-neutral-700 tracking-wider leading-none truncate max-w-[150px]">
                        {partner.category}
                      </span>
                      {partner.placementCount !== undefined && partner.placementCount > 0 && (
                        <span className="rounded bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[9px] font-black uppercase text-emerald-700 tracking-wider leading-none">
                          ⚡ {partner.placementCount} {partner.placementCount === 1 ? "Offer" : "Offers"}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Company Info */}
                  <div>
                    <h3 className="text-base font-extrabold text-neutral-900 leading-snug group-hover:text-[#FF5900] transition-colors">
                      {partner.name}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-neutral-500 font-medium line-clamp-3">
                      {partner.description}
                    </p>
                  </div>
                </div>

                {/* Footer action */}
                <div className="mt-6 pt-4 border-t border-black/5 flex items-center justify-between">
                  <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Hiring Partner</span>
                  <div className="inline-flex items-center gap-1 text-[11px] font-bold text-[#1E3E62] group-hover:text-[#FF5900] transition-colors">
                    Official Network <ChevronRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-black/5 bg-white py-6 mt-auto">
        <div className="mx-auto max-w-6xl px-6 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 font-bold">
          <div>© REVA University · RACE Department · race.reva.edu.in</div>
          <div className="flex gap-4 mt-4 sm:mt-0">
            <Link to="/" className="hover:text-[#FF5900] transition-colors">Home Page</Link>
            <Link to="/candidates" className="hover:text-[#FF5900] transition-colors">Placement Candidates</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
