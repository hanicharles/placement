import { students as initialStudents, type Student } from "../data/students";
import path from "path";
import fs from "fs";

const DATA_DIR = path.resolve(process.cwd(), "data");
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const SQLITE_PATH = path.join(DATA_DIR, "students.db");
const JSON_PATH = path.join(DATA_DIR, "students.json");

let dbInstance: any = null;
let useJsonFallback = false;

// Dynamic load of better-sqlite3 to prevent build-time crashes in serverless bundlers
async function getSqliteDb() {
  if (dbInstance || useJsonFallback) return dbInstance;

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
  if (!fs.existsSync(JSON_PATH)) {
    console.log("JSON Database empty. Seeding from students.ts...");
    fs.writeFileSync(JSON_PATH, JSON.stringify(initialStudents, null, 2), "utf-8");
  }
}

function readJsonDb(): Student[] {
  try {
    initializeJsonDb();
    const data = fs.readFileSync(JSON_PATH, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Failed to read JSON DB:", error);
    return initialStudents;
  }
}

function writeJsonDb(data: Student[]) {
  try {
    fs.writeFileSync(JSON_PATH, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error("Failed to write to JSON DB:", error);
  }
}

const SETTINGS_JSON_PATH = path.join(DATA_DIR, "settings.json");

function initializeSettingsJson() {
  if (!fs.existsSync(SETTINGS_JSON_PATH)) {
    fs.writeFileSync(SETTINGS_JSON_PATH, JSON.stringify({}, null, 2), "utf-8");
  }
}

function readSettingsJson(): Record<string, string> {
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
        return;
      } catch (error) {
        console.error("SQLite save failed, falling back to JSON", error);
      }
    }

    // JSON Fallback
    const list = readJsonDb();
    const idx = list.findIndex((item) => item.slug === s.slug);
    if (idx >= 0) {
      list[idx] = s;
    } else {
      list.push(s);
    }
    writeJsonDb(list);
  },

  async deleteStudent(slug: string): Promise<void> {
    const sqlite = await getSqliteDb();
    if (sqlite && !useJsonFallback) {
      try {
        sqlite.prepare("DELETE FROM students WHERE slug = ?").run(slug);
        return;
      } catch (error) {
        console.error("SQLite delete failed, falling back to JSON", error);
      }
    }

    // JSON Fallback
    const list = readJsonDb();
    const filtered = list.filter((s) => s.slug !== slug);
    writeJsonDb(filtered);
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
    if (sqlite && !useJsonFallback) {
      try {
        sqlite.prepare(`
          INSERT INTO settings (key, value) VALUES (?, ?)
          ON CONFLICT(key) DO UPDATE SET value=excluded.value
        `).run(key, value);
        return;
      } catch (error) {
        console.error("SQLite saveSetting failed, falling back to JSON", error);
      }
    }
    const settings = readSettingsJson();
    settings[key] = value;
    writeSettingsJson(settings);
  }
};
