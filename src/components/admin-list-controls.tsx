import Link from "next/link";
import { toSearchString, type AdminDateRange } from "@/lib/admin-listing";
import { AdminDateFields } from "./admin-date-fields";

export function AdminDateRangeFields({ range }: { range: AdminDateRange }) {
  return <AdminDateFields key={`${range.key}:${range.from}:${range.to}`} range={range} />;
}

export function AdminPagination({
  pathname,
  page,
  pages,
  pageSize,
  total,
  query = {},
  pageKey = "page",
}: {
  pathname: string;
  page: number;
  pages: number;
  pageSize: number;
  total: number;
  query?: Record<string, string | undefined>;
  pageKey?: string;
}) {
  const href = (targetPage: number) => `${pathname}${toSearchString({ ...query, [pageKey]: targetPage, pageSize })}`;
  return <nav className="admin-pagination" aria-label="列表分页">
    <span>共 {total} 条，第 {page} / {pages} 页</span>
    <div>
      {page > 1 ? <Link href={href(page - 1)}>上一页</Link> : <span aria-disabled="true">上一页</span>}
      {page < pages ? <Link href={href(page + 1)}>下一页</Link> : <span aria-disabled="true">下一页</span>}
    </div>
  </nav>;
}
