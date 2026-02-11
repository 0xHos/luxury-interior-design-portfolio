import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

// Find writable directory
const homeDir = process.env.HOME || "/tmp";
const dbDir = path.join(homeDir, "db");
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}
const dbPath = path.join(dbDir, "portfolio.db");
console.log("Database path:", dbPath);

const db = new Database(dbPath);
db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category TEXT NOT NULL,
    location TEXT,
    size TEXT,
    year INTEGER,
    images TEXT DEFAULT '[]',
    title_en TEXT NOT NULL,
    title_ar TEXT NOT NULL,
    description_en TEXT,
    description_ar TEXT,
    featured INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS services (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    icon TEXT NOT NULL,
    title_en TEXT NOT NULL,
    title_ar TEXT NOT NULL,
    description_en TEXT,
    description_ar TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS testimonials (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    review_en TEXT NOT NULL,
    review_ar TEXT NOT NULL,
    rating INTEGER DEFAULT 5,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    read INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

const projectCount = db.prepare("SELECT COUNT(*) as count FROM projects").get();
if (projectCount.count === 0) {
  const insertProject = db.prepare(`
    INSERT INTO projects (category, location, size, year, images, title_en, title_ar, description_en, description_ar, featured)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const projects = [
    ["residential", "Dubai, UAE", "450 sqm", 2024, JSON.stringify(["/images/projects/project1.jpg"]), "The Pearl Villa", "\u0641\u064A\u0644\u0627 \u0627\u0644\u0644\u0624\u0644\u0624\u0629", "A stunning waterfront villa combining contemporary design with traditional Arabian elements. Floor-to-ceiling windows frame panoramic sea views while curated materials create warmth throughout.", "\u0641\u064A\u0644\u0627 \u0633\u0627\u062D\u0644\u064A\u0629 \u0645\u0630\u0647\u0644\u0629 \u062A\u062C\u0645\u0639 \u0628\u064A\u0646 \u0627\u0644\u062A\u0635\u0645\u064A\u0645 \u0627\u0644\u0645\u0639\u0627\u0635\u0631 \u0648\u0627\u0644\u0639\u0646\u0627\u0635\u0631 \u0627\u0644\u0639\u0631\u0628\u064A\u0629 \u0627\u0644\u062A\u0642\u0644\u064A\u062F\u064A\u0629.", 1],
    ["commercial", "Riyadh, KSA", "1200 sqm", 2023, JSON.stringify(["/images/projects/project2.jpg"]), "Oasis Tower Lobby", "\u0644\u0648\u0628\u064A \u0628\u0631\u062C \u0627\u0644\u0648\u0627\u062D\u0629", "An executive lobby that redefines corporate luxury. Natural stone, brass accents, and living green walls create an unforgettable first impression.", "\u0644\u0648\u0628\u064A \u062A\u0646\u0641\u064A\u0630\u064A \u064A\u0639\u064A\u062F \u062A\u0639\u0631\u064A\u0641 \u0627\u0644\u0641\u062E\u0627\u0645\u0629 \u0627\u0644\u0645\u0624\u0633\u0633\u064A\u0629.", 1],
    ["residential", "Abu Dhabi, UAE", "320 sqm", 2024, JSON.stringify(["/images/projects/project3.jpg"]), "Saadiyat Penthouse", "\u0628\u0646\u062A\u0647\u0627\u0648\u0633 \u0627\u0644\u0633\u0639\u062F\u064A\u0627\u062A", "A penthouse retreat where minimalism meets opulence. Custom Italian furnishings, art-gallery lighting, and a wraparound terrace with island views.", "\u0645\u0644\u0627\u0630 \u0628\u0646\u062A\u0647\u0627\u0648\u0633 \u062D\u064A\u062B \u064A\u0644\u062A\u0642\u064A \u0627\u0644\u062D\u062F \u0627\u0644\u0623\u062F\u0646\u0649 \u0628\u0627\u0644\u0641\u062E\u0627\u0645\u0629.", 1],
    ["hospitality", "Doha, Qatar", "800 sqm", 2023, JSON.stringify(["/images/projects/project4.jpg"]), "Amber Restaurant", "\u0645\u0637\u0639\u0645 \u0639\u0646\u0628\u0631", "Fine dining interiors inspired by the golden hues of the desert.", "\u062A\u0635\u0645\u064A\u0645\u0627\u062A \u062F\u0627\u062E\u0644\u064A\u0629 \u0644\u0644\u0645\u0637\u0627\u0639\u0645 \u0627\u0644\u0641\u0627\u062E\u0631\u0629 \u0645\u0633\u062A\u0648\u062D\u0627\u0629 \u0645\u0646 \u0623\u0644\u0648\u0627\u0646 \u0627\u0644\u0635\u062D\u0631\u0627\u0621 \u0627\u0644\u0630\u0647\u0628\u064A\u0629.", 0],
    ["residential", "Jeddah, KSA", "600 sqm", 2024, JSON.stringify(["/images/projects/project5.jpg"]), "Al Hamra Estate", "\u0639\u0642\u0627\u0631 \u0627\u0644\u062D\u0645\u0631\u0627\u0621", "A family estate marrying heritage architecture with modern comfort.", "\u0639\u0642\u0627\u0631 \u0639\u0627\u0626\u0644\u064A \u064A\u0632\u0627\u0648\u062C \u0628\u064A\u0646 \u0627\u0644\u0639\u0645\u0627\u0631\u0629 \u0627\u0644\u062A\u0631\u0627\u062B\u064A\u0629 \u0648\u0627\u0644\u0631\u0627\u062D\u0629 \u0627\u0644\u062D\u062F\u064A\u062B\u0629.", 1],
    ["commercial", "Manama, Bahrain", "500 sqm", 2023, JSON.stringify(["/images/projects/project6.jpg"]), "Serenity Spa", "\u0633\u0628\u0627 \u0627\u0644\u0633\u0643\u064A\u0646\u0629", "A wellness sanctuary designed to calm the senses.", "\u0645\u0644\u0627\u0630 \u0635\u062D\u064A \u0645\u0635\u0645\u0645 \u0644\u062A\u0647\u062F\u0626\u0629 \u0627\u0644\u062D\u0648\u0627\u0633.", 0],
  ];

  for (const p of projects) {
    insertProject.run(...p);
  }

  const insertService = db.prepare(`
    INSERT INTO services (icon, title_en, title_ar, description_en, description_ar)
    VALUES (?, ?, ?, ?, ?)
  `);

  const services = [
    ["Palette", "Interior Design", "\u0627\u0644\u062A\u0635\u0645\u064A\u0645 \u0627\u0644\u062F\u0627\u062E\u0644\u064A", "Full-service interior design from concept to completion. We craft bespoke environments that reflect your lifestyle and aspirations.", "\u062A\u0635\u0645\u064A\u0645 \u062F\u0627\u062E\u0644\u064A \u0645\u062A\u0643\u0627\u0645\u0644 \u0645\u0646 \u0627\u0644\u0645\u0641\u0647\u0648\u0645 \u0625\u0644\u0649 \u0627\u0644\u0625\u0646\u062C\u0627\u0632."],
    ["Building2", "Space Planning", "\u062A\u062E\u0637\u064A\u0637 \u0627\u0644\u0645\u0633\u0627\u062D\u0627\u062A", "Strategic spatial layouts that maximize functionality while maintaining aesthetic harmony and flow.", "\u062A\u062E\u0637\u064A\u0637\u0627\u062A \u0645\u0643\u0627\u0646\u064A\u0629 \u0627\u0633\u062A\u0631\u0627\u062A\u064A\u062C\u064A\u0629 \u062A\u0639\u0638\u0645 \u0627\u0644\u0648\u0638\u0627\u0626\u0641."],
    ["Lightbulb", "Lighting Design", "\u062A\u0635\u0645\u064A\u0645 \u0627\u0644\u0625\u0636\u0627\u0621\u0629", "Curated lighting schemes that enhance atmosphere, highlight architectural features, and set the perfect mood.", "\u0645\u062E\u0637\u0637\u0627\u062A \u0625\u0636\u0627\u0621\u0629 \u0645\u0646\u0633\u0642\u0629 \u062A\u0639\u0632\u0632 \u0627\u0644\u0623\u062C\u0648\u0627\u0621."],
  ];

  for (const s of services) {
    insertService.run(...s);
  }

  const insertTestimonial = db.prepare(`
    INSERT INTO testimonials (name, review_en, review_ar, rating)
    VALUES (?, ?, ?, ?)
  `);

  const testimonials = [
    ["Sarah Al-Rashid", "They transformed our villa into a masterpiece. Every detail was considered, from the custom furniture to the lighting design. Truly exceptional work.", "\u0644\u0642\u062F \u062D\u0648\u0644\u0648\u0627 \u0641\u064A\u0644\u062A\u0646\u0627 \u0625\u0644\u0649 \u062A\u062D\u0641\u0629 \u0641\u0646\u064A\u0629. \u062A\u0645 \u0627\u0644\u0646\u0638\u0631 \u0641\u064A \u0643\u0644 \u062A\u0641\u0635\u064A\u0644.", 5],
    ["Mohammed Hassan", "Professional, creative, and attentive to our cultural preferences. The result exceeded our expectations in every way.", "\u0645\u062D\u062A\u0631\u0641\u0648\u0646 \u0648\u0645\u0628\u062F\u0639\u0648\u0646 \u0648\u0645\u0646\u062A\u0628\u0647\u0648\u0646 \u0644\u062A\u0641\u0636\u064A\u0644\u0627\u062A\u0646\u0627 \u0627\u0644\u062B\u0642\u0627\u0641\u064A\u0629.", 5],
    ["Layla Mahmoud", "Working with this team was a seamless experience. They understood our vision from day one and delivered beyond what we imagined.", "\u0643\u0627\u0646 \u0627\u0644\u0639\u0645\u0644 \u0645\u0639 \u0647\u0630\u0627 \u0627\u0644\u0641\u0631\u064A\u0642 \u062A\u062C\u0631\u0628\u0629 \u0633\u0644\u0633\u0629.", 5],
  ];

  for (const t of testimonials) {
    insertTestimonial.run(...t);
  }

  db.prepare(`
    INSERT OR IGNORE INTO admins (username, password) VALUES (?, ?)
  `).run("admin", "$2b$10$demo_hashed_password_admin123");
}

console.log("Database setup complete!");
db.close();
