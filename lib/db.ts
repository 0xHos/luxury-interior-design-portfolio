import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

let db: ReturnType<typeof Database> | null = null;

function getDbPath() {
  // Try project root first, then home directory
  const projectPath = path.join(process.cwd(), "portfolio.db");
  if (fs.existsSync(projectPath)) return projectPath;
  const homePath = path.join(process.env.HOME || "/tmp", "db", "portfolio.db");
  if (fs.existsSync(homePath)) return homePath;
  return projectPath;
}

export function getDb() {
  if (!db) {
    const dbPath = getDbPath();
    db = new Database(dbPath);
    db.pragma("journal_mode = WAL");
  }
  return db;
}

// Types
export interface Project {
  id: number;
  category: string;
  location: string;
  size: string;
  year: number;
  images: string;
  title_en: string;
  title_ar: string;
  description_en: string;
  description_ar: string;
  featured: number;
  created_at: string;
}

export interface Service {
  id: number;
  icon: string;
  title_en: string;
  title_ar: string;
  description_en: string;
  description_ar: string;
  created_at: string;
}

export interface Testimonial {
  id: number;
  name: string;
  review_en: string;
  review_ar: string;
  rating: number;
  created_at: string;
}

export interface Contact {
  id: number;
  name: string;
  email: string;
  message: string;
  read: number;
  created_at: string;
}
