import { students as initialStudents, type Student } from "../data/students";
import initialSettings from "../data/settings.json";
import path from "path";
import fs from "fs";

const DATA_DIR = path.resolve(process.cwd(), "data");
const SQLITE_PATH = path.join(DATA_DIR, "students.db");
const JSON_PATH = path.join(DATA_DIR, "students.json");
const SETTINGS_JSON_PATH = path.join(DATA_DIR, "settings.json");

let isReadOnlyFileSystem = false;

// Global in-memory fallback cache for read-only environments (like Cloudflare Workers)
let memoryStudents: Student[] = [...initialStudents];
let memorySettings = new Map<string, string>();

try {
  if (initialSettings) {
    Object.entries(initialSettings).forEach(([k, v]) => {
      memorySettings.set(k, typeof v === "string" ? v : JSON.stringify(v));
    });
  }
} catch (e) {
  console.warn("Failed to initialize memorySettings from settings.json", e);
}

try {
  if (fs && typeof fs.existsSync === "function") {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } else {
    isReadOnlyFileSystem = true;
  }
} catch (e) {
  console.warn("Read-only filesystem detected or fs is unavailable. Using in-memory fallback.", e);
  isReadOnlyFileSystem = true;
}

let dbInstance: any = null;
let useJsonFallback = false;

// Write helpers to synchronize data to static files for local Git push
function writeToSourceStudents(studentsList: Student[]) {
  if (isReadOnlyFileSystem) return;
  try {
    const filePath = path.resolve(process.cwd(), "src/data/students.ts");
    const content = `export type Specialization = "Cybersecurity" | "Artificial Intelligence";
export type Gender = "Male" | "Female";

export interface EducationItem {
  institute: string;
  degree: string;
  period: string;
  cgpa?: string;
}

export interface WorkItem {
  role: string;
  company: string;
  period?: string;
  bullets: string[];
}

export interface ProjectItem {
  title: string;
  tag?: string;
  bullets: string[];
}

export interface SkillGroup {
  category: string;
  items: string[];
}

export interface Student {
  slug: string;
  name: string;
  headline: string;
  specialization: Specialization;
  gender: Gender;
  location?: string;
  phone?: string;
  email?: string;
  collegeEmail?: string;
  linkedin?: string;
  github?: string;
  photo?: string;
  resume?: string;
  about: string;
  education: EducationItem[];
  certifications: string[];
  skills: SkillGroup[];
  workExperience?: WorkItem[];
  projects: ProjectItem[];
  publications?: string[];
  programDates?: string;
  placement?: {
    company: string;
    role: string;
  };
}

export const students: Student[] = ${JSON.stringify(studentsList, null, 2)};
`;
    fs.writeFileSync(filePath, content, "utf-8");
    console.log("Successfully synchronized src/data/students.ts with latest candidate data.");
  } catch (error) {
    console.warn("Failed to synchronize src/data/students.ts:", error);
  }
}

function writeToSourceSettings() {
  if (isReadOnlyFileSystem) return;
  try {
    const filePath = path.resolve(process.cwd(), "src/data/settings.json");
    const settingsObj: Record<string, any> = {};
    
    let loaded = false;
    if (dbInstance && !useJsonFallback) {
      try {
        const rows = dbInstance.prepare("SELECT * FROM settings").all() as any[];
        for (const r of rows) {
          try {
            settingsObj[r.key] = JSON.parse(r.value);
          } catch {
            settingsObj[r.key] = r.value;
          }
        }
        loaded = true;
      } catch (e) {
        console.warn("Failed to read settings from SQLite for sync:", e);
      }
    }
    
    if (!loaded) {
      memorySettings.forEach((v, k) => {
        try {
          settingsObj[k] = JSON.parse(v);
        } catch {
          settingsObj[k] = v;
        }
      });
    }
    
    fs.writeFileSync(filePath, JSON.stringify(settingsObj, null, 2), "utf-8");
    console.log("Successfully synchronized src/data/settings.json with latest settings.");
  } catch (error) {
    console.warn("Failed to synchronize src/data/settings.json:", error);
  }
}

// Dynamic load of better-sqlite3 to prevent build-time crashes in serverless bundlers
async function getSqliteDb() {
  if (dbInstance || useJsonFallback) return dbInstance;
  if (isReadOnlyFileSystem) {
    useJsonFallback = true;
    return null;
  }

  try {
    const Database = (await import("better-sqlite3")).default;
    const db = new Database(SQLITE_PATH);
    
    // Create students table if it doesn't exist
    db.exec(`
      CREATE TABLE IF NOT EXISTS students (
        slug TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        headline TEXT NOT NULL,
        specialization TEXT NOT NULL,
        gender TEXT NOT NULL,
        location TEXT,
        phone TEXT,
        email TEXT,
        collegeEmail TEXT,
        linkedin TEXT,
        github TEXT,
        photo TEXT,
        resume TEXT,
        about TEXT NOT NULL,
        education TEXT,
        certifications TEXT,
        skills TEXT,
        workExperience TEXT,
        projects TEXT,
        publications TEXT,
        programDates TEXT,
        placement TEXT
      )
    `);

    // Create settings table if it doesn't exist
    db.exec(`
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
      )
    `);

    dbInstance = db;
    console.log("Database initialized successfully with SQLite at", SQLITE_PATH);
    
    // Seed if table is empty
    const countRow = db.prepare("SELECT COUNT(*) as count FROM students").get() as { count: number };
    if (countRow.count === 0) {
      console.log("SQLite Database empty. Seeding from students.ts...");
      const insert = db.prepare(`
        INSERT INTO students (
          slug, name, headline, specialization, gender, location, phone, email, collegeEmail,
          linkedin, github, photo, resume, about, education, certifications, skills,
          workExperience, projects, publications, programDates, placement
        ) VALUES (
          ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
        )
      `);

      const transaction = db.transaction((list: Student[]) => {
        for (const s of list) {
          insert.run(
            s.slug,
            s.name,
            s.headline,
            s.specialization,
            s.gender,
            s.location || null,
            s.phone || null,
            s.email || null,
            s.collegeEmail || null,
            s.linkedin || null,
            s.github || null,
            s.photo || null,
            s.resume || null,
            s.about,
            JSON.stringify(s.education || []),
            JSON.stringify(s.certifications || []),
            JSON.stringify(s.skills || []),
            JSON.stringify(s.workExperience || []),
            JSON.stringify(s.projects || []),
            JSON.stringify(s.publications || []),
            s.programDates || null,
            s.placement ? JSON.stringify(s.placement) : null
          );
        }
      });
      transaction(initialStudents);
      console.log(`Seeded ${initialStudents.length} candidates into SQLite.`);
    }

    // Seed any missing settings keys from settings.json
    console.log("Synchronizing SQLite Settings from settings.json...");
    const insertSetting = db.prepare("INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)");
    const transaction = db.transaction((settingsObj: Record<string, any>) => {
      for (const [k, v] of Object.entries(settingsObj)) {
        insertSetting.run(k, typeof v === "string" ? v : JSON.stringify(v));
      }
    });
    transaction(initialSettings);
    console.log("Seeded missing settings into SQLite.");
    
    return dbInstance;
  } catch (error) {
    console.warn("better-sqlite3 failed to initialize, falling back to JSON storage.", error);
    useJsonFallback = true;
    initializeJsonDb();
    return null;
  }
}

// Fallback JSON-based Storage
function initializeJsonDb() {
  if (isReadOnlyFileSystem) return;
  try {
    if (fs && typeof fs.existsSync === "function" && !fs.existsSync(JSON_PATH)) {
      console.log("JSON Database empty. Seeding from students.ts...");
      fs.writeFileSync(JSON_PATH, JSON.stringify(initialStudents, null, 2), "utf-8");
    }
  } catch (error) {
    console.warn("Failed to initialize JSON DB file:", error);
  }
}

function readJsonDb(): Student[] {
  if (isReadOnlyFileSystem) {
    return memoryStudents;
  }
  try {
    initializeJsonDb();
    const data = fs.readFileSync(JSON_PATH, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Failed to read JSON DB:", error);
    return memoryStudents;
  }
}

function writeJsonDb(data: Student[]) {
  memoryStudents = data;
  if (isReadOnlyFileSystem) return;
  try {
    fs.writeFileSync(JSON_PATH, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error("Failed to write to JSON DB:", error);
  }
}

function initializeSettingsJson() {
  if (isReadOnlyFileSystem) return;
  try {
    if (fs && typeof fs.existsSync === "function" && !fs.existsSync(SETTINGS_JSON_PATH)) {
      fs.writeFileSync(SETTINGS_JSON_PATH, JSON.stringify({}, null, 2), "utf-8");
    }
  } catch (error) {
    console.warn("Failed to initialize settings JSON file:", error);
  }
}

function readSettingsJson(): Record<string, string> {
  if (isReadOnlyFileSystem) {
    const obj: Record<string, string> = {};
    memorySettings.forEach((v, k) => {
      obj[k] = v;
    });
    return obj;
  }
  try {
    initializeSettingsJson();
    const data = fs.readFileSync(SETTINGS_JSON_PATH, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Failed to read Settings JSON DB:", error);
    return {};
  }
}

function writeSettingsJson(data: Record<string, string>) {
  Object.entries(data).forEach(([k, v]) => {
    memorySettings.set(k, v);
  });
  if (isReadOnlyFileSystem) return;
  try {
    fs.writeFileSync(SETTINGS_JSON_PATH, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error("Failed to write to Settings JSON DB:", error);
  }
}

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Unified Database API
export const db = {
  async getStudents(): Promise<Student[]> {
    const sqlite = await getSqliteDb();
    if (sqlite && !useJsonFallback) {
      try {
        const rows = sqlite.prepare("SELECT * FROM students ORDER BY name ASC").all() as any[];
        return rows.map((r) => ({
          slug: r.slug,
          name: r.name,
          headline: r.headline,
          specialization: r.specialization,
          gender: r.gender,
          location: r.location || undefined,
          phone: r.phone || undefined,
          email: r.email || undefined,
          collegeEmail: r.collegeEmail || undefined,
          linkedin: r.linkedin || undefined,
          github: r.github || undefined,
          photo: r.photo || undefined,
          resume: r.resume || undefined,
          about: r.about,
          education: JSON.parse(r.education || "[]"),
          certifications: JSON.parse(r.certifications || "[]"),
          skills: JSON.parse(r.skills || "[]"),
          workExperience: JSON.parse(r.workExperience || "[]"),
          projects: JSON.parse(r.projects || "[]"),
          publications: JSON.parse(r.publications || "[]"),
          programDates: r.programDates || undefined,
          placement: r.placement ? JSON.parse(r.placement) : undefined,
        }));
      } catch (error) {
        console.error("SQLite read failed, falling back to JSON", error);
      }
    }
    
    // JSON Fallback
    return readJsonDb().sort((a, b) => a.name.localeCompare(b.name));
  },

  async getStudentBySlug(slug: string): Promise<Student | null> {
    const sqlite = await getSqliteDb();
    if (sqlite && !useJsonFallback) {
      try {
        const r = sqlite.prepare("SELECT * FROM students WHERE slug = ?").get(slug) as any;
        if (!r) return null;
        return {
          slug: r.slug,
          name: r.name,
          headline: r.headline,
          specialization: r.specialization,
          gender: r.gender,
          location: r.location || undefined,
          phone: r.phone || undefined,
          email: r.email || undefined,
          collegeEmail: r.collegeEmail || undefined,
          linkedin: r.linkedin || undefined,
          github: r.github || undefined,
          photo: r.photo || undefined,
          resume: r.resume || undefined,
          about: r.about,
          education: JSON.parse(r.education || "[]"),
          certifications: JSON.parse(r.certifications || "[]"),
          skills: JSON.parse(r.skills || "[]"),
          workExperience: JSON.parse(r.workExperience || "[]"),
          projects: JSON.parse(r.projects || "[]"),
          publications: JSON.parse(r.publications || "[]"),
          programDates: r.programDates || undefined,
          placement: r.placement ? JSON.parse(r.placement) : undefined,
        };
      } catch (error) {
        console.error("SQLite query by slug failed, falling back to JSON", error);
      }
    }

    // JSON Fallback
    const list = readJsonDb();
    return list.find((s) => s.slug === slug) || null;
  },

  async saveStudent(s: Student): Promise<void> {
    if (!s.slug) {
      s.slug = slugify(s.name);
    }

    const sqlite = await getSqliteDb();
    let saved = false;
    if (sqlite && !useJsonFallback) {
      try {
        sqlite.prepare(`
          INSERT INTO students (
            slug, name, headline, specialization, gender, location, phone, email, collegeEmail,
            linkedin, github, photo, resume, about, education, certifications, skills,
            workExperience, projects, publications, programDates, placement
          ) VALUES (
            ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
          )
          ON CONFLICT(slug) DO UPDATE SET
            name=excluded.name,
            headline=excluded.headline,
            specialization=excluded.specialization,
            gender=excluded.gender,
            location=excluded.location,
            phone=excluded.phone,
            email=excluded.email,
            collegeEmail=excluded.collegeEmail,
            linkedin=excluded.linkedin,
            github=excluded.github,
            photo=excluded.photo,
            resume=excluded.resume,
            about=excluded.about,
            education=excluded.education,
            certifications=excluded.certifications,
            skills=excluded.skills,
            workExperience=excluded.workExperience,
            projects=excluded.projects,
            publications=excluded.publications,
            programDates=excluded.programDates,
            placement=excluded.placement
        `).run(
          s.slug,
          s.name,
          s.headline,
          s.specialization,
          s.gender,
          s.location || null,
          s.phone || null,
          s.email || null,
          s.collegeEmail || null,
          s.linkedin || null,
          s.github || null,
          s.photo || null,
          s.resume || null,
          s.about,
          JSON.stringify(s.education || []),
          JSON.stringify(s.certifications || []),
          JSON.stringify(s.skills || []),
          JSON.stringify(s.workExperience || []),
          JSON.stringify(s.projects || []),
          JSON.stringify(s.publications || []),
          s.programDates || null,
          s.placement ? JSON.stringify(s.placement) : null
        );
        saved = true;
      } catch (error) {
        console.error("SQLite save failed, falling back to JSON", error);
      }
    }

    if (!saved) {
      // JSON Fallback
      const list = readJsonDb();
      const idx = list.findIndex((item) => item.slug === s.slug);
      if (idx >= 0) {
        list[idx] = s;
      } else {
        list.push(s);
      }
      writeJsonDb(list);
    }
  },

  async deleteStudent(slug: string): Promise<void> {
    const sqlite = await getSqliteDb();
    let deleted = false;
    if (sqlite && !useJsonFallback) {
      try {
        sqlite.prepare("DELETE FROM students WHERE slug = ?").run(slug);
        deleted = true;
      } catch (error) {
        console.error("SQLite delete failed, falling back to JSON", error);
      }
    }

    if (!deleted) {
      // JSON Fallback
      const list = readJsonDb();
      const filtered = list.filter((s) => s.slug !== slug);
      writeJsonDb(filtered);
    }
  },

  async getSetting(key: string, defaultValue: string = ""): Promise<string> {
    const sqlite = await getSqliteDb();
    if (sqlite && !useJsonFallback) {
      try {
        const r = sqlite.prepare("SELECT value FROM settings WHERE key = ?").get(key) as any;
        return r ? r.value : defaultValue;
      } catch (error) {
        console.error("SQLite getSetting failed, falling back to JSON", error);
      }
    }
    const settings = readSettingsJson();
    return settings[key] !== undefined ? settings[key] : defaultValue;
  },

  async saveSetting(key: string, value: string): Promise<void> {
    const sqlite = await getSqliteDb();
    let saved = false;
    if (sqlite && !useJsonFallback) {
      try {
        sqlite.prepare(`
          INSERT INTO settings (key, value) VALUES (?, ?)
          ON CONFLICT(key) DO UPDATE SET value=excluded.value
        `).run(key, value);
        saved = true;
      } catch (error) {
        console.error("SQLite saveSetting failed, falling back to JSON", error);
      }
    }

    // Update in-memory map
    memorySettings.set(key, value);

    if (!saved) {
      const settings = readSettingsJson();
      settings[key] = value;
      writeSettingsJson(settings);
    }
  },

  async syncToSourceFiles(): Promise<void> {
    if (isReadOnlyFileSystem) return;
    try {
      const allStudents = await this.getStudents();
      writeToSourceStudents(allStudents);
      writeToSourceSettings();
      console.log("Successfully batch-synchronized both students.ts and settings.json source files.");
    } catch (e) {
      console.error("Failed to sync to source files:", e);
      throw e;
    }
  }
};
