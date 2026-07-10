const args = new Set(process.argv.slice(2));
const force = args.has("--force");
const dryRun = args.has("--dry-run");
const submit = args.has("--submit");
const verbose = args.has("--verbose");
const siteUrl = (process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://www.cowinmaterials.com").replace(/\/$/, "");

function log(...values) {
  if (verbose) console.log(...values);
}

async function validatePublicSitemaps() {
  const response = await fetch(`${siteUrl}/sitemap.xml`);
  if (!response.ok) throw new Error(`Sitemap index returned HTTP ${response.status}.`);
  const xml = await response.text();
  if (!xml.includes("<sitemapindex")) throw new Error("Sitemap index XML is invalid.");
  const children = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1].replace(/&amp;/g, "&"));
  for (const child of children) {
    const childResponse = await fetch(child);
    const body = await childResponse.text();
    if (!childResponse.ok || !body.includes("<urlset")) throw new Error(`${child} failed validation with HTTP ${childResponse.status}.`);
    log(`Validated ${child}`);
  }
  return { index: `${siteUrl}/sitemap.xml`, files: children.length };
}

if (dryRun) {
  const result = await validatePublicSitemaps();
  console.log(JSON.stringify({ ok: true, dryRun: true, ...result }, null, 2));
  process.exit(0);
}

if (!process.env.CRON_SECRET) {
  throw new Error("CRON_SECRET is required for a manual sitemap maintenance run. Use --dry-run for public validation only.");
}

const endpoint = new URL(`${siteUrl}/api/cron/sitemap-maintenance`);
endpoint.searchParams.set("trigger", "manual");
if (force) endpoint.searchParams.set("force", "true");
if (submit) endpoint.searchParams.set("submit", "true");
const response = await fetch(endpoint, { headers: { authorization: `Bearer ${process.env.CRON_SECRET}` } });
const result = await response.json();
if (!response.ok) throw new Error(`Sitemap maintenance failed: ${JSON.stringify(result)}`);
console.log(JSON.stringify(result, null, 2));
