import { chromium } from "@playwright/test";
import fs from "node:fs/promises";
const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.route("**/*", (r) =>
  ["GET", "HEAD"].includes(r.request().method()) ? r.continue() : r.abort(),
);
try {
  await page.goto("https://devinthehood.com/", {
    waitUntil: "domcontentloaded",
    timeout: 25000,
  });
  await page.locator(".loader").waitFor({ state: "hidden", timeout: 20000 });
  const controls = await page
    .locator('button,[role="button"]')
    .evaluateAll((es) =>
      es.map((e) => ({
        text: e.textContent,
        aria: e.getAttribute("aria-label"),
        class: e.className,
      })),
    );
  await fs.writeFile(
    "artifacts/reference/profile-controls.json",
    JSON.stringify(controls, null, 2),
  );
  console.log(JSON.stringify(controls));
  const profile = await page
    .locator("section")
    .evaluateAll((es) =>
      es
        .filter(
          (e) => /front/i.test(e.textContent) && /back/i.test(e.textContent),
        )
        .map((e) => ({ class: e.className, html: e.outerHTML.slice(-22000) })),
    );
  await fs.writeFile(
    "artifacts/reference/profile-sections.json",
    JSON.stringify(profile, null, 2),
  );
  console.log(
    profile.map((p) => ({ class: p.class, html: p.html.slice(-3000) })),
  );
} catch (e) {
  console.log(e.message);
}
await browser.close();
