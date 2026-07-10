import { applications, products, resourceSections, site } from "@/lib/data";
import { getDatabaseHealth } from "@/lib/database";

export const adminNav = [
  { href: "/admin", label: "数据概览" },
  { href: "/admin/products", label: "产品管理" },
  { href: "/admin/categories", label: "产品分类" },
  { href: "/admin/news", label: "新闻管理" },
  { href: "/admin/inquiries", label: "客户表单" },
  { href: "/admin/analytics", label: "访问分析" },
  { href: "/admin/seo", label: "SEO数据" },
  { href: "/admin/media", label: "媒体库" },
  { href: "/admin/users", label: "用户与权限" },
  { href: "/admin/logs", label: "操作日志" },
  { href: "/admin/settings", label: "系统设置" },
  { href: "/admin/sync", label: "数据同步" },
];

export type AdminListParams = {
  q?: string;
  page?: string;
  pageSize?: string;
};

function parsePage(value?: string) {
  const page = Number(value || "1");
  return Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
}

function parsePageSize(value?: string) {
  const pageSize = Number(value || "20");
  return [10, 20, 50, 100].includes(pageSize) ? pageSize : 20;
}

export function paginate<T>(items: T[], params: AdminListParams) {
  const page = parsePage(params.page);
  const pageSize = parsePageSize(params.pageSize);
  const total = items.length;
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const current = Math.min(page, pages);
  const start = (current - 1) * pageSize;

  return {
    items: items.slice(start, start + pageSize),
    page: current,
    pageSize,
    total,
    pages,
  };
}

export function getAdminProducts(params: AdminListParams) {
  const query = (params.q || "").trim().toLowerCase();
  const filtered = query
    ? products.filter((product) =>
        [product.name, product.code, product.category, product.summary, product.seoTitle]
          .join(" ")
          .toLowerCase()
          .includes(query),
      )
    : products;

  return paginate(
    filtered.map((product) => ({
      ...product,
      status: "已发布",
      language: "English",
      updatedAt: "2026-07-08",
    })),
    params,
  );
}

const categoryRows = [...new Set(products.map((product) => product.category))].map((category, index) => ({
  name: category,
  status: "启用",
  value: `排序 ${index + 1} · ${products.filter((product) => product.category === category).length} 个产品`,
}));

const mediaRows = [...new Set([...products.map((product) => product.image), ...applications.map((application) => application.image)])].map(
  (image) => ({
    name: image.replace("/images/", ""),
    status: "已引用",
    value: image,
  }),
);

export async function getAdminDashboard() {
  const database = await getDatabaseHealth();

  return {
    database,
    cards: [
      { label: "已发布产品", value: products.length, note: "官网产品目录" },
      { label: "应用场景", value: applications.length, note: "官网应用页面" },
      { label: "产品分类", value: categoryRows.length, note: "启用分类" },
      { label: "技术资料", value: resourceSections.length, note: "资料入口" },
    ],
    systemStatus: [
      ["内容来源", "官网已发布内容"],
      ["表单通知", `已发送至 ${site.email}`],
      ["登录权限", "单管理员账号已启用"],
      ["数据存储", database.connected ? "数据库连接正常" : "邮箱通知模式"],
      ["最后检查", database.checkedAt],
    ],
    company: [
      ["品牌", site.name],
      ["公司", site.legalName],
      ["邮箱", site.email],
      ["电话", site.phone],
      ["地址", site.address],
    ],
  };
}

export const adminModules = {
  categories: {
    title: "产品分类",
    description: "当前官网启用的产品分类与产品数量。",
    rows: categoryRows,
  },
  news: {
    title: "新闻管理",
    description: "新闻自动化模块已启用真实数据读取；详情请进入左侧“新闻管理”。",
    rows: [
      { name: "前台新闻页", status: "已上线", value: "/news" },
      { name: "RSS Feed", status: "已上线", value: "/news/rss.xml" },
      { name: "自动任务", status: "已启用", value: "/api/cron/news-automation" },
      { name: "持久化与审计", status: process.env.DATABASE_URL ? "数据库已配置" : "实时RSS模式", value: process.env.DATABASE_URL ? "新闻记录永久保存" : "需配置数据库后永久保存" },
    ],
  },
  inquiries: {
    title: "客户表单",
    description: "官网询盘表单通知状态与后台记录。",
    rows: [
      { name: "收件邮箱", status: "已启用", value: site.email },
      { name: "后台记录", status: "暂无记录", value: "0 条" },
    ],
  },
  analytics: {
    title: "访问分析",
    description: "网站访问数据源与当前统计状态。",
    rows: [
      { name: "访问统计", status: "未启用", value: "0 条后台记录" },
      { name: "产品询价转化", status: "未启用", value: "0 条后台记录" },
    ],
  },
  seo: {
    title: "SEO数据",
    description: "站内SEO文件、结构化数据和页面索引基础配置。",
    rows: [
      { name: "Sitemap", status: "已上线", value: "/sitemap.xml" },
      { name: "Sitemap分表", status: "已启用", value: "页面 / 产品 / 应用 / 新闻" },
      { name: "每日自检", status: "已启用", value: "/api/cron/sitemap-maintenance" },
      { name: "Google提交", status: process.env.GOOGLE_SEARCH_CONSOLE_ENABLED === "true" ? "已启用" : "未启用", value: "Search Console Sitemaps API" },
      { name: "Robots", status: "已上线", value: "/robots.txt" },
      { name: "AI抓取文件", status: "已上线", value: "/llms.txt" },
      { name: "产品SEO字段", status: "已配置", value: `${products.length} 个产品` },
      { name: "应用页SEO", status: "已配置", value: `${applications.length} 个页面` },
    ],
  },
  media: {
    title: "媒体库",
    description: "官网当前引用的图片与资料入口。",
    rows: mediaRows,
  },
  users: {
    title: "用户与权限",
    description: "后台登录账号与权限状态。",
    rows: [{ name: process.env.ADMIN_USERNAME || "admin", status: "超级管理员", value: "已启用" }],
  },
  logs: {
    title: "操作日志",
    description: "后台关键操作记录。",
    rows: [{ name: "操作记录", status: "暂无记录", value: "0 条" }],
  },
  settings: {
    title: "系统设置",
    description: "网站基础配置、通知配置和显示规则。",
    rows: [
      { name: "默认时区", status: "Asia/Shanghai", value: "中国运营后台显示" },
      { name: "网站品牌", status: "已配置", value: site.name },
      { name: "SMTP通知", status: "已启用", value: site.email },
      { name: "公司电话", status: "已配置", value: site.phone },
    ],
  },
  sync: {
    title: "数据同步",
    description: "站点自动任务与同步状态。",
    rows: [
      { name: "邮件健康检查", status: "已启用", value: "每月1日自动执行" },
      { name: "Sitemap生成", status: "已启用", value: "/sitemap.xml" },
      { name: "Sitemap每日检查", status: "已启用", value: "每天 UTC 02:30" },
      { name: "Robots生成", status: "已启用", value: "/robots.txt" },
    ],
  },
};
