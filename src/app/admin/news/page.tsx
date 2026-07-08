import type { Metadata } from "next";
import Link from "next/link";
import { AdminEmpty, AdminNotice, AdminShell } from "@/components/admin-shell";
import { requireAdminSession } from "@/lib/admin-auth";
import { getNewsAdminSummary } from "@/lib/news/store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "新闻管理 | Cowin Materials 后台",
  robots: { index: false, follow: false },
};

export default async function AdminNewsPage() {
  await requireAdminSession();
  const summary = await getNewsAdminSummary();

  return (
    <AdminShell title="新闻管理">
      <AdminNotice>
        新闻自动化已接入正式发布流程。系统只展示真实数据库记录；未通过来源时效、去重、产品相关性和封面图片审计的内容不会出现在前台。
      </AdminNotice>

      {summary.warnings.length ? (
        <AdminNotice>
          {summary.warnings.map((warning) => (
            <p key={warning}>{warning}</p>
          ))}
        </AdminNotice>
      ) : null}

      <section className="admin-card-grid">
        <div className="admin-metric-card">
          <span>已发布新闻</span>
          <strong>{summary.totals.published}</strong>
          <p>前台 /news 可见内容</p>
        </div>
        <div className="admin-metric-card">
          <span>审稿队列</span>
          <strong>{summary.totals.review}</strong>
          <p>待人工确认的合规候选</p>
        </div>
        <div className="admin-metric-card">
          <span>草稿</span>
          <strong>{summary.totals.draft}</strong>
          <p>未进入发布流程</p>
        </div>
        <div className="admin-metric-card">
          <span>图片异常</span>
          <strong>{summary.totals.failedImages}</strong>
          <p>不得发布到正式前台</p>
        </div>
      </section>

      <section className="admin-panel">
        <div className="admin-panel-heading">
          <div>
            <h2>自动化任务</h2>
            <p>建议配置数据库、RSS来源、CRON_SECRET 后再启用自动发布。</p>
          </div>
          <form action="/api/admin/news/run" method="post">
            <button className="admin-action-button" type="submit">
              手动执行一次
            </button>
          </form>
        </div>
        {summary.recentJobs.length ? (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>任务ID</th>
                  <th>状态</th>
                  <th>开始时间</th>
                  <th>说明</th>
                </tr>
              </thead>
              <tbody>
                {summary.recentJobs.map((job) => (
                  <tr key={job.id}>
                    <td>{job.id.slice(0, 8)}</td>
                    <td>
                      <span className="admin-badge">{job.status}</span>
                    </td>
                    <td>{new Date(job.startedAt).toLocaleString("zh-CN")}</td>
                    <td>{job.message || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <AdminEmpty text="暂无自动化任务记录" />
        )}
      </section>

      <section className="admin-panel">
        <h2>已发布新闻</h2>
        {summary.recentArticles.length ? (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>标题</th>
                  <th>来源</th>
                  <th>发布时间</th>
                  <th>前台</th>
                </tr>
              </thead>
              <tbody>
                {summary.recentArticles.map((article) => (
                  <tr key={article.slug}>
                    <td>
                      <strong>{article.title}</strong>
                      <span>{article.relatedProducts.map((product) => product.name).join("、") || "未关联产品"}</span>
                    </td>
                    <td>{article.source.publisher}</td>
                    <td>{new Date(article.publishedAt).toLocaleString("zh-CN")}</td>
                    <td>
                      <Link href={`/news/${article.slug}`} target="_blank">
                        查看
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <AdminEmpty text="暂无已发布新闻" />
        )}
      </section>
    </AdminShell>
  );
}
