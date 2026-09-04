import type { NewsCandidate, NewsFeedHealth } from "./types";
import { canonicalizeSourceUrl, normalizeNewsTitle, normalizeSyndicatedSummary, readXmlTag, readXmlTags, rssItemsFromXml, sourcePublisherFromUrl, stripHtml } from "./utils";

const googleNewsFeed = (query: string) => `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en-US&gl=US&ceid=US:en`;

const defaultFeeds = [
  { label: "Aerogel materials", url: googleNewsFeed('"silica aerogel" OR "aerogel insulation" when:30d') },
  { label: "Battery thermal safety", url: googleNewsFeed('"battery thermal runaway" OR "battery thermal barrier" when:30d') },
  { label: "Fire protection coatings", url: googleNewsFeed('"intumescent coating" OR "fireproof coating" steel when:30d') },
  { label: "Energy storage safety", url: "https://www.energy-storage.news/feed/" },
  { label: "Solar and storage engineering", url: "https://www.pv-magazine.com/feed/" },
];

const trustedSyndicatedPublishers = new Set([
  "AZoM",
  "Chemistry World",
  "European Coatings",
  "EurekAlert!",
  "Nature",
  "Physics World",
  "ScienceDirect.com",
  "Tech Xplore",
  "University of Waterloo",
  "Wiley Online Library",
]);

const feedRequestAttempts = 3;
const retryableStatusCodes = new Set([429, 500, 502, 503, 504]);

const wait = (milliseconds: number) => new Promise((resolve) => setTimeout(resolve, milliseconds));

async function fetchFeed(url: string) {
  let lastError: unknown;
  for (let attempt = 1; attempt <= feedRequestAttempts; attempt += 1) {
    try {
      const response = await fetch(url, {
        headers: { "user-agent": "CowinMaterialsNewsBot/1.2 (+https://www.cowinmaterials.com/news)" },
        cache: "no-store",
        signal: AbortSignal.timeout(12_000),
      });
      if (!retryableStatusCodes.has(response.status) || attempt === feedRequestAttempts) {
        return { response, attempts: attempt };
      }
    } catch (error) {
      lastError = error;
      if (attempt === feedRequestAttempts) throw error;
    }
    await wait(attempt * 500);
  }
  throw lastError instanceof Error ? lastError : new Error("News feed request failed.");
}

function getFeedSources() {
  const configured = process.env.NEWS_SOURCE_FEEDS?.split(",").map((value) => value.trim()).filter(Boolean);
  return configured?.length ? configured.map((url, index) => ({ label: `Configured source ${index + 1}`, url })) : defaultFeeds;
}

export async function collectNewsCandidates() {
  const fetchedAt = new Date().toISOString();
  const groups = await Promise.all(getFeedSources().map(async (feed) => {
    try {
      const { response, attempts } = await fetchFeed(feed.url);
      if (!response.ok) return { candidates: [] as NewsCandidate[], health: { label: feed.label, url: feed.url, status: "http_error", httpStatus: response.status, attempts, itemCount: 0, candidateCount: 0, message: `Source returned HTTP ${response.status} after ${attempts} attempt${attempts === 1 ? "" : "s"}.` } satisfies NewsFeedHealth };
      const xml = await response.text();
      const fallbackPublisher = sourcePublisherFromUrl(feed.url);
      const syndicated = new URL(feed.url).hostname === "news.google.com";
      const items = rssItemsFromXml(xml).slice(0, 50);
      const candidates = items.flatMap((item) => {
        try {
          const publisher = stripHtml(readXmlTag(item, "source") || "") || fallbackPublisher;
          if (syndicated && !trustedSyndicatedPublishers.has(publisher)) return [];
          const rawTitle = stripHtml(readXmlTag(item, "title") || "");
          const title = normalizeNewsTitle(rawTitle, publisher);
          const url = canonicalizeSourceUrl(stripHtml(readXmlTag(item, "link") || ""));
          const summary = normalizeSyndicatedSummary(readXmlTag(item, "description") || readXmlTag(item, "content:encoded") || "", title, publisher);
          const date = readXmlTag(item, "pubDate") || readXmlTag(item, "published") || readXmlTag(item, "dc:date");
          const publishedAt = date ? new Date(date).toISOString() : "";
          if (!title || !url || !publishedAt || !Number.isFinite(new Date(publishedAt).getTime())) return [];
          return [{ title, url, summary, publisher, publishedAt, fetchedAt, sourceTimezone: "UTC", keywords: readXmlTags(item, "category") }];
        } catch {
          return [];
        }
      });
      return { candidates, health: { label: feed.label, url: feed.url, status: items.length ? "ok" : "empty", httpStatus: response.status, attempts, itemCount: items.length, candidateCount: candidates.length, message: items.length ? undefined : "Source returned no RSS items." } satisfies NewsFeedHealth };
    } catch (error) {
      return { candidates: [] as NewsCandidate[], health: { label: feed.label, url: feed.url, status: "fetch_error", attempts: feedRequestAttempts, itemCount: 0, candidateCount: 0, message: error instanceof Error ? error.message : "Source request failed." } satisfies NewsFeedHealth };
    }
  }));
  return {
    candidates: groups.flatMap((group) => group.candidates).sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()),
    feeds: groups.map((group) => group.health),
  };
}
