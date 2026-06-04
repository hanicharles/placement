import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteNav } from "@/components/site-nav";
import {
  ArrowLeft,
  X,
  Download,
  Linkedin,
  Mail,
  Phone,
  BadgeCheck,
  MapPin,
  Github,
  GraduationCap,
  Award,
  Briefcase,
  FolderGit2,
  FileText,
  Copy,
  Check,
  Wrench,
  Eye,
} from "lucide-react";
import { type Student } from "@/data/students";
import { getStudentBySlugFn, checkSessionFn } from "../actions";

export const Route = createFileRoute("/profile/$slug")({
  loader: async ({ params }) => {
    const student = await getStudentBySlugFn({ data: params.slug });
    if (!student) throw notFound();
    return { student };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `${loaderData.student.name} — REVA RACE` : "Profile — REVA RACE" },
      {
        name: "description",
        content: loaderData?.student.about ?? "REVA RACE candidate profile",
      },
    ],
  }),
  component: ProfilePage,
  notFoundComponent: () => (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-sm text-muted-foreground">Profile not found.</p>
    </div>
  ),
});

function ProfilePage() {
  const { student: serverStudent } = Route.useLoaderData() as { student: Student };
  const [student, setStudent] = useState<Student>(serverStudent);

  useEffect(() => {
    setStudent(serverStudent);
  }, [serverStudent]);

  const isPlaced = !!student.placement;
  const [photoOpen, setPhotoOpen] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    checkSessionFn().then((res) => setIsAdmin(res.isAuthenticated));
  }, []);

  useEffect(() => {
    if (!photoOpen) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPhotoOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [photoOpen]);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(type);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const programUrl =
    student.specialization === "Artificial Intelligence"
      ? "https://race.reva.edu.in/pg-diploma-m-tech-in-artificial-intelligence"
      : "https://race.reva.edu.in/";

  const softSkillsGroup = student.skills.find((g) => g.category.toLowerCase().includes("soft"));
  const tableSkillGroups = student.skills.filter((g) => g !== softSkillsGroup);

  const patentItems = (student.publications ?? []).filter((p) => /patent/i.test(p));
  const publicationItems = (student.publications ?? []).filter((p) => !/patent/i.test(p));

  return (
    <div className="min-h-screen bg-white pb-16 font-sans">
      {/* Custom print stylesheet overrides */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @media print {
              body {
                background: white !important;
                color: #111111 !important;
                font-size: 11px !important;
              }
              .no-print {
                display: none !important;
              }
              .print-container {
                width: 100% !important;
                max-width: 100% !important;
                padding: 0 !important;
                margin: 0 !important;
                box-shadow: none !important;
                border: none !important;
              }
              .print-grid {
                display: grid !important;
                grid-template-columns: 1fr 2fr !important;
                gap: 1.5rem !important;
              }
              .print-section {
                page-break-inside: avoid;
                margin-bottom: 1.5rem !important;
              }
              .print-header {
                background: #1E3E62 !important;
                color: white !important;
                border-bottom: 4px solid #F9BF29 !important;
                padding: 1.5rem !important;
                margin-bottom: 1.5rem !important;
              }
              .print-text-dark {
                color: #1E3E62 !important;
              }
              .print-border-dark {
                border-color: #1E3E62 !important;
              }
            }
          `,
        }}
      />

      {/* Enlarge photo overlay */}
      {student.photo && (
        <div
          aria-hidden={!photoOpen}
          className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-200 no-print ${
            photoOpen ? "opacity-100 animate-fade-in" : "pointer-events-none opacity-0"
          }`}
        >
          <div className="absolute inset-0 bg-black/65 backdrop-blur-sm" onMouseDown={() => setPhotoOpen(false)} />
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`Profile photo of ${student.name}`}
            className={`group relative z-10 w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl transition-all duration-300 ${
              photoOpen ? "translate-y-0 scale-100" : "translate-y-2 scale-95"
            }`}
          >
            <button
              type="button"
              onClick={() => setPhotoOpen(false)}
              aria-label="Close"
              className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition hover:bg-black/55 focus:outline-none"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="bg-gradient-to-b from-black/10 to-transparent px-6 pb-4 pt-5">
              <p className="text-sm font-bold text-neutral-800">{student.name}</p>
            </div>
            <div className="px-6 pb-6">
              <div className="relative overflow-hidden rounded-xl bg-black/5">
                <img
                  src={student.photo}
                  alt={student.name}
                  className="max-h-[70vh] w-full object-contain mx-auto"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Top bar (Hidden in print) */}
      <div className="border-b-[3px] border-[#F9BF29] bg-[#12223A] text-white no-print sticky top-0 z-50">
        <div className="mx-auto flex max-w-5xl flex-row items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Link
              to="/candidates"
              className="inline-flex items-center gap-1.5 rounded border border-white/20 bg-white/5 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-white/10 transition shadow-sm mr-2"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back
            </Link>
            <SiteNav variant="dark" />
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white rounded px-2.5 py-1 flex items-center justify-center h-12">
              <img src="/image/reva_logi.png" alt="REVA University" className="h-full w-auto object-contain" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="relative mx-auto max-w-5xl px-4 py-8 md:py-12 print-container">
        <div className="mx-auto overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm print-card-layout">
          
          {/* Executive Header Banner */}
          <header className="rounded-t-2xl bg-[#1E3E62] p-6 sm:p-8 border-b-4 border-[#F9BF29] text-white relative overflow-hidden print-header">
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, #ffffff 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
            
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between relative z-10">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="rounded bg-gradient-to-r from-amber-400 to-[#F9BF29] text-[#12223A] text-[9px] font-black uppercase tracking-wider px-2 py-0.5 shadow-sm">
                    {student.specialization}
                  </span>
                  {isPlaced && (
                    <span className="rounded bg-emerald-600 text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 shadow-sm flex items-center gap-0.5">
                      <Award className="h-3 w-3" /> Placed
                    </span>
                  )}
                  <span className="rounded bg-white/10 text-white/90 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 border border-white/10">
                    Verified Candidate
                  </span>
                </div>
                <h1 className="text-3xl font-black tracking-wide leading-none uppercase">
                  {student.name}
                </h1>
                <div className="mt-2 text-base font-bold text-[#F9BF29] tracking-wide">{student.headline}</div>
                
                {student.placement && (
                  <div className="mt-2.5 inline-flex items-center gap-2 rounded-lg bg-emerald-600/80 border border-emerald-500/50 text-white px-3 py-1.5 text-xs font-bold shadow-inner backdrop-blur-sm select-none">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-200"></span>
                    </span>
                    <span><span className="text-[#F9BF29] font-black">{student.placement.company}</span> as <span className="italic text-[#FFFBDC]">{student.placement.role}</span></span>
                  </div>
                )}
                
                {student.location && (
                  <p className="mt-2 text-xs font-semibold text-white/80 flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-[#F9BF29]" /> {student.location}
                  </p>
                )}
              </div>

              {/* Photo & Actions Box */}
              <div className="flex shrink-0 flex-col sm:flex-row md:flex-col items-center gap-4 sm:items-end md:items-center">
                {student.photo ? (
                  <button
                    type="button"
                    onClick={() => setPhotoOpen(true)}
                    className="focus:outline-none no-print"
                    title="Click to view full image"
                  >
                    <div className="group relative overflow-hidden rounded-xl border-3 border-[#F9BF29] shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
                      <img src={student.photo} alt={student.name} className="h-32 w-32 object-cover transition-transform duration-200 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-black/0 transition-colors duration-200 group-hover:bg-black/10 flex items-center justify-center">
                        <Eye className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  </button>
                ) : (
                  <div className="flex h-32 w-32 items-center justify-center rounded-xl border-3 border-[#F9BF29] bg-white/15 text-3xl font-black text-[#F9BF29] shadow-md">
                    {student.name.split(" ").map((p) => p[0]).slice(0, 2).join("")}
                  </div>
                )}
                
                <div className="flex flex-row md:flex-col gap-2 no-print">
                  {student.resume && (
                    <a
                      href={student.resume}
                      download={`${student.slug}-resume.pdf`}
                      className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#F9BF29] text-[#12223A] px-4 py-2 text-xs font-bold tracking-wider hover:bg-[#e0ab24] shadow-sm transition"
                    >
                      <Download className="h-3.5 w-3.5" /> DOWNLOAD CV
                    </a>
                  )}
                  <a
                    href={programUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-white/10 px-4 py-2 text-xs font-semibold tracking-wider text-white border border-white/20 hover:bg-white/20 transition"
                  >
                    ABOUT COURSE
                  </a>
                </div>
              </div>
            </div>
          </header>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 p-6 sm:p-10 print-grid">
            
            {/* Left Sidebar Column (35%) */}
            <div className="md:col-span-4 space-y-6">
              
              {/* Contact Info Card */}
              <div className="border border-black/5 bg-[#fafafa]/40 rounded-xl p-5 shadow-inner print-section">
                <h4 className="text-[10px] font-black uppercase tracking-wider text-neutral-400 mb-3.5">Contact Details</h4>
                <ul className="space-y-3.5 text-xs font-semibold text-neutral-700">
                  {student.email && (
                    <li className="flex items-center justify-between group">
                      <a
                        href={`mailto:${student.email}`}
                        className="inline-flex items-center gap-2 hover:text-[#FF5900] transition-colors truncate"
                      >
                        <Mail className="h-4 w-4 text-[#1E3E62] shrink-0" />
                        <span className="truncate">{student.email}</span>
                      </a>
                      <button
                        onClick={() => copyToClipboard(student.email!, "email")}
                        className="text-neutral-400 hover:text-neutral-600 transition ml-2 no-print shrink-0"
                        title="Copy to clipboard"
                      >
                        {copiedText === "email" ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                      </button>
                    </li>
                  )}
                  {student.collegeEmail && (
                    <li className="flex items-center justify-between group">
                      <a
                        href={`mailto:${student.collegeEmail}`}
                        className="inline-flex items-center gap-2 hover:text-[#FF5900] transition-colors truncate"
                      >
                        <Mail className="h-4 w-4 text-[#1E3E62] shrink-0" />
                        <span className="truncate">Col: {student.collegeEmail}</span>
                      </a>
                      <button
                        onClick={() => copyToClipboard(student.collegeEmail!, "colEmail")}
                        className="text-neutral-400 hover:text-neutral-600 transition ml-2 no-print shrink-0"
                        title="Copy to clipboard"
                      >
                        {copiedText === "colEmail" ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                      </button>
                    </li>
                  )}
                  {student.phone && (
                    <li className="flex items-center justify-between group">
                      <a
                        href={`tel:${student.phone}`}
                        className="inline-flex items-center gap-2 hover:text-[#FF5900] transition-colors"
                      >
                        <Phone className="h-4 w-4 text-[#1E3E62] shrink-0" />
                        <span>{student.phone}</span>
                      </a>
                      <button
                        onClick={() => copyToClipboard(student.phone!, "phone")}
                        className="text-neutral-400 hover:text-neutral-600 transition ml-2 no-print shrink-0"
                        title="Copy to clipboard"
                      >
                        {copiedText === "phone" ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                      </button>
                    </li>
                  )}
                  {student.linkedin && (
                    <li className="border-t border-black/5 pt-3">
                      <a
                        href={student.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 hover:text-[#FF5900] transition-colors truncate w-full"
                      >
                        <Linkedin className="h-4 w-4 text-[#1E3E62] shrink-0" />
                        <span className="truncate text-[11px]">{student.name}</span>
                      </a>
                    </li>
                  )}
                  {student.github && (
                    <li>
                      <a
                        href={student.github}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 hover:text-[#FF5900] transition-colors truncate w-full"
                      >
                        <Github className="h-4 w-4 text-[#1E3E62] shrink-0" />
                        <span className="truncate text-[11px]">{student.name}</span>
                      </a>
                    </li>
                  )}
                </ul>
              </div>

              {/* Education Sidebar List */}
              <div className="print-section">
                <h4 className="text-[10px] font-black uppercase tracking-wider text-[#1E3E62] mb-3 pb-1 border-b border-[#1E3E62]/10 print-text-dark print-border-dark flex items-center gap-1.5">
                  <GraduationCap className="h-3.5 w-3.5 text-[#FF5900]" /> Education Timeline
                </h4>
                <div className="space-y-4">
                  {student.education.map((e, idx) => (
                    <div key={idx} className="border border-black/5 bg-white p-3 rounded-lg">
                      <span className="text-[9px] font-black text-neutral-400 uppercase block">{e.period}</span>
                      <p className="text-xs font-black text-neutral-900 leading-snug mt-1">{e.degree}</p>
                      <p className="text-[10px] text-neutral-500 font-semibold mt-0.5 leading-snug">{e.institute}</p>
                      {e.cgpa && (
                        <span className="inline-block mt-2 rounded bg-neutral-100 border border-black/5 px-2 py-0.5 text-[9px] font-bold text-neutral-600">
                          CGPA: {e.cgpa}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Technical Core Skills (grouped) */}
              <div className="print-section">
                <h4 className="text-[10px] font-black uppercase tracking-wider text-[#1E3E62] mb-3 pb-1 border-b border-[#1E3E62]/10 print-text-dark print-border-dark flex items-center gap-1.5">
                  <Wrench className="h-3.5 w-3.5 text-[#FF5900]" /> Core Technical Skills
                </h4>
                <div className="space-y-4">
                  {tableSkillGroups.map((g) => (
                    <div key={g.category} className="border border-black/5 bg-white p-3 rounded-lg">
                      <span className="text-[10px] font-black text-[#1E3E62] uppercase tracking-wider block mb-1.5">{g.category}</span>
                      <div className="flex flex-wrap gap-1">
                        {g.items.map((item) => (
                          <span
                            key={item}
                            className="rounded bg-[#FFFBDC]/60 border border-[#FFAA6E]/15 px-2 py-0.5 text-[10px] text-neutral-700 font-bold"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                  
                  {softSkillsGroup && softSkillsGroup.items.length > 0 && (
                    <div className="border border-black/5 bg-white p-3 rounded-lg">
                      <span className="text-[10px] font-black text-neutral-500 uppercase tracking-wider block mb-1.5">Interpersonal Soft Skills</span>
                      <p className="text-[11px] text-neutral-600 font-bold leading-relaxed">{softSkillsGroup.items.join(", ")}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Professional Certifications */}
              {student.certifications.length > 0 && (
                <div className="print-section">
                  <h4 className="text-[10px] font-black uppercase tracking-wider text-[#1E3E62] mb-3 pb-1 border-b border-[#1E3E62]/10 print-text-dark print-border-dark flex items-center gap-1.5">
                    <Award className="h-3.5 w-3.5 text-[#FF5900]" /> Certifications
                  </h4>
                  <ul className="space-y-2 text-xs text-neutral-600 font-semibold list-disc pl-4 leading-normal">
                    {student.certifications.map((c) => (
                      <li key={c}>{c}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Right Main Column (65%) */}
            <div className="md:col-span-8 space-y-8">
              
              {/* Profile Summary */}
              <section className="print-section space-y-4">
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wider text-[#1E3E62] mb-3 pb-1 border-b border-[#1E3E62]/10 flex items-center gap-2 print-text-dark print-border-dark">
                    <BadgeCheck className="h-4.5 w-4.5 text-[#FF5900]" /> Professional Profile
                  </h3>
                  <p className="text-sm text-neutral-700 leading-relaxed text-justify whitespace-pre-line font-medium">
                    {student.about}
                  </p>
                </div>

                {student.resume && (
                  <div className="pt-1.5 no-print">
                    <a
                      href={student.resume}
                      download={`${student.slug}-resume.pdf`}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#F9BF29] text-[#12223A] px-5 py-3 text-xs font-black tracking-wider hover:bg-[#e0ab24] shadow-sm hover:shadow-md transition duration-200 uppercase"
                    >
                      <Download className="h-4 w-4 stroke-[3]" /> Download CV
                    </a>
                  </div>
                )}
              </section>

              {/* Work Experience */}
              {student.workExperience && student.workExperience.length > 0 && (
                <section className="print-section">
                  <h3 className="text-sm font-black uppercase tracking-wider text-[#1E3E62] mb-4 pb-1 border-b border-[#1E3E62]/10 flex items-center gap-2 print-text-dark print-border-dark">
                    <Briefcase className="h-4.5 w-4.5 text-[#FF5900]" /> Professional Experience
                  </h3>
                  <div className="space-y-6">
                    {student.workExperience.map((w, i) => (
                      <div key={i} className="relative pl-5 border-l-2 border-dashed border-[#1E3E62]/20 last:border-l-0 pb-1">
                        <div className="absolute -left-[6px] top-1.5 h-2.5 w-2.5 rounded-full bg-[#1E3E62] border border-white" />
                        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                          <h4 className="text-sm font-black text-neutral-900 leading-tight">{w.role}</h4>
                          {w.period && <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">{w.period}</span>}
                        </div>
                        <p className="text-xs font-bold italic text-[#1E3E62] mt-0.5">{w.company}</p>
                        <ul className="mt-2 list-disc space-y-1.5 pl-4 text-xs text-neutral-600 font-semibold leading-relaxed">
                          {w.bullets.map((b, j) => (
                            <li key={j}>{b}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Engineering Projects */}
              <section className="print-section">
                <h3 className="text-sm font-black uppercase tracking-wider text-[#1E3E62] mb-4 pb-1 border-b border-[#1E3E62]/10 flex items-center gap-2 print-text-dark print-border-dark">
                  <FolderGit2 className="h-4.5 w-4.5 text-[#FF5900]" /> Featured Engineering Projects
                </h3>
                <div className="space-y-6">
                  {student.projects.map((p, i) => (
                    <div key={i} className="border border-black/5 bg-[#fafafa]/50 p-4 rounded-xl relative">
                      <h4 className="text-sm font-black text-neutral-900 leading-snug">
                        {p.title}
                      </h4>
                      {p.tag && (
                        <div className="mt-1 text-[10px] font-bold text-[#1E3E62] uppercase tracking-wider bg-neutral-100 inline-block px-2 py-0.5 rounded border border-black/5">
                          {p.tag}
                        </div>
                      )}
                      <ul className="mt-3 list-disc space-y-1.5 pl-4 text-xs text-neutral-600 font-semibold leading-relaxed">
                        {p.bullets.map((b, j) => (
                          <li key={j}>{b}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>

              {/* Intellectual Property & Patents */}
              {patentItems.length > 0 && (
                <section className="print-section">
                  <h3 className="text-sm font-black uppercase tracking-wider text-[#1E3E62] mb-4 pb-1 border-b border-[#1E3E62]/10 flex items-center gap-2 print-text-dark print-border-dark">
                    <FileText className="h-4.5 w-4.5 text-[#FF5900]" /> Patents & IP
                  </h3>
                  <div className="border border-black/5 bg-[#fafafa]/50 p-4 rounded-xl relative">
                    <ul className="list-disc space-y-2 pl-4 text-xs text-neutral-600 font-semibold leading-relaxed">
                      {patentItems.map((p, i) => (
                        <li key={i}>{p}</li>
                      ))}
                    </ul>
                  </div>
                </section>
              )}

              {/* Academic Publications */}
              {publicationItems.length > 0 && (
                <section className="print-section">
                  <h3 className="text-sm font-black uppercase tracking-wider text-[#1E3E62] mb-4 pb-1 border-b border-[#1E3E62]/10 flex items-center gap-2 print-text-dark print-border-dark">
                    <FileText className="h-4.5 w-4.5 text-[#FF5900]" /> Research Publications
                  </h3>
                  <div className="border border-black/5 bg-[#fafafa]/50 p-4 rounded-xl relative">
                    <ul className="list-disc space-y-2.5 pl-4 text-xs text-neutral-600 font-semibold leading-relaxed">
                      {publicationItems.map((p, i) => (
                        <li key={i}>{p}</li>
                      ))}
                    </ul>
                  </div>
                </section>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="mx-auto mt-8 max-w-[900px] text-center text-[10px] text-neutral-400 font-bold no-print">
        © REVA University · RACE · race.reva.edu.in
      </footer>
    </div>
  );
}
