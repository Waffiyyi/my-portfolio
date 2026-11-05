import { test, expect } from "@playwright/test";

for (const interruption of ["viewport exit", "window blur"] as const) {
  test(`cursor keeps following after ${interruption} interrupts active motion`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 812 });
    await page.goto("/work/corpers-transolution", { waitUntil: "networkidle" });
    await expect(page.locator(".loader")).toHaveCount(0);
    await page.evaluate(() => scrollTo({ top: 640, behavior: "instant" }));
    await page.mouse.move(600, 500);
    await page.waitForTimeout(600);
    for (let cycle = 0; cycle < 3; cycle++) {
      await page.mouse.move(900, 300);
      await page.waitForTimeout(30);
      if (interruption === "viewport exit") {
        await page.mouse.move(-10, -10, { steps: 6 });
      } else {
        await page.evaluate(() => window.dispatchEvent(new Event("blur")));
      }
      await expect(page.locator(".pointer-effect")).toHaveAttribute(
        "data-visible",
        "false",
      );
      await page.mouse.move(1050, 40);
      await page.waitForTimeout(40);
      // Checking only the first re-entry position misses the stuck follow tween.
      for (const [x, y] of [
        [400, 650],
        [700, 450],
      ]) {
        await page.mouse.move(x, y, { steps: 8 });
        await expect
          .poll(
            async () =>
              page.locator(".pointer-dot, .pointer-ring").evaluateAll(
                (nodes, point) =>
                  Math.max(
                    ...nodes.map((node) => {
                      const bounds = node.getBoundingClientRect();
                      return Math.hypot(
                        bounds.x + bounds.width / 2 - point.x,
                        bounds.y + bounds.height / 2 - point.y,
                      );
                    }),
                  ),
                { x, y },
              ),
            { timeout: 2000 },
          )
          .toBeLessThan(1);
      }
    }
  });
}

test("cursor follows with a trailing ring and matches surface and hover states", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/work", { waitUntil: "networkidle" });
  await expect(page.locator(".loader")).toHaveCount(0);
  const cursor = page.locator(".pointer-effect");
  const dot = cursor.locator(".pointer-dot");
  const ring = cursor.locator(".pointer-ring");
  await expect(cursor).toHaveAttribute("data-visible", "false");
  await page.mouse.move(1000, 350);
  await expect(cursor).toHaveCSS("visibility", "visible");
  await page.waitForTimeout(550);
  await page.mouse.move(1200, 350);
  await page.waitForTimeout(80);
  const earlyDot = (await dot.boundingBox())!;
  const earlyRing = (await ring.boundingBox())!;
  expect(earlyDot.x + earlyDot.width / 2).toBeGreaterThan(
    earlyRing.x + earlyRing.width / 2 + 10,
  );
  await expect
    .poll(async () => {
      const bounds = (await ring.boundingBox())!;
      return Math.abs(bounds.x + bounds.width / 2 - 1200);
    })
    .toBeLessThan(1);
  expect((await dot.boundingBox())!.width).toBeCloseTo(7, 0);
  expect((await ring.boundingBox())!.width).toBeCloseTo(27.6, 0);
  await expect(cursor).toHaveAttribute("data-tone", "dark");
  await expect(dot).toHaveCSS("background-color", "rgb(22, 19, 15)");

  await page.locator('.desktop-nav a[href="/contact"]').hover();
  await expect(cursor).toHaveAttribute("data-mode", "hover");
  await expect
    .poll(async () => (await ring.boundingBox())!.width)
    .toBeCloseTo(46, 0);
  await expect(page.locator('.desktop-nav a[href="/contact"]')).not.toHaveCSS(
    "cursor",
    "none",
  );

  await page.locator(".project-link").first().hover();
  await expect(cursor).toHaveAttribute("data-mode", "view");
  await expect(cursor.locator(".pointer-label")).toHaveText("View");
  await expect(ring).toHaveCSS("background-color", "rgb(234, 29, 15)");
  await expect
    .poll(async () => (await ring.boundingBox())!.width)
    .toBeCloseTo(52.9, 0);
  await page.screenshot({
    path: "artifacts/visual-qa/cursor-project-hover.png",
  });
  // The decorative ring must never take over the hit target or block navigation.
  await page.locator(".project-link").first().click();
  await expect(page).toHaveURL(/\/work\/corpers-transolution$/);
  await expect(page.locator(".route-cover")).toHaveCSS("visibility", "hidden");
  await page.locator(".case-hero-panel dt").first().hover();
  await expect(cursor).toHaveAttribute("data-tone", "light");
  await expect(dot).toHaveCSS("background-color", "rgb(244, 241, 234)");
  await expect(ring).toHaveCSS("border-top-color", "rgba(244, 241, 234, 0.45)");
  await page.screenshot({
    path: "artifacts/visual-qa/cursor-dark-surface.png",
  });
  await page.evaluate(() => window.dispatchEvent(new Event("blur")));
  await expect(cursor).toHaveAttribute("data-visible", "false");
  await page.mouse.move(1200, 300);
  await expect(cursor).toHaveCSS("visibility", "visible");
  await page.waitForTimeout(550);
  const restored = (await ring.boundingBox())!;
  expect(restored.x + restored.width / 2).toBeCloseTo(1200, 0);
  await page.mouse.move(-10, -10);
  await expect(cursor).toHaveAttribute("data-visible", "false");
});

test("cursor survives navigation, dialog use and motion preference changes", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1000, height: 900 });
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/work", { waitUntil: "networkidle" });
  await expect(page.locator(".loader")).toHaveCount(0);
  for (const destination of ["/about", "/contact", "/work"]) {
    await page.setViewportSize({ width: 700, height: 900 });
    await page.getByRole("button", { name: "Open menu" }).click();
    // A modal can remain open when a desktop window is widened.
    await page.setViewportSize({ width: 1000, height: 900 });
    await page.locator(`.nav-dialog a[href="${destination}"]`).hover();
    await expect(page.locator(".nav-dialog .pointer-effect")).toHaveCSS(
      "visibility",
      "visible",
    );
    await expect(page.locator(".pointer-effect")).toHaveCount(1);
    await page.locator(`.nav-dialog a[href="${destination}"]`).click();
    await expect(page).toHaveURL(new RegExp(`${destination}$`));
    await expect(page.locator(".route-cover")).toHaveCSS(
      "visibility",
      "hidden",
    );
    await page.mouse.move(600, 300);
    await expect(page.locator(".pointer-effect")).toHaveCSS(
      "visibility",
      "visible",
    );
    if (destination === "/contact") {
      await page.locator("#name").click();
      await page.locator("#name").fill("Cursor check");
      await expect(page.locator("#name")).toHaveValue("Cursor check");
      await expect(page.locator("#name")).not.toHaveCSS("cursor", "none");
    }
  }
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.mouse.move(700, 300);
  await expect(page.locator(".pointer-effect")).toHaveCSS("display", "none");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.mouse.move(710, 300);
  await expect(page.locator(".pointer-effect")).toHaveCSS(
    "visibility",
    "visible",
  );
  await page.setViewportSize({ width: 800, height: 900 });
  await expect(page.locator(".pointer-effect")).toHaveCSS("display", "none");
  await page.setViewportSize({ width: 1000, height: 900 });
  await page.mouse.move(700, 310);
  await expect(page.locator(".pointer-effect")).toHaveCSS(
    "visibility",
    "visible",
  );
  expect(errors).toEqual([]);
});

test("cursor resolves both surfaces beneath the transparent homepage heading", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/", { waitUntil: "networkidle" });
  await expect(page.locator(".loader")).toHaveCount(0);
  await page.mouse.move(400, 260);
  await expect(page.locator(".pointer-effect")).toHaveAttribute(
    "data-tone",
    "dark",
  );
  await page.mouse.move(1000, 260);
  await expect(page.locator(".pointer-effect")).toHaveAttribute(
    "data-tone",
    "light",
  );
});

test.describe("touch cursor fallback", () => {
  test.use({
    viewport: { width: 1024, height: 900 },
    hasTouch: true,
    isMobile: true,
  });
  test("touch input has no decorative cursor and project navigation remains usable", async ({
    page,
  }) => {
    await page.goto("/work", { waitUntil: "networkidle" });
    await expect(page.locator(".loader")).toHaveCount(0);
    await page.locator(".project-link").first().tap();
    await expect(page).toHaveURL(/\/work\/corpers-transolution$/);
    await expect(page.locator(".pointer-effect")).toHaveCSS("display", "none");
  });
});
