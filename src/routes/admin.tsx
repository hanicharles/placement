import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  checkSessionFn,
  logoutFn,
  getStudentsFn,
  saveStudentFn,
  deleteStudentFn,
  uploadResumeFn,
  uploadPhotoFn,
  getJourneyStatsFn,
  saveJourneyStatsFn,
  getHiringPartnersFn,
  saveHiringPartnersFn,
  getPlacementStatsFn,
  savePlacementStatsFn,
  uploadPartnerLogoFn,
  type Partner,
  type PlacementStatRow,
} from "../actions";
import { type Student, type Specialization, type Gender, type EducationItem, type WorkItem, type ProjectItem, type SkillGroup } from "@/data/students";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
} from "recharts";
import {
  Home,
  LogOut,
  Plus,
  Search,
  Edit2,
  Trash2,
  Upload,
  User,
  GraduationCap,
  Wrench,
  Briefcase,
  FolderGit2,
  Award,
  FileText,
  Mail,
  Phone,
  MapPin,
  CheckCircle,
  X,
  XCircle,
  Eye,
  Loader2,
  ChevronRight,
  TrendingUp,
  Users,
  Building,
} from "lucide-react";

export const Route = createFileRoute("/admin")({
  component: AdminDashboardPage,
  head: () => ({
    meta: [
      { title: "Admin Dashboard — REVA RACE" },
      { name: "description", content: "REVA Academy for Corporate Excellence (RACE) Admin Dashboard" },
    ],
  }),
});

function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const DEFAULT_STUDENT_FORM = (): Omit<Student, "slug"> & { slug?: string } => ({
  slug: "",
  name: "",
  headline: "",
  specialization: "Artificial Intelligence",
  gender: "Male",
  location: "Bengaluru, India",
  phone: "",
  email: "",
  collegeEmail: "",
  linkedin: "",
  github: "",
  photo: "",
  resume: "",
  about: "",
  education: [],
  certifications: [],
  skills: [
    { category: "Programming", items: [] },
    { category: "Tools", items: [] },
  ],
  workExperience: [],
  projects: [],
  publications: [],
});

// Helper to parse salary/stipend values to numbers for charts
function parseNumericValue(valStr: string | undefined): number {
  if (!valStr) return 0;
  // Clean string to keep only numbers, dots, and k/LPA hints
  const cleaned = valStr.replace(/[^0-9.]/g, "");
  const num = parseFloat(cleaned);
  if (isNaN(num)) return 0;
  return num;
}

function AdminDashboardPage() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loadingSession, setLoadingSession] = useState(true);
  const [currentSection, setCurrentSection] = useState<"dashboard" | "candidates" | "placement-stats" | "partners" | "journey-stats">("dashboard");

  // Data States
  const [students, setStudents] = useState<Student[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [specFilter, setSpecFilter] = useState<"All" | Specialization>("All");
  const [placedFilter, setPlacedFilter] = useState<"All" | "Placed" | "Unplaced">("All");

  // Journey Stats States
  const [stats, setStats] = useState<any[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [isStatsEditorOpen, setIsStatsEditorOpen] = useState(false);

  // Hiring Partners CRUD States
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loadingPartners, setLoadingPartners] = useState(true);
  const [isPartnersEditorOpen, setIsPartnersEditorOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [partnerIndex, setPartnerIndex] = useState<number | null>(null);
  const [isPartnerFormOpen, setIsPartnerFormOpen] = useState(false);
  const [partnerSearchQuery, setPartnerSearchQuery] = useState("");
  const [uploadingPartnerLogo, setUploadingPartnerLogo] = useState(false);

  // Placement Stats CRUD States
  const [placementStats, setPlacementStats] = useState<PlacementStatRow[]>([]);
  const [loadingPlacementStats, setLoadingPlacementStats] = useState(true);
  const [isPlacementStatsEditorOpen, setIsPlacementStatsEditorOpen] = useState(false);

  // CRUD States
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [formStudent, setFormStudent] = useState<Omit<Student, "slug"> & { slug?: string }>(DEFAULT_STUDENT_FORM());
  const [isEditMode, setIsEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState<"basic" | "contact" | "placement" | "education" | "skills" | "projects" | "extras">("basic");
  
  // File Upload states
  const [uploadingResume, setUploadingResume] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Deletion States
  const [deleteCandidateSlug, setDeleteCandidateSlug] = useState<string | null>(null);
  
  // Page Notification message
  const [notification, setNotification] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Validate session on mount
  useEffect(() => {
    checkSessionFn()
      .then((res) => {
        if (!res.isAuthenticated) {
          navigate({ to: "/login" });
        } else {
          setIsAuthenticated(true);
          fetchStudents();
          fetchStats();
          fetchPartners();
          fetchPlacementStats();
        }
      })
      .catch((err) => {
        console.error("Session check failed:", err);
        navigate({ to: "/login" });
      })
      .finally(() => {
        setLoadingSession(false);
      });
  }, [navigate]);

  const showNotification = (type: "success" | "error", text: string) => {
    setNotification({ type, text });
    setTimeout(() => setNotification(null), 5000);
  };

  const fetchStudents = async () => {
    setLoadingData(true);
    try {
      const data = await getStudentsFn();
      setStudents(data);
    } catch (err) {
      console.error("Failed to load students:", err);
      showNotification("error", "Failed to load candidate directory.");
    } finally {
      setLoadingData(false);
    }
  };

  const fetchStats = async () => {
    setLoadingStats(true);
    try {
      const data = await getJourneyStatsFn();
      setStats(data);
    } catch (err) {
      console.error("Failed to load journey stats:", err);
      showNotification("error", "Failed to load journey stats.");
    } finally {
      setLoadingStats(false);
    }
  };

  const handleSaveStats = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await saveJourneyStatsFn({ data: stats });
      if (result.success) {
        showNotification("success", "Journey stats updated successfully.");
        setIsStatsEditorOpen(false);
        fetchStats();
      } else {
        showNotification("error", "Failed to save journey stats.");
      }
    } catch (err) {
      console.error("Save stats failed:", err);
      showNotification("error", "Error saving journey stats.");
    }
  };

  const fetchPartners = async () => {
    setLoadingPartners(true);
    try {
      const data = await getHiringPartnersFn();
      setPartners(data);
    } catch (err) {
      console.error("Failed to load hiring partners:", err);
      showNotification("error", "Failed to load hiring partners.");
    } finally {
      setLoadingPartners(false);
    }
  };

  const fetchPlacementStats = async () => {
    setLoadingPlacementStats(true);
    try {
      const data = await getPlacementStatsFn();
      setPlacementStats(data);
    } catch (err) {
      console.error("Failed to load placement stats:", err);
      showNotification("error", "Failed to load placement stats.");
    } finally {
      setLoadingPlacementStats(false);
    }
  };

  const handleSavePartnersList = async (updatedPartnersList: Partner[]) => {
    try {
      const result = await saveHiringPartnersFn({ data: updatedPartnersList });
      if (result.success) {
        showNotification("success", "Hiring Partners updated successfully.");
        setPartners(updatedPartnersList);
        return true;
      } else {
        showNotification("error", "Failed to save hiring partners.");
        return false;
      }
    } catch (err) {
      console.error("Save partners failed:", err);
      showNotification("error", "Error saving hiring partners.");
      return false;
    }
  };

  const handleSavePlacementStats = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await savePlacementStatsFn({ data: placementStats });
      if (result.success) {
        showNotification("success", "Placement statistics updated successfully.");
        setIsPlacementStatsEditorOpen(false);
        fetchPlacementStats();
      } else {
        showNotification("error", "Failed to save placement statistics.");
      }
    } catch (err) {
      console.error("Save placement stats failed:", err);
      showNotification("error", "Error saving placement statistics.");
    }
  };

  const handlePartnerLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingPartner) return;

    if (!file.type.startsWith("image/")) {
      showNotification("error", "Only image files are supported.");
      return;
    }

    const companySlug = slugify(editingPartner.name || "temp-company-" + Date.now());
    setUploadingPartnerLogo(true);

    try {
      const base64 = await fileToBase64(file);
      const result = await uploadPartnerLogoFn({
        data: {
          slug: companySlug,
          base64,
          filename: file.name,
        },
      });

      if (result.success && result.filePath) {
        setEditingPartner((prev) => prev ? { ...prev, logoUrl: result.filePath } : null);
        showNotification("success", "Company logo uploaded successfully!");
      } else {
        showNotification("error", "Failed to save logo.");
      }
    } catch (err: any) {
      console.error(err);
      showNotification("error", err.message || "Failed to upload logo.");
    } finally {
      setUploadingPartnerLogo(false);
    }
  };

  const handleAddPlacementRow = () => {
    const newRow: PlacementStatRow = {
      academicYear: "",
      batch: "",
      avgStipend: "",
      medianStipend: "",
      highestStipend: "",
      avgCtc: "",
      medianCtc: "",
      highestCtc: ""
    };
    const overallIdx = placementStats.findIndex(r => r.academicYear.toLowerCase() === "overall");
    if (overallIdx >= 0) {
      const updated = [...placementStats];
      updated.splice(overallIdx, 0, newRow);
      setPlacementStats(updated);
    } else {
      setPlacementStats([...placementStats, newRow]);
    }
  };

  const handleRemovePlacementRow = (idx: number) => {
    setPlacementStats(placementStats.filter((_, i) => i !== idx));
  };

  const handleLogout = async () => {
    try {
      await logoutFn();
      navigate({ to: "/login" });
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const handleOpenCreate = () => {
    setFormStudent(DEFAULT_STUDENT_FORM());
    setIsEditMode(false);
    setActiveTab("basic");
    setUploadError(null);
    setIsEditorOpen(true);
  };

  const handleOpenEdit = (s: Student) => {
    setFormStudent({ ...s });
    setIsEditMode(true);
    setActiveTab("basic");
    setUploadError(null);
    setIsEditorOpen(true);
  };

  const handleDeleteClick = (slug: string) => {
    setDeleteCandidateSlug(slug);
  };

  const confirmDelete = async () => {
    if (!deleteCandidateSlug) return;
    try {
      const result = await deleteStudentFn({ data: deleteCandidateSlug });
      if (result.success) {
        showNotification("success", "Candidate profile deleted successfully.");
        fetchStudents();
      } else {
        showNotification("error", "Failed to delete candidate.");
      }
    } catch (err) {
      console.error("Delete failed:", err);
      showNotification("error", "Error occurred during deletion.");
    } finally {
      setDeleteCandidateSlug(null);
    }
  };

  // Convert File to Base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  // Resume Upload & Parse handler
  const handleResumeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setUploadError("Only PDF resumes are supported.");
      return;
    }

    // Set fallback slug if name is not set yet
    const candidateName = formStudent.name.trim();
    const tempSlug = formStudent.slug || slugify(candidateName || "temp-candidate-" + Date.now());

    setUploadingResume(true);
    setUploadError(null);

    try {
      const base64 = await fileToBase64(file);
      const result = await uploadResumeFn({
        data: {
          slug: tempSlug,
          base64,
          filename: file.name,
        },
      });

      if (result.success && result.filePath) {
        showNotification("success", "Resume uploaded and auto-parsed successfully!");
        
        // Auto-fill parsed details
        if (result.parsed) {
          const parsed = result.parsed;
          const parsedSlug = parsed.name ? slugify(parsed.name) : tempSlug;
          setFormStudent((prev) => ({
            ...prev,
            slug: prev.slug && !prev.slug.startsWith("temp-candidate-") ? prev.slug : parsedSlug,
            resume: result.filePath,
            name: parsed.name || prev.name,
            headline: parsed.headline || prev.headline,
            specialization: (parsed.specialization as Specialization) || prev.specialization,
            location: parsed.location || prev.location,
            phone: parsed.phone || prev.phone,
            email: parsed.email || prev.email,
            about: parsed.about || prev.about,
            education: parsed.education && parsed.education.length > 0 ? parsed.education : prev.education,
            skills: parsed.skills && parsed.skills.length > 0 ? parsed.skills : prev.skills,
            projects: parsed.projects && parsed.projects.length > 0 ? parsed.projects : prev.projects,
          }));
        } else {
          setFormStudent((prev) => ({ ...prev, resume: result.filePath }));
          setUploadError("Resume uploaded, but failed to auto-fill details automatically.");
        }
      } else {
        setUploadError("Upload failed. Could not process resume.");
      }
    } catch (err: any) {
      console.error(err);
      setUploadError(err.message || "Failed to process resume upload.");
    } finally {
      setUploadingResume(false);
    }
  };

  // Photo Upload handler
  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setUploadError("Only image files are supported.");
      return;
    }

    const candidateName = formStudent.name.trim();
    const tempSlug = formStudent.slug || slugify(candidateName || "temp-candidate-" + Date.now());

    setUploadingPhoto(true);
    setUploadError(null);

    try {
      const base64 = await fileToBase64(file);
      const result = await uploadPhotoFn({
        data: {
          slug: tempSlug,
          base64,
          filename: file.name,
        },
      });

      if (result.success && result.filePath) {
        setFormStudent((prev) => ({ ...prev, slug: tempSlug, photo: result.filePath }));
        showNotification("success", "Profile picture uploaded.");
      } else {
        setUploadError("Upload failed. Could not save photo.");
      }
    } catch (err: any) {
      console.error(err);
      setUploadError(err.message || "Failed to upload photo.");
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSaveStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formStudent.name || !formStudent.headline || !formStudent.about) {
      showNotification("error", "Please fill in all required basic fields.");
      return;
    }

    const finalSlug = formStudent.slug ? formStudent.slug.trim() : slugify(formStudent.name);
    const payload: Student = {
      ...(formStudent as Omit<Student, "slug">),
      slug: finalSlug,
    };

    try {
      const result = await saveStudentFn({ data: payload });
      if (result.success) {
        showNotification("success", isEditMode ? "Profile updated successfully." : "New candidate created successfully.");
        setIsEditorOpen(false);
        fetchStudents();
      } else {
        showNotification("error", "Failed to save profile.");
      }
    } catch (err) {
      console.error("Save failed:", err);
      showNotification("error", "Error saving candidate profile.");
    }
  };

  // Dynamic Lists helpers
  const addEducation = () => {
    setFormStudent((prev) => ({
      ...prev,
      education: [...prev.education, { degree: "", institute: "", period: "" }],
    }));
  };

  const updateEducation = (idx: number, field: keyof EducationItem, val: string) => {
    setFormStudent((prev) => {
      const list = [...prev.education];
      list[idx] = { ...list[idx], [field]: val };
      return { ...prev, education: list };
    });
  };

  const removeEducation = (idx: number) => {
    setFormStudent((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== idx),
    }));
  };

  const addExperience = () => {
    setFormStudent((prev) => ({
      ...prev,
      workExperience: [...(prev.workExperience || []), { role: "", company: "", period: "", bullets: [""] }],
    }));
  };

  const updateExperience = (idx: number, field: keyof Omit<WorkItem, "bullets">, val: string) => {
    setFormStudent((prev) => {
      const list = [...(prev.workExperience || [])];
      list[idx] = { ...list[idx], [field]: val };
      return { ...prev, workExperience: list };
    });
  };

  const updateExperienceBullet = (expIdx: number, bulletIdx: number, val: string) => {
    setFormStudent((prev) => {
      const list = [...(prev.workExperience || [])];
      const bullets = [...list[expIdx].bullets];
      bullets[bulletIdx] = val;
      list[expIdx] = { ...list[expIdx], bullets };
      return { ...prev, workExperience: list };
    });
  };

  const addExperienceBullet = (expIdx: number) => {
    setFormStudent((prev) => {
      const list = [...(prev.workExperience || [])];
      const bullets = [...list[expIdx].bullets, ""];
      list[expIdx] = { ...list[expIdx], bullets };
      return { ...prev, workExperience: list };
    });
  };

  const removeExperienceBullet = (expIdx: number, bulletIdx: number) => {
    setFormStudent((prev) => {
      const list = [...(prev.workExperience || [])];
      const bullets = list[expIdx].bullets.filter((_, i) => i !== bulletIdx);
      list[expIdx] = { ...list[expIdx], bullets };
      return { ...prev, workExperience: list };
    });
  };

  const removeExperience = (idx: number) => {
    setFormStudent((prev) => ({
      ...prev,
      workExperience: (prev.workExperience || []).filter((_, i) => i !== idx),
    }));
  };

  const addProject = () => {
    setFormStudent((prev) => ({
      ...prev,
      projects: [...prev.projects, { title: "", tag: "Featured Project", bullets: [""] }],
    }));
  };

  const updateProject = (idx: number, field: keyof Omit<ProjectItem, "bullets">, val: string) => {
    setFormStudent((prev) => {
      const list = [...prev.projects];
      list[idx] = { ...list[idx], [field]: val };
      return { ...prev, projects: list };
    });
  };

  const updateProjectBullet = (projIdx: number, bulletIdx: number, val: string) => {
    setFormStudent((prev) => {
      const list = [...prev.projects];
      const bullets = [...list[projIdx].bullets];
      bullets[bulletIdx] = val;
      list[projIdx] = { ...list[projIdx], bullets };
      return { ...prev, projects: list };
    });
  };

  const addProjectBullet = (projIdx: number) => {
    setFormStudent((prev) => {
      const list = [...prev.projects];
      const bullets = [...list[projIdx].bullets, ""];
      list[projIdx] = { ...list[projIdx], bullets };
      return { ...prev, projects: list };
    });
  };

  const removeProjectBullet = (projIdx: number, bulletIdx: number) => {
    setFormStudent((prev) => {
      const list = [...prev.projects];
      const bullets = list[projIdx].bullets.filter((_, i) => i !== bulletIdx);
      list[projIdx] = { ...list[projIdx], bullets };
      return { ...prev, projects: list };
    });
  };

  const removeProject = (idx: number) => {
    setFormStudent((prev) => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== idx),
    }));
  };

  const addSkillGroup = () => {
    setFormStudent((prev) => ({
      ...prev,
      skills: [...prev.skills, { category: "Skills Category", items: [] }],
    }));
  };

  const updateSkillCategoryName = (idx: number, val: string) => {
    setFormStudent((prev) => {
      const list = [...prev.skills];
      list[idx] = { ...list[idx], category: val };
      return { ...prev, skills: list };
    });
  };

  const updateSkillGroupItems = (idx: number, csvString: string) => {
    setFormStudent((prev) => {
      const list = [...prev.skills];
      const items = csvString.split(",").map((s) => s.trim()).filter((s) => s.length > 0);
      list[idx] = { ...list[idx], items };
      return { ...prev, skills: list };
    });
  };

  const removeSkillGroup = (idx: number) => {
    setFormStudent((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== idx),
    }));
  };

  // Filter students based on UI selections
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.slug.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSpec = specFilter === "All" || s.specialization === specFilter;

    let matchesPlaced = true;
    if (placedFilter === "Placed") matchesPlaced = !!s.placement;
    if (placedFilter === "Unplaced") matchesPlaced = !s.placement;

    return matchesSearch && matchesSpec && matchesPlaced;
  });

  const totalCandidates = students.length;
  const totalPlaced = students.filter((s) => s.placement).length;
  const placementRate = totalCandidates > 0 ? Math.round((totalPlaced / totalCandidates) * 100) : 0;
  const aiCount = students.filter((s) => s.specialization === "Artificial Intelligence").length;
  const cyberCount = students.filter((s) => s.specialization === "Cybersecurity").length;

  if (loadingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
        <div className="text-center space-y-3">
          <Loader2 className="h-8 w-8 animate-spin text-[#1E3E62] mx-auto" />
          <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Verifying Admin Session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const aiPct = totalCandidates > 0 ? Math.round((aiCount / totalCandidates) * 100) : 0;
  const cyberPct = totalCandidates > 0 ? Math.round((cyberCount / totalCandidates) * 100) : 0;

  const chartData = placementStats
    .filter(row => row.academicYear.toLowerCase() !== "overall" && row.academicYear.trim() !== "")
    .map(row => {
      const highestCtc = parseNumericValue(row.highestCtc);
      const avgCtc = parseNumericValue(row.avgCtc);
      const highestStipend = parseNumericValue(row.highestStipend);
      const avgStipend = parseNumericValue(row.avgStipend);
      
      const parsedStipendHighest = highestStipend > 1000 ? highestStipend / 1000 : highestStipend;
      const parsedStipendAvg = avgStipend > 1000 ? avgStipend / 1000 : avgStipend;
      
      return {
        name: row.academicYear,
        "Highest CTC (LPA)": highestCtc || 0,
        "Avg CTC (LPA)": avgCtc || 0,
        "Highest Stipend (k/mo)": parsedStipendHighest || 0,
        "Avg Stipend (k/mo)": parsedStipendAvg || 0,
      };
    });

  return (
    <div className="min-h-screen bg-[#070A13] font-sans text-slate-200 flex flex-col selection:bg-indigo-500/30 selection:text-white">
      {/* Header bar */}
      <header className="border-b border-slate-800/80 bg-[#0C101A]/90 backdrop-blur-md text-white sticky top-0 z-30">
        <div className="mx-auto flex max-w-7xl flex-row items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900/80 px-3.5 py-2 text-xs font-semibold uppercase tracking-wider text-slate-300 hover:bg-slate-800 hover:text-white transition shadow-sm"
            >
              <Home className="h-3.5 w-3.5" />
              View Site
            </Link>
            <span className="hidden sm:inline-block text-slate-800 font-bold">|</span>
            <span className="hidden sm:inline-block text-xs font-black text-indigo-400 tracking-widest uppercase">
              Placement Dashboard Admin
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-emerald-500 h-2 w-2 animate-pulse" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Logged in as Admin
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-rose-600/95 px-3.5 py-2 text-xs font-bold text-white hover:bg-rose-700 transition cursor-pointer shadow-lg shadow-rose-600/10"
            >
              <LogOut className="h-3.5 w-3.5" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="flex-1 mx-auto max-w-7xl w-full px-6 py-8 space-y-8">
        
        {/* Dynamic Alert Banner */}
        {notification && (
          <div
            className={`rounded-xl border p-4 text-xs font-bold shadow-lg flex items-start gap-2.5 animate-scale-up ${
              notification.type === "success"
                ? "bg-emerald-950/40 border-emerald-800/50 text-emerald-300"
                : "bg-rose-950/40 border-rose-800/50 text-rose-300"
            }`}
          >
            <span className={`shrink-0 h-2 w-2 rounded-full mt-1.5 ${notification.type === "success" ? "bg-emerald-500" : "bg-rose-500"}`} />
            <span className="flex-1 leading-relaxed">{notification.text}</span>
            <button onClick={() => setNotification(null)} className="opacity-60 hover:opacity-100 transition">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {/* Tab Selection Navigation */}
        <div className="flex border-b border-slate-800/60 gap-2 overflow-x-auto pb-0.5 select-none scrollbar-none shrink-0">
          <TabButton
            active={currentSection === "dashboard"}
            onClick={() => setCurrentSection("dashboard")}
            label="Overview Dashboard"
            icon={<Home className="h-3.5 w-3.5" />}
          />
          <TabButton
            active={currentSection === "candidates"}
            onClick={() => setCurrentSection("candidates")}
            label="Candidate Directory"
            icon={<User className="h-3.5 w-3.5" />}
          />
          <TabButton
            active={currentSection === "placement-stats"}
            onClick={() => setCurrentSection("placement-stats")}
            label="Placement Highlights"
            icon={<TrendingUp className="h-3.5 w-3.5" />}
          />
          <TabButton
            active={currentSection === "partners"}
            onClick={() => setCurrentSection("partners")}
            label="Hiring Partners"
            icon={<Building className="h-3.5 w-3.5" />}
          />
          <TabButton
            active={currentSection === "journey-stats"}
            onClick={() => setCurrentSection("journey-stats")}
            label="Journey Stats"
            icon={<Award className="h-3.5 w-3.5" />}
          />
        </div>

        {/* Section: Overview Dashboard */}
        {currentSection === "dashboard" && (
          <div className="space-y-6 animate-fade-in">
            {/* Dashboard Welcome Header */}
            <section className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.15),transparent_50%)]" />
              <div className="space-y-1 relative z-10">
                <h1 className="text-2xl font-black text-white uppercase tracking-wide">RACE Placement Analytics Overview</h1>
                <p className="text-xs text-slate-400 font-semibold">Real-time statistics of candidate tracks, career outcomes, and database integrations</p>
              </div>
              <div className="flex gap-2.5 relative z-10 shrink-0">
                <button
                  onClick={() => setCurrentSection("candidates")}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-2.5 text-xs font-bold text-slate-300 shadow-sm hover:bg-slate-800 hover:border-slate-700 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
                >
                  <User className="h-3.5 w-3.5 text-indigo-400" />
                  Candidate Directory
                </button>
                <button
                  onClick={handleOpenCreate}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-black tracking-wider text-white shadow-lg shadow-indigo-600/10 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all duration-200 uppercase cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5 stroke-[3]" /> Add Candidate
                </button>
              </div>
            </section>

            {/* Quick Summary Cards (StatCards) */}
            <section className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <StatCard label="Total Candidates" val={totalCandidates} icon={<User className="text-violet-400 h-4 w-4" />} />
              <StatCard label="Students Placed" val={totalPlaced} icon={<CheckCircle className="text-emerald-400 h-4 w-4" />} />
              <StatCard label="Placement Rate" val={`${placementRate}%`} icon={<TrendingUp className="text-amber-400 h-4 w-4" />} />
              <StatCard label="AI Track" val={aiCount} subtitle="M.Tech / M.Sc" />
              <StatCard label="Cybersecurity Track" val={cyberCount} subtitle="M.Tech / M.Sc" />
            </section>

            {/* Visual Analytics Rows */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left Column: Interactive Salary & Stipend Trends AreaChart (col-span-2) */}
              <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800/80 backdrop-blur-md rounded-2xl p-6 shadow-xl flex flex-col space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-xs font-black uppercase text-slate-300 tracking-wider">Compensation Packages & Stipend Trends</h3>
                    <p className="text-[10px] text-slate-500 font-semibold mt-0.5">Historical overview of average vs peak offers across graduating batches</p>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400">
                    <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-indigo-500" /> CTC (LPA)</span>
                    <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-cyan-400" /> Stipend (k/mo)</span>
                  </div>
                </div>
                
                <div className="h-72 w-full pt-4">
                  {chartData.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-xs text-slate-500 font-bold uppercase tracking-wider">
                      No statistical history available.
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorHighestCtc" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorAvgCtc" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorStipend" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.25}/>
                            <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.3} />
                        <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} dy={10} />
                        <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} dx={-10} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "12px", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.3)" }}
                          labelStyle={{ color: "#cbd5e1", fontWeight: "bold", fontSize: "11px", marginBottom: "4px" }}
                          itemStyle={{ fontSize: "11px", padding: "2px 0" }}
                        />
                        <Area type="monotone" dataKey="Highest CTC (LPA)" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#colorHighestCtc)" />
                        <Area type="monotone" dataKey="Avg CTC (LPA)" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorAvgCtc)" />
                        <Area type="monotone" dataKey="Highest Stipend (k/mo)" stroke="#22d3ee" strokeWidth={1.5} strokeDasharray="4 4" fillOpacity={1} fill="url(#colorStipend)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>

              {/* Right Column: Custom Widgets */}
              <div className="space-y-6 flex flex-col justify-between">
                
                {/* Cohort Placement KPIs */}
                <div className="bg-slate-900/60 border border-slate-800/80 backdrop-blur-md rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-6 flex-1">
                  <div>
                    <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider mb-4">Cohort Placement KPIs</h3>
                    <div className="space-y-4">
                      {/* Placement rate progress */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs font-bold text-slate-300">
                          <span>Placement Success Rate</span>
                          <span className="text-emerald-400">{totalPlaced} / {totalCandidates} Placed ({placementRate}%)</span>
                        </div>
                        <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800/50">
                          <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.3)]" style={{ width: `${placementRate}%` }} />
                        </div>
                      </div>

                      {/* Employer Pool Depth */}
                      {(() => {
                        const poolDepth = totalCandidates > 0 ? Math.round((partners.length / totalCandidates) * 100) : 0;
                        const cappedBar = Math.min(poolDepth, 100);
                        return (
                          <div className="space-y-1.5">
                            <div className="flex justify-between text-xs font-bold text-slate-300">
                              <span>Employer Pool Depth</span>
                              <span className="text-indigo-400">{partners.length} Partners for {totalCandidates} Students ({poolDepth}%)</span>
                            </div>
                            <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800/50">
                              <div className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.3)]" style={{ width: `${cappedBar}%` }} />
                            </div>
                          </div>
                        );
                      })()}

                      {/* Recruiter Industry Coverage */}
                      {(() => {
                        const uniqueSectors = new Set(partners.map(p => p.category).filter(Boolean));
                        const totalSectorsCount = 6;
                        const sectorRate = Math.round((uniqueSectors.size / totalSectorsCount) * 100);
                        return (
                          <div className="space-y-1.5">
                            <div className="flex justify-between text-xs font-bold text-slate-300">
                              <span>Recruiter Industry Coverage</span>
                              <span className="text-violet-400">{uniqueSectors.size} of 6 Sectors Active ({sectorRate}%)</span>
                            </div>
                            <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800/50">
                              <div className="h-full bg-gradient-to-r from-violet-500 to-purple-400 rounded-full shadow-[0_0_8px_rgba(139,92,246,0.3)]" style={{ width: `${sectorRate}%` }} />
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                  <div className="pt-4 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                    <span>Last synced on load</span>
                    <button onClick={fetchStudents} className="text-indigo-400 hover:text-indigo-300 transition-colors normal-case">Refresh Profiles</button>
                  </div>
                </div>

                {/* Top Placement Records (CTC & Stipends) */}
                <div className="bg-slate-900/60 border border-slate-800/80 backdrop-blur-md rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-6 flex-1">
                  <div>
                    <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider mb-4">Compensation Records (Overall)</h3>
                    {(() => {
                      const overall = placementStats.find(
                        (r) => r.academicYear.toLowerCase() === "overall"
                      ) || {
                        avgStipend: "₹ 0.00",
                        medianStipend: "₹ 0.00",
                        highestStipend: "₹ 0.00",
                        avgCtc: "₹ 0.00 LPA",
                        medianCtc: "₹ 0.00 LPA",
                        highestCtc: "₹ 0.00 LPA",
                      };
                      return (
                        <div className="grid grid-cols-2 gap-3.5">
                          <div className="bg-slate-950/45 border border-slate-800/60 p-3.5 rounded-xl">
                            <span className="text-[9px] font-bold uppercase text-slate-500 tracking-wider block">Highest CTC</span>
                            <span className="text-base font-extrabold text-white block mt-1 tracking-tight">{overall.highestCtc}</span>
                          </div>
                          <div className="bg-slate-950/45 border border-slate-800/60 p-3.5 rounded-xl">
                            <span className="text-[9px] font-bold uppercase text-slate-500 tracking-wider block">Highest Stipend</span>
                            <span className="text-base font-extrabold text-orange-400 block mt-1 tracking-tight">{overall.highestStipend}</span>
                          </div>
                          <div className="bg-slate-950/45 border border-slate-800/60 px-4 py-3 rounded-xl col-span-2 flex justify-between items-center">
                            <div>
                              <span className="text-[9px] font-bold uppercase text-slate-500 tracking-wider block">Avg CTC Package</span>
                              <span className="text-sm font-extrabold text-slate-200 tracking-tight">{overall.avgCtc}</span>
                            </div>
                            <div className="text-right">
                              <span className="text-[9px] font-bold uppercase text-slate-500 tracking-wider block">Avg Stipend</span>
                              <span className="text-sm font-extrabold text-orange-400 tracking-tight">{overall.avgStipend}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                  <div className="pt-4 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                    <span>{placementStats.length > 0 ? placementStats.length - 1 : 0} batches tracked</span>
                    <button onClick={() => setCurrentSection("placement-stats")} className="text-indigo-400 hover:text-indigo-300 transition-colors normal-case">Edit Highlights</button>
                  </div>
                </div>

                {/* Specialization Split Card */}
                <div className="bg-slate-900/60 border border-slate-800/80 backdrop-blur-md rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-4 flex-1">
                  <div>
                    <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">Specialization Distribution</h3>
                    <p className="text-[10px] text-slate-500 font-semibold mt-0.5">Comparative track enrollments in AI vs Cybersecurity</p>
                  </div>
                  <div className="space-y-3.5">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-indigo-400 flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-indigo-500 shadow-[0_0_6px_rgba(99,102,241,0.5)]" />
                        Artificial Intelligence
                      </span>
                      <span className="text-slate-300">{aiCount} Candidates ({aiPct}%)</span>
                    </div>
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-cyan-400 flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.5)]" />
                        Cybersecurity
                      </span>
                      <span className="text-slate-300">{cyberCount} Candidates ({cyberPct}%)</span>
                    </div>
                    {/* Horizontal Split Bar */}
                    <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden flex border border-slate-800/50">
                      <div className="h-full bg-indigo-500 transition-all duration-500" style={{ width: `${aiPct}%` }} />
                      <div className="h-full bg-cyan-400 transition-all duration-500" style={{ width: `${cyberPct}%` }} />
                    </div>
                  </div>
                </div>

              </div>
            </div>
            
            {/* Quick Links Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
              <button
                onClick={() => setCurrentSection("candidates")}
                className="flex items-center justify-between p-4 border border-slate-800 bg-slate-900/30 hover:border-indigo-500/30 hover:bg-slate-900/60 rounded-xl text-left text-xs font-bold text-slate-300 transition-all duration-200 cursor-pointer group"
              >
                <span className="flex items-center gap-2.5">
                  <User className="h-4 w-4 text-indigo-400 shrink-0" />
                  Candidate Profiles
                </span>
                <ChevronRight className="h-4 w-4 text-slate-500 group-hover:translate-x-0.5 transition-transform" />
              </button>
              <button
                onClick={() => setCurrentSection("placement-stats")}
                className="flex items-center justify-between p-4 border border-slate-800 bg-slate-900/30 hover:border-indigo-500/30 hover:bg-slate-900/60 rounded-xl text-left text-xs font-bold text-slate-300 transition-all duration-200 cursor-pointer group"
              >
                <span className="flex items-center gap-2.5">
                  <TrendingUp className="h-4 w-4 text-emerald-400 shrink-0" />
                  Stipend & CTC Stats
                </span>
                <ChevronRight className="h-4 w-4 text-slate-500 group-hover:translate-x-0.5 transition-transform" />
              </button>
              <button
                onClick={() => setCurrentSection("partners")}
                className="flex items-center justify-between p-4 border border-slate-800 bg-slate-900/30 hover:border-indigo-500/30 hover:bg-slate-900/60 rounded-xl text-left text-xs font-bold text-slate-300 transition-all duration-200 cursor-pointer group"
              >
                <span className="flex items-center gap-2.5">
                  <Building className="h-4 w-4 text-amber-400 shrink-0" />
                  Hiring Partners
                </span>
                <ChevronRight className="h-4 w-4 text-slate-500 group-hover:translate-x-0.5 transition-transform" />
              </button>
              <button
                onClick={() => setCurrentSection("journey-stats")}
                className="flex items-center justify-between p-4 border border-slate-800 bg-slate-900/30 hover:border-indigo-500/30 hover:bg-slate-900/60 rounded-xl text-left text-xs font-bold text-slate-300 transition-all duration-200 cursor-pointer group"
              >
                <span className="flex items-center gap-2.5">
                  <Award className="h-4 w-4 text-violet-400 shrink-0" />
                  Journey Milestones
                </span>
                <ChevronRight className="h-4 w-4 text-slate-500 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

          </div>
        )}

        {/* Section: Candidate Profiles */}
        {currentSection === "candidates" && (
          <>
            {/* Dashboard Title & Stats Summary Cards */}
            <section className="space-y-4 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-black text-white uppercase tracking-wide">Candidate Directory Management</h1>
                  <p className="text-xs text-slate-400 font-semibold mt-0.5">Create, update, and manage candidate directory profiles and credentials</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={handleOpenCreate}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-xs font-black tracking-wider text-white shadow-lg shadow-indigo-600/10 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all duration-200 uppercase cursor-pointer"
                  >
                    <Plus className="h-4 w-4 stroke-[3]" /> Add New Candidate
                  </button>
                </div>
              </div>
            </section>

            {/* Student Directory Table with Filters */}
            <section className="bg-slate-900/60 border border-slate-800/80 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden flex flex-col animate-fade-in">
              
              {/* Table Toolbar */}
              <div className="p-5 border-b border-slate-800/60 bg-slate-900/20 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="relative max-w-sm flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search candidates by name or email..."
                    className="w-full rounded-xl border border-slate-800 bg-slate-950/60 py-2 pl-10 pr-3 text-xs text-slate-200 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400 font-bold">Specialization:</span>
                    <select
                      value={specFilter}
                      onChange={(e) => setSpecFilter(e.target.value as any)}
                      className="rounded border border-slate-800 bg-slate-950/60 px-2.5 py-1.5 outline-none font-bold text-slate-300 cursor-pointer focus:border-indigo-500"
                    >
                      <option value="All">All Tracks</option>
                      <option value="Artificial Intelligence">Artificial Intelligence</option>
                      <option value="Cybersecurity">Cybersecurity</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400 font-bold">Status:</span>
                    <select
                      value={placedFilter}
                      onChange={(e) => setPlacedFilter(e.target.value as any)}
                      className="rounded border border-slate-800 bg-slate-950/60 px-2.5 py-1.5 outline-none font-bold text-slate-300 cursor-pointer focus:border-indigo-500"
                    >
                      <option value="All">All Students</option>
                      <option value="Placed">Placed</option>
                      <option value="Unplaced">Unplaced</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Table Container */}
              <div className="overflow-x-auto">
                {loadingData ? (
                  <div className="py-20 text-center space-y-2">
                    <Loader2 className="h-7 w-7 animate-spin text-indigo-500 mx-auto" />
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Syncing Database Directory...</p>
                  </div>
                ) : filteredStudents.length === 0 ? (
                  <div className="py-20 text-center text-xs text-slate-500 font-bold uppercase tracking-wider">
                    No candidates match your active filters.
                  </div>
                ) : (
                  <table className="w-full border-collapse text-left text-xs text-slate-300">
                    <thead>
                      <tr className="bg-slate-900/40 text-slate-400 border-b border-slate-800/80 font-black uppercase tracking-wider">
                        <th className="p-4 w-[80px]">Photo</th>
                        <th className="p-4 w-[22%]">Name / Slug</th>
                        <th className="p-4 w-[18%]">Specialization</th>
                        <th className="p-4 w-[25%]">Contact Info</th>
                        <th className="p-4 w-[20%]">Placement status</th>
                        <th className="p-4 w-[15%] text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                      {filteredStudents.map((s) => (
                        <tr key={s.slug} className="hover:bg-slate-900/40 transition-colors">
                          <td className="p-4">
                            {s.photo ? (
                              <img src={s.photo} alt={s.name} className="h-10 w-10 rounded-lg object-cover border border-slate-800" />
                            ) : (
                              <div className="h-10 w-10 rounded-lg bg-indigo-500/10 text-xs font-black text-indigo-400 flex items-center justify-center border border-indigo-500/20">
                                {s.name.split(" ").map(p => p[0]).slice(0, 2).join("")}
                              </div>
                            )}
                          </td>
                          <td className="p-4">
                            <p className="font-extrabold text-slate-200 leading-tight">{s.name}</p>
                            <p className="text-[10px] text-slate-500 font-bold mt-0.5">{s.slug}</p>
                          </td>
                          <td className="p-4">
                            <span className={`inline-block rounded-lg px-2.5 py-1 text-[10px] font-black uppercase tracking-wider border ${
                              s.specialization === "Cybersecurity"
                                ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
                                : "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
                            }`}>
                              {s.specialization}
                            </span>
                          </td>
                          <td className="p-4 space-y-1">
                            {s.email && (
                              <div className="flex items-center gap-1.5 text-slate-300 font-medium">
                                <Mail className="h-3 w-3 shrink-0 text-slate-500" />
                                <span className="truncate max-w-[180px]">{s.email}</span>
                              </div>
                            )}
                            {s.phone && (
                              <div className="flex items-center gap-1.5 text-slate-300 font-medium">
                                <Phone className="h-3 w-3 shrink-0 text-slate-500" />
                                <span>{s.phone}</span>
                              </div>
                            )}
                          </td>
                          <td className="p-4">
                            <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider rounded-lg px-2.5 py-1 ${
                              s.placement
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                            }`}>
                              {s.placement ? (
                                <>
                                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]" />
                                  Placed
                                  </>
                              ) : (
                                <>
                                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.5)]" />
                                  Unplaced
                                </>
                              )}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex justify-end gap-1.5">
                              <Link
                                to="/profile/$slug"
                                params={{ slug: s.slug }}
                                target="_blank"
                                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700/50 text-slate-300 hover:text-white transition cursor-pointer"
                                title="View Profile Page"
                              >
                                <Eye className="h-3.5 w-3.5" />
                              </Link>
                              <button
                                onClick={() => handleOpenEdit(s)}
                                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700/50 text-slate-300 hover:text-white transition cursor-pointer"
                                title="Edit Candidate"
                              >
                                <Edit2 className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteClick(s.slug)}
                                className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-600 hover:text-white transition cursor-pointer"
                                title="Delete Profile"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </section>
          </>
        )}

        {/* Section: Placement Highlights */}
        {currentSection === "placement-stats" && (
          <div className="bg-slate-900/60 border border-slate-800/80 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden flex flex-col animate-fade-in">
            <div className="bg-slate-950/40 px-6 py-5 border-b border-slate-800/80 flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-white uppercase tracking-wider">Edit Placement Statistics</h3>
                <p className="text-[10px] text-slate-400 font-bold mt-0.5">Update the stipend and CTC performance records shown on the home page</p>
              </div>
            </div>

            <form onSubmit={handleSavePlacementStats} className="p-6 space-y-4">
              <div className="flex justify-between items-center mb-1 shrink-0">
                <span className="text-xs font-black uppercase tracking-wider text-slate-400">Academic Batches</span>
                <button
                  type="button"
                  onClick={handleAddPlacementRow}
                  className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-[10px] px-3.5 py-2.5 rounded-xl transition shadow-lg shadow-indigo-600/10 uppercase tracking-wider cursor-pointer hover:-translate-y-0.5 duration-200"
                >
                  <Plus className="h-3.5 w-3.5 stroke-[3]" /> Add New Batch Row
                </button>
              </div>

              {loadingPlacementStats ? (
                <div className="py-10 text-center space-y-2">
                  <Loader2 className="h-6 w-6 animate-spin text-indigo-500 mx-auto" />
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Loading Stats...</p>
                </div>
              ) : (
                <div className="overflow-x-auto border border-slate-800/80 bg-slate-950/40 rounded-xl">
                  <table className="w-full border-collapse text-left text-xs text-slate-300">
                    <thead>
                      <tr className="bg-slate-900/40 text-slate-400 border-b border-slate-800/80 font-black uppercase tracking-wider text-[10px]">
                        <th className="p-3 w-[12%]">Academic Year</th>
                        <th className="p-3 w-[12%]">FT Batch</th>
                        <th className="p-3 w-[12%]">Avg Stipend</th>
                        <th className="p-3 w-[12%]">Median Stipend</th>
                        <th className="p-3 w-[12%]">Highest Stipend</th>
                        <th className="p-3 w-[12%]">Avg CTC</th>
                        <th className="p-3 w-[12%]">Median CTC</th>
                        <th className="p-3 w-[12%]">Highest CTC</th>
                        <th className="p-3 w-[6%] text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                      {placementStats.map((row, idx) => {
                        const isOverall = row.academicYear.toLowerCase() === "overall";
                        return (
                          <tr key={idx} className={isOverall ? "bg-indigo-500/5 font-bold" : ""}>
                            <td className="p-2">
                              <input
                                type="text"
                                required
                                value={row.academicYear}
                                onChange={(e) => {
                                  const updated = [...placementStats];
                                  updated[idx] = { ...row, academicYear: e.target.value };
                                  setPlacementStats(updated);
                                }}
                                className="w-full rounded border border-slate-800 bg-slate-900/60 px-2 py-1 text-xs text-slate-200 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                placeholder="AY22–24"
                              />
                            </td>
                            <td className="p-2">
                              <input
                                type="text"
                                required
                                value={row.batch}
                                onChange={(e) => {
                                  const updated = [...placementStats];
                                  updated[idx] = { ...row, batch: e.target.value };
                                  setPlacementStats(updated);
                                }}
                                className="w-full rounded border border-slate-800 bg-slate-900/60 px-2 py-1 text-xs text-slate-200 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                placeholder="FT Batch 1"
                              />
                            </td>
                            <td className="p-2">
                              <input
                                type="text"
                                required
                                value={row.avgStipend}
                                onChange={(e) => {
                                  const updated = [...placementStats];
                                  updated[idx] = { ...row, avgStipend: e.target.value };
                                  setPlacementStats(updated);
                                }}
                                className="w-full rounded border border-slate-800 bg-slate-900/60 px-2 py-1 text-xs text-slate-200 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                placeholder="₹ 25,000.00"
                              />
                            </td>
                            <td className="p-2">
                              <input
                                type="text"
                                required
                                value={row.medianStipend}
                                onChange={(e) => {
                                  const updated = [...placementStats];
                                  updated[idx] = { ...row, medianStipend: e.target.value };
                                  setPlacementStats(updated);
                                }}
                                className="w-full rounded border border-slate-800 bg-slate-900/60 px-2 py-1 text-xs text-slate-200 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                placeholder="₹ 27,500.00"
                              />
                            </td>
                            <td className="p-2">
                              <input
                                type="text"
                                required
                                value={row.highestStipend}
                                onChange={(e) => {
                                  const updated = [...placementStats];
                                  updated[idx] = { ...row, highestStipend: e.target.value };
                                  setPlacementStats(updated);
                                }}
                                className="w-full rounded border border-slate-800 bg-slate-900/60 px-2 py-1 text-xs text-slate-200 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-amber-400 font-bold"
                                placeholder="₹ 35,000.00"
                              />
                            </td>
                            <td className="p-2">
                              <input
                                type="text"
                                required
                                value={row.avgCtc}
                                onChange={(e) => {
                                  const updated = [...placementStats];
                                  updated[idx] = { ...row, avgCtc: e.target.value };
                                  setPlacementStats(updated);
                                }}
                                className="w-full rounded border border-slate-800 bg-slate-900/60 px-2 py-1 text-xs text-slate-200 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                placeholder="₹ 6.20 LPA"
                              />
                            </td>
                            <td className="p-2">
                              <input
                                type="text"
                                required
                                value={row.medianCtc}
                                onChange={(e) => {
                                  const updated = [...placementStats];
                                  updated[idx] = { ...row, medianCtc: e.target.value };
                                  setPlacementStats(updated);
                                }}
                                className="w-full rounded border border-slate-800 bg-slate-900/60 px-2 py-1 text-xs text-slate-200 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                placeholder="₹ 6.00 LPA"
                              />
                            </td>
                            <td className="p-2">
                              <input
                                type="text"
                                required
                                value={row.highestCtc}
                                onChange={(e) => {
                                  const updated = [...placementStats];
                                  updated[idx] = { ...row, highestCtc: e.target.value };
                                  setPlacementStats(updated);
                                }}
                                className="w-full rounded border border-slate-800 bg-slate-900/60 px-2 py-1 text-xs outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-indigo-400 font-bold"
                                placeholder="₹ 10.00 LPA"
                              />
                            </td>
                            <td className="p-2 text-center">
                              {!isOverall && (
                                <button
                                  type="button"
                                  onClick={() => handleRemovePlacementRow(idx)}
                                  className="p-1.5 rounded text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition cursor-pointer"
                                  title="Remove Row"
                                >
                                  <Trash2 className="h-4.5 w-4.5" />
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="pt-4 border-t border-slate-800/60 flex items-center justify-end gap-3 font-sans">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-black tracking-wider text-white shadow-lg shadow-indigo-600/10 hover:bg-indigo-700 hover:-translate-y-0.5 transition duration-200 uppercase cursor-pointer"
                >
                  Save Placement Stats
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Section: Hiring Partners */}
        {currentSection === "partners" && (
          <div className="bg-slate-900/60 border border-slate-800/80 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden flex flex-col animate-fade-in">
            <div className="bg-slate-950/40 px-6 py-5 border-b border-slate-800/80 flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-white uppercase tracking-wider">Manage Hiring Partners</h3>
                <p className="text-[10px] text-slate-400 font-bold mt-0.5">Add, edit, or delete companies displaying in the Hiring Partners network</p>
              </div>
            </div>

            <div className="p-6 flex flex-col lg:flex-row gap-6 min-h-[500px]">
              {/* Left Column: Partners List */}
              <div className="w-full lg:w-1/3 flex flex-col gap-4 border-b lg:border-b-0 lg:border-r border-slate-800/60 pb-6 lg:pb-0 lg:pr-6">
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
                    <input
                      type="text"
                      value={partnerSearchQuery}
                      onChange={(e) => setPartnerSearchQuery(e.target.value)}
                      placeholder="Search partners by name..."
                      className="w-full rounded-xl border border-slate-800 bg-slate-950/60 py-2 pl-9 pr-3 text-xs text-slate-200 outline-none focus:border-indigo-500"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingPartner({
                        name: "",
                        category: "Technology & Software",
                        description: "",
                        logoLetter: "",
                        themeColor: "from-blue-500 to-indigo-600",
                      });
                      setPartnerIndex(null);
                      setIsPartnerFormOpen(true);
                    }}
                    className="inline-flex items-center gap-1 bg-indigo-600 hover:bg-indigo-750 text-white font-extrabold text-[10px] px-3 py-2.5 rounded-xl transition shadow-lg shadow-indigo-600/10 uppercase tracking-wider cursor-pointer whitespace-nowrap hover:-translate-y-0.5 duration-200"
                  >
                    <Plus className="h-3.5 w-3.5 stroke-[3]" /> Add Partner
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto max-h-[55vh] space-y-2 pr-1">
                  {loadingPartners ? (
                    <div className="py-10 text-center space-y-2">
                      <Loader2 className="h-5 w-5 animate-spin text-indigo-500 mx-auto" />
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Loading Partners...</p>
                    </div>
                  ) : partners.length === 0 ? (
                    <p className="text-xs text-slate-500 text-center py-6">No partners in database.</p>
                  ) : (
                    partners
                      .filter((p) => p.name.toLowerCase().includes(partnerSearchQuery.toLowerCase()))
                      .map((partner, idx) => {
                        const originalIndex = partners.findIndex((item) => item.name === partner.name);
                        return (
                          <div
                            key={idx}
                            className="bg-slate-950/40 border border-slate-800/60 p-3.5 rounded-xl shadow-sm flex items-center justify-between gap-4 hover:border-slate-700/80 transition-colors"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className={`h-9 w-9 rounded-lg ${partner.logoUrl ? 'bg-white p-1 flex items-center justify-center border border-slate-800' : `bg-gradient-to-br ${partner.themeColor} text-white font-black text-sm flex items-center justify-center`} shrink-0`}>
                                {partner.logoUrl ? (
                                  <img src={partner.logoUrl} alt={partner.name} className="h-full w-full object-contain" />
                                ) : (
                                  partner.logoLetter || partner.name.charAt(0)
                                )}
                              </div>
                              <div className="min-w-0">
                                <h4 className="text-xs font-black text-slate-200 truncate">{partner.name}</h4>
                                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block mt-0.5">{partner.category}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                onClick={() => {
                                  setEditingPartner({ ...partner });
                                  setPartnerIndex(originalIndex);
                                  setIsPartnerFormOpen(true);
                                }}
                                className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700/50 text-indigo-400 transition cursor-pointer"
                                title="Edit Partner"
                              >
                                <Edit2 className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`Are you sure you want to delete ${partner.name}?`)) {
                                    const updated = partners.filter((_, i) => i !== originalIndex);
                                    handleSavePartnersList(updated);
                                  }
                                }}
                                className="p-1.5 rounded bg-slate-800 hover:bg-rose-500/10 border border-slate-700/50 text-rose-400 transition cursor-pointer"
                                title="Delete Partner"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })
                  )}
                </div>
              </div>

              {/* Right Column: Add/Edit Form */}
              <div className="flex-1 flex flex-col min-w-0">
                {isPartnerFormOpen && editingPartner ? (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      let updated: Partner[];
                      if (partnerIndex !== null) {
                        updated = [...partners];
                        updated[partnerIndex] = editingPartner;
                      } else {
                        updated = [...partners, editingPartner];
                      }
                      handleSavePartnersList(updated);
                      setIsPartnerFormOpen(false);
                      setEditingPartner(null);
                      setPartnerIndex(null);
                    }}
                    className="flex-1 flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-4">
                      <h4 className="text-xs font-black text-slate-200 uppercase tracking-wider pb-2 border-b border-slate-800/60">
                        {partnerIndex !== null ? `Edit Partner: ${editingPartner.name}` : "Add New Hiring Partner"}
                      </h4>

                      {/* Company Name */}
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Company Name</label>
                        <input
                          type="text"
                          required
                          value={editingPartner.name}
                          onChange={(e) => setEditingPartner({ ...editingPartner, name: e.target.value })}
                          className="w-full rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2 text-xs text-slate-200 outline-none focus:border-indigo-500"
                          placeholder="e.g. Google Cloud Partner"
                        />
                      </div>

                      {/* Category Selection */}
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Category Sector</label>
                        <select
                          value={editingPartner.category}
                          onChange={(e) => setEditingPartner({ ...editingPartner, category: e.target.value as any })}
                          className="w-full rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2 text-xs text-slate-200 outline-none focus:border-indigo-500 cursor-pointer"
                        >
                          <option value="Technology & Software">Technology & Software</option>
                          <option value="Research & Academics">Research & Academics</option>
                          <option value="Consulting & Finance">Consulting & Finance</option>
                          <option value="Cybersecurity & Ops">Cybersecurity & Ops</option>
                          <option value="Healthcare & Biotech">Healthcare & Biotech</option>
                          <option value="Engineering & Logistics">Engineering & Logistics</option>
                        </select>
                      </div>

                      {/* Logo Letter & Theme Color */}
                      <div className="grid grid-cols-3 gap-3">
                        <div className="col-span-1">
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Logo Letter</label>
                          <input
                            type="text"
                            maxLength={1}
                            required
                            value={editingPartner.logoLetter}
                            onChange={(e) => setEditingPartner({ ...editingPartner, logoLetter: e.target.value.toUpperCase() })}
                            className="w-full rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2 text-xs outline-none text-center font-black text-white"
                            placeholder="e.g. G"
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Color Theme Preset</label>
                          <select
                            value={editingPartner.themeColor}
                            onChange={(e) => setEditingPartner({ ...editingPartner, themeColor: e.target.value })}
                            className="w-full rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2 text-xs text-slate-200 outline-none focus:border-indigo-500 cursor-pointer"
                          >
                            <option value="from-blue-500 to-indigo-600">Blue / Indigo</option>
                            <option value="from-teal-600 to-cyan-700">Teal / Cyan</option>
                            <option value="from-emerald-500 to-green-600">Emerald / Green</option>
                            <option value="from-amber-500 to-orange-600">Amber / Orange</option>
                            <option value="from-rose-600 to-red-700">Rose / Red</option>
                            <option value="from-purple-600 to-violet-700">Purple / Violet</option>
                            <option value="from-slate-600 to-slate-800">Slate / Stone</option>
                            <option value="from-pink-500 to-purple-600">Pink / Purple</option>
                          </select>
                        </div>
                      </div>

                      {/* Company Logo Upload */}
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                          Company Logo (Optional)
                        </label>
                        <div className="mt-1 flex items-center gap-4">
                          {editingPartner.logoUrl ? (
                            <div className="relative h-16 w-24 border border-slate-800 rounded-xl bg-slate-900/60 p-2 flex items-center justify-center group/logo select-none shrink-0 animate-fade-in">
                              <img
                                src={editingPartner.logoUrl}
                                alt="Company Logo"
                                className="h-full w-auto object-contain"
                              />
                              <button
                                type="button"
                                onClick={() => setEditingPartner({ ...editingPartner, logoUrl: undefined })}
                                className="absolute -top-1.5 -right-1.5 p-1 bg-rose-600 text-white rounded-full hover:bg-rose-700 transition shadow-md cursor-pointer"
                                title="Remove Logo"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ) : (
                            <div className="h-16 w-24 border border-slate-800 rounded-xl bg-slate-950/40 flex flex-col items-center justify-center shrink-0 text-slate-500 select-none text-[9px] font-bold uppercase tracking-wider">
                              No Logo
                            </div>
                          )}

                          <div className="flex-1">
                            <label className="relative flex items-center justify-center gap-2 border border-indigo-500/20 hover:border-indigo-500/40 rounded-xl px-4 py-2.5 bg-indigo-500/5 hover:bg-indigo-500/10 text-indigo-400 font-black text-xs transition cursor-pointer select-none">
                              {uploadingPartnerLogo ? (
                                <>
                                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                  Uploading...
                                </>
                              ) : (
                                <>
                                  <Upload className="h-3.5 w-3.5" />
                                  {editingPartner.logoUrl ? "Change Logo" : "Upload Logo"}
                                </>
                              )}
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handlePartnerLogoChange}
                                disabled={uploadingPartnerLogo}
                                className="sr-only"
                              />
                            </label>
                            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mt-1.5">
                              Recommended: PNG with transparent background.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Company Description</label>
                        <textarea
                          rows={4}
                          required
                          value={editingPartner.description}
                          onChange={(e) => setEditingPartner({ ...editingPartner, description: e.target.value })}
                          className="w-full rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2 text-xs text-slate-200 outline-none focus:border-indigo-500 resize-none leading-relaxed"
                          placeholder="Provide a description of what the company does and how it partners with RACE..."
                        />
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-800/60 flex items-center justify-end gap-2.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          setIsPartnerFormOpen(false);
                          setEditingPartner(null);
                          setPartnerIndex(null);
                        }}
                        className="text-[10px] font-bold text-slate-400 hover:text-slate-200 px-3.5 py-2 bg-slate-850 border border-slate-700/50 rounded-xl transition"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="text-[10px] font-black bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl shadow-lg shadow-emerald-600/10 transition uppercase tracking-wider"
                      >
                        {partnerIndex !== null ? "Save Partner" : "Add Partner"}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-slate-500 select-none">
                    <Building className="h-10 w-10 text-slate-700 mb-2.5" />
                    <p className="text-xs font-bold uppercase tracking-wider">No Partner Selected</p>
                    <p className="text-[10px] text-indigo-400/80 mt-1">Select a partner from the list to edit their details, or click "Add Partner" to create a new one.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Section: Journey Stats */}
        {currentSection === "journey-stats" && (
          <div className="bg-slate-900/60 border border-slate-800/80 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden flex flex-col animate-fade-in">
            <div className="bg-slate-950/40 px-6 py-5 border-b border-slate-800/80 flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-white uppercase tracking-wider">Edit Journey Stats</h3>
                <p className="text-[10px] text-slate-400 font-bold mt-0.5">Update statistics shown in the "Our Journey So Far" section on home page</p>
              </div>
            </div>

            <form onSubmit={handleSaveStats} className="p-6 space-y-4">
              <div className="space-y-4">
                {loadingStats ? (
                  <div className="py-10 text-center space-y-2">
                    <Loader2 className="h-6 w-6 animate-spin text-indigo-500 mx-auto" />
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Loading Stats...</p>
                  </div>
                ) : stats.length === 0 ? (
                  <p className="text-xs text-slate-500">No stats available.</p>
                ) : (
                  stats.map((stat, idx) => (
                    <div key={idx} className="p-4 bg-slate-950/40 rounded-xl border border-slate-800/60 flex flex-col sm:flex-row gap-4 items-center justify-between">
                      <div className="flex items-center gap-3 shrink-0">
                        <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
                          {stat.iconName === "GraduationCap" && <GraduationCap className="h-5 w-5" />}
                          {stat.iconName === "Users" && <Users className="h-5 w-5" />}
                          {stat.iconName === "Award" && <Award className="h-5 w-5" />}
                          {stat.iconName === "Building" && <Building className="h-5 w-5" />}
                          {stat.iconName === "Briefcase" && <Briefcase className="h-5 w-5" />}
                        </div>

                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-slate-200">Stat #{idx + 1}</span>
                          <select
                            value={stat.iconName}
                            onChange={(e) => {
                              const newStats = [...stats];
                              newStats[idx] = { ...newStats[idx], iconName: e.target.value };
                              setStats(newStats);
                            }}
                            className="text-[10px] font-bold text-amber-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded outline-none cursor-pointer hover:underline"
                          >
                            <option value="GraduationCap">Education Icon</option>
                            <option value="Users">Users Icon</option>
                            <option value="Award">Award Icon</option>
                            <option value="Building">Building Icon</option>
                            <option value="Briefcase">Briefcase Icon</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1 w-full">
                        <div>
                          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">Value</label>
                          <input
                            type="text"
                            required
                            value={stat.value}
                            onChange={(e) => {
                              const newStats = [...stats];
                              newStats[idx] = { ...newStats[idx], value: e.target.value };
                              setStats(newStats);
                            }}
                            placeholder="e.g. 8+, 1000+"
                            className="w-full rounded-lg border border-slate-800 bg-slate-900/60 text-slate-200 px-3 py-2 text-xs outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">Label</label>
                          <input
                            type="text"
                            required
                            value={stat.label}
                            onChange={(e) => {
                              const newStats = [...stats];
                              newStats[idx] = { ...newStats[idx], label: e.target.value };
                              setStats(newStats);
                            }}
                            placeholder="e.g. Years in Tech Education"
                            className="w-full rounded-lg border border-slate-800 bg-slate-900/60 text-slate-200 px-3 py-2 text-xs outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                          />
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="pt-4 border-t border-slate-800/60 flex items-center justify-end gap-3 font-sans">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-black tracking-wider text-white shadow-lg shadow-indigo-600/10 hover:bg-indigo-700 hover:-translate-y-0.5 transition duration-200 uppercase cursor-pointer"
                >
                  Save Journey Stats
                </button>
              </div>
            </form>
          </div>
        )}
      </main>

      {/* Profile Form Editor Drawer Overlay */}
      {isEditorOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-end">
          <div className="bg-[#0B0F19] border-l border-slate-800/80 w-full max-w-4xl h-full shadow-2xl flex flex-col animate-slide-left relative overflow-hidden">
            
            {/* Drawer Header */}
            <div className="bg-slate-950/90 text-white px-6 py-5 flex items-center justify-between border-b border-slate-800/80 shrink-0">
              <div>
                <h3 className="text-base font-black uppercase tracking-wider">
                  {isEditMode ? `Edit Profile: ${formStudent.name}` : "Create Candidate Profile"}
                </h3>
                <p className="text-[10px] text-indigo-400 font-bold mt-0.5">Fill details manually or drag & drop a PDF resume to auto-fill</p>
              </div>
              <button
                onClick={() => setIsEditorOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:text-white hover:bg-slate-800/60 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Resume Upload parsing status banner */}
            {uploadError && (
              <div className="bg-rose-950/40 border-b border-rose-900/50 px-6 py-2.5 text-xs text-rose-300 font-bold flex items-center justify-between shrink-0">
                <div className="flex items-center gap-1.5">
                  <XCircle className="h-4 w-4 text-rose-500" />
                  <span>{uploadError}</span>
                </div>
                <button onClick={() => setUploadError(null)} className="text-rose-400 hover:text-rose-300 font-black">Dismiss</button>
              </div>
            )}

            {/* Dynamic Tabs Bar */}
            <div className="bg-slate-950/50 border-b border-slate-800/60 px-6 flex overflow-x-auto shrink-0 scrollbar-none">
              <TabButton active={activeTab === "basic"} onClick={() => setActiveTab("basic")} label="1. Basic Info" icon={<User className="h-3.5 w-3.5" />} />
              <TabButton active={activeTab === "contact"} onClick={() => setActiveTab("contact")} label="2. Contact & Links" icon={<Mail className="h-3.5 w-3.5" />} />
              <TabButton active={activeTab === "placement"} onClick={() => setActiveTab("placement")} label="3. Placement Status" icon={<CheckCircle className="h-3.5 w-3.5" />} />
              <TabButton active={activeTab === "education"} onClick={() => setActiveTab("education")} label="4. Education" icon={<GraduationCap className="h-3.5 w-3.5" />} />
              <TabButton active={activeTab === "skills"} onClick={() => setActiveTab("skills")} label="5. Core Skills" icon={<Wrench className="h-3.5 w-3.5" />} />
              <TabButton active={activeTab === "projects"} onClick={() => setActiveTab("projects")} label="6. Experience & Projects" icon={<FolderGit2 className="h-3.5 w-3.5" />} />
              <TabButton active={activeTab === "extras"} onClick={() => setActiveTab("extras")} label="7. Extras & IP" icon={<Award className="h-3.5 w-3.5" />} />
            </div>

            {/* Drawer Body Scroll Container */}
            <form onSubmit={handleSaveStudent} className="flex-1 overflow-y-auto p-8 space-y-6">
              
              {/* Tab 1: Basic Info */}
              {activeTab === "basic" && (
                <div className="space-y-6">
                  {/* Resume Upload Parser Dropzone */}
                  <div className="border-2 border-dashed border-slate-800 bg-slate-950/40 rounded-2xl p-6 hover:bg-indigo-500/5 hover:border-indigo-500 transition duration-200 flex flex-col items-center justify-center text-center relative group">
                    {uploadingResume ? (
                      <div className="py-4 space-y-2">
                        <Loader2 className="h-8 w-8 animate-spin text-indigo-400 mx-auto" />
                        <p className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Parsing Resume PDF details...</p>
                      </div>
                    ) : (
                      <>
                        <Upload className="h-8 w-8 text-slate-500 group-hover:text-indigo-400 transition-colors mb-2.5" />
                        <p className="text-xs font-bold text-slate-300 leading-tight">Drag and drop PDF resume here to auto-fill details</p>
                        <p className="text-[10px] text-slate-500 mt-1 font-medium">Or click to select a file from local directory</p>
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={handleResumeChange}
                          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                          title=""
                        />
                      </>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Name */}
                    <div>
                      <label htmlFor="form-name" className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                        Student Full Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        id="form-name"
                        type="text"
                        required
                        value={formStudent.name}
                        onChange={(e) => {
                          const n = e.target.value;
                          setFormStudent((prev) => ({
                            ...prev,
                            name: n,
                            slug: prev.slug || slugify(n),
                          }));
                        }}
                        placeholder="e.g. Chalukya Nayaka B K"
                        className="w-full rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2.5 text-xs text-slate-200 outline-none focus:border-indigo-500 focus:ring-indigo-500 focus:ring-1"
                      />
                    </div>

                    {/* Slug */}
                    <div>
                      <label htmlFor="form-slug" className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                        URL Identifier Slug (Auto-generated)
                      </label>
                      <input
                        id="form-slug"
                        type="text"
                        value={formStudent.slug || ""}
                        onChange={(e) => setFormStudent((prev) => ({ ...prev, slug: e.target.value }))}
                        placeholder="e.g. chalukya-nayaka-b-k"
                        className="w-full rounded-xl border border-slate-800/60 bg-slate-950/60 px-3 py-2.5 text-xs outline-none font-mono text-slate-500"
                        disabled={isEditMode}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Specialization */}
                    <div>
                      <label htmlFor="form-spec" className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                        Specialization Track <span className="text-rose-500">*</span>
                      </label>
                      <select
                        id="form-spec"
                        value={formStudent.specialization}
                        onChange={(e) => setFormStudent((prev) => ({ ...prev, specialization: e.target.value as Specialization }))}
                        className="w-full rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2.5 text-xs text-slate-200 outline-none focus:border-indigo-500 focus:ring-indigo-500 cursor-pointer"
                      >
                        <option value="Artificial Intelligence">Artificial Intelligence</option>
                        <option value="Cybersecurity">Cybersecurity</option>
                      </select>
                    </div>

                    {/* Gender */}
                    <div>
                      <label htmlFor="form-gender" className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                        Gender <span className="text-rose-500">*</span>
                      </label>
                      <select
                        id="form-gender"
                        value={formStudent.gender}
                        onChange={(e) => setFormStudent((prev) => ({ ...prev, gender: e.target.value as Gender }))}
                        className="w-full rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2.5 text-xs text-slate-200 outline-none focus:border-indigo-500 focus:ring-indigo-500 cursor-pointer"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>
                  </div>

                  {/* Headline */}
                  <div>
                    <label htmlFor="form-headline" className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                      Professional Headline <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="form-headline"
                      type="text"
                      required
                      value={formStudent.headline}
                      onChange={(e) => setFormStudent((prev) => ({ ...prev, headline: e.target.value }))}
                      placeholder="e.g. Cybersecurity Engineer / AI Developer"
                      className="w-full rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2.5 text-xs text-slate-200 outline-none focus:border-indigo-500 focus:ring-indigo-500 focus:ring-1"
                    />
                  </div>

                  {/* Location & Photo */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="form-location" className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                        Location / City
                      </label>
                      <input
                        id="form-location"
                        type="text"
                        value={formStudent.location || ""}
                        onChange={(e) => setFormStudent((prev) => ({ ...prev, location: e.target.value }))}
                        placeholder="e.g. Bengaluru, India"
                        className="w-full rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2.5 text-xs text-slate-200 outline-none focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="photo-file" className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                        Upload Profile Picture
                      </label>
                      <div className="relative">
                        <input
                          id="photo-file"
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoChange}
                          className="w-full rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2.5 text-xs text-slate-400 outline-none focus:border-indigo-500 file:mr-2.5 file:rounded-md file:border-0 file:bg-slate-800 file:text-slate-300 file:border-slate-700/50 hover:file:bg-slate-750 file:px-2.5 file:py-1 file:text-xs file:font-extrabold"
                        />
                        {uploadingPhoto && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-slate-500" />}
                      </div>
                    </div>
                  </div>

                  {/* Professional Summary */}
                  <div>
                    <label htmlFor="form-about" className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                      Professional Summary / About Bio <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      id="form-about"
                      required
                      rows={5}
                      value={formStudent.about}
                      onChange={(e) => setFormStudent((prev) => ({ ...prev, about: e.target.value }))}
                      placeholder="Write a compelling professional summary that displays their core specialties and competencies..."
                      className="w-full rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2.5 text-xs text-slate-200 outline-none focus:border-indigo-500 focus:ring-indigo-500 leading-relaxed resize-y"
                    />
                  </div>
                </div>
              )}

              {/* Tab 2: Contact Details */}
              {activeTab === "contact" && (
                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="form-phone" className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                        Contact Phone
                      </label>
                      <input
                        id="form-phone"
                        type="text"
                        value={formStudent.phone || ""}
                        onChange={(e) => setFormStudent((prev) => ({ ...prev, phone: e.target.value }))}
                        placeholder="e.g. +91 9999999999"
                        className="w-full rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2.5 text-xs text-slate-200 outline-none focus:border-indigo-500 focus:ring-indigo-500 focus:ring-1"
                      />
                    </div>
                    <div>
                      <label htmlFor="form-email" className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                        Personal Email
                      </label>
                      <input
                        id="form-email"
                        type="email"
                        value={formStudent.email || ""}
                        onChange={(e) => setFormStudent((prev) => ({ ...prev, email: e.target.value }))}
                        placeholder="e.g. candidate@gmail.com"
                        className="w-full rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2.5 text-xs text-slate-200 outline-none focus:border-indigo-500 focus:ring-indigo-500 focus:ring-1"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="form-college-email" className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                        University/College Email
                      </label>
                      <input
                        id="form-college-email"
                        type="email"
                        value={formStudent.collegeEmail || ""}
                        onChange={(e) => setFormStudent((prev) => ({ ...prev, collegeEmail: e.target.value }))}
                        placeholder="e.g. candidate@reva.edu.in"
                        className="w-full rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2.5 text-xs text-slate-200 outline-none focus:border-indigo-500 focus:ring-indigo-500 focus:ring-1"
                      />
                    </div>
                    <div>
                      <label htmlFor="resume-file" className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                        Resume File Path (PDF)
                      </label>
                      <input
                        id="resume-file"
                        type="text"
                        value={formStudent.resume || ""}
                        onChange={(e) => setFormStudent((prev) => ({ ...prev, resume: e.target.value }))}
                        placeholder="Automatic if resume uploaded, or enter path manually"
                        className="w-full rounded-xl border border-slate-800/60 bg-slate-950/60 px-3 py-2.5 text-xs outline-none font-mono text-slate-500"
                        disabled
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="form-linkedin" className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                        LinkedIn URL
                      </label>
                      <input
                        id="form-linkedin"
                        type="text"
                        value={formStudent.linkedin || ""}
                        onChange={(e) => setFormStudent((prev) => ({ ...prev, linkedin: e.target.value }))}
                        placeholder="e.g. https://www.linkedin.com/in/username"
                        className="w-full rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2.5 text-xs text-slate-200 outline-none focus:border-indigo-500 focus:ring-indigo-500 focus:ring-1"
                      />
                    </div>
                    <div>
                      <label htmlFor="form-github" className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                        GitHub Profile URL
                      </label>
                      <input
                        id="form-github"
                        type="text"
                        value={formStudent.github || ""}
                        onChange={(e) => setFormStudent((prev) => ({ ...prev, github: e.target.value }))}
                        placeholder="e.g. https://github.com/username"
                        className="w-full rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2.5 text-xs text-slate-200 outline-none focus:border-indigo-500 focus:ring-indigo-500 focus:ring-1"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Placement Info */}
              {activeTab === "placement" && (
                <div className="space-y-6">
                  <div className="bg-slate-950/40 border border-slate-800/60 rounded-2xl p-6 space-y-4">
                    <label className="flex cursor-pointer items-center gap-2.5 select-none py-1">
                      <input
                        type="checkbox"
                        checked={!!formStudent.placement}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormStudent((prev) => ({
                              ...prev,
                              placement: { company: "", role: "" },
                            }));
                          } else {
                            setFormStudent((prev) => ({
                              ...prev,
                              placement: undefined,
                            }));
                          }
                        }}
                        className="h-4.5 w-4.5 rounded accent-indigo-600 cursor-pointer"
                      />
                      <span className="text-xs font-black text-slate-200 uppercase tracking-wider">
                        Mark Candidate as Placed
                      </span>
                    </label>

                    {formStudent.placement && (
                      <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-800/60 animate-scale-up">
                        <div>
                          <label htmlFor="form-placement-company" className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                            Company Name <span className="text-rose-500">*</span>
                          </label>
                          <input
                            id="form-placement-company"
                            type="text"
                            required
                            value={formStudent.placement.company}
                            onChange={(e) => {
                              const company = e.target.value;
                              setFormStudent((prev) => ({
                                ...prev,
                                placement: prev.placement ? { ...prev.placement, company } : undefined,
                              }));
                            }}
                            placeholder="e.g. Skyworks Solutions"
                            className="w-full rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2.5 text-xs text-slate-200 outline-none focus:border-indigo-500 focus:ring-indigo-500 focus:ring-1"
                          />
                        </div>
                        <div>
                          <label htmlFor="form-placement-role" className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                            Job Role / Designation <span className="text-rose-500">*</span>
                          </label>
                          <input
                            id="form-placement-role"
                            type="text"
                            required
                            value={formStudent.placement.role}
                            onChange={(e) => {
                              const role = e.target.value;
                              setFormStudent((prev) => ({
                                ...prev,
                                placement: prev.placement ? { ...prev.placement, role } : undefined,
                              }));
                            }}
                            placeholder="e.g. GRC / Intern / GRC Analyst"
                            className="w-full rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2.5 text-xs text-slate-200 outline-none focus:border-indigo-500 focus:ring-indigo-500 focus:ring-1"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Tab 4: Education */}
              {activeTab === "education" && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-450 font-bold">Education Timeline Degrees</h4>
                    <button
                      type="button"
                      onClick={addEducation}
                      className="inline-flex items-center gap-1.5 bg-slate-800 border border-slate-700/50 hover:bg-slate-700 text-slate-350 font-extrabold text-[10px] px-3 py-1.5 rounded-lg transition"
                    >
                      <Plus className="h-3 w-3" /> Add Education
                    </button>
                  </div>

                  {formStudent.education.map((edu, idx) => (
                    <div key={idx} className="border border-slate-800 rounded-2xl p-5 bg-slate-955/40 relative animate-scale-up space-y-4">
                      <button
                        type="button"
                        onClick={() => removeEducation(idx)}
                        className="absolute right-3 top-3 text-slate-500 hover:text-rose-400 transition"
                      >
                        <X className="h-4.5 w-4.5" />
                      </button>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor={`form-edu-degree-${idx}`} className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                            Degree Title
                          </label>
                          <input
                            id={`form-edu-degree-${idx}`}
                            type="text"
                            required
                            value={edu.degree}
                            onChange={(e) => updateEducation(idx, "degree", e.target.value)}
                            placeholder="e.g. M.Tech. in Cyber Security"
                            className="w-full rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2 text-xs text-slate-200 outline-none focus:border-indigo-500 focus:ring-indigo-500 focus:ring-1"
                          />
                        </div>
                        <div>
                          <label htmlFor={`form-edu-inst-${idx}`} className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                            Institute / University
                          </label>
                          <input
                            id={`form-edu-inst-${idx}`}
                            type="text"
                            required
                            value={edu.institute}
                            onChange={(e) => updateEducation(idx, "institute", e.target.value)}
                            placeholder="e.g. REVA University"
                            className="w-full rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2 text-xs text-slate-200 outline-none focus:border-indigo-500 focus:ring-indigo-500 focus:ring-1"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor={`form-edu-period-${idx}`} className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                            Timeline Period
                          </label>
                          <input
                            id={`form-edu-period-${idx}`}
                            type="text"
                            required
                            value={edu.period}
                            onChange={(e) => updateEducation(idx, "period", e.target.value)}
                            placeholder="e.g. Nov 2025 – Nov 2027"
                            className="w-full rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2 text-xs text-slate-200 outline-none focus:border-indigo-500 focus:ring-indigo-500 focus:ring-1"
                          />
                        </div>
                        <div>
                          <label htmlFor={`form-edu-cgpa-${idx}`} className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                            CGPA (Optional)
                          </label>
                          <input
                            id={`form-edu-cgpa-${idx}`}
                            type="text"
                            value={edu.cgpa || ""}
                            onChange={(e) => updateEducation(idx, "cgpa", e.target.value)}
                            placeholder="e.g. 9.47 / 8.5"
                            className="w-full rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2 text-xs text-slate-200 outline-none focus:border-indigo-500 focus:ring-indigo-500 focus:ring-1"
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  {formStudent.education.length === 0 && (
                    <p className="text-center py-6 text-[11px] text-slate-500 font-bold uppercase tracking-wider border border-dashed border-slate-800/80 bg-slate-950/20 rounded-2xl">
                      No education records added. Click above to add.
                    </p>
                  )}
                </div>
              )}

              {/* Tab 5: Skills */}
              {activeTab === "skills" && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-450 font-bold">Skills Catalog Categories</h4>
                    <button
                      type="button"
                      onClick={addSkillGroup}
                      className="inline-flex items-center gap-1.5 bg-slate-800 border border-slate-700/50 hover:bg-slate-700 text-slate-350 font-extrabold text-[10px] px-3 py-1.5 rounded-lg transition"
                    >
                      <Plus className="h-3 w-3" /> Add Skills Category
                    </button>
                  </div>

                  {formStudent.skills.map((group, idx) => (
                    <div key={idx} className="border border-slate-800 rounded-2xl p-5 bg-slate-955/40 relative animate-scale-up space-y-4">
                      <button
                        type="button"
                        onClick={() => removeSkillGroup(idx)}
                        className="absolute right-3 top-3 text-slate-500 hover:text-rose-400 transition"
                      >
                        <X className="h-4.5 w-4.5" />
                      </button>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-1">
                          <label htmlFor={`form-skill-cat-${idx}`} className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                            Category Label
                          </label>
                          <input
                            id={`form-skill-cat-${idx}`}
                            type="text"
                            required
                            value={group.category}
                            onChange={(e) => updateSkillCategoryName(idx, e.target.value)}
                            placeholder="e.g. Programming / Tools"
                            className="w-full rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2 text-xs text-slate-200 outline-none focus:border-indigo-500 focus:ring-indigo-500 focus:ring-1"
                          />
                        </div>
                        <div className="col-span-2">
                          <label htmlFor={`form-skill-items-${idx}`} className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                            Core Skills (Comma separated list)
                          </label>
                          <input
                            id={`form-skill-items-${idx}`}
                            type="text"
                            value={group.items.join(", ")}
                            onChange={(e) => updateSkillGroupItems(idx, e.target.value)}
                            placeholder="e.g. Python, SQL, Java, TensorFlow"
                            className="w-full rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2 text-xs text-slate-200 outline-none focus:border-indigo-500 focus:ring-indigo-500 focus:ring-1"
                          />
                          <p className="text-[9px] text-slate-550 font-bold tracking-wider mt-1 uppercase">Separate skills using commas</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 6: Projects & Experience */}
              {activeTab === "projects" && (
                <div className="space-y-6">
                  {/* Part A: Work Experience */}
                  <div className="space-y-4 border-b border-slate-800/60 pb-6">
                    <div className="flex justify-between items-center">
                      <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-450 font-bold">Corporate Work Experience</h4>
                      <button
                        type="button"
                        onClick={addExperience}
                        className="inline-flex items-center gap-1.5 bg-slate-800 border border-slate-700/50 hover:bg-slate-700 text-slate-350 font-extrabold text-[10px] px-3 py-1.5 rounded-lg transition"
                      >
                        <Plus className="h-3 w-3" /> Add Experience
                      </button>
                    </div>

                    {(formStudent.workExperience || []).map((exp, expIdx) => (
                      <div key={expIdx} className="border border-slate-800 rounded-2xl p-5 bg-slate-955/40 relative animate-scale-up space-y-4">
                        <button
                          type="button"
                          onClick={() => removeExperience(expIdx)}
                          className="absolute right-3 top-3 text-slate-500 hover:text-rose-400 transition"
                        >
                          <X className="h-4.5 w-4.5" />
                        </button>

                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <label htmlFor={`form-exp-role-${expIdx}`} className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                              Role / Job Title
                            </label>
                            <input
                              id={`form-exp-role-${expIdx}`}
                              type="text"
                              required
                              value={exp.role}
                              onChange={(e) => updateExperience(expIdx, "role", e.target.value)}
                              placeholder="e.g. Intern"
                              className="w-full rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2 text-xs text-slate-200 outline-none focus:border-indigo-500 focus:ring-indigo-500 focus:ring-1"
                            />
                          </div>
                          <div>
                            <label htmlFor={`form-exp-comp-${expIdx}`} className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                              Company Name
                            </label>
                            <input
                              id={`form-exp-comp-${expIdx}`}
                              type="text"
                              required
                              value={exp.company}
                              onChange={(e) => updateExperience(expIdx, "company", e.target.value)}
                              placeholder="e.g. Skyworks Solutions"
                              className="w-full rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2 text-xs text-slate-200 outline-none focus:border-indigo-500 focus:ring-indigo-500 focus:ring-1"
                            />
                          </div>
                          <div>
                            <label htmlFor={`form-exp-period-${expIdx}`} className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                              Duration Period
                            </label>
                            <input
                              id={`form-exp-period-${expIdx}`}
                              type="text"
                              value={exp.period || ""}
                              onChange={(e) => updateExperience(expIdx, "period", e.target.value)}
                              placeholder="e.g. Mar 2025 – Jun 2025"
                              className="w-full rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2 text-xs text-slate-200 outline-none focus:border-indigo-500 focus:ring-indigo-500 focus:ring-1"
                            />
                          </div>
                        </div>

                        {/* Bullets Sub-section */}
                        <div className="space-y-2.5 pt-3 border-t border-slate-800/60">
                          <div className="flex justify-between items-center">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Key Responsibilities / Bullet points</label>
                            <button
                              type="button"
                              onClick={() => addExperienceBullet(expIdx)}
                              className="text-[9px] font-extrabold text-indigo-400 hover:text-indigo-300 hover:underline"
                            >
                              + Add Bullet
                            </button>
                          </div>
                          {exp.bullets.map((b, bulletIdx) => (
                            <div key={bulletIdx} className="flex gap-2 items-center animate-scale-up">
                              <span className="text-slate-650 font-bold shrink-0 text-xs">•</span>
                              <input
                                type="text"
                                required
                                value={b}
                                onChange={(e) => updateExperienceBullet(expIdx, bulletIdx, e.target.value)}
                                placeholder="Describe contribution or highlight metrics..."
                                className="flex-1 rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-1.5 text-xs text-slate-200 outline-none focus:border-indigo-500 focus:ring-indigo-500 focus:ring-1"
                              />
                              {exp.bullets.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeExperienceBullet(expIdx, bulletIdx)}
                                  className="text-slate-500 hover:text-rose-400 transition shrink-0"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Part B: Engineering Projects */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-450 font-bold">Featured Engineering Projects</h4>
                      <button
                        type="button"
                        onClick={addProject}
                        className="inline-flex items-center gap-1.5 bg-slate-800 border border-slate-700/50 hover:bg-slate-700 text-slate-350 font-extrabold text-[10px] px-3 py-1.5 rounded-lg transition"
                      >
                        <Plus className="h-3 w-3" /> Add Project
                      </button>
                    </div>

                    {formStudent.projects.map((proj, projIdx) => (
                      <div key={projIdx} className="border border-slate-800 rounded-2xl p-5 bg-slate-955/40 relative animate-scale-up space-y-4">
                        <button
                          type="button"
                          onClick={() => removeProject(projIdx)}
                          className="absolute right-3 top-3 text-slate-500 hover:text-rose-400 transition"
                        >
                          <X className="h-4.5 w-4.5" />
                        </button>

                        <div className="grid grid-cols-3 gap-4">
                          <div className="col-span-2">
                            <label htmlFor={`form-proj-title-${projIdx}`} className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                              Project Title
                            </label>
                            <input
                              id={`form-proj-title-${projIdx}`}
                              type="text"
                              required
                              value={proj.title}
                              onChange={(e) => updateProject(projIdx, "title", e.target.value)}
                              placeholder="e.g. AegisFace: Adversary Resistant Facial Recognition"
                              className="w-full rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2 text-xs text-slate-200 outline-none focus:border-indigo-500 focus:ring-indigo-500 focus:ring-1"
                            />
                          </div>
                          <div className="col-span-1">
                            <label htmlFor={`form-proj-tag-${projIdx}`} className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                              Tag Label
                            </label>
                            <input
                              id={`form-proj-tag-${projIdx}`}
                              type="text"
                              value={proj.tag || ""}
                              onChange={(e) => updateProject(projIdx, "tag", e.target.value)}
                              placeholder="e.g. Personal / Featured"
                              className="w-full rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2 text-xs text-slate-200 outline-none focus:border-indigo-500 focus:ring-indigo-500 focus:ring-1"
                            />
                          </div>
                        </div>

                        {/* Bullets Sub-section */}
                        <div className="space-y-2.5 pt-3 border-t border-slate-800/60">
                          <div className="flex justify-between items-center">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Project description bullets</label>
                            <button
                              type="button"
                              onClick={() => addProjectBullet(projIdx)}
                              className="text-[9px] font-extrabold text-indigo-400 hover:text-indigo-300 hover:underline"
                            >
                              + Add Bullet
                            </button>
                          </div>
                          {proj.bullets.map((b, bulletIdx) => (
                            <div key={bulletIdx} className="flex gap-2 items-center animate-scale-up">
                              <span className="text-slate-650 font-bold shrink-0 text-xs">•</span>
                              <input
                                type="text"
                                required
                                value={b}
                                onChange={(e) => updateProjectBullet(projIdx, bulletIdx, e.target.value)}
                                placeholder="Describe contribution or highlight metrics..."
                                className="flex-1 rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-1.5 text-xs text-slate-200 outline-none focus:border-indigo-500 focus:ring-indigo-500 focus:ring-1"
                              />
                              {proj.bullets.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeProjectBullet(projIdx, bulletIdx)}
                                  className="text-slate-500 hover:text-rose-400 transition shrink-0"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 7: Certifications & IP */}
              {activeTab === "extras" && (
                <div className="space-y-6">
                  {/* Certifications list */}
                  <div className="space-y-3">
                    <label htmlFor="form-certs" className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Professional Certifications (Comma separated)
                    </label>
                    <textarea
                      id="form-certs"
                      rows={3}
                      value={formStudent.certifications.join(", ")}
                      onChange={(e) =>
                        setFormStudent((prev) => ({
                          ...prev,
                          certifications: e.target.value.split(",").map((s) => s.trim()).filter((s) => s.length > 0),
                        }))
                      }
                      placeholder="e.g. Python for Data Science - IBM, CISCO Introduction to Cybersecurity"
                      className="w-full rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2.5 text-xs text-slate-200 outline-none focus:border-indigo-500 focus:ring-indigo-500 leading-relaxed resize-y"
                    />
                    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Separate certification titles with commas</p>
                  </div>

                  {/* Research Publications list */}
                  <div className="space-y-3">
                    <label htmlFor="form-pubs" className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Research Publications & Patent items (Comma separated)
                    </label>
                    <textarea
                      id="form-pubs"
                      rows={3}
                      value={(formStudent.publications || []).join(", ")}
                      onChange={(e) =>
                        setFormStudent((prev) => ({
                          ...prev,
                          publications: e.target.value.split(",").map((s) => s.trim()).filter((s) => s.length > 0),
                        }))
                      }
                      placeholder="e.g. AI-Based Content Moderator for Devanagari Scripts, System for Classifying CVE Alerts (Patent)"
                      className="w-full rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2.5 text-xs text-slate-200 outline-none focus:border-indigo-500 focus:ring-indigo-500 leading-relaxed resize-y"
                    />
                    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Separate publication titles with commas</p>
                  </div>
                </div>
              )}
            </form>

            {/* Drawer Footer Actions */}
            <div className="bg-slate-950/90 border-t border-slate-800/80 px-6 py-4 flex items-center justify-between shrink-0">
              <button
                type="button"
                onClick={() => setIsEditorOpen(false)}
                className="text-xs font-bold text-slate-400 hover:text-slate-200 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700/50 rounded-xl transition"
              >
                Cancel
              </button>
              
              <div className="flex gap-2">
                {activeTab !== "basic" && (
                  <button
                    type="button"
                    onClick={() => {
                      if (activeTab === "contact") setActiveTab("basic");
                      else if (activeTab === "placement") setActiveTab("contact");
                      else if (activeTab === "education") setActiveTab("placement");
                      else if (activeTab === "skills") setActiveTab("education");
                      else if (activeTab === "projects") setActiveTab("skills");
                      else if (activeTab === "extras") setActiveTab("projects");
                    }}
                    className="text-xs font-bold text-indigo-400 border border-indigo-500/20 px-4 py-2 rounded-xl hover:bg-slate-900/50 hover:text-white transition"
                  >
                    Previous Step
                  </button>
                )}
                {activeTab !== "extras" ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (activeTab === "basic") setActiveTab("contact");
                      else if (activeTab === "contact") setActiveTab("placement");
                      else if (activeTab === "placement") setActiveTab("education");
                      else if (activeTab === "education") setActiveTab("skills");
                      else if (activeTab === "skills") setActiveTab("projects");
                      else if (activeTab === "projects") setActiveTab("extras");
                    }}
                    className="text-xs font-bold bg-indigo-600 text-white px-5 py-2.5 rounded-xl hover:bg-indigo-750 transition flex items-center gap-1 shadow-lg shadow-indigo-600/10"
                  >
                    Next Step <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={handleSaveStudent}
                    className="text-xs font-black bg-emerald-600 text-white px-6 py-2.5 rounded-xl hover:bg-emerald-750 transition shadow-lg shadow-emerald-600/10 uppercase tracking-wider animate-pulse"
                  >
                    {isEditMode ? "Save Profile Updates" : "Create Candidate"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Double Confirmation Delete Modal */}
      {deleteCandidateSlug && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-sm w-full p-6 shadow-2xl animate-scale-up text-center space-y-4">
            <div className="h-12 w-12 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center mx-auto shadow-sm">
              <Trash2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white uppercase tracking-wide">Delete Candidate Profile?</h3>
              <p className="text-xs text-slate-400 font-semibold mt-1">This operation is permanent. It deletes their database details, uploaded resume, and photo.</p>
            </div>
            <div className="flex gap-2.5 pt-2">
              <button
                onClick={() => setDeleteCandidateSlug(null)}
                className="flex-1 py-2.5 text-xs font-bold text-slate-400 bg-slate-800 hover:bg-slate-700 border border-slate-700/50 rounded-xl transition"
              >
                Keep Profile
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-2.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-md transition"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Footer */}
      <footer className="border-t border-slate-800/80 bg-[#070A13] py-6 text-center text-xs text-slate-500 font-bold mt-12">
        © REVA University · RACE Department · Placement Admin Portal
      </footer>
    </div>
  );
}

function StatCard({
  label,
  val,
  icon,
  subtitle,
}: {
  label: string;
  val: number | string;
  icon?: React.ReactNode;
  subtitle?: string;
}) {
  return (
    <div className="bg-slate-900/60 border border-slate-800/80 backdrop-blur-md p-5 rounded-2xl shadow-lg hover:border-indigo-500/40 hover:-translate-y-1 transition-all duration-300 flex items-center justify-between group relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-indigo-500/5 rounded-full blur-xl group-hover:bg-indigo-500/10 transition-all duration-300" />
      
      <div className="relative z-10">
        <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-2">{label}</p>
        <p className="text-3xl font-black text-white tracking-tight leading-none">{val}</p>
        {subtitle && <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-1.5">{subtitle}</p>}
      </div>
      {icon && (
        <div className="h-11 w-11 bg-slate-800/80 rounded-xl flex items-center justify-center border border-slate-700/50 text-indigo-400 group-hover:text-indigo-300 group-hover:bg-slate-700/80 transition-all duration-300 shadow-inner relative z-10 shrink-0">
          {icon}
        </div>
      )}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  label,
  icon,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-2 py-4 px-4 border-b-2 font-bold text-xs shrink-0 select-none transition-all duration-200 ${
        active
          ? "border-indigo-500 text-indigo-400 bg-indigo-950/20"
          : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/30"
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
