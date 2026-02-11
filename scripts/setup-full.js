import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import crypto from "crypto";

const homeDir = process.env.HOME || "/tmp";
const dbDir = path.join(homeDir, "db");
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}
const dbPath = path.join(dbDir, "portfolio.db");
console.log("Database path:", dbPath);

// Delete old DB if it exists
if (fs.existsSync(dbPath)) {
  fs.unlinkSync(dbPath);
  console.log("Removed old database");
}

const db = new Database(dbPath);
db.pragma("journal_mode = WAL");

// Simple password hashing
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.createHash("sha256").update(salt + password).digest("hex");
  return salt + ":" + hash;
}

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
    client_en TEXT DEFAULT '',
    client_ar TEXT DEFAULT '',
    budget TEXT DEFAULT '',
    duration TEXT DEFAULT '',
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
console.log("Tables created");

// Create admin user: admin / admin
const hashedPassword = hashPassword("admin");
db.prepare("INSERT INTO admins (username, password) VALUES (?, ?)").run("admin", hashedPassword);
console.log("Admin user created: admin / admin");

// Seed projects with rich data and multiple images
const insertProject = db.prepare(`
  INSERT INTO projects (category, location, size, year, images, title_en, title_ar, description_en, description_ar, client_en, client_ar, budget, duration, featured)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const projects = [
  ["residential", "Dubai, UAE", "450 sqm", 2024,
    JSON.stringify(["/images/projects/project1.jpg", "/images/projects/project2.jpg", "/images/projects/project3.jpg"]),
    "The Pearl Villa", "فيلا اللؤلؤة",
    "A stunning waterfront villa combining contemporary design with traditional Arabian elements. Floor-to-ceiling windows frame panoramic sea views while curated materials create warmth throughout. The open-concept living space features custom Italian marble flooring, handcrafted wooden screens inspired by traditional mashrabiya patterns, and bespoke furniture pieces. The master suite includes a private terrace overlooking the Arabian Gulf, a spa-like bathroom with heated marble floors, and a walk-in closet with custom cabinetry.",
    "فيلا ساحلية مذهلة تجمع بين التصميم المعاصر والعناصر العربية التقليدية. نوافذ من الأرض إلى السقف تؤطر مناظر بانورامية للبحر بينما تخلق المواد المنسقة الدفء في جميع الأنحاء. تتميز مساحة المعيشة المفتوحة بأرضيات رخام إيطالي مخصصة وشاشات خشبية مصنوعة يدوياً مستوحاة من أنماط المشربية التقليدية وقطع أثاث مصممة حصرياً لهذا المشروع.",
    "Al-Rashid Family", "عائلة الراشد", "$850,000", "8 months", 1],
  ["commercial", "Riyadh, KSA", "1200 sqm", 2023,
    JSON.stringify(["/images/projects/project2.jpg", "/images/projects/project4.jpg", "/images/projects/project6.jpg"]),
    "Oasis Tower Lobby", "لوبي برج الواحة",
    "An executive lobby that redefines corporate luxury. Natural stone walls sourced from Italian quarries provide the foundation, complemented by brass accent fixtures and a dramatic living green wall spanning two stories. The reception area features a custom-designed marble desk with integrated LED lighting, while executive seating areas offer privacy through architectural glass partitions. A signature chandelier handcrafted from brushed gold and crystal centerpieces the double-height atrium.",
    "لوبي تنفيذي يعيد تعريف الفخامة المؤسسية. توفر الجدران الحجرية الطبيعية المستوردة من المحاجر الإيطالية الأساس، مكملة بتركيبات من النحاس الأصفر وجدار أخضر حي مذهل يمتد على طابقين. يتميز منطقة الاستقبال بمكتب رخامي مصمم خصيصاً مع إضاءة LED مدمجة.",
    "Oasis Group Holdings", "مجموعة الواحة القابضة", "$1,200,000", "12 months", 1],
  ["residential", "Abu Dhabi, UAE", "320 sqm", 2024,
    JSON.stringify(["/images/projects/project3.jpg", "/images/projects/project1.jpg", "/images/projects/project5.jpg"]),
    "Saadiyat Penthouse", "بنتهاوس السعديات",
    "A penthouse retreat where minimalism meets opulence. Custom Italian furnishings from Poliform and B&B Italia anchor each room, while art-gallery lighting by Flos creates dramatic interplay of light and shadow. The wraparound terrace offers 360-degree island views and features an outdoor lounge area with weather-resistant luxury furniture. The kitchen showcases Gaggenau appliances, Calacatta marble countertops, and a custom wine cellar with temperature-controlled storage for 200 bottles.",
    "ملاذ بنتهاوس حيث يلتقي الحد الأدنى بالفخامة. أثاث إيطالي مخصص من بوليفورم و بي أند بي إيطاليا يثبت كل غرفة، بينما تخلق إضاءة معرض الفن من فلوس تفاعلاً دراماتيكياً بين الضوء والظل. يوفر الشرفة المحيطة مناظر جزيرة بانورامية 360 درجة.",
    "Saadiyat Properties", "عقارات السعديات", "$650,000", "6 months", 1],
  ["hospitality", "Doha, Qatar", "800 sqm", 2023,
    JSON.stringify(["/images/projects/project4.jpg", "/images/projects/project2.jpg", "/images/projects/project6.jpg"]),
    "Amber Restaurant", "مطعم عنبر",
    "Fine dining interiors inspired by the golden hues of the Arabian desert at sunset. Rich walnut paneling and hand-hammered copper accents create an intimate atmosphere, while custom-designed banquette seating in cognac leather offers comfort and elegance. The centerpiece is a show kitchen with a copper-clad hood and live fire grill visible to diners. A private dining room features a hand-painted ceiling mural depicting desert constellations.",
    "تصميمات داخلية للمطاعم الفاخرة مستوحاة من ألوان الصحراء العربية الذهبية عند غروب الشمس. تخلق ألواح الجوز الغنية ولمسات النحاس المطروق يدوياً أجواءً حميمة، بينما توفر مقاعد البانكيت المصممة خصيصاً بالجلد الكونياك الراحة والأناقة.",
    "Amber Hospitality Group", "مجموعة عنبر للضيافة", "$950,000", "10 months", 0],
  ["residential", "Jeddah, KSA", "600 sqm", 2024,
    JSON.stringify(["/images/projects/project5.jpg", "/images/projects/project3.jpg", "/images/projects/project1.jpg"]),
    "Al Hamra Estate", "عقار الحمراء",
    "A family estate that masterfully marries heritage architecture with modern comfort. Traditional inner courtyard with a hand-carved marble fountain serves as the heart of the home, surrounded by living spaces that feature custom mashrabiya screens filtering natural sunlight into intricate patterns. Each of the seven bedrooms has been individually designed with its own color palette and character. The family majlis showcases museum-quality antique carpets, contemporary Arabian art, and seating for formal entertaining.",
    "عقار عائلي يجمع ببراعة بين العمارة التراثية والراحة الحديثة. فناء داخلي تقليدي مع نافورة رخامية منحوتة يدوياً يعمل كقلب المنزل، محاطاً بمساحات معيشة تتميز بشاشات مشربية مخصصة تصفي ضوء الشمس الطبيعي إلى أنماط معقدة.",
    "Al-Hamra Family Estate", "عقار عائلة الحمراء", "$1,500,000", "14 months", 1],
  ["commercial", "Manama, Bahrain", "500 sqm", 2023,
    JSON.stringify(["/images/projects/project6.jpg", "/images/projects/project4.jpg", "/images/projects/project2.jpg"]),
    "Serenity Spa", "سبا السكينة",
    "A wellness sanctuary designed to calm the senses and restore balance. Natural stone walls with embedded LED strip lighting create a warm glow throughout treatment rooms. The main relaxation hall features floor-to-ceiling water walls, heated stone loungers, and a living ceiling of trailing plants. Each treatment room incorporates aromatherapy diffusion systems, sound-dampening panels wrapped in raw silk, and adjustable chromotherapy lighting.",
    "ملاذ صحي مصمم لتهدئة الحواس واستعادة التوازن. جدران حجرية طبيعية مع إضاءة LED مدمجة تخلق توهجاً دافئاً في جميع غرف العلاج. تتميز صالة الاسترخاء الرئيسية بجدران مائية من الأرض إلى السقف ومقاعد حجرية مدفأة وسقف حي من النباتات المتدلية.",
    "Serenity Wellness Resort", "منتجع سيرينيتي الصحي", "$780,000", "9 months", 0],
];

for (const p of projects) {
  insertProject.run(...p);
}
console.log("Seeded 6 projects");

// Seed services
const insertService = db.prepare(
  "INSERT INTO services (icon, title_en, title_ar, description_en, description_ar) VALUES (?, ?, ?, ?, ?)"
);
const services = [
  ["Palette", "Interior Design", "التصميم الداخلي", "Full-service interior design from concept to completion. We craft bespoke environments that reflect your lifestyle and aspirations.", "تصميم داخلي متكامل من المفهوم إلى الإنجاز. نصنع بيئات مخصصة تعكس أسلوب حياتك وتطلعاتك."],
  ["Building2", "Space Planning", "تخطيط المساحات", "Strategic spatial layouts that maximize functionality while maintaining aesthetic harmony and flow.", "تخطيطات مكانية استراتيجية تعظم الوظائف مع الحفاظ على التناغم الجمالي."],
  ["Lightbulb", "Lighting Design", "تصميم الإضاءة", "Curated lighting schemes that enhance atmosphere, highlight architectural features, and set the perfect mood.", "مخططات إضاءة منسقة تعزز الأجواء وتبرز الميزات المعمارية."],
  ["Sofa", "Furniture Curation", "اختيار الأثاث", "Hand-selected furniture pieces from world-renowned designers, perfectly matched to your space and style.", "قطع أثاث مختارة يدوياً من مصممين عالميين، متطابقة تماماً مع مساحتك وأسلوبك."],
];
for (const s of services) {
  insertService.run(...s);
}
console.log("Seeded 4 services");

// Seed testimonials
const insertTestimonial = db.prepare(
  "INSERT INTO testimonials (name, review_en, review_ar, rating) VALUES (?, ?, ?, ?)"
);
const testimonials = [
  ["Sarah Al-Rashid", "They transformed our villa into a masterpiece. Every detail was considered, from the custom furniture to the lighting design. Truly exceptional work.", "لقد حولوا فيلتنا إلى تحفة فنية. تم النظر في كل تفصيل من الأثاث المخصص إلى تصميم الإضاءة. عمل استثنائي حقاً.", 5],
  ["Mohammed Hassan", "Professional, creative, and attentive to our cultural preferences. The result exceeded our expectations in every way.", "محترفون ومبدعون ومنتبهون لتفضيلاتنا الثقافية. النتيجة فاقت توقعاتنا بكل الطرق.", 5],
  ["Layla Mahmoud", "Working with this team was a seamless experience. They understood our vision from day one and delivered beyond what we imagined.", "كان العمل مع هذا الفريق تجربة سلسة. فهموا رؤيتنا من اليوم الأول وقدموا ما يتجاوز ما تخيلناه.", 5],
];
for (const t of testimonials) {
  insertTestimonial.run(...t);
}
console.log("Seeded 3 testimonials");

// Seed contacts
const insertContact = db.prepare(
  "INSERT INTO contacts (name, email, message, read) VALUES (?, ?, ?, ?)"
);
const contacts = [
  ["Ahmed Al-Mansour", "ahmed@example.com", "We are looking to redesign our corporate headquarters lobby. The space is approximately 500 sqm and we want a modern Arabian luxury aesthetic. Can we schedule a consultation?", 0],
  ["Fatima Hassan", "fatima@example.com", "I saw your Pearl Villa project and absolutely loved it. We have a new villa in Dubai Marina that needs a complete interior design. Budget is flexible for the right design.", 0],
  ["Omar Al-Khalil", "omar@example.com", "We are opening a new boutique hotel in Jeddah and need an interior design team for 45 rooms plus common areas. Timeline is 18 months.", 1],
];
for (const c of contacts) {
  insertContact.run(...c);
}
console.log("Seeded 3 contacts");

console.log("Full database setup complete!");
db.close();
