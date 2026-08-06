import { createHash } from "node:crypto";
import { list, put } from "@vercel/blob";
import sanitizeHtml from "sanitize-html";
import type { BlogArticle } from "./types";

const articlePrefix = "blog/articles/";

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72) || "article";
}

function sanitizeContent(content: string) {
  return sanitizeHtml(content, {
    allowedTags: [
      "p", "br", "h2", "h3", "h4", "strong", "b", "em", "i", "u", "ul", "ol", "li",
      "blockquote", "a", "img", "figure", "figcaption", "table", "thead", "tbody", "tr", "th", "td",
      "pre", "code", "hr", "sup", "sub",
    ],
    allowedAttributes: {
      a: ["href", "title", "target", "rel"],
      img: ["src", "alt", "title", "width", "height", "loading"],
      th: ["colspan", "rowspan", "scope"],
      td: ["colspan", "rowspan"],
    },
    allowedSchemes: ["http", "https", "mailto"],
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", { rel: "nofollow noopener noreferrer", target: "_blank" }),
      img: sanitizeHtml.simpleTransform("img", { loading: "lazy" }),
    },
  }).trim();
}

function excerptFromHtml(contentHtml: string) {
  return sanitizeHtml(contentHtml, { allowedTags: [], allowedAttributes: {} })
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 220);
}

function normalizeImageUrl(value: string) {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}

async function readArticle(url: string) {
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) return null;
  return response.json() as Promise<BlogArticle>;
}

export function hasBlogStorage() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

export async function publishBlogArticle(input: {
  classId: string;
  title: string;
  content: string;
  authorId: string;
  imageUrl: string;
}) {
  if (!hasBlogStorage()) {
    throw new Error("Blog storage is not configured.");
  }

  const contentHtml = sanitizeContent(input.content);
  if (!contentHtml) throw new Error("Article content is empty after security filtering.");

  const fingerprint = createHash("sha256")
    .update(`${input.classId}\n${input.title}\n${contentHtml}`)
    .digest("hex");
  const slug = `${slugify(input.title)}-${fingerprint.slice(0, 10)}`;
  const now = new Date().toISOString();
  const existing = await getBlogArticle(slug);
  const article: BlogArticle = {
    id: fingerprint,
    slug,
    classId: input.classId,
    title: input.title.trim(),
    contentHtml,
    excerpt: excerptFromHtml(contentHtml),
    authorId: input.authorId.trim(),
    imageUrl: normalizeImageUrl(input.imageUrl),
    publishedAt: existing?.publishedAt || now,
    updatedAt: now,
  };

  await put(`${articlePrefix}${slug}.json`, JSON.stringify(article), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json; charset=utf-8",
    cacheControlMaxAge: 60,
  });

  return article;
}

export async function getBlogArticles() {
  if (!hasBlogStorage()) return [];
  const result = await list({ prefix: articlePrefix, limit: 1000 });
  const articles = (await Promise.all(result.blobs.map((blob) => readArticle(blob.url))))
    .filter((article): article is BlogArticle => Boolean(article));
  return articles.sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt));
}

export async function getBlogArticle(slug: string) {
  if (!hasBlogStorage()) return null;
  const result = await list({ prefix: `${articlePrefix}${slug}.json`, limit: 1 });
  const blob = result.blobs.find((entry) => entry.pathname === `${articlePrefix}${slug}.json`);
  return blob ? readArticle(blob.url) : null;
}

