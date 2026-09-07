export type ArticleSection = {
  id: string;
  label: string;
  html: string;
};

function textFromHtml(value: string) {
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function sectionId(label: string, index: number, used: Set<string>) {
  const base = textFromHtml(label).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 48) || `section-${index + 1}`;
  let id = base;
  let duplicate = 2;
  while (used.has(id)) id = `${base}-${duplicate++}`;
  used.add(id);
  return id;
}

export function splitArticleSections(contentHtml: string): ArticleSection[] {
  const headingPattern = /<h2\b[^>]*>([\s\S]*?)<\/h2>/gi;
  const headings = Array.from(contentHtml.matchAll(headingPattern));
  if (!headings.length) return [{ id: "article", label: "Article", html: contentHtml }];

  const used = new Set<string>();
  const sections: ArticleSection[] = [];
  const lead = contentHtml.slice(0, headings[0].index).trim();
  if (lead) sections.push({ id: "overview", label: "Overview", html: lead });

  headings.forEach((heading, index) => {
    const nextStart = headings[index + 1]?.index ?? contentHtml.length;
    const headingHtml = heading[0];
    const headingEnd = (heading.index || 0) + headingHtml.length;
    const label = textFromHtml(heading[1]) || `Section ${index + 1}`;
    const body = contentHtml.slice(headingEnd, nextStart).trim();
    sections.push({ id: sectionId(label, index, used), label, html: body || `<p>${label}</p>` });
  });

  return sections.length ? sections : [{ id: "article", label: "Article", html: contentHtml }];
}
