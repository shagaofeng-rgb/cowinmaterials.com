import "server-only";

import { getPool } from "@/lib/database";

async function rows<T extends Record<string, unknown>>(sql: string, values: unknown[] = []) {
  const pool = getPool();
  if (!pool) return [] as T[];
  try {
    return (await pool.query<T>(sql, values)).rows;
  } catch {
    return [] as T[];
  }
}

export async function getNewsOperations() {
  const [summary, jobs, articles] = await Promise.all([
    rows<{ published: string; review: string; failed: string; latest: Date | null }>(
      "select count(*) filter (where status = 'published')::text as published, count(*) filter (where status in ('draft', 'review'))::text as review, count(*) filter (where status in ('rejected', 'archived'))::text as failed, max(updated_at) as latest from news_articles where deleted_at is null",
    ),
    rows<{ id: string; status: string; records_collected: number; records_rejected: number; records_published: number; message: string | null; started_at: Date; finished_at: Date | null }>(
      "select id, status, records_collected, records_rejected, records_published, message, started_at, finished_at from news_jobs order by started_at desc limit 20",
    ),
    rows<{ id: string; title: string; slug: string; status: string; source_publisher: string; published_at: Date | null; updated_at: Date }>(
      "select id, title, slug, status, source_publisher, published_at, updated_at from news_articles where deleted_at is null order by updated_at desc limit 20",
    ),
  ]);
  return { totals: summary[0] || { published: "0", review: "0", failed: "0", latest: null }, jobs, articles };
}

export async function getPublishingOperations() {
  const [sitemapRuns, webhooks, newsJobs, syncJobs] = await Promise.all([
    rows<{ id: string; trigger_type: string; status: string; urls_processed: number; urls_successful: number; urls_failed: number; search_console_submitted: boolean; search_console_status: string | null; started_at: Date; finished_at: Date | null; message: string | null }>(
      "select id, trigger_type, status, urls_processed, urls_successful, urls_failed, search_console_submitted, search_console_status, started_at, finished_at, message from sitemap_runs order by started_at desc limit 20",
    ),
    rows<{ id: string; event_type: string; class_id: string | null; outcome: string; http_status: number; message: string; received_at: Date }>(
      "select id, event_type, class_id, outcome, http_status, message, received_at from blog_webhook_events order by received_at desc limit 20",
    ),
    rows<{ id: string; status: string; records_published: number; message: string | null; started_at: Date; finished_at: Date | null }>(
      "select id, status, records_published, message, started_at, finished_at from news_jobs order by started_at desc limit 20",
    ),
    rows<{ id: string; source: string; status: string; records_synced: number; error_message: string | null; started_at: Date | null; finished_at: Date | null }>(
      "select id, source, status, records_synced, error_message, started_at, finished_at from sync_jobs order by created_at desc limit 20",
    ),
  ]);
  return { sitemapRuns, webhooks, newsJobs, syncJobs };
}
