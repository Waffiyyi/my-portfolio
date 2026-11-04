import { chromium } from "@playwright/test";
import fs from "node:fs/promises";
const b = await chromium.launch({ channel: "chrome" });
const data = JSON.parse(
  await fs.readFile("artifacts/reference/detailed-audit.json", "utf8"),
);
const routes = [...new Set(data.filter((d) => d.route).map((d) => d.route))];
const results = JSON.parse(
  await fs.readFile("artifacts/reference/completion-audit.json", "utf8"),
).filter((d) => d.status === "captured");
for (const vp of [
  { width: 1920, height: 1080 },
  { width: 390, height: 844 },
]) {
  const ctx = await b.newContext({ viewport: vp, hasTouch: vp.width < 800 });
  const p = await ctx.newPage();
  await p.route("**/*", (r) =>
    ["GET", "HEAD"].includes(r.request().method()) ? r.continue() : r.abort(),
  );
  for (const route of routes.filter(
    (route) =>
      !data.some((d) => d.route === route && d.viewport.width === vp.width) &&
      !results.some((d) => d.route === route && d.viewport.width === vp.width),
  )) {
    try {
      await p.goto("https://devinthehood.com" + route, {
        waitUntil: "domcontentloaded",
        timeout: 30000,
      });
      await p
        .locator(".loader")
        .waitFor({ state: "hidden", timeout: 25000 })
        .catch(() => {});
      await p.waitForTimeout(1000);
      const name = `artifacts/reference/${vp.width}-${route.replaceAll("/", "_")}`;
      await p.screenshot({ path: name + "-entry.png" });
      for (const progress of [0.25, 0.5, 0.75, 1]) {
        await p.evaluate(
          (t) =>
            scrollTo(
              0,
              (document.documentElement.scrollHeight - innerHeight) * t,
            ),
          progress,
        );
        await p.waitForTimeout(1200);
        await p.screenshot({ path: name + `-${progress}.png` });
      }
      results.push({
        route,
        viewport: vp,
        status: "captured",
        title: await p.title(),
      });
      console.log(vp.width, route, "captured");
    } catch (e) {
      results.push({ route, viewport: vp, error: e.message });
      console.log(vp.width, route, "failed");
    }
    await fs.writeFile(
      "artifacts/reference/completion-audit.json",
      JSON.stringify(results, null, 2),
    );
  }
  await ctx.close();
}
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p
  .goto("https://waffiyyi-fashola.vercel.app/", {
    waitUntil: "domcontentloaded",
    timeout: 30000,
  })
  .catch(() => {});
await p.waitForTimeout(2000);
await p.screenshot({ path: "artifacts/reference/original-home-settled.png" });
await b.close();
