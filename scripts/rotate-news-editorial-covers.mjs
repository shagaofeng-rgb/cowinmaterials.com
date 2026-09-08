import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL_UNPOOLED or DATABASE_URL is required.");

const legacyCovers = [
  "/images/ev-thermal-sheet.jpg",
  "/images/fire-test-lab.jpg",
  "/images/industrial-coating-system.jpeg",
  "/images/fire-char-layer.jpg",
  "/images/waterproof-section-test.png",
];

const families = {
  water: ["/images/news/water-repellent-editorial.jpg", "/images/news/water-repellent-editorial-2.jpg"],
  battery: ["/images/news/battery-thermal-barrier-editorial.jpg", "/images/news/battery-thermal-barrier-editorial-2.jpg"],
  fire: ["/images/news/fire-protection-editorial.jpg", "/images/news/fire-protection-editorial-2.jpg"],
  aerogel: ["/images/news/aerogel-insulation-editorial.jpg", "/images/news/aerogel-insulation-editorial-2.jpg"],
};

function familyForText(text) {
  if (/\b(waterproof|water repellent|water repellency|hydrophobic|concrete|masonry|silane|siloxane|penetrating)\b/i.test(text)) return "water";
  if (/\b(battery|batteries|cell|pack|electric vehicle|\bev\b|lithium|bess|thermal runaway)\b/i.test(text)) return "battery";
  if (/\b(intumescent|fireproof|fire protection|passive fire|steel fire|fire safety)\b/i.test(text)) return "fire";
  return "aerogel";
}

function stableIndex(value, length) {
  let total = 0;
  for (let index = 0; index < value.length; index += 1) total = (total * 31 + value.charCodeAt(index)) >>> 0;
  return total % length;
}

const pool = new Pool({ connectionString, max: 1 });
try {
  const { rows } = await pool.query(
    `select id, slug, title, excerpt from news_articles
     where deleted_at is null and cover_image_url = any($1::text[])`,
    [legacyCovers],
  );
  let updated = 0;
  for (const article of rows) {
    const family = familyForText(`${article.title} ${article.excerpt}`);
    const imageUrl = families[family][stableIndex(article.slug, families[family].length)];
    const alt = `Editorial illustration for a ${family === "water" ? "water-repellent materials" : family === "fire" ? "passive fire-protection materials" : family === "battery" ? "battery thermal-barrier materials" : "silica aerogel insulation"} news brief.`;
    const result = await pool.query(
      `update news_articles
       set cover_image_url = $2, cover_image_source_url = $3, cover_image_page_url = $4,
           cover_image_alt = $5, cover_image_hash = md5($2), cover_image_status = 'verified',
           cover_image_fetched_at = now(), updated_at = now(), generation_prompt_version = 'news-direct-publish-v4-editorial-cover'
       where id = $1 and cover_image_url = any($6::text[])`,
      [article.id, imageUrl, `https://www.cowinmaterials.com${imageUrl}`, "https://www.cowinmaterials.com/news", alt, legacyCovers],
    );
    updated += result.rowCount || 0;
  }
  console.log(JSON.stringify({ inspected: rows.length, updated, status: "completed" }));
} finally {
  await pool.end();
}
