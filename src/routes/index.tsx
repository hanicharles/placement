import { Link, createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/site-nav";
import { Phone } from "lucide-react";
import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  CartesianGrid,
} from "recharts";
import { getJourneyStatsFn, getHiringPartnersFn, getPlacementStatsFn, getDashboardChartsFn } from "../actions";

export const Route = createFileRoute("/")({
  loader: async () => {
    const [stats, partners, placementStats, dashboardCharts] = await Promise.all([
      getJourneyStatsFn(),
      getHiringPartnersFn(),
      getPlacementStatsFn(),
      getDashboardChartsFn(),
    ]);
    return { stats, partners, placementStats, dashboardCharts };
  },
  head: () => ({
    meta: [
      { title: "REVA RACE — About RACE" },
      {
        name: "description",
        content:
          "REVA Academy for Corporate Excellence (RACE) aims to develop visionary enterprise leaders for corporates through progressive and integrated learning capabilities.",
      },
      { property: "og:title", content: "REVA RACE — About RACE" },
    ],
  }),
  component: HomePage,
});

const MandalaPattern = () => (
  <svg
    className="absolute -top-8 -right-8 w-36 h-36 text-white/10 pointer-events-none select-none"
    viewBox="0 0 120 120"
    fill="none"
    stroke="currentColor"
    strokeWidth="0.75"
  >
    <circle cx="60" cy="60" r="55" strokeDasharray="2 2" />
    <circle cx="60" cy="60" r="50" />
    <circle cx="60" cy="60" r="45" />
    <circle cx="60" cy="60" r="35" strokeDasharray="3 3" />
    <circle cx="60" cy="60" r="25" />
    <circle cx="60" cy="60" r="15" />
    <circle cx="60" cy="60" r="8" />
    
    {Array.from({ length: 16 }).map((_, i) => {
      const angle = (i * 360) / 16;
      return (
        <g key={i} transform={`rotate(${angle} 60 60)`}>
          <line x1="60" y1="10" x2="60" y2="110" opacity="0.5" />
          <path d="M60,10 C63,20 57,20 60,10 Z" fill="currentColor" opacity="0.3" />
          <path d="M60,25 C64,35 56,35 60,25 Z" />
          <path d="M60,35 C65,45 55,45 60,35 Z" fill="currentColor" opacity="0.2" />
          <circle cx="60" cy="18" r="1.5" fill="currentColor" />
        </g>
      );
    })}
  </svg>
);

import { Award, Users, Briefcase, GraduationCap, Building, CheckCircle, ChevronRight, ArrowRight, Quote, Shield, Cpu } from "lucide-react";

function StatItem({ value, label, icon: Icon }: { value: string; label: string; icon: any }) {
  return (
    <div className="flex flex-col items-center justify-center text-center px-6 py-6 border-b border-black/5 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0 border-dashed md:border-solid hover:bg-neutral-50/50 transition-colors duration-300">
      <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#FFFBDC] text-[#FF5900] mb-3 shadow-sm border border-[#FFAA6E]/10">
        <Icon className="h-6 w-6" />
      </div>
      <span className="text-4xl font-black text-[#FF5900] tracking-tight leading-none">
        {value}
      </span>
      <span className="mt-2 text-xs font-bold text-neutral-800 leading-tight max-w-[150px]">
        {label}
      </span>
    </div>
  );
}

function ProgramCard({ title, icon: Icon, tag, description, duration, mode, link }: {
  title: string;
  icon: any;
  tag: string;
  description: string;
  duration: string;
  mode: string;
  link: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-black/5 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md flex flex-col justify-between group">
      <div className="absolute top-0 left-0 h-1.5 w-full bg-gradient-to-r from-[#FF8237] to-[#FF5900]" />
      <div>
        <div className="flex items-center justify-between">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[#FFFBDC] text-[#FF5900] border border-[#FFAA6E]/10">
            <Icon className="h-5 w-5" />
          </div>
          <span className="rounded-full bg-[#1E3E62]/10 px-2.5 py-0.5 text-[10px] font-bold text-[#1E3E62] uppercase tracking-wider">
            {tag}
          </span>
        </div>
        <h4 className="mt-4 text-lg font-extrabold text-neutral-900 tracking-tight leading-snug">
          {title}
        </h4>
        <p className="mt-2 text-xs leading-relaxed text-neutral-600 font-medium">
          {description}
        </p>
      </div>
      <div className="mt-6 pt-4 border-t border-black/5 flex items-center justify-between">
        <div className="text-[11px] text-neutral-500 font-semibold">
          <span>🕒 {duration}</span>
          <span className="mx-2">•</span>
          <span>💻 {mode}</span>
        </div>
        {link.startsWith("http") ? (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-bold text-[#FF5900] hover:text-[#e04f00] transition-colors"
          >
            Explore <ChevronRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
          </a>
        ) : (
          <Link
            to={link}
            className="inline-flex items-center gap-1 text-xs font-bold text-[#FF5900] hover:text-[#e04f00] transition-colors"
          >
            Explore <ChevronRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        )}
      </div>
    </div>
  );
}

const iconMap: Record<string, any> = {
  GraduationCap,
  Users,
  Award,
  Building,
  Briefcase
};

function HomePage() {
  const { stats, partners, placementStats, dashboardCharts } = Route.useLoaderData() as {
    stats: any[];
    partners: any[];
    placementStats: any[];
    dashboardCharts: any[];
  };
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  return (
    <div className="min-h-screen bg-white font-sans antialiased">
      {/* Top Navigation */}
      <div className="border-b-[3px] border-[#FF5900] bg-[#FFFBDC] text-neutral-800 shadow-sm sticky top-0 z-50 backdrop-blur-md bg-opacity-95">
        <div className="mx-auto flex max-w-6xl flex-row items-center justify-between px-4 py-3">
          <Link to="/" className="inline-flex items-center gap-2 hover:opacity-95 transition-opacity">
            <img
              src="/image/reva_logi.png"
              alt="REVA University"
              className="h-14 sm:h-16 w-auto object-contain"
            />
          </Link>
          <SiteNav variant="light" />
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-4 py-8 md:py-12">
        {/* Section 1: Hero Banner */}
        <section className="relative rounded-3xl bg-white p-8 md:p-12 shadow-sm border border-black/5 overflow-hidden mb-12">
          {/* Subtle mesh background effect */}
          <div className="absolute inset-0 opacity-40 pointer-events-none bg-[radial-gradient(circle_at_top_right,rgba(255,211,165,0.4),transparent_50%),radial-gradient(circle_at_bottom_left,rgba(255,240,220,0.5),transparent_50%)]" />
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center max-w-6xl mx-auto relative z-10">
            {/* Left content column */}
            <div className="md:col-span-7 text-left flex flex-col justify-center">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FF5900]/10 px-3 py-1 text-xs font-bold text-[#FF5900] border border-[#FF5900]/15">
                  🎓 Developing Visionary Enterprise Leaders
                </span>
              </div>
              <h1 className="mt-6 text-3xl sm:text-4xl md:text-5xl font-black text-neutral-900 tracking-tight leading-tight">
                REVA Academy for
                <br />
                <span className="bg-gradient-to-r from-[#FF5900] to-[#FF8237] bg-clip-text text-transparent">Corporate Excellence</span>
              </h1>
              <p className="mt-4 text-sm sm:text-base leading-relaxed text-neutral-600 font-medium max-w-xl">
                Progressive and integrated learning capabilities for working professionals. Specialized techno-functional and interdisciplinary programs designed to suit the needs of working professionals.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Link
                  to="/candidates"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1E3E62] px-6 py-3.5 text-xs font-bold text-white shadow-md hover:bg-[#12223A] hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 cursor-pointer w-fit font-sans tracking-wider uppercase"
                >
                  Explore Cohort Candidates <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/contact-us"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-black/10 bg-white px-6 py-3.5 text-xs font-bold text-neutral-700 shadow-sm hover:bg-neutral-50 hover:border-black/20 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer w-fit font-sans tracking-wider uppercase"
                >
                  <Phone className="h-3.5 w-3.5 text-[#FF5900]" /> Contact Admissions
                </Link>
              </div>
              <div className="mt-8 flex flex-col sm:flex-row gap-y-2 sm:gap-x-6 text-xs text-neutral-700 font-bold border-t border-black/5 pt-6">
                <span className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-[#2ecc71]" />
                  Industry Expert Mentors
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-[#2ecc71]" />
                  Globally Recognized Certifications
                </span>
              </div>
            </div>

            {/* Right tilted card column */}
            <div className="md:col-span-5 flex justify-center md:justify-end">
              <div className="relative w-full max-w-[420px] aspect-[1024/768] rounded-2xl p-2 bg-gradient-to-br from-[#FFFBDC] to-[#FFD3A5] shadow-lg border border-[#FFAA6E]/30">
                <div className="w-full h-full bg-[#f2f2f2] rounded-xl flex items-center justify-center overflow-hidden relative shadow-inner">
                  <img
                    src="/image/cohort_group.jpg"
                    alt="RACE Cohort Group"
                    className="w-full h-full object-cover rounded-xl"
                  />
                  {/* Glassmorphism badge overlay */}
                  <div className="absolute bottom-3 left-3 right-3 bg-black/60 backdrop-blur-md border border-white/10 rounded-lg p-3 text-white flex items-center justify-between">
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-[#FFD3A5] font-black">Executive Cohort</p>
                      <p className="text-xs font-bold">M.Tech / M.Sc AI & Cybersecurity</p>
                    </div>
                    <span className="rounded bg-[#FF5900] px-2 py-0.5 text-[9px] font-black uppercase">2026</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Core Programs Showcase */}
        <section className="mt-16">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-3xl font-black text-neutral-900 tracking-tight">
              Featured Executive Cohorts
            </h2>
            <p className="text-sm text-neutral-500 mt-2 font-medium">
              Transformative postgraduate programs designed specifically for technologists and enterprise managers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ProgramCard
              title="M.Tech & M.Sc in Artificial Intelligence"
              icon={Cpu}
              tag="AI Engineering"
              description="Master advanced neural networks, deep learning perception pipelines, neural-fuzzy control navigation systems, and large language models (LLMs) with LangGraph frameworks."
              duration="2 Years"
              mode="Blended / Weekend Labs"
              link="https://race.reva.edu.in/pg-diploma-m-tech-in-artificial-intelligence"
            />
            <ProgramCard
              title="M.Tech & M.Sc in Cybersecurity"
              icon={Shield}
              tag="Security Operations"
              description="Learn defensive operations, threat identification, network access control (NAC), brute force mitigation, memory forensics, SIEM correlation dashboards, and GRC policies."
              duration="2 Years"
              mode="Blended / Weekend Labs"
              link="https://race.reva.edu.in/m-tech-in-cybersecurity/"
            />
          </div>
        </section>

        {/* Section 3: Our Journey So Far */}
        <section className="mt-20 pt-8 border-t border-black/5">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-black text-neutral-900 tracking-tight">
              Our Journey So Far
            </h2>
            <p className="text-sm text-neutral-500 mt-2 font-medium">
              Building excellence through proven results and industry partnerships
            </p>
          </div>

          {/* Stats Bar */}
          <div className="mt-8 bg-white border border-black/5 rounded-2xl shadow-sm grid grid-cols-1 md:grid-cols-5 divide-y md:divide-y-0 divide-black/5 divide-dashed overflow-hidden">
            {stats.map((stat, idx) => {
              const Icon = iconMap[stat.iconName] || GraduationCap;
              return (
                <StatItem
                  key={idx}
                  value={stat.value}
                  label={stat.label}
                  icon={Icon}
                />
              );
            })}
          </div>
        </section>

        {/* Section 3.5: Placement & Internship Highlights */}
        <section className="mt-20 pt-8 border-t border-black/5">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#1E3E62]/10 px-3 py-1 text-xs font-bold text-[#1E3E62] border border-[#1E3E62]/15">
              📊 Corporate Placement Track Record
            </span>
            <h2 className="text-3xl font-black text-neutral-900 tracking-tight mt-3">
              Placement & Internship Highlights
            </h2>
            <p className="text-sm text-neutral-500 mt-2 font-medium">
              Verified performance statistics across executive batches showing industry upskilling outcomes
            </p>
          </div>

          {/* Key Metrics Cards */}
          {(() => {
            const overall = placementStats.find(
              (r) => r.academicYear.toLowerCase() === "overall"
            ) || {
              avgStipend: "₹ 25,333.33",
              medianStipend: "₹ 27,500.00",
              highestStipend: "₹ 42,000.00",
              avgCtc: "₹ 8.00 LPA",
              medianCtc: "₹ 6.00 LPA",
              highestCtc: "₹ 39.76 LPA",
            };

            return (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                <div className="bg-white border border-black/5 p-5 rounded-2xl shadow-sm relative overflow-hidden group hover:shadow-md transition-all duration-300">
                  <div className="absolute top-0 left-0 h-1.5 w-full bg-[#FF5900]" />
                  <p className="text-[10px] font-black uppercase text-neutral-400 tracking-wider">Highest CTC Offered</p>
                  <p className="text-2xl font-black text-neutral-950 mt-2 tracking-tight">{overall.highestCtc}</p>
                  <p className="text-[10px] text-neutral-500 font-bold mt-1.5 uppercase">Record Package</p>
                </div>
                <div className="bg-white border border-black/5 p-5 rounded-2xl shadow-sm relative overflow-hidden group hover:shadow-md transition-all duration-300">
                  <div className="absolute top-0 left-0 h-1.5 w-full bg-[#1E3E62]" />
                  <p className="text-[10px] font-black uppercase text-neutral-400 tracking-wider">Highest Monthly Stipend</p>
                  <p className="text-2xl font-black text-neutral-950 mt-2 tracking-tight">{overall.highestStipend}</p>
                  <p className="text-[10px] text-neutral-500 font-bold mt-1.5 uppercase">Internship peak</p>
                </div>
                <div className="bg-white border border-black/5 p-5 rounded-2xl shadow-sm relative overflow-hidden group hover:shadow-md transition-all duration-300">
                  <div className="absolute top-0 left-0 h-1.5 w-full bg-emerald-500" />
                  <p className="text-[10px] font-black uppercase text-neutral-400 tracking-wider">Overall Average CTC</p>
                  <p className="text-2xl font-black text-neutral-950 mt-2 tracking-tight">{overall.avgCtc}</p>
                  <p className="text-[10px] text-neutral-500 font-bold mt-1.5 uppercase">All batches average</p>
                </div>
                <div className="bg-white border border-black/5 p-5 rounded-2xl shadow-sm relative overflow-hidden group hover:shadow-md transition-all duration-300">
                  <div className="absolute top-0 left-0 h-1.5 w-full bg-amber-500" />
                  <p className="text-[10px] font-black uppercase text-neutral-400 tracking-wider">Overall Avg Stipend</p>
                  <p className="text-2xl font-black text-neutral-950 mt-2 tracking-tight">{overall.avgStipend}</p>
                  <p className="text-[10px] text-neutral-500 font-bold mt-1.5 uppercase">Monthly internship average</p>
                </div>
              </div>
            );
          })()}
        </section>

        {/* Section 3.6: Historical Placement Analytics */}
        <section className="mt-16 border-t border-black/5 pt-12">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-600 border border-emerald-500/15">
              📈 Historical Year-on-Year Growth
            </span>
            <h2 className="text-3xl font-black text-neutral-900 tracking-tight mt-3">
              Executive Placement Analytics
            </h2>
            <p className="text-sm text-neutral-500 mt-2 font-medium">
              Verified year-by-year performance metrics displaying consistent transition achievements
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {dashboardCharts.map((chart) => (
              <div
                key={chart.id}
                className="bg-white border border-black/5 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300 relative flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-black text-neutral-900 tracking-tight">
                      {chart.title}
                    </h3>
                    <img src="/image/reva_logi.png" alt="REVA University" className="h-7 w-auto object-contain opacity-80" />
                  </div>

                  <div className="h-[250px] w-full mt-2 font-sans select-none">
                    {isMounted ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={chart.data}
                          margin={{ top: 20, right: 10, left: -20, bottom: 0 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f5" />
                          <XAxis
                            dataKey="year"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#737373', fontSize: 11, fontWeight: 'bold' }}
                          />
                          <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#737373', fontSize: 11, fontWeight: 'bold' }}
                          />
                          <Tooltip
                            cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                            contentStyle={{
                              background: '#ffffff',
                              border: '1px solid rgba(0,0,0,0.05)',
                              borderRadius: '12px',
                              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                              fontSize: '11px',
                              fontWeight: 'bold',
                            }}
                            formatter={(value: any, name: any, props: any) => {
                              const point = props.payload;
                              const displayVal = point.hasAsterisk ? `${value}*` : `${value}`;
                              return [displayVal, chart.title];
                            }}
                          />
                          <Bar
                            dataKey="value"
                            fill={chart.color || "#3b82f6"}
                            radius={[8, 8, 0, 0]}
                            maxBarSize={45}
                          >
                            <LabelList
                              dataKey="value"
                              content={(props: any) => {
                                const { x, y, width, value, index } = props;
                                const point = chart.data[index];
                                const labelText = point?.hasAsterisk ? `${value}*` : `${value}`;
                                return (
                                  <text
                                    x={x + width / 2}
                                    y={y - 8}
                                    fill="#404040"
                                    textAnchor="middle"
                                    fontSize={10}
                                    fontWeight="extrabold"
                                    className="font-sans"
                                  >
                                    {labelText}
                                  </text>
                                );
                              }}
                            />
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full w-full bg-neutral-50 rounded-2xl flex items-center justify-center text-xs text-neutral-400 font-bold">
                        Loading charts...
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-black/5 flex flex-col gap-1 text-[10px] text-neutral-500 font-semibold italic text-left">
                  {chart.footnote1 && <p>{chart.footnote1}</p>}
                  {chart.footnote2 && <p>{chart.footnote2}</p>}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 4: Detailed About & Infographics */}
        <section className="mt-20 grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          {/* Left Column: About Copy & Key Features */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            <div>
              <h3 className="text-2xl font-black text-neutral-900 tracking-tight">
                About RACE
              </h3>
              <div className="mt-4 space-y-4 text-sm leading-relaxed text-neutral-600 font-medium">
                <p>
                  REVA Academy for Corporate Excellence (RACE) aims to develop
                  visionary enterprise leaders for corporates through progressive
                  and integrated learning capabilities.
                </p>
                <p>
                  RACE offers best in class, specialized, techno-functional
                  and interdisciplinary programs designed to suit the needs of
                  working professionals. The pedagogy of each program
                  incorporates social and experiential learning to build
                  transformative proficiencies in every participant.
                </p>
              </div>
            </div>

            {/* Vision & Mission Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="border border-black/5 bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex items-center gap-2 mb-2.5">
                  <span className="text-xl">👁️</span>
                  <h4 className="text-base font-bold text-neutral-900">
                    Vision
                  </h4>
                </div>
                <p className="text-xs leading-relaxed text-neutral-600 font-medium">
                  Become the Most Preferred Partner for Training for fast rising executives and organizations globally.
                </p>
              </div>

              <div className="border border-black/5 bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex items-center gap-2 mb-2.5">
                  <span className="text-xl">🎯</span>
                  <h4 className="text-base font-bold text-neutral-900">
                    Mission
                  </h4>
                </div>
                <p className="text-xs leading-relaxed text-neutral-600 font-medium">
                  Developing Visionary Enterprise Leaders for Corporates through Progressive and Integrated Learning Capabilities.
                </p>
              </div>
            </div>

            {/* Key Features Block */}
            <div className="border border-[#FFAA6E]/20 bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-neutral-900 mb-4">
                Program Deliverables & Facilities
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  "Blended mode with lab-based training",
                  "24/7 online infrastructure support",
                  "Learning Management System portal",
                  "Global industry certifications",
                  "REVA University PG degrees",
                  "Lateral placement support & mentoring"
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-2.5">
                    <CheckCircle className="h-4 w-4 text-[#FF5900] shrink-0" />
                    <span className="text-xs font-semibold text-neutral-700">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column: Campus Infrastructure */}
          <div className="lg:col-span-5 flex">
            <div className="relative overflow-hidden rounded-2xl shadow-sm border border-black/5 bg-white p-1.5 w-full flex flex-col">
              <div className="relative flex-1 overflow-hidden rounded-xl">
                <img
                  src="https://cdn-jpdgb.nitrocdn.com/SyCLsjAPcuzwEUWABFirEXZfDnNPauQf/assets/images/optimized/rev-5c4d3b2/race.reva.edu.in/wp-content/uploads/careerpage-infra.png"
                  alt="REVA University Library Infrastructure"
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
              <div className="p-4 bg-neutral-50 rounded-b-xl border-t border-black/5 mt-1.5 text-center">
                <p className="text-xs font-bold text-neutral-800">State-of-the-art Learning Infrastructure</p>
                <p className="text-[10px] text-neutral-500 font-semibold mt-0.5">REVA Campus, Yelahanka, Bangalore</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: Corporate Endorsements */}
        <section className="mt-20">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-3xl font-black text-neutral-900 tracking-tight">
              Recruiter & Industry Testimonials
            </h2>
            <p className="text-sm text-neutral-500 mt-2 font-medium">
              What corporate partners say about hiring REVA RACE graduates
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-black/5 p-6 rounded-2xl shadow-sm relative flex flex-col justify-between">
              <Quote className="absolute right-4 top-4 h-16 w-16 text-neutral-100 -z-0 pointer-events-none" />
              <div className="relative z-10">
                <p className="text-xs italic text-neutral-600 font-medium leading-relaxed">
                  "The M.Tech candidates from REVA RACE show exceptional readiness for practical deployments. Their projects, especially in network traffic anomaly detection and AI policy automation, align exactly with what enterprise security groups look for."
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-black/5 flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-[#FFFBDC] flex items-center justify-center font-bold text-[#FF5900] text-xs">
                  TL
                </div>
                <div>
                  <h5 className="text-xs font-black text-neutral-900">Security Operations Director</h5>
                  <p className="text-[10px] text-neutral-500 font-bold">L&T Technology Services</p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-black/5 p-6 rounded-2xl shadow-sm relative flex flex-col justify-between">
              <Quote className="absolute right-4 top-4 h-16 w-16 text-neutral-100 -z-0 pointer-events-none" />
              <div className="relative z-10">
                <p className="text-xs italic text-neutral-600 font-medium leading-relaxed">
                  "RACE professionals combine corporate experience with deep technical upskilling. Their expertise in neural network perceptions and deep learning models makes them high-value assets from Day One."
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-black/5 flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-[#FFFBDC] flex items-center justify-center font-bold text-[#FF5900] text-xs">
                  AE
                </div>
                <div>
                  <h5 className="text-xs font-black text-neutral-900">Lead AI Systems Architect</h5>
                  <p className="text-[10px] text-neutral-500 font-bold">Hindustan Aeronautics Limited</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 6: RACE Values */}
        <section className="mt-20 pt-8 border-t border-black/5">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-3xl font-black text-neutral-900 tracking-tight">
              RACE Values
            </h2>
            <p className="text-sm text-neutral-500 mt-2 font-medium">
              The fundamental principles guiding our academic delivery and student leadership
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Respect */}
            <div className="relative bg-[#b22a29] rounded-2xl p-6 shadow-md overflow-hidden min-h-[280px] flex flex-col justify-between group hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300">
              <MandalaPattern />
              <div className="relative z-10">
                <div className="flex items-start gap-1 text-white">
                  <span className="text-6xl font-black leading-none tracking-tighter">R</span>
                  <div className="mt-1 flex flex-col justify-start">
                    <span className="text-lg font-bold tracking-wider leading-none">ESPECT</span>
                    <span className="text-[11px] font-semibold mt-1 opacity-90 leading-none">Each Other</span>
                  </div>
                </div>
                <hr className="mt-4 border-white/20" />
                <div className="mt-4 text-xs font-semibold text-white/95 leading-relaxed space-y-3">
                  <p>Everyone in your life has a role to play in your success.</p>
                  <p>Earn respect. Your actions are watched, and are louder than your words.</p>
                </div>
              </div>
            </div>

            {/* Accountability */}
            <div className="relative bg-[#008696] rounded-2xl p-6 shadow-md overflow-hidden min-h-[280px] flex flex-col justify-between group hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300">
              <MandalaPattern />
              <div className="relative z-10">
                <div className="flex items-start gap-1 text-white">
                  <span className="text-6xl font-black leading-none tracking-tighter">A</span>
                  <div className="mt-1 flex flex-col justify-start">
                    <span className="text-base font-bold tracking-wider leading-none">CCOUNTABILITY</span>
                    <span className="text-[11px] font-semibold mt-1 opacity-90 leading-none">and Ownership</span>
                  </div>
                </div>
                <hr className="mt-4 border-white/20" />
                <div className="mt-4 text-xs font-semibold text-white/95 leading-relaxed space-y-3">
                  <p>Love your role in building the organization.</p>
                  <p>It is not only what we do, but also what we do not do for which we are accountable.</p>
                </div>
              </div>
            </div>

            {/* Customer */}
            <div className="relative bg-[#f0852d] rounded-2xl p-6 shadow-md overflow-hidden min-h-[280px] flex flex-col justify-between group hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300">
              <MandalaPattern />
              <div className="relative z-10">
                <div className="flex items-start gap-1 text-white">
                  <span className="text-6xl font-black leading-none tracking-tighter">C</span>
                  <div className="mt-1 flex flex-col justify-start">
                    <span className="text-lg font-bold tracking-wider leading-none">USTOMER</span>
                    <span className="text-[11px] font-semibold mt-1 opacity-90 leading-none">Service</span>
                  </div>
                </div>
                <hr className="mt-4 border-white/20" />
                <div className="mt-4 text-xs font-semibold text-white/95 leading-relaxed space-y-3">
                  <p>The reason you are here is because of your customer.</p>
                  <p>It takes months to find a customer, seconds to lose one.</p>
                  <p>Create "WoW" customer experience.</p>
                </div>
              </div>
            </div>

            {/* Execution */}
            <div className="relative bg-[#3f4f81] rounded-2xl p-6 shadow-md overflow-hidden min-h-[280px] flex flex-col justify-between group hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300">
              <MandalaPattern />
              <div className="relative z-10">
                <div className="flex items-start gap-1 text-white">
                  <span className="text-6xl font-black leading-none tracking-tighter">E</span>
                  <div className="mt-1 flex flex-col justify-start">
                    <span className="text-lg font-bold tracking-wider leading-none">XECUTION</span>
                    <span className="text-[11px] font-semibold mt-1 opacity-90 leading-none">with Excellence</span>
                  </div>
                </div>
                <hr className="mt-4 border-white/20" />
                <div className="mt-4 text-xs font-semibold text-white/95 leading-relaxed space-y-3">
                  <p>Benchmark high, plan well, align resources and implement with brilliance.</p>
                  <p>Excellence is not a skill, it's an attitude.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 7: Hiring Partners */}
        <section className="mt-20 pt-8 border-t border-black/5">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-3xl font-black text-neutral-900 tracking-tight">
              <Link to="/hiring-partners" className="hover:text-[#FF5900] transition-colors inline-flex items-center gap-2.5 group">
                Hiring Partners
                <ArrowRight className="h-6 w-6 text-neutral-400 group-hover:text-[#FF5900] group-hover:translate-x-1 transition-all duration-200" />
              </Link>
            </h2>
            <p className="text-sm text-neutral-500 mt-2 font-medium">
              Collaborating with global technology leaders, enterprise advisors, and research groups to recruit and mentor our elite talent.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {partners.slice(0, 6).map((partner, idx) => (
              <div key={idx} className="border border-black/5 bg-white rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">
                <div className="flex items-center justify-between">
                  <div className="h-11 w-24 flex items-center justify-start shrink-0 overflow-hidden select-none">
                    {partner.logoUrl ? (
                      <img src={partner.logoUrl} alt={partner.name} className="h-full w-auto object-contain max-h-10 rounded-lg" />
                    ) : (
                      <div className={`h-11 w-11 rounded-xl bg-gradient-to-br ${partner.themeColor} text-white font-black text-lg flex items-center justify-center shadow-sm shrink-0`}>
                        {partner.logoLetter || partner.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <span className="rounded bg-[#FFFBDC] border border-[#FFAA6E]/15 px-2.5 py-0.5 text-[9px] font-black uppercase text-neutral-700 tracking-wider leading-none">
                    {partner.category}
                  </span>
                </div>
                <div className="mt-6">
                  <h4 className="text-sm font-extrabold text-neutral-900 tracking-tight">{partner.name}</h4>
                  <p className="mt-1 text-[11px] text-neutral-500 font-semibold line-clamp-2">{partner.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              to="/hiring-partners"
              className="inline-flex items-center gap-2 rounded-xl bg-[#1E3E62] px-6 py-3 text-xs font-black tracking-wider text-white shadow-md hover:bg-[#12223A] transition duration-200 uppercase cursor-pointer"
            >
              View All Hiring Partners <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-black/5 bg-white mt-20">
        <div className="mx-auto max-w-6xl px-6 py-8 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 font-bold">
          <div>© REVA University · RACE Department · race.reva.edu.in</div>
          <div className="flex gap-4 mt-4 sm:mt-0">
            <Link to="/candidates" className="hover:text-[#FF5900] transition-colors">Placement Candidates</Link>
            <Link to="/contact-us" className="hover:text-[#FF5900] transition-colors">Contact Admissions</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

