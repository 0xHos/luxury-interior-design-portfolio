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

const db = new Database(dbPath);
db.pragma("journal_mode = WAL");

// Add client_en, client_ar, budget, duration columns to projects if not exist
const cols = db.prepare("PRAGMA table_info(projects)").all();
const colNames = cols.map((c) => c.name);

if (!colNames.includes("client_en")) {
  db.exec("ALTER TABLE projects ADD COLUMN client_en TEXT DEFAULT ''");
  console.log("Added client_en column");
}
if (!colNames.includes("client_ar")) {
  db.exec("ALTER TABLE projects ADD COLUMN client_ar TEXT DEFAULT ''");
  console.log("Added client_ar column");
}
if (!colNames.includes("budget")) {
  db.exec("ALTER TABLE projects ADD COLUMN budget TEXT DEFAULT ''");
  console.log("Added budget column");
}
if (!colNames.includes("duration")) {
  db.exec("ALTER TABLE projects ADD COLUMN duration TEXT DEFAULT ''");
  console.log("Added duration column");
}

// Simple password hashing using SHA-256 with salt
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.createHash("sha256").update(salt + password).digest("hex");
  return salt + ":" + hash;
}

// Reset admin user with proper hashed password
db.prepare("DELETE FROM admins").run();
const hashedPassword = hashPassword("admin");
db.prepare("INSERT INTO admins (username, password) VALUES (?, ?)").run("admin", hashedPassword);
console.log("Admin user created: username=admin, password=admin");

// Update existing projects with richer data and multiple images
const projects = db.prepare("SELECT id FROM projects").all();

const updates = [
  {
    id: 1,
    images: JSON.stringify(["/images/projects/project1.jpg", "/images/projects/project2.jpg", "/images/projects/project3.jpg"]),
    client_en: "Al-Rashid Family",
    client_ar: "عائلة الراشد",
    budget: "$850,000",
    duration: "8 months",
    description_en: "A stunning waterfront villa combining contemporary design with traditional Arabian elements. Floor-to-ceiling windows frame panoramic sea views while curated materials create warmth throughout. The open-concept living space features custom Italian marble flooring, handcrafted wooden screens inspired by traditional mashrabiya patterns, and bespoke furniture pieces designed exclusively for this project. The master suite includes a private terrace overlooking the Arabian Gulf, a spa-like bathroom with heated marble floors, and a walk-in closet with custom cabinetry.",
    description_ar: "فيلا ساحلية مذهلة تجمع بين التصميم المعاصر والعناصر العربية التقليدية. نوافذ من الأرض إلى السقف تؤطر مناظر بانورامية للبحر بينما تخلق المواد المنسقة الدفء في جميع الأنحاء. تتميز مساحة المعيشة المفتوحة بأرضيات رخام إيطالي مخصصة وشاشات خشبية مصنوعة يدوياً مستوحاة من أنماط المشربية التقليدية وقطع أثاث مصممة حصرياً لهذا المشروع.",
  },
  {
    id: 2,
    images: JSON.stringify(["/images/projects/project2.jpg", "/images/projects/project4.jpg", "/images/projects/project6.jpg"]),
    client_en: "Oasis Group Holdings",
    client_ar: "مجموعة الواحة القابضة",
    budget: "$1,200,000",
    duration: "12 months",
    description_en: "An executive lobby that redefines corporate luxury. Natural stone walls sourced from Italian quarries provide the foundation, complemented by brass accent fixtures and a dramatic living green wall spanning two stories. The reception area features a custom-designed marble desk with integrated LED lighting, while executive seating areas offer privacy through architectural glass partitions. A signature chandelier handcrafted from brushed gold and crystal centerpieces the double-height atrium.",
    description_ar: "لوبي تنفيذي يعيد تعريف الفخامة المؤسسية. توفر الجدران الحجرية الطبيعية المستوردة من المحاجر الإيطالية الأساس، مكملة بتركيبات من النحاس الأصفر وجدار أخضر حي مذهل يمتد على طابقين. يتميز منطقة الاستقبال بمكتب رخامي مصمم خصيصاً مع إضاءة LED مدمجة.",
  },
  {
    id: 3,
    images: JSON.stringify(["/images/projects/project3.jpg", "/images/projects/project1.jpg", "/images/projects/project5.jpg"]),
    client_en: "Saadiyat Properties",
    client_ar: "عقارات السعديات",
    budget: "$650,000",
    duration: "6 months",
    description_en: "A penthouse retreat where minimalism meets opulence. Custom Italian furnishings from Poliform and B&B Italia anchor each room, while art-gallery lighting by Flos creates dramatic interplay of light and shadow. The wraparound terrace offers 360-degree island views and features an outdoor lounge area with weather-resistant luxury furniture. The kitchen showcases Gaggenau appliances, Calacatta marble countertops, and a custom wine cellar with temperature-controlled storage for 200 bottles.",
    description_ar: "ملاذ بنتهاوس حيث يلتقي الحد الأدنى بالفخامة. أثاث إيطالي مخصص من بوليفورم و بي أند بي إيطاليا يثبت كل غرفة، بينما تخلق إضاءة معرض الفن من فلوس تفاعلاً دراماتيكياً بين الضوء والظل. يوفر الشرفة المحيطة مناظر جزيرة بانورامية 360 درجة.",
  },
  {
    id: 4,
    images: JSON.stringify(["/images/projects/project4.jpg", "/images/projects/project2.jpg", "/images/projects/project6.jpg"]),
    client_en: "Amber Hospitality Group",
    client_ar: "مجموعة عنبر للضيافة",
    budget: "$950,000",
    duration: "10 months",
    description_en: "Fine dining interiors inspired by the golden hues of the Arabian desert at sunset. Rich walnut paneling and hand-hammered copper accents create an intimate atmosphere, while custom-designed banquette seating in cognac leather offers comfort and elegance. The centerpiece is a show kitchen with a copper-clad hood and live fire grill visible to diners. A private dining room features a hand-painted ceiling mural depicting desert constellations, illuminated by a constellation of fiber-optic lights.",
    description_ar: "تصميمات داخلية للمطاعم الفاخرة مستوحاة من ألوان الصحراء العربية الذهبية عند غروب الشمس. تخلق ألواح الجوز الغنية ولمسات النحاس المطروق يدوياً أجواءً حميمة، بينما توفر مقاعد البانكيت المصممة خصيصاً بالجلد الكونياك الراحة والأناقة.",
  },
  {
    id: 5,
    images: JSON.stringify(["/images/projects/project5.jpg", "/images/projects/project3.jpg", "/images/projects/project1.jpg"]),
    client_en: "Al-Hamra Family Estate",
    client_ar: "عقار عائلة الحمراء",
    budget: "$1,500,000",
    duration: "14 months",
    description_en: "A family estate that masterfully marries heritage architecture with modern comfort. Traditional inner courtyard with a hand-carved marble fountain serves as the heart of the home, surrounded by living spaces that feature custom mashrabiya screens filtering natural sunlight into intricate patterns. Each of the seven bedrooms has been individually designed with its own color palette and character. The family majlis showcases museum-quality antique carpets, contemporary Arabian art, and seating designed for both formal entertaining and family gatherings.",
    description_ar: "عقار عائلي يجمع ببراعة بين العمارة التراثية والراحة الحديثة. فناء داخلي تقليدي مع نافورة رخامية منحوتة يدوياً يعمل كقلب المنزل، محاطاً بمساحات معيشة تتميز بشاشات مشربية مخصصة تصفي ضوء الشمس الطبيعي إلى أنماط معقدة.",
  },
  {
    id: 6,
    images: JSON.stringify(["/images/projects/project6.jpg", "/images/projects/project4.jpg", "/images/projects/project2.jpg"]),
    client_en: "Serenity Wellness Resort",
    client_ar: "منتجع سيرينيتي الصحي",
    budget: "$780,000",
    duration: "9 months",
    description_en: "A wellness sanctuary designed to calm the senses and restore balance. Natural stone walls with embedded LED strip lighting create a warm glow throughout treatment rooms. The main relaxation hall features floor-to-ceiling water walls, heated stone loungers, and a living ceiling of trailing plants. Each treatment room incorporates aromatherapy diffusion systems, sound-dampening panels wrapped in raw silk, and adjustable chromotherapy lighting to enhance the healing experience.",
    description_ar: "ملاذ صحي مصمم لتهدئة الحواس واستعادة التوازن. جدران حجرية طبيعية مع إضاءة LED مدمجة تخلق توهجاً دافئاً في جميع غرف العلاج. تتميز صالة الاسترخاء الرئيسية بجدران مائية من الأرض إلى السقف ومقاعد حجرية مدفأة وسقف حي من النباتات المتدلية.",
  },
];

const updateStmt = db.prepare(`
  UPDATE projects SET images=?, client_en=?, client_ar=?, budget=?, duration=?, description_en=?, description_ar=? WHERE id=?
`);

for (const u of updates) {
  if (projects.find((p) => p.id === u.id)) {
    updateStmt.run(u.images, u.client_en, u.client_ar, u.budget, u.duration, u.description_en, u.description_ar, u.id);
    console.log(`Updated project ${u.id}`);
  }
}

// Add more sample contact messages
const contactCount = db.prepare("SELECT COUNT(*) as count FROM contacts").get();
if (contactCount.count < 3) {
  const insertContact = db.prepare("INSERT INTO contacts (name, email, message, read) VALUES (?, ?, ?, ?)");
  insertContact.run("Ahmed Al-Mansour", "ahmed@example.com", "We are looking to redesign our corporate headquarters lobby. The space is approximately 500 sqm and we want a modern Arabian luxury aesthetic. Can we schedule a consultation?", 0);
  insertContact.run("Fatima Hassan", "fatima@example.com", "I saw your Pearl Villa project and absolutely loved it. We have a new villa in Dubai Marina that needs a complete interior design. Budget is flexible for the right design.", 0);
  insertContact.run("Omar Al-Khalil", "omar@example.com", "We are opening a new boutique hotel in Jeddah and need an interior design team for 45 rooms plus common areas. Timeline is 18 months. Please share your hospitality portfolio.", 1);
  console.log("Added sample contact messages");
}

console.log("Migration v2 complete!");
db.close();
