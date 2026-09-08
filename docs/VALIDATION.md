# Validation report

## Current release status — 0.2.0

The dated entries below are historical verification records, not current release availability claims. Note inline editing is resolved according to the user; this release does not change or deploy Note. Math-editor release checks and site validation are recorded separately at the end of this document.


Updated: 2026-09-07. Scope: independent math editor prototype, Korean/English UI, active-input rendering, model selection, wrapping and editable templates.

**Result:** 71 unit tests and 61 Chromium tests passed (132 total, no skipped tests). Package/demo builds and package/demo/browser-test type checks passed.

## Automated coverage

| Suite | Cases | Evidence |
|---|---:|---|
| Model | 7 | Structural insertion, operand boundaries, nested content, navigation, history and export |
| Suggestions | 16 | Longest symbolic triggers, bilingual aliases, replacements, degree symbols and grid presets |
| Matrix | 13 | Geometry, limits, row/column editing, nested slots, delimiters and KaTeX |
| Lines | 8 | Split/join, top-level navigation, aligned equations and cases |
| Tokens | 5 | Lexical roles, Unicode offsets and boundary affinity |
| Grid deletion | 4 | Empty/filled deletion, preserved content and undo |
| Ranges | 8 | Partial/reversed/multiline selection, clipboard validation, fresh IDs and wrapping |
| Locales/templates/catalog | 10 | Complete catalog label translation, bilingual candidate IDs, 7 template trees and all 90 symbols rendered with KaTeX |
| Chromium browser | 61 | Existing input flows plus language switching, translated controls, new template editing, nested wrapping and live preview |

Commands and setup are documented in the [README](./README.md). The package must be built before the demo/browser checks because the demo consumes `dist` exports. Type checks cover the package, demo and browser test sources. Production builds cover the package and demo.

The test helper activates passive tokens by clicking them before typing; it does not bypass the editor model. Pointer selection tests use real mouse movement. Most automated clipboard tests dispatch ClipboardEvent with DataTransfer payloads; they do not claim OS clipboard compatibility across applications.

## Manual in-app checks

Earlier checks in the current development session verified:

- Matrix input, row/column changes, deletion and undo with caret restoration.
- Multiline equations, aligned equations and cases with exported/live-rendered output.
- Fraction creation followed by actual Cmd+C/Cmd+V structured duplication and undo.
- Selecting `a+b`, wrapping as `(a+b)²`, wrapping the result into a fraction, and entering `30degree` in the denominator.

The in-app browser also verified the complete English demo/editor UI, quadratic-template insertion and live rendering, then a Korean-to-English switch preserving the inserted formula. Automated tests additionally verified undo retention, translated matrix controls and Korean aliases in English mode.

## Explicit limits

- Real OS Korean IME testing is deferred at the user's request. Synthetic composition events verify guarding and draft handling only.
- Automated browser coverage is Chromium on macOS. Narrow viewport checks are not mobile-browser or touch validation.
- Full screen-reader math navigation, high contrast, and every theme are not certified.
- There is no saved-document validator, persistence/restart-recovery test, migration path or host-wide undo integration.
- Rectangular matrix selections, keyboard model range extension, general LaTeX import and symbolic computation are not implemented.
- Deep nesting and very large expressions have no agreed performance budget yet.

## Integration gates

Before shipping inside a host product, test actual input methods and target browsers, establish a single undo owner, validate saved documents, verify focus across host/math boundaries, and define recoverable clipboard/import failures. Every new structure must have localized labels, deterministic transformations, one-step structural undo, browser interaction coverage and supported LaTeX output.

## Line numbers and symbol discovery

Three browser tests verify the UI-only line gutter through split/join/undo, its exclusion from LaTeX and model clipboard, the complete 90-symbol grid, bilingual search, insertion before typing, range replacement, undo, Escape and clipboard isolation in the search field. A native Home key did not move the caret in the macOS test environment; the test uses the supported Left arrow to reach the line start. The in-app browser visually confirmed the full symbol grid with names and search focus.

## Framework-neutral integration — 2026-09-07

- **76 unit tests passed**, including session snapshot isolation, navigation versus document notifications, atomic selection wrapping, inline rejection without data loss, and custom locale alias/fallback/direction behavior.
- **73 Chromium tests passed**: the previous 61 tests plus 12 native/adapter tests. The added cases mount real Vue and React components, a compiled Svelte 5 component, a Solid owner/directive, a Web Component and pure DOM surfaces. They verify fraction input, suggestion acceptance, undo, teardown, reconnect persistence, inline policy, external toolbar wrapping, custom French discovery and matrix row changes.
- Package and demo TypeScript checks, browser test type checking and both production builds passed. The adapter lab is also included in the production build.
- A packed tarball was extracted into a temporary directory. Five entry points (`core`, `dom`, `web-component`, `vue`, `svelte`) imported without framework peers or browser globals; main/React/Solid entries imported after installing links to only their relevant local peers. All eight JS export paths and declared CSS/type targets exist. This is a local packaging smoke test, not publication or an exhaustive downstream TypeScript/bundler matrix.
- The in-app browser visually verified the adapter lab and actual pure-JS `x/ → ↓ → Enter → 2` input, producing `\frac{x}{2}`. Inline mode displays without the block editor's large surface and toolbar.

Remaining adapter gates: exact range highlighting, active-input cross-structure dragging, token-level edit colors, composition preview parity, native all-symbol/context toolbars, reactive-option/version matrix and accessibility/browser coverage. Native `MathEditorSurface` is not advertised as complete rich React parity. OS IME testing remains deferred.

## Composition, source readability and JSON locales — 2026-09-08

- 81 unit tests pass. New coverage checks host Enter precedence, inline grid row editing, JSON key/parameter parity, JSON-only dynamic translations and regional fallback. The JSON registration example also passes a strict TypeScript check without a direction cast.
- The complete 77-case Chromium suite passed after the toolbar extraction, source/CSS formatting, locale migration and first four layout tests. The final layout suite adds English JSON page/editor coverage and passes all five cases (78 distinct browser cases across the suites).
- Package/demo build and type checks, browser-test type checking and the package `format:check` pass. The package build emits plain ESM locale modules from canonical JSON for runtime compatibility.
- Browser coverage verifies removal of the sample title strip, reset inside the toolbar, independent panel toggles without content loss or spurious onChange, inline completion, next-block creation, popup draft cancellation, mouse selection inside a modal and undoing popup apply as one source edit.
- The in-app browser visually confirmed the reduced sample header and the inline/Note-style layout examples. These examples do not claim installation into the actual Note/Word/Site/Slide products; their data/undo bridges and real OS IME coverage remain open.

## English message keys and literal-symbol ordering — 2026-09-08

83 unit tests pass, including an invariant that every library/demo locale message key is an English semantic identifier and both languages have matching keys. Literal-symbol ordering is covered for `/`, `^`, `*`, `sum` and `division` in Korean and English; uppercase Greek and matrix preset ordering are preserved.

All 78 distinct Chromium scenarios pass across the full run and corrected editing-suite rerun. The initial full run had one test-locator failure: the new assertion selected the page's language option instead of the suggestion list. Scoping it to the math listbox resolved that failure. Keyboard tests now explicitly choose Fraction after the leading ÷ candidate, and shared-adapter tests verify the same order. Build, type, formatting and packed export checks pass.

Earlier validation entries describe their historical default ordering. Current fraction input is `x/ → Down → Enter → 2`, or type `frac` / `분수` to find the structure directly.

## Key-only localization and external-language discovery — 2026-09-08

91 unit tests pass. New cases cover JSON-provided labels/details/aliases, matrix-family aliases, French regional fallback, shared localized slot paths, Japanese/Chinese/Arabic/Hindi/German queries, decomposed accents and template dimensions. Removed source-label conversion and formatting hooks are no longer part of the API.

79 distinct Chromium scenarios pass across the full suite and the five-case locale-suite rerun. The full run passed 78 cases; the new empty-fraction test initially expected denominator focus instead of the intended numerator-first behavior. The corrected test verifies both localized slots via Tab and converts a decomposed French query to a symbol. An earlier adapter-example variable-name collision was also fixed before this run.

Package/demo builds, package and browser-test type checks, formatting, and packed runtime/type/CSS exports pass. Built output is cleaned before compilation so removed modules cannot remain in the package. Language search fixtures are not complete translations or OS IME/RTL validation.


## Workspace LaTeX / Note trial — 2026-09-08

- Math-editor unit suite: 230 tests pass, including 90 symbol entries, templates, all empty structures, six matrix environments, diagnostics/limits and persisted-document validation. One model parity test exercises all 169 pairs of nested structure kinds and compares trees with IDs/typographic minus normalized.
- Explicit demo import browser test passes: editable fraction, failed import preserves formula, locale switch preserves source.
- Note LaTeX command tests: 6 pass, including structure/source consistency, persistence/reopen, undo/redo, stale-data clearing and readonly rejection.
- Note Chromium browser checks: 5 pass across original LaTeX editing, caret/range behavior and new visual draft workflows. Covered cancel/apply, source fallback, save/reload/reopen, multiline matrices/cases and inline top-level line rejection.
- Package and demo type checks, demo browser-test type checks, Note and demo production builds pass. Full office-editor-ui type checking is still blocked by pre-existing errors in transitive workspace modules; changed math integration files reported no errors in that run.
- Native OS IME, Safari/Firefox, assistive technology and real product multi-user conflicts were not tested in this trial. No npm package was published.


## LaTeX compatibility completion pass — 2026-09-08

- 233 unit tests pass, including session import failure atomicity, recursive host-policy checks, alternate delimiter/blackboard spellings and comment-hidden wrapper errors.
- Adapter and LaTeX browser suite: 21 distinct scenarios verified (20 passed in the combined run; the React selector was narrowed and its test rerun). This includes seven session-based adapter import paths, plus rich React undo/redo and editing imported slots.
- Scope is the existing editable model, not all KaTeX syntax. Composite scripts, named functions, text groups, indexed roots and macros remain explicitly excluded.
- Note integration fixes are paused until this package contract is accepted; the reported Note inline-editing and popup-suggestion issues have not been fixed by this compatibility pass.

## Imported LaTeX editing regression — 2026-09-08

- All 42 Chromium scenarios in `latex-editing.spec.ts` and `latex-import.spec.ts` pass in one run. Browser-test TypeScript checking also passes.
- Added 33 cases: rich React and native DOM editing of nested fractions/roots/scripts, three delimiter structures, sum/product/integral bounds and bodies, all six matrix environments, aligned/cases cells, gathered lines, and normalized command aliases. Each marked slot is changed through the real input, then undone, redone and undone again with LaTeX output assertions.
- Both renderers show suggestions inside an imported root and allow inserting and filling a nested fraction. Imported matrix row/column deletion shortcuts restore original contents with Undo.
- Existing import tests cover the seven session-based adapters, atomic failure, inline multiline rejection, and import history.
- Initial failures were test selectors: a focused React token has an input instead of a preview, and native text runs encompass multiple lexical tokens. Selectors now follow each renderer's actual representation. No editor implementation changes were needed for these scenarios.
- This is Chromium coverage of the supported import subset. It does not establish arbitrary LaTeX support, OS IME behavior, other browser engines, or resolve the paused Note integration issues.

## Combined scripts and contextual selection — 2026-09-08

- 236 unit tests pass. Added both script-order imports, shared-node export, duplicate-script rejection and completion/removal of the opposite script.
- All 56 Chromium cases across LaTeX editing, import and wrapping pass in one final run. Both renderers edit imported combined scripts and complete existing scripts using mouse-selected suggestions; geometry assertions verify a shared script column. Empty-side deletion and Undo preserve the other script.
- Drag selection wraps formulas through the contextual popup; the native toolbar-free inline surface also offers and applies these actions. Multi-line wrapping stays disabled.
- Package build, demo type checking and browser-test type checking pass. Tests place the caret through input editing rather than OS-dependent End behavior, which scrolled the page in the initial runs.
- JSON model, mapping and support docs describe the workspace addition. No package publish or Note integration fixes were performed.

## Selection suggestions — 2026-09-08

The contextual wrapping UI now uses the existing suggestion panel/list styling and listbox/option semantics instead of a separate toolbar. Mouse application, arrow-key selection and Enter application are covered; 48 Chromium cases in wrapping and LaTeX editing pass, along with package build and browser-test type checking. Native inline selection remains available without a toolbar. The previous standalone wrapping-panel styles were removed.

## Literal text and functions — 2026-09-08

- 239 unit tests pass, including all 19 named-function round trips, literal text escaping, mixed-math rejection, and function-script insertion with literal-slot protection.
- 54 Chromium scenarios in LaTeX editing and wrapping pass. The two suggestion tests were then extended and rerun successfully to cover adding an exponent after a function suggestion in both renderers.
- Package build, demo and browser-test type checking pass. New English/Korean message keys and locale aliases use the existing registration mechanism. Matrix-prefix recommendation regression tests remain green.
- Literal text is not mixed TeX text/math or a text-styling engine. The published npm version remains unchanged.

## Sequential typing regression — 2026-09-08

- Added real per-character keyboard tests for literal text, custom function names, ordinary math, suggestion acceptance, continued typing, middle insertion/deletion, and returning from text to math with Tab.
- Reproduced dropped typing after a model range selection in both renderers. Printable keys now replace the range and focus the resulting input. The sequential typing and wrapping suites pass all 21 cases after the fix; the replacement tests also check Undo restoration.
- Package build and browser-test type checking pass. This does not cover native OS IME composition.

## Indexed roots — 2026-09-08

- All 241 unit tests pass, including indexed-root round trips, empty/nested indices, host exclusions and preserving the radicand when removing an empty index. The catalog-driven nested-pair test now includes indexed roots.
- The broad browser run passed 65 cases. Two new deletion tests incorrectly moved the caret out of the index with ArrowRight; after selecting the index character directly, both pass. The targeted five-case suite also verifies imported-slot edits in both renderers and drag wrapping with Undo.
- Package and demo builds and browser-test type checking pass. Scope, model mapping, JSON slot order, usage guide and roadmap are updated. No npm release was made.

## Accents and reported inequality — 2026-09-08

- 248 unit tests pass, including accent bodies, nested wrappers, slanted relation symbols, the reported Cauchy–Schwarz expression, and comment/nesting handling for scripted parentheses.
- 74 Chromium scenarios in LaTeX editing and wrapping pass. An additional regression loads the reported full inequality and edits its first lower script and the exponent of the complete final parenthesis.
- Package/demo builds and browser-test type checking pass. Updated the guide, scope, JSON/mapping tables, symbol reference and roadmap. No npm publish was performed.

### Binomial, operand wrapping and function spacing (workspace)

- 253 unit tests pass, including nested binomial import/export, malformed arguments, exclusions, operand preservation and undo.
- React and native browser checks cover binomial slot editing, command typing, operand wrapping, continuation, deletion/undo and normal Enter behavior.
- Function-spacing regression types `ln`, attaches a subscript and edits the name to `log`. Passive boundary targets measure at most 4.5px; the name-to-subscript gap stays below 14px. Screenshots were inspected for both renderers.
- The final spacing regression run passed 33 browser tests covering functions, operand wrapping, sequential typing and existing range wrapping. Package build, browser-test type checking and demo build pass.

### Limits and function colors (workspace)

261 unit tests pass. Browser validation covers LaTeX limit slot editing, per-character suggestion input, condition arrows, Tab navigation, wrapper deletion and Undo in both renderers. Function color checks cover the active name input and passive preview, including a subscripted operator. The combined browser run passed 69 tests. Package/demo builds and browser-test TypeScript checks pass.

### Imported notation and scalable delimiter regression (workspace)

The three reported equations are regression fixtures: a quotient limit with `\quad` and Chinese text; a three-sum inequality with `\limits`; and the chain rule with `\rm`. Unit coverage includes command preservation, scoped roman normalization, rejected placement directives and zero-slot spacing insertion. Browser tests import and edit each equation in React/native, measure spacing widths, and exercise deletion/Undo. Structured parentheses are measured against the enclosed fraction height; matching editor screenshots are inspected.

### Fences, annotations and indexed-root geometry (workspace)

291 unit tests pass. Browser coverage verifies both renderers importing and editing braces, angles, mixed/invisible fences, overset and underset; annotation typing/navigation/deletion/Undo; and the indexed radical meeting the overbar at the same coordinate. The 105-case regression run had one incorrect expected test string for a multiline separator; after correcting the fixture, all 20 wrapping cases passed. The brace/angle symbol-query browser test also passes. The indexed-root screenshot was inspected.

## Latest workspace typography and discovery checks — 2026-09-08

- The last recorded unit run passed 327 tests, including catalog parsing/export and arrow suggestions. This documentation update does not constitute a new unit run.
- Chromium: chemical-layout (2), function-spacing (2), root-geometry (6) and similarity-glyph (2) passed across React/native. The glyph test was updated to the renamed font and rerun separately. Chemical geometry checks cover base/coefficient alignment, subscript gap/offset and editing the subscript.
- Absolute-focus (2) passed again after removing the focus halo, including visible delimiters and operand replacement. Screenshots were inspected for chemistry and borderless focus.
- Earlier focused runs covered arrow triggers (4), arrow search/typing/wrapping (22), integral bounds (4), double integrals (4), equation-only cases (2) and down-arrow chemistry (4). These are separate targeted runs, not one full-suite total.
- Package build passed after the typography changes. Safari, Firefox, Windows, native OS IME, screen-reader behavior and Note's reported inline/dialog issues remain unverified or open. No npm release was made.

## Editor versus KaTeX spacing audit — 2026-09-08

The `spacing-audit.spec.ts` Chromium audit imported seven expressions in the rich React demo, verified a KaTeX preview for each exported expression, and captured passive editor DOM beside that preview. The comparison board uses the existing editor styles and an 18px KaTeX container; font metrics differ, so it is a qualitative layout reference, not a pixel-equality test. The board and width measurements are saved in `apps/math-demo/artifacts/spacing-audit/`. Native rendering, inner-slot focus, long conditions and touch hit targets still need their own audit. No production spacing rules were changed in this audit.

| Priority | Observed difference | Recommended adjustment |
| --- | --- | --- |
| 1 | `pmatrix` sides look bracket-like; the cases brace lacks a clear central cusp | Reuse the scalable physical fence shapes for grid delimiters before tuning whitespace |
| 1 | A nested fraction retains full-size inner text and becomes disproportionately tall | Introduce a shared, bounded math-size scale for nested fractions/scripts; keep the input and its measuring twin identical |
| 2 | Combined scripts have more upper/lower separation than the reference | Tighten the script stack and remove slot line-box overhead; test nested scripts and active slots |
| 2 | Matrix and cases rows have much more vertical space | Reduce row gap/padding while retaining a usable empty-cell target; test tall cells separately |
| 2 | Vector/hat/overline marks float above the letters | Position each accent against its body rather than retaining one generous top gap |
| 3 | Sum/product placement is reasonably close but bounds/body gaps remain generous | Tune after script sizing; preserve separate integral and explicit-limits placement rules |
| 3 | The tall nested fence is largely driven by the fraction/root contents | Fix interior sizing first, then reassess delimiter width and body clearance |

For all seven samples, focusing the first empty boundary increased the expression width by exactly 20px (4px passive to 24px active). This measures that boundary only, not arbitrary cursor positions. Evaluate an overlay hit area or a smaller active minimum so focusing does not push the entire formula sideways; do not reduce all empty slots globally.

Suggested sequence: grid delimiter shapes → nested-size policy → combined scripts/fraction gaps → matrix rows and accents → boundary focus stability. Acceptance should include passive/active screenshots, empty and populated slots, nested content, pointer access, Tab navigation, typing and Undo in both renderers. KaTeX is a notation/layout reference, while editing still requires visible caret targets.

### Spacing implementation follow-up

Shared CSS refinements now address grid fence shapes, grid gaps, fraction/script line boxes, bounded nested fraction sizes, accent offsets and large-operator body gaps. The final import/edit and comparison run passed 80 Chromium cases across React/native; an earlier 11-case run covered chemistry, limits and root geometry. Demo build passed. The refreshed comparison is `comparison-after.png`. First-boundary focus expansion is now 8px instead of 20px in all seven samples. These checks do not establish complete TeX style parity or native OS IME/accessibility coverage.

### Norm fences — 2026-09-08

337 unit tests pass, including norm aliases/canonical round trips, failed-import state preservation, localized/punctuation discovery and range wrapping/Undo. Four Chromium tests pass across rich React/native: nested-fraction norm import, scalable bars, active-slot replacement/Undo, empty-body suggestion insertion and Tab continuation. Active/passive screenshots were compared with the KaTeX preview of the same exported nested fraction. Editing retains extra body clearance for caret targets. Package and demo builds pass; no npm publication was performed.

### Triple and contour integrals — workspace

341 unit tests pass, including nested bodies, explicit limits preservation, localized discovery and failed-placement atomicity. The 95-case Chromium run covers rich React/native imported-slot editing, suggestion insertion, traversal, deletion/Undo and integral geometry. After KaTeX comparison, contour glyphs were changed from system U+222E to an integral stroke plus ring; the final eight-case bounds/edit run passed again. Package/demo builds pass. Broader browser and OS input coverage remains open; no npm release was made.

### Over/under braces — workspace

345 unit tests pass, including bare/annotated import, nested bodies, duplicate annotation rejection, discovery and range wrapping/Undo. In the broad Chromium run, 90 cases passed and an existing overline test encountered a page navigation during a concurrent package rebuild. After the build completed, all ten targeted brace/overline checks passed. Four nested brace import/edit checks also passed separately. Simple and nested brace screenshots were compared with KaTeX, including rich React/native active and passive states. Package/demo builds pass. This is workspace support, not a new npm release.

Contour correction: the earlier synthetic-glyph approach was visually incorrect. Ten Chromium regressions now pass, including the reported `\oint_{20}^{20}{x}` in React/native, single-glyph count, absence of pseudo-element drawings, native font slant, side bounds and explicit limits. Screenshots were rechecked against KaTeX.

Compact toolbar: two Chromium checks pass for rich React expand/collapse with preserved content/history and hidden-command typing, and native independent toolbar filtering with expansion preserved after insertion. A compact demo screenshot was inspected.

### Six additional accents — workspace

351 unit tests pass. A 25-case Chromium run passes for rich React/native import/edit, suggestion insertion, content-preserving unwrapping/Undo and the KaTeX comparison board. The initial dot typing test selected the existing multiplication-symbol candidate; the corrected test explicitly chooses Dot accent, preserving symbol-first ranking. After final accent clearance tuning, the comparison board passed again and was visually inspected for simple and nested expressions. The image is saved as `apps/math-demo/artifacts/spacing-audit/accents-comparison.png`. Package/demo builds pass; no npm release was made.

### Limit variants and explicit side placement — workspace

362 unit tests pass, including all supported operators with `limits: false`, JSON validation, canonical round trips and localized limit-name discovery. Eleven Chromium cases pass for both renderers: condition/body editing, insertion, deletion/Undo and the KaTeX comparison board. Package/demo builds pass. The comparison is a visual reference rather than pixel parity: KaTeX 0.16.28's operatorname-based liminf preview showed a below-name condition for the explicit nolimits example, while the editor deliberately honors the stored side-placement directive. No placement metadata is discarded to match that preview. Broader browser checks and a direct placement toolbar switch remain open.

Fine spacing: 366 unit tests pass. Nine Chromium checks pass across rich React/native for measured spacer widths, insertion, deletion/Undo, continued typing and a KaTeX comparison board. The negative gap preserves adjacent input access and has no painted hit box. Broader TeX glue/style semantics remain out of scope.

Limit preview correction: the earlier liminf display mismatch is now resolved in the demo through rendering-only KaTeX macro definitions. Seven Chromium checks pass: both limit names with default/limits/nolimits MathML placement and a refreshed visual comparison. Saved JSON and canonical LaTeX remain unchanged. Hosts using KaTeX 0.16.28 can use the documented macro configuration.

## Explicit size validation — 2026-09-08

- Package build and 371 unit tests passed, including four size-command round trips, suggestion insertion and nested explicit styles.
- Chromium: 8 React/native imported-slot editing cases, 8 typed-preset cases and one KaTeX comparison audit passed. Typed cases assert active input size and final exported source.
- Compared explicit display/text sizes and nested sizes against KaTeX. The editor keeps its interaction spacing; it does not claim pixel-identical TeX layout. General style declarations remain unsupported.
- Reference image: `apps/math-demo/artifacts/spacing-audit/explicit-sizes.png`. Publication and wider browser/platform validation remain open.

## Math alphabets — 2026-09-08

Package build and 376 unit tests passed. Thirteen Chromium checks passed: six typed-suggestion cases, six imported-slot editing/undo cases across React/native, and one KaTeX comparison audit including nested alphabets and a fraction with a script. Decorative alphabet claims are limited to Latin capitals. The comparison is in `apps/math-demo/artifacts/spacing-audit/math-alphabets.png`. Broader glyph coverage and cross-browser validation remain open.

## Labeled arrows — 2026-09-08

Package build and 381 unit tests passed, including label round trips, JSON validation and malformed optional-argument rejection. Nine Chromium checks passed: four typed/width-growth cases, four imported-label edit/undo cases across React/native, and one KaTeX comparison audit. The audit was repeated after fixing arrowhead width. See `apps/math-demo/artifacts/spacing-audit/labeled-arrows.png`. Other extensible arrows and wider browser testing remain open.

## Locale correction and equation* — 2026-09-08

Package build and 388 unit tests passed. Built-in locale tests reject misplaced fields, check en/ko parity and verify referenced literal message keys. Four Chromium cases passed: both locales' nine recent suggestion labels and arrow slot labels, plus React/native equation* import/edit/undo. The native fixture uses separate structural slots to match its whole-run text editing model. A KaTeX audit also compared the imported fraction/root equation. Demo build passed. Numbered equations remain unsupported.

## 0.2.0 release verification

- Formatting, package type checking, 388 unit tests and all eight packed JavaScript entry points pass. Packed CSS, locale JSON and licensed math fonts are present.
- The 379-case Chromium suite was reviewed against the current UI. Stale assumptions about expanded toolbars, symbol counts, broad candidate-name matching, focus outlines and suggestion-versus-line shortcuts were updated. Corrected cases were rerun, including the full 20-case wrapping file.
- Production demo build and generated documentation page/anchor checks pass. This release covers math-editor only. Note inline editing is resolved per the user and other product deployment is outside scope.

## 0.2.1 release verification

Formatting, types, 390 unit tests and all eight packed entry points passed. Thirty-nine related Chromium cases passed for keyboard and drag selection, clipboard, wrapping, tokens, brace/cases discovery, preview and bundled locales. Website PNG download/copy checks validate dimensions and nonblank raster pixels. Long-formula fitting and transparent alpha were checked separately. Image generation is a demo dependency, not a library API.
