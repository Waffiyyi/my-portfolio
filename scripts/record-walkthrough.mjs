import { chromium } from "@playwright/test";
import fs from "node:fs/promises";
const baseURL = process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:3000";
const browser = await chromium.launch({ channel: "chrome" });
const context = await browser.newContext({
  baseURL,
  viewport: { width: 1440, height: 900 },
  recordVideo: {
    dir: "artifacts/visual-qa/walkthrough",
    size: { width: 1440, height: 900 },
  },
});
const page = await context.newPage();
await page.route("**/api/contact", (r) => r.abort());
await page.goto("/", { waitUntil: "networkidle" });
await page.locator(".loader").waitFor({ state: "detached" });
await page.waitForTimeout(1200);
for (const p of [0, 0.25, 0.5, 0.75, 1, 0.5, 0]) {
  await page.evaluate(
    (p) => scrollTo({ top: innerHeight * 1.8 * p, behavior: "instant" }),
    p,
  );
  await page.waitForTimeout(1000);
}
for (const id of ["selected-work", "engineering"]) {
  const section = page.locator("#" + id);
  const start = await section
    .locator("..")
    .evaluate((el) => el.getBoundingClientRect().top + scrollY);
  const distance = await section
    .locator(".horizontal-track")
    .evaluate((el) => el.scrollWidth - el.parentElement.clientWidth);
  for (const p of [0, 0.5, 1, 0.5]) {
    await page.evaluate(
      (y) => scrollTo({ top: y, behavior: "instant" }),
      start + distance * p,
    );
    await page.waitForTimeout(1100);
  }
}
await page.getByRole("button", { name: "The back", exact: true }).click();
await page.waitForTimeout(1000);
await page
  .locator(".profile-layout")
  .screenshot({ path: "artifacts/visual-qa/profile-back.png" });
await page.getByRole("tab", { name: /AI-powered/ }).click();
await page.waitForTimeout(700);
await page.screenshot({ path: "artifacts/visual-qa/mission-ai.png" });
await page.locator(".closing-strip").scrollIntoViewIfNeeded();
await page.evaluate(() => scrollBy(0, 250));
await page.waitForTimeout(1000);
await page.screenshot({ path: "artifacts/visual-qa/closing-scene.png" });
await page.locator(".footer-title").click();
await page.waitForURL("**/contact");
await page.waitForTimeout(1000);
const video = page.video();
await context.close();
await fs.writeFile(
  "artifacts/visual-qa/walkthrough.json",
  JSON.stringify({ video: await video.path(), baseURL }, null, 2),
);
await browser.close();
