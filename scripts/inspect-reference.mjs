import { chromium } from "@playwright/test";
import fs from "node:fs/promises";
const browser = await chromium.launch({ channel: "chrome", headless: true });
const results = [];
const viewports = [
  { width: 1440, height: 900 },
  { width: 1920, height: 1080 },
  { width: 768, height: 1024 },
  { width: 390, height: 844 },
];
for (const viewport of viewports) {
  const ctx = await browser.newContext({
    viewport,
    hasTouch: viewport.width < 800,
    ignoreHTTPSErrors: true,
  });
  const p = await ctx.newPage();
  try {
    await p.goto("https://devinthehood.com/", {
      waitUntil: "domcontentloaded",
      timeout: 25000,
    });
    await p.waitForTimeout(5000);
    const links = await p
      .locator('a[href^="/work/"]')
      .evaluateAll((es) => [...new Set(es.map((e) => e.getAttribute("href")))]);
    const routes = ["/", "/work", "/contact", ...links];
    for (const route of routes) {
      if (route !== "/") {
        await p.goto("https://devinthehood.com" + route, {
          waitUntil: "domcontentloaded",
          timeout: 25000,
        });
        await p.waitForTimeout(2500);
      }
      const slug = route.replaceAll("/", "_") || "home";
      const base = `artifacts/reference/${viewport.width}-${slug}`;
      await p.screenshot({ path: base + "-entry.png" });
      const data = await p.evaluate(() => ({
        text: document.body.innerText,
        links: [...document.querySelectorAll("a")].map((e) => ({
          text: e.innerText,
          href: e.getAttribute("href"),
        })),
        buttons: [...document.querySelectorAll("button")].map((e) => ({
          text: e.innerText,
          aria: e.getAttribute("aria-label"),
          class: e.className,
        })),
        fonts: [...document.fonts].map((f) => ({
          family: f.family,
          weight: f.weight,
        })),
        headings: [...document.querySelectorAll("h1,h2,h3")].map((e) => ({
          text: e.textContent,
          css: getComputedStyle(e).cssText,
          size: getComputedStyle(e).fontSize,
          font: getComputedStyle(e).fontFamily,
          color: getComputedStyle(e).color,
          line: getComputedStyle(e).lineHeight,
          letter: getComputedStyle(e).letterSpacing,
        })),
        pins: [...document.querySelectorAll(".pin-spacer")].map((e) => ({
          height: e.getBoundingClientRect().height,
          child: e.firstElementChild?.className,
        })),
        height: document.documentElement.scrollHeight,
      }));
      results.push({ viewport, route, ...data });
      for (const progress of [0.25, 0.5, 0.75, 1]) {
        await p.evaluate(
          (t) =>
            window.scrollTo(
              0,
              (document.documentElement.scrollHeight - innerHeight) * t,
            ),
          progress,
        );
        await p.waitForTimeout(800);
        await p.screenshot({ path: base + `-${progress}.png` });
      }
      console.log(viewport.width, route, data.height);
      await fs.writeFile(
        "artifacts/reference/detailed-audit.json",
        JSON.stringify(results, null, 2),
      );
    }
  } catch (e) {
    console.log(viewport.width, e.message);
    results.push({ viewport, error: e.message });
    await fs.writeFile(
      "artifacts/reference/detailed-audit.json",
      JSON.stringify(results, null, 2),
    );
  }
  await ctx.close();
}
await browser.close();
