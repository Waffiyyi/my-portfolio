import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import fs from "node:fs/promises";
const slugs = [
  "corpers-transolution",
  "bolda",
  "loveflower-wellness",
  "flowpay",
  "crave-courier",
];
const viewports = [
  { width: 1440, height: 900 },
  { width: 1920, height: 1080 },
  { width: 768, height: 1024 },
  { width: 390, height: 844 },
  { width: 1280, height: 600 },
];
async function ready(page: Page, path: string) {
  await page.goto(path, { waitUntil: "networkidle" });
  await expect(page.locator(".loader")).toHaveCount(0, { timeout: 6000 });
  await page.evaluate(() => document.fonts.ready);
}
async function settleAll(page: Page) {
  await page.evaluate(async () => {
    for (
      let y = 0;
      y < document.documentElement.scrollHeight;
      y += innerHeight * 0.8
    ) {
      window.scrollTo({ top: y, behavior: "instant" });
      await new Promise((r) => setTimeout(r, 70));
    }
    window.scrollTo({ top: 0, behavior: "instant" });
  });
  await page.waitForTimeout(800);
}
test.beforeEach(async ({ page }) => {
  await page.route("https://api.web3forms.com/**", (r) => r.abort());
});
test("loader completes, navigation transitions and history remain usable", async ({
  page,
}) => {
  await page.setViewportSize(viewports[0]);
  await ready(page, "/");
  await expect(page.locator("h1")).toBeVisible();
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: /Work/ })
    .click();
  await expect(page).toHaveURL(/\/work$/);
  await expect(page.locator(".route-cover")).toHaveCSS("visibility", "hidden");
  await page.locator('.project-link[href="/work/bolda"]').click();
  await expect(page).toHaveURL(/\/work\/bolda$/);
  await page.goBack();
  await expect(page).toHaveURL(/\/work$/);
  await expect(page.locator("h1")).toBeVisible();
  await page.goForward();
  await expect(page).toHaveURL(/\/work\/bolda$/);
  await page.reload();
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Bolda");
  await expect(page.locator(".loader")).toHaveCount(0);
});
test("repeated homepage re-entry cleans up animation contexts without recursion", async ({
  page,
}) => {
  test.setTimeout(120000);
  await page.setViewportSize(viewports[0]);
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await ready(page, "/");
  for (let cycle = 0; cycle < 3; cycle++) {
    for (const path of ["/work", "/", "/about", "/", "/contact", "/"]) {
      await page.locator(`.desktop-nav a[href="${path}"]`).click();
      await expect(page).toHaveURL(new RegExp(`${path === "/" ? "/" : path}$`));
      await expect(page.locator(".route-cover")).toHaveCSS(
        "visibility",
        "hidden",
      );
      await expect(page.locator("main h1")).toBeVisible();
      if (path === "/") {
        // Let the returning-visitor delayed heading callback execute before unmount.
        await page.waitForTimeout(700);
        await expect(page.locator(".pin-spacer")).toHaveCount(3);
      } else {
        await expect(page.locator(".pin-spacer")).toHaveCount(0);
      }
      expect(errors).toEqual([]);
    }
  }
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(page.locator(".pin-spacer")).toHaveCount(3);
  await page.waitForTimeout(700);
  await page.locator('.desktop-nav a[href="/work"]').click();
  await expect(page).toHaveURL(/\/work$/);
  await expect(page.locator(".route-cover")).toHaveCSS("visibility", "hidden");
  expect(errors).toEqual([]);
});
test("slow-font loader can be skipped and no-JS content remains available", async ({
  browser,
}) => {
  const context = await browser.newContext({
    baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:3000",
  });
  const page = await context.newPage();
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.route("**/*.woff2", async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 2500));
    await route.continue();
  });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.getByRole("button", { name: "Skip intro" }).click();
  await expect(page.locator(".loader")).toHaveCount(0);
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator("h1")).toBeVisible();
  expect(errors).toEqual([]);
  await context.close();
  const staticContext = await browser.newContext({
    javaScriptEnabled: false,
    baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:3000",
  });
  const staticPage = await staticContext.newPage();
  await staticPage.goto("/work");
  await expect(staticPage.locator(".loader")).not.toBeVisible();
  await expect(staticPage.locator(".project-card")).toHaveCount(5);
  await staticContext.close();
});
test("desktop pinned tracks reach both endpoints and reverse", async ({
  page,
}) => {
  await page.setViewportSize(viewports[0]);
  await ready(page, "/");
  await expect(page.locator(".pin-spacer")).toHaveCount(3);
  for (const id of ["selected-work", "engineering"]) {
    const section = page.locator(`#${id}`);
    const spacer = section.locator("..");
    const bounds = await spacer.boundingBox();
    expect(bounds).not.toBeNull();
    const start = (await page.evaluate(() => scrollY)) + bounds!.y;
    const last = section.locator("[data-track-item]").last();
    await page.evaluate(
      (y) => scrollTo({ top: y, behavior: "instant" }),
      start + 20,
    );
    await page.waitForTimeout(800);
    await page.screenshot({ path: `artifacts/visual-qa/${id}-start.png` });
    const distance = await section
      .locator(".horizontal-track")
      .evaluate((e) => e.scrollWidth - e.parentElement!.clientWidth);
    await page.evaluate(
      (y) => scrollTo({ top: y, behavior: "instant" }),
      start + distance / 2,
    );
    await page.waitForTimeout(1000);
    expect(Math.abs((await section.boundingBox())!.y)).toBeLessThan(2);
    await page.screenshot({ path: `artifacts/visual-qa/${id}-middle.png` });
    await page.evaluate(
      (y) => scrollTo({ top: y, behavior: "instant" }),
      start + distance,
    );
    await page.waitForTimeout(1200);
    const lastBounds = await last.boundingBox();
    await expect(last).toBeInViewport();
    expect(lastBounds!.x).toBeGreaterThanOrEqual(-2);
    expect(lastBounds!.x + lastBounds!.width).toBeLessThanOrEqual(1442);
    await page.screenshot({ path: `artifacts/visual-qa/${id}-end.png` });
    await page.evaluate(
      (y) => scrollTo({ top: y, behavior: "instant" }),
      start,
    );
    await page.waitForTimeout(1000);
    const x = await section
      .locator(".horizontal-track")
      .evaluate((e) => new DOMMatrix(getComputedStyle(e).transform).m41);
    expect(Math.abs(x)).toBeLessThan(2);
  }
});
test("live-site links fit the pinned gallery on shorter laptop screens", async ({
  page,
}) => {
  for (const height of [650, 768]) {
    await page.setViewportSize({ width: 1440, height });
    await ready(page, "/");
    const section = page.locator("#selected-work");
    const start = await section
      .locator("..")
      .evaluate((element) => scrollY + element.getBoundingClientRect().top);
    const distance = await section
      .locator(".horizontal-track")
      .evaluate(
        (element) => element.scrollWidth - element.parentElement!.clientWidth,
      );
    for (const [offset, index] of [
      [20, 0],
      [distance, 4],
    ]) {
      await page.evaluate(
        (top) => scrollTo({ top, behavior: "instant" }),
        start + offset,
      );
      await page.waitForTimeout(1000);
      const link = section.locator(".project-live-link").nth(index);
      await expect(link).toBeInViewport({ ratio: 1 });
      const bounds = (await link.boundingBox())!;
      expect(bounds.y).toBeGreaterThan(84);
      expect(bounds.y + bounds.height).toBeLessThanOrEqual(height);
      await expect(link).toBeVisible();
      await expect(section.locator(".track-bottom")).toBeInViewport({ ratio: 1 });
    }
    await page.screenshot({
      path: `artifacts/visual-qa/selected-live-${height}.png`,
    });
  }
});
test("opening and closing choreography resolve and reverse", async ({
  page,
}) => {
  await page.setViewportSize(viewports[0]);
  await ready(page, "/");
  await page.waitForTimeout(1200);
  const samples = [];
  for (const progress of [0, 0.25, 0.5, 0.75, 1, 0]) {
    await page.evaluate(
      (p) => scrollTo({ top: innerHeight * 1.8 * p, behavior: "instant" }),
      progress,
    );
    await page.waitForTimeout(1100);
    const state = await page.locator(".hero-resolution").evaluate((el) => ({
      opacity: Number(getComputedStyle(el).opacity),
      y: el.getBoundingClientRect().y,
    }));
    samples.push({ progress, ...state });
    if (progress === 1) expect(state.opacity).toBeGreaterThan(0.99);
    if (progress === 0) expect(state.opacity).toBeLessThan(0.01);
    await page.screenshot({
      path: `artifacts/visual-qa/opening-${progress}.png`,
    });
  }
  await page.locator(".closing-strip").scrollIntoViewIfNeeded();
  await page.evaluate(() => scrollBy(0, 250));
  await page.waitForTimeout(1200);
  const offset = await page
    .locator(".closing-strip path")
    .first()
    .evaluate((el) => parseFloat(getComputedStyle(el).strokeDashoffset));
  expect(offset).toBeLessThan(0.01);
  await expect(page.locator(".footer-title")).toBeInViewport();
  await page.screenshot({ path: "artifacts/visual-qa/closing-scene.png" });
  await fs.writeFile(
    "artifacts/visual-qa/opening-progress.json",
    JSON.stringify(samples, null, 2),
  );
});
test("archive filters have correct sets and counts", async ({ page }) => {
  await ready(page, "/work");
  for (const [cat, count] of [
    ["Full-stack", 2],
    ["AI", 2],
    ["Front-end", 1],
    ["All", 5],
  ] as const) {
    await page.getByRole("button", { name: new RegExp(`^${cat}`) }).click();
    await expect(page.locator(".archive-grid .project-card")).toHaveCount(
      count,
    );
    await expect(page.getByRole("status")).toHaveText(
      `${count} ${count === 1 ? "project" : "projects"}`,
    );
    if (cat !== "All")
      await expect(
        page.locator(".archive-grid .project-card").first(),
      ).toHaveAttribute("data-category", cat);
  }
});
test("the five selected projects expose live sites without replacing case-study links", async ({
  page,
  context,
  request,
}) => {
  const liveSites = [
    ["corpers-transolution", "https://corperstransolution.com/"],
    ["bolda", "https://www.usebolda.com/"],
    ["loveflower-wellness", "https://loveflowerwellness.com/"],
    ["flowpay", "https://your-flowpay.vercel.app/"],
    ["crave-courier", "https://crave-courier.vercel.app"],
  ];
  await ready(page, "/work");
  await expect(page.locator(".archive-grid .project-card")).toHaveCount(5);
  await expect(page.locator(".filter-list button")).toHaveCount(4);
  for (const [slug, url] of liveSites) {
    const card = page
      .locator(".project-card")
      .filter({ has: page.locator(`a.project-link[href="/work/${slug}"]`) });
    await expect(card.locator(".project-live-link")).toHaveAttribute(
      "href",
      url,
    );
    await expect(card.locator(".project-live-link")).toHaveAttribute(
      "target",
      "_blank",
    );
    await expect(card.locator("a a")).toHaveCount(0);
  }
  await context.route("https://www.usebolda.com/**", (route) =>
    route.fulfill({
      contentType: "text/html",
      body: "<title>Project website</title><h1>Project website</h1>",
    }),
  );
  const popupPromise = page.waitForEvent("popup");
  await page
    .getByRole("link", {
      name: "Visit live site — Bolda (opens in a new tab)",
      exact: true,
    })
    .click();
  const popup = await popupPromise;
  await expect(popup).toHaveURL("https://www.usebolda.com/");
  await expect(page).toHaveURL(/\/work$/);
  await popup.close();
  await context.unroute("https://www.usebolda.com/**");
  for (const [slug, url] of liveSites) {
    await ready(page, `/work/${slug}`);
    await expect(page.locator(".case-hero .case-live-link")).toHaveAttribute(
      "href",
      url,
    );
    await expect(page.locator(".case-hero .case-live-link")).toBeVisible();
  }
  const sitemap = await (await request.get("/sitemap.xml")).text();
  const paths = [...sitemap.matchAll(/<loc>[^<]*\/work\/([^<]+)<\/loc>/g)].map(
    (match) => match[1],
  );
  expect(paths.sort()).toEqual([...slugs].sort());
  expect((await request.get("/work/style-and-grace")).status()).toBe(404);
  await ready(page, "/");
  await expect(page.locator("#selected-work .project-card")).toHaveCount(5);
  await expect(page.locator("#selected-work .project-live-link")).toHaveCount(
    5,
  );
});
test("mobile menu traps focus, closes with Escape and restores focus", async ({
  page,
}) => {
  await page.setViewportSize(viewports[3]);
  await ready(page, "/");
  const open = page.getByRole("button", { name: "Open menu" });
  await open.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  for (let i = 0; i < 12; i++) {
    await page.keyboard.press("Tab");
    expect(
      await page.evaluate(() => !!document.activeElement?.closest("dialog")),
    ).toBe(true);
  }
  await page.screenshot({ path: "artifacts/visual-qa/mobile-menu.png" });
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(open).toBeFocused();
  await open.click();
  await page
    .getByRole("navigation", { name: "Expanded navigation" })
    .getByRole("link", { name: /Work/ })
    .click();
  await expect(page).toHaveURL(/\/work$/);
  await expect(page.getByRole("dialog")).not.toBeVisible();
});
test("profile toggle and mission keyboard round-trip preserve typed message", async ({
  page,
}) => {
  await ready(page, "/");
  await page.getByRole("button", { name: "The back", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "The back", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(".profile-layout")).toHaveClass(/is-back/);
  await page.getByRole("tab", { name: /Web platforms/ }).focus();
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("ArrowDown");
  await expect(page.getByRole("tab", { name: /AI-powered/ })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await page.getByRole("link", { name: /Let’s talk about it/ }).click();
  await expect(page).toHaveURL(/mission=ai-products/);
  const message = page.getByRole("textbox", { name: /Your message/ });
  await expect(message).toHaveValue("I’d like to discuss ai-powered products.");
  await message.fill(
    "I’d like to discuss ai-powered products.\n\nMy own project details must survive.",
  );
  await page.getByRole("button", { name: /Web platforms & SaaS/ }).click();
  await expect(message).toHaveValue(
    "I’d like to discuss web platforms & saas.\n\nMy own project details must survive.",
  );
  await page.getByRole("button", { name: "Clear selected mission" }).click();
  await expect(message).toHaveValue("My own project details must survive.");
  await expect(page).not.toHaveURL(/mission=/);
});
test("contact validation, pending, provider failure and confirmed success without mail", async ({
  page,
}) => {
  await ready(page, "/contact");
  await page.getByRole("button", { name: "Send your message" }).click();
  await expect(
    page.getByText("Please enter your name (at least 2 characters)."),
  ).toBeVisible();
  await expect(page.getByRole("textbox", { name: /Your name/ })).toBeFocused();
  await page.getByRole("textbox", { name: /Your name/ }).fill("QA Visitor");
  await page
    .getByRole("textbox", { name: /Email address/ })
    .fill("qa@example.test");
  await page
    .getByRole("textbox", { name: /Your message/ })
    .fill("This is a safely intercepted test enquiry.");
  await page.route("**/api/contact", async (r) => {
    await new Promise((r) => setTimeout(r, 400));
    await r.fulfill({
      status: 502,
      contentType: "application/json",
      body: JSON.stringify({
        success: false,
        message: "Test provider unavailable.",
      }),
    });
  });
  await page.getByRole("button", { name: "Send your message" }).click();
  await expect(page.getByRole("button", { name: "Sending…" })).toBeDisabled();
  await expect(page.locator(".contact-form").getByRole("alert")).toContainText(
    "Test provider unavailable",
  );
  await expect(page.getByRole("textbox", { name: /Your message/ })).toHaveValue(
    "This is a safely intercepted test enquiry.",
  );
  await page.unroute("**/api/contact");
  await page.route("**/api/contact", (r) =>
    r.fulfill({
      status: 200,
      contentType: "application/json",
      body: '{"success":true}',
    }),
  );
  await page.getByRole("button", { name: "Send your message" }).click();
  await expect(page.locator(".contact-form").getByRole("status")).toContainText(
    "delivered",
  );
  await expect(
    page.getByRole("link", { name: /Open a draft/ }),
  ).toHaveAttribute("href", /mailto:fasholawafiyyi@gmail.com\?subject=/);
});
test("server rejects invalid, cross-origin and honeypot submissions before provider", async ({
  request,
}) => {
  expect(
    (
      await request.post("/api/contact", {
        data: { name: "", email: "bad", message: "" },
      })
    ).status(),
  ).toBe(400);
  expect(
    (
      await request.post("/api/contact", {
        headers: { origin: "https://example.test" },
        data: {},
      })
    ).status(),
  ).toBe(403);
  expect(
    (await request.post("/api/contact", { data: { website: "bot" } })).status(),
  ).toBe(400);
  expect(
    (
      await request.post("/api/contact", {
        data: { message: "x".repeat(17000) },
      })
    ).status(),
  ).toBe(413);
});
test("case gallery keyboard, next project, legacy URLs and metadata", async ({
  page,
  request,
}) => {
  await ready(page, "/work/corpers-transolution");
  await page.getByRole("button", { name: "Next study" }).click();
  await expect(page.locator(".gallery-top")).toContainText("02 / 03");
  await page.locator(".gallery-track").focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.locator(".gallery-top")).toContainText("03 / 03");
  await expect
    .poll(() =>
      page
        .locator(".gallery-track")
        .evaluate((el) => el.scrollLeft / el.clientWidth),
    )
    .toBeCloseTo(2, 1);
  await page.getByRole("button", { name: "Previous study" }).click();
  await page.getByRole("button", { name: "Previous study" }).click();
  await expect
    .poll(() => page.locator(".gallery-track").evaluate((el) => el.scrollLeft))
    .toBeLessThan(2);
  await expect(page.locator(".gallery-top")).toContainText("01 / 03");
  await page.locator(".next-project-link").click();
  await expect(page).toHaveURL(/\/work\/bolda$/);
  await ready(page, "/projects");
  await expect(page).toHaveURL(/\/work$/);
  expect((await request.get("/waffiyyi-fashola-resume.pdf")).status()).toBe(
    200,
  );
  expect((await request.get("/sitemap.xml")).status()).toBe(200);
  expect((await request.get("/robots.txt")).status()).toBe(200);
  expect((await request.get("/opengraph-image")).status()).toBe(200);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://waffiyyi-fashola.vercel.app/work",
  );
});
test("reduced motion removes pins and keeps all content reachable", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await ready(page, "/");
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
  await expect(page.locator(".hero-resolution")).not.toBeVisible();
  await expect(page.locator("#missions")).toBeVisible();
  for (const card of await page.locator("#selected-work .project-card").all()) {
    await card.scrollIntoViewIfNeeded();
    await expect(card).toBeInViewport();
  }
  await page.screenshot({
    path: "artifacts/visual-qa/reduced-motion.png",
    fullPage: true,
  });
});
test("touch uses a native carousel with reachable last project", async ({
  browser,
}) => {
  const context = await browser.newContext({
    viewport: viewports[3],
    hasTouch: true,
    isMobile: true,
  });
  const page = await context.newPage();
  await ready(
    page,
    (process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:3000") + "/",
  );
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
  const viewport = page.locator("#selected-work .track-viewport");
  await viewport.scrollIntoViewIfNeeded();
  const bounds = (await viewport.boundingBox())!;
  const touchY = Math.min(650, bounds.y + bounds.height / 2);
  const client = await context.newCDPSession(page);
  await client.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [{ x: 320, y: touchY }],
  });
  for (const x of [280, 230, 180, 130, 70]) {
    await client.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [{ x, y: touchY }],
    });
    await page.waitForTimeout(25);
  }
  await client.send("Input.dispatchTouchEvent", {
    type: "touchEnd",
    touchPoints: [],
  });
  await expect
    .poll(() => viewport.evaluate((e) => e.scrollLeft))
    .toBeGreaterThan(50);
  await viewport.evaluate((e) =>
    e.scrollTo({ left: e.scrollWidth, behavior: "instant" }),
  );
  await expect(
    page.locator("#selected-work .project-card").last(),
  ).toBeInViewport();
  await context.close();
});
for (const viewport of viewports) {
  test(`visual matrix ${viewport.width}x${viewport.height}`, async ({
    page,
  }) => {
    test.setTimeout(240000);
    await page.setViewportSize(viewport);
    const errors: string[] = [];
    const failures: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("response", (r) => {
      if (r.status() >= 400 && !r.url().includes("favicon"))
        failures.push(`${r.status()} ${r.url()}`);
    });
    for (const path of [
      "/",
      "/work",
      "/about",
      "/resume",
      "/contact",
      ...slugs.map((s) => `/work/${s}`),
    ]) {
      await ready(page, path);
      await settleAll(page);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
        `Overflow on ${path}`,
      ).toBe(true);
      await expect(page.locator("main h1")).toHaveCount(1);
      await expect(page.locator('a[href="#"]')).toHaveCount(0);
      expect(
        await page
          .locator("img")
          .evaluateAll((imgs) =>
            imgs.every(
              (img) =>
                img instanceof HTMLImageElement &&
                img.complete &&
                img.naturalWidth > 0,
            ),
          ),
      ).toBe(true);
      await page.screenshot({
        path: `artifacts/visual-qa/${viewport.width}-${path.replaceAll("/", "_") || "home"}.png`,
        fullPage: path !== "/",
      });
    }
    expect(errors).toEqual([]);
    expect(failures).toEqual([]);
  });
}
test("accessibility checks across all page templates", async ({ page }) => {
  test.setTimeout(180000);
  const results = [];
  for (const path of [
    "/",
    "/work",
    "/about",
    "/resume",
    "/contact",
    "/work/bolda",
  ]) {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await ready(page, path);
    const result = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    results.push({ path, violations: result.violations });
  }
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await ready(page, "/");
  await page.waitForTimeout(1400);
  const animated = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  results.push({ path: "/ (motion enabled)", violations: animated.violations });
  await fs.writeFile(
    "artifacts/visual-qa/accessibility.json",
    JSON.stringify(results, null, 2),
  );
  expect(
    results.flatMap((r) =>
      r.violations.map((v) => ({
        path: r.path,
        id: v.id,
        nodes: v.nodes.map((n) => n.target),
      })),
    ),
  ).toEqual([]);
});

test("rapid route changes leave the latest destination visible", async ({
  page,
}) => {
  await ready(page, "/");
  await page
    .locator('.desktop-nav a[href="/work"]')
    .dispatchEvent("click", { button: 0 });
  await page.waitForTimeout(80);
  await page
    .locator('.desktop-nav a[href="/about"]')
    .dispatchEvent("click", { button: 0 });
  await expect(page).toHaveURL(/\/about$/);
  await expect(page.locator(".route-cover")).toHaveCSS("visibility", "hidden");
  await expect(page.locator("main h1")).toBeVisible();
  await page.goto("/missing-page");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "WRONG TURN.",
  );
});
