# Rendering regression checks

Compare the editor with KaTeX using the same exported LaTeX, base font size and
display mode. Keep [editing scenarios](EDITING-SCENARIOS.md) for input behavior;
this guide defines the visual checks for EDIT-017. KaTeX is the reference image,
not an editable DOM replacement.

## Three checks for each fixture

1. **Model/output:** the editable tree exports the intended LaTeX and KaTeX accepts it.
2. **Geometry:** compare relative positions, font sizes and gaps. Absolute page
   coordinates are not comparable across different containers.
3. **Visual review:** save the editor, active-input and KaTeX images together.
   Check curves, stroke thickness, baselines and clipping. Numerical checks alone
   do not establish that the two images look equivalent.

The active input, measuring element and passive glyph must use the same font
metrics. A cursor or hover background must not move a fraction or hide a fence.
Wait for `document.fonts.ready`. Disable preview fit scaling for comparison and
set the KaTeX root's computed font size to the editor's base size; matching the
parent container's font size is not sufficient.

## Initial executable fixtures

Run `apps/math-integrations/tests/rendering-regression-check.js` through the
existing Playwright CLI browser workflow with the local site on port 5184.
The file is an async `(page) => ...` fixture, not a standalone Node script.
Omit its final semicolon when passing the function to `run-code`.

| Fixture | LaTeX | Renderers / sizes |
| --- | --- | --- |
| `indexed-root-power` | `\left(\sqrt[20]{ab}\right)^{\frac{2}{3}}` | Rich React and native DOM; 22px and 36px |
| `fraction-power` | `x^{\frac{2}{3}}` | Rich React and native DOM; 22px and 36px |
| `fraction-subscript` | `x_{\frac{2}{3}}` | Rich React and native DOM; 22px and 36px |

The 12 combinations currently assert:

- Fraction terms use half of the base font size and match KaTeX's computed term
  size within 0.1px. This applies to these implicit-style fixtures, not every
  explicit `\dfrac` or `\tfrac` expression.
- The exponent is above the base and the subscript is below it.
- The fraction center's vertical offset from the base glyph center differs from
  KaTeX by less than 0.25em. This is a regression threshold, not pixel equality.
- The gap from the base box to its fraction script is between 0 and 0.25em.
- Activating a numerator retains its font size, and typing retains focus.
- The formula does not produce a KaTeX error.

Screenshots are saved as
`output/playwright/{renderer}-{fixture}-{size}-{editor|katex|active}.png`.
The returned metrics include editor and reference coordinates. Preserve them
with the source fingerprint, browser version and screenshot pairs for a run.
These filenames are overwritten on rerun; archive them if they are used as a
release baseline. Do not update an accepted baseline simply to hide a failure.

## Why the first correction is bounded

Script fractions previously retained body-sized minimum row heights and spacing.
They now have compact terms and rows. A simple base uses a small script offset;
a tall structured base uses an offset proportional to the fraction height.
Empty boundary nodes reserve only a narrow passive cursor position.

This fixes the initial cases without changing the JSON model. It is not a
complete TeX layout engine. Remaining comparison fixtures should cover paired
scripts, nested fractions in both slots, explicit style overrides, multi-line
collision, large operators, fences, accents and narrow host containers.

As those fixtures grow, consolidate script levels, the math axis, baseline and
stroke metrics into shared layout rules. Avoid extending a list of formula-
specific CSS exceptions without a failing fixture and reference measurement.
Both renderers must use the same rule, and every new notation feature needs
an editor/KaTeX comparison in passive and active states.

## Release use

Run changed fixtures during development. Run the rendering set and applicable
editing scenarios against release candidate artifacts before publishing. The
current fixture uses workspace sources and Chromium; it does not certify packed
packages, all host containers, Firefox/WebKit or OS IME behavior. CI scheduling
and automatic screenshot-diff approval are not implemented by this guide.
