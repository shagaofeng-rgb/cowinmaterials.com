# Homepage Template Fidelity QA

## Comparison target

- Source visual truth: `/Users/apple/.codex/generated_images/019f06ff-f8a7-73f0-b499-e2c4254b3d8d/exec-f553405c-ac1e-464f-b10e-28f09b6accda.png`
- Desktop implementation capture: `/Users/apple/Documents/材料/site-audit-backups/2026-09-11-home-template-fidelity/qa/template-fidelity-final-1122x1400.png`
- Mobile implementation capture: `/Users/apple/Documents/材料/site-audit-backups/2026-09-11-home-template-fidelity/qa/template-fidelity-mobile-390x844.png`
- Tested route: `http://127.0.0.1:3001/`
- Source / desktop implementation pixels: `1122 x 1400`; CSS viewport `1122 x 1400`; density `1x`.
- Mobile implementation pixels: `390 x 844`; CSS viewport `390 x 844`; density `1x`.
- State: default homepage; desktop selector unselected; mobile selector populated only to validate the working handoff.

## Full-view comparison evidence

The reference and current implementation were opened together at the same `1122 x 1400` viewport. The production brand asset is intentionally retained in place of the reference-only wordmark; all other structural regions follow the reference composition.

| Region | Reference | Implementation evidence |
| --- | --- | --- |
| Header | 58px white desktop navigation | 59px, complete desktop navigation, search and quote CTA |
| Hero | 448px split image / selection panel | 449px dark test-image hero; 406px selection panel starting at 73px |
| Application navigator | 3 x 2 image grid, 152px cards | six linked application cards, 152px each |
| Material families | horizontal 91px cards | four linked product-family cards, 91px each |
| Evidence resources | horizontal compact cards | four linked resource cards, 55px each |
| Project pathway | five compact chevron steps | five real workflow labels, 103px each |
| Closing band | deep blue visual footer | generated material-ridgeline banner, starts at 1304px |

Focused checks covered the hero selector, application-card copy wrapping, material/resource card density, five-step pathway, and the 390px mobile state. The mobile page has a `390px` document width with no horizontal overflow; the selector is `354px` wide and retains accessible native select controls.

## Findings and fixes

- **P1 fixed: reference layout was only interpreted, not recreated.** The homepage now matches the selected template's fixed desktop frame, compact section rhythm, 3 x 2 applications, four horizontal material / evidence cards, five-step pathway and terminal banner.
- **P1 fixed: desktop navigation did not appear at the reference width.** The template desktop header is now active from `1080px`, including Products, Applications, Resources, Company, search and the quote CTA; smaller widths still use the existing accessible drawer.
- **P1 fixed: content height moved the template footer below the reference frame.** Homepage-only display summaries preserve the reference section heights. Full technical information remains on product, application, quality and resource detail routes.
- **P1 fixed: homepage visuals were not guaranteed to load in a full-page capture.** Above-the-fold and navigator imagery now uses eager loading; the final desktop check confirmed all 14 rendered images have positive natural dimensions and no browser errors.
- **P1 fixed: mobile viewport was missing.** `src/app/layout.tsx` exports the device-width viewport configuration; mobile is now `390 / 390` CSS pixels without overflow.

## Fidelity surfaces

- **Fonts and typography:** Existing Geist-based site typography remains, but display type, compact UI labels, title wrapping and line-height have been tuned to the source hierarchy. The approved Cowin logo remains in place.
- **Spacing and layout rhythm:** Fixed source-aligned desktop measurements are recorded above. Mobile converts only at necessary breakpoints and does not preserve unsuitable five-column content.
- **Colors and tokens:** The page uses deep technical navy, engineering blue, pale blue cards and white surfaces matching the source balance; semantic product claims remain unchanged.
- **Image quality and asset fidelity:** Existing laboratory, coating and material images are retained. Four generated application visuals and one generated ridgeline footer visual are editorial images only; they carry accurate alt text and do not assert product performance.
- **Copy and content:** Reference-only claims and unverified proof points were not copied. Homepage labels are concise summaries; linked detail routes remain the factual source for specifications, conditions and limitations.

## Interaction and browser verification

- One semantic `h1` on the homepage.
- Desktop: no browser console or runtime errors; all image requests completed; document width `1122 / 1122`.
- Mobile: no browser console or runtime errors; document width `390 / 390`.
- The selector passes selected temperature, substrate, thickness and standard to `/request-quote` as query values. Test output included `operatingTemperature=-40 C to 125 C`, `substrate=Building envelope`, `requiredStandard=EN` and the selected thickness in the message.

## Comparison history

1. Initial redesign used the source as a content-direction reference only; QA identified P1 differences in the header breakpoint, hero / form proportions, card heights and total vertical rhythm.
2. Rebuilt the homepage around the source measurements, changed desktop navigation at the source width, and shortened homepage-only labels. The second comparison aligned the header, hero, application grid, materials, resources and pathway positions.
3. Cleared stale local build cache, verified all final image responses, captured the final same-size desktop result and mobile result, then rechecked selector interaction.

Final result: passed
