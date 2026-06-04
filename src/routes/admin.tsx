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
  getDashboardChartsFn,
  saveDashboardChartsFn,
  getBatchPlacementRecordsFn,
  saveBatchPlacementRecordsFn,
  syncToGitFilesFn,
  getPlacementBannersFn,
  savePlacementBannersFn,
  uploadPlacementBannerFn,
  type Partner,
  type PlacementBanner,
  type PlacementStatRow,
  type DashboardChart,
  type ChartDataPoint,
  type BatchPlacementRecord,
} from "../actions";
import { type Student, type Specialization, type Gender, type EducationItem, type WorkItem, type ProjectItem, type SkillGroup } from "@/data/students";
import {
  BarChart as RechartsBarChart,
  Bar as RechartsBar,
  XAxis as RechartsXAxis,
  YAxis as RechartsYAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer as RechartsResponsiveContainer,
  LabelList as RechartsLabelList,
  CartesianGrid as RechartsCartesianGrid,
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
  BarChart,
  Database,
  RotateCcw,
  Image,
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

function AdminDashboardPage() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loadingSession, setLoadingSession] = useState(true);
  const [currentSection, setCurrentSection] = useState<"dashboard" | "candidates" | "placement-stats" | "partners" | "journey-stats" | "placement-charts" | "placement-banners">("dashboard");

  // Data States
  const [students, setStudents] = useState<Student[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [specFilter, setSpecFilter] = useState<"All" | Specialization>("All");
  const [placedFilter, setPlacedFilter] = useState<"All" | "Placed" | "Unplaced">("All");

  // Placement Banners CRUD States
  const [placementBanners, setPlacementBanners] = useState<PlacementBanner[]>([]);
  const [loadingBanners, setLoadingBanners] = useState(true);
  const [editingBanner, setEditingBanner] = useState<PlacementBanner | null>(null);
  const [bannerIndex, setBannerIndex] = useState<number | null>(null);
  const [isBannerFormOpen, setIsBannerFormOpen] = useState(false);
  const [uploadingBannerImage, setUploadingBannerImage] = useState(false);

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

  // Batch Placement Records CRUD States
  const [batchRecords, setBatchRecords] = useState<BatchPlacementRecord[]>([]);
  const [loadingBatchRecords, setLoadingBatchRecords] = useState(true);

  // Placement Dashboard Charts CRUD States
  const [dashboardCharts, setDashboardCharts] = useState<DashboardChart[]>([]);
  const [loadingDashboardCharts, setLoadingDashboardCharts] = useState(true);
  const [selectedChartIdx, setSelectedChartIdx] = useState<number>(0);

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
          fetchBatchRecords();
          fetchDashboardCharts();
          fetchBanners();
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

  const fetchBanners = async () => {
    setLoadingBanners(true);
    try {
      const data = await getPlacementBannersFn();
      setPlacementBanners(data);
    } catch (err) {
      console.error("Failed to load placement banners:", err);
      showNotification("error", "Failed to load placement banners.");
    } finally {
      setLoadingBanners(false);
    }
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

  const fetchDashboardCharts = async () => {
    setLoadingDashboardCharts(true);
    try {
      const data = await getDashboardChartsFn();
      setDashboardCharts(data);
    } catch (err) {
      console.error("Failed to load dashboard charts:", err);
      showNotification("error", "Failed to load dashboard charts.");
    } finally {
      setLoadingDashboardCharts(false);
    }
  };

  const handleSaveDashboardCharts = async (e: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      const result = await saveDashboardChartsFn({ data: dashboardCharts });
      if (result.success) {
        showNotification("success", "Placement analytics charts updated successfully.");
        fetchDashboardCharts();
      } else {
        showNotification("error", "Failed to save placement charts.");
      }
    } catch (err) {
      console.error("Save placement charts failed:", err);
      showNotification("error", "Error saving placement charts.");
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

  const fetchBatchRecords = async () => {
    setLoadingBatchRecords(true);
    try {
      const data = await getBatchPlacementRecordsFn();
      setBatchRecords(data);
    } catch (err) {
      console.error("Failed to load batch records:", err);
      showNotification("error", "Failed to load batch records.");
    } finally {
      setLoadingBatchRecords(false);
    }
  };

  const handleSaveBatchRecords = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await saveBatchPlacementRecordsFn({ data: batchRecords });
      if (result.success) {
        showNotification("success", "Batch Intake & Outcomes updated successfully.");
        fetchBatchRecords();
      } else {
        showNotification("error", "Failed to save batch intake & outcomes.");
      }
    } catch (err) {
      console.error("Save batch records failed:", err);
      showNotification("error", "Error saving batch intake & outcomes.");
    }
  };

  const handleAddBatchRecordRow = () => {
    const newRow: BatchPlacementRecord = {
      academicYear: "",
      pgcet: 0,
      uqmq: 0,
      total: 0,
      internship: 0,
      ftPlacement: 0
    };
    setBatchRecords([...batchRecords, newRow]);
  };

  const handleRemoveBatchRecordRow = (idx: number) => {
    setBatchRecords(batchRecords.filter((_, i) => i !== idx));
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
      const base64 = await compressImage(file);
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

  const [syncingGit, setSyncingGit] = useState(false);

  const handleSyncToGit = async () => {
    setSyncingGit(true);
    try {
      const result = await syncToGitFilesFn();
      if (result.success) {
        showNotification("success", "Successfully synchronized all database changes to local static source files (students.ts and settings.json)!");
      } else {
        showNotification("error", "Failed to sync to static source files.");
      }
    } catch (err: any) {
      console.error(err);
      showNotification("error", err.message || "Failed to sync to static files. (Note: Only works in local development environment)");
    } finally {
      setSyncingGit(false);
    }
  };

  const handleClearLocalCache = () => {
    if (confirm("Are you sure you want to clear your local changes and reset to the database default values?")) {
      localStorage.removeItem("reva_students_overrides");
      localStorage.removeItem("reva_students_deleted");
      localStorage.removeItem("reva_setting_journey_stats");
      localStorage.removeItem("reva_setting_hiring_partners");
      localStorage.removeItem("reva_setting_placement_stats");
      localStorage.removeItem("reva_setting_batch_placement_records");
      localStorage.removeItem("reva_setting_placement_charts");
      localStorage.removeItem("reva_setting_placement_banners");
      
      showNotification("success", "Cleared local cache! Reverting to database defaults...");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  const handleBannerImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingBanner) return;

    if (!file.type.startsWith("image/")) {
      showNotification("error", "Only image files are supported.");
      return;
    }

    const bannerSlug = slugify(editingBanner.title || "temp-banner-" + Date.now());
    setUploadingBannerImage(true);

    try {
      // Compress with 800px max bounds for high quality horizontal banners
      const compressedBase64 = await compressImage(file, 800, 600, 0.7);

      const result = await uploadPlacementBannerFn({
        data: {
          slug: bannerSlug,
          base64: compressedBase64,
          filename: file.name,
        },
      });

      if (result.success && result.filePath) {
        setEditingBanner((prev) => prev ? { ...prev, imageUrl: result.filePath } : null);
        showNotification("success", "Banner image uploaded successfully!");
      } else {
        showNotification("error", "Failed to upload banner image.");
      }
    } catch (err: any) {
      console.error(err);
      showNotification("error", err.message || "Failed to upload banner.");
    } finally {
      setUploadingBannerImage(false);
    }
  };

  const handleOpenBannerCreate = () => {
    setEditingBanner({
      id: "banner-" + Date.now(),
      title: "",
      companyName: "",
      imageUrl: "",
    });
    setBannerIndex(null);
    setIsBannerFormOpen(true);
  };

  const handleEditBannerClick = (banner: PlacementBanner, idx: number) => {
    setEditingBanner({ ...banner });
    setBannerIndex(idx);
    setIsBannerFormOpen(true);
  };

  const handleSaveBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBanner || !editingBanner.title || !editingBanner.companyName) {
      showNotification("error", "Please fill in all required banner fields.");
      return;
    }
    if (!editingBanner.imageUrl) {
      showNotification("error", "Please upload a banner image.");
      return;
    }

    let updatedList = [...placementBanners];
    if (bannerIndex !== null) {
      updatedList[bannerIndex] = editingBanner;
    } else {
      updatedList.push(editingBanner);
    }

    try {
      const result = await savePlacementBannersFn({ data: updatedList });
      if (result.success) {
        showNotification("success", bannerIndex !== null ? "Banner updated successfully." : "New banner added successfully.");
        setIsBannerFormOpen(false);
        setEditingBanner(null);
        setBannerIndex(null);
        fetchBanners();
      } else {
        showNotification("error", "Failed to save banner.");
      }
    } catch (err) {
      console.error(err);
      showNotification("error", "Error occurred while saving banner.");
    }
  };

  const handleDeleteBanner = async (idx: number) => {
    if (!confirm("Are you sure you want to delete this placement banner?")) return;
    const updatedList = placementBanners.filter((_, i) => i !== idx);
    try {
      const result = await savePlacementBannersFn({ data: updatedList });
      if (result.success) {
        showNotification("success", "Banner deleted successfully.");
        fetchBanners();
      } else {
        showNotification("error", "Failed to delete banner.");
      }
    } catch (err) {
      console.error(err);
      showNotification("error", "Error occurred during deletion.");
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

  // Convert and compress Image using canvas
  const compressImage = (
    file: File,
    maxWidth = 300,
    maxHeight = 300,
    quality = 0.7
  ): Promise<string> => {
    return new Promise((resolve) => {
      let objectUrl: string | null = null;
      try {
        objectUrl = URL.createObjectURL(file);
        const img = new Image();
        img.onload = () => {
          try {
            const canvas = document.createElement("canvas");
            let width = img.width;
            let height = img.height;

            if (width > height) {
              if (width > maxWidth) {
                height *= maxWidth / width;
                width = maxWidth;
              }
            } else {
              if (height > maxHeight) {
                width *= maxHeight / height;
                height = maxHeight;
              }
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext("2d");
            ctx?.drawImage(img, 0, 0, width, height);
            const dataUrl = canvas.toDataURL("image/jpeg", quality);
            if (objectUrl) URL.revokeObjectURL(objectUrl);
            resolve(dataUrl);
          } catch (err) {
            console.warn("Canvas compression failed, falling back to FileReader:", err);
            if (objectUrl) URL.revokeObjectURL(objectUrl);
            fallbackFileReader(file, resolve);
          }
        };
        img.onerror = () => {
          if (objectUrl) URL.revokeObjectURL(objectUrl);
          fallbackFileReader(file, resolve);
        };
        img.src = objectUrl;
      } catch (e) {
        console.warn("URL.createObjectURL failed, falling back to FileReader:", e);
        if (objectUrl) {
          try { URL.revokeObjectURL(objectUrl); } catch {}
        }
        fallbackFileReader(file, resolve);
      }
    });
  };

  const fallbackFileReader = (file: File, resolve: (val: string) => void) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      resolve(event.target?.result as string || "");
    };
    reader.onerror = () => resolve("");
    reader.readAsDataURL(file);
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
      const base64 = await compressImage(file);
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
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center space-y-3">
          <Loader2 className="h-8 w-8 animate-spin text-[#1E3E62] mx-auto" />
          <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Verifying Admin Session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-white font-sans text-neutral-800 flex flex-col">
      {/* Header bar */}
      <header className="border-b-[3px] border-[#F9BF29] bg-[#12223A] text-white">
        <div className="mx-auto flex max-w-7xl flex-row items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 rounded border border-white/20 bg-white/5 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-white/10 transition shadow-sm"
            >
              <Home className="h-3.5 w-3.5" />
              View Site
            </Link>
            <span className="hidden sm:inline-block text-xs text-white/50">|</span>
            <span className="hidden sm:inline-block text-xs font-bold text-[#F9BF29] tracking-wider uppercase">
              Placement Dashboard Admin
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-emerald-500 h-2 w-2 animate-pulse" />
              <span className="text-[10px] font-bold text-neutral-300 uppercase tracking-wider">
                Logged in as Admin
              </span>
            </div>
            <button
              onClick={handleSyncToGit}
              disabled={syncingGit}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#F9BF29] text-[#12223A] hover:bg-[#e5ae20] disabled:bg-neutral-600 disabled:text-neutral-400 px-3 py-1.5 text-xs font-extrabold transition cursor-pointer"
              title="Batch-sync your database changes to local code source files (for committing to Git)."
            >
              <Database className="h-3.5 w-3.5" />
              {syncingGit ? "Syncing..." : "Sync to Git Files"}
            </button>
            <button
              onClick={handleClearLocalCache}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-neutral-700 hover:bg-neutral-600 px-3 py-1.5 text-xs font-bold text-white transition cursor-pointer"
              title="Clear temporary changes stored in browser cache and reload."
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset Cache
            </button>
            <button
              onClick={handleLogout}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-rose-700 transition cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="flex-1 mx-auto max-w-7xl w-full px-4 py-8 space-y-6">
        
        {/* Dynamic Alert Banner */}
        {notification && (
          <div
            className={`rounded-xl border p-4 text-xs font-bold shadow-sm flex items-start gap-2.5 animate-scale-up ${
              notification.type === "success"
                ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                : "bg-rose-50 border-rose-200 text-rose-800"
            }`}
          >
            <span className={`shrink-0 h-2 w-2 rounded-full mt-1.5 ${notification.type === "success" ? "bg-emerald-600" : "bg-rose-600"}`} />
            <span className="flex-1 leading-relaxed">{notification.text}</span>
            <button onClick={() => setNotification(null)} className="opacity-60 hover:opacity-100 transition">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {/* Tab Selection Navigation */}
        <div className="flex border-b border-black/10 gap-2 overflow-x-auto pb-0.5 select-none scrollbar-none shrink-0">
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
          <TabButton
            active={currentSection === "placement-charts"}
            onClick={() => setCurrentSection("placement-charts")}
            label="Placement Trends Charts"
            icon={<BarChart className="h-3.5 w-3.5" />}
          />
          <TabButton
            active={currentSection === "placement-banners"}
            onClick={() => setCurrentSection("placement-banners")}
            label="Placement Banners"
            icon={<Database className="h-3.5 w-3.5" />}
          />
        </div>

        {/* Section: Overview Dashboard */}
        {currentSection === "dashboard" && (
          <div className="space-y-6 animate-fade-in">
            {/* Dashboard Welcome Header */}
            <section className="bg-white border border-black/5 rounded-2xl p-6 shadow-sm relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_top_right,rgba(255,89,0,0.15),transparent_50%)]" />
              <div className="space-y-1 relative z-10">
                <h1 className="text-2xl font-black text-[#1E3E62] uppercase tracking-wide">RACE Placement Analytics Overview</h1>
                <p className="text-xs text-neutral-500 font-semibold">Real-time statistics of candidate tracks, career outcomes, and database integrations</p>
              </div>
              <div className="flex gap-2.5 relative z-10 shrink-0">
                <button
                  onClick={() => setCurrentSection("candidates")}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-black/10 bg-white px-4 py-2.5 text-xs font-bold text-neutral-700 shadow-sm hover:bg-neutral-50 hover:border-black/20 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer animate-scale-up"
                >
                  <User className="h-3.5 w-3.5 text-[#1E3E62]" />
                  Candidate Directory
                </button>
                <button
                  onClick={handleOpenCreate}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#1E3E62] px-4 py-2.5 text-xs font-black tracking-wider text-white shadow-md hover:bg-[#12223A] hover:-translate-y-0.5 transition-all duration-200 uppercase cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5 stroke-[3]" /> Add Candidate
                </button>
              </div>
            </section>

            {/* Quick Summary Cards (StatCards) */}
            <section className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <StatCard label="Total Candidates" val={totalCandidates} icon={<User className="text-[#1E3E62]" />} />
              <StatCard label="Students Placed" val={totalPlaced} icon={<CheckCircle className="text-emerald-500" />} />
              <StatCard label="Placement Rate" val={`${placementRate}%`} icon={<TrendingUp className="text-[#F9BF29]" />} />
              <StatCard label="AI Track" val={aiCount} subtitle="M.Tech / M.Sc" />
              <StatCard label="Cybersecurity Track" val={cyberCount} subtitle="M.Tech / M.Sc" />
            </section>

            {/* Visual Analytics Rows */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Card 1: Cohort Placement KPIs */}
              <div className="bg-white border border-black/5 rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-6">
                <div>
                  <h3 className="text-xs font-black uppercase text-neutral-400 tracking-wider mb-4">Cohort Placement KPIs</h3>
                  <div className="space-y-4">
                    {/* Placement rate progress */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-bold text-neutral-800">
                        <span>Placement Success Rate</span>
                        <span>{totalPlaced} / {totalCandidates} Placed ({placementRate}%)</span>
                      </div>
                      <div className="h-2.5 w-full bg-neutral-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${placementRate}%` }} />
                      </div>
                    </div>

                    {/* Employer Pool Depth */}
                    {(() => {
                      const poolDepth = totalCandidates > 0 ? Math.round((partners.length / totalCandidates) * 100) : 0;
                      const cappedBar = Math.min(poolDepth, 100);
                      return (
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-xs font-bold text-neutral-800">
                            <span>Employer Pool Depth</span>
                            <span>{partners.length} Partners for {totalCandidates} Students ({poolDepth}%)</span>
                          </div>
                          <div className="h-2.5 w-full bg-neutral-100 rounded-full overflow-hidden">
                            <div className="h-full bg-amber-500 rounded-full" style={{ width: `${cappedBar}%` }} />
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
                          <div className="flex justify-between text-xs font-bold text-neutral-800">
                            <span>Recruiter Industry Coverage</span>
                            <span>{uniqueSectors.size} of 6 Sectors Active ({sectorRate}%)</span>
                          </div>
                          <div className="h-2.5 w-full bg-neutral-100 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-600 rounded-full" style={{ width: `${sectorRate}%` }} />
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
                <div className="pt-4 border-t border-black/5 flex items-center justify-between text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
                  <span>Last synced on load</span>
                  <button onClick={fetchStudents} className="text-[#1E3E62] hover:underline normal-case">Refresh Profiles</button>
                </div>
              </div>

              {/* Card 2: Top Placement Records (CTC & Stipends) */}
              <div className="bg-white border border-black/5 rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-6">
                <div>
                  <h3 className="text-xs font-black uppercase text-neutral-400 tracking-wider mb-4">Compensation Records</h3>
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
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-neutral-50 border border-black/5 p-3 rounded-xl">
                          <span className="text-[9px] font-black uppercase text-neutral-400 tracking-wider block">Highest CTC</span>
                          <span className="text-base font-extrabold text-neutral-900 block mt-1">{overall.highestCtc}</span>
                        </div>
                        <div className="bg-neutral-50 border border-black/5 p-3 rounded-xl">
                          <span className="text-[9px] font-black uppercase text-neutral-400 tracking-wider block">Highest Stipend</span>
                          <span className="text-base font-extrabold text-[#FF5900] block mt-1">{overall.highestStipend}</span>
                        </div>
                        <div className="bg-neutral-50 border border-black/5 p-3 rounded-xl col-span-2 flex justify-between items-center px-4 py-2.5">
                          <div>
                            <span className="text-[9px] font-black uppercase text-neutral-400 tracking-wider">Avg CTC package</span>
                            <span className="text-sm font-extrabold text-neutral-800 block">{overall.avgCtc}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-[9px] font-black uppercase text-neutral-400 tracking-wider">Avg Stipend</span>
                            <span className="text-sm font-extrabold text-[#FF5900] block">{overall.avgStipend}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
                <div className="pt-4 border-t border-black/5 flex items-center justify-between text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
                  <span>{placementStats.length > 0 ? placementStats.length - 1 : 0} batches tracked</span>
                  <button onClick={() => setCurrentSection("placement-stats")} className="text-[#1E3E62] hover:underline normal-case">Edit Highlights</button>
                </div>
              </div>

              {/* Card 3: Integrations & Quick Shortcuts */}
              <div className="bg-white border border-black/5 rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-6">
                <div>
                  <h3 className="text-xs font-black uppercase text-neutral-400 tracking-wider mb-4">Portal Quick Management</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => setCurrentSection("candidates")}
                      className="w-full flex items-center justify-between p-2.5 border border-black/5 hover:border-[#1E3E62]/30 hover:bg-[#1E3E62]/5 rounded-xl text-left text-xs font-bold text-neutral-700 transition-all cursor-pointer group"
                    >
                      <span className="flex items-center gap-2">
                        <User className="h-4 w-4 text-[#1E3E62] shrink-0" />
                        Candidate Profiles CRUD
                      </span>
                      <ChevronRight className="h-4 w-4 text-neutral-400 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                    <button
                      onClick={() => setCurrentSection("placement-stats")}
                      className="w-full flex items-center justify-between p-2.5 border border-black/5 hover:border-[#1E3E62]/30 hover:bg-[#1E3E62]/5 rounded-xl text-left text-xs font-bold text-neutral-700 transition-all cursor-pointer group"
                    >
                      <span className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-emerald-600 shrink-0" />
                        Stipend & CTC Highlights
                      </span>
                      <ChevronRight className="h-4 w-4 text-neutral-400 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                    <button
                      onClick={() => setCurrentSection("partners")}
                      className="w-full flex items-center justify-between p-2.5 border border-black/5 hover:border-[#1E3E62]/30 hover:bg-[#1E3E62]/5 rounded-xl text-left text-xs font-bold text-neutral-700 transition-all cursor-pointer group"
                    >
                      <span className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-amber-500 shrink-0" />
                        Hiring Partners List
                      </span>
                      <ChevronRight className="h-4 w-4 text-neutral-400 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                    <button
                      onClick={() => setCurrentSection("journey-stats")}
                      className="w-full flex items-center justify-between p-2.5 border border-black/5 hover:border-[#1E3E62]/30 hover:bg-[#1E3E62]/5 rounded-xl text-left text-xs font-bold text-neutral-700 transition-all cursor-pointer group"
                    >
                      <span className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-indigo-500 shrink-0" />
                        Journey Milestone Stats
                      </span>
                      <ChevronRight className="h-4 w-4 text-neutral-400 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
                <div className="pt-4 border-t border-black/5 flex items-center justify-between text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
                  <span>System Active</span>
                  <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>
              </div>
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
                  <h1 className="text-2xl font-black text-[#1E3E62] uppercase tracking-wide">Candidate Directory Management</h1>
                  <p className="text-xs text-neutral-500 font-semibold mt-0.5">Create, update, and manage candidate directory profiles and credentials</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={handleOpenCreate}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1E3E62] px-5 py-3 text-xs font-black tracking-wider text-white shadow-md hover:bg-[#12223A] transition duration-200 uppercase cursor-pointer"
                  >
                    <Plus className="h-4 w-4 stroke-[3]" /> Add New Candidate
                  </button>
                </div>
              </div>
            </section>

            {/* Student Directory Table with Filters */}
            <section className="bg-white border border-black/5 rounded-2xl shadow-sm overflow-hidden flex flex-col animate-fade-in">
              
              {/* Table Toolbar */}
              <div className="p-5 border-b border-black/5 bg-[#fafafa]/50 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="relative max-w-sm flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search candidates by name or email..."
                    className="w-full rounded-xl border border-black/10 bg-white py-2 pl-10 pr-3 text-xs outline-none focus:border-[#1E3E62] focus:ring-1 focus:ring-[#1E3E62]"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="text-neutral-500 font-bold">Specialization:</span>
                    <select
                      value={specFilter}
                      onChange={(e) => setSpecFilter(e.target.value as any)}
                      className="rounded border border-black/10 bg-white px-2.5 py-1.5 outline-none font-bold text-neutral-800 cursor-pointer"
                    >
                      <option value="All">All Tracks</option>
                      <option value="Artificial Intelligence">Artificial Intelligence</option>
                      <option value="Cybersecurity">Cybersecurity</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-neutral-500 font-bold">Status:</span>
                    <select
                      value={placedFilter}
                      onChange={(e) => setPlacedFilter(e.target.value as any)}
                      className="rounded border border-black/10 bg-white px-2.5 py-1.5 outline-none font-bold text-neutral-800 cursor-pointer"
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
                    <Loader2 className="h-7 w-7 animate-spin text-[#1E3E62] mx-auto" />
                    <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Syncing Database Directory...</p>
                  </div>
                ) : filteredStudents.length === 0 ? (
                  <div className="py-20 text-center text-xs text-neutral-400 font-bold uppercase tracking-wider">
                    No candidates match your active filters.
                  </div>
                ) : (
                  <table className="w-full border-collapse text-left text-xs text-neutral-700 bg-white">
                    <thead>
                      <tr className="bg-neutral-50/50 text-neutral-500 border-b border-black/5 font-black uppercase tracking-wider">
                        <th className="p-4 w-[80px]">Photo</th>
                        <th className="p-4 w-[22%]">Name / Slug</th>
                        <th className="p-4 w-[18%]">Specialization</th>
                        <th className="p-4 w-[25%]">Contact Info</th>
                        <th className="p-4 w-[20%]">Placement status</th>
                        <th className="p-4 w-[15%] text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/5">
                      {filteredStudents.map((s) => (
                        <tr key={s.slug} className="hover:bg-neutral-50/30 transition-colors">
                          <td className="p-4">
                            {s.photo ? (
                              <img src={s.photo} alt={s.name} className="h-10 w-10 rounded-lg object-cover border border-black/10" />
                            ) : (
                              <div className="h-10 w-10 rounded-lg bg-[#1E3E62]/10 text-xs font-black text-[#1E3E62] flex items-center justify-center border border-black/5">
                                {s.name.split(" ").map(p => p[0]).slice(0, 2).join("")}
                              </div>
                            )}
                          </td>
                          <td className="p-4">
                            <p className="font-extrabold text-neutral-900 leading-tight">{s.name}</p>
                            <p className="text-[10px] text-neutral-400 font-bold mt-0.5">{s.slug}</p>
                          </td>
                          <td className="p-4">
                            <span className={`inline-block rounded-lg px-2.5 py-1 text-[10px] font-black uppercase tracking-wider border ${
                              s.specialization === "Cybersecurity"
                                ? "bg-[#1E3E62]/10 text-[#1E3E62] border-[#1E3E62]/10"
                                : "bg-[#F9BF29]/15 text-[#8A6700] border-[#F9BF29]/10"
                            }`}>
                              {s.specialization}
                            </span>
                          </td>
                          <td className="p-4 space-y-1">
                            {s.email && (
                              <div className="flex items-center gap-1.5 text-neutral-600 font-medium">
                                <Mail className="h-3 w-3 shrink-0 text-neutral-400" />
                                <span className="truncate max-w-[180px]">{s.email}</span>
                              </div>
                            )}
                            {s.phone && (
                              <div className="flex items-center gap-1.5 text-neutral-600 font-medium">
                                <Phone className="h-3 w-3 shrink-0 text-neutral-400" />
                                <span>{s.phone}</span>
                              </div>
                            )}
                          </td>
                          <td className="p-4">
                            <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider rounded-lg px-2.5 py-1 ${
                              s.placement
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                                : "bg-amber-50 text-amber-800 border border-amber-100"
                            }`}>
                              {s.placement ? (
                                <>
                                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                  Placed
                                </>
                              ) : (
                                <>
                                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
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
                                className="p-2 rounded-lg bg-neutral-100 hover:bg-[#1E3E62]/10 text-neutral-600 hover:text-[#1E3E62] transition cursor-pointer"
                                title="View Profile Page"
                              >
                                <Eye className="h-3.5 w-3.5" />
                              </Link>
                              <button
                                onClick={() => handleOpenEdit(s)}
                                className="p-2 rounded-lg bg-neutral-100 hover:bg-[#1E3E62]/10 text-neutral-600 hover:text-[#1E3E62] transition cursor-pointer"
                                title="Edit Candidate"
                              >
                                <Edit2 className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteClick(s.slug)}
                                className="p-2 rounded-lg bg-rose-50 border border-rose-100 text-rose-600 hover:bg-rose-600 hover:text-white transition cursor-pointer"
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
          <div className="bg-white border border-black/5 rounded-2xl shadow-sm overflow-hidden flex flex-col animate-fade-in">
            <div className="bg-[#12223A] text-white px-6 py-4 flex items-center justify-between border-b border-[#F9BF29]">
              <div>
                <h3 className="text-base font-black uppercase tracking-wider">Edit Placement Statistics</h3>
                <p className="text-[10px] text-[#F9BF29] font-bold mt-0.5">Update the stipend and CTC performance records shown on the home page</p>
              </div>
            </div>

            <form onSubmit={handleSavePlacementStats} className="p-6 space-y-4">
              <div className="flex justify-between items-center mb-1 shrink-0">
                <span className="text-xs font-black uppercase tracking-wider text-neutral-500">Academic Batches</span>
                <button
                  type="button"
                  onClick={handleAddPlacementRow}
                  className="inline-flex items-center gap-1 bg-[#1E3E62] hover:bg-[#12223A] text-white font-extrabold text-[10px] px-3.5 py-2 rounded-xl transition shadow-sm uppercase tracking-wider cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5 stroke-[3]" /> Add New Batch Row
                </button>
              </div>

              {loadingPlacementStats ? (
                <div className="py-10 text-center space-y-2">
                  <Loader2 className="h-6 w-6 animate-spin text-[#1E3E62] mx-auto" />
                  <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Loading Stats...</p>
                </div>
              ) : (
                <div className="overflow-x-auto border border-black/5 rounded-xl">
                  <table className="w-full border-collapse text-left text-xs bg-white">
                    <thead>
                      <tr className="bg-neutral-50 text-neutral-500 font-black uppercase tracking-wider text-[10px] border-b border-black/5">
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
                    <tbody className="divide-y divide-black/5">
                      {placementStats.map((row, idx) => {
                        const isOverall = row.academicYear.toLowerCase() === "overall";
                        return (
                          <tr key={idx} className={isOverall ? "bg-emerald-50/20 font-bold" : ""}>
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
                                className="w-full rounded border border-black/10 px-2 py-1 text-xs outline-none focus:border-[#1E3E62]"
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
                                className="w-full rounded border border-black/10 px-2 py-1 text-xs outline-none focus:border-[#1E3E62]"
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
                                className="w-full rounded border border-black/10 px-2 py-1 text-xs outline-none focus:border-[#1E3E62]"
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
                                className="w-full rounded border border-black/10 px-2 py-1 text-xs outline-none focus:border-[#1E3E62]"
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
                                className="w-full rounded border border-black/10 px-2 py-1 text-xs outline-none focus:border-[#1E3E62] text-[#FF5900] font-bold"
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
                                className="w-full rounded border border-black/10 px-2 py-1 text-xs outline-none focus:border-[#1E3E62]"
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
                                className="w-full rounded border border-black/10 px-2 py-1 text-xs outline-none focus:border-[#1E3E62]"
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
                                className="w-full rounded border border-black/10 px-2 py-1 text-xs outline-none focus:border-[#1E3E62] text-[#1E3E62] font-bold"
                                placeholder="₹ 10.00 LPA"
                              />
                            </td>
                            <td className="p-2 text-center">
                              {!isOverall && (
                                <button
                                  type="button"
                                  onClick={() => handleRemovePlacementRow(idx)}
                                  className="p-1.5 rounded text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition cursor-pointer"
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

              <div className="pt-4 border-t border-black/5 flex items-center justify-end gap-3 font-sans">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1E3E62] px-5 py-2.5 text-xs font-black tracking-wider text-white shadow-md hover:bg-[#12223A] transition cursor-pointer"
                >
                  Save Placement Stats
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Section: Batch Intake & Outcomes */}
        {currentSection === "placement-stats" && (
          <div className="bg-white border border-black/5 rounded-2xl shadow-sm overflow-hidden flex flex-col mt-8 animate-fade-in">
            <div className="bg-[#12223A] text-white px-6 py-4 flex items-center justify-between border-b border-[#F9BF29]">
              <div>
                <h3 className="text-base font-black uppercase tracking-wider">Edit Batch Intake & Outcomes</h3>
                <p className="text-[10px] text-[#F9BF29] font-bold mt-0.5">Update the cohort batch sizes, admission intakes, and placements count shown on the home page</p>
              </div>
            </div>

            <form onSubmit={handleSaveBatchRecords} className="p-6 space-y-4">
              <div className="flex justify-between items-center mb-1 shrink-0">
                <span className="text-xs font-black uppercase tracking-wider text-neutral-500">Batch Records</span>
                <button
                  type="button"
                  onClick={handleAddBatchRecordRow}
                  className="inline-flex items-center gap-1 bg-[#1E3E62] hover:bg-[#12223A] text-white font-extrabold text-[10px] px-3.5 py-2 rounded-xl transition shadow-sm uppercase tracking-wider cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5 stroke-[3]" /> Add New Batch Row
                </button>
              </div>

              {loadingBatchRecords ? (
                <div className="py-10 text-center space-y-2">
                  <Loader2 className="h-6 w-6 animate-spin text-[#1E3E62] mx-auto" />
                  <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Loading Batches...</p>
                </div>
              ) : (
                <div className="overflow-x-auto border border-black/5 rounded-xl">
                  <table className="w-full border-collapse text-left text-xs bg-white">
                    <thead>
                      <tr className="bg-neutral-50 text-neutral-500 font-black uppercase tracking-wider text-[10px] border-b border-black/5">
                        <th className="p-3 w-[25%]">Academic Year</th>
                        <th className="p-3 w-[15%] text-center">PGCET Intake</th>
                        <th className="p-3 w-[15%] text-center">UQ/MQ Intake</th>
                        <th className="p-3 w-[15%] text-center">Total Intake</th>
                        <th className="p-3 w-[15%] text-center">Internships Placed</th>
                        <th className="p-3 w-[15%] text-center">Full-Time Placements</th>
                        <th className="p-3 w-[5%] text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/5">
                      {batchRecords.map((row, idx) => {
                        const calculatedTotal = (row.pgcet || 0) + (row.uqmq || 0);
                        return (
                          <tr key={idx} className="hover:bg-neutral-50/20 transition-colors">
                            <td className="p-2">
                              <input
                                type="text"
                                required
                                value={row.academicYear}
                                onChange={(e) => {
                                  const updated = [...batchRecords];
                                  updated[idx] = { ...row, academicYear: e.target.value };
                                  setBatchRecords(updated);
                                }}
                                className="w-full rounded border border-black/10 px-2 py-1 text-xs outline-none focus:border-[#1E3E62]"
                                placeholder="AY22–24 (FT Batch 1)"
                              />
                            </td>
                            <td className="p-2">
                              <input
                                type="number"
                                min={0}
                                required
                                value={row.pgcet}
                                onChange={(e) => {
                                  const val = parseInt(e.target.value) || 0;
                                  const updated = [...batchRecords];
                                  updated[idx] = { ...row, pgcet: val, total: val + row.uqmq };
                                  setBatchRecords(updated);
                                }}
                                className="w-full rounded border border-black/10 px-2 py-1 text-xs text-center outline-none focus:border-[#1E3E62]"
                              />
                            </td>
                            <td className="p-2">
                              <input
                                type="number"
                                min={0}
                                required
                                value={row.uqmq}
                                onChange={(e) => {
                                  const val = parseInt(e.target.value) || 0;
                                  const updated = [...batchRecords];
                                  updated[idx] = { ...row, uqmq: val, total: row.pgcet + val };
                                  setBatchRecords(updated);
                                }}
                                className="w-full rounded border border-black/10 px-2 py-1 text-xs text-center outline-none focus:border-[#1E3E62]"
                              />
                            </td>
                            <td className="p-2 text-center font-bold text-neutral-800 bg-neutral-50/50">
                              {calculatedTotal}
                            </td>
                            <td className="p-2">
                              <input
                                type="number"
                                min={0}
                                required
                                value={row.internship}
                                onChange={(e) => {
                                  const val = parseInt(e.target.value) || 0;
                                  const updated = [...batchRecords];
                                  updated[idx] = { ...row, internship: val };
                                  setBatchRecords(updated);
                                }}
                                className="w-full rounded border border-black/10 px-2 py-1 text-xs text-center outline-none focus:border-[#1E3E62] text-amber-600 font-bold"
                              />
                            </td>
                            <td className="p-2">
                              <input
                                type="number"
                                min={0}
                                required
                                value={row.ftPlacement}
                                onChange={(e) => {
                                  const val = parseInt(e.target.value) || 0;
                                  const updated = [...batchRecords];
                                  updated[idx] = { ...row, ftPlacement: val };
                                  setBatchRecords(updated);
                                }}
                                className="w-full rounded border border-black/10 px-2 py-1 text-xs text-center outline-none focus:border-[#1E3E62] text-emerald-600 font-bold"
                              />
                            </td>
                            <td className="p-2 text-center">
                              <button
                                type="button"
                                onClick={() => handleRemoveBatchRecordRow(idx)}
                                className="p-1.5 rounded text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition cursor-pointer"
                                title="Remove Row"
                              >
                                <Trash2 className="h-4.5 w-4.5" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="pt-4 border-t border-black/5 flex items-center justify-end gap-3 font-sans">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1E3E62] px-5 py-2.5 text-xs font-black tracking-wider text-white shadow-md hover:bg-[#12223A] transition cursor-pointer"
                >
                  Save Batch Intake & Outcomes
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Section: Hiring Partners */}
        {currentSection === "partners" && (
          <div className="bg-white border border-black/5 rounded-2xl shadow-sm overflow-hidden flex flex-col animate-fade-in">
            <div className="bg-[#12223A] text-white px-6 py-4 flex items-center justify-between border-b border-[#F9BF29]">
              <div>
                <h3 className="text-base font-black uppercase tracking-wider">Manage Hiring Partners</h3>
                <p className="text-[10px] text-[#F9BF29] font-bold mt-0.5">Add, edit, or delete companies displaying in the Hiring Partners network</p>
              </div>
            </div>

            <div className="p-6 flex flex-col lg:flex-row gap-6 min-h-[500px]">
              {/* Left Column: Partners List */}
              <div className="w-full lg:w-1/3 flex flex-col gap-4 border-b lg:border-b-0 lg:border-r border-black/5 pb-6 lg:pb-0 lg:pr-6">
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
                    <input
                      type="text"
                      value={partnerSearchQuery}
                      onChange={(e) => setPartnerSearchQuery(e.target.value)}
                      placeholder="Search partners by name..."
                      className="w-full rounded-xl border border-black/10 bg-white py-2 pl-9 pr-3 text-xs outline-none focus:border-[#1E3E62]"
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
                        placementCount: 0,
                      });
                      setPartnerIndex(null);
                      setIsPartnerFormOpen(true);
                    }}
                    className="inline-flex items-center gap-1 bg-[#1E3E62] hover:bg-[#12223A] text-white font-extrabold text-[10px] px-3 py-2.5 rounded-xl transition shadow-sm uppercase tracking-wider cursor-pointer whitespace-nowrap"
                  >
                    <Plus className="h-3.5 w-3.5 stroke-[3]" /> Add Partner
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto max-h-[55vh] space-y-2 pr-1">
                  {loadingPartners ? (
                    <div className="py-10 text-center space-y-2">
                      <Loader2 className="h-5 w-5 animate-spin text-[#1E3E62] mx-auto" />
                      <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Loading Partners...</p>
                    </div>
                  ) : partners.length === 0 ? (
                    <p className="text-xs text-neutral-400 text-center py-6">No partners in database.</p>
                  ) : (
                    partners
                      .filter((p) => p.name.toLowerCase().includes(partnerSearchQuery.toLowerCase()))
                      .map((partner, idx) => {
                        const originalIndex = partners.findIndex((item) => item.name === partner.name);
                        return (
                          <div
                            key={idx}
                            className="bg-white border border-black/5 p-3.5 rounded-xl shadow-sm flex items-center justify-between gap-4 hover:border-neutral-300 transition-colors"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className={`h-9 w-9 rounded-lg ${partner.logoUrl ? 'bg-white p-1 flex items-center justify-center border border-neutral-100' : `bg-gradient-to-br ${partner.themeColor} text-white font-black text-sm flex items-center justify-center`} shrink-0`}>
                                {partner.logoUrl ? (
                                  <img src={partner.logoUrl} alt={partner.name} className="h-full w-full object-contain" />
                                ) : (
                                  partner.logoLetter || partner.name.charAt(0)
                                )}
                              </div>
                              <div className="min-w-0">
                                <h4 className="text-xs font-black text-neutral-800 truncate">{partner.name}</h4>
                                <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider block mt-0.5">{partner.category}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                onClick={() => {
                                  setEditingPartner({ ...partner });
                                  setPartnerIndex(originalIndex);
                                  setIsPartnerFormOpen(true);
                                }}
                                className="p-1.5 rounded bg-neutral-100 hover:bg-[#1E3E62]/10 text-[#1E3E62] transition cursor-pointer"
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
                                className="p-1.5 rounded bg-neutral-100 hover:bg-rose-50 text-rose-600 transition cursor-pointer"
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
                      <h4 className="text-xs font-black text-neutral-800 uppercase tracking-wider pb-2 border-b border-black/5">
                        {partnerIndex !== null ? `Edit Partner: ${editingPartner.name}` : "Add New Hiring Partner"}
                      </h4>

                      {/* Company Name */}
                      <div>
                        <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1">Company Name</label>
                        <input
                          type="text"
                          required
                          value={editingPartner.name}
                          onChange={(e) => setEditingPartner({ ...editingPartner, name: e.target.value })}
                          className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-xs outline-none focus:border-[#1E3E62]"
                          placeholder="e.g. Google Cloud Partner"
                        />
                      </div>

                      {/* Category Selection */}
                      <div>
                        <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1">Category Sector</label>
                        <select
                          value={editingPartner.category}
                          onChange={(e) => setEditingPartner({ ...editingPartner, category: e.target.value as any })}
                          className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-xs outline-none focus:border-[#1E3E62] cursor-pointer"
                        >
                          <option value="Technology & Software">Technology & Software</option>
                          <option value="Research & Academics">Research & Academics</option>
                          <option value="Consulting & Finance">Consulting & Finance</option>
                          <option value="Cybersecurity & Ops">Cybersecurity & Ops</option>
                          <option value="Healthcare & Biotech">Healthcare & Biotech</option>
                          <option value="Engineering & Logistics">Engineering & Logistics</option>
                        </select>
                      </div>

                      {/* Placement Count */}
                      <div>
                        <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1">Placement Offer Count</label>
                        <input
                          type="number"
                          min={0}
                          required
                          value={editingPartner.placementCount ?? 0}
                          onChange={(e) => setEditingPartner({ ...editingPartner, placementCount: parseInt(e.target.value) || 0 })}
                          className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-xs outline-none focus:border-[#1E3E62]"
                          placeholder="e.g. 5"
                        />
                      </div>

                      {/* Logo Letter & Theme Color */}
                      <div className="grid grid-cols-3 gap-3">
                        <div className="col-span-1">
                          <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1">Logo Letter</label>
                          <input
                            type="text"
                            maxLength={1}
                            required
                            value={editingPartner.logoLetter}
                            onChange={(e) => setEditingPartner({ ...editingPartner, logoLetter: e.target.value.toUpperCase() })}
                            className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-xs outline-none text-center font-black"
                            placeholder="e.g. G"
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1">Color Theme Preset</label>
                          <select
                            value={editingPartner.themeColor}
                            onChange={(e) => setEditingPartner({ ...editingPartner, themeColor: e.target.value })}
                            className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-xs outline-none focus:border-[#1E3E62] cursor-pointer"
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
                        <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1">
                          Company Logo (Optional)
                        </label>
                        <div className="mt-1 flex items-center gap-4">
                          {editingPartner.logoUrl ? (
                            <div className="relative h-16 w-24 border border-black/10 rounded-xl bg-neutral-50 p-2 flex items-center justify-center group/logo select-none shrink-0 animate-fade-in">
                              <img
                                src={editingPartner.logoUrl}
                                alt="Company Logo"
                                className="h-full w-auto object-contain"
                              />
                              <button
                                type="button"
                                onClick={() => setEditingPartner({ ...editingPartner, logoUrl: undefined })}
                                className="absolute -top-1.5 -right-1.5 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition shadow-md cursor-pointer"
                                title="Remove Logo"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ) : (
                            <div className="h-16 w-24 border-2 border-dashed border-black/10 rounded-xl bg-neutral-50/50 flex flex-col items-center justify-center shrink-0 text-neutral-400 select-none text-[9px] font-bold uppercase tracking-wider">
                              No Logo
                            </div>
                          )}

                          <div className="flex-1">
                            <label className="relative flex items-center justify-center gap-2 border border-[#1E3E62]/20 hover:border-[#1E3E62]/40 rounded-xl px-4 py-2.5 bg-[#1E3E62]/5 hover:bg-[#1E3E62]/10 text-[#1E3E62] font-black text-xs transition cursor-pointer select-none">
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
                            <p className="text-[9px] text-neutral-400 font-bold uppercase tracking-wider mt-1.5">
                              Recommended: PNG with transparent background.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <div>
                        <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1">Company Description</label>
                        <textarea
                          rows={4}
                          required
                          value={editingPartner.description}
                          onChange={(e) => setEditingPartner({ ...editingPartner, description: e.target.value })}
                          className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-xs outline-none focus:border-[#1E3E62] resize-none leading-relaxed"
                          placeholder="Provide a description of what the company does and how it partners with RACE..."
                        />
                      </div>
                    </div>

                    <div className="pt-4 border-t border-black/5 flex items-center justify-end gap-2.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          setIsPartnerFormOpen(false);
                          setEditingPartner(null);
                          setPartnerIndex(null);
                        }}
                        className="text-[10px] font-bold text-neutral-500 hover:text-neutral-700 px-3.5 py-2 bg-neutral-100 rounded-xl transition"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="text-[10px] font-black bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl shadow-sm transition uppercase tracking-wider"
                      >
                        {partnerIndex !== null ? "Save Partner" : "Add Partner"}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-neutral-400 select-none">
                    <Building className="h-10 w-10 text-neutral-300 mb-2.5" />
                    <p className="text-xs font-bold uppercase tracking-wider">No Partner Selected</p>
                    <p className="text-[10px] text-[#1E3E62] mt-1">Select a partner from the list to edit their details, or click "Add Partner" to create a new one.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Section: Journey Stats */}
        {currentSection === "journey-stats" && (
          <div className="bg-white border border-black/5 rounded-2xl shadow-sm overflow-hidden flex flex-col animate-fade-in">
            <div className="bg-[#12223A] text-white px-6 py-4 flex items-center justify-between border-b border-[#F9BF29]">
              <div>
                <h3 className="text-base font-black uppercase tracking-wider">Edit Journey Stats</h3>
                <p className="text-[10px] text-[#F9BF29] font-bold mt-0.5">Update statistics shown in the "Our Journey So Far" section on home page</p>
              </div>
            </div>

            <form onSubmit={handleSaveStats} className="p-6 space-y-4">
              <div className="space-y-4">
                {loadingStats ? (
                  <div className="py-10 text-center space-y-2">
                    <Loader2 className="h-6 w-6 animate-spin text-[#1E3E62] mx-auto" />
                    <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Loading Stats...</p>
                  </div>
                ) : stats.length === 0 ? (
                  <p className="text-xs text-neutral-400">No stats available.</p>
                ) : (
                  stats.map((stat, idx) => (
                    <div key={idx} className="p-4 bg-neutral-50 rounded-xl border border-black/5 flex flex-col sm:flex-row gap-4 items-center justify-between">
                      <div className="flex items-center gap-3 shrink-0">
                        <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[#FFFBDC] text-[#FF5900] border border-[#FFAA6E]/10 shrink-0">
                          {stat.iconName === "GraduationCap" && <GraduationCap className="h-5 w-5" />}
                          {stat.iconName === "Users" && <Users className="h-5 w-5" />}
                          {stat.iconName === "Award" && <Award className="h-5 w-5" />}
                          {stat.iconName === "Building" && <Building className="h-5 w-5" />}
                          {stat.iconName === "Briefcase" && <Briefcase className="h-5 w-5" />}
                        </div>

                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-neutral-800">Stat #{idx + 1}</span>
                          <select
                            value={stat.iconName}
                            onChange={(e) => {
                              const newStats = [...stats];
                              newStats[idx] = { ...newStats[idx], iconName: e.target.value };
                              setStats(newStats);
                            }}
                            className="text-[10px] font-bold text-[#FF5900] bg-transparent outline-none cursor-pointer hover:underline"
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
                          <label className="block text-[10px] font-black text-neutral-400 uppercase tracking-wider mb-1">Value</label>
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
                            className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-xs outline-none focus:border-[#1E3E62]"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-black text-neutral-400 uppercase tracking-wider mb-1">Label</label>
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
                            className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-xs outline-none focus:border-[#1E3E62]"
                          />
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="pt-4 border-t border-black/5 flex items-center justify-end gap-3 font-sans">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1E3E62] px-5 py-2.5 text-xs font-black tracking-wider text-white shadow-md hover:bg-[#12223A] transition cursor-pointer"
                >
                  Save Journey Stats
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Section: Placement Analytics Charts */}
        {currentSection === "placement-charts" && (
          <div className="bg-white border border-black/5 rounded-2xl shadow-sm overflow-hidden flex flex-col animate-fade-in">
            <div className="bg-[#12223A] text-white px-6 py-4 flex items-center justify-between border-b border-[#F9BF29]">
              <div>
                <h3 className="text-base font-black uppercase tracking-wider">Edit Placement Analytics Charts</h3>
                <p className="text-[10px] text-[#F9BF29] font-bold mt-0.5">Customize Titles, Footnotes, Colors, and Year-by-Year data for the homepage charts</p>
              </div>
            </div>

            <div className="p-6 flex flex-col lg:flex-row gap-6 min-h-[600px]">
              {/* Left Column: Select which chart to edit */}
              <div className="w-full lg:w-1/4 flex flex-col gap-2 border-b lg:border-b-0 lg:border-r border-black/5 pb-6 lg:pb-0 lg:pr-6 shrink-0">
                <span className="text-xs font-black uppercase tracking-wider text-neutral-500 mb-2">Select Chart</span>
                {loadingDashboardCharts ? (
                  <div className="py-10 text-center space-y-2">
                    <Loader2 className="h-5 w-5 animate-spin text-[#1E3E62] mx-auto" />
                    <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Loading Charts...</p>
                  </div>
                ) : (
                  dashboardCharts.map((chart, idx) => (
                    <button
                      key={chart.id}
                      type="button"
                      onClick={() => setSelectedChartIdx(idx)}
                      className={`w-full text-left p-3.5 rounded-xl border transition-all duration-250 cursor-pointer flex items-center justify-between group ${
                        selectedChartIdx === idx
                          ? "bg-[#1E3E62] border-[#1E3E62] text-white shadow-sm"
                          : "bg-white border-black/5 hover:border-neutral-300 text-neutral-800"
                      }`}
                    >
                      <div className="min-w-0">
                        <span className={`text-[10px] font-black uppercase tracking-wider block ${selectedChartIdx === idx ? "text-neutral-300" : "text-neutral-400"}`}>
                          Chart #{idx + 1}
                        </span>
                        <span className="text-xs font-extrabold truncate block mt-0.5">{chart.title}</span>
                      </div>
                      <ChevronRight className={`h-4 w-4 shrink-0 transition-transform ${
                        selectedChartIdx === idx ? "text-white rotate-90 lg:rotate-0" : "text-neutral-400 group-hover:translate-x-0.5"
                      }`} />
                    </button>
                  ))
                )}
              </div>

              {/* Right Column: Chart Editor & Live Preview */}
              <div className="flex-1 flex flex-col lg:flex-row gap-6 min-w-0">
                {loadingDashboardCharts ? (
                  <div className="flex-1 flex items-center justify-center py-20">
                    <Loader2 className="h-7 w-7 animate-spin text-[#1E3E62]" />
                  </div>
                ) : dashboardCharts[selectedChartIdx] ? (
                  (() => {
                    const currentChart = dashboardCharts[selectedChartIdx];

                    // Helper to update a top-level field of the current chart
                    const updateChartField = (field: keyof DashboardChart, value: any) => {
                      const updatedCharts = [...dashboardCharts];
                      updatedCharts[selectedChartIdx] = {
                        ...currentChart,
                        [field]: value,
                      };
                      setDashboardCharts(updatedCharts);
                    };

                    // Helper to update a data point
                    const updateDataPoint = (dataIdx: number, field: keyof ChartDataPoint, value: any) => {
                      const updatedData = [...currentChart.data];
                      updatedData[dataIdx] = {
                        ...updatedData[dataIdx],
                        [field]: value,
                      };
                      updateChartField("data", updatedData);
                    };

                    // Helper to add data point
                    const addDataPoint = () => {
                      // default to next year
                      let nextYearStr = "2027";
                      if (currentChart.data.length > 0) {
                        const lastYear = currentChart.data[currentChart.data.length - 1].year;
                        const match = lastYear.match(/\d+/);
                        if (match) {
                          nextYearStr = String(Number(match[0]) + 1);
                        }
                      }
                      const newDataPoint: ChartDataPoint = {
                        year: nextYearStr,
                        value: 0,
                        hasAsterisk: false,
                      };
                      updateChartField("data", [...currentChart.data, newDataPoint]);
                    };

                    // Helper to remove data point
                    const removeDataPoint = (dataIdx: number) => {
                      const updatedData = currentChart.data.filter((_, i) => i !== dataIdx);
                      updateChartField("data", updatedData);
                    };

                    return (
                      <div className="flex-1 flex flex-col lg:grid lg:grid-cols-2 gap-6">
                        {/* Editor Form fields */}
                        <div className="space-y-5">
                          <h4 className="text-xs font-black text-neutral-800 uppercase tracking-wider pb-2 border-b border-black/5 flex items-center justify-between">
                            <span>Edit Settings</span>
                            <span className="text-[10px] font-bold text-neutral-400 normal-case italic">Changes update Live Preview on right</span>
                          </h4>

                          {/* Chart Title */}
                          <div>
                            <label className="block text-[10px] font-black text-neutral-400 uppercase tracking-wider mb-1">Chart Title</label>
                            <input
                              type="text"
                              required
                              value={currentChart.title}
                              onChange={(e) => updateChartField("title", e.target.value)}
                              className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-xs outline-none focus:border-[#1E3E62]"
                              placeholder="e.g. Companies Visited"
                            />
                          </div>

                          {/* Color and Footnote 1 */}
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[10px] font-black text-neutral-400 uppercase tracking-wider mb-1">Theme Color</label>
                              <select
                                value={currentChart.color || "#3b82f6"}
                                onChange={(e) => updateChartField("color", e.target.value)}
                                className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-xs outline-none focus:border-[#1E3E62] cursor-pointer"
                              >
                                <option value="#3b82f6">Default Blue</option>
                                <option value="#FF5900">REVA Orange</option>
                                <option value="#10b981">Emerald Green</option>
                                <option value="#f59e0b">Amber Yellow</option>
                                <option value="#8b5cf6">Purple</option>
                                <option value="#ec4899">Pink</option>
                                <option value="#64748b">Slate Gray</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-[10px] font-black text-neutral-400 uppercase tracking-wider mb-1">Theme Preview</label>
                              <div className="flex items-center gap-2 border border-black/10 rounded-xl px-3 py-2 bg-neutral-50 h-[34px]">
                                <span className="h-4 w-4 rounded-md border border-neutral-300" style={{ backgroundColor: currentChart.color || "#3b82f6" }} />
                                <span className="text-[10px] font-extrabold text-neutral-600 uppercase tracking-wider">Active Color</span>
                              </div>
                            </div>
                          </div>

                          {/* Footnotes */}
                          <div className="space-y-3">
                            <div>
                              <label className="block text-[10px] font-black text-neutral-400 uppercase tracking-wider mb-1">Footnote 1</label>
                              <input
                                type="text"
                                value={currentChart.footnote1 || ""}
                                onChange={(e) => updateChartField("footnote1", e.target.value)}
                                className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-xs outline-none focus:border-[#1E3E62]"
                                placeholder="e.g. *Ongoing placement season"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-black text-neutral-400 uppercase tracking-wider mb-1">Footnote 2</label>
                              <input
                                type="text"
                                value={currentChart.footnote2 || ""}
                                onChange={(e) => updateChartField("footnote2", e.target.value)}
                                className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-xs outline-none focus:border-[#1E3E62]"
                                placeholder="e.g. Offers till May 2026"
                              />
                            </div>
                          </div>

                          {/* Data points table */}
                          <div className="space-y-2">
                            <div className="flex justify-between items-center pb-1">
                              <span className="text-[10px] font-black uppercase text-neutral-400 tracking-wider">Yearly Data Points</span>
                              <button
                                type="button"
                                onClick={addDataPoint}
                                className="inline-flex items-center gap-1 bg-[#1E3E62]/10 hover:bg-[#1E3E62]/20 text-[#1E3E62] font-black text-[9px] px-2.5 py-1.5 rounded-lg transition uppercase tracking-wider cursor-pointer"
                              >
                                <Plus className="h-3 w-3 stroke-[3]" /> Add Year
                              </button>
                            </div>

                            <div className="border border-black/5 rounded-xl overflow-hidden max-h-[220px] overflow-y-auto pr-1">
                              <table className="w-full border-collapse text-left text-xs bg-white">
                                <thead>
                                  <tr className="bg-neutral-50 text-neutral-500 font-black uppercase tracking-wider text-[9px] border-b border-black/5">
                                    <th className="p-2 w-[30%]">Academic Year</th>
                                    <th className="p-2 w-[35%]">Value</th>
                                    <th className="p-2 w-[20%] text-center">Has *</th>
                                    <th className="p-2 w-[15%] text-center">Delete</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-black/5">
                                  {currentChart.data.map((point, pIdx) => (
                                    <tr key={pIdx}>
                                      <td className="p-1">
                                        <input
                                          type="text"
                                          required
                                          value={point.year}
                                          onChange={(e) => updateDataPoint(pIdx, "year", e.target.value)}
                                          className="w-full rounded border border-black/10 px-2 py-1 text-xs outline-none focus:border-[#1E3E62] font-extrabold text-neutral-700 text-center"
                                          placeholder="2026"
                                        />
                                      </td>
                                      <td className="p-1">
                                        <input
                                          type="number"
                                          required
                                          min={0}
                                          value={point.value}
                                          onChange={(e) => updateDataPoint(pIdx, "value", Number(e.target.value))}
                                          className="w-full rounded border border-black/10 px-2 py-1 text-xs outline-none focus:border-[#1E3E62] font-extrabold text-neutral-800"
                                          placeholder="e.g. 742"
                                        />
                                      </td>
                                      <td className="p-1 text-center">
                                        <input
                                          type="checkbox"
                                          checked={point.hasAsterisk}
                                          onChange={(e) => updateDataPoint(pIdx, "hasAsterisk", e.target.checked)}
                                          className="rounded border border-black/10 outline-none text-[#1E3E62] focus:ring-[#1E3E62] h-3.5 w-3.5 cursor-pointer align-middle"
                                        />
                                      </td>
                                      <td className="p-1 text-center">
                                        <button
                                          type="button"
                                          onClick={() => removeDataPoint(pIdx)}
                                          className="p-1 rounded text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition cursor-pointer"
                                          title="Remove Year"
                                        >
                                          <Trash2 className="h-3.5 w-3.5" />
                                        </button>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>

                          {/* Submit Actions */}
                          <div className="pt-4 border-t border-black/5 flex items-center justify-end gap-3 shrink-0">
                            <button
                              type="button"
                              onClick={(e) => handleSaveDashboardCharts(e)}
                              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-black tracking-wider text-white shadow-md hover:bg-emerald-700 transition cursor-pointer uppercase"
                            >
                              Save All Charts
                            </button>
                          </div>
                        </div>

                        {/* Live Preview column */}
                        <div className="space-y-4 flex flex-col">
                          <h4 className="text-xs font-black text-neutral-800 uppercase tracking-wider pb-2 border-b border-black/5 shrink-0">
                            Live Preview
                          </h4>

                          <div className="bg-neutral-50/50 border border-black/5 rounded-2xl p-6 flex flex-col justify-between flex-1 min-h-[300px]">
                            <div>
                              <div className="flex items-center justify-between mb-4">
                                <h5 className="text-sm font-black text-neutral-900 tracking-tight">
                                  {currentChart.title || "No Title"}
                                </h5>
                                <img src="/image/reva_logi.png" alt="REVA University" className="h-5 w-auto object-contain opacity-60" />
                              </div>

                              <div className="h-[200px] w-full mt-2 font-sans select-none relative">
                                <RechartsResponsiveContainer width="100%" height="100%">
                                  <RechartsBarChart
                                    data={currentChart.data}
                                    margin={{ top: 20, right: 10, left: -20, bottom: 0 }}
                                  >
                                    <RechartsCartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" />
                                    <RechartsXAxis
                                      dataKey="year"
                                      axisLine={false}
                                      tickLine={false}
                                      tick={{ fill: '#737373', fontSize: 10, fontWeight: 'bold' }}
                                    />
                                    <RechartsYAxis
                                      axisLine={false}
                                      tickLine={false}
                                      tick={{ fill: '#737373', fontSize: 10, fontWeight: 'bold' }}
                                    />
                                    <RechartsTooltip
                                      cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                                      contentStyle={{
                                        background: '#ffffff',
                                        border: '1px solid rgba(0,0,0,0.05)',
                                        borderRadius: '10px',
                                        boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
                                        fontSize: '10px',
                                        fontWeight: 'bold',
                                      }}
                                    />
                                    <RechartsBar
                                      dataKey="value"
                                      fill={currentChart.color || "#3b82f6"}
                                      radius={[6, 6, 0, 0]}
                                      maxBarSize={35}
                                    >
                                      <RechartsLabelList
                                        dataKey="value"
                                        content={(props: any) => {
                                          const { x, y, width, value, index } = props;
                                          const point = currentChart.data[index];
                                          const labelText = point?.hasAsterisk ? `${value}*` : `${value}`;
                                          return (
                                            <text
                                              x={x + width / 2}
                                              y={y - 8}
                                              fill="#404040"
                                              textAnchor="middle"
                                              fontSize={9}
                                              fontWeight="extrabold"
                                              className="font-sans"
                                            >
                                              {labelText}
                                            </text>
                                          );
                                        }}
                                      />
                                    </RechartsBar>
                                  </RechartsBarChart>
                                </RechartsResponsiveContainer>
                              </div>
                            </div>

                            <div className="mt-4 pt-3 border-t border-black/5 flex flex-col gap-0.5 text-[9px] text-neutral-400 font-semibold italic text-left">
                              {currentChart.footnote1 && <p>{currentChart.footnote1}</p>}
                              {currentChart.footnote2 && <p>{currentChart.footnote2}</p>}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })()
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-neutral-400 select-none">
                    <BarChart className="h-10 w-10 text-neutral-300 mb-2.5" />
                    <p className="text-xs font-bold uppercase tracking-wider">No Chart Selected</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Section: Placement Banners */}
        {currentSection === "placement-banners" && (
          <div className="bg-white border border-black/5 rounded-2xl shadow-sm overflow-hidden flex flex-col animate-fade-in">
            <div className="bg-[#12223A] text-white px-6 py-4 flex items-center justify-between border-b border-[#F9BF29]">
              <div>
                <h3 className="text-base font-black uppercase tracking-wider">Manage Placement Banners</h3>
                <p className="text-[10px] text-[#F9BF29] font-bold mt-0.5">Manage banners and congratulations posters of placed students displayed on the home page</p>
              </div>
            </div>

            <div className="p-6 flex flex-col lg:flex-row gap-6 min-h-[500px]">
              {/* Left Column: Banners List */}
              <div className="w-full lg:w-1/3 flex flex-col gap-4 border-b lg:border-b-0 lg:border-r border-black/5 pb-6 lg:pb-0 lg:pr-6">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-black uppercase tracking-wider text-neutral-500">Placement Banners</span>
                  <button
                    type="button"
                    onClick={handleOpenBannerCreate}
                    className="inline-flex items-center gap-1 bg-[#1E3E62] hover:bg-[#12223A] text-white font-extrabold text-[10px] px-3 py-2.5 rounded-xl transition shadow-sm uppercase tracking-wider cursor-pointer whitespace-nowrap"
                  >
                    <Plus className="h-3.5 w-3.5 stroke-[3]" /> Add Banner
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto max-h-[55vh] space-y-2 pr-1">
                  {loadingBanners ? (
                    <div className="py-10 text-center space-y-2">
                      <Loader2 className="h-5 w-5 animate-spin text-[#1E3E62] mx-auto" />
                      <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Loading Banners...</p>
                    </div>
                  ) : placementBanners.length === 0 ? (
                    <p className="text-xs text-neutral-400 text-center py-6">No banners in database.</p>
                  ) : (
                    placementBanners.map((banner, idx) => (
                      <div
                        key={banner.id || idx}
                        className={`bg-white border p-3.5 rounded-xl shadow-sm flex items-center justify-between gap-4 transition-colors cursor-pointer ${
                          bannerIndex === idx ? "border-[#1E3E62] ring-1 ring-[#1E3E62]" : "border-black/5 hover:border-neutral-300"
                        }`}
                        onClick={() => handleEditBannerClick(banner, idx)}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="h-12 w-16 bg-neutral-100 rounded-lg overflow-hidden shrink-0 flex items-center justify-center border border-neutral-200">
                            {banner.imageUrl ? (
                              <img src={banner.imageUrl} alt={banner.title} className="h-full w-full object-cover" />
                            ) : (
                              <Image className="h-5 w-5 text-neutral-400" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <span className="text-[10px] font-black uppercase tracking-wider block text-[#FF5900]">
                              {banner.companyName || "No Company"}
                            </span>
                            <span className="text-xs font-extrabold truncate block mt-0.5 text-neutral-800">
                              {banner.title || "Untitled Banner"}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            onClick={() => handleEditBannerClick(banner, idx)}
                            className="p-1 rounded text-[#1E3E62] hover:bg-blue-50 transition cursor-pointer"
                            title="Edit"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteBanner(idx)}
                            className="p-1 rounded text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Right Column: Banner Editor or Placeholder */}
              <div className="flex-1 min-w-0">
                {isBannerFormOpen && editingBanner ? (
                  <form
                    onSubmit={handleSaveBanner}
                    className="flex-1 flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-4">
                      <h4 className="text-xs font-black text-neutral-800 uppercase tracking-wider pb-2 border-b border-black/5">
                        {bannerIndex !== null ? `Edit Banner: ${editingBanner.title}` : "Add New Placement Banner"}
                      </h4>

                      {/* Banner Title */}
                      <div>
                        <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1">Banner Title</label>
                        <input
                          type="text"
                          required
                          value={editingBanner.title}
                          onChange={(e) => setEditingBanner({ ...editingBanner, title: e.target.value })}
                          className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-xs outline-none focus:border-[#1E3E62]"
                          placeholder="e.g. Chalukya Placed at Turmeric (Full Time)"
                        />
                      </div>

                      {/* Company Name */}
                      <div>
                        <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1">Hiring Company</label>
                        <input
                          type="text"
                          required
                          value={editingBanner.companyName}
                          onChange={(e) => setEditingBanner({ ...editingBanner, companyName: e.target.value })}
                          className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-xs outline-none focus:border-[#1E3E62]"
                          placeholder="e.g. Turmeric"
                        />
                      </div>

                      {/* Image Upload */}
                      <div>
                        <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1">
                          Banner / Poster Image
                        </label>
                        <div className="mt-1 flex items-center gap-4">
                          {editingBanner.imageUrl ? (
                            <div className="relative h-24 w-32 border border-black/10 rounded-xl bg-neutral-50 overflow-hidden group/img select-none shrink-0 animate-fade-in flex items-center justify-center">
                              <img
                                src={editingBanner.imageUrl}
                                alt="Banner Preview"
                                className="h-full w-full object-cover"
                              />
                              <button
                                type="button"
                                onClick={() => setEditingBanner({ ...editingBanner, imageUrl: "" })}
                                className="absolute top-1.5 right-1.5 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition shadow-md cursor-pointer"
                                title="Remove Image"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ) : (
                            <div className="h-24 w-32 border-2 border-dashed border-black/10 rounded-xl bg-neutral-50/50 flex flex-col items-center justify-center shrink-0 text-neutral-400 select-none text-[9px] font-bold uppercase tracking-wider text-center p-2">
                              No Image Uploaded
                            </div>
                          )}

                          <div className="flex-1">
                            <label className="relative flex items-center justify-center gap-2 border border-[#1E3E62]/20 hover:border-[#1E3E62]/40 rounded-xl px-4 py-2.5 bg-[#1E3E62]/5 hover:bg-[#1E3E62]/10 text-[#1E3E62] font-black text-xs transition cursor-pointer select-none">
                              {uploadingBannerImage ? (
                                <>
                                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                  Uploading...
                                </>
                              ) : (
                                <>
                                  <Upload className="h-3.5 w-3.5" />
                                  Upload Poster Image
                                </>
                              )}
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleBannerImageChange}
                                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                disabled={uploadingBannerImage}
                              />
                            </label>
                            <p className="text-[9px] text-neutral-400 font-medium mt-1.5 leading-relaxed">
                              Upload high resolution JPEG/PNG poster. Image will be compressed automatically for optimal loading speeds.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-black/5 flex items-center justify-end gap-3 font-sans">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingBanner(null);
                          setBannerIndex(null);
                          setIsBannerFormOpen(false);
                        }}
                        className="text-[10px] font-bold text-neutral-500 hover:text-neutral-700 px-3.5 py-2 bg-neutral-100 rounded-xl transition"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="text-[10px] font-black bg-[#1E3E62] hover:bg-[#12223A] text-white px-4 py-2.5 rounded-xl shadow-sm transition uppercase tracking-wider cursor-pointer"
                      >
                        {bannerIndex !== null ? "Save Changes" : "Add Banner"}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-neutral-400 select-none">
                    <Building className="h-10 w-10 text-neutral-300 mb-2.5" />
                    <p className="text-xs font-bold uppercase tracking-wider">No Banner Selected</p>
                    <p className="text-[10px] text-[#1E3E62] mt-1">Select a banner from the list to edit its details, or click "Add Banner" to create a new one.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Profile Form Editor Drawer Overlay */}
      {isEditorOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-end">
          <div className="bg-white w-full max-w-4xl h-full shadow-2xl flex flex-col animate-slide-left relative overflow-hidden">
            
            {/* Drawer Header */}
            <div className="bg-[#12223A] text-white px-6 py-4 flex items-center justify-between border-b border-[#F9BF29] shrink-0">
              <div>
                <h3 className="text-base font-black uppercase tracking-wider">
                  {isEditMode ? `Edit Profile: ${formStudent.name}` : "Create Candidate Profile"}
                </h3>
                <p className="text-[10px] text-[#F9BF29] font-bold mt-0.5">Fill details manually or drag & drop a PDF resume to auto-fill</p>
              </div>
              <button
                onClick={() => setIsEditorOpen(false)}
                className="rounded-lg p-1 text-white/70 hover:text-white hover:bg-white/10 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Resume Upload parsing status banner */}
            {uploadError && (
              <div className="bg-rose-50 border-b border-rose-200 px-6 py-2.5 text-xs text-rose-700 font-bold flex items-center justify-between shrink-0">
                <div className="flex items-center gap-1.5">
                  <XCircle className="h-4 w-4 text-rose-600" />
                  <span>{uploadError}</span>
                </div>
                <button onClick={() => setUploadError(null)} className="text-rose-500 hover:text-rose-700 font-black">Dismiss</button>
              </div>
            )}

            {/* Dynamic Tabs Bar */}
            <div className="bg-neutral-50 border-b border-black/5 px-6 flex overflow-x-auto shrink-0 scrollbar-none">
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
                  <div className="border-2 border-dashed border-neutral-300 rounded-2xl p-6 bg-neutral-50/50 hover:bg-[#1E3E62]/5 hover:border-[#1E3E62] transition duration-200 flex flex-col items-center justify-center text-center relative group">
                    {uploadingResume ? (
                      <div className="py-4 space-y-2">
                        <Loader2 className="h-8 w-8 animate-spin text-[#1E3E62] mx-auto" />
                        <p className="text-xs font-bold text-[#1E3E62] uppercase tracking-wider">Parsing Resume PDF details...</p>
                      </div>
                    ) : (
                      <>
                        <Upload className="h-8 w-8 text-neutral-400 group-hover:text-[#1E3E62] transition-colors mb-2.5" />
                        <p className="text-xs font-bold text-neutral-700 leading-tight">Drag and drop PDF resume here to auto-fill details</p>
                        <p className="text-[10px] text-neutral-400 mt-1 font-medium">Or click to select a file from local directory</p>
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
                      <label htmlFor="form-name" className="block text-[11px] font-bold text-neutral-600 uppercase tracking-wider mb-1.5">
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
                        className="w-full rounded-xl border border-black/10 bg-white px-3 py-2.5 text-xs outline-none focus:border-[#1E3E62]"
                      />
                    </div>

                    {/* Slug */}
                    <div>
                      <label htmlFor="form-slug" className="block text-[11px] font-bold text-neutral-600 uppercase tracking-wider mb-1.5">
                        URL Identifier Slug (Auto-generated)
                      </label>
                      <input
                        id="form-slug"
                        type="text"
                        value={formStudent.slug || ""}
                        onChange={(e) => setFormStudent((prev) => ({ ...prev, slug: e.target.value }))}
                        placeholder="e.g. chalukya-nayaka-b-k"
                        className="w-full rounded-xl border border-black/10 bg-neutral-50 px-3 py-2.5 text-xs outline-none font-mono text-neutral-500"
                        disabled={isEditMode}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Specialization */}
                    <div>
                      <label htmlFor="form-spec" className="block text-[11px] font-bold text-neutral-600 uppercase tracking-wider mb-1.5">
                        Specialization Track <span className="text-rose-500">*</span>
                      </label>
                      <select
                        id="form-spec"
                        value={formStudent.specialization}
                        onChange={(e) => setFormStudent((prev) => ({ ...prev, specialization: e.target.value as Specialization }))}
                        className="w-full rounded-xl border border-black/10 bg-white px-3 py-2.5 text-xs outline-none focus:border-[#1E3E62] cursor-pointer"
                      >
                        <option value="Artificial Intelligence">Artificial Intelligence</option>
                        <option value="Cybersecurity">Cybersecurity</option>
                      </select>
                    </div>

                    {/* Gender */}
                    <div>
                      <label htmlFor="form-gender" className="block text-[11px] font-bold text-neutral-600 uppercase tracking-wider mb-1.5">
                        Gender <span className="text-rose-500">*</span>
                      </label>
                      <select
                        id="form-gender"
                        value={formStudent.gender}
                        onChange={(e) => setFormStudent((prev) => ({ ...prev, gender: e.target.value as Gender }))}
                        className="w-full rounded-xl border border-black/10 bg-white px-3 py-2.5 text-xs outline-none focus:border-[#1E3E62] cursor-pointer"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>
                  </div>

                  {/* Headline */}
                  <div>
                    <label htmlFor="form-headline" className="block text-[11px] font-bold text-neutral-600 uppercase tracking-wider mb-1.5">
                      Professional Headline <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="form-headline"
                      type="text"
                      required
                      value={formStudent.headline}
                      onChange={(e) => setFormStudent((prev) => ({ ...prev, headline: e.target.value }))}
                      placeholder="e.g. Cybersecurity Engineer / AI Developer"
                      className="w-full rounded-xl border border-black/10 bg-white px-3 py-2.5 text-xs outline-none focus:border-[#1E3E62]"
                    />
                  </div>

                  {/* Location & Photo */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="form-location" className="block text-[11px] font-bold text-neutral-600 uppercase tracking-wider mb-1.5">
                        Location / City
                      </label>
                      <input
                        id="form-location"
                        type="text"
                        value={formStudent.location || ""}
                        onChange={(e) => setFormStudent((prev) => ({ ...prev, location: e.target.value }))}
                        placeholder="e.g. Bengaluru, India"
                        className="w-full rounded-xl border border-black/10 bg-white px-3 py-2.5 text-xs outline-none focus:border-[#1E3E62]"
                      />
                    </div>

                    <div>
                      <label htmlFor="photo-file" className="block text-[11px] font-bold text-neutral-600 uppercase tracking-wider mb-1.5">
                        Upload Profile Picture
                      </label>
                      <div className="relative">
                        <input
                          id="photo-file"
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoChange}
                          className="w-full rounded-xl border border-black/10 bg-white px-3 py-2.5 text-xs outline-none focus:border-[#1E3E62] file:mr-2.5 file:rounded-md file:border-0 file:bg-neutral-100 file:px-2.5 file:py-1 file:text-xs file:font-extrabold file:text-neutral-700"
                        />
                        {uploadingPhoto && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-neutral-400" />}
                      </div>
                    </div>
                  </div>

                  {/* Professional Summary */}
                  <div>
                    <label htmlFor="form-about" className="block text-[11px] font-bold text-neutral-600 uppercase tracking-wider mb-1.5">
                      Professional Summary / About Bio <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      id="form-about"
                      required
                      rows={5}
                      value={formStudent.about}
                      onChange={(e) => setFormStudent((prev) => ({ ...prev, about: e.target.value }))}
                      placeholder="Write a compelling professional summary that displays their core specialties and competencies..."
                      className="w-full rounded-xl border border-black/10 bg-white px-3 py-2.5 text-xs outline-none focus:border-[#1E3E62] leading-relaxed resize-y"
                    />
                  </div>
                </div>
              )}

              {/* Tab 2: Contact Details */}
              {activeTab === "contact" && (
                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="form-phone" className="block text-[11px] font-bold text-neutral-600 uppercase tracking-wider mb-1.5">
                        Contact Phone
                      </label>
                      <input
                        id="form-phone"
                        type="text"
                        value={formStudent.phone || ""}
                        onChange={(e) => setFormStudent((prev) => ({ ...prev, phone: e.target.value }))}
                        placeholder="e.g. +91 9999999999"
                        className="w-full rounded-xl border border-black/10 bg-white px-3 py-2.5 text-xs outline-none"
                      />
                    </div>
                    <div>
                      <label htmlFor="form-email" className="block text-[11px] font-bold text-neutral-600 uppercase tracking-wider mb-1.5">
                        Personal Email
                      </label>
                      <input
                        id="form-email"
                        type="email"
                        value={formStudent.email || ""}
                        onChange={(e) => setFormStudent((prev) => ({ ...prev, email: e.target.value }))}
                        placeholder="e.g. candidate@gmail.com"
                        className="w-full rounded-xl border border-black/10 bg-white px-3 py-2.5 text-xs outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="form-college-email" className="block text-[11px] font-bold text-neutral-600 uppercase tracking-wider mb-1.5">
                        University/College Email
                      </label>
                      <input
                        id="form-college-email"
                        type="email"
                        value={formStudent.collegeEmail || ""}
                        onChange={(e) => setFormStudent((prev) => ({ ...prev, collegeEmail: e.target.value }))}
                        placeholder="e.g. candidate@reva.edu.in"
                        className="w-full rounded-xl border border-black/10 bg-white px-3 py-2.5 text-xs outline-none"
                      />
                    </div>
                    <div>
                      <label htmlFor="resume-file" className="block text-[11px] font-bold text-neutral-600 uppercase tracking-wider mb-1.5">
                        Resume File Path (PDF)
                      </label>
                      <input
                        id="resume-file"
                        type="text"
                        value={formStudent.resume || ""}
                        onChange={(e) => setFormStudent((prev) => ({ ...prev, resume: e.target.value }))}
                        placeholder="Automatic if resume uploaded, or enter path manually"
                        className="w-full rounded-xl border border-black/10 bg-neutral-50 px-3 py-2.5 text-xs outline-none font-mono text-neutral-500"
                        disabled
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="form-linkedin" className="block text-[11px] font-bold text-neutral-600 uppercase tracking-wider mb-1.5">
                        LinkedIn URL
                      </label>
                      <input
                        id="form-linkedin"
                        type="text"
                        value={formStudent.linkedin || ""}
                        onChange={(e) => setFormStudent((prev) => ({ ...prev, linkedin: e.target.value }))}
                        placeholder="e.g. https://www.linkedin.com/in/username"
                        className="w-full rounded-xl border border-black/10 bg-white px-3 py-2.5 text-xs outline-none"
                      />
                    </div>
                    <div>
                      <label htmlFor="form-github" className="block text-[11px] font-bold text-neutral-600 uppercase tracking-wider mb-1.5">
                        GitHub Profile URL
                      </label>
                      <input
                        id="form-github"
                        type="text"
                        value={formStudent.github || ""}
                        onChange={(e) => setFormStudent((prev) => ({ ...prev, github: e.target.value }))}
                        placeholder="e.g. https://github.com/username"
                        className="w-full rounded-xl border border-black/10 bg-white px-3 py-2.5 text-xs outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Placement Info */}
              {activeTab === "placement" && (
                <div className="space-y-6">
                  <div className="bg-neutral-50 border border-black/5 rounded-2xl p-6 space-y-4">
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
                        className="h-4.5 w-4.5 rounded accent-[#1E3E62] cursor-pointer"
                      />
                      <span className="text-xs font-black text-neutral-800 uppercase tracking-wider">
                        Mark Candidate as Placed
                      </span>
                    </label>

                    {formStudent.placement && (
                      <div className="grid grid-cols-2 gap-4 pt-3 border-t border-black/5 animate-scale-up">
                        <div>
                          <label htmlFor="form-placement-company" className="block text-[11px] font-bold text-neutral-600 uppercase tracking-wider mb-1.5">
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
                            className="w-full rounded-xl border border-black/10 bg-white px-3 py-2.5 text-xs outline-none focus:border-[#1E3E62]"
                          />
                        </div>
                        <div>
                          <label htmlFor="form-placement-role" className="block text-[11px] font-bold text-neutral-600 uppercase tracking-wider mb-1.5">
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
                            className="w-full rounded-xl border border-black/10 bg-white px-3 py-2.5 text-xs outline-none focus:border-[#1E3E62]"
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
                    <h4 className="text-[11px] font-black uppercase tracking-wider text-neutral-500">Education Timeline Degrees</h4>
                    <button
                      type="button"
                      onClick={addEducation}
                      className="inline-flex items-center gap-1.5 bg-neutral-100 border border-black/5 hover:bg-neutral-200 text-neutral-700 font-extrabold text-[10px] px-3 py-1.5 rounded-lg transition"
                    >
                      <Plus className="h-3 w-3" /> Add Education
                    </button>
                  </div>

                  {formStudent.education.map((edu, idx) => (
                    <div key={idx} className="border border-black/5 rounded-2xl p-5 bg-[#fafafa]/50 relative animate-scale-up space-y-4">
                      <button
                        type="button"
                        onClick={() => removeEducation(idx)}
                        className="absolute right-3 top-3 text-neutral-400 hover:text-rose-600 transition"
                      >
                        <X className="h-4.5 w-4.5" />
                      </button>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor={`form-edu-degree-${idx}`} className="block text-[10px] font-bold text-neutral-600 uppercase tracking-wider mb-1.5">
                            Degree Title
                          </label>
                          <input
                            id={`form-edu-degree-${idx}`}
                            type="text"
                            required
                            value={edu.degree}
                            onChange={(e) => updateEducation(idx, "degree", e.target.value)}
                            placeholder="e.g. M.Tech. in Cyber Security"
                            className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-xs outline-none"
                          />
                        </div>
                        <div>
                          <label htmlFor={`form-edu-inst-${idx}`} className="block text-[10px] font-bold text-neutral-600 uppercase tracking-wider mb-1.5">
                            Institute / University
                          </label>
                          <input
                            id={`form-edu-inst-${idx}`}
                            type="text"
                            required
                            value={edu.institute}
                            onChange={(e) => updateEducation(idx, "institute", e.target.value)}
                            placeholder="e.g. REVA University"
                            className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-xs outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor={`form-edu-period-${idx}`} className="block text-[10px] font-bold text-neutral-600 uppercase tracking-wider mb-1.5">
                            Timeline Period
                          </label>
                          <input
                            id={`form-edu-period-${idx}`}
                            type="text"
                            required
                            value={edu.period}
                            onChange={(e) => updateEducation(idx, "period", e.target.value)}
                            placeholder="e.g. Nov 2025 – Nov 2027"
                            className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-xs outline-none"
                          />
                        </div>
                        <div>
                          <label htmlFor={`form-edu-cgpa-${idx}`} className="block text-[10px] font-bold text-neutral-600 uppercase tracking-wider mb-1.5">
                            CGPA (Optional)
                          </label>
                          <input
                            id={`form-edu-cgpa-${idx}`}
                            type="text"
                            value={edu.cgpa || ""}
                            onChange={(e) => updateEducation(idx, "cgpa", e.target.value)}
                            placeholder="e.g. 9.47 / 8.5"
                            className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-xs outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  {formStudent.education.length === 0 && (
                    <p className="text-center py-6 text-[11px] text-neutral-400 font-bold uppercase tracking-wider border border-dashed border-black/10 rounded-2xl">
                      No education records added. Click above to add.
                    </p>
                  )}
                </div>
              )}

              {/* Tab 5: Skills */}
              {activeTab === "skills" && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-[11px] font-black uppercase tracking-wider text-neutral-500 font-bold">Skills Catalog Categories</h4>
                    <button
                      type="button"
                      onClick={addSkillGroup}
                      className="inline-flex items-center gap-1.5 bg-neutral-100 border border-black/5 hover:bg-neutral-200 text-neutral-700 font-extrabold text-[10px] px-3 py-1.5 rounded-lg transition"
                    >
                      <Plus className="h-3 w-3" /> Add Skills Category
                    </button>
                  </div>

                  {formStudent.skills.map((group, idx) => (
                    <div key={idx} className="border border-black/5 rounded-2xl p-5 bg-[#fafafa]/50 relative animate-scale-up space-y-4">
                      <button
                        type="button"
                        onClick={() => removeSkillGroup(idx)}
                        className="absolute right-3 top-3 text-neutral-400 hover:text-rose-600 transition"
                      >
                        <X className="h-4.5 w-4.5" />
                      </button>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-1">
                          <label htmlFor={`form-skill-cat-${idx}`} className="block text-[10px] font-bold text-neutral-600 uppercase tracking-wider mb-1.5">
                            Category Label
                          </label>
                          <input
                            id={`form-skill-cat-${idx}`}
                            type="text"
                            required
                            value={group.category}
                            onChange={(e) => updateSkillCategoryName(idx, e.target.value)}
                            placeholder="e.g. Programming / Tools"
                            className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-xs outline-none"
                          />
                        </div>
                        <div className="col-span-2">
                          <label htmlFor={`form-skill-items-${idx}`} className="block text-[10px] font-bold text-neutral-600 uppercase tracking-wider mb-1.5">
                            Core Skills (Comma separated list)
                          </label>
                          <input
                            id={`form-skill-items-${idx}`}
                            type="text"
                            value={group.items.join(", ")}
                            onChange={(e) => updateSkillGroupItems(idx, e.target.value)}
                            placeholder="e.g. Python, SQL, Java, TensorFlow"
                            className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-xs outline-none"
                          />
                          <p className="text-[9px] text-neutral-400 font-bold tracking-wider mt-1 uppercase">Separate skills using commas</p>
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
                  <div className="space-y-4 border-b border-black/5 pb-6">
                    <div className="flex justify-between items-center">
                      <h4 className="text-[11px] font-black uppercase tracking-wider text-neutral-500">Corporate Work Experience</h4>
                      <button
                        type="button"
                        onClick={addExperience}
                        className="inline-flex items-center gap-1.5 bg-neutral-100 border border-black/5 hover:bg-neutral-200 text-neutral-700 font-extrabold text-[10px] px-3 py-1.5 rounded-lg transition"
                      >
                        <Plus className="h-3 w-3" /> Add Experience
                      </button>
                    </div>

                    {(formStudent.workExperience || []).map((exp, expIdx) => (
                      <div key={expIdx} className="border border-black/5 rounded-2xl p-5 bg-[#fafafa]/50 relative animate-scale-up space-y-4">
                        <button
                          type="button"
                          onClick={() => removeExperience(expIdx)}
                          className="absolute right-3 top-3 text-neutral-400 hover:text-rose-600 transition"
                        >
                          <X className="h-4.5 w-4.5" />
                        </button>

                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <label htmlFor={`form-exp-role-${expIdx}`} className="block text-[10px] font-bold text-neutral-600 uppercase tracking-wider mb-1.5">
                              Role / Job Title
                            </label>
                            <input
                              id={`form-exp-role-${expIdx}`}
                              type="text"
                              required
                              value={exp.role}
                              onChange={(e) => updateExperience(expIdx, "role", e.target.value)}
                              placeholder="e.g. Intern"
                              className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-xs outline-none"
                            />
                          </div>
                          <div>
                            <label htmlFor={`form-exp-comp-${expIdx}`} className="block text-[10px] font-bold text-neutral-600 uppercase tracking-wider mb-1.5">
                              Company Name
                            </label>
                            <input
                              id={`form-exp-comp-${expIdx}`}
                              type="text"
                              required
                              value={exp.company}
                              onChange={(e) => updateExperience(expIdx, "company", e.target.value)}
                              placeholder="e.g. Skyworks Solutions"
                              className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-xs outline-none"
                            />
                          </div>
                          <div>
                            <label htmlFor={`form-exp-period-${expIdx}`} className="block text-[10px] font-bold text-neutral-600 uppercase tracking-wider mb-1.5">
                              Duration Period
                            </label>
                            <input
                              id={`form-exp-period-${expIdx}`}
                              type="text"
                              value={exp.period || ""}
                              onChange={(e) => updateExperience(expIdx, "period", e.target.value)}
                              placeholder="e.g. Mar 2025 – Jun 2025"
                              className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-xs outline-none"
                            />
                          </div>
                        </div>

                        {/* Bullets Sub-section */}
                        <div className="space-y-2.5 pt-3 border-t border-black/5">
                          <div className="flex justify-between items-center">
                            <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Key Responsibilities / Bullet points</label>
                            <button
                              type="button"
                              onClick={() => addExperienceBullet(expIdx)}
                              className="text-[9px] font-extrabold text-[#1E3E62] hover:underline"
                            >
                              + Add Bullet
                            </button>
                          </div>
                          {exp.bullets.map((b, bulletIdx) => (
                            <div key={bulletIdx} className="flex gap-2 items-center animate-scale-up">
                              <span className="text-neutral-400 font-bold shrink-0 text-xs">•</span>
                              <input
                                type="text"
                                required
                                value={b}
                                onChange={(e) => updateExperienceBullet(expIdx, bulletIdx, e.target.value)}
                                placeholder="Describe contribution or highlight metrics..."
                                className="flex-1 rounded-xl border border-black/10 bg-white px-3 py-1.5 text-xs outline-none"
                              />
                              {exp.bullets.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeExperienceBullet(expIdx, bulletIdx)}
                                  className="text-neutral-400 hover:text-rose-600 transition shrink-0"
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
                      <h4 className="text-[11px] font-black uppercase tracking-wider text-neutral-500">Featured Engineering Projects</h4>
                      <button
                        type="button"
                        onClick={addProject}
                        className="inline-flex items-center gap-1.5 bg-neutral-100 border border-black/5 hover:bg-neutral-200 text-neutral-700 font-extrabold text-[10px] px-3 py-1.5 rounded-lg transition"
                      >
                        <Plus className="h-3 w-3" /> Add Project
                      </button>
                    </div>

                    {formStudent.projects.map((proj, projIdx) => (
                      <div key={projIdx} className="border border-black/5 rounded-2xl p-5 bg-[#fafafa]/50 relative animate-scale-up space-y-4">
                        <button
                          type="button"
                          onClick={() => removeProject(projIdx)}
                          className="absolute right-3 top-3 text-neutral-400 hover:text-rose-600 transition"
                        >
                          <X className="h-4.5 w-4.5" />
                        </button>

                        <div className="grid grid-cols-3 gap-4">
                          <div className="col-span-2">
                            <label htmlFor={`form-proj-title-${projIdx}`} className="block text-[10px] font-bold text-neutral-600 uppercase tracking-wider mb-1.5">
                              Project Title
                            </label>
                            <input
                              id={`form-proj-title-${projIdx}`}
                              type="text"
                              required
                              value={proj.title}
                              onChange={(e) => updateProject(projIdx, "title", e.target.value)}
                              placeholder="e.g. AegisFace: Adversary Resistant Facial Recognition"
                              className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-xs outline-none"
                            />
                          </div>
                          <div className="col-span-1">
                            <label htmlFor={`form-proj-tag-${projIdx}`} className="block text-[10px] font-bold text-neutral-600 uppercase tracking-wider mb-1.5">
                              Tag Label
                            </label>
                            <input
                              id={`form-proj-tag-${projIdx}`}
                              type="text"
                              value={proj.tag || ""}
                              onChange={(e) => updateProject(projIdx, "tag", e.target.value)}
                              placeholder="e.g. Personal / Featured"
                              className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-xs outline-none"
                            />
                          </div>
                        </div>

                        {/* Bullets Sub-section */}
                        <div className="space-y-2.5 pt-3 border-t border-black/5">
                          <div className="flex justify-between items-center">
                            <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Project description bullets</label>
                            <button
                              type="button"
                              onClick={() => addProjectBullet(projIdx)}
                              className="text-[9px] font-extrabold text-[#1E3E62] hover:underline"
                            >
                              + Add Bullet
                            </button>
                          </div>
                          {proj.bullets.map((b, bulletIdx) => (
                            <div key={bulletIdx} className="flex gap-2 items-center animate-scale-up">
                              <span className="text-neutral-400 font-bold shrink-0 text-xs">•</span>
                              <input
                                type="text"
                                required
                                value={b}
                                onChange={(e) => updateProjectBullet(projIdx, bulletIdx, e.target.value)}
                                placeholder="Describe contribution or highlight metrics..."
                                className="flex-1 rounded-xl border border-black/10 bg-white px-3 py-1.5 text-xs outline-none"
                              />
                              {proj.bullets.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeProjectBullet(projIdx, bulletIdx)}
                                  className="text-neutral-400 hover:text-rose-600 transition shrink-0"
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
                    <label htmlFor="form-certs" className="block text-[11px] font-bold text-neutral-600 uppercase tracking-wider mb-1">
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
                      className="w-full rounded-xl border border-black/10 bg-white px-3 py-2.5 text-xs outline-none leading-relaxed"
                    />
                    <p className="text-[9px] text-neutral-400 font-bold uppercase tracking-wider">Separate certification titles with commas</p>
                  </div>

                  {/* Research Publications list */}
                  <div className="space-y-3">
                    <label htmlFor="form-pubs" className="block text-[11px] font-bold text-neutral-600 uppercase tracking-wider mb-1">
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
                      className="w-full rounded-xl border border-black/10 bg-white px-3 py-2.5 text-xs outline-none leading-relaxed"
                    />
                    <p className="text-[9px] text-neutral-400 font-bold uppercase tracking-wider">Separate publication titles with commas</p>
                  </div>
                </div>
              )}
            </form>

            {/* Drawer Footer Actions */}
            <div className="bg-neutral-50 border-t border-black/5 px-6 py-4 flex items-center justify-between shrink-0">
              <button
                type="button"
                onClick={() => setIsEditorOpen(false)}
                className="text-xs font-bold text-neutral-500 hover:text-neutral-700 px-4 py-2 bg-neutral-100 hover:bg-neutral-200 border border-black/5 rounded-xl transition"
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
                    className="text-xs font-bold text-[#1E3E62] px-4 py-2 border border-[#1E3E62]/20 rounded-xl hover:bg-neutral-100 transition"
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
                    className="text-xs font-bold bg-[#1E3E62] text-white px-5 py-2.5 rounded-xl hover:bg-[#12223A] transition flex items-center gap-1"
                  >
                    Next Step <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={handleSaveStudent}
                    className="text-xs font-black bg-emerald-600 text-white px-6 py-2.5 rounded-xl hover:bg-emerald-700 transition shadow-md uppercase tracking-wider"
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-black/5 animate-scale-up text-center space-y-4">
            <div className="h-12 w-12 rounded-full bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-sm">
              <Trash2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-[#1E3E62] uppercase tracking-wide">Delete Candidate Profile?</h3>
              <p className="text-xs text-neutral-500 font-semibold mt-1">This operation is permanent. It deletes their database details, uploaded resume, and photo.</p>
            </div>
            <div className="flex gap-2.5 pt-2">
              <button
                onClick={() => setDeleteCandidateSlug(null)}
                className="flex-1 py-2.5 text-xs font-bold text-neutral-600 bg-neutral-100 hover:bg-neutral-200 border border-black/5 rounded-xl transition"
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
      <footer className="border-t border-black/5 bg-white py-6 text-center text-xs text-neutral-500 font-bold mt-12">
        © REVA University · RACE · Placement Admin Portal
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
    <div className="bg-white border border-black/5 p-4 rounded-2xl shadow-sm flex items-center justify-between">
      <div>
        <p className="text-[10px] font-black uppercase text-neutral-400 tracking-wider leading-none mb-1.5">{label}</p>
        <p className="text-2xl font-black text-neutral-800 leading-tight">{val}</p>
        {subtitle && <p className="text-[9px] text-neutral-400 font-bold uppercase tracking-wider mt-0.5">{subtitle}</p>}
      </div>
      {icon && <div className="h-10 w-10 bg-neutral-50 rounded-xl flex items-center justify-center border border-black/5 shrink-0">{icon}</div>}
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
      className={`flex items-center gap-1.5 py-4 px-3 border-b-2 font-bold text-xs shrink-0 select-none transition ${
        active ? "border-[#1E3E62] text-[#1E3E62]" : "border-transparent text-neutral-400 hover:text-neutral-600"
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
