import { applications, products, resourceSections, site } from "@/lib/data";
import { getDatabaseHealth, getPool } from "@/lib/database";

export const adminNav = [
  { href: "/admin", label: "数据概览", group: "运营" },
  { href: "/admin/inquiries", label: "客户线索", group: "运营" },
  { href: "/admin/analytics", label: "访问与转化", group: "运营" },
  { href: "/admin/products", label: "产品管理", group: "内容" },
  { href: "/admin/categories", label: "产品分类", group: "内容" },
  { href: "/admin/blog", label: "Blog文章", group: "内容" },
  { href: "/admin/news", label: "News运营", group: "内容" },
  { href: "/admin/documents", label: "技术资料", group: "内容" },
  { href: "/admin/media", label: "媒体库", group: "内容" },
  { href: "/admin/seo", label: "SEO中心", group: "增长" },
  { href: "/admin/sync", label: "运行与同步", group: "系统" },
  { href: "/admin/logs", label: "操作日志", group: "系统" },
  { href: "/admin/users", label: "用户与权限", group: "系统" },
  { href: "/admin/settings", label: "系统设置", group: "系统" },
] as const;

export const adminNavGroups = ["运营", "内容", "增长", "系统"].map((label) => ({
  label,
  items: adminNav.filter((item) => item.group === label),
}));

export type AdminModuleKey = (typeof adminNav)[number]["href"] extends `/admin/${infer Key}` ? Key : never;

export type AdminListParams = {
  q?: string;
  page?: string;
  pageSize?: string;
};

export type AdminStatus = "Up to date" | "Pending" | "Syncing" | "Failed" | "Not connected";

export type AdminModuleRow = {
  id: string;
  name: string;
  status: string;
  value: string;
  updatedAt?: string | null;
  href?: string;
  source?: string;
};

export type AdminModuleData = {
  title: string;
  description: string;
  source: string;
  rows: AdminModuleRow[];
  status?: AdminStatus;
  lastSyncedAt?: string | null;
  metrics?: { label: string; value: string | number; note: string }[];
};

function parsePage(value?: string) {
  const page = Number(value || "1");
  return Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
}

function parsePageSize(value?: string) {
  const pageSize = Number(value || "20");
  return [10, 20, 50, 100].includes(pageSize) ? pageSize : 20;
}

function formatDate(value?: Date | string | null) {
  if (!value) return "暂无记录";
  return new Intl.DateTimeFormat("zh-CN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Shanghai",
  }).format(new Date(value));
}

export function paginate<T>(items: T[], params: AdminListParams) {
  const page = parsePage(params.page);
  const pageSize = parsePageSize(params.pageSize);
  const total = items.length;
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const current = Math.min(page, pages);
  const start = (current - 1) * pageSize;

  return { items: items.slice(start, start + pageSize), page: current, pageSize, total, pages };
}

export function getAdminProducts(params: AdminListParams) {
  const query = (params.q || "").trim().toLowerCase();
  const filtered = query
    ? products.filter((product) => [product.name, product.code, product.category, product.summary, product.seoTitle].join(" ").toLowerCase().includes(query))
    : products;

  return paginate(filtered.map((product) => ({ ...product, status: "已发布", language: "English" })), params);
}

export function getAdminProduct(slug: string) {
  return products.find((product) => product.slug === slug) || null;
}

export function getProductCategoryRows(): AdminModuleRow[] {
  return [...new Set(products.map((product) => product.category))].map((category, index) => ({
    id: category,
    name: category,
    status: "已启用",
    value: `${products.filter((product) => product.category === category).length} 个官网产品 · 排序 ${index + 1}`,
    source: "Git 版本化产品目录",
  }));
}

function getMediaRows(): AdminModuleRow[] {
  return [...new Set([...products.map((product) => product.image), ...applications.map((application) => application.image)].filter((image): image is string => Boolean(image)))].map((image) => ({
    id: image,
    name: image.replace("/images/", ""),
    status: "已引用",
    value: image,
    source: "网站受控静态资源",
  }));
}

async function queryRows<T extends Record<string, unknown>>(sql: string, values: unknown[] = []) {
  const pool = getPool();
  if (!pool) return [] as T[];
  const result = await pool.query<T>(sql, values);
  return result.rows;
}

async function scalarCount(sql: string) {
  const rows = await queryRows<{ count: string }>(sql);
  return Number(rows[0]?.count || 0);
}

export async function getAdminDashboard() {
  const database = await getDatabaseHealth();
  const staticCards = [
    { label: "已发布产品", value: products.length, note: "Git 版本化官网目录", href: "/admin/products" },
    { label: "应用场景", value: applications.length, note: "官网应用页面", href: "/applications" },
    { label: "产品分类", value: getProductCategoryRows().length, note: "已关联官网产品", href: "/admin/categories" },
    { label: "技术资料入口", value: resourceSections.length, note: "官网资源中心", href: "/resources" },
  ];

  if (!database.connected) {
    return {
      database,
      cards: staticCards,
      workItems: [{ label: "数据库连接", value: database.message, href: "/admin/sync" }],
      activity: [] as AdminModuleRow[],
      systemStatus: [
        ["内容来源", "产品为 Git 版本化资料；Blog、询盘、News 使用 PostgreSQL。"],
        ["数据库", "未连接，数据库模块将显示未连接状态。"],
        ["最后检查", formatDate(database.checkedAt)],
      ],
      company: [["品牌", site.name], ["公司", site.legalName], ["邮箱", site.email], ["电话", site.phone], ["办公室地址", site.officeAddress]],
    };
  }

  const [blogPublished, blogDraft, inquiriesNew, inquiriesHighPriority, inquiriesOverdue, syncFailed, syncPending, analyticsCount, latestAudit] = await Promise.all([
    scalarCount("select count(*) from articles where class_id in ('blog', '31') and status = 'published' and deleted_at is null"),
    scalarCount("select count(*) from articles where class_id in ('blog', '31') and status = 'draft' and deleted_at is null"),
    scalarCount("select count(*) from inquiries where deleted_at is null and status = 'new' and is_spam = false"),
    scalarCount("select count(*) from inquiries where deleted_at is null and priority in ('high', 'urgent') and status not in ('closed', 'spam')"),
    scalarCount("select count(*) from inquiries where deleted_at is null and next_follow_up_at < now() and status not in ('closed', 'spam')"),
    scalarCount("select count(*) from sync_jobs where status = 'failed'"),
    scalarCount("select count(*) from sync_jobs where status in ('pending', 'running')"),
    scalarCount("select count(*) from analytics_events"),
    queryRows<{ id: string; module: string; action: string; target_id: string | null; created_at: Date }>("select id, module, action, target_id, created_at from audit_logs order by created_at desc limit 10"),
  ]);

  const activity = latestAudit.map((row) => ({
    id: row.id,
    name: `${row.module} · ${row.action}`,
    status: "已记录",
    value: row.target_id ? `记录 ${row.target_id}` : "系统操作",
    updatedAt: row.created_at.toISOString(),
    source: "PostgreSQL audit_logs",
    href: "/admin/logs",
  }));

  return {
    database,
    cards: [
      ...staticCards,
      { label: "Blog", value: blogPublished, note: `${blogDraft} 篇草稿`, href: "/admin/blog" },
      { label: "客户表单", value: inquiriesNew, note: `${inquiriesHighPriority} 条高优先级 · ${inquiriesOverdue} 条逾期`, href: "/admin/inquiries" },
      { label: "同步健康度", value: syncFailed ? "异常" : syncPending ? "待处理" : "正常", note: `${syncPending} 待处理 · ${syncFailed} 失败`, href: "/admin/sync" },
      { label: "访问事件", value: analyticsCount || "未连接", note: analyticsCount ? "内部事件记录" : "暂无真实分析事件", href: "/admin/analytics" },
    ],
    workItems: [
      { label: "新询盘", value: `${inquiriesNew} 条新线索 · ${inquiriesHighPriority} 条高优先级`, href: "/admin/inquiries" },
      { label: "同步任务", value: syncFailed ? `${syncFailed} 个失败任务` : syncPending ? `${syncPending} 个待处理任务` : "当前没有待处理任务", href: "/admin/sync" },
      { label: "Blog 草稿", value: `${blogDraft} 篇草稿`, href: "/admin/blog" },
    ],
    activity,
    systemStatus: [
      ["内容来源", "产品/分类/官网图片为 Git 版本化资料；Blog、询盘、News 由 PostgreSQL 提供。"],
      ["数据库", database.message],
      ["表单通知", `发送至 ${site.email}`],
      ["后台权限", "单管理员 Cookie 会话"],
      ["最后检查", formatDate(database.checkedAt)],
    ],
    company: [["品牌", site.name], ["公司", site.legalName], ["邮箱", site.email], ["电话", site.phone], ["办公室地址", site.officeAddress], ["生产地点地址", site.manufacturingFacilityAddress]],
  };
}

export async function getAdminModuleData(module: string): Promise<AdminModuleData | null> {
  const database = await getDatabaseHealth();
  const databaseSource = database.connected ? "PostgreSQL 实时查询" : "数据库未连接";

  if (module === "categories") return { title: "产品分类", description: "分类是官网产品信息架构的来源。当前目录由版本化技术资料维护，避免后台显示无法发布的伪编辑。", source: "Git 版本化产品目录", rows: getProductCategoryRows(), status: "Up to date" };
  if (module === "media") return { title: "媒体库", description: "列出官网已引用的受控静态图片。未连接独立媒体存储，因此不提供伪上传或删除操作。", source: "网站受控静态资源", rows: getMediaRows(), status: "Up to date" };
  if (module === "users") return { title: "用户与权限", description: "当前为单管理员会话模式。账号与密钥仅保存在服务器环境变量，不会在后台展示。", source: "服务器会话配置", rows: [{ id: "admin", name: process.env.ADMIN_USERNAME || "admin", status: "超级管理员", value: "拥有当前后台全部管理权限", source: "环境变量（不展示密钥）" }], status: "Up to date" };
  if (module === "settings") return { title: "系统设置", description: "公司与通知配置的权威来源是部署环境与版本化站点资料。高风险设置不能在此页面假装直接修改。", source: "环境变量与 Git 版本化站点资料", rows: [{ id: "brand", name: "网站品牌", status: "已配置", value: site.name }, { id: "timezone", name: "后台时区", status: "已配置", value: "Asia/Shanghai" }, { id: "mail", name: "表单邮件通知", status: "已配置", value: site.email }, { id: "deployment", name: "部署配置", status: "Vercel 管理", value: "环境变量需要在 Vercel 项目设置中修改" }], status: "Up to date" };

  if (!database.connected) {
    const titles: Record<string, [string, string]> = {
      inquiries: ["客户表单", "客户询盘由 PostgreSQL 保存，数据库不可用时不显示缓存或模拟记录。"],
      analytics: ["访问分析", "仅展示已接入的真实分析事件；数据库不可用时不会编造统计。"],
      seo: ["SEO数据", "站内基础 SEO 仍可用；数据库检查记录当前不可读取。"],
      logs: ["操作日志", "操作日志存储于 PostgreSQL，当前无法读取。"],
      sync: ["数据同步", "同步任务存储于 PostgreSQL，当前无法读取。"],
    };
    const [title, description] = titles[module] || ["管理模块", "该模块当前不可用。"];
    return { title, description, source: databaseSource, rows: [], status: "Not connected" };
  }

  if (module === "inquiries") {
    const rows = await queryRows<{ id: string; name: string; company: string | null; email: string; country: string | null; request_type: string | null; product: string | null; status: string; created_at: Date }>("select id, name, company, email, country, request_type, product, status, created_at from inquiries where deleted_at is null order by created_at desc limit 100");
    return { title: "客户表单", description: "官网询盘的真实数据库记录。客户原文仅在受保护详情页中显示。", source: databaseSource, rows: rows.map((row) => ({ id: row.id, name: row.name, status: row.status, value: [row.company, row.country, row.request_type, row.product].filter(Boolean).join(" · ") || row.email, updatedAt: row.created_at.toISOString(), href: `/admin/inquiries/${row.id}`, source: databaseSource })), status: "Up to date" };
  }
  if (module === "analytics") {
    const [rows, summary] = await Promise.all([
      queryRows<{ id: string; event_name: "page_view" | "whatsapp_click"; page_path: string | null; placement: string | null; occurred_at: Date }>("select id, event_name, page_path, metadata->>'placement' as placement, occurred_at from analytics_events where event_name in ('page_view', 'whatsapp_click') order by occurred_at desc limit 100"),
      queryRows<{ pageViews: string; pageViews7Days: string; whatsappClicks: string; latest: Date | null }>("select count(*) filter (where event_name = 'page_view') as \"pageViews\", count(*) filter (where event_name = 'page_view' and occurred_at >= now() - interval '7 days') as \"pageViews7Days\", count(*) filter (where event_name = 'whatsapp_click') as \"whatsappClicks\", max(occurred_at) as latest from analytics_events where event_name in ('page_view', 'whatsapp_click')"),
    ]);
    const totals = summary[0] || { pageViews: "0", pageViews7Days: "0", whatsappClicks: "0", latest: null };
    const pageViews = Number(totals.pageViews);
    const whatsappClicks = Number(totals.whatsappClicks);
    const whatsappRate = pageViews ? (whatsappClicks / pageViews) * 100 : 0;
    return {
      title: "访问与 WhatsApp 转化",
      description: "同步显示全站公共页面访问和右侧 WhatsApp 悬浮入口点击。数据直接写入官网 PostgreSQL 事件表，不保存访客联系方式、聊天内容或独立访客身份。",
      source: databaseSource,
      metrics: [
        { label: "累计页面访问", value: pageViews, note: "公共页面匿名访问事件" },
        { label: "近 7 天访问", value: Number(totals.pageViews7Days), note: "滚动时间窗口" },
        { label: "WhatsApp 点击", value: whatsappClicks, note: "右侧悬浮入口" },
        { label: "WhatsApp 点击率", value: pageViews ? `${whatsappRate.toFixed(1)}%` : "—", note: pageViews ? "点击 / 已记录页面访问" : "等待页面访问数据" },
      ],
      rows: rows.map((row) => ({ id: row.id, name: row.event_name === "whatsapp_click" ? "WhatsApp 悬浮入口" : "页面访问", status: row.event_name === "whatsapp_click" ? "转化" : "访问", value: [row.page_path || "未记录页面路径", row.placement === "floating_whatsapp" ? "右侧悬浮入口" : null].filter(Boolean).join(" · "), updatedAt: row.occurred_at.toISOString(), source: "PostgreSQL 匿名事件" })),
      status: "Up to date",
      lastSyncedAt: totals.latest?.toISOString() || null,
    };
  }
  if (module === "logs") {
    const rows = await queryRows<{ id: string; action: string; module: string; target_id: string | null; created_at: Date }>("select id, action, module, target_id, created_at from audit_logs order by created_at desc limit 200");
    return { title: "操作日志", description: "仅追加的后台操作记录。敏感凭据、完整客户内容和密钥不会写入日志。", source: databaseSource, rows: rows.map((row) => ({ id: row.id, name: `${row.module} · ${row.action}`, status: "成功", value: row.target_id ? `记录 ${row.target_id}` : "系统记录", updatedAt: row.created_at.toISOString(), source: databaseSource })), status: "Up to date" };
  }
  if (module === "sync") {
    const rows = await queryRows<{ id: string; source: string; status: string; records_synced: number; error_message: string | null; started_at: Date | null; finished_at: Date | null }>("select id, source, status, records_synced, error_message, started_at, finished_at from sync_jobs order by created_at desc limit 100");
    return { title: "数据同步", description: "显示已落库的同步任务。产品、分类与官网图片同源于版本化资料，不会执行无意义的复制同步。", source: databaseSource, rows: rows.map((row) => ({ id: row.id, name: row.source, status: row.status, value: row.error_message || `影响 ${row.records_synced} 条记录`, updatedAt: (row.finished_at || row.started_at)?.toISOString() || null, source: databaseSource })), status: rows.some((row) => row.status === "failed") ? "Failed" : rows.some((row) => ["pending", "running"].includes(row.status)) ? "Pending" : "Up to date" };
  }
  if (module === "seo") {
    const rows = await queryRows<{ source: string; page_path: string | null; issue_code: string | null; issue_message: string | null; captured_at: Date }>("select source, page_path, issue_code, issue_message, captured_at from seo_snapshots order by captured_at desc limit 100");
    const baseRows: AdminModuleRow[] = [{ id: "sitemap", name: "Sitemap", status: "已上线", value: "/sitemap.xml · 每 3 天维护", source: "Next.js route + Vercel Cron" }, { id: "robots", name: "Robots", status: "已上线", value: "/robots.txt", source: "Next.js route" }, { id: "llms", name: "AI 发现文件", status: "已上线", value: "/llms.txt", source: "Next.js route" }];
    return { title: "SEO数据", description: "站内 SEO 基础配置与已保存的真实检查快照。Search Console 未授权时不展示虚构的点击或收录数据。", source: rows.length ? databaseSource : "Next.js SEO 路由", rows: [...baseRows, ...rows.map((row, index) => ({ id: `snapshot-${index}`, name: row.issue_code || row.source, status: row.issue_code ? "需处理" : "已检查", value: row.issue_message || row.page_path || "站内快照", updatedAt: row.captured_at.toISOString(), source: databaseSource }))], status: "Up to date" };
  }

  return null;
}

export function formatAdminDate(value?: Date | string | null) {
  return formatDate(value);
}
