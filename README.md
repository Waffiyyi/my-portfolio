# Waffiyyi Fashola — Surface / System

A cinematic full-stack engineering portfolio built in the existing Next.js App Router application. Original SVG scenes connect the interface people experience with the systems behind it. The design research uses [devinthehood.com](https://devinthehood.com/) as an interaction reference; no reference artwork, identity, project screenshots or copy is included.

## Run locally

```sh
npm ci
npm run dev
```

Open http://localhost:3000. Node 20.19+ is recommended for the installed tooling. Fonts are local; the app does not fetch Google Fonts at runtime or build time.

For a production preview, **stop the development server first**, then:

```sh
npm run build
npm start
```

Do not run a development server and production build against the same `.next` directory concurrently.

## Routes

- `/`: opening, selected work, engineering, profile, missions, contact close.
- `/work`: the five selected projects, four filters with computed counts.
- `/work/[slug]`: five statically generated case studies with distinct content, conceptual galleries, documented stack, workflow and next-project navigation.
- `/about`: biography, experience, skills, education, certifications and interests.
- `/resume`: full preserved résumé record and original PDF download.
- `/contact?mission=ai-products`: validated contact flow; four shared mission IDs.
- `/projects`: permanent redirect to `/work`.
- `/api/contact`: server-side Web3Forms integration.
- `/sitemap.xml`, `/robots.txt`, `/opengraph-image`: metadata assets.

## Content and assets

Edit `data/projects.ts` for project slugs, descriptions, stages, stacks, verified links and conceptual workflows. `data/site.ts` contains identity/contact information and the shared mission model. The active collection contains Corpers Transolution, Bolda, LoveFlower Wellness, FlowPay and CraveCourier. Original `constants/` records remain as historical source material; they are not displayed in the active collection.

Each project's `demo` URL powers a separate **Visit live site** link on its homepage/archive card and case-study hero. Live sites open in a new tab; the main card still opens the case study.

Newer projects are explicitly labelled **in development**, **development contribution**, or **hackathon prototype/sandbox**. Do not replace these labels with launch claims without evidence. Local evidence paths and content gaps are recorded in `docs/content-inventory.md`; no private source repositories or credentials are copied into this repository.

`components/portfolio/artwork.tsx` contains original vector illustrations. Conceptual media is visibly labelled and never described as a product screenshot. Add actual product screenshots only with verified provenance and permission; provide responsive dimensions and useful alt text.

Fonts: **Archivo variable** (weight/width axes) and **JetBrains Mono 400**, both SIL Open Font License, bundled under `public/fonts/` with license text. They match the independently verified type families used by the reference. `next/font/local` handles loading and fallback metrics. No trial or unlicensed fonts are used.

The existing PDF remains at `public/waffiyyi-fashola-resume.pdf`. Experience dates and quantified achievements are preserved from the existing record, not recertified as current claims.

## Motion

GSAP/ScrollTrigger uses component-scoped cleanup and viewport-derived track distances. There is no additional smooth-scroll engine. Desktop pins require a fine pointer, at least 1024px width and 650px height, and no reduced-motion preference. Smaller/coarse-pointer screens use native scroll-snap tracks. Reduced motion uses a static grid, visible content and immediate navigation. No custom cursor is required to use the site.

The reference’s wheel-intercepted street/factory is intentionally adapted to normal document scroll with measured pin distances. See `docs/reference-audit.md` and `docs/motion-spec.md` for measurements and deviations.

The loader is limited to the first document visit per session, observes font readiness and has a timeout and skip control. Route transitions have a watchdog and preserve native links, direct entry and browser history.

## Contact delivery

The original site already had a Web3Forms public form access key. The new `/api/contact` endpoint reuses it server-side; this identifier is not a private API secret. To rotate it, set `WEB3FORMS_ACCESS_KEY` in the deployment environment. Never use a `NEXT_PUBLIC_` variable for private service credentials.

The server checks origin, input types, email, length limits, honeypot and payload size. It adds an instance-local five-attempt/ten-minute limit; this is best-effort in a serverless deployment, supplemented by Web3Forms provider safeguards. Use a durable rate-limit store if strict global quotas become necessary. The UI preserves messages on failure and provides an encoded `mailto:` draft fallback. It reports success only after provider acknowledgement.

Tests intercept valid sends; **no real test email is sent**. Invalid-request server tests terminate before contacting the provider. Real delivery and ownership of the existing Web3Forms recipient are not reverified by sending mail.

## Checks and visual QA

```sh
npm run typecheck
npm run lint
npm run build
# Start npm start, then in another terminal:
npm test
npm run test:visual
# Optional recorded scene walkthrough:
node scripts/record-walkthrough.mjs
```

The Playwright config uses locally installed Google Chrome (`channel: 'chrome'`). On a machine without it, install Chrome or change the config to Playwright Chromium and run `npx playwright install chromium`. The default test URL is `http://127.0.0.1:3000`; override with `PLAYWRIGHT_BASE_URL`.

Tests cover pin endpoints/reversal, filters/counts, direct case routes, gallery keyboard controls, mission URL round-tripping, message preservation, client/server validation, mocked pending/error/success, menu focus/Escape, history, touch, reduced motion, route/viewport overflow, metadata, console/network failures and axe checks. The visual matrix covers 1440×900, 1920×1080, 768×1024, 390×844 and 1280×600.

Evidence is ignored in `artifacts/visual-qa/`, `artifacts/reference/`, `test-results/` and `playwright-report/`. Reference scripts make read-only visits and never submit valid forms. Network timeouts and early loader captures are identified in the audit rather than presented as completed measurements. See `docs/implementation-checklist.md` for actual results and remaining limits.

## Deployment

Next.js is patched to 15.5.29 in the lockfile. A narrow `next → postcss` override uses PostCSS 8.5.32 to remove the older bundled dependency advisory; keep it until a future Next release bundles a patched version. Compatible audit fixes were applied without a framework major migration. Remaining moderate tooling advisories and actual QA results are recorded in `docs/implementation-checklist.md`.

The application retains the existing Vercel/Next.js architecture and canonical domain `https://waffiyyi-fashola.vercel.app`. Use the normal Vercel deployment pipeline after reviewing the local changes. No push or deployment is part of this task. Optional environment variable: `WEB3FORMS_ACCESS_KEY`. No new database or storage service is required.
