export type AdminRangeKey = "today" | "week" | "month" | "custom" | "all";

export type AdminListParams = {
  page?: string;
  pageSize?: string;
  range?: string;
  from?: string;
  to?: string;
  q?: string;
};

export type AdminDateRange = {
  key: AdminRangeKey;
  from?: string;
  to?: string;
  start?: Date;
  end?: Date;
  label: string;
};

const pageSizes = [10, 20, 50, 100];
const datePattern = /^\d{4}-\d{2}-\d{2}$/;

function shanghaiDate(date: Date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const value = Object.fromEntries(parts.filter((part) => part.type !== "literal").map((part) => [part.type, part.value]));
  return `${value.year}-${value.month}-${value.day}`;
}

function addDays(date: string, days: number) {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day + days)).toISOString().slice(0, 10);
}

function shanghaiStart(date: string) {
  return new Date(`${date}T00:00:00+08:00`);
}

export function parsePage(value?: string) {
  const page = Number(value || "1");
  return Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
}

export function parsePageSize(value?: string) {
  const pageSize = Number(value || "20");
  return pageSizes.includes(pageSize) ? pageSize : 20;
}

export function getAdminDateRange(params: Pick<AdminListParams, "range" | "from" | "to">): AdminDateRange {
  const key = (["today", "week", "month", "custom", "all"] as const).includes(params.range as AdminRangeKey)
    ? params.range as AdminRangeKey
    : "month";
  const today = shanghaiDate(new Date());

  if (key === "all") return { key, label: "全部时间" };
  if (key === "today") return { key, from: today, to: today, start: shanghaiStart(today), end: shanghaiStart(addDays(today, 1)), label: "今天" };
  if (key === "week") {
    const weekday = new Date(`${today}T12:00:00+08:00`).getUTCDay() || 7;
    const from = addDays(today, 1 - weekday);
    return { key, from, to: today, start: shanghaiStart(from), end: shanghaiStart(addDays(today, 1)), label: "本周" };
  }
  if (key === "month") {
    const from = `${today.slice(0, 8)}01`;
    return { key, from, to: today, start: shanghaiStart(from), end: shanghaiStart(addDays(today, 1)), label: "本月" };
  }

  const from = datePattern.test(params.from || "") ? params.from : undefined;
  const to = datePattern.test(params.to || "") ? params.to : undefined;
  if (!from && !to) return { key, label: "自定义时间" };
  const safeFrom = from && to && from > to ? to : from;
  const safeTo = from && to && from > to ? from : to;
  return {
    key,
    from: safeFrom,
    to: safeTo,
    start: safeFrom ? shanghaiStart(safeFrom) : undefined,
    end: safeTo ? shanghaiStart(addDays(safeTo, 1)) : undefined,
    label: "自定义时间",
  };
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

export function toSearchString(values: Record<string, string | number | undefined>) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(values)) {
    if (value !== undefined && value !== "" && value !== 0) search.set(key, String(value));
  }
  const text = search.toString();
  return text ? `?${text}` : "";
}
