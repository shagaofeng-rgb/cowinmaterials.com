import { getPool } from "@/lib/database";
import { siteUrl } from "@/lib/seo";
import { getSitemapChunk, getSitemapSummary, sitemapKinds } from "./catalog";
import { SitemapLockError, withSitemapLock } from "./lock";
import { submitSitemapToSearchConsole } from "./search-console";
import { compareSnapshots, type SnapshotChanges } from "./snapshot";
import type { SitemapEntry, SitemapKind } from "./types";
import { MAX_SITEMAP_URLS, isWellFormedSitemapXml, renderUrlSet } from "./xml";

type MaintenanceOptions = {
  trigger?: "cron" | "manual" | "content_change";
  force?: boolean;
  dryRun?: boolean;
  submit?: boolean;
};

const globalState = globalThis as typeof globalThis & { __cowinSitemapSnapshot?: Map<string, string> };

async function collectEntries() {
  const entriesByKind = new Map<SitemapKind, SitemapEntry[]>();
  for (const kind of sitemapKinds) {
    const summary = await getSitemapSummary(kind);
    const entries: SitemapEntry[] = [];
    for (let part = 1; part <= Math.ceil(summary.count / MAX_SITEMAP_URLS); part += 1) {
      entries.push(...await getSitemapChunk(kind, part));
    }
    entriesByKind.set(kind, entries);
  }
  return entriesByKind;
}

async function updateSnapshot(entries: SitemapEntry[], dryRun: boolean): Promise<SnapshotChanges> {
  const pool = getPool();
  if (!pool) {
    const previous = globalState.__cowinSitemapSnapshot || new Map<string, string>();
    const changes = compareSnapshots(previous, entries);
    if (!dryRun) globalState.__cowinSitemapSnapshot = new Map(entries.map((entry) => [entry.url, new Date(entry.lastModified).toISOString()]));
    return changes;
  }

  try {
    const existing = await pool.query<{ url: string; last_modified: Date | string }>("select url, last_modified from sitemap_url_snapshots where active = true");
    const previous = new Map(existing.rows.map((row) => [row.url, new Date(row.last_modified).toISOString()]));
    const changes = compareSnapshots(previous, entries);
    if (!dryRun) {
      const urls = entries.map((entry) => entry.url);
      for (const entry of entries) {
        await pool.query(
          `insert into sitemap_url_snapshots (url, last_modified, active, first_seen_at, last_seen_at, removed_at)
           values ($1, $2, true, now(), now(), null)
           on conflict (url) do update set last_modified = excluded.last_modified, active = true, last_seen_at = now(), removed_at = null`,
          [entry.url, new Date(entry.lastModified)],
        );
      }
      if (urls.length) {
        await pool.query("update sitemap_url_snapshots set active = false, removed_at = now() where active = true and not (url = any($1::text[]))", [urls]);
      }
    }
    return changes;
  } catch {
    const previous = globalState.__cowinSitemapSnapshot || new Map<string, string>();
    const changes = compareSnapshots(previous, entries);
    if (!dryRun) globalState.__cowinSitemapSnapshot = new Map(entries.map((entry) => [entry.url, new Date(entry.lastModified).toISOString()]));
    return changes;
  }
}

async function verifyPublicUrls(entries: SitemapEntry[]) {
  const failures: Array<{ url: string; status: number }> = [];
  const queue = [...entries];
  const workers = Array.from({ length: Math.min(6, queue.length) }, async () => {
    while (queue.length) {
      const entry = queue.shift();
      if (!entry) break;
      try {
        const response = await fetch(entry.url, { method: "HEAD", redirect: "manual", signal: AbortSignal.timeout(8_000) });
        if (response.status !== 200) failures.push({ url: entry.url, status: response.status });
      } catch {
        failures.push({ url: entry.url, status: 0 });
      }
    }
  });
  await Promise.all(workers);
  return failures;
}

async function verifyRobotsDeclaration() {
  try {
    const response = await fetch(`${siteUrl}/robots.txt`, { signal: AbortSignal.timeout(8_000) });
    if (!response.ok) return false;
    const text = await response.text();
    return text.includes(`Sitemap: ${siteUrl}/sitemap.xml`);
  } catch {
    return false;
  }
}

async function saveRun(result: Record<string, unknown>) {
  console.info(JSON.stringify({ event: "sitemap_maintenance", ...result }));
  const pool = getPool();
  if (!pool) return;
  try {
    await pool.query(
      `insert into sitemap_runs (
        trigger_type, status, started_at, finished_at, duration_ms, files_processed,
        urls_processed, urls_successful, urls_skipped, urls_failed, total_bytes,
        was_split, added_urls, modified_urls, removed_urls, search_console_submitted,
        search_console_status, message, metadata
      ) values (
        $1, $2, $3, $4, $5, $6,
        $7, $8, $9, $10, $11,
        $12, $13, $14, $15, $16,
        $17, $18, $19::jsonb
      )`,
      [
        result.trigger, result.status, result.startedAt, result.finishedAt, result.durationMs, result.files,
        result.urlCount, result.successCount, result.skippedCount, result.errorCount, result.totalBytes,
        result.wasSplit, result.added, result.modified, result.removed, result.searchConsoleSubmitted,
        result.searchConsoleStatus, result.message, JSON.stringify({ failures: result.failures, dryRun: result.dryRun }),
      ],
    );
  } catch (error) {
    console.warn(JSON.stringify({ event: "sitemap_log_persistence_failed", message: error instanceof Error ? error.message : "Unknown database error" }));
  }
}

export async function runSitemapMaintenance(options: MaintenanceOptions = {}) {
  const startedAt = new Date();
  const trigger = options.trigger || "manual";
  const pool = getPool();

  try {
    return await withSitemapLock(async () => {
      const entriesByKind = await collectEntries();
      const allEntries = [...entriesByKind.values()].flat();
      const files = [...entriesByKind.values()].reduce((count, entries) => count + Math.ceil(entries.length / MAX_SITEMAP_URLS), 0);
      const xmlFiles = [...entriesByKind.values()].flatMap((entries) => {
        const filesForKind: string[] = [];
        for (let offset = 0; offset < entries.length; offset += MAX_SITEMAP_URLS) {
          filesForKind.push(renderUrlSet(entries.slice(offset, offset + MAX_SITEMAP_URLS)));
        }
        return filesForKind;
      });
      const malformed = xmlFiles.filter((xml) => !isWellFormedSitemapXml(xml));
      const totalBytes = xmlFiles.reduce((total, xml) => total + Buffer.byteLength(xml, "utf8"), 0);
      const [failures, robotsValid] = await Promise.all([
        verifyPublicUrls(allEntries),
        verifyRobotsDeclaration(),
      ]);
      const changes = await updateSnapshot(allEntries, Boolean(options.dryRun));
      const changed = Boolean(changes.added.length || changes.modified.length || changes.removed.length);
      const shouldSubmit = Boolean(options.submit || process.env.GOOGLE_SEARCH_CONSOLE_ENABLED === "true") && (changed || options.force);
      const searchConsole = shouldSubmit
        ? await submitSitemapToSearchConsole()
        : { enabled: process.env.GOOGLE_SEARCH_CONSOLE_ENABLED === "true", submitted: false, status: "disabled" as const, message: "No changed sitemap submission was required." };
      const finishedAt = new Date();
      const errorCount = failures.length + malformed.length + (robotsValid ? 0 : 1);
      const result = {
        ok: errorCount === 0,
        status: errorCount === 0 ? "completed" : "completed_with_errors",
        trigger,
        dryRun: Boolean(options.dryRun),
        startedAt: startedAt.toISOString(),
        finishedAt: finishedAt.toISOString(),
        durationMs: finishedAt.getTime() - startedAt.getTime(),
        files,
        urlCount: allEntries.length,
        successCount: allEntries.length - failures.length,
        skippedCount: 0,
        errorCount,
        totalBytes,
        wasSplit: [...entriesByKind.values()].some((entries) => entries.length > MAX_SITEMAP_URLS),
        added: changes.added,
        modified: changes.modified,
        removed: changes.removed,
        failures,
        robotsValid,
        searchConsoleSubmitted: searchConsole.submitted,
        searchConsoleStatus: searchConsole.status,
        message: errorCount === 0 ? "Sitemap index, child files, public URLs and robots declaration are valid." : "Sitemap maintenance found validation errors.",
      };
      await saveRun(result);
      return result;
    }, pool);
  } catch (error) {
    if (error instanceof SitemapLockError) {
      return { ok: false, status: "locked", trigger, message: error.message, startedAt: startedAt.toISOString() };
    }
    const message = error instanceof Error ? error.message : "Sitemap maintenance failed.";
    const result = { ok: false, status: "failed", trigger, message, startedAt: startedAt.toISOString(), finishedAt: new Date().toISOString() };
    await saveRun(result);
    return result;
  }
}
