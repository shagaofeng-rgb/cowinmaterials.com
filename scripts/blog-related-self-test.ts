import assert from "node:assert/strict";
import test from "node:test";
import { getBlogTechnicalPaths } from "../src/lib/blog/related.ts";

test("maps industrial coating articles to real product and application paths", () => {
  const paths = getBlogTechnicalPaths({
    title: "High-temperature insulation coating selection for industrial valves",
    contentHtml: "<p>Industrial pipe and equipment insulation requires a documented coating system.</p>",
  });
  assert.ok(paths.some((path) => path.href.includes("industrial-aerogel-insulation-coating")));
  assert.ok(paths.some((path) => path.href === "/applications/industrial-pipe-equipment-insulation"));
  assert.ok(paths.some((path) => path.href === "/resources"));
});

test("maps battery articles to the battery thermal barrier route", () => {
  const paths = getBlogTechnicalPaths({
    title: "Battery thermal runaway evaluation for ESS enclosures",
    contentHtml: "<p>Battery module conditions affect thermal barrier selection.</p>",
  });
  assert.ok(paths.some((path) => path.href.includes("battery-thermal-pads")));
  assert.ok(paths.some((path) => path.href === "/applications/ev-ess-thermal-barriers"));
});
