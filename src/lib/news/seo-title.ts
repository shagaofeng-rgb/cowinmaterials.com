export function buildNewsSeoTitle(title: string, maxLength = 65) {
  const suffix = " | Cowin Materials News";
  const cleanTitle = title.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  const available = Math.max(18, maxLength - suffix.length);
  if (cleanTitle.length <= available) return `${cleanTitle}${suffix}`;
  const candidate = cleanTitle.slice(0, available + 1);
  const boundary = candidate.lastIndexOf(" ");
  const shortened = (boundary >= Math.floor(available * 0.6) ? candidate.slice(0, boundary) : cleanTitle.slice(0, available)).trim();
  return `${shortened}${suffix}`;
}
