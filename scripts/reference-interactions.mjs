import { chromium } from "@playwright/test";
import fs from "node:fs/promises";
const browser = await chromium.launch({ channel: "chrome", headless: true });
const c = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const p = await c.newPage();
await p.goto("https://devinthehood.com/", {
  waitUntil: "domcontentloaded",
  timeout: 60000,
});
console.log("DOM ready");
await p.waitForTimeout(20000);
await p.screenshot({ path: "artifacts/reference/home-settled.png" });
const initial = await p.evaluate(() => ({
  body: document.body.className,
  overlays: [
    ...document.querySelectorAll('[class*="loader"],[class*="preload"]'),
  ].map((e) => ({
    tag: e.tagName,
    class: e.className,
    text: e.textContent,
    opacity: getComputedStyle(e).opacity,
    display: getComputedStyle(e).display,
  })),
  styles: [...document.querySelectorAll(".split *,header,nav,footer")]
    .filter((e) => e.textContent?.trim() && e.children.length === 0)
    .slice(0, 35)
    .map((e) => {
      let s = getComputedStyle(e);
      return {
        text: e.textContent,
        tag: e.tagName,
        class: e.className,
        font: s.fontFamily,
        size: s.fontSize,
        weight: s.fontWeight,
        line: s.lineHeight,
        spacing: s.letterSpacing,
        color: s.color,
      };
    }),
  sheets: [...document.styleSheets].map((s) => s.href),
  pins: [...document.querySelectorAll(".pin-spacer")].map((e) => ({
    height: e.clientHeight,
    html: e.firstElementChild?.outerHTML.slice(0, 150),
  })),
  vars: getComputedStyle(document.documentElement).cssText,
}));
await fs.writeFile(
  "artifacts/reference/interaction-audit.json",
  JSON.stringify(initial, null, 2),
);
console.log(JSON.stringify(initial));
for (const t of [0, 0.1, 0.25, 0.5, 0.75, 1]) {
  await p.evaluate(
    (t) =>
      window.scrollTo(
        0,
        (document.documentElement.scrollHeight - innerHeight) * t,
      ),
    t,
  );
  await p.waitForTimeout(1300);
  await p.screenshot({ path: `artifacts/reference/home-settled-${t}.png` });
}
await p.evaluate(() => scrollTo(0, 0));
await p.waitForTimeout(1000);
await p.getByRole("button", { name: "Menu", exact: true }).click();
await p.waitForTimeout(800);
await p.screenshot({ path: "artifacts/reference/menu-open.png" });
await p.keyboard.press("Escape");
await p.waitForTimeout(800);
await browser.close();
