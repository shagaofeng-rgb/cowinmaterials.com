import "server-only";

import { getPool } from "@/lib/database";
import { getAdminDateRange, parsePage, parsePageSize, type AdminListParams } from "@/lib/admin-listing";

async function rows<T extends Record<string, unknown>>(sql: string, values: unknown[] = []) {
  const pool = getPool();
  if (!pool) return [] as T[];
  try {
    return (await pool.query<T>(sql, values)).rows;
  } catch {
    return [] as T[];
  }
}

type OperationListParams = AdminListParams & { jobsPage?: string; articlesPage?: string; sitemapPage?: string; webhookPage?: string; newsPage?: string; syncPage?: string };

function datePredicate(column: string, range: ReturnType<typeof getAdminDateRange>, values: unknown[]) {
  const clauses: string[] = [];
  if (range.start) { values.push(range.start); clauses.push(`${column} >= $${values.length}`); }
  if (range.end) { values.push(range.end); clauses.push(`${column} < $${values.length}`); }
  return clauses;
}

function paging(value: string | undefined, pageSize: number, total: number) {
  const requested = parsePage(value);
  const pages = Math.max(1, Math.ceil(total / pageSize));
  return { page: Math.min(requested, pages), pages };
}

export async function getNewsOperations(params: OperationListParams = {}) {
  const range = getAdminDateRange(params);
  const pageSize = parsePageSize(params.pageSize);
  const articleValues: unknown[] = [];
  const articleDate = datePredicate("updated_at", range, articleValues);
  const articleWhere = ["deleted_at is null", ...articleDate].join(" and ");
  const jobValues: unknown[] = [];
  const jobDate = datePredicate("started_at", range, jobValues);
  const jobWhere = jobDate.length ? `where ${jobDate.join(" and ")}` : "";
  const [summary, articleCount, jobCount] = await Promise.all([
    rows<{ published: string; review: string; failed: string; latest: Date | null }>(
      `select count(*) filter (where status = 'published')::text as published, count(*) filter (where status in ('draft', 'review'))::text as review, count(*) filter (where status in ('rejected', 'archived'))::text as failed, max(updated_at) as latest from news_articles where ${articleWhere}`,
      articleValues,
    ),
    rows<{ count: string }>(`select count(*)::text as count from news_articles where ${articleWhere}`, articleValues),
    rows<{ count: string }>(`select count(*)::text as count from news_jobs ${jobWhere}`, jobValues),
  ]);
  const articleTotal = Number(articleCount[0]?.count || 0);
  const jobTotal = Number(jobCount[0]?.count || 0);
  const articlePaging = paging(params.articlesPage || params.page, pageSize, articleTotal);
  const jobPaging = paging(params.jobsPage || params.page, pageSize, jobTotal);
  const articleQueryValues = [...articleValues, pageSize, (articlePaging.page - 1) * pageSize];
  const jobQueryValues = [...jobValues, pageSize, (jobPaging.page - 1) * pageSize];
  const [jobs, articles] = await Promise.all([
    rows<{ id: string; status: string; records_collected: number; records_rejected: number; records_published: number; message: string | null; metadata: Record<string, unknown>; started_at: Date; finished_at: Date | null }>(
      `select id, status, records_collected, records_rejected, records_published, message, metadata, started_at, finished_at from news_jobs ${jobWhere} order by started_at desc limit $${jobQueryValues.length - 1} offset $${jobQueryValues.length}`,
      jobQueryValues,
    ),
    rows<{ id: string; title: string; slug: string; status: string; source_publisher: string; published_at: Date | null; updated_at: Date }>(
      `select id, title, slug, status, source_publisher, published_at, updated_at from news_articles where ${articleWhere} order by updated_at desc limit $${articleQueryValues.length - 1} offset $${articleQueryValues.length}`,
      articleQueryValues,
    ),
  ]);
  return { totals: summary[0] || { published: "0", review: "0", failed: "0", latest: null }, jobs, articles, range, pageSize, jobTotal, articleTotal, jobPaging, articlePaging };
}

async function pagedOperationRows<T extends Record<string, unknown>>({
  select,
  table,
  timeColumn,
  pageValue,
  params,
}: {
  select: string;
  table: string;
  timeColumn: string;
  pageValue?: string;
  params: OperationListParams;
}) {
  const range = getAdminDateRange(params);
  const pageSize = parsePageSize(params.pageSize);
  const values: unknown[] = [];
  const date = datePredicate(timeColumn, range, values);
  const where = date.length ? `where ${date.join(" and ")}` : "";
  const count = await rows<{ count: string }>(`select count(*)::text as count from ${table} ${where}`, values);
  const total = Number(count[0]?.count || 0);
  const pagination = paging(pageValue || params.page, pageSize, total);
  values.push(pageSize, (pagination.page - 1) * pageSize);
  const records = await rows<T>(`${select} from ${table} ${where} order by ${timeColumn} desc limit $${values.length - 1} offset $${values.length}`, values);
  return { records, total, pagination, range, pageSize };
}

export async function getPublishingOperations(params: OperationListParams = {}) {
  const [sitemap, webhooks, news, sync] = await Promise.all([
    pagedOperationRows<{ id: string; trigger_type: string; status: string; urls_processed: number; urls_successful: number; urls_failed: number; search_console_submitted: boolean; search_console_status: string | null; started_at: Date; finished_at: Date | null; message: string | null }>({ select: "select id, trigger_type, status, urls_processed, urls_successful, urls_failed, search_console_submitted, search_console_status, started_at, finished_at, message", table: "sitemap_runs", timeColumn: "started_at", pageValue: params.sitemapPage, params }),
    pagedOperationRows<{ id: string; event_type: string; class_id: string | null; outcome: string; http_status: number; message: string; received_at: Date }>({ select: "select id, event_type, class_id, outcome, http_status, message, received_at", table: "blog_webhook_events", timeColumn: "received_at", pageValue: params.webhookPage, params }),
    pagedOperationRows<{ id: string; status: string; records_published: number; message: string | null; started_at: Date; finished_at: Date | null }>({ select: "select id, status, records_published, message, started_at, finished_at", table: "news_jobs", timeColumn: "started_at", pageValue: params.newsPage, params }),
    pagedOperationRows<{ id: string; source: string; status: string; records_synced: number; error_message: string | null; started_at: Date | null; finished_at: Date | null }>({ select: "select id, source, status, records_synced, error_message, started_at, finished_at", table: "sync_jobs", timeColumn: "created_at", pageValue: params.syncPage, params }),
  ]);
  return {
    sitemapRuns: sitemap.records, webhooks: webhooks.records, newsJobs: news.records, syncJobs: sync.records,
    range: sitemap.range, pageSize: sitemap.pageSize,
    sitemapTotal: sitemap.total, webhookTotal: webhooks.total, newsTotal: news.total, syncTotal: sync.total,
    sitemapPaging: sitemap.pagination, webhookPaging: webhooks.pagination, newsPaging: news.pagination, syncPaging: sync.pagination,
  };
}
