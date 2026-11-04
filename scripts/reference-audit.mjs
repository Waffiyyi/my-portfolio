import { chromium } from "@playwright/test";
import fs from "node:fs/promises";
const browser = await chromium.launch({ channel: "chrome", headless: true });
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  ignoreHTTPSErrors: true,
});
const page = await context.newPage();
const data = [];
for (const [name, url] of [
  ["reference", "https://devinthehood.com/"],
  ["archive", "https://devinthehood.com/work"],
  ["contact", "https://devinthehood.com/contact"],
  ["original", "https://waffiyyi-fashola.vercel.app/"],
  ["original-projects", "https://waffiyyi-fashola.vercel.app/projects"],
  ["original-about", "https://waffiyyi-fashola.vercel.app/about"],
  ["original-contact", "https://waffiyyi-fashola.vercel.app/contact"],
  ["original-resume", "https://waffiyyi-fashola.vercel.app/resume"],
]) {
  try {
    const start = Date.now();
    const response = await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: 45000,
    });
    await page.screenshot({ path: `artifacts/reference/${name}-initial.png` });
    await page.waitForTimeout(6500);
    await page.screenshot({ path: `artifacts/reference/${name}-hero.png` });
    const info = await page.evaluate(() => ({
      title: document.title,
      text: document.body.innerText,
      links: [...document.querySelectorAll("a")].map((a) => ({
        text: a.innerText,
        href: a.getAttribute("href"),
      })),
      buttons: [...document.querySelectorAll("button,input,textarea")].map(
        (e) => ({
          tag: e.tagName,
          text: e.textContent,
          name: e.getAttribute("name"),
          class: e.className,
        }),
      ),
      styles: [...document.querySelectorAll("h1,h2,h3,nav,p")]
        .slice(0, 35)
        .map((e) => {
          const s = getComputedStyle(e);
          const r = e.getBoundingClientRect();
          return {
            tag: e.tagName,
            text: e.textContent?.slice(0, 80),
            font: s.fontFamily,
            size: s.fontSize,
            weight: s.fontWeight,
            lineHeight: s.lineHeight,
            spacing: s.letterSpacing,
            color: s.color,
            background: s.backgroundColor,
            x: r.x,
            y: r.y,
            width: r.width,
            height: r.height,
          };
        }),
      fonts: [...document.fonts].map((f) => ({
        family: f.family,
        weight: f.weight,
        status: f.status,
      })),
      height: document.documentElement.scrollHeight,
      bodyColor: getComputedStyle(document.body).backgroundColor,
      sections: [...document.querySelectorAll("section")].map((e) => ({
        id: e.id,
        class: e.className,
        height: e.getBoundingClientRect().height,
      })),
    }));
    data.push({
      name,
      url,
      status: response.status(),
      duration: Date.now() - start,
      ...info,
    });
    console.log(name, response.status(), info.title, info.height);
  } catch (e) {
    data.push({ name, url, error: e.message });
    console.log(name, e.message);
  }
  await fs.writeFile(
    "artifacts/reference/initial-audit.json",
    JSON.stringify(data, null, 2),
  );
}
await browser.close();
