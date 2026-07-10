import assert from "node:assert/strict";
import { generateKeyPairSync } from "node:crypto";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { writeSitemapAtomically } from "../src/lib/sitemap/atomic-write.ts";
import { withSitemapLock } from "../src/lib/sitemap/lock.ts";
import { submitSitemapToSearchConsole } from "../src/lib/sitemap/search-console.ts";
import { compareSnapshots } from "../src/lib/sitemap/snapshot.ts";
import type { SitemapEntry } from "../src/lib/sitemap/types.ts";
import { escapeXml, filterIndexableEntries, isWellFormedSitemapXml, renderSitemapIndex, renderUrlSet, splitSitemapEntries } from "../src/lib/sitemap/xml.ts";

const date = "2026-07-08T00:00:00.000Z";

test("renders valid UTF-8 sitemap XML and escapes URLs", () => {
  const xml = renderUrlSet([{ url: "https://www.cowinmaterials.com/products/a&b", lastModified: date }]);
  assert.ok(isWellFormedSitemapXml(xml));
  assert.ok(xml.includes("a&amp;b"));
  assert.equal(escapeXml("<>&\"'"), "&lt;&gt;&amp;&quot;&apos;");
});

test("filters draft, deleted, noindex, duplicate, parameter and non-canonical URLs", () => {
  const entries: SitemapEntry[] = [
    { url: "https://www.cowinmaterials.com/a", lastModified: date, status: "published" },
    { url: "https://www.cowinmaterials.com/a", lastModified: date, status: "published" },
    { url: "https://www.cowinmaterials.com/draft", lastModified: date, status: "draft" },
    { url: "https://www.cowinmaterials.com/deleted", lastModified: date, status: "deleted" },
    { url: "https://www.cowinmaterials.com/noindex", lastModified: date, indexable: false },
    { url: "https://www.cowinmaterials.com/search?q=a", lastModified: date },
    { url: "https://www.cowinmaterials.com/alias", canonicalUrl: "https://www.cowinmaterials.com/a", lastModified: date },
  ];
  assert.deepEqual(filterIndexableEntries(entries).map((entry) => entry.url), ["https://www.cowinmaterials.com/a"]);
});

test("preserves true lastmod and splits above the URL limit", () => {
  const entries = Array.from({ length: 50_001 }, (_, index) => ({ url: `https://www.cowinmaterials.com/p/${index}`, lastModified: date }));
  const chunks = splitSitemapEntries(entries, 50_000);
  assert.equal(chunks.length, 2);
  assert.equal(chunks[0].length, 50_000);
  assert.equal(chunks[1].length, 1);
  assert.ok(renderUrlSet(chunks[0].slice(0, 1)).includes(date));
  assert.ok(isWellFormedSitemapXml(renderSitemapIndex([{ url: "https://www.cowinmaterials.com/sitemaps/products-1.xml", lastModified: date }])));
});

test("detects added, modified and removed URLs", () => {
  const previous = new Map([["https://www.cowinmaterials.com/old", date], ["https://www.cowinmaterials.com/changed", date]]);
  const changes = compareSnapshots(previous, [
    { url: "https://www.cowinmaterials.com/new", lastModified: date },
    { url: "https://www.cowinmaterials.com/changed", lastModified: "2026-07-09T00:00:00.000Z" },
  ]);
  assert.deepEqual(changes.added, ["https://www.cowinmaterials.com/new"]);
  assert.deepEqual(changes.modified, ["https://www.cowinmaterials.com/changed"]);
  assert.deepEqual(changes.removed, ["https://www.cowinmaterials.com/old"]);
});

test("task lock rejects concurrent generation and recovers", async () => {
  let release!: () => void;
  const gate = new Promise<void>((resolve) => { release = resolve; });
  const first = withSitemapLock(async () => gate);
  await assert.rejects(() => withSitemapLock(async () => undefined), /already running/);
  release();
  await first;
  await withSitemapLock(async () => undefined);
});

test("atomic writer preserves the previous sitemap when validation fails", async () => {
  const directory = await mkdtemp(join(tmpdir(), "cowin-sitemap-"));
  const file = join(directory, "sitemap.xml");
  await writeFile(file, "previous", "utf8");
  await assert.rejects(() => writeSitemapAtomically(file, "broken", () => false), /failed validation/);
  assert.equal(await readFile(file, "utf8"), "previous");
  await writeSitemapAtomically(file, renderUrlSet([{ url: "https://www.cowinmaterials.com/", lastModified: date }]), isWellFormedSitemapXml);
  assert.ok((await readFile(file, "utf8")).includes("<urlset"));
  await rm(directory, { recursive: true, force: true });
});

test("Search Console is not called when disabled", async () => {
  let calls = 0;
  const result = await submitSitemapToSearchConsole({ env: { NODE_ENV: "test", GOOGLE_SEARCH_CONSOLE_ENABLED: "false" }, fetchImpl: (async () => { calls += 1; return new Response(); }) as typeof fetch });
  assert.equal(result.status, "disabled");
  assert.equal(calls, 0);
});

test("Search Console submission succeeds and auth failures do not break sitemap generation", async () => {
  const { privateKey } = generateKeyPairSync("rsa", { modulusLength: 2048 });
  const credentials = JSON.stringify({ client_email: "sitemap@example.iam.gserviceaccount.com", private_key: privateKey.export({ type: "pkcs8", format: "pem" }).toString() });
  const env: NodeJS.ProcessEnv = {
    NODE_ENV: "test",
    GOOGLE_SEARCH_CONSOLE_ENABLED: "true",
    GOOGLE_SEARCH_CONSOLE_SITE_URL: "sc-domain:cowinmaterials.com",
    GOOGLE_SEARCH_CONSOLE_SITEMAP_URL: "https://www.cowinmaterials.com/sitemap.xml",
    GOOGLE_SERVICE_ACCOUNT_CREDENTIALS_JSON: credentials,
  };
  const responses = [
    new Response("<sitemapindex/>", { status: 200 }),
    Response.json({ access_token: "test-token" }),
    new Response(null, { status: 204 }),
  ];
  const success = await submitSitemapToSearchConsole({ env, fetchImpl: (async () => responses.shift() || new Response(null, { status: 500 })) as typeof fetch });
  assert.equal(success.status, "submitted");
  assert.equal(success.submitted, true);

  const authResponses = [
    new Response("<sitemapindex/>", { status: 200 }),
    Response.json({ error: "invalid_grant" }, { status: 401 }),
  ];
  const authFailure = await submitSitemapToSearchConsole({ env, fetchImpl: (async () => authResponses.shift() || new Response(null, { status: 500 })) as typeof fetch });
  assert.equal(authFailure.status, "authentication_error");
  assert.equal(authFailure.submitted, false);
});
