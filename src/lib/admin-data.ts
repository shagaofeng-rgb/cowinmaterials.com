import { applications, commonFaqs, products, resourceSections, site } from "@/lib/data";
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

export async function getAdminDashboard() {
  const database = await getDatabaseHealth();

  return {
    database,
    cards: [
      { label: "前台产品", value: products.length, note: "当前英文官网已发布目录" },
      { label: "应用页面", value: applications.length, note: "已上线应用场景页面" },
      { label: "资料模块", value: resourceSections.length, note: "技术资料入口" },
      { label: "FAQ", value: commonFaqs.length, note: "采购常见问题" },
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
    description: "管理英文站产品分类、排序、启用状态和SEO字段。当前分类来自前台代码，接入数据库后可在此新增、停用和恢复。",
    rows: [...new Set(products.map((product) => product.category))].map((category, index) => ({
      name: category,
      status: "启用",
      sort: index + 1,
      count: products.filter((product) => product.category === category).length,
    })),
  },
  news: {
    title: "新闻管理",
    description: "用于发布行业资讯、案例文章、技术博客和公司动态。未配置数据库时不展示伪造新闻。",
    rows: [] as Array<Record<string, string | number>>,
  },
  inquiries: {
    title: "客户表单",
    description: "表单邮件已真实发送到公司邮箱；数据库接入后，此处将同步保存询盘、状态、标签、分配人、跟进记录和导出审计。",
    rows: [] as Array<Record<string, string | number>>,
  },
  analytics: {
    title: "访问分析",
    description: "访问分析需接入 Vercel Analytics、Google Search Console 或自有事件采集；未配置外部凭证时不生成虚假访问量。",
    rows: [] as Array<Record<string, string | number>>,
  },
  seo: {
    title: "SEO数据",
    description: "管理站内标题、描述、结构化数据、sitemap 与 Search Console 同步状态。",
    rows: [
      { name: "Sitemap", status: "已上线", value: "/sitemap.xml" },
      { name: "Robots", status: "已上线", value: "/robots.txt" },
      { name: "AI抓取说明", status: "已上线", value: "/llms.txt" },
      { name: "产品SEO字段", status: "已配置", value: `${products.length} 个产品` },
    ],
  },
  media: {
    title: "媒体库",
    description: "统一管理图片、PDF、视频和附件。生产上传需要接入S3兼容对象存储或Vercel Blob。",
    rows: resourceSections.map((section) => ({ name: section.title, status: "资料入口", value: section.action })),
  },
  users: {
    title: "用户与权限",
    description: "支持超级管理员、管理员、内容编辑、市场、销售、数据分析和只读角色。当前上线的是单管理员安全入口。",
    rows: [{ name: process.env.ADMIN_USERNAME || "admin", status: "超级管理员", value: "环境变量配置" }],
  },
  logs: {
    title: "操作日志",
    description: "数据库接入后记录登录、发布、删除、导出、权限修改和同步动作；敏感信息不会写入日志。",
    rows: [] as Array<Record<string, string | number>>,
  },
  settings: {
    title: "系统设置",
    description: "管理时区、日期格式、数据保留、SEO默认值、表单通知和第三方同步凭证显示状态。",
    rows: [
      { name: "默认时区", status: "Asia/Shanghai", value: "中国运营后台显示" },
      { name: "数据保留", status: "待配置", value: "建议询盘长期保存，日志按策略归档" },
      { name: "SMTP通知", status: "已接入", value: site.email },
    ],
  },
  sync: {
    title: "数据同步",
    description: "集中管理访问分析、SEO表现、内容发布缓存和定时任务。外部服务不可用时保留已有数据。",
    rows: [
      { name: "邮件健康检查", status: "已配置", value: "每月1日自动执行" },
      { name: "SEO表现同步", status: "待凭证", value: "Google Search Console" },
      { name: "访问数据同步", status: "待凭证", value: "Vercel / GA4 / 自有事件" },
    ],
  },
};
