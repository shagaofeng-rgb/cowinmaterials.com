import type { SitemapEntry } from "./types";

export type SnapshotChanges = {
  added: string[];
  modified: string[];
  removed: string[];
};

export function compareSnapshots(previous: Map<string, string>, entries: SitemapEntry[]): SnapshotChanges {
  const current = new Map(entries.map((entry) => [entry.url, new Date(entry.lastModified).toISOString()]));
  const added = [...current.keys()].filter((url) => !previous.has(url));
  const modified = [...current.entries()].filter(([url, lastmod]) => previous.has(url) && previous.get(url) !== lastmod).map(([url]) => url);
  const removed = [...previous.keys()].filter((url) => !current.has(url));
  return { added, modified, removed };
}
