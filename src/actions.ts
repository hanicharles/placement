import { createServerFn } from "@tanstack/react-start";
import { db } from "./server/db";
import { type Student } from "./data/students";
import { getCookie, setCookie, deleteCookie } from "@tanstack/react-start/server";
import path from "path";
import fs from "fs";

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
export const getStudentsFn = createServerFn({ method: "GET" }).handler(async () => {
  return await db.getStudents();
});

// Fetch single student
export const getStudentBySlugFn = createServerFn({ method: "GET" })
  .inputValidator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    return await db.getStudentBySlug(slug);
  });

// Save (create/update) student
export const saveStudentFn = createServerFn({ method: "POST" })
  .inputValidator((student: Student) => student)
  .handler(async ({ data: student }) => {
    verifyAuth();
    await db.saveStudent(student);
    return { success: true };
  });

// Delete student
export const deleteStudentFn = createServerFn({ method: "POST" })
  .inputValidator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    verifyAuth();
    await db.deleteStudent(slug);
    return { success: true };
  });

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
    
    const buffer = Buffer.from(base64.split(",")[1], "base64");
    let publicPath = base64;
    
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
    
    try {
      const buffer = Buffer.from(base64.split(",")[1], "base64");
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
export const getJourneyStatsFn = createServerFn({ method: "GET" }).handler(async () => {
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

// Save journey stats
export const saveJourneyStatsFn = createServerFn({ method: "POST" })
  .inputValidator((stats: any[]) => stats)
  .handler(async ({ data: stats }) => {
    verifyAuth();
    await db.saveSetting("journey_stats", JSON.stringify(stats));
    return { success: true };
  });

export interface Partner {
  name: string;
  category: "Technology & Software" | "Research & Academics" | "Consulting & Finance" | "Cybersecurity & Ops" | "Healthcare & Biotech" | "Engineering & Logistics";
  description: string;
  logoLetter: string;
  themeColor: string;
  logoUrl?: string;
}

const DEFAULT_PARTNERS: Partner[] = [
  {
    name: "AWS Academy",
    category: "Research & Academics",
    description: "Provides cloud computing curriculum and academy resources to prepare students for AWS certifications.",
    logoLetter: "A",
    themeColor: "from-amber-500 to-orange-600"
  },
  {
    name: "Microsoft Azure",
    category: "Research & Academics",
    description: "Enables cloud and academic research through advanced cloud infrastructure, services, and developer tools.",
    logoLetter: "M",
    themeColor: "from-blue-600 to-sky-600"
  },
  {
    name: "EC-Council",
    category: "Cybersecurity & Ops",
    description: "The world's leading cybersecurity technical certification body, providing professional security courses and certifications.",
    logoLetter: "E",
    themeColor: "from-red-600 to-rose-700"
  },
  {
    name: "PurpleSynapz",
    category: "Cybersecurity & Ops",
    description: "A premier cybersecurity lab partner specializing in threat simulations, red-teaming, and hands-on cyber drills.",
    logoLetter: "P",
    themeColor: "from-purple-600 to-indigo-700"
  },
  {
    name: "CloudxLabs",
    category: "Technology & Software",
    description: "An online learning platform providing hands-on labs and sandboxes for DevOps, Cloud, AI, and Big Data.",
    logoLetter: "C",
    themeColor: "from-sky-500 to-blue-600"
  },
  {
    name: "Deevia Software",
    category: "Technology & Software",
    description: "Specializes in AI-driven image processing, computer vision applications, and enterprise software engineering.",
    logoLetter: "D",
    themeColor: "from-blue-500 to-indigo-600"
  },
  {
    name: "Merck - Sigma Aldrich Chemicals",
    category: "Healthcare & Biotech",
    description: "A leading global life science and technology company providing chemicals, lab materials, and bio-pharmaceutical solutions.",
    logoLetter: "M",
    themeColor: "from-emerald-500 to-teal-600"
  },
  {
    name: "IISc (Indian Institute of Science)",
    category: "Research & Academics",
    description: "India's premier research institution renowned globally for advanced scientific and technological research and education.",
    logoLetter: "I",
    themeColor: "from-amber-500 to-orange-600"
  },
  {
    name: "Continental",
    category: "Engineering & Logistics",
    description: "A pioneer in automotive technology, smart mobility infrastructure, and advanced embedded systems engineering.",
    logoLetter: "C",
    themeColor: "from-slate-600 to-slate-800"
  },
  {
    name: "Enhancesys Innovation",
    category: "Technology & Software",
    description: "Develops advanced IoT automation systems, cloud security telemetry, and network operations solutions.",
    logoLetter: "E",
    themeColor: "from-cyan-500 to-blue-600"
  },
  {
    name: "Vconnex Pvt. Ltd",
    category: "Technology & Software",
    description: "Delivers end-to-end IT consulting, custom software architectures, and digital transformation solutions.",
    logoLetter: "V",
    themeColor: "from-rose-500 to-pink-600"
  },
  {
    name: "Grant Thornton",
    category: "Consulting & Finance",
    description: "A leading global professional services network providing audit, tax, advisory, and corporate compliance services.",
    logoLetter: "G",
    themeColor: "from-purple-600 to-violet-700"
  },
  {
    name: "Senseops Tech Solutions",
    category: "Cybersecurity & Ops",
    description: "Specializes in intelligent log analysis, threat intelligence modeling, and SOC automation solutions.",
    logoLetter: "S",
    themeColor: "from-red-500 to-rose-600"
  },
  {
    name: "66degrees",
    category: "Technology & Software",
    description: "An elite Google Cloud Premier Partner focused on AI integration, big data analytics, and cloud modernization.",
    logoLetter: "6",
    themeColor: "from-sky-500 to-indigo-500"
  },
  {
    name: "Virtually Testing Foundation",
    category: "Cybersecurity & Ops",
    description: "A premier non-profit organization offering cybersecurity internships, lab testing, and vulnerability assessments.",
    logoLetter: "T",
    themeColor: "from-emerald-600 to-teal-700"
  },
  {
    name: "Terralogic",
    category: "Technology & Software",
    description: "Provides full-stack engineering, comprehensive cybersecurity operations, and digital infrastructure support.",
    logoLetter: "T",
    themeColor: "from-indigo-500 to-blue-700"
  },
  {
    name: "Cytrusst",
    category: "Cybersecurity & Ops",
    description: "Specializes in governance, risk assessment, corporate information security auditing, and compliance.",
    logoLetter: "C",
    themeColor: "from-purple-500 to-indigo-600"
  },
  {
    name: "Ecolab",
    category: "Healthcare & Biotech",
    description: "The global leader in water, hygiene, and infection prevention solutions and services.",
    logoLetter: "E",
    themeColor: "from-blue-600 to-sky-600"
  },
  {
    name: "Saint Gobain",
    category: "Engineering & Logistics",
    description: "Designs, manufactures, and distributes high-performance materials and solutions for industrial applications.",
    logoLetter: "S",
    themeColor: "from-stone-500 to-stone-700"
  },
  {
    name: "Cybrisk",
    category: "Cybersecurity & Ops",
    description: "Focuses on active threat mitigation, incident response pipelines, and cybersecurity threat profiling.",
    logoLetter: "C",
    themeColor: "from-red-600 to-orange-600"
  },
  {
    name: "Visiminds",
    category: "Engineering & Logistics",
    description: "Develops advanced computer vision models and monocular lane hazard anticipation systems.",
    logoLetter: "V",
    themeColor: "from-violet-500 to-purple-600"
  },
  {
    name: "Tsaaro",
    category: "Cybersecurity & Ops",
    description: "A leading data privacy consulting firm specializing in GDPR, HIPAA, and custom compliance audits.",
    logoLetter: "T",
    themeColor: "from-orange-500 to-amber-600"
  },
  {
    name: "LKQ India Private Limited",
    category: "Engineering & Logistics",
    description: "A leading distributor of alternative and specialty automotive parts and diagnostic components.",
    logoLetter: "L",
    themeColor: "from-slate-500 to-slate-700"
  },
  {
    name: "Swiss Re",
    category: "Consulting & Finance",
    description: "One of the world's leading providers of reinsurance, insurance-based risk transfer, and actuarial modeling.",
    logoLetter: "S",
    themeColor: "from-cyan-600 to-blue-700"
  },
  {
    name: "Endpoint E Clinical India Private Limited",
    category: "Healthcare & Biotech",
    description: "Develops interactive clinical trial software and secure data management pipelines for healthcare providers.",
    logoLetter: "E",
    themeColor: "from-emerald-500 to-green-600"
  },
  {
    name: "Cyberium Labs",
    category: "Cybersecurity & Ops",
    description: "Specializes in secure ledger technologies, advanced cryptography, and decentralized identity proofing.",
    logoLetter: "C",
    themeColor: "from-rose-600 to-red-700"
  },
  {
    name: "iCompaas",
    category: "Cybersecurity & Ops",
    description: "An automated cloud security and compliance platform optimizing configurations for multi-cloud environments.",
    logoLetter: "I",
    themeColor: "from-amber-600 to-yellow-600"
  },
  {
    name: "EY (Ernst & Young)",
    category: "Consulting & Finance",
    description: "A global leader in assurance, consulting, strategy, transactions, and corporate advisory services.",
    logoLetter: "E",
    themeColor: "from-yellow-500 to-amber-500"
  },
  {
    name: "AngelOne",
    category: "Consulting & Finance",
    description: "A prominent technology-led financial services brokerage and digital investment platform.",
    logoLetter: "A",
    themeColor: "from-indigo-600 to-violet-600"
  },
  {
    name: "Skyworks Solutions",
    category: "Engineering & Logistics",
    description: "An innovator of high-performance analog semiconductors connecting wireless infrastructure and devices.",
    logoLetter: "S",
    themeColor: "from-sky-600 to-blue-800"
  },
  {
    name: "Zillion Technologies",
    category: "Technology & Software",
    description: "Offers global digital transformation consultation, systems integration, and software engineering services.",
    logoLetter: "Z",
    themeColor: "from-pink-500 to-purple-600"
  },
  {
    name: "Siemens Healthcare",
    category: "Healthcare & Biotech",
    description: "A global medical technology pioneer delivering state-of-the-art diagnostic imaging and clinical software.",
    logoLetter: "S",
    themeColor: "from-teal-600 to-cyan-700"
  },
  {
    name: "Alxplora Technologies",
    category: "Technology & Software",
    description: "Delivers data-driven product analytics, machine learning prototypes, and custom business intelligence dashboards.",
    logoLetter: "A",
    themeColor: "from-stone-600 to-stone-800"
  }
];

// Fetch Hiring Partners
export const getHiringPartnersFn = createServerFn({ method: "GET" }).handler(async () => {
  const partnersStr = await db.getSetting("hiring_partners");
  if (!partnersStr) {
    // Seed database setting if missing
    await db.saveSetting("hiring_partners", JSON.stringify(DEFAULT_PARTNERS));
    return DEFAULT_PARTNERS;
  }
  try {
    return JSON.parse(partnersStr) as Partner[];
  } catch (e) {
    console.error("Failed to parse hiring partners setting:", e);
    return DEFAULT_PARTNERS;
  }
});

// Save Hiring Partners
export const saveHiringPartnersFn = createServerFn({ method: "POST" })
  .inputValidator((partners: Partner[]) => partners)
  .handler(async ({ data: partners }) => {
    verifyAuth();
    await db.saveSetting("hiring_partners", JSON.stringify(partners));
    return { success: true };
  });

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
export const getPlacementStatsFn = createServerFn({ method: "GET" }).handler(async () => {
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

// Save Placement Stats
export const savePlacementStatsFn = createServerFn({ method: "POST" })
  .inputValidator((stats: PlacementStatRow[]) => stats)
  .handler(async ({ data: stats }) => {
    verifyAuth();
    await db.saveSetting("placement_stats", JSON.stringify(stats));
    return { success: true };
  });

// Upload partner logo image
export const uploadPartnerLogoFn = createServerFn({ method: "POST" })
  .inputValidator((d: { slug: string; base64: string; filename: string }) => d)
  .handler(async ({ data }) => {
    verifyAuth();
    const { slug, base64 } = data;
    
    try {
      const buffer = Buffer.from(base64.split(",")[1], "base64");
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
    id: "companies_visited",
    title: "Companies Visited",
    color: "#3b82f6",
    footnote1: "*As on 27th Mar 2026",
    footnote2: "*Internship and Placement for REVA University campuses",
    data: [
      { year: "2021", value: 844 },
      { year: "2022", value: 975 },
      { year: "2023", value: 945 },
      { year: "2024", value: 873 },
      { year: "2025", value: 1079 },
      { year: "2026", value: 742, hasAsterisk: true }
    ]
  },
  {
    id: "students_placed",
    title: "Students Placed",
    color: "#2563eb",
    footnote1: "*As on 27th Mar 2026",
    footnote2: "*Internship and Placement for REVA University campuses",
    data: [
      { year: "2021", value: 5609 },
      { year: "2022", value: 7683 },
      { year: "2023", value: 8938 },
      { year: "2024", value: 7586 },
      { year: "2025", value: 11352 },
      { year: "2026", value: 8911, hasAsterisk: true }
    ]
  },
  {
    id: "super_dream_offers",
    title: "Super Dream Offers",
    color: "#10b981",
    footnote1: "*As on 27th Mar 2026",
    footnote2: "*Internship and Placement for REVA University campuses",
    data: [
      { year: "2021", value: 1176 },
      { year: "2022", value: 3419 },
      { year: "2023", value: 4480 },
      { year: "2024", value: 3369 },
      { year: "2025", value: 3647 },
      { year: "2026", value: 3097, hasAsterisk: true }
    ]
  },
  {
    id: "dream_offers",
    title: "Dream Offers",
    color: "#22c55e",
    footnote1: "*As on 27th Mar 2026",
    footnote2: "*Internship and Placement for REVA University campuses",
    data: [
      { year: "2021", value: 2186 },
      { year: "2022", value: 4660 },
      { year: "2023", value: 3531 },
      { year: "2024", value: 3429 },
      { year: "2025", value: 3954 },
      { year: "2026", value: 2917, hasAsterisk: true }
    ]
  }
];

// Fetch Dashboard Charts
export const getDashboardChartsFn = createServerFn({ method: "GET" }).handler(async () => {
  const statsStr = await db.getSetting("placement_charts");
  if (!statsStr) {
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

// Save Dashboard Charts
export const saveDashboardChartsFn = createServerFn({ method: "POST" })
  .inputValidator((stats: DashboardChart[]) => stats)
  .handler(async ({ data: stats }) => {
    verifyAuth();
    await db.saveSetting("placement_charts", JSON.stringify(stats));
    return { success: true };
  });
