import { createSign } from "node:crypto";
import { readFile } from "node:fs/promises";

type ServiceAccountCredentials = {
  client_email: string;
  private_key: string;
  token_uri?: string;
};

export type SearchConsoleResult = {
  enabled: boolean;
  submitted: boolean;
  status: "disabled" | "submitted" | "configuration_error" | "authentication_error" | "permission_error" | "network_error" | "api_error";
  message: string;
  httpStatus?: number;
};

type SearchConsoleOptions = {
  env?: NodeJS.ProcessEnv;
  fetchImpl?: typeof fetch;
};

function base64Url(value: string | Buffer) {
  return Buffer.from(value).toString("base64url");
}

async function loadCredentials(env: NodeJS.ProcessEnv): Promise<ServiceAccountCredentials> {
  const inline = env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS_JSON;
  const encoded = env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS_BASE64;
  const path = env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS_PATH;
  const raw = inline || (encoded ? Buffer.from(encoded, "base64").toString("utf8") : path ? await readFile(path, "utf8") : "");
  if (!raw) throw new Error("Service account credentials are not configured.");

  const credentials = JSON.parse(raw) as ServiceAccountCredentials;
  if (!credentials.client_email || !credentials.private_key) {
    throw new Error("Service account credentials are missing client_email or private_key.");
  }
  return credentials;
}

async function fetchWithTimeout(fetchImpl: typeof fetch, input: string, init: RequestInit, timeoutMs = 10_000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetchImpl(input, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function getAccessToken(credentials: ServiceAccountCredentials, fetchImpl: typeof fetch) {
  const now = Math.floor(Date.now() / 1000);
  const tokenUri = credentials.token_uri || "https://oauth2.googleapis.com/token";
  const header = base64Url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claim = base64Url(JSON.stringify({
    iss: credentials.client_email,
    scope: "https://www.googleapis.com/auth/webmasters",
    aud: tokenUri,
    iat: now,
    exp: now + 3600,
  }));
  const unsigned = `${header}.${claim}`;
  const signer = createSign("RSA-SHA256");
  signer.update(unsigned);
  signer.end();
  const assertion = `${unsigned}.${signer.sign(credentials.private_key, "base64url")}`;

  const response = await fetchWithTimeout(fetchImpl, tokenUri, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion }),
  });
  const data = await response.json().catch(() => ({})) as { access_token?: string; error_description?: string; error?: string };
  if (!response.ok || !data.access_token) {
    throw new Error(`OAuth token request failed: ${data.error_description || data.error || `HTTP ${response.status}`}.`);
  }
  return data.access_token;
}

export async function submitSitemapToSearchConsole(options: SearchConsoleOptions = {}): Promise<SearchConsoleResult> {
  const env = options.env || process.env;
  const fetchImpl = options.fetchImpl || fetch;
  if (env.GOOGLE_SEARCH_CONSOLE_ENABLED !== "true") {
    return { enabled: false, submitted: false, status: "disabled", message: "Google Search Console submission is disabled." };
  }

  const siteUrl = env.GOOGLE_SEARCH_CONSOLE_SITE_URL;
  const sitemapUrl = env.GOOGLE_SEARCH_CONSOLE_SITEMAP_URL || "https://www.cowinmaterials.com/sitemap.xml";
  if (!siteUrl || !sitemapUrl) {
    return { enabled: true, submitted: false, status: "configuration_error", message: "Search Console site URL or sitemap URL is missing." };
  }

  try {
    const sitemapResponse = await fetchWithTimeout(fetchImpl, sitemapUrl, { method: "GET", redirect: "follow" });
    if (!sitemapResponse.ok) {
      return { enabled: true, submitted: false, status: "configuration_error", message: `Sitemap is not publicly reachable (HTTP ${sitemapResponse.status}).`, httpStatus: sitemapResponse.status };
    }

    const credentials = await loadCredentials(env);
    const token = await getAccessToken(credentials, fetchImpl);
    const endpoint = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/sitemaps/${encodeURIComponent(sitemapUrl)}`;

    let response: Response | null = null;
    for (let attempt = 0; attempt < 2; attempt += 1) {
      response = await fetchWithTimeout(fetchImpl, endpoint, {
        method: "PUT",
        headers: { authorization: `Bearer ${token}` },
      });
      if (response.ok || ![429, 500, 502, 503, 504].includes(response.status)) break;
    }

    if (response?.ok) {
      return { enabled: true, submitted: true, status: "submitted", message: "Sitemap submitted to Google Search Console.", httpStatus: response.status };
    }

    const status = response?.status || 0;
    const body = await response?.text().catch(() => "");
    const message = body?.slice(0, 500) || `Search Console API returned HTTP ${status}.`;
    if (status === 401) return { enabled: true, submitted: false, status: "authentication_error", message, httpStatus: status };
    if (status === 403) return { enabled: true, submitted: false, status: "permission_error", message, httpStatus: status };
    return { enabled: true, submitted: false, status: "api_error", message, httpStatus: status };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Search Console request failed.";
    const status = /credential|private_key|client_email|JSON/i.test(message) ? "configuration_error" : /OAuth|token/i.test(message) ? "authentication_error" : "network_error";
    return { enabled: true, submitted: false, status, message };
  }
}
