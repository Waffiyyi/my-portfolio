import { chromium } from "@playwright/test";
import fs from "node:fs/promises";
const b = await chromium.launch({ channel: "chrome" });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
p.on("pageerror", (e) => errors.push(e.message));
for (const [slug, path] of [
  ["home", "/"],
  ["work", "/work"],
  ["case", "/work/corpers-transolution"],
  ["about", "/about"],
  ["contact", "/contact?mission=ai-products"],
]) {
  await p.goto("http://127.0.0.1:3000" + path, { waitUntil: "networkidle" });
  await p.waitForTimeout(900);
  await p.screenshot({
    path: `artifacts/visual-qa/first-${slug}.png`,
    fullPage: slug !== "home",
  });
  console.log(
    slug,
    await p.title(),
    await p.evaluate(() => ({
      width: document.documentElement.scrollWidth,
      viewport: innerWidth,
      height: document.documentElement.scrollHeight,
    })),
  );
}
await p.setViewportSize({ width: 390, height: 844 });
await p.goto("http://127.0.0.1:3000/", { waitUntil: "networkidle" });
await p.waitForTimeout(500);
await p.screenshot({
  path: "artifacts/visual-qa/first-home-mobile.png",
  fullPage: true,
});
console.log("errors", errors);
await fs.writeFile(
  "artifacts/visual-qa/first-errors.json",
  JSON.stringify(errors),
);
await b.close();
