import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

type PaginationProps = {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  pathname: string;
  label: string;
  query?: Record<string, string>;
};

function pageHref(pathname: string, page: number, query?: Record<string, string>) {
  const params = new URLSearchParams(query);
  if (page > 1) params.set("page", String(page));
  const search = params.toString();
  return search ? `${pathname}?${search}` : pathname;
}

export function Pagination({ currentPage, totalItems, pageSize, pathname, label, query }: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1).filter((page) => (
    page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1
  ));

  return (
    <nav className="content-pagination" aria-label={`${label} pagination`}>
      {currentPage === 1 ? <span className="pagination-control" aria-disabled="true"><ChevronLeft size={17} aria-hidden="true" /><span>Previous</span></span> : <Link className="pagination-control" href={pageHref(pathname, currentPage - 1, query)}><ChevronLeft size={17} aria-hidden="true" /><span>Previous</span></Link>}
      <div className="pagination-pages">
        {pages.map((page, index) => {
          const previous = pages[index - 1];
          return (
            <span className="pagination-page-group" key={page}>
              {previous && page - previous > 1 ? <span className="pagination-ellipsis" aria-hidden="true">...</span> : null}
              <Link href={pageHref(pathname, page, query)} aria-current={page === currentPage ? "page" : undefined}>{page}</Link>
            </span>
          );
        })}
      </div>
      {currentPage === totalPages ? <span className="pagination-control pagination-next" aria-disabled="true"><span>Next</span><ChevronRight size={17} aria-hidden="true" /></span> : <Link className="pagination-control pagination-next" href={pageHref(pathname, currentPage + 1, query)}><span>Next</span><ChevronRight size={17} aria-hidden="true" /></Link>}
    </nav>
  );
}
