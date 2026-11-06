export type AnalyticsReferrer = { referrer_path?: string; referrer_host?: string };

export function readAnalyticsReferrer(input: Record<string, unknown>): AnalyticsReferrer {
  const path = input.referrer_path ?? input.referrerPath;
  const host = input.referrer_host ?? input.referrerHost;
  const result: AnalyticsReferrer = {};
  if (typeof path === "string" && /^\/(?!\/)[^?#\\\s]{0,259}$/.test(path)) {
    result.referrer_path = path;
  }
  if (typeof host === "string") {
    const hostname = host.trim().toLowerCase().replace(/\.$/, "");
    if (hostname.length <= 253 && /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(hostname)) {
      result.referrer_host = hostname;
    }
  }
  return result;
}

export function getAnalyticsReferrer(referrer: string, origin: string, previousPath?: string): AnalyticsReferrer {
  if (previousPath) return readAnalyticsReferrer({ referrer_path: previousPath });
  try {
    const url = new URL(referrer);
    if (!["http:", "https:"].includes(url.protocol)) return {};
    return readAnalyticsReferrer(url.origin === origin ? { referrer_path: url.pathname } : { referrer_host: url.hostname });
  } catch {
    return {};
  }
}
