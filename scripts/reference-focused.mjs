import { chromium } from "@playwright/test";
import fs from "node:fs/promises";
const b = await chromium.launch({ channel: "chrome" });
const c = await b.newContext({ viewport: { width: 1440, height: 900 } });
const p = await c.newPage();
const results = [];
await p.route("**/*", (r) =>
  ["GET", "HEAD"].includes(r.request().method()) ? r.continue() : r.abort(),
);
async function visit(path) {
  await p.goto("https://devinthehood.com" + path, {
    waitUntil: "domcontentloaded",
    timeout: 15000,
  });
  await p.locator(".loader").waitFor({ state: "hidden", timeout: 20000 });
  await p.waitForTimeout(1000);
}
async function check(name, fn) {
  try {
    const result = await fn();
    results.push({ name, result });
    console.log(name, "captured");
  } catch (e) {
    results.push({ name, error: e.message });
    console.log(name, "unverified");
  }
  await fs.writeFile(
    "artifacts/reference/focused-controls.json",
    JSON.stringify(results, null, 2),
  );
}
await check("archive-filters", async () => {
  await visit("/work");
  const buttons = p
    .locator("button")
    .filter({
      hasText: /^(ALL|DESIGN|SAAS PLATFORM|FULL-STACK|FRONT-END|TOOLS)$/i,
    });
  const report = [];
  for (let i = 0; i < (await buttons.count()); i++) {
    const button = buttons.nth(i);
    const label = await button.innerText();
    await button.click({ force: true });
    await p.waitForTimeout(800);
    report.push({
      label,
      active: await button.getAttribute("class"),
      visibleProjects: await p.locator('a[href^="/work/"]:visible').count(),
    });
    await p.screenshot({ path: `artifacts/reference/filter-${i}.png` });
  }
  return report;
});
await check("contact-mission", async () => {
  await visit("/contact");
  const mission = p.locator("button.mission").nth(2);
  await mission.scrollIntoViewIfNeeded();
  await p.waitForTimeout(1200);
  await mission.click({ force: true });
  await p.waitForTimeout(500);
  const selected = {
    pressed: await mission.getAttribute("aria-pressed"),
    message: await p.locator("textarea").inputValue(),
  };
  await p.screenshot({ path: "artifacts/reference/contact-selected.png" });
  const clear = p.getByRole("button", { name: "Clear the mission" });
  if (await clear.count()) {
    await clear.click({ force: true });
    await p.waitForTimeout(300);
  }
  return {
    selected,
    cleared: await p.locator("textarea").inputValue(),
    required: await p
      .locator("input,textarea")
      .evaluateAll((es) =>
        es.map((e) => ({
          name: e.getAttribute("name"),
          required: e.required,
          type: e.getAttribute("type"),
        })),
      ),
    valid: await p.locator("form").evaluate((e) => e.checkValidity()),
  };
});
await check("profile-toggle", async () => {
  await visit("/");
  const controls = await p
    .locator('input[type="checkbox"],[role="switch"]')
    .evaluateAll((es) =>
      es.map((e) => ({
        html: e.outerHTML,
        parent: e.parentElement?.outerHTML.slice(0, 1800),
      })),
    );
  const target = p.locator('input[type="checkbox"],[role="switch"]').first();
  if (await target.count()) {
    await target.scrollIntoViewIfNeeded();
    await p.waitForTimeout(1200);
    await target.click({ force: true });
    await p.waitForTimeout(600);
    await p.screenshot({ path: "artifacts/reference/profile-toggle.png" });
  }
  return controls;
});
await b.close();
