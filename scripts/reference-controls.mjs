import { chromium } from "@playwright/test";
import fs from "node:fs/promises";

const output = "artifacts/reference";
await fs.mkdir(output, { recursive: true });
const browser = await chromium.launch({ channel: "chrome", headless: true });
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  ignoreHTTPSErrors: true,
});
// Research never submits contact messages, including accidental fetch submissions.
await context.route("**/*", async (route) => {
  if (route.request().method() !== "GET" && route.request().method() !== "HEAD")
    return route.abort();
  return route.continue();
});
const page = await context.newPage();
page.setDefaultTimeout(12000);
const results = { captured: new Date().toISOString(), steps: [] };
const save = () =>
  fs.writeFile(
    `${output}/controls${process.env.ONLY ? "-retry" : ""}-audit.json`,
    JSON.stringify(results, null, 2),
  );
async function step(name, action) {
  if (process.env.ONLY && !process.env.ONLY.split(",").includes(name)) return;
  try {
    results.steps.push({ name, result: await action() });
  } catch (error) {
    results.steps.push({
      name,
      error: error.message,
      url: page.url(),
      body: await page
        .locator("body")
        .innerText()
        .catch(() => ""),
    });
    await page
      .screenshot({
        path: `${output}/controls-error-${name}.png`,
        timeout: 5000,
      })
      .catch(() => {});
  }
  await save();
  console.log(name);
}
async function settled(route) {
  await page.goto(`https://devinthehood.com${route}`, {
    waitUntil: "commit",
    timeout: 45000,
  });
  await page.locator("body").waitFor({ state: "attached" });
  await page
    .locator(".loader")
    .waitFor({ state: "hidden", timeout: 45000 })
    .catch(() => {});
  await page.waitForTimeout(1500);
}
const scene = () =>
  page.evaluate(() => ({
    y: scrollY,
    height: document.documentElement.scrollHeight,
    pins: [...document.querySelectorAll(".pin-spacer")].map((el) => ({
      class: el.className,
      height: el.getBoundingClientRect().height,
      top: el.getBoundingClientRect().top,
      child: el.firstElementChild?.className,
    })),
    horizontal: [
      ...document.querySelectorAll(
        '[class*="street"], [class*="factory"], [class*="track"], [class*="profile"], [class*="flip"]',
      ),
    ].map((el) => {
      const s = getComputedStyle(el);
      const b = el.getBoundingClientRect();
      return {
        class: el.className,
        position: s.position,
        transform: s.transform,
        x: b.x,
        y: b.y,
        width: b.width,
        height: b.height,
        scrollWidth: el.scrollWidth,
      };
    }),
    switches: [
      ...document.querySelectorAll(
        'input, [role="switch"], [role="tab"], [class*="toggle"]',
      ),
    ].map((el) => ({
      tag: el.tagName,
      type: el.type,
      role: el.getAttribute("role"),
      class: el.className,
      text: el.textContent?.slice(0, 100),
      aria: el.getAttribute("aria-label"),
    })),
  }));
await step("desktop-home-initial", async () => {
  await settled("/");
  return scene();
});
await step("desktop-wheel-forward-reverse", async () => {
  const samples = [];
  for (const delta of [900, 1500, 2300, 3000, 3000, 3000, -3000]) {
    await page.mouse.wheel(0, delta);
    await page.waitForTimeout(1200);
    samples.push(await scene());
  }
  await page.screenshot({ path: `${output}/controls-horizontal.png` });
  return samples;
});
await step("home-profile-controls", async () => {
  if (process.env.ONLY) await settled("/");
  const loc = page
    .locator('input[type="checkbox"], [role="switch"], [class*="toggle"]')
    .first();
  const candidates = await page
    .locator('input[type="checkbox"], [role="switch"], [class*="toggle"]')
    .evaluateAll((es) => es.map((e) => ({ html: e.outerHTML.slice(0, 800) })));
  if (await loc.count()) {
    await loc.scrollIntoViewIfNeeded();
    await loc.click({ timeout: 5000 });
    await page.waitForTimeout(800);
    await page.screenshot({ path: `${output}/controls-profile-toggle.png` });
  }
  const frontBack = await page
    .locator('label, a, button, span, [role="button"], [tabindex]')
    .evaluateAll((es) =>
      es
        .filter((e) => /^(front|back)$/i.test(e.textContent.trim()))
        .map((e) => ({
          html: e.outerHTML,
          parent: e.parentElement?.outerHTML.slice(0, 1800),
        })),
    );
  return { candidates, frontBack, scene: await scene() };
});
await step("archive-filters", async () => {
  await settled("/work");
  const names = await page.locator("button").allTextContents();
  const states = [];
  for (const name of names.map((s) => s.trim()).filter(Boolean)) {
    const button = page.getByRole("button", { name, exact: true });
    if (!(await button.count())) continue;
    await button.evaluate((e) => e.click());
    await page.waitForTimeout(600);
    states.push({
      filter: name,
      active: await button.getAttribute("class"),
      projects: await page.locator('a[href^="/work/"]').evaluateAll((es) =>
        es
          .filter((e) => {
            const s = getComputedStyle(e);
            return (
              s.display !== "none" &&
              s.visibility !== "hidden" &&
              e.getBoundingClientRect().height > 0
            );
          })
          .map((e) => ({
            href: e.getAttribute("href"),
            text: e.textContent?.trim().slice(0, 120),
          })),
      ),
    });
  }
  await page.screenshot({ path: `${output}/controls-archive-filter.png` });
  return states;
});
await step("contact-selection-and-validation", async () => {
  await settled("/contact");
  const input = page.locator("textarea");
  const states = [];
  const missions = page.locator("button.mission");
  for (let i = 0; i < (await missions.count()); i++) {
    await missions.nth(i).evaluate((e) => e.click());
    await page.waitForTimeout(700);
    states.push({
      index: i,
      class: await missions.nth(i).getAttribute("class"),
      pressed: await missions.nth(i).getAttribute("aria-pressed"),
      message: await input.inputValue(),
      url: page.url(),
    });
  }
  await input.fill((await input.inputValue()) + "\nResearch text preserved?");
  await missions.first().evaluate((e) => e.click());
  states.push({ changeAfterTyping: await input.inputValue() });
  await page
    .getByRole("button", { name: "Clear the mission" })
    .evaluate((e) => e.click());
  states.push({ cleared: await input.inputValue() });
  await page.screenshot({ path: `${output}/controls-contact-selection.png` });
  // Native constraint validation only. Do not dispatch submit to an external recipient.
  const validation = await page
    .locator("form")
    .evaluateAll((es) =>
      es.map((form) => ({
        valid: form.checkValidity(),
        fields: [...form.elements]
          .filter((e) => "validity" in e)
          .map((e) => ({
            name: e.name,
            type: e.type,
            required: e.required,
            maxLength: e.maxLength,
            valid: e.validity.valid,
            message: e.validationMessage,
          })),
      })),
    );
  return { states, validation };
});
await step("contact-query-prefill", async () => {
  await settled("/contact");
  const hrefs = await page
    .locator("button.mission")
    .evaluateAll((es) => es.map((e) => e.getAttribute("data-mission")));
  const url =
    "/contact?mission=" + encodeURIComponent(hrefs[0] || "Web platforms");
  await settled(url);
  return {
    discovered: hrefs,
    url: page.url(),
    message: await page.locator("textarea").inputValue(),
    active: await page
      .locator("button.mission")
      .evaluateAll((es) =>
        es.map((e) => ({
          class: e.className,
          pressed: e.getAttribute("aria-pressed"),
        })),
      ),
  };
});
await step("back-forward", async () => {
  await settled("/work");
  await page
    .locator('a[href^="/work/"]')
    .first()
    .evaluate((e) => e.click());
  await page.waitForTimeout(2000);
  const detail = page.url();
  await page.goBack({ waitUntil: "domcontentloaded", timeout: 15000 });
  await page.waitForTimeout(1500);
  const back = page.url();
  await page.goForward({ waitUntil: "domcontentloaded", timeout: 15000 });
  await page.waitForTimeout(1500);
  return { detail, back, forward: page.url() };
});
await step("mobile-menu-escape", async () => {
  await page.setViewportSize({ width: 390, height: 844 });
  await settled("/");
  await page.getByRole("button", { name: "Menu", exact: true }).click();
  await page.waitForTimeout(700);
  const open = await page.evaluate(() => ({
    focus: document.activeElement?.outerHTML,
    bodyClass: document.body.className,
    links: [...document.querySelectorAll("nav a")].map((e) => ({
      text: e.textContent,
      rect: e.getBoundingClientRect().toJSON(),
    })),
  }));
  await page.screenshot({ path: `${output}/controls-mobile-menu-open.png` });
  await page.keyboard.press("Escape");
  await page.waitForTimeout(700);
  const escaped = await page.evaluate(() => ({
    focus: document.activeElement?.outerHTML,
    bodyClass: document.body.className,
    expanded: document.querySelector(".burger")?.getAttribute("aria-expanded"),
  }));
  await page.screenshot({ path: `${output}/controls-mobile-menu-escape.png` });
  return { open, escaped };
});
await step("reduced-motion", async () => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await settled("/");
  const first = await scene();
  await page.mouse.wheel(0, 3000);
  await page.waitForTimeout(1000);
  await page.screenshot({ path: `${output}/controls-reduced-motion.png` });
  return { first, after: await scene() };
});
await browser.close();
