import { randomUUID } from "node:crypto";
import { getPool } from "@/lib/database";
import { siteUrl } from "@/lib/seo";
import { getSitemapChunk, getSitemapSummary, sitemapKinds } from "./catalog";
import { SitemapLockError, withSitemapLock } from "./lock";
import { submitSitemapToSearchConsole, type SearchConsoleResult } from "./search-console";
import { isSitemapSubmissionFailure, submissionSkipReason } from "./schedule";
import { compareSnapshots, type SnapshotChanges } from "./snapshot";
import type { SitemapEntry, SitemapKind } from "./types";
import { MAX_SITEMAP_BYTES, MAX_SITEMAP_URLS, isWellFormedSitemapXml, renderUrlSet } from "./xml";

type MaintenanceOptions = {
  trigger?: "cron" | "manual" | "content_change";
  dryRun?: boolean;
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

  const client = await pool.connect();
  try {
    await client.query(dryRun ? "begin read only" : "begin");
    const existing = await client.query<{ url: string; last_modified: Date | string }>("select url, last_modified from sitemap_url_snapshots where active = true");
    const previous = new Map(existing.rows.map((row) => [row.url, new Date(row.last_modified).toISOString()]));
    const changes = compareSnapshots(previous, entries);
    if (!dryRun && entries.length) {
      const urls = entries.map((entry) => entry.url);
      await client.query(
        `insert into sitemap_url_snapshots (url, last_modified, active, first_seen_at, last_seen_at, removed_at)
         select url, last_modified, true, now(), now(), null from unnest($1::text[], $2::timestamptz[]) as snapshot(url, last_modified)
         on conflict (url) do update set last_modified = excluded.last_modified, active = true, last_seen_at = now(), removed_at = null`,
        [urls, entries.map((entry) => new Date(entry.lastModified))],
      );
      await client.query("update sitemap_url_snapshots set active = false, removed_at = now() where active = true and not (url = any($1::text[]))", [urls]);
    }
    await client.query("commit");
    return changes;
  } catch (error) {
    await client.query("rollback").catch(() => undefined);
    throw error;
  } finally {
    client.release();
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
        if (response.status !== 200 || /\bnoindex\b/i.test(response.headers.get("x-robots-tag") || "")) failures.push({ url: entry.url, status: response.status });
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

async function verifyLiveSitemapFiles(expectedFiles: Array<{ url: string; entries: SitemapEntry[] }>) {
  const indexUrl = `${siteUrl}/sitemap.xml`;
  const failed: string[] = [];
  const locations = (xml: string) => [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  const matches = (actual: string[], expected: string[]) => {
    const listed = new Set(actual);
    return actual.length === expected.length && listed.size === actual.length && expected.every((url) => listed.has(url));
  };
  try {
    const index = await fetch(indexUrl, { redirect: "error", cache: "no-store", headers: { "cache-control": "no-cache" }, signal: AbortSignal.timeout(8_000) });
    const xml = await index.text();
    if (!index.ok || !isWellFormedSitemapXml(xml) || !xml.includes("<sitemapindex ") ||
        !matches(locations(xml), expectedFiles.map(({ url }) => url))) {
      return [indexUrl];
    }
  } catch {
    return [indexUrl];
  }
  await Promise.all(expectedFiles.map(async ({ url, entries }) => {
    try {
      const response = await fetch(url, { redirect: "error", cache: "no-store", headers: { "cache-control": "no-cache" }, signal: AbortSignal.timeout(8_000) });
      const xml = await response.text();
      if (!response.ok || !isWellFormedSitemapXml(xml) || !xml.includes("<urlset ") || Buffer.byteLength(xml, "utf8") > MAX_SITEMAP_BYTES ||
          !matches(locations(xml), entries.map((entry) => entry.url))) failed.push(url);
    } catch {
      failed.push(url);
    }
  }));
  return failed;
}

async function saveRun(id: string, result: Record<string, unknown>) {
  console.info(JSON.stringify({ event: "sitemap_maintenance", id, ...result }));
  const pool = getPool();
  if (!pool) return false;
  try {
    await pool.query(
      `insert into sitemap_runs (
        trigger_type, status, started_at, finished_at, duration_ms, files_processed,
        urls_processed, urls_successful, urls_skipped, urls_failed, total_bytes,
        was_split, added_urls, modified_urls, removed_urls, search_console_submitted,
        search_console_status, message, metadata, id
      ) values (
        $1, $2, $3, $4, $5, $6,
        $7, $8, $9, $10, $11,
        $12, $13, $14, $15, $16,
        $17, $18, $19::jsonb, $20
      )
      on conflict (id) do update set status = excluded.status, finished_at = excluded.finished_at,
        duration_ms = excluded.duration_ms, search_console_submitted = excluded.search_console_submitted,
        search_console_status = excluded.search_console_status, message = excluded.message, metadata = excluded.metadata`,
      [
        result.trigger, result.status, result.startedAt, result.finishedAt, result.durationMs ?? 0, result.files ?? 0,
        result.urlCount ?? 0, result.successCount ?? 0, result.skippedCount ?? 0, result.urlsFailed ?? 0, result.totalBytes ?? 0,
        result.wasSplit ?? false, result.added ?? [], result.modified ?? [], result.removed ?? [], result.searchConsoleSubmitted ?? false,
        result.searchConsoleStatus, result.message, JSON.stringify({
          failures: result.failures,
          filesFailed: result.filesFailed,
          robotsValid: result.robotsValid,
          errorCount: result.errorCount,
          dryRun: result.dryRun,
          searchConsoleAttempted: result.searchConsoleAttempted,
          searchConsoleHttpStatus: result.searchConsoleHttpStatus,
          searchConsoleMessage: result.searchConsoleMessage,
        }), id,
      ],
    );
    return true;
  } catch (error) {
    console.warn(JSON.stringify({ event: "sitemap_log_persistence_failed", id, error: error instanceof Error ? error.name : "UnknownError" }));
    return false;
  }
}

export async function runSitemapMaintenance(options: MaintenanceOptions = {}) {
  const runId = randomUUID();
  const startedAt = new Date();
  const trigger = options.trigger || "manual";
  const pool = getPool();
  let searchConsoleAttempted = false;

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
      const expectedFiles = [...entriesByKind].flatMap(([kind, entries]) =>
        Array.from({ length: Math.ceil(entries.length / MAX_SITEMAP_URLS) }, (_, part) => ({
          url: `${siteUrl}/sitemaps/${kind}-${part + 1}.xml`,
          entries: entries.slice(part * MAX_SITEMAP_URLS, (part + 1) * MAX_SITEMAP_URLS),
        })));
      const [failures, robotsValid, filesFailed] = await Promise.all([
        verifyPublicUrls(allEntries),
        verifyRobotsDeclaration(),
        verifyLiveSitemapFiles(expectedFiles),
      ]);
      const errorCount = failures.length + malformed.length + filesFailed.length + (robotsValid ? 0 : 1);
      const changes = await updateSnapshot(allEntries, Boolean(options.dryRun) || errorCount > 0);
      const enabled = process.env.GOOGLE_SEARCH_CONSOLE_ENABLED === "true";
      const policy = { now: startedAt, trigger, dryRun: Boolean(options.dryRun), enabled, valid: errorCount === 0, durable: Boolean(pool) };
      let skip = submissionSkipReason(policy);
      if (!skip && pool) {
        const previous = await pool.query<{ attempted_at: Date | null }>(
          "select max(started_at) as attempted_at from sitemap_runs where search_console_submitted or metadata->>'searchConsoleAttempted' = 'true' or search_console_status = 'submission_pending'",
        );
        skip = submissionSkipReason({ ...policy, lastAttempt: previous.rows[0]?.attempted_at });
      }
      const base = {
        trigger,
        dryRun: Boolean(options.dryRun),
        startedAt: startedAt.toISOString(),
        files,
        urlCount: allEntries.length,
        successCount: allEntries.length - failures.length,
        urlsFailed: failures.length,
        skippedCount: 0,
        errorCount,
        totalBytes,
        wasSplit: [...entriesByKind.values()].some((entries) => entries.length > MAX_SITEMAP_URLS),
        added: changes.added,
        modified: changes.modified,
        removed: changes.removed,
        failures,
        filesFailed,
        robotsValid,
      };
      const messages = {
        skipped_validation: "Google submission skipped because validation failed.",
        disabled: "Google submission is disabled.",
        skipped_schedule: "Only the Monday cron can submit to Google.",
        skipped_duplicate: "The current weekly submission has already been attempted.",
        configuration_error: "Google submission requires durable run history.",
      };
      let searchConsole: SearchConsoleResult;
      if (skip) {
        searchConsole = { enabled, submitted: false, status: skip, message: messages[skip] };
      } else {
        // Persist the attempt before the external request so a lost response cannot trigger a second run.
        const reserved = await saveRun(runId, {
          ...base, status: "running", searchConsoleStatus: "submission_pending",
          searchConsoleAttempted: true, message: "Weekly Google submission in progress.",
        });
        searchConsoleAttempted = reserved;
        searchConsole = reserved
          ? await submitSitemapToSearchConsole()
          : { enabled, submitted: false, status: "configuration_error", message: "Could not reserve the weekly submission. Nothing was sent to Google." };
      }
      const finishedAt = new Date();
      const ok = errorCount === 0 && !isSitemapSubmissionFailure(searchConsole.status);
      const result = {
        ...base,
        ok,
        status: ok ? "completed" : "completed_with_errors",
        finishedAt: finishedAt.toISOString(),
        durationMs: finishedAt.getTime() - startedAt.getTime(),
        searchConsoleSubmitted: searchConsole.submitted,
        searchConsoleAttempted,
        searchConsoleStatus: searchConsole.status,
        searchConsoleHttpStatus: searchConsole.httpStatus ?? null,
        searchConsoleMessage: searchConsole.message,
        message: errorCount ? "Sitemap, robots or public URL validation failed." : ok ? "Sitemap, robots and public URL validation passed." : "Public validation passed, but Google submission did not complete.",
      };
      const persisted = await saveRun(runId, result);
      return { ...result, ok: ok && (!pool || persisted), persisted };
    }, pool);
  } catch (error) {
    if (error instanceof SitemapLockError) {
      return { ok: false, persisted: false, status: "locked", trigger, message: error.message, startedAt: startedAt.toISOString() };
    }
    const message = "Sitemap maintenance could not finish. Check the runtime log and database connection.";
    console.warn(JSON.stringify({ event: "sitemap_maintenance_exception", runId, error: error instanceof Error ? error.name : "UnknownError" }));
    const result = { ok: false, status: "failed", trigger, message, searchConsoleAttempted, dryRun: Boolean(options.dryRun), startedAt: startedAt.toISOString(), finishedAt: new Date().toISOString() };
    const persisted = await saveRun(runId, result);
    return { ...result, persisted };
  }
}
