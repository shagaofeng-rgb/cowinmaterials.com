# Homepage Navigator Design QA

## Source and implementation

- Source visual truth: `/Users/apple/.codex/generated_images/019f06ff-f8a7-73f0-b499-e2c4254b3d8d/exec-f553405c-ac1e-464f-b10e-28f09b6accda.png`
- Desktop implementation capture: `/Users/apple/Documents/材料/site-audit-backups/2026-09-11-home-navigator-redesign/qa/design-qa-home-desktop-playwright.png`
- Mobile implementation capture: `/Users/apple/Documents/材料/site-audit-backups/2026-09-11-home-navigator-redesign/qa/design-qa-home-mobile-playwright.png`
- Tested URL: `http://127.0.0.1:3001/`
- Tested viewports: `1280 x 720` and `390 x 844`

The chosen direction is translated into Cowin Materials' live content model rather than copied as a static mockup: a dark technical-test hero, a condition-led material selector, visual application routes, product-family selection, evidence resources and a five-step project pathway.

## Evidence

- Browser checks: exactly one `h1`; 13 loaded images; desktop document width `1280 / 1280`; mobile document width `390 / 390`.
- Interaction check: the project selector passes temperature, substrate, available thickness and standard into `/request-quote`; the receiving form rehydrates those real query values after client navigation.
- Accessibility check: selector controls are labelled native form inputs; primary routes remain ordinary links; the existing global header, drawer and footer are retained.

## Required adaptations

- The existing Cowin Materials logo, navigation, contact routes and footer remain in place to preserve brand and working site navigation.
- Reference-only blocks that could imply unsupported claims were replaced with source-backed destinations: technical resources, data scope, application guides and material evaluation.
- Editorial visuals are used only for the application cards where no appropriate existing photograph was available. Product figures and technical claims continue to come from the existing product routes.

## Findings and fixes

- **P1 fixed:** the root layout did not declare a device-width viewport, allowing mobile emulation to render at desktop layout width. `src/app/layout.tsx` now exports the Next.js viewport configuration. The 390px browser check confirms no horizontal overflow.
- No remaining P0, P1 or P2 visual defects were identified in the implemented homepage at the recorded viewports.

## Comparison history

1. Implemented the selected condition-led homepage structure using existing routes and live taxonomy.
2. Tested the project-selector handoff and found the initial URL query state was not available until hydration; updated the location-store subscription to publish its initial state.
3. Tested the mobile viewport and found the missing viewport metadata; added it and re-ran desktop and mobile checks.

Final result: passed
