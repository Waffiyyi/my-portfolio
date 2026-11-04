# Reference audit — 3 November 2026

Reference: https://devinthehood.com/ (exact non-www host). Existing portfolio: https://waffiyyi-fashola.vercel.app/. Browser: installed Google Chrome, driven by Playwright. Evidence is intentionally ignored under `artifacts/reference/`. Scripts: `reference-audit.mjs`, `inspect-reference.mjs`, `reference-interactions.mjs`, `reference-controls.mjs`.

## Page map

Live links dynamically revealed **15** projects, including the additional `/work/letz-kola-v2`: `/work/cegeta`, `/work/cereezer`, `/work/tradebot`, `/work/tessera`, `/work/devingame`, `/work/dev-in-live`, `/work/devinthehood`, `/work/superp`, `/work/letz-kola`, `/work/provencale-webshop`, `/work/enoprimes`, `/work/sms-group`, `/work/iroom`, `/work/toolbox`. Main routes: `/`, `/work`, `/contact`.

All use shared fixed navigation, scroll rail, loading cover, light/dark framing, and numbered sections. Case studies share split opening, overview/metadata, front/media, back/architecture and next-project handoff. Individual studies differ substantially in content length and feature modules. Cegeta is 10,925px tall in the first 1440×900 pass; Tessera 13,685px; Dev in Live 7,430px.

## Measured visual system

- Actual computed fonts: **Archivo**, variable 100–900; Google Fonts stylesheet requests width axis 62–125. **JetBrains Mono**, weights 400/500. Both are SIL OFL. Use independently packaged licensed files, not files copied from the reference.
- Background cream `rgb(244,241,234)` / #f4f1ea. Text `rgb(22,19,15)` / #16130f. Red accent `rgb(234,29,15)` / #ea1d0f. Dark side approximately #101318 (visually sampled; exact token requires CSS inspection). Amber `rgb(255,181,71)` / #ffb547.
- At 1440px: story words 36.72px / 38.1888px line height; uppercase, expanded Archivo. Front/back banner 44.64px. Section headings: 48.96px / 46.512px; profile heading 77.76px / 73.872px; mission heading 57.6px / 54.72px. Heading tracking typically -1%.
- Mono metadata 11–14.4px, tracking 0.88–2.304px. Fine vertical grid lines, wide outer margins (~49px at 1440), thin separators, geometric illustration, limited corner rounding. Header logo left; three text links + local clock right. Mobile uses a burger.
- Light split is on the left, dark on the right. Browser/window art and terminals/data storage form a frontend/backend pair; a large shared central badge visually connects the halves. This art belongs to the reference and is not reused.

## Loading, motion and interactions

Initial loader is cream with a red/pink outlined geometric logo, bottom-left microcopy and bottom-right percentage. Browser captures show 12%, 90%, 100%; on this connection initial assets took substantially longer than 5 seconds. After settling, `.loader` has `display:none`. No exact progress algorithm is claimed.

Hero is `.split--story`, with measured 3,600px pin spacer at 900px viewport, i.e. 900px visible + 2,700px scroll. Story changes within the pinned frame. Full homepage measured 8,639px in the first early capture, before all lazy animation geometry settled. Percent screenshots alone are unreliable for section boundaries: capture section-specific positions as well.

The work street is cream, uses illustrated storefronts in a sideways sequence and parallax skyline; workshop is dark and uses a conveyor/factory motif. Archive uses a three-column storefront grid at 1440, flat category buttons and thin baseline rules. Filter names: All, Design, SaaS platform, Full-stack, Front-end, Tools. Original portfolio will use categories verified by its own data.

Profile contains a front/back control and identity panel. Mission board exposes four choices and a selected detail panel. Contact has separate selection cards which prefill the first message line, a clear-mission control, labelled name/email/message, honeypot, and validation. **No valid contact form has been submitted.**

Case studies use a large split hero, overview and metadata, media browser frames and captioned screen strips; backend sections include stack and project-specific modules. Large next-project card closes each case. A lightbox is not evidenced, so the implementation should use an accessible gallery rather than invent one.

## Existing site

Browser inspection of `/projects`, `/about`, `/contact`, `/resume` verified the chess vocabulary, dark blue cards, content and links in source. `/contact` is real and integrates Web3Forms. Resume PDF exists locally. `/` initially encountered a browser network error and is retried separately. Screenshots `original-*-hero.png`; textual/computed results `initial-audit.json`.

## Evidence and unverified behavior

`home-settled.png` is the actual opening after loader; `home-settled-*.png` are progress samples. `1440-_work-0.5.png` verifies archive geometry. `detailed-audit.json` records routes, computed headings, fonts, buttons and links at each viewport, with accompanying PNGs. Some early `*-entry.png` captures show the loader and some rapidly jumped-to media remained lazy placeholders; they are not treated as completed visual proof. Additional interaction measurements are recorded in `reference-controls.md`.

Exact internal easing, initial progress algorithm, slow-network timings, all hidden easter eggs, and inaccessible lazy media are not inferred. The bespoke Waffiyyi artwork, shortened loader, native scrolling instead of a proprietary smoother, and restrained original typography composition are intentional adaptations. No reference artwork, logos, claims, or project content is shipped.

## Completion pass — 4 November 2026

Successful browser retries completed the route/viewport coverage: 18 reference routes × 4 requested viewports. Additional evidence is in `completion-audit.json`; the original homepage was also recaptured as `original-home-settled.png`. Early screenshots that caught loaders or lazy placeholders are not represented as settled states. Focused archive filters and contact selection/clear/validation now have successful interaction evidence; see `reference-controls.md`.

Correction to the initial profile observation: the inspected live Front/Back balance is a labelled image/meter, not an exposed interactive switch. Our accessible Flip toggle follows the user's explicit requested behavior. Remaining unverified details include exhaustive reference gallery/hover/history permutations, internal easing and hidden easter eggs. The reference's final hoodie drawing is intentionally replaced with original converging system lines and a large contact close.
