# Cowin Materials 海外B2B官网中文后台实施计划

## 当前项目情况

- 技术栈：Next.js App Router、TypeScript、React、Tailwind CSS、Vercel。
- 已有能力：英文官网、多页面产品与应用内容、SEO元数据、sitemap、robots、llms.txt、询盘邮件发送、每月邮件健康检查。
- 新增后台入口：`/admin/login` 与受保护的 `/admin` 模块。
- 当前限制：仓库此前没有数据库、对象存储、后台认证、审计日志和内容管理表结构。

## 技术架构

- 前台：继续使用 Next.js 静态/服务端渲染，保持英文外贸网站可抓取。
- 后台：Next.js 服务端组件、Server Actions、受保护 API 路由。
- 认证：服务端 Cookie 会话；账号、密码哈希和会话密钥通过环境变量配置。
- 数据库：PostgreSQL，schema 位于 `database/schema.sql`。
- 文件存储：生产建议使用 S3 兼容对象存储或 Vercel Blob，数据库仅保存文件元数据。
- 部署：Vercel；数据库、对象存储和第三方同步凭证通过环境变量接入。

## 数据库设计

第一阶段 schema 包括：

- `admin_users`、`admin_roles`、`admin_permissions`、`admin_sessions`
- `product_categories`、`products`
- `article_categories`、`articles`
- `inquiries`
- `media_assets`
- `analytics_events`
- `seo_snapshots`
- `sync_jobs`
- `audit_logs`
- `system_settings`

所有业务时间字段统一使用 `timestamptz`，业务数据支持软删除。

## 功能模块

- 数据概览：展示产品、应用、资料模块数量和数据库状态。
- 产品管理：服务端搜索、分页、预览当前已发布产品；数据库接入后支持完整CRUD和发布流程。
- 产品分类：展示当前分类，后续支持排序、启停、恢复和SEO字段。
- 新闻管理：预留新闻、案例、博客发布流程，未配置数据库时不展示伪造内容。
- 客户表单：现有询盘邮件真实发送；数据库接入后保存状态、标签、分配人和跟进记录。
- 访问分析：预留 Vercel Analytics、GA4 或自有事件接入，不伪造访问数据。
- SEO数据：管理站内SEO与外部 Search Console 同步状态。
- 媒体库：统一文件元数据结构，生产上传依赖对象存储。
- 用户与权限：已上线单管理员入口；数据库接入后扩展角色权限。
- 操作日志：schema 已准备，后续记录登录、发布、删除、导出和同步动作。
- 系统设置：时区、数据保留、SMTP、第三方凭证显示状态。
- 数据同步：邮件健康检查已配置；SEO和访问数据等待外部凭证。

## 实施阶段

1. 后台安全入口、中文布局、模块导航、数据库健康检查。
2. PostgreSQL 初始化、初始管理员创建、用户角色权限。
3. 产品/分类/新闻/媒体库持久化 CRUD。
4. 询盘入库、跟进状态、导出审计和邮件失败保护。
5. 访问分析、SEO同步、同步任务和操作日志。

## 安全方案

- 后台页面和 API 均执行服务端会话检查。
- Cookie 使用 `HttpOnly`、`SameSite=Lax`，生产环境启用 `Secure`。
- 后台和后台 API 设置 `noindex` 与 `no-store`。
- 密码不得写入源码；优先使用 `ADMIN_PASSWORD_HASH`。
- SMTP、数据库、Search Console 等凭证仅通过环境变量配置。
- 不在日志中输出密码、密钥或完整敏感表单内容。

## 测试方案

- `pnpm lint`
- `pnpm build`
- 本地访问 `/admin/login` 验证登录页和受保护路由。
- 未登录访问 `/api/admin/health` 应返回 401。
- 登录后访问后台产品列表和健康检查 API。

## 部署方案

- GitHub `main` 分支推送后由 Vercel 自动部署。
- 生产必须配置：
  - `ADMIN_USERNAME`
  - `ADMIN_PASSWORD_HASH` 或临时 `ADMIN_PASSWORD`
  - `ADMIN_SESSION_SECRET`
  - `DATABASE_URL`
  - `SMTP_*`
  - `CRON_SECRET`
- 初始化 PostgreSQL 后执行 `database/schema.sql`。

## 风险和待确认事项

- 当前 Vercel 项目尚未确认持久化数据库和对象存储是否已开通。
- 未接入数据库前，后台不会允许伪装成生产可写CMS。
- Google Search Console、GA4、Vercel Analytics 等外部数据源需要后续凭证授权。
- 对象存储供应商、文件大小限制和文件安全扫描策略需要最终确认。
