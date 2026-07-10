import { execFileSync } from "node:child_process";
import { readFile, rename, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = process.cwd();
const output = resolve(root, "src/generated/sitemap-content.json");
const pageFiles = {
  "/": "src/app/page.tsx",
  "/about": "src/app/about/page.tsx",
  "/applications": "src/app/applications/page.tsx",
  "/case-studies": "src/app/case-studies/page.tsx",
  "/contact": "src/app/contact/page.tsx",
  "/cookie-notice": "src/app/cookie-notice/page.tsx",
  "/news": "src/app/news/page.tsx",
  "/privacy-policy": "src/app/privacy-policy/page.tsx",
  "/products": "src/app/products/page.tsx",
  "/technical-resources": "src/app/technical-resources/page.tsx",
  "/terms-of-use": "src/app/terms-of-use/page.tsx",
};
const sharedPublicFiles = [
  "src/app/globals.css",
  "src/app/layout.tsx",
  "src/components/header.tsx",
  "src/components/footer.tsx",
  "src/components/section-heading.tsx",
  "src/lib/seo.ts",
];

async function fallbackDate(path) {
  try {
    const previous = JSON.parse(await readFile(output, "utf8"));
    return path === "src/lib/data.ts" ? previous.catalog : previous.pages?.[Object.entries(pageFiles).find(([, file]) => file === path)?.[0]] || previous.generatedAt;
  } catch {
    return "2026-07-08T00:00:00.000Z";
  }
}

async function gitDate(path) {
  try {
    const value = execFileSync("git", ["log", "-1", "--format=%cI", "--", path], { cwd: root, encoding: "utf8" }).trim();
    if (value) return new Date(value).toISOString();
  } catch {
    // The committed fallback remains valid when build metadata is unavailable.
  }
  return fallbackDate(path);
}

function latestDate(values) {
  return new Date(Math.max(...values.map((value) => new Date(value).getTime()).filter(Number.isFinite))).toISOString();
}

const sharedDate = latestDate(await Promise.all(sharedPublicFiles.map(gitDate)));
const pages = Object.fromEntries(await Promise.all(Object.entries(pageFiles).map(async ([path, file]) => [path, latestDate([await gitDate(file), sharedDate])])));
const catalog = latestDate([await gitDate("src/lib/data.ts"), sharedDate]);
const allDates = [catalog, ...Object.values(pages)].map((value) => new Date(value).getTime()).filter(Number.isFinite);
const manifest = {
  generatedAt: new Date(Math.max(...allDates)).toISOString(),
  catalog,
  pages,
};

const temporary = `${output}.${process.pid}.tmp`;
await writeFile(temporary, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
JSON.parse(await readFile(temporary, "utf8"));
await rename(temporary, output);
console.log(`Sitemap content manifest updated with ${Object.keys(pages).length} public page timestamps.`);
