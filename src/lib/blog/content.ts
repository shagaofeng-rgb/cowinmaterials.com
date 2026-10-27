import sanitizeHtml from "sanitize-html";
import { normalizeBlogLinkHref } from "./links.ts";

export function sanitizeBlogContent(content: string, normalizeLinks = true) {
  return sanitizeHtml(content, {
    allowedTags: [
      "p", "br", "h2", "h3", "h4", "strong", "b", "em", "i", "u", "ul", "ol", "li",
      "blockquote", "a", "img", "figure", "figcaption", "table", "thead", "tbody", "tr", "th", "td",
      "pre", "code", "hr", "sup", "sub", ...(normalizeLinks ? ["span"] : []),
    ],
    allowedAttributes: {
      a: ["href", "title", "target", "rel"],
      img: ["src", "alt", "title", "width", "height", "loading"],
      th: ["colspan", "rowspan", "scope"],
      td: ["colspan", "rowspan"],
    },
    allowedSchemes: ["http", "https", "mailto"],
    transformTags: {
      a: normalizeLinks ? ((_tagName, attribs): sanitizeHtml.Tag => {
        const href = normalizeBlogLinkHref(attribs.href || "");
        if (!href) return { tagName: "span", attribs: {} };
        return href.startsWith("http")
          ? { tagName: "a", attribs: { href, rel: "nofollow noopener noreferrer", target: "_blank" } }
          : { tagName: "a", attribs: { href } };
      }) : sanitizeHtml.simpleTransform("a", { rel: "nofollow noopener noreferrer", target: "_blank" }),
      img: sanitizeHtml.simpleTransform("img", { loading: "lazy" }),
    },
  }).trim();
}
