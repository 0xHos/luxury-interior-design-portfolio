import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, "..", "data", "portfolio.db");

// Ensure data directory exists
import fs from "fs";
const dataDir = path.join(__dirname, "..", "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(dbPath);
db.pragma("journal_mode = WAL");

// Create tables
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

// Seed data
const projectCount = db.prepare("SELECT COUNT(*) as count FROM projects").get();
if (projectCount.count === 0) {
  const insertProject = db.prepare(`
    INSERT INTO projects (category, location, size, year, images, title_en, title_ar, description_en, description_ar, featured)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const projects = [
    ["residential", "Dubai, UAE", "450 sqm", 2024, JSON.stringify(["/images/projects/project1.jpg"]), "The Pearl Villa", "فيلا اللؤلؤة", "A stunning waterfront villa combining contemporary design with traditional Arabian elements. Floor-to-ceiling windows frame panoramic sea views while curated materials create warmth throughout.", "فيلا ساحلية مذهلة تجمع بين التصميم المعاصر والعناصر العربية التقليدية. نوافذ ممتدة من الأرض إلى السقف تؤطر إطلالات بحرية بانورامية.", 1],
    ["commercial", "Riyadh, KSA", "1200 sqm", 2023, JSON.stringify(["/images/projects/project2.jpg"]), "Oasis Tower Lobby", "لوبي برج الواحة", "An executive lobby that redefines corporate luxury. Natural stone, brass accents, and living green walls create an unforgettable first impression.", "لوبي تنفيذي يعيد تعريف الفخامة المؤسسية. الحجر الطبيعي والنحاس الأصفر والجدران الخضراء تخلق انطباعاً أولاً لا يُنسى.", 1],
    ["residential", "Abu Dhabi, UAE", "320 sqm", 2024, JSON.stringify(["/images/projects/project3.jpg"]), "Saadiyat Penthouse", "بنتهاوس السعديات", "A penthouse retreat where minimalism meets opulence. Custom Italian furnishings, art-gallery lighting, and a wraparound terrace with island views.", "ملاذ بنتهاوس حيث يلتقي الحد الأدنى بالفخامة. أثاث إيطالي مخصص وإضاءة معرض فني وشرفة محيطة بإطلالات على الجزيرة.", 1],
    ["hospitality", "Doha, Qatar", "800 sqm", 2023, JSON.stringify(["/images/projects/project4.jpg"]), "Amber Restaurant", "مطعم عنبر", "Fine dining interiors inspired by the golden hues of the desert. Layered textures, ambient lighting, and bespoke tableware complete the sensory experience.", "تصميمات داخلية للمطاعم الفاخرة مستوحاة من ألوان الصحراء الذهبية. الأنسجة المتعددة والإضاءة المحيطة وأدوات المائدة المصممة خصيصاً.", 0],
    ["residential", "Jeddah, KSA", "600 sqm", 2024, JSON.stringify(["/images/projects/project5.jpg"]), "Al Hamra Estate", "عقار الحمراء", "A family estate marrying heritage architecture with modern comfort. Courtyards, mashrabiya screens, and smart home technology coexist harmoniously.", "عقار عائلي يزاوج بين العمارة التراثية والراحة الحديثة. الأفنية وشاشات المشربية وتقنية المنزل الذكي تتعايش بانسجام.", 1],
    ["commercial", "Manama, Bahrain", "500 sqm", 2023, JSON.stringify(["/images/projects/project6.jpg"]), "Serenity Spa", "سبا السكينة", "A wellness sanctuary designed to calm the senses. Water features, natural materials, and soft indirect lighting guide guests from arrival to relaxation.", "ملاذ صحي مصمم لتهدئة الحواس. الميزات المائية والمواد الطبيعية والإضاءة غير المباشرة الناعمة.", 0],
  ];

  for (const p of projects) {
    insertProject.run(...p);
  }

  // Seed services
  const insertService = db.prepare(`
    INSERT INTO services (icon, title_en, title_ar, description_en, description_ar)
    VALUES (?, ?, ?, ?, ?)
  `);

  const services = [
    ["Palette", "Interior Design", "التصميم الداخلي", "Full-service interior design from concept to completion. We craft bespoke environments that reflect your lifestyle and aspirations.", "تصميم داخلي متكامل من المفهوم إلى الإنجاز. نصمم بيئات فريدة تعكس أسلوب حياتك وتطلعاتك."],
    ["Building2", "Space Planning", "تخطيط المساحات", "Strategic spatial layouts that maximize functionality while maintaining aesthetic harmony and flow.", "تخطيطات مكانية استراتيجية تعظم الوظائف مع الحفاظ على التناغم الجمالي والتدفق."],
    ["Lightbulb", "Lighting Design", "تصميم الإضاءة", "Curated lighting schemes that enhance atmosphere, highlight architectural features, and set the perfect mood.", "مخططات إضاءة منسقة تعزز الأجواء وتبرز الميزات المعمارية وتضبط المزاج المثالي."],
  ];

  for (const s of services) {
    insertService.run(...s);
  }

  // Seed testimonials
  const insertTestimonial = db.prepare(`
    INSERT INTO testimonials (name, review_en, review_ar, rating)
    VALUES (?, ?, ?, ?)
  `);

  const testimonials = [
    ["Sarah Al-Rashid", "They transformed our villa into a masterpiece. Every detail was considered, from the custom furniture to the lighting design. Truly exceptional work.", "لقد حولوا فيلتنا إلى تحفة فنية. تم النظر في كل تفصيل، من الأثاث المخصص إلى تصميم الإضاءة. عمل استثنائي حقاً.", 5],
    ["Mohammed Hassan", "Professional, creative, and attentive to our cultural preferences. The result exceeded our expectations in every way.", "محترفون ومبدعون ومنتبهون لتفضيلاتنا الثقافية. النتيجة تجاوزت توقعاتنا بكل الطرق.", 5],
    ["Layla Mahmoud", "Working with this team was a seamless experience. They understood our vision from day one and delivered beyond what we imagined.", "كان العمل مع هذا الفريق تجربة سلسة. فهموا رؤيتنا من اليوم الأول وقدموا ما يفوق ما تخيلناه.", 5],
  ];

  for (const t of testimonials) {
    insertTestimonial.run(...t);
  }

  // Create default admin (password: admin123)
  // Using a simple hash for demo purposes
  db.prepare(`
    INSERT OR IGNORE INTO admins (username, password) VALUES (?, ?)
  `).run("admin", "$2b$10$demo_hashed_password_admin123");
}

console.log("Database setup complete!");
db.close();
