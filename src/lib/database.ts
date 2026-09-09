import { Pool, type PoolClient } from "pg";
import type { InquiryPayload } from "@/lib/mail";
import { getAdminDateRange, parsePage, parsePageSize, type AdminDateRange, type AdminListParams } from "@/lib/admin-listing";

export type DatabaseHealth = {
  configured: boolean;
  connected: boolean;
  message: string;
  checkedAt: string;
};

let pool: Pool | null = null;
let directPool: Pool | null = null;

function normalizedConnectionString(value: string) {
  const url = new URL(value);
  url.searchParams.delete("sslmode");
  url.searchParams.delete("channel_binding");
  return url.toString();
}

function pathFromPageUrl(value?: string) {
  if (!value) return "/contact";
  try {
    const url = new URL(value);
    return url.pathname.startsWith("/") ? url.pathname.slice(0, 260) : "/contact";
  } catch {
    return "/contact";
  }
}

export function hasDatabaseUrl() {
  return Boolean(process.env.DATABASE_URL);
}

export function getPool(preferDirectConnection = false) {
  const connectionString = preferDirectConnection
    ? process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL
    : process.env.DATABASE_URL;
  if (!connectionString) {
    return null;
  }

  const existingPool = preferDirectConnection ? directPool : pool;
  if (existingPool) return existingPool;

  const createdPool = new Pool({
    connectionString: normalizedConnectionString(connectionString),
    connectionTimeoutMillis: 8000,
    max: 5,
    ssl: process.env.DATABASE_SSL === "false" ? false : { rejectUnauthorized: false },
  });

  if (preferDirectConnection) directPool = createdPool;
  else pool = createdPool;
  return createdPool;
}

export async function getDatabaseHealth(): Promise<DatabaseHealth> {
  const checkedAt = new Date().toISOString();
  const activePool = getPool();

  if (!activePool) {
    return {
      configured: false,
      connected: false,
      message: "当前使用官网内容目录和邮箱通知作为数据来源。",
      checkedAt,
    };
  }

  try {
    await activePool.query("select 1 as ok");
    return {
      configured: true,
      connected: true,
      message: "PostgreSQL 连接正常。",
      checkedAt,
    };
  } catch {
    return {
      configured: true,
      connected: false,
      message: "数据库连接需要检查。",
      checkedAt,
    };
  }
}

export async function saveInquiryRecord(payload: InquiryPayload) {
  const activePool = getPool();
  if (!activePool) {
    return { saved: false, reason: "database_not_configured" };
  }

  const client = await activePool.connect();
  try {
    await client.query("begin");
    let visitorId: string | null = null;
    let visitorSessionId: string | null = null;
    let customerIdentityId: string | null = null;

    if (isUuid(payload.visitorKey)) {
      const pagePath = pathFromPageUrl(payload.page);
      const visitor = await client.query<{ id: string }>(
        `insert into analytics_visitors (
          visitor_key, first_seen_at, last_seen_at, first_landing_path, last_path, first_utm, last_utm, created_at, updated_at
        ) values ($1, now(), now(), $2, $2, $3::jsonb, $3::jsonb, now(), now())
        on conflict (visitor_key) do update set last_seen_at = now(), last_path = excluded.last_path, updated_at = now()
        returning id`,
        [payload.visitorKey, pagePath, JSON.stringify(payload.utm || {})],
      );
      visitorId = visitor.rows[0]?.id || null;
    }

    if (visitorId && isUuid(payload.sessionKey)) {
      const session = await client.query<{ id: string }>(
        `insert into analytics_sessions (
          session_key, visitor_id, started_at, last_seen_at, landing_path, exit_path, utm, source, event_count, created_at, updated_at
        ) values ($1, $2, now(), now(), $3, $3, $4::jsonb, 'website', 0, now(), now())
        on conflict (session_key) do update set last_seen_at = now(), exit_path = excluded.exit_path, updated_at = now()
        returning id`,
        [payload.sessionKey, visitorId, pathFromPageUrl(payload.page), JSON.stringify(payload.utm || {})],
      );
      visitorSessionId = session.rows[0]?.id || null;
    }

    if (visitorId) {
      const customer = await client.query<{ id: string }>(
        `insert into analytics_customers (email_hash, first_identified_at, last_identified_at, updated_at)
         values (encode(digest(lower(trim($1)), 'sha256'), 'hex'), now(), now(), now())
         on conflict (email_hash) do update set last_identified_at = now(), updated_at = now()
         returning id`,
        [payload.email],
      );
      customerIdentityId = customer.rows[0]?.id || null;
      if (customerIdentityId) {
        await client.query("update analytics_visitors set customer_id = $2, updated_at = now() where id = $1", [visitorId, customerIdentityId]);
      }
    }
    const result = await client.query<{ id: string }>(
    `insert into inquiries (
      name, company, email, phone, country, customer_type, request_type,
      product, application, message, page_url, utm, project_details, visitor_id, visitor_session_id,
      customer_identity_id, created_at, updated_at
    ) values (
      $1, $2, $3, $4, $5, $6, $7,
      $8, $9, $10, $11, $12::jsonb, $13::jsonb, $14, $15, $16, $17, $17
    ) returning id`,
    [
      payload.name,
      payload.company || null,
      payload.email,
      payload.phone || null,
      payload.country || null,
      payload.customerType || null,
      payload.requestType || null,
      payload.product || null,
      payload.application || null,
      payload.message || null,
      payload.page || null,
      JSON.stringify(payload.utm || {}),
      JSON.stringify({
        substrate: payload.substrate || null,
        operatingTemperature: payload.operatingTemperature || null,
        targetPerformance: payload.targetPerformance || null,
        quantity: payload.quantity || null,
        requiredStandard: payload.requiredStandard || null,
        purchaseTime: payload.purchaseTime || null,
      }),
      visitorId,
      visitorSessionId,
      customerIdentityId,
      payload.submittedAt ? new Date(payload.submittedAt) : new Date(),
    ],
    );
    const id = result.rows[0]?.id;
    if (!id) throw new Error("Inquiry record was not created.");
    if (visitorId) {
      await client.query(
        "insert into analytics_visitor_inquiries (visitor_id, inquiry_id) values ($1, $2) on conflict do nothing",
        [visitorId, id],
      );
    }
    await client.query(
      `insert into audit_logs (action, module, target_id, metadata)
       values ('create', 'inquiries', $1, $2::jsonb)`,
      [id, JSON.stringify({ source: "website_form" })],
    );
    await client.query("commit");
    return { saved: true, id };
  } catch (error) {
    await client.query("rollback");
    throw error;
  } finally {
    client.release();
  }
}

export type AnalyticsEventName =
  | "page_view"
  | "whatsapp_click"
  | "form_submit"
  | "email_click"
  | "phone_click"
  | "request_tds"
  | "request_sample"
  | "request_quote";

type AnalyticsEventInput = {
  eventId: string;
  eventName: AnalyticsEventName;
  pagePath: string;
  source: "website";
  placement?: "floating_whatsapp";
  requestType?: string;
  visitorKey?: string;
  sessionKey?: string;
  referrerPath?: string;
  referrerHost?: string;
  utm?: Record<string, string>;
  device?: string;
};

function isUuid(value?: string) {
  return Boolean(value && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value));
}

async function upsertAnalyticsIdentity(client: PoolClient, input: AnalyticsEventInput) {
  if (!isUuid(input.visitorKey) || !isUuid(input.sessionKey)) return { visitorId: null, sessionId: null };
  const utm = input.utm && Object.keys(input.utm).length ? input.utm : {};
  const visitor = await client.query<{ id: string }>(
    `insert into analytics_visitors (
      visitor_key, first_seen_at, last_seen_at, first_landing_path, last_path,
      first_referrer_host, last_referrer_host, first_utm, last_utm, created_at, updated_at
    ) values ($1, now(), now(), $2, $2, $3, $3, $4::jsonb, $4::jsonb, now(), now())
    on conflict (visitor_key) do update set
      last_seen_at = now(), last_path = excluded.last_path,
      last_referrer_host = coalesce(excluded.last_referrer_host, analytics_visitors.last_referrer_host),
      last_utm = case when excluded.last_utm <> '{}'::jsonb then excluded.last_utm else analytics_visitors.last_utm end,
      updated_at = now()
    returning id`,
    [input.visitorKey, input.pagePath, input.referrerHost || null, JSON.stringify(utm)],
  );
  const visitorId = visitor.rows[0]?.id || null;
  if (!visitorId) return { visitorId: null, sessionId: null };

  const session = await client.query<{ id: string }>(
    `insert into analytics_sessions (
      session_key, visitor_id, started_at, last_seen_at, landing_path, exit_path,
      referrer_path, referrer_host, utm, device, source, event_count, created_at, updated_at
    ) values ($1, $2, now(), now(), $3, $3, $4, $5, $6::jsonb, $7, $8, 1, now(), now())
    on conflict (session_key) do update set
      last_seen_at = now(), exit_path = excluded.exit_path,
      referrer_path = coalesce(analytics_sessions.referrer_path, excluded.referrer_path),
      referrer_host = coalesce(analytics_sessions.referrer_host, excluded.referrer_host),
      event_count = analytics_sessions.event_count + 1, updated_at = now()
    returning id`,
    [input.sessionKey, visitorId, input.pagePath, input.referrerPath || null, input.referrerHost || null, JSON.stringify(utm), input.device || null, input.source],
  );
  return { visitorId, sessionId: session.rows[0]?.id || null };
}

export async function recordAnalyticsEvent(input: AnalyticsEventInput) {
  const activePool = getPool();
  if (!activePool) return { recorded: false, duplicate: false };
  const client = await activePool.connect();
  try {
    await client.query("begin");
    const existing = await client.query("select 1 from analytics_events where event_id = $1", [input.eventId]);
    if (existing.rowCount) {
      await client.query("rollback");
      return { recorded: false, duplicate: true };
    }
    const identity = await upsertAnalyticsIdentity(client, input);
    const result = await client.query<{ id: string }>(
      `insert into analytics_events (
        event_id, event_name, page_path, source, occurred_at, metadata,
        visitor_id, session_id, referrer_path, referrer_host, device
      ) values ($1, $2, $3, $4, now(), $5::jsonb, $6, $7, $8, $9, $10)
      on conflict (event_id) do nothing returning id`,
      [
        input.eventId, input.eventName, input.pagePath, input.source,
        JSON.stringify({ ...(input.placement ? { placement: input.placement } : {}), ...(input.requestType ? { request_type: input.requestType } : {}), ...(input.utm && Object.keys(input.utm).length ? { utm: input.utm } : {}) }),
        identity.visitorId, identity.sessionId, input.referrerPath || null, input.referrerHost || null, input.device || null,
      ],
    );
    if (!result.rowCount) {
      await client.query("rollback");
      return { recorded: false, duplicate: true };
    }
    await client.query("commit");
    return { recorded: true, duplicate: false };
  } catch (error) {
    await client.query("rollback").catch(() => undefined);
    throw error;
  } finally {
    client.release();
  }
}

export type AdminAnalyticsFilters = AdminListParams;

export type AdminAnalyticsVisitor = {
  id: string;
  label: string;
  company: string | null;
  email: string | null;
  firstSeenAt: string;
  lastSeenAt: string;
  landingPath: string | null;
  lastPath: string | null;
  referrerHost: string | null;
  sessions: number;
  events: number;
  contactActions: number;
};

type AnalyticsQueryParts = {
  clauses: string[];
  values: unknown[];
  bind: (value: unknown) => string;
};

function analyticsQueryParts(range: AdminDateRange): AnalyticsQueryParts {
  const clauses: string[] = [];
  const values: unknown[] = [];
  const bind = (value: unknown) => {
    values.push(value);
    return `$${values.length}`;
  };
  if (range.start) clauses.push(`e.occurred_at >= ${bind(range.start)}`);
  if (range.end) clauses.push(`e.occurred_at < ${bind(range.end)}`);
  return { clauses, values, bind };
}

function eventWindow(parts: AnalyticsQueryParts) {
  return parts.clauses.length ? `and ${parts.clauses.join(" and ")}` : "";
}

export async function getAdminAnalyticsOverview(filters: AdminAnalyticsFilters = {}) {
  const activePool = getPool();
  const range = getAdminDateRange(filters);
  const pageSize = parsePageSize(filters.pageSize);
  const requestedPage = parsePage(filters.page);
  if (!activePool) return {
    range, metrics: { pageViews: 0, visitors: 0, sessions: 0, formSubmits: 0, whatsappClicks: 0, contactActions: 0, latest: null as string | null },
    visitors: [] as AdminAnalyticsVisitor[], total: 0, page: 1, pages: 1, pageSize,
  };

  const metricsParts = analyticsQueryParts(range);
  const metrics = await activePool.query<{
    page_views: string; visitors: string; sessions: string; form_submits: string; whatsapp_clicks: string; contact_actions: string; latest: Date | null;
  }>(
    `select
      count(*) filter (where e.event_name = 'page_view')::text as page_views,
      count(distinct e.visitor_id)::text as visitors,
      count(distinct e.session_id)::text as sessions,
      count(*) filter (where e.event_name = 'form_submit')::text as form_submits,
      count(*) filter (where e.event_name = 'whatsapp_click')::text as whatsapp_clicks,
      count(*) filter (where e.event_name in ('whatsapp_click', 'form_submit', 'email_click', 'phone_click', 'request_tds', 'request_sample', 'request_quote'))::text as contact_actions,
      max(e.occurred_at) as latest
    from analytics_events e where true ${eventWindow(metricsParts)}`,
    metricsParts.values,
  );

  const visitorParts = analyticsQueryParts(range);
  const query = filters.q?.trim();
  const visitorClauses = [
    `exists (select 1 from analytics_events e where e.visitor_id = v.id ${eventWindow(visitorParts)})`,
  ];
  if (query) {
    const value = visitorParts.bind(`%${query}%`);
    visitorClauses.push(`(
      v.visitor_key::text ilike ${value}
      or exists (
        select 1 from inquiries i
        where i.customer_identity_id = v.customer_id and i.deleted_at is null
          and (i.name ilike ${value} or i.company ilike ${value} or i.email ilike ${value})
      )
    )`);
  }
  const where = visitorClauses.join(" and ");
  const count = await activePool.query<{ count: string }>(`select count(*)::text as count from analytics_visitors v where ${where}`, visitorParts.values);
  const total = Number(count.rows[0]?.count || 0);
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const page = Math.min(requestedPage, pages);
  const limit = visitorParts.bind(pageSize);
  const offset = visitorParts.bind((page - 1) * pageSize);
  const rows = await activePool.query<{
    id: string; visitor_key: string; first_seen_at: Date; last_seen_at: Date; first_landing_path: string | null; last_path: string | null; last_referrer_host: string | null;
    contact_name: string | null; contact_company: string | null; contact_email: string | null; sessions: string; events: string; contact_actions: string;
  }>(
    `select v.id, v.visitor_key, v.first_seen_at, v.last_seen_at, v.first_landing_path, v.last_path, v.last_referrer_host,
      contact.name as contact_name, contact.company as contact_company, contact.email as contact_email,
      (select count(*) from analytics_sessions s where s.visitor_id = v.id ${range.start ? `and s.last_seen_at >= ${visitorParts.bind(range.start)}` : ""} ${range.end ? `and s.last_seen_at < ${visitorParts.bind(range.end)}` : ""})::text as sessions,
      (select count(*) from analytics_events e where e.visitor_id = v.id ${eventWindow(visitorParts)})::text as events,
      (select count(*) from analytics_events e where e.visitor_id = v.id and e.event_name in ('whatsapp_click', 'form_submit', 'email_click', 'phone_click', 'request_tds', 'request_sample', 'request_quote') ${eventWindow(visitorParts)})::text as contact_actions
    from analytics_visitors v
    left join lateral (
      select i.name, i.company, i.email from inquiries i
      where i.customer_identity_id = v.customer_id and i.deleted_at is null
      order by i.created_at desc limit 1
    ) contact on true
    where ${where}
    order by v.last_seen_at desc
    limit ${limit} offset ${offset}`,
    visitorParts.values,
  );

  const metric = metrics.rows[0] || { page_views: "0", visitors: "0", sessions: "0", form_submits: "0", whatsapp_clicks: "0", contact_actions: "0", latest: null };
  return {
    range,
    metrics: {
      pageViews: Number(metric.page_views), visitors: Number(metric.visitors), sessions: Number(metric.sessions), formSubmits: Number(metric.form_submits),
      whatsappClicks: Number(metric.whatsapp_clicks), contactActions: Number(metric.contact_actions), latest: metric.latest?.toISOString() || null,
    },
    visitors: rows.rows.map((row) => ({
      id: row.id,
      label: row.contact_name || `匿名访客 ${row.visitor_key.slice(0, 8)}`,
      company: row.contact_company,
      email: row.contact_email,
      firstSeenAt: row.first_seen_at.toISOString(), lastSeenAt: row.last_seen_at.toISOString(), landingPath: row.first_landing_path,
      lastPath: row.last_path, referrerHost: row.last_referrer_host, sessions: Number(row.sessions), events: Number(row.events), contactActions: Number(row.contact_actions),
    })),
    total, page, pages, pageSize,
  };
}

export type AdminVisitorJourney = {
  id: string;
  label: string;
  company: string | null;
  email: string | null;
  firstSeenAt: string;
  lastSeenAt: string;
  landingPath: string | null;
  lastPath: string | null;
  referrerHost: string | null;
  sessions: Array<{ id: string; startedAt: string; lastSeenAt: string; landingPath: string | null; exitPath: string | null; referrer: string | null; events: number }>;
  events: Array<{ id: string; name: string; path: string | null; occurredAt: string; source: string | null }>;
  inquiries: Array<{ id: string; name: string; company: string | null; email: string; createdAt: string }>;
  relatedVisitors: Array<{ id: string; label: string; lastSeenAt: string }>;
  totalEvents: number;
  page: number;
  pages: number;
  pageSize: number;
  range: AdminDateRange;
};

export async function getAdminVisitorJourney(id: string, filters: AdminAnalyticsFilters = {}): Promise<AdminVisitorJourney | null> {
  if (!isUuid(id)) return null;
  const activePool = getPool();
  if (!activePool) return null;
  const range = getAdminDateRange(filters);
  const pageSize = parsePageSize(filters.pageSize);
  const requestedPage = parsePage(filters.page);
  const visitor = await activePool.query<{
    id: string; customer_id: string | null; visitor_key: string; first_seen_at: Date; last_seen_at: Date; first_landing_path: string | null; last_path: string | null; last_referrer_host: string | null;
    contact_name: string | null; contact_company: string | null; contact_email: string | null;
  }>(
    `select v.id, v.customer_id, v.visitor_key, v.first_seen_at, v.last_seen_at, v.first_landing_path, v.last_path, v.last_referrer_host,
      contact.name as contact_name, contact.company as contact_company, contact.email as contact_email
     from analytics_visitors v
     left join lateral (
       select i.name, i.company, i.email from inquiries i
       where i.customer_identity_id = v.customer_id and i.deleted_at is null order by i.created_at desc limit 1
     ) contact on true
     where v.id = $1`,
    [id],
  );
  const row = visitor.rows[0];
  if (!row) return null;

  const eventParts = analyticsQueryParts(range);
  const offsetClauses = (clauses: string[], offset: number) => clauses.map((clause) => clause.replace(/\$(\d+)/g, (_, value) => `$${Number(value) + offset}`));
  const eventWhere = ["e.visitor_id = $1", ...offsetClauses(eventParts.clauses, 1)].join(" and ");
  const eventValues = [id, ...eventParts.values];
  const count = await activePool.query<{ count: string }>(`select count(*)::text as count from analytics_events e where ${eventWhere}`, eventValues);
  const totalEvents = Number(count.rows[0]?.count || 0);
  const pages = Math.max(1, Math.ceil(totalEvents / pageSize));
  const page = Math.min(requestedPage, pages);
  eventValues.push(pageSize, (page - 1) * pageSize);
  const events = await activePool.query<{ id: string; event_name: string; page_path: string | null; occurred_at: Date; source: string | null }>(
    `select e.id, e.event_name, e.page_path, e.occurred_at, e.source from analytics_events e
     where ${eventWhere} order by e.occurred_at desc limit $${eventValues.length - 1} offset $${eventValues.length}`,
    eventValues,
  );
  const sessionParts = analyticsQueryParts(range);
  const sessionClauses = offsetClauses(sessionParts.clauses.map((clause) => clause.replace(/e\.occurred_at/g, "s.last_seen_at")), 1);
  const sessions = await activePool.query<{ id: string; started_at: Date; last_seen_at: Date; landing_path: string | null; exit_path: string | null; referrer_path: string | null; referrer_host: string | null; event_count: number }>(
    `select s.id, s.started_at, s.last_seen_at, s.landing_path, s.exit_path, s.referrer_path, s.referrer_host, s.event_count
     from analytics_sessions s where s.visitor_id = $1 ${sessionClauses.length ? `and ${sessionClauses.join(" and ")}` : ""}
     order by s.last_seen_at desc limit 20`,
    [id, ...sessionParts.values],
  );
  const inquiries = await activePool.query<{ id: string; name: string; company: string | null; email: string; created_at: Date }>(
    `select i.id, i.name, i.company, i.email, i.created_at from inquiries i
     where i.customer_identity_id = $1 and i.deleted_at is null order by i.created_at desc limit 50`,
    [row.customer_id],
  );
  const related = row.customer_id ? await activePool.query<{ id: string; visitor_key: string; last_seen_at: Date }>(
    "select id, visitor_key, last_seen_at from analytics_visitors where customer_id = $1 and id <> $2 order by last_seen_at desc limit 20",
    [row.customer_id, id],
  ) : { rows: [] };

  return {
    id: row.id, label: row.contact_name || `匿名访客 ${row.visitor_key.slice(0, 8)}`, company: row.contact_company, email: row.contact_email,
    firstSeenAt: row.first_seen_at.toISOString(), lastSeenAt: row.last_seen_at.toISOString(), landingPath: row.first_landing_path, lastPath: row.last_path, referrerHost: row.last_referrer_host,
    sessions: sessions.rows.map((session) => ({ id: session.id, startedAt: session.started_at.toISOString(), lastSeenAt: session.last_seen_at.toISOString(), landingPath: session.landing_path, exitPath: session.exit_path, referrer: session.referrer_path || session.referrer_host, events: session.event_count })),
    events: events.rows.map((event) => ({ id: event.id, name: event.event_name, path: event.page_path, occurredAt: event.occurred_at.toISOString(), source: event.source })),
    inquiries: inquiries.rows.map((inquiry) => ({ id: inquiry.id, name: inquiry.name, company: inquiry.company, email: inquiry.email, createdAt: inquiry.created_at.toISOString() })),
    relatedVisitors: related.rows.map((relatedVisitor) => ({ id: relatedVisitor.id, label: `匿名访客 ${relatedVisitor.visitor_key.slice(0, 8)}`, lastSeenAt: relatedVisitor.last_seen_at.toISOString() })),
    totalEvents, page, pages, pageSize, range,
  };
}

export async function recordInquiryNotificationResult(inquiryId: string, result: "sent" | "failed") {
  const activePool = getPool();
  if (!activePool) return;

  await activePool.query(
    `insert into audit_logs (action, module, target_id, metadata)
     values ($1, 'inquiries', $2, $3::jsonb)`,
    [`notification_${result}`, inquiryId, JSON.stringify({ channel: "email", result })],
  );
}

export type AdminInquiry = {
  id: string;
  name: string;
  company: string | null;
  email: string;
  phone: string | null;
  country: string | null;
  customerType: string | null;
  requestType: string | null;
  product: string | null;
  application: string | null;
  message: string | null;
  pageUrl: string | null;
  status: string;
  priority: string;
  leadStage: string;
  nextFollowUpAt: string | null;
  lastContactedAt: string | null;
  internalSummary: string | null;
  projectDetails: Record<string, string | null>;
  visitorId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type AdminInquiryNote = {
  id: string;
  note: string;
  authorLabel: string;
  createdAt: string;
};

export type AdminInquiryListItem = {
  id: string;
  name: string;
  company: string | null;
  email: string;
  country: string | null;
  requestType: string | null;
  product: string | null;
  status: string;
  priority: string;
  leadStage: string;
  nextFollowUpAt: string | null;
  isOverdue: boolean;
  visitorId: string | null;
  createdAt: string;
};

export type AdminInquiryFilters = AdminListParams & {
  q?: string;
  status?: string;
  priority?: string;
  stage?: string;
  followUp?: "overdue" | "today";
};

export async function getAdminInquiryList(filters: AdminInquiryFilters = {}) {
  const activePool = getPool();
  const range = getAdminDateRange(filters);
  const pageSize = parsePageSize(filters.pageSize);
  const requestedPage = parsePage(filters.page);
  if (!activePool) return { items: [] as AdminInquiryListItem[], total: 0, page: 1, pageSize, pages: 1, range };
  const clauses = ["deleted_at is null"];
  const values: unknown[] = [];
  const bind = (value: unknown) => {
    values.push(value);
    return `$${values.length}`;
  };
  const query = filters.q?.trim();
  if (query) {
    const value = `%${query}%`;
    const placeholder = bind(value);
    clauses.push(`(name ilike ${placeholder} or company ilike ${placeholder} or email ilike ${placeholder} or product ilike ${placeholder})`);
  }
  if (["new", "in_progress", "closed", "spam"].includes(filters.status || "")) clauses.push(`status = ${bind(filters.status)}`);
  if (["low", "normal", "high", "urgent"].includes(filters.priority || "")) clauses.push(`priority = ${bind(filters.priority)}`);
  if (["new", "qualified", "technical_review", "quotation", "sample", "follow_up", "won", "lost"].includes(filters.stage || "")) clauses.push(`lead_stage = ${bind(filters.stage)}`);
  if (filters.followUp === "overdue") clauses.push("next_follow_up_at < now() and status not in ('closed', 'spam')");
  if (filters.followUp === "today") clauses.push("next_follow_up_at >= date_trunc('day', now()) and next_follow_up_at < date_trunc('day', now()) + interval '1 day'");
  if (range.start) clauses.push(`created_at >= ${bind(range.start)}`);
  if (range.end) clauses.push(`created_at < ${bind(range.end)}`);

  const count = await activePool.query<{ count: string }>(`select count(*)::text as count from inquiries where ${clauses.join(" and ")}`, values);
  const total = Number(count.rows[0]?.count || 0);
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const page = Math.min(requestedPage, pages);
  const limit = bind(pageSize);
  const offset = bind((page - 1) * pageSize);

  const result = await activePool.query<{
    id: string; name: string; company: string | null; email: string; country: string | null; request_type: string | null;
    product: string | null; status: string; priority: string; lead_stage: string; next_follow_up_at: Date | null; is_overdue: boolean; visitor_id: string | null; created_at: Date;
  }>(
    `select id, name, company, email, country, request_type, product, status, priority, lead_stage, next_follow_up_at, visitor_id,
       (next_follow_up_at < now() and status not in ('closed', 'spam')) as is_overdue, created_at
     from inquiries where ${clauses.join(" and ")} order by
       case priority when 'urgent' then 1 when 'high' then 2 when 'normal' then 3 else 4 end,
       next_follow_up_at asc nulls last, created_at desc limit ${limit} offset ${offset}`,
    values,
  );
  const items = result.rows.map((row) => ({
    id: row.id, name: row.name, company: row.company, email: row.email, country: row.country,
    requestType: row.request_type, product: row.product, status: row.status, priority: row.priority,
    leadStage: row.lead_stage, nextFollowUpAt: row.next_follow_up_at?.toISOString() || null, isOverdue: row.is_overdue, visitorId: row.visitor_id, createdAt: row.created_at.toISOString(),
  }));
  return { items, total, page, pageSize, pages, range };
}

export async function getAdminInquiry(id: string): Promise<AdminInquiry | null> {
  const activePool = getPool();
  if (!activePool) return null;
  const result = await activePool.query<{
    id: string; name: string; company: string | null; email: string; phone: string | null; country: string | null;
    customer_type: string | null; request_type: string | null; product: string | null; application: string | null;
    message: string | null; page_url: string | null; status: string; priority: string; lead_stage: string;
    next_follow_up_at: Date | null; last_contacted_at: Date | null; internal_summary: string | null;
    project_details: Record<string, string | null> | null; visitor_id: string | null; created_at: Date; updated_at: Date;
  }>(
    `select id, name, company, email, phone, country, customer_type, request_type, product, application,
      message, page_url, status, priority, lead_stage, next_follow_up_at, last_contacted_at, internal_summary,
      project_details, visitor_id, created_at, updated_at
     from inquiries where id = $1 and deleted_at is null limit 1`,
    [id],
  );
  const row = result.rows[0];
  if (!row) return null;
  return {
    id: row.id, name: row.name, company: row.company, email: row.email, phone: row.phone, country: row.country,
    customerType: row.customer_type, requestType: row.request_type, product: row.product, application: row.application,
    message: row.message, pageUrl: row.page_url, status: row.status, createdAt: row.created_at.toISOString(), updatedAt: row.updated_at.toISOString(),
    priority: row.priority, leadStage: row.lead_stage, nextFollowUpAt: row.next_follow_up_at?.toISOString() || null,
    lastContactedAt: row.last_contacted_at?.toISOString() || null, internalSummary: row.internal_summary,
    projectDetails: row.project_details || {}, visitorId: row.visitor_id,
  };
}

export async function getAdminInquiryNotes(inquiryId: string): Promise<AdminInquiryNote[]> {
  const activePool = getPool();
  if (!activePool) return [];
  const result = await activePool.query<{ id: string; note: string; author_label: string; created_at: Date }>(
    "select id, note, author_label, created_at from inquiry_notes where inquiry_id = $1 order by created_at desc limit 100",
    [inquiryId],
  );
  return result.rows.map((row) => ({ id: row.id, note: row.note, authorLabel: row.author_label, createdAt: row.created_at.toISOString() }));
}

export async function updateAdminInquiryWorkflow(input: {
  id: string;
  status: "new" | "in_progress" | "closed" | "spam";
  priority: "low" | "normal" | "high" | "urgent";
  leadStage: "new" | "qualified" | "technical_review" | "quotation" | "sample" | "follow_up" | "won" | "lost";
  nextFollowUpAt: string | null;
  internalSummary: string | null;
  actor: string;
}) {
  const activePool = getPool();
  if (!activePool) throw new Error("Inquiry database is not configured.");
  const client = await activePool.connect();
  try {
    await client.query("begin");
    const result = await client.query(
      `update inquiries
       set status = $2, priority = $3, lead_stage = $4, next_follow_up_at = $5,
           internal_summary = $6, last_contacted_at = case when $2 = 'in_progress' then now() else last_contacted_at end,
           is_spam = $2 = 'spam', updated_at = now()
       where id = $1 and deleted_at is null`,
      [input.id, input.status, input.priority, input.leadStage, input.nextFollowUpAt, input.internalSummary],
    );
    if (result.rowCount !== 1) throw new Error("Inquiry was not found.");
    await client.query(
      `insert into audit_logs (action, module, target_id, metadata)
       values ('update_workflow', 'inquiries', $1, $2::jsonb)`,
      [input.id, JSON.stringify({ actor: input.actor, status: input.status, priority: input.priority, leadStage: input.leadStage, nextFollowUpAt: input.nextFollowUpAt })],
    );
    await client.query("commit");
  } catch (error) {
    await client.query("rollback");
    throw error;
  } finally {
    client.release();
  }
}

export async function addAdminInquiryNote(input: { inquiryId: string; note: string; actor: string }) {
  const activePool = getPool();
  if (!activePool) throw new Error("Inquiry database is not configured.");
  const client = await activePool.connect();
  try {
    await client.query("begin");
    const inquiry = await client.query("select id from inquiries where id = $1 and deleted_at is null", [input.inquiryId]);
    if (inquiry.rowCount !== 1) throw new Error("Inquiry was not found.");
    await client.query("insert into inquiry_notes (inquiry_id, note, author_label) values ($1, $2, $3)", [input.inquiryId, input.note, input.actor]);
    await client.query("update inquiries set updated_at = now() where id = $1", [input.inquiryId]);
    await client.query(
      `insert into audit_logs (action, module, target_id, metadata)
       values ('add_note', 'inquiries', $1, $2::jsonb)`,
      [input.inquiryId, JSON.stringify({ actor: input.actor, length: input.note.length })],
    );
    await client.query("commit");
  } catch (error) {
    await client.query("rollback");
    throw error;
  } finally {
    client.release();
  }
}

export async function updateAdminInquiryStatus(id: string, status: "new" | "in_progress" | "closed" | "spam", actor: string) {
  const activePool = getPool();
  if (!activePool) throw new Error("Inquiry database is not configured.");
  const client = await activePool.connect();
  try {
    await client.query("begin");
    const result = await client.query(
      `update inquiries set status = $2, is_spam = $2 = 'spam', updated_at = now()
       where id = $1 and deleted_at is null`,
      [id, status],
    );
    if (result.rowCount !== 1) throw new Error("Inquiry was not found.");
    await client.query(
      `insert into audit_logs (action, module, target_id, metadata)
       values ('update_status', 'inquiries', $1, $2::jsonb)`,
      [id, JSON.stringify({ actor, status })],
    );
    await client.query("commit");
  } catch (error) {
    await client.query("rollback");
    throw error;
  } finally {
    client.release();
  }
}
