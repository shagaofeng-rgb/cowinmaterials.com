import Link from "next/link";
import { toSearchString, type AdminDateRange } from "@/lib/admin-listing";

export function AdminDateRangeFields({ range }: { range: AdminDateRange }) {
  return <>
    <label className="admin-filter-field">
      <span>时间范围</span>
      <select name="range" defaultValue={range.key}>
        <option value="today">今天</option>
        <option value="week">本周</option>
        <option value="month">本月</option>
        <option value="custom">自定义</option>
        <option value="all">全部时间</option>
      </select>
    </label>
    <label className="admin-filter-field">
      <span>开始日期</span>
      <input name="from" type="date" defaultValue={range.key === "custom" ? range.from || "" : ""} />
    </label>
    <label className="admin-filter-field">
      <span>结束日期</span>
      <input name="to" type="date" defaultValue={range.key === "custom" ? range.to || "" : ""} />
    </label>
  </>;
}

export function AdminPagination({
  pathname,
  page,
  pages,
  pageSize,
  total,
  query = {},
}: {
  pathname: string;
  page: number;
  pages: number;
  pageSize: number;
  total: number;
  query?: Record<string, string | undefined>;
}) {
  const href = (targetPage: number) => `${pathname}${toSearchString({ ...query, page: targetPage, pageSize })}`;
  return <nav className="admin-pagination" aria-label="列表分页">
    <span>共 {total} 条，第 {page} / {pages} 页</span>
    <div>
      <Link aria-disabled={page <= 1} href={href(Math.max(1, page - 1))}>上一页</Link>
      <Link aria-disabled={page >= pages} href={href(Math.min(pages, page + 1))}>下一页</Link>
    </div>
  </nav>;
}
