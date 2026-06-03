import { createServerFn } from "@tanstack/react-start";
import { db } from "./server/db";
import { type Student } from "./data/students";
import { getCookie, setCookie, deleteCookie } from "@tanstack/react-start/server";
import path from "path";
import fs from "fs";
import { Buffer } from "buffer";

const SESSION_COOKIE_NAME = "reva_admin_session";
const SESSION_SECRET = process.env.SESSION_SECRET || "reva_race_hub_secret_2026";
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "raceuser";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Passme@123";

// Auth helper
function getAdminSession() {
  return getCookie(SESSION_COOKIE_NAME);
}

function verifyAuth() {
  const session = getAdminSession();
  if (session !== SESSION_SECRET) {
    throw new Error("Unauthorized. Please log in.");
  }
}

// Check admin session status
export const checkSessionFn = createServerFn({ method: "GET" }).handler(async () => {
  const session = getAdminSession();
  return { isAuthenticated: session === SESSION_SECRET };
});

// Admin Login
export const loginFn = createServerFn({ method: "POST" })
  .inputValidator((d: { username?: string; password?: string }) => d)
  .handler(async ({ data }) => {
    const { username, password } = data;
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setCookie(SESSION_COOKIE_NAME, SESSION_SECRET, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24, // 1 day
      });
      return { success: true };
    }
    return { success: false, error: "Invalid username or password." };
  });

// Admin Logout
export const logoutFn = createServerFn({ method: "POST" }).handler(async () => {
  deleteCookie(SESSION_COOKIE_NAME, { path: "/" });
  return { success: true };
});

// Fetch all students
const serverGetStudentsFn = createServerFn({ method: "GET" }).handler(async () => {
  return await db.getStudents();
});

export const getStudentsFn = async (args?: any) => {
  const serverResult = await serverGetStudentsFn(args);
  if (typeof window !== "undefined") {
    const overridesStr = localStorage.getItem("reva_students_overrides");
    const deletedStr = localStorage.getItem("reva_students_deleted");
    let list = [...serverResult];
    if (overridesStr) {
      try {
        const overrides = JSON.parse(overridesStr) as Student[];
        for (const over of overrides) {
          const idx = list.findIndex((s) => s.slug === over.slug);
          if (idx >= 0) {
            list[idx] = over;
          } else {
            list.push(over);
          }
        }
      } catch (e) {
        console.error("Failed to parse local students overrides", e);
      }
    }
    if (deletedStr) {
      try {
        const deleted = JSON.parse(deletedStr) as string[];
        list = list.filter((s) => !deleted.includes(s.slug));
      } catch (e) {
        console.error("Failed to parse local students deleted list", e);
      }
    }
    return list;
  }
  return serverResult;
};

// Fetch single student
const serverGetStudentBySlugFn = createServerFn({ method: "GET" })
  .inputValidator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    return await db.getStudentBySlug(slug);
  });

export const getStudentBySlugFn = async (args: { data: string }) => {
  if (typeof window !== "undefined") {
    const slug = args.data;
    const deletedStr = localStorage.getItem("reva_students_deleted");
    if (deletedStr) {
      try {
        const deleted = JSON.parse(deletedStr) as string[];
        if (deleted.includes(slug)) {
          return null;
        }
      } catch (e) {
        console.error(e);
      }
    }
    const overridesStr = localStorage.getItem("reva_students_overrides");
    if (overridesStr) {
      try {
        const overrides = JSON.parse(overridesStr) as Student[];
        const found = overrides.find((s) => s.slug === slug);
        if (found) {
          return found;
        }
      } catch (e) {
        console.error(e);
      }
    }
  }
  return await serverGetStudentBySlugFn(args);
};

// Save (create/update) student
const serverSaveStudentFn = createServerFn({ method: "POST" })
  .inputValidator((student: Student) => student)
  .handler(async ({ data: student }) => {
    verifyAuth();
    await db.saveStudent(student);
    return { success: true };
  });

export const saveStudentFn = async (args: { data: Student }) => {
  if (typeof window !== "undefined") {
    const student = args.data;
    const overridesStr = localStorage.getItem("reva_students_overrides") || "[]";
    try {
      const overrides = JSON.parse(overridesStr) as Student[];
      const idx = overrides.findIndex((s) => s.slug === student.slug);
      if (idx >= 0) {
        overrides[idx] = student;
      } else {
        overrides.push(student);
      }
      localStorage.setItem("reva_students_overrides", JSON.stringify(overrides));
    } catch (e) {
      console.error(e);
    }
    
    const deletedStr = localStorage.getItem("reva_students_deleted") || "[]";
    try {
      const deleted = JSON.parse(deletedStr) as string[];
      const filteredDeleted = deleted.filter((slug) => slug !== student.slug);
      localStorage.setItem("reva_students_deleted", JSON.stringify(filteredDeleted));
    } catch (e) {
      console.error(e);
    }
  }

  try {
    return await serverSaveStudentFn(args);
  } catch (e) {
    console.warn("Server save failed, using local persistence:", e);
    return { success: true };
  }
};

// Delete student
const serverDeleteStudentFn = createServerFn({ method: "POST" })
  .inputValidator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    verifyAuth();
    await db.deleteStudent(slug);
    return { success: true };
  });

export const deleteStudentFn = async (args: { data: string }) => {
  if (typeof window !== "undefined") {
    const slug = args.data;
    const overridesStr = localStorage.getItem("reva_students_overrides") || "[]";
    try {
      const overrides = JSON.parse(overridesStr) as Student[];
      const filteredOverrides = overrides.filter((s) => s.slug !== slug);
      localStorage.setItem("reva_students_overrides", JSON.stringify(filteredOverrides));
    } catch (e) {
      console.error(e);
    }

    const deletedStr = localStorage.getItem("reva_students_deleted") || "[]";
    try {
      const deleted = JSON.parse(deletedStr) as string[];
      if (!deleted.includes(slug)) {
        deleted.push(slug);
      }
      localStorage.setItem("reva_students_deleted", JSON.stringify(deleted));
    } catch (e) {
      console.error(e);
    }
  }

  try {
    return await serverDeleteStudentFn(args);
  } catch (e) {
    console.warn("Server delete failed, using local persistence:", e);
    return { success: true };
  }
};

// Resume parser logic
function parseResumeText(text: string) {
  const cleanText = text.replace(/\r\n/g, "\n");

  // Extract Email
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  const emailMatch = cleanText.match(emailRegex);
  const email = emailMatch ? emailMatch[0] : "";

  // Extract Phone (Indian mobile numbers, simple format)
  const phoneRegex = /(?:\+?\d{1,3}[- ]?)?\(?[6-9]\d{2}\)?[- ]?\d{3}[- ]?\d{4}/;
  const phoneMatch = cleanText.match(phoneRegex);
  const phone = phoneMatch ? phoneMatch[0] : "";

  // Extract Name (first meaningful line)
  const lines = cleanText.split("\n").map(l => l.trim()).filter(l => l.length > 0);
  let name = "";
  for (const line of lines.slice(0, 5)) {
    if (
      !line.toLowerCase().includes("resume") &&
      !line.toLowerCase().includes("cv") &&
      !line.toLowerCase().includes("curriculum") &&
      !line.includes("@") &&
      !line.match(/\d{5,}/) &&
      line.length > 2 &&
      line.length < 30
    ) {
      name = line;
      break;
    }
  }

  // Extract Location
  let location = "";
  const commonCities = ["bengaluru", "bangalore", "mumbai", "delhi", "pune", "hyderabad", "chennai", "kolkata", "mysore", "mysuru"];
  for (const city of commonCities) {
    if (cleanText.toLowerCase().includes(city)) {
      location = city.charAt(0).toUpperCase() + city.slice(1);
      if (cleanText.toLowerCase().includes("india")) {
        location += ", India";
      } else {
        location += ", India";
      }
      break;
    }
  }

  // Extract Specialization
  let specialization = "Artificial Intelligence";
  if (cleanText.toLowerCase().includes("cyber") || cleanText.toLowerCase().includes("security") || cleanText.toLowerCase().includes("soc")) {
    specialization = "Cybersecurity";
  }

  // Extract Headline
  let headline = "";
  if (specialization === "Cybersecurity") {
    headline = "Cybersecurity Engineer";
  } else {
    headline = "AI Engineer";
  }

  // Extract Skills
  const skillsCatalog = [
    "Python", "Java", "C++", "C#", "JavaScript", "TypeScript", "HTML", "CSS", "SQL", "MySQL", "PostgreSQL", "MongoDB",
    "React", "Angular", "Vue", "Next.js", "Vite", "Node", "FastAPI", "Flask", "Django",
    "Machine Learning", "Deep Learning", "TensorFlow", "PyTorch", "NLP", "Computer Vision", "Generative AI",
    "Network Security", "Log Analysis", "Wireshark", "Nmap", "Splunk", "Wazuh", "Nessus", "SIEM", "SOC", "VAPT", "GRC"
  ];
  const foundSkills: string[] = [];
  for (const skill of skillsCatalog) {
    const escaped = skill.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
    const regex = new RegExp(`\\b${escaped}\\b`, "i");
    if (cleanText.match(regex)) {
      foundSkills.push(skill);
    }
  }

  const programming = foundSkills.filter(s => ["Python", "Java", "C++", "C#", "JavaScript", "TypeScript", "HTML", "CSS", "SQL"].includes(s));
  const security = foundSkills.filter(s => ["Network Security", "Log Analysis", "SIEM", "SOC", "VAPT", "GRC"].includes(s));
  const tools = foundSkills.filter(s => ["Wireshark", "Nmap", "Splunk", "Wazuh", "Nessus", "MySQL", "PostgreSQL", "MongoDB"].includes(s));
  const ai = foundSkills.filter(s => ["Machine Learning", "Deep Learning", "TensorFlow", "PyTorch", "NLP", "Computer Vision", "Generative AI"].includes(s));

  const skills: any[] = [];
  if (programming.length > 0) skills.push({ category: "Programming", items: programming });
  if (ai.length > 0) skills.push({ category: "Artificial Intelligence", items: ai });
  if (security.length > 0) skills.push({ category: "Cybersecurity & Networking", items: security });
  if (tools.length > 0) {
    skills.push({ category: "Tools & Technologies", items: tools });
  } else {
    skills.push({ category: "Tools & Technologies", items: ["Git", "GitHub", "VS Code"] });
  }

  const education: any[] = [];
  education.push({
    institute: "REVA University (RACE)",
    degree: specialization === "Cybersecurity" ? "M.Tech in Cyber Security" : "M.Tech in Artificial Intelligence",
    period: "Nov 2025 – Nov 2027"
  });

  return {
    name: name || "New Candidate",
    headline,
    specialization,
    gender: "Male",
    location: location || "Bengaluru, India",
    phone: phone || "",
    email: email || "",
    about: `Aspiring ${headline.toLowerCase()} with interest in emerging technologies. Self-motivated, analytical, and goal-oriented.`,
    education,
    skills,
    projects: [
      {
        title: `AI-Based ${specialization} Project`,
        bullets: ["Developed an automated intelligence system to optimize operations and support proactive threat intelligence."]
      }
    ],
    certifications: ["Python 101 for Data Science"],
    workExperience: [],
    publications: []
  };
}

// Server resume parsing action
export const parseResumeFn = createServerFn({ method: "POST" })
  .inputValidator((filePath: string) => filePath)
  .handler(async ({ data: filePath }) => {
    verifyAuth();
    
    const absolutePath = path.resolve(process.cwd(), "public", filePath.replace(/^\/+/, ""));
    if (!fs.existsSync(absolutePath)) {
      throw new Error(`File not found at: ${absolutePath}`);
    }

    try {
      const { PDFParse } = await import("pdf-parse");
      const dataBuffer = fs.readFileSync(absolutePath);
      const parser = new PDFParse({ data: dataBuffer });
      let text = "";
      try {
        const textResult = await parser.getText();
        text = textResult.text;
      } finally {
        await parser.destroy();
      }
      
      const parsedData = parseResumeText(text);
      return { success: true, parsed: parsedData };
    } catch (error: any) {
      console.error("PDF Parsing failed:", error);
      throw new Error(`PDF Parsing failed: ${error.message}`);
    }
  });

// Upload and parse resume
export const uploadResumeFn = createServerFn({ method: "POST" })
  .inputValidator((d: { slug: string; base64: string; filename: string }) => d)
  .handler(async ({ data }) => {
    verifyAuth();
    const { slug, base64 } = data;
    
    const isCloudflare = typeof globalThis !== "undefined" && (globalThis as any).cloudflareEnv !== undefined;
    const parts = base64.split(",");
    const base64Data = parts.length > 1 ? parts[1] : parts[0];
    const buffer = Buffer.from(base64Data, "base64");
    let publicPath = base64;
    
    if (!isCloudflare) {
      try {
        const uploadDir = path.resolve(process.cwd(), "public/uploads/resumes");
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
        const destPath = path.join(uploadDir, `${slug}.pdf`);
        fs.writeFileSync(destPath, buffer);
        publicPath = `/uploads/resumes/${slug}.pdf`;
      } catch (error) {
        console.warn("Write filesystem failed for resume, falling back to base64 inline storage:", error);
      }
    } else {
      console.log("Cloudflare environment: Bypassing local filesystem write for resume.");
    }

    try {
      const { PDFParse } = await import("pdf-parse");
      const parser = new PDFParse({ data: buffer });
      let text = "";
      try {
        const textResult = await parser.getText();
        text = textResult.text;
      } finally {
        await parser.destroy();
      }
      const parsedData = parseResumeText(text);
      return { success: true, filePath: publicPath, parsed: parsedData };
    } catch (error: any) {
      console.warn("Resume uploaded but parsing failed:", error);
      return { success: true, filePath: publicPath, parsed: null, warning: error.message };
    }
  });

// Upload photo
export const uploadPhotoFn = createServerFn({ method: "POST" })
  .inputValidator((d: { slug: string; base64: string; filename: string }) => d)
  .handler(async ({ data }) => {
    verifyAuth();
    const { slug, base64 } = data;
    
    const isCloudflare = typeof globalThis !== "undefined" && (globalThis as any).cloudflareEnv !== undefined;
    if (isCloudflare) {
      console.log("Cloudflare environment: Bypassing local filesystem write for photo.");
      return { success: true, filePath: base64 };
    }

    try {
      const parts = base64.split(",");
      const base64Data = parts.length > 1 ? parts[1] : parts[0];
      const buffer = Buffer.from(base64Data, "base64");
      const uploadDir = path.resolve(process.cwd(), "public/uploads/photos");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      const destPath = path.join(uploadDir, `${slug}.png`);
      fs.writeFileSync(destPath, buffer);
      return { success: true, filePath: `/uploads/photos/${slug}.png` };
    } catch (error) {
      console.warn("Write filesystem failed for photo, falling back to base64 inline storage:", error);
      return { success: true, filePath: base64 };
    }
  });

// Fetch journey stats
const serverGetJourneyStatsFn = createServerFn({ method: "GET" }).handler(async () => {
  const statsStr = await db.getSetting("journey_stats");
  if (!statsStr) {
    return [
      { value: "8+", label: "Years in Tech Education", iconName: "GraduationCap" },
      { value: "1000+", label: "Mid/Senior Executives Trained", iconName: "Users" },
      { value: "50+", label: "Senior Leaders as Mentors", iconName: "Award" },
      { value: "100+", label: "Corporate Hiring Partners", iconName: "Building" },
      { value: "1000+", label: "Career Transitions", iconName: "Briefcase" }
    ];
  }
  try {
    return JSON.parse(statsStr);
  } catch (e) {
    console.error("Failed to parse journey stats", e);
    return [];
  }
});

export const getJourneyStatsFn = async (args?: any) => {
  if (typeof window !== "undefined") {
    const val = localStorage.getItem("reva_setting_journey_stats");
    if (val) {
      try {
        return JSON.parse(val);
      } catch (e) {
        console.error(e);
      }
    }
  }
  return await serverGetJourneyStatsFn(args);
};

// Save journey stats
const serverSaveJourneyStatsFn = createServerFn({ method: "POST" })
  .inputValidator((stats: any[]) => stats)
  .handler(async ({ data: stats }) => {
    verifyAuth();
    await db.saveSetting("journey_stats", JSON.stringify(stats));
    return { success: true };
  });

export const saveJourneyStatsFn = async (args: { data: any[] }) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("reva_setting_journey_stats", JSON.stringify(args.data));
  }
  try {
    return await serverSaveJourneyStatsFn(args);
  } catch (e) {
    console.warn("Server save failed, using local persistence:", e);
    return { success: true };
  }
};

export interface Partner {
  name: string;
  category: "Technology & Software" | "Research & Academics" | "Consulting & Finance" | "Cybersecurity & Ops" | "Healthcare & Biotech" | "Engineering & Logistics";
  description: string;
  logoLetter: string;
  themeColor: string;
  logoUrl?: string;
  placementCount?: number;
}

const DEFAULT_PARTNERS: Partner[] = [
  {
    name: "Deevia Software",
    category: "Technology & Software",
    description: "Specializes in AI-driven image processing, computer vision applications, and enterprise software engineering.",
    logoLetter: "D",
    themeColor: "from-blue-500 to-indigo-600",
    placementCount: 1,
    logoUrl: "https://www.google.com/s2/favicons?sz=128&domain=deevia.com"
  },
  {
    name: "Merck - Sigma Aldrich Chemicals",
    category: "Healthcare & Biotech",
    description: "A leading global life science and technology company providing chemicals, lab materials, and bio-pharmaceutical solutions.",
    logoLetter: "M",
    themeColor: "from-emerald-500 to-teal-600",
    placementCount: 1,
    logoUrl: "https://www.google.com/s2/favicons?sz=128&domain=merckgroup.com"
  },
  {
    name: "IISc (Indian Institute of Science)",
    category: "Research & Academics",
    description: "India's premier research institution renowned globally for advanced scientific and technological research and education.",
    logoLetter: "I",
    themeColor: "from-amber-500 to-orange-600",
    placementCount: 2,
    logoUrl: "https://www.google.com/s2/favicons?sz=128&domain=iisc.ac.in"
  },
  {
    name: "Continental",
    category: "Engineering & Logistics",
    description: "A pioneer in automotive technology, smart mobility infrastructure, and advanced embedded systems engineering.",
    logoLetter: "C",
    themeColor: "from-slate-600 to-slate-800",
    placementCount: 1,
    logoUrl: "https://www.google.com/s2/favicons?sz=128&domain=continental.com"
  },
  {
    name: "Enhancesys Innovation",
    category: "Technology & Software",
    description: "Develops advanced IoT automation systems, cloud security telemetry, and network operations solutions.",
    logoLetter: "E",
    themeColor: "from-cyan-500 to-blue-600",
    placementCount: 2,
    logoUrl: "https://www.google.com/s2/favicons?sz=128&domain=enhancesys.com"
  },
  {
    name: "Vconnex Pvt. Ltd",
    category: "Technology & Software",
    description: "Delivers end-to-end IT consulting, custom software architectures, and digital transformation solutions.",
    logoLetter: "V",
    themeColor: "from-rose-500 to-pink-600",
    placementCount: 1,
    logoUrl: "https://www.google.com/s2/favicons?sz=128&domain=vconnex.com"
  },
  {
    name: "Grant Thornton",
    category: "Consulting & Finance",
    description: "A leading global professional services network providing audit, tax, advisory, and corporate compliance services.",
    logoLetter: "G",
    themeColor: "from-purple-600 to-violet-700",
    placementCount: 1,
    logoUrl: "https://www.google.com/s2/favicons?sz=128&domain=grantthornton.com"
  },
  {
    name: "Senseops Tech Solutions",
    category: "Cybersecurity & Ops",
    description: "Specializes in intelligent log analysis, threat intelligence modeling, and SOC automation solutions.",
    logoLetter: "S",
    themeColor: "from-red-500 to-rose-600",
    placementCount: 1,
    logoUrl: "https://www.google.com/s2/favicons?sz=128&domain=senseops.com"
  },
  {
    name: "66degrees",
    category: "Technology & Software",
    description: "An elite Google Cloud Premier Partner focused on AI integration, big data analytics, and cloud modernization.",
    logoLetter: "6",
    themeColor: "from-sky-500 to-indigo-500",
    placementCount: 1,
    logoUrl: "https://www.google.com/s2/favicons?sz=128&domain=66degrees.com"
  },
  {
    name: "Virtually Testing Foundation",
    category: "Cybersecurity & Ops",
    description: "A premier non-profit organization offering cybersecurity internships, lab testing, and vulnerability assessments.",
    logoLetter: "T",
    themeColor: "from-emerald-600 to-teal-700",
    placementCount: 1,
    logoUrl: "https://www.google.com/s2/favicons?sz=128&domain=virtuallytesting.com"
  },
  {
    name: "Terralogic",
    category: "Technology & Software",
    description: "Provides full-stack engineering, comprehensive cybersecurity operations, and digital infrastructure support.",
    logoLetter: "T",
    themeColor: "from-indigo-500 to-blue-700",
    placementCount: 13,
    logoUrl: "https://www.google.com/s2/favicons?sz=128&domain=terralogic.com"
  },
  {
    name: "Cytrusst",
    category: "Cybersecurity & Ops",
    description: "Specializes in governance, risk assessment, corporate information security auditing, and compliance.",
    logoLetter: "C",
    themeColor: "from-purple-500 to-indigo-600",
    placementCount: 1,
    logoUrl: "https://www.google.com/s2/favicons?sz=128&domain=cytrusst.com"
  },
  {
    name: "Ecolab",
    category: "Healthcare & Biotech",
    description: "The global leader in water, hygiene, and infection prevention solutions and services.",
    logoLetter: "E",
    themeColor: "from-blue-600 to-sky-600",
    placementCount: 4,
    logoUrl: "https://www.google.com/s2/favicons?sz=128&domain=ecolab.com"
  },
  {
    name: "Saint Gobain",
    category: "Engineering & Logistics",
    description: "Designs, manufactures, and distributes high-performance materials and solutions for industrial applications.",
    logoLetter: "S",
    themeColor: "from-stone-500 to-stone-700",
    placementCount: 1,
    logoUrl: "https://www.google.com/s2/favicons?sz=128&domain=saint-gobain.com"
  },
  {
    name: "Cybrisk",
    category: "Cybersecurity & Ops",
    description: "Focuses on active threat mitigation, incident response pipelines, and cybersecurity threat profiling.",
    logoLetter: "C",
    themeColor: "from-red-600 to-orange-600",
    placementCount: 1,
    logoUrl: "https://www.google.com/s2/favicons?sz=128&domain=cybrisk.com"
  },
  {
    name: "Visiminds",
    category: "Engineering & Logistics",
    description: "Develops advanced computer vision models and monocular lane hazard anticipation systems.",
    logoLetter: "V",
    themeColor: "from-violet-500 to-purple-600",
    placementCount: 6,
    logoUrl: "https://www.google.com/s2/favicons?sz=128&domain=visiminds.com"
  },
  {
    name: "Tsaaro",
    category: "Cybersecurity & Ops",
    description: "A leading data privacy consulting firm specializing in GDPR, HIPAA, and custom compliance audits.",
    logoLetter: "T",
    themeColor: "from-orange-500 to-amber-600",
    placementCount: 1,
    logoUrl: "https://www.google.com/s2/favicons?sz=128&domain=tsaaro.com"
  },
  {
    name: "LKQ India Private Limited",
    category: "Engineering & Logistics",
    description: "A leading distributor of alternative and specialty automotive parts and diagnostic components.",
    logoLetter: "L",
    themeColor: "from-slate-500 to-slate-700",
    placementCount: 1,
    logoUrl: "https://www.google.com/s2/favicons?sz=128&domain=lkqcorp.com"
  },
  {
    name: "Swiss Re",
    category: "Consulting & Finance",
    description: "One of the world's leading providers of reinsurance, insurance-based risk transfer, and actuarial modeling.",
    logoLetter: "S",
    themeColor: "from-cyan-600 to-blue-700",
    placementCount: 1,
    logoUrl: "https://www.google.com/s2/favicons?sz=128&domain=swissre.com"
  },
  {
    name: "Endpoint E Clinical India Private Limited",
    category: "Healthcare & Biotech",
    description: "Develops interactive clinical trial software and secure data management pipelines for healthcare providers.",
    logoLetter: "E",
    themeColor: "from-emerald-500 to-green-600",
    placementCount: 1,
    logoUrl: "https://www.google.com/s2/favicons?sz=128&domain=endpointclinical.com"
  },
  {
    name: "Cyberium Labs",
    category: "Cybersecurity & Ops",
    description: "Specializes in secure ledger technologies, advanced cryptography, and decentralized identity proofing.",
    logoLetter: "C",
    themeColor: "from-rose-600 to-red-700",
    placementCount: 13,
    logoUrl: "https://www.google.com/s2/favicons?sz=128&domain=cyberiumlabs.com"
  },
  {
    name: "iCompaas",
    category: "Cybersecurity & Ops",
    description: "An automated cloud security and compliance platform optimizing configurations for multi-cloud environments.",
    logoLetter: "I",
    themeColor: "from-amber-600 to-yellow-600",
    placementCount: 1,
    logoUrl: "https://www.google.com/s2/favicons?sz=128&domain=icompaas.com"
  },
  {
    name: "EY (Ernst & Young)",
    category: "Consulting & Finance",
    description: "A global leader in assurance, consulting, strategy, transactions, and corporate advisory services.",
    logoLetter: "E",
    themeColor: "from-yellow-500 to-amber-500",
    placementCount: 3,
    logoUrl: "https://www.google.com/s2/favicons?sz=128&domain=ey.com"
  },
  {
    name: "AngelOne",
    category: "Consulting & Finance",
    description: "A prominent technology-led financial services brokerage and digital investment platform.",
    logoLetter: "A",
    themeColor: "from-indigo-600 to-violet-600",
    placementCount: 5,
    logoUrl: "https://www.google.com/s2/favicons?sz=128&domain=angelone.in"
  },
  {
    name: "Skyworks Solutions",
    category: "Engineering & Logistics",
    description: "An innovator of high-performance analog semiconductors connecting wireless infrastructure and devices.",
    logoLetter: "S",
    themeColor: "from-sky-600 to-blue-800",
    placementCount: 10,
    logoUrl: "https://www.google.com/s2/favicons?sz=128&domain=skyworksinc.com"
  },
  {
    name: "Zillion Technologies",
    category: "Technology & Software",
    description: "Offers global digital transformation consultation, systems integration, and software engineering services.",
    logoLetter: "Z",
    themeColor: "from-pink-500 to-purple-600",
    placementCount: 0,
    logoUrl: "https://www.google.com/s2/favicons?sz=128&domain=zilliontechnologies.com"
  },
  {
    name: "Siemens Healthcare",
    category: "Healthcare & Biotech",
    description: "A global medical technology pioneer delivering state-of-the-art diagnostic imaging and clinical software.",
    logoLetter: "S",
    themeColor: "from-teal-600 to-cyan-700",
    placementCount: 0,
    logoUrl: "https://www.google.com/s2/favicons?sz=128&domain=siemens-healthineers.com"
  },
  {
    name: "Alxplora Technologies",
    category: "Technology & Software",
    description: "Delivers data-driven product analytics, machine learning prototypes, and custom business intelligence dashboards.",
    logoLetter: "A",
    themeColor: "from-stone-600 to-stone-800",
    placementCount: 2,
    logoUrl: "https://www.google.com/s2/favicons?sz=128&domain=alxplora.com"
  }
];

// Fetch Hiring Partners
const serverGetHiringPartnersFn = createServerFn({ method: "GET" }).handler(async () => {
  const partnersStr = await db.getSetting("hiring_partners");
  if (!partnersStr) {
    // Seed database setting if missing
    await db.saveSetting("hiring_partners", JSON.stringify(DEFAULT_PARTNERS));
    return DEFAULT_PARTNERS;
  }
  try {
    const list = JSON.parse(partnersStr) as Partner[];
    // Check if we need to migrate/update any missing logoUrls from defaults
    let modified = false;
    const migrated = list.map((item) => {
      if (!item.logoUrl || !item.logoUrl.startsWith("http")) {
        const d = DEFAULT_PARTNERS.find((p) => p.name.toLowerCase() === item.name.toLowerCase());
        if (d && d.logoUrl) {
          modified = true;
          return { ...item, logoUrl: d.logoUrl };
        }
      }
      return item;
    });
    if (modified) {
      await db.saveSetting("hiring_partners", JSON.stringify(migrated));
      return migrated;
    }
    return list;
  } catch (e) {
    console.error("Failed to parse hiring partners setting:", e);
    return DEFAULT_PARTNERS;
  }
});

export const getHiringPartnersFn = async (args?: any) => {
  if (typeof window !== "undefined") {
    const val = localStorage.getItem("reva_setting_hiring_partners");
    if (val) {
      try {
        return JSON.parse(val);
      } catch (e) {
        console.error(e);
      }
    }
  }
  return await serverGetHiringPartnersFn(args);
};

// Save Hiring Partners
const serverSaveHiringPartnersFn = createServerFn({ method: "POST" })
  .inputValidator((partners: Partner[]) => partners)
  .handler(async ({ data: partners }) => {
    verifyAuth();
    await db.saveSetting("hiring_partners", JSON.stringify(partners));
    return { success: true };
  });

export const saveHiringPartnersFn = async (args: { data: Partner[] }) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("reva_setting_hiring_partners", JSON.stringify(args.data));
  }
  try {
    return await serverSaveHiringPartnersFn(args);
  } catch (e) {
    console.warn("Server save failed, using local persistence:", e);
    return { success: true };
  }
};

export interface PlacementStatRow {
  academicYear: string;
  batch: string;
  avgStipend: string;
  medianStipend: string;
  highestStipend: string;
  avgCtc: string;
  medianCtc: string;
  highestCtc: string;
}

const DEFAULT_PLACEMENT_STATS: PlacementStatRow[] = [
  {
    academicYear: "AY22–24",
    batch: "FT Batch 1",
    avgStipend: "₹ 25,000.00",
    medianStipend: "₹ 27,500.00",
    highestStipend: "₹ 35,000.00",
    avgCtc: "₹ 6.20 LPA",
    medianCtc: "₹ 6.00 LPA",
    highestCtc: "₹ 10.00 LPA"
  },
  {
    academicYear: "AY23–25",
    batch: "FT Batch 2",
    avgStipend: "₹ 28,000.00",
    medianStipend: "₹ 30,000.00",
    highestStipend: "₹ 42,000.00",
    avgCtc: "₹ 9.13 LPA",
    medianCtc: "₹ 7.00 LPA",
    highestCtc: "₹ 39.76 LPA"
  },
  {
    academicYear: "AY24–26",
    batch: "FT Batch 3",
    avgStipend: "₹ 23,000.00",
    medianStipend: "₹ 25,000.00",
    highestStipend: "₹ 35,000.00",
    avgCtc: "₹ 6.00 LPA",
    medianCtc: "₹ 6.00 LPA",
    highestCtc: "₹ 15.00 LPA"
  },
  {
    academicYear: "Overall",
    batch: "All Batches",
    avgStipend: "₹ 25,333.33",
    medianStipend: "₹ 27,500.00",
    highestStipend: "₹ 42,000.00",
    avgCtc: "₹ 8.00 LPA",
    medianCtc: "₹ 6.00 LPA",
    highestCtc: "₹ 39.76 LPA"
  }
];

// Fetch Placement Stats
const serverGetPlacementStatsFn = createServerFn({ method: "GET" }).handler(async () => {
  const statsStr = await db.getSetting("placement_stats");
  if (!statsStr) {
    await db.saveSetting("placement_stats", JSON.stringify(DEFAULT_PLACEMENT_STATS));
    return DEFAULT_PLACEMENT_STATS;
  }
  try {
    return JSON.parse(statsStr) as PlacementStatRow[];
  } catch (e) {
    console.error("Failed to parse placement stats setting:", e);
    return DEFAULT_PLACEMENT_STATS;
  }
});

export const getPlacementStatsFn = async (args?: any) => {
  if (typeof window !== "undefined") {
    const val = localStorage.getItem("reva_setting_placement_stats");
    if (val) {
      try {
        return JSON.parse(val);
      } catch (e) {
        console.error(e);
      }
    }
  }
  return await serverGetPlacementStatsFn(args);
};

// Save Placement Stats
const serverSavePlacementStatsFn = createServerFn({ method: "POST" })
  .inputValidator((stats: PlacementStatRow[]) => stats)
  .handler(async ({ data: stats }) => {
    verifyAuth();
    await db.saveSetting("placement_stats", JSON.stringify(stats));
    return { success: true };
  });

export const savePlacementStatsFn = async (args: { data: PlacementStatRow[] }) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("reva_setting_placement_stats", JSON.stringify(args.data));
  }
  try {
    return await serverSavePlacementStatsFn(args);
  } catch (e) {
    console.warn("Server save failed, using local persistence:", e);
    return { success: true };
  }
};

export interface BatchPlacementRecord {
  academicYear: string;
  pgcet: number;
  uqmq: number;
  total: number;
  internship: number;
  ftPlacement: number;
}

const DEFAULT_BATCH_RECORDS: BatchPlacementRecord[] = [
  { academicYear: "AY22–24 (FT Batch 1)", pgcet: 3, uqmq: 6, total: 9, internship: 9, ftPlacement: 8 },
  { academicYear: "AY23–25 (FT Batch 2)", pgcet: 19, uqmq: 10, total: 29, internship: 26, ftPlacement: 25 },
  { academicYear: "AY24–26 (FT Batch 3)", pgcet: 18, uqmq: 14, total: 32, internship: 28, ftPlacement: 15 },
  { academicYear: "AY25–27 (FT Batch 4)", pgcet: 21, uqmq: 5, total: 26, internship: 7, ftPlacement: 0 }
];

const serverGetBatchPlacementRecordsFn = createServerFn({ method: "GET" }).handler(async () => {
  const statsStr = await db.getSetting("batch_placement_records");
  if (!statsStr) {
    await db.saveSetting("batch_placement_records", JSON.stringify(DEFAULT_BATCH_RECORDS));
    return DEFAULT_BATCH_RECORDS;
  }
  try {
    return JSON.parse(statsStr) as BatchPlacementRecord[];
  } catch (e) {
    console.error("Failed to parse batch placement records setting:", e);
    return DEFAULT_BATCH_RECORDS;
  }
});

export const getBatchPlacementRecordsFn = async (args?: any) => {
  if (typeof window !== "undefined") {
    const val = localStorage.getItem("reva_setting_batch_placement_records");
    if (val) {
      try {
        return JSON.parse(val);
      } catch (e) {
        console.error(e);
      }
    }
  }
  return await serverGetBatchPlacementRecordsFn(args);
};

const serverSaveBatchPlacementRecordsFn = createServerFn({ method: "POST" })
  .inputValidator((stats: BatchPlacementRecord[]) => stats)
  .handler(async ({ data: stats }) => {
    verifyAuth();
    await db.saveSetting("batch_placement_records", JSON.stringify(stats));
    return { success: true };
  });

export const saveBatchPlacementRecordsFn = async (args: { data: BatchPlacementRecord[] }) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("reva_setting_batch_placement_records", JSON.stringify(args.data));
  }
  try {
    return await serverSaveBatchPlacementRecordsFn(args);
  } catch (e) {
    console.warn("Server save failed, using local persistence:", e);
    return { success: true };
  }
};

// Upload partner logo image
export const uploadPartnerLogoFn = createServerFn({ method: "POST" })
  .inputValidator((d: { slug: string; base64: string; filename: string }) => d)
  .handler(async ({ data }) => {
    verifyAuth();
    const { slug, base64 } = data;
    
    const isCloudflare = typeof globalThis !== "undefined" && (globalThis as any).cloudflareEnv !== undefined;
    if (isCloudflare) {
      console.log("Cloudflare environment: Bypassing local filesystem write for partner logo.");
      return { success: true, filePath: base64 };
    }

    try {
      const parts = base64.split(",");
      const base64Data = parts.length > 1 ? parts[1] : parts[0];
      const buffer = Buffer.from(base64Data, "base64");
      const uploadDir = path.resolve(process.cwd(), "public/uploads/partner-logos");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      const destPath = path.join(uploadDir, `${slug}.png`);
      fs.writeFileSync(destPath, buffer);
      return { success: true, filePath: `/uploads/partner-logos/${slug}.png` };
    } catch (error) {
      console.warn("Write filesystem failed for partner logo, falling back to base64 inline storage:", error);
      return { success: true, filePath: base64 };
    }
  });

export interface ChartDataPoint {
  year: string;
  value: number;
  hasAsterisk?: boolean;
}

export interface DashboardChart {
  id: string;
  title: string;
  color: string;
  footnote1: string;
  footnote2: string;
  data: ChartDataPoint[];
}

const DEFAULT_DASHBOARD_CHARTS: DashboardChart[] = [
  {
    id: "batch_size",
    title: "Total Admitted Students",
    color: "#3b82f6",
    footnote1: "*M.Tech AI & Cybersecurity executive cohorts",
    footnote2: "*REVA University Department of RACE",
    data: [
      { year: "AY22-24", value: 9 },
      { year: "AY23-25", value: 29 },
      { year: "AY24-26", value: 32 },
      { year: "AY25-27", value: 26 }
    ]
  },
  {
    id: "internship_offers",
    title: "Internship Offers",
    color: "#f59e0b",
    footnote1: "*Includes paid corporate executive internships",
    footnote2: "*AY25-27 batch is currently ongoing",
    data: [
      { year: "AY22-24", value: 9 },
      { year: "AY23-25", value: 26 },
      { year: "AY24-26", value: 28 },
      { year: "AY25-27", value: 7, hasAsterisk: true }
    ]
  },
  {
    id: "ft_placements",
    title: "Full-Time Placements",
    color: "#10b981",
    footnote1: "*Lateral executive placement transitions",
    footnote2: "*AY24-26 & AY25-27 placements are ongoing",
    data: [
      { year: "AY22-24", value: 8 },
      { year: "AY23-25", value: 25 },
      { year: "AY24-26", value: 15, hasAsterisk: true },
      { year: "AY25-27", value: 0 }
    ]
  },
  {
    id: "highest_ctc",
    title: "Highest Package Offered (LPA)",
    color: "#FF5900",
    footnote1: "*In Lakhs Per Annum (INR)",
    footnote2: "*Highest compensation package recorded per batch",
    data: [
      { year: "AY22-24", value: 10.00 },
      { year: "AY23-25", value: 39.76 },
      { year: "AY24-26", value: 15.00, hasAsterisk: true },
      { year: "AY25-27", value: 0 }
    ]
  }
];

// Fetch Dashboard Charts
const serverGetDashboardChartsFn = createServerFn({ method: "GET" }).handler(async () => {
  const statsStr = await db.getSetting("placement_charts");
  if (!statsStr || statsStr.includes("11352") || statsStr.includes("8911") || statsStr.includes("companies_visited")) {
    await db.saveSetting("placement_charts", JSON.stringify(DEFAULT_DASHBOARD_CHARTS));
    return DEFAULT_DASHBOARD_CHARTS;
  }
  try {
    return JSON.parse(statsStr) as DashboardChart[];
  } catch (e) {
    console.error("Failed to parse placement charts setting:", e);
    return DEFAULT_DASHBOARD_CHARTS;
  }
});

export const getDashboardChartsFn = async (args?: any) => {
  if (typeof window !== "undefined") {
    const val = localStorage.getItem("reva_setting_placement_charts");
    if (val) {
      try {
        return JSON.parse(val);
      } catch (e) {
        console.error(e);
      }
    }
  }
  return await serverGetDashboardChartsFn(args);
};

// Save Dashboard Charts
const serverSaveDashboardChartsFn = createServerFn({ method: "POST" })
  .inputValidator((stats: DashboardChart[]) => stats)
  .handler(async ({ data: stats }) => {
    verifyAuth();
    await db.saveSetting("placement_charts", JSON.stringify(stats));
    return { success: true };
  });

export const saveDashboardChartsFn = async (args: { data: DashboardChart[] }) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("reva_setting_placement_charts", JSON.stringify(args.data));
  }
  try {
    return await serverSaveDashboardChartsFn(args);
  } catch (e) {
    console.warn("Server save failed, using local persistence:", e);
    return { success: true };
  }
};

// Sync database settings and candidates to static source files for Git push
export const syncToGitFilesFn = createServerFn({ method: "POST" }).handler(async () => {
  verifyAuth();
  await db.syncToSourceFiles();
  return { success: true };
});

export interface PlacementBanner {
  id: string;
  title: string;
  companyName: string;
  imageUrl: string;
}

const DEFAULT_BANNERS: PlacementBanner[] = [
  {
    id: "banner-1",
    title: "Justdial Placement Spotlights",
    companyName: "Justdial",
    imageUrl: "/uploads/banners/media_471d76df-e54a-4730-ac6f-b70e90c7f97f_1780460657287.jpg"
  },
  {
    id: "banner-2",
    title: "IISc Research Placements",
    companyName: "IISc (Indian Institute of Science)",
    imageUrl: "/uploads/banners/media_471d76df-e54a-4730-ac6f-b70e90c7f97f_1780460667117.jpg"
  },
  {
    id: "banner-3",
    title: "AngelOne Placement Spotlights",
    companyName: "AngelOne",
    imageUrl: "/uploads/banners/media_471d76df-e54a-4730-ac6f-b70e90c7f97f_1780460675254.jpg"
  },
  {
    id: "banner-4",
    title: "Masters Placements congratulations",
    companyName: "Reva Placement Cohorts",
    imageUrl: "/uploads/banners/media_471d76df-e54a-4730-ac6f-b70e90c7f97f_1780460682876.jpg"
  },
  {
    id: "banner-5",
    title: "Masters Placements congratulations",
    companyName: "Reva Placement Cohorts",
    imageUrl: "/uploads/banners/media_471d76df-e54a-4730-ac6f-b70e90c7f97f_1780460695796.jpg"
  }
];

// Fetch Placement Banners
const serverGetPlacementBannersFn = createServerFn({ method: "GET" }).handler(async () => {
  const bannersStr = await db.getSetting("placement_banners");
  if (!bannersStr) {
    await db.saveSetting("placement_banners", JSON.stringify(DEFAULT_BANNERS));
    return DEFAULT_BANNERS;
  }
  try {
    return JSON.parse(bannersStr) as PlacementBanner[];
  } catch (e) {
    console.error("Failed to parse placement banners:", e);
    return DEFAULT_BANNERS;
  }
});

export const getPlacementBannersFn = async (args?: any) => {
  if (typeof window !== "undefined") {
    const val = localStorage.getItem("reva_setting_placement_banners");
    if (val) {
      try {
        return JSON.parse(val);
      } catch (e) {
        console.error(e);
      }
    }
  }
  return await serverGetPlacementBannersFn(args);
};

// Save Placement Banners
const serverSavePlacementBannersFn = createServerFn({ method: "POST" })
  .inputValidator((banners: PlacementBanner[]) => banners)
  .handler(async ({ data: banners }) => {
    verifyAuth();
    await db.saveSetting("placement_banners", JSON.stringify(banners));
    return { success: true };
  });

export const savePlacementBannersFn = async (args: { data: PlacementBanner[] }) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("reva_setting_placement_banners", JSON.stringify(args.data));
  }
  try {
    return await serverSavePlacementBannersFn(args);
  } catch (e) {
    console.warn("Server save failed, using local persistence:", e);
    return { success: true };
  }
};

// Upload Placement Banner Image
export const uploadPlacementBannerFn = createServerFn({ method: "POST" })
  .inputValidator((d: { slug: string; base64: string; filename: string }) => d)
  .handler(async ({ data }) => {
    verifyAuth();
    const { slug, base64 } = data;
    
    const isCloudflare = typeof globalThis !== "undefined" && (globalThis as any).cloudflareEnv !== undefined;
    if (isCloudflare) {
      console.log("Cloudflare environment: Bypassing local filesystem write for banner.");
      return { success: true, filePath: base64 };
    }

    try {
      const parts = base64.split(",");
      const base64Data = parts.length > 1 ? parts[1] : parts[0];
      const buffer = Buffer.from(base64Data, "base64");
      const uploadDir = path.resolve(process.cwd(), "public/uploads/banners");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      const destPath = path.join(uploadDir, `${slug}.jpg`);
      fs.writeFileSync(destPath, buffer);
      return { success: true, filePath: `/uploads/banners/${slug}.jpg` };
    } catch (error) {
      console.warn("Write filesystem failed for banner, falling back to base64 inline storage:", error);
      return { success: true, filePath: base64 };
    }
  });
