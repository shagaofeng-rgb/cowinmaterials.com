import assert from "node:assert/strict";
import test from "node:test";
import { getAnalyticsReferrer, readAnalyticsReferrer } from "../src/lib/analytics-referrer.ts";
import { classifyNotificationFailure } from "../src/lib/inquiry-notification-policy.ts";
import { inquiryBodyLimit, inquiryFileLimit, validateInquiryFile } from "../src/lib/inquiry-upload.ts";
import { isSitemapSubmissionFailure, submissionSkipReason } from "../src/lib/sitemap/schedule.ts";

test("records the external hostname on entry and the prior route during client navigation", () => {
  const origin = "https://www.cowinmaterials.com";
  assert.deepEqual(getAnalyticsReferrer("https://www.google.com/search?q=private", origin), { referrer_host: "www.google.com" });
  assert.deepEqual(getAnalyticsReferrer("https://www.google.com/search?q=private", origin, "/products"), { referrer_path: "/products" });
  assert.deepEqual(getAnalyticsReferrer(`${origin}/products?q=private#spec`, origin), { referrer_path: "/products" });
  assert.deepEqual(getAnalyticsReferrer("", origin), {});
});

test("reads legacy referrers but discards full URLs and unsafe paths", () => {
  assert.deepEqual(readAnalyticsReferrer({ referrerHost: "EXAMPLE.COM.", referrerPath: "/products" }), {
    referrer_host: "example.com", referrer_path: "/products",
  });
  assert.deepEqual(readAnalyticsReferrer({ referrer_host: "https://example.com", referrer_path: "//example.com" }), {});
  assert.deepEqual(readAnalyticsReferrer({ referrer_path: "/products?email=private" }), {});
});

test("attachment validation reserves multipart overhead and checks bytes, extension and declared type", () => {
  const pdf = new TextEncoder().encode("%PDF-1.7");
  assert(inquiryFileLimit < inquiryBodyLimit && inquiryBodyLimit < 4_500_000);
  assert.equal(validateInquiryFile("datasheet.pdf", "", pdf), "application/pdf");
  assert.equal(validateInquiryFile("datasheet.pdf", "image/jpeg", pdf), null);
  assert.equal(validateInquiryFile("datasheet.pdf", "application/pdf", Uint8Array.of(1, 2, 3)), null);
  assert.equal(validateInquiryFile("datasheet.pdf.exe", "application/pdf", pdf), null);
  const oversized = new Uint8Array(inquiryFileLimit + 1);
  oversized.set(pdf);
  assert.equal(validateInquiryFile("datasheet.pdf", "application/pdf", oversized), null);
});

test("SMTP retries only known non-deliveries and never retries an ambiguous outcome", () => {
  assert.deepEqual(classifyNotificationFailure({ responseCode: 451 }, 1), { status: "retry", code: "smtp_temporary" });
  assert.deepEqual(classifyNotificationFailure({ responseCode: 451 }, 3), { status: "failed", code: "smtp_temporary" });
  assert.equal(classifyNotificationFailure({ code: "EAUTH", responseCode: 535 }, 1).status, "failed");
  assert.equal(classifyNotificationFailure({ code: "ETIMEDOUT", command: "DATA" }, 1).status, "uncertain");
  assert.equal(classifyNotificationFailure({ code: "ETIMEDOUT", command: "CONN" }, 1).status, "retry");
});

test("Google submission requires successful validation, durable reservation and the Monday cron", () => {
  const input = { now: new Date("2026-11-09T02:30:00Z"), trigger: "cron", dryRun: false, enabled: true, valid: true, durable: true };
  assert.equal(submissionSkipReason(input), null);
  assert.equal(submissionSkipReason({ ...input, trigger: "manual" }), "skipped_schedule");
  assert.equal(submissionSkipReason({ ...input, dryRun: true }), "skipped_schedule");
  assert.equal(submissionSkipReason({ ...input, valid: false }), "skipped_validation");
  assert.equal(submissionSkipReason({ ...input, durable: false }), "configuration_error");
  assert.equal(submissionSkipReason({ ...input, lastAttempt: input.now }), "skipped_duplicate");
  assert.equal(submissionSkipReason({ ...input, now: new Date("2026-11-10T02:30:00Z") }), "skipped_schedule");
  assert.equal(isSitemapSubmissionFailure("permission_error"), true);
  assert.equal(isSitemapSubmissionFailure("skipped_duplicate"), false);
});
