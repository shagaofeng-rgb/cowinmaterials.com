import assert from "node:assert/strict";
import test from "node:test";
import { isNewsAutomationEnabled } from "../src/lib/news/policy.ts";
import { weeklySubmissionAllowed } from "../src/lib/sitemap/schedule.ts";

test("News automation is stopped", () => assert.equal(isNewsAutomationEnabled(), false));
test("Monday Shanghai schedule and same-week deduplication", () => {
  const monday = new Date("2026-10-05T02:30:00Z");
  assert.equal(weeklySubmissionAllowed(monday), true);
  assert.equal(weeklySubmissionAllowed(monday, new Date("2026-09-28T02:30:00Z")), true);
  assert.equal(weeklySubmissionAllowed(monday, new Date("2026-10-05T02:00:00Z")), false);
  assert.equal(weeklySubmissionAllowed(new Date("2026-10-06T02:30:00Z")), false);
  assert.equal(weeklySubmissionAllowed(new Date("2026-10-04T15:59:59Z")), false);
  assert.equal(weeklySubmissionAllowed(new Date("2026-10-04T16:00:00Z")), true);
});
