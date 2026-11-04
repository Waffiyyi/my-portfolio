# Reference controls and motion measurements

Measured with `scripts/reference-controls.mjs`; raw results and screenshots are in `artifacts/reference/controls-audit.json`. Requests other than GET/HEAD were blocked. No valid contact submission was made.

## Verified

- At 1440×900 the opening is the only `.pin-spacer`: height 3,600px, giving approximately 2,700px of pinned travel.
- The street and factory each occupy 900px. Their `strip--driven` behavior intercepts wheel input while holding native scroll position: the street holds scrollY at 3,600 while its track moves through approximately −329, −1,374 and −6,174px. Scrolling then advances to 4,500 and moves the factory track. Track widths were 7,810.53px and 5,916.16px respectively.
- The reference combines these driven sections with smooth-scroll lag. Our implementation intentionally uses standard document scroll with measured ScrollTrigger pin distances and reversible transforms; it does not intercept wheel input. This is a usability adaptation, not a claim of identical internal mechanics.
- Mobile menu at 390px shows numbered links in a full-height overlay with 20px side margins, contact/social links at the bottom. Escape closes it and returns focus to the burger, whose `aria-expanded` becomes false.
- Reduced motion removes the opening pin and changes horizontal sections to `strip--static`. Measured document height falls from 8,639px to 5,939px in this pass.

## Explicitly incomplete observations

The first archive-filter attempt timed out during navigation. Contact selection located the actual mission button but could not complete a stable click during animation; the query-prefill retry also timed out. Browser history was not measured in that failed context. The home front/back selector was not found by the initial selector search. These failures are preserved in the raw audit and are not treated as verification. Additional focused retries are recorded separately where successful.

Local tests verify the required corresponding behaviors independently: filter sets/counts, mission query and message preservation, profile toggle, browser history, menu focus, touch and reduced-motion reachability.

## Focused retry — 4 November 2026

`scripts/reference-focused.mjs` successfully exercised all six archive filters. Visible project-link counts: All15, Design3, SaaS platform3, Full-stack6, Front-end2, Tools3; the selected button receives `is-active`. Screenshots `filter-0.png` through `filter-5.png` and `focused-controls.json` record these states.

Contact's third mission sets `aria-pressed=true` and the message to `Mission: E-commerce\n\n`; Clear the mission removes that prefill. Name/email/message have native required validation; the empty form's `checkValidity()` returns false. The hidden mission field and website honeypot are present. No form was sent.

A second profile DOM audit (`scripts/reference-profile.mjs`, `profile-controls.json`, `profile-sections.json`) found a `.player__balance` with `role="img"`, labelled “Front and Back, in balance,” and a moving meter. It did **not** expose a button, checkbox or switch. The earlier assumption that this particular live control was a clickable toggle was not confirmed. This portfolio still implements the explicit Front/Back toggle required by the specification, using accessible buttons and Flip.

Reference page coverage now includes all 18 discovered routes at all four requested widths after successful retry of the five remaining 1920px pages. `completion-audit.json` supplements `detailed-audit.json`. This verifies route coverage, not every possible gallery, hover or history combination at every size. Early loader/lazy-media screenshots remain identified as incomplete visual evidence.

The 1440px DOM inventory for all 15 case studies exposes only the shared Menu button; no previous/next gallery buttons were exposed in those captures. Media appears in page/sideways strips. The local gallery's explicit arrows, keyboard support and captions are an accessibility adaptation, not a claim that those exact controls were copied from the reference.
