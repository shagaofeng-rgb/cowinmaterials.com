import assert from "node:assert/strict";
import test from "node:test";
import { getAdminDateRange, parsePageSize, paginate } from "../src/lib/admin-listing.ts";

const now = new Date("2026-10-10T06:00:00Z");
test("five ranges use inclusive Shanghai dates and exclusive end bounds", () => {
  for (const [range, from] of [["today", "2026-10-10"], ["week", "2026-10-05"], ["month", "2026-10-01"], ["90days", "2026-07-13"]]) {
    const value = getAdminDateRange({ range }, now);
    assert.equal(value.from, from);
    assert.equal(value.to, "2026-10-10");
    assert.equal(value.end?.toISOString(), "2026-10-10T16:00:00.000Z");
  }
});
test("custom dates normalize reversed order and reject impossible dates", () => {
  const value = getAdminDateRange({ range: "custom", from: "2026-10-10", to: "2026-10-01" }, now);
  assert.equal(value.from, "2026-10-01");
  assert.equal(value.to, "2026-10-10");
  for (const from of ["2026-02-30", "nonsense", ""]) {
    const result = getAdminDateRange({ range: "custom", from, to: "2026-10-10" }, now);
    assert.ok(result.error);
    assert.ok(result.start && result.end);
  }
});
test("old all/invalid ranges cannot accidentally perform unbounded queries", () => {
  assert.equal(getAdminDateRange({ range: "all" }, now).key, "month");
  assert.equal(getAdminDateRange({ range: "invalid" }, now).key, "month");
  assert.equal(getAdminDateRange({ range: "today" }, new Date("2026-10-09T16:00:00Z")).from, "2026-10-10");
});
test("pagination stays bounded", () => {
  assert.equal(parsePageSize("99999"), 20);
  assert.equal(paginate([1,2], {page:"999"}).page, 1);
});
