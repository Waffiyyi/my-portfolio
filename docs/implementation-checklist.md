# Implementation and acceptance matrix

QA date: 4 November 2026. Chrome via Playwright, production Next.js build on the isolated local port 3100. The initial implementation results below describe the original 13-project collection. Follow-up sections record subsequent changes; the active collection now contains only the five projects requested by the user. The original research documents were written before UI implementation. This report distinguishes route coverage, interaction assertions and manually inspected screenshots.

## Route × viewport coverage

`Pass` means direct navigation, one main h1, no horizontal document overflow, no dummy `#` links, complete images, no browser exceptions and no HTTP asset failures, with screenshot capture after scroll reveals. All 13 case studies are included: **90 route/viewport combinations**.

| Route/template          | 1440×900 | 1920×1080 | 768×1024 | 390×844 | 1280×600 |
| ----------------------- | -------- | --------- | -------- | ------- | -------- |
| `/`                     | Pass     | Pass      | Pass     | Pass    | Pass     |
| `/work`                 | Pass     | Pass      | Pass     | Pass    | Pass     |
| `/work/[slug]` — all 13 | Pass     | Pass      | Pass     | Pass    | Pass     |
| `/about`                | Pass     | Pass      | Pass     | Pass    | Pass     |
| `/resume`               | Pass     | Pass      | Pass     | Pass    | Pass     |
| `/contact`              | Pass     | Pass      | Pass     | Pass    | Pass     |

`/projects` is tested separately as a permanent redirect. Unknown-route behavior is tested separately as a usable 404. These two checks are not claimed as a five-viewport matrix.

## Functional acceptance

- First-visit loader completes; repeat visits bypass it. Delayed-font Skip Intro and no-JavaScript archive access pass. Loader completion is guarded so late font readiness cannot restart a dismissed intro. Internal transition covers resolve; direct nested loads, reload and browser back/forward work. Rapid navigation leaves the latest destination usable.
- Three desktop pins: opening, selected work, engineering. Track starts/middles/ends and reverse travel are asserted against measured DOM bounds. Opening opacity is sampled at 0/25/50/75/100% and back to zero; closing SVG paths reach their drawn endpoint.
- Mobile menu wraps keyboard focus, supports Escape and restores its trigger. Native touch swipe moves the project track; the final card is reachable. Reduced motion removes pins and presents every project in a static layout.
- All six archive filter sets and counts match data. Five flagships appear on the homepage; all 13 have independent case URLs.
- Profile Front/Back buttons animate real layout changes. Mission tabs support arrow keys, related work and encoded contact navigation.
- Mission prefill, change and clear preserve user-entered text. Contact checks cover client validation/focus, pending disabled state, mocked provider failure, preserved message and confirmed mocked success. Server checks cover invalid fields, wrong origin, honeypot and payload limits. No valid provider request or real email was sent.
- Case gallery supports button/keyboard/swipe, next-project navigation, PDF, sitemap, robots, Open Graph and canonical metadata. A smooth-scroll destination race found during QA was fixed and strengthened with actual scroll-position assertions.
- Automated axe WCAG 2 A/AA and 2.1 A/AA checks across six templates (including an additional normal-motion homepage state) reported zero violations. This is an automated result, not a claim of complete accessibility certification.

## Visual review and evidence

Ignored local evidence: `artifacts/visual-qa/`, `artifacts/reference/`, `test-results/`, `playwright-report/`. Representative rendered images inspected: desktop/wide/mobile opening, mid/resolved hero, selected-work and engineering start/middle/end, tablet archive, desktop Bolda case, mobile contact, mobile menu, profile back, mission panel and closing scene. `scripts/record-walkthrough.mjs` records an approximately 30-second local navigation/scroll video with contact requests intercepted.

Visual fixes made during QA include desktop pin refresh order, mobile artwork scale, outline-heading contrast, footer wrapping, menu focus containment, small-text/button contrast, final-hero control contrast and gallery rapid-input handling. A prior development-server/build collision was resolved by stopping the task's dev server and testing a dedicated production server. When the user later started their own portfolio dev server on port 3000, the final performance preview was built in an isolated temporary source copy with shared read-only dependencies. No user-owned server was stopped.

Reference coverage: all 18 dynamically discovered routes at four sizes, plus focused filters, contact selection/clear/validation, menu, wheel-driven motion and reduced motion. Some early loader/lazy-media captures remain incomplete; exact hidden/easing/gallery/history permutations are not asserted. See `reference-controls.md`.

## Commands and final results

- `npm run build`: passed; Next.js 15.5.29; 26 generated pages; homepage first-load JS 185kB, shared JS 103kB (Next build report).
- `npm run typecheck`: passed.
- `npm run lint`: passed.
- `git diff --check`: passed.
- `PLAYWRIGHT_BASE_URL=http://127.0.0.1:3100 npm test`: full 18-check run finished with 17 passing and one gallery race failure (5.4 minutes). After fixing that race and adding slow-font/skip/no-JS coverage, the targeted seven-check regression run passed 7/7 (52.3 seconds). All 19 current checks therefore have passing evidence across the full run and final targeted rerun; the entire 19-check suite was not redundantly repeated. The final targeted run also rechecked opening/closing, history, reduced motion, metadata and six-template axe coverage.
- `npm audit fix`: applied compatible fixes. A targeted Next→PostCSS 8.5.32 override removes the stale transitive PostCSS advisory while preserving Next15. Final audit has no high/critical findings; production-labelled tree retains three moderate findings (glob/minimatch/sucrase tooling), full tree 16 moderate. No forced major upgrade/downgrade was applied.

## Intentional deviations and remaining external gaps

- Native document scrolling with measured pins replaces the reference's wheel interception/smoother. The original illustrations, typography composition, shorter loader and unpinned closing treatment are Waffiyyi-specific. No proprietary reference artwork/code/content is shipped.
- Archivo variable and JetBrains Mono400 are the measured reference families, independently installed under SIL OFL with local licenses. Typography scale/width/composition are adapted to original content. Small accent text uses a darker accessible red.
- Newer projects retain documented development/prototype labels. Missing authorized product screenshots are replaced by explicitly conceptual original artwork. Unverified launch dates, live links, client outcomes and metrics are omitted.
- Existing Web3Forms integration is reused; real delivery and recipient ownership were not reverified by sending mail. Optional `WEB3FORMS_ACCESS_KEY` supports rotation. The encoded email-draft fallback works independently. Rate limiting is instance-local plus provider safeguards, not a distributed quota.
- No deployment or push was performed. Final task-owned local preview is stopped at teardown; run `npm run dev` to review locally.

## Changed-file guide

- `app/`: redesigned pages and global styling; complete work archive/case routes; contact API; metadata, Open Graph, sitemap, robots and error states.
- `components/portfolio/`: shared shell, original SVG artwork, scoped animation primitives, homepage story, project cards/archive, profile, missions, galleries, experience and contact form.
- `data/projects.ts`, `data/site.ts`, `lib/contact.ts`: verified structured content, shared mission IDs and validated contact fields. Original `constants/` and résumé PDF are preserved.
- `public/fonts/`: locally bundled Archivo variable and JetBrains Mono400 with OFL licenses.
- `tests/portfolio.spec.ts`, `playwright.config.ts`, `scripts/`: reproducible interaction, visual, accessibility and reference research tools.
- `README.md`, `docs/`: setup, editing, content evidence, measured reference observations, implemented motion and final acceptance evidence.
- `package.json`, lockfile, lint config, Next config and ignore rules: required tooling, compatible dependency patches and ignored QA artifacts. Small legacy component fixes correct imports/unused types so the existing project compiles cleanly.

The last accessibility refinement removed overriding link labels so visible card/logo text supplies the accessible name, and kept closing labels fully opaque during their translation. The normal-motion homepage was added to the axe audit alongside WCAG2.1A tags. The affected navigation, choreography and expanded accessibility checks passed 3/3 in a final 51.2-second rerun.

## Measured Lighthouse results

Lighthouse 12.8.2, final isolated production build, localhost, 4 November 2026. Desktop preset and default simulated-mobile preset were run sequentially after browser tests. These are single lab runs, not field Core Web Vitals or a guarantee for every device/network.

| Mode             | Performance | Accessibility | Best practices | SEO | LCP  | TBT   | CLS   |
| ---------------- | ----------- | ------------- | -------------- | --- | ---- | ----- | ----- |
| Desktop          | 100         | 100           | 100            | 100 | 0.7s | 50ms  | 0.001 |
| Simulated mobile | 92          | 100           | 100            | 100 | 3.2s | 120ms | 0.002 |

Reports: `artifacts/visual-qa/lighthouse-desktop.report.html` and `lighthouse-mobile.report.html`, with accompanying JSON. No runtime or accessibility failures remain in these reports. The first valid desktop run found the closing-opacity and link-name issues; both were fixed before these final measurements. Earlier attempts against an unavailable preview yielded no valid scores.

## Follow-up: repeated route-change crash

A user report exposed a missed lifecycle case: revisiting the homepage and leaving again after its delayed heading entrance. The browser stack repeatedly entered GSAP `Context.getTweens()` and overflowed. The delayed call belonged to a matchMedia child context, but its callback used the parent useGSAP context wrapper. Invoking that parent wrapper from the child registered the parent beneath its own child, creating a circular cleanup graph.

`HomeStory` now registers the entrance callback with the owning media context. Its readiness listener and delayed call are still removed on cleanup, and reduced-motion changes revert the same context. A regression test performs three cycles through work/home/about/home/contact/home, checks pin cleanup, switches motion preferences, and leaves home again. Earlier direct-load and single-exit checks did not cover this sequence.

Follow-up verification: the isolated production build, lint and typecheck pass. Five production regression checks passed (1.5 minutes): 19 successive route changes with motion-preference toggles, slow-font/skip/no-JS behavior, opening/closing choreography, mocked contact delivery states, and rapid navigation. The portfolio navigation was also reproduced manually in development before and after the fix.

The same 19-navigation regression also passed against an isolated Next.js development server (1.6 minutes), including motion preference changes and pin cleanup. Development verification was isolated after the service on port3000 changed to a different local application. Temporary QA servers were stopped; user-owned servers were left alone.

## Follow-up: five selected projects and live websites

The user requested only Corpers Transolution, Bolda, LoveFlower Wellness, FlowPay and CraveCourier. All five now appear in the homepage gallery and archive, with four computed filters (All 5, Full-stack 2, AI 2, Front-end 1). Case-study navigation, mission links and sitemap use this selection. Removed case-study URLs return 404; historical source constants remain preserved.

Every homepage/archive card and case-study hero provides a separate **Visit live site** link opening a new tab with `noopener noreferrer`. The primary card link still opens the case study. Corpers and FlowPay use user-supplied domains; the other URLs were recovered from existing source records. All five public sites returned HTTP 200 and showed the expected project in read-only Chrome visits. Bolda currently shows a waitlist. Development/prototype status labels remain evidence-based.

The production build passes with 18 generated pages, including exactly five case studies. Typecheck, lint and whitespace checks pass. Eleven targeted Playwright checks passed in 3.0 minutes: links/new-tab behavior, exact selection/sitemap/removal, filters, pinned track endpoints, touch carousel, case gallery/navigation/metadata, accessibility and the five-size visual matrix. The matrix now covers **50 route/viewport combinations** (10 routes × 5 sizes), with no runtime errors, asset failures or document overflow. Automated axe checks report zero violations across six templates and the additional animated homepage state.

Manual review included the mobile archive, desktop case-study live button and homepage gallery. A separate shorter-laptop check exposed clipping of the new gallery actions; scoped card sizing and spacing now keep the actions reachable at 1440×650 and 1440×768 without changing mobile or large-desktop layouts. The final targeted regression passed (10.2 seconds), asserting fully visible first/last live links and the gallery progress row at both sizes. Screenshot evidence is retained under `artifacts/visual-qa/`. Testing used an isolated temporary production copy to avoid interfering with the user's development server. No deployment or external form submissions were performed.
