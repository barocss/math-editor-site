# Validation report

## Readability, geometry and navigation — release preparation, 2026-09-14

This candidate includes a configurable editing minimum, line clearance for
scripts, fraction descendant sizing, nested fence/radical fixes, token/structure
movement and selection, and visual text-popup zoom. The learning and styling
guides now recommend a 26px editing base for complex fractions, with a separate
preview/export size and an optional 16px nested minimum.

- Core regression checks: 1,743 unit tests passed; core and demo type checks passed.
- Focused browser checks: minimum-size editing, nested fences, script radicals,
  keyboard movement/selection, and visual popup zoom. Detailed scope and limits
  are recorded in the source-only records below.
- English/Korean site guidance explains the larger editing size. Public keyboard
  help now documents Ctrl/Option movement and selection and the matrix column
  deletion shortcut change.
- Historical full rendering and continuous-editing results below were obtained
  before this candidate. They are not a fresh all-suite pass for the new size
  policy. Exact curves/spacing and broader browser/platform QA remain open.
- This section records preparation, not npm publication or site deployment.

Source evidence: `test/rendering/STATUS.md`, `test/rendering/READABILITY.md`,
`test/editing/TOKEN-NAVIGATION.md`, and
`packages/math-editor-text/test/VISUAL-ZOOM.md` in the repository.

## Learning and keyboard help — workspace, 2026-09-13

- EDIT-035: **4 results / 40 checkpoints passed**: five model-checked tutorial exercises, wrong-answer/reset/close behavior, unchanged playground, toolbar help, Korean labels, and F1 lifecycle on React block/native block/native inline. [Evidence](../../output/playwright/editing-scenarios/2026-09-13T12-33-34-456Z/REPORT.md).
- EDIT-019: **17 targets / 549 checkpoints passed**, including F1/Escape before the full continuous editing and host persistence chain. [Evidence](../../output/playwright/editing-scenarios/2026-09-13T12-31-33-614Z/REPORT.md).
- Core: **1,736 tests / 43 files**, core/demo type checks, package build and site build passed.
- Rendering: **330 PASS / 0 DIFF / 0 ERROR**, source stable. [Gallery](../../output/playwright/rendering-audit/2026-09-13T12-31-34-393Z/GALLERY.html). The new styles target help and the tutorial; mathematical geometry thresholds are unchanged.

The first toolbar-help check exposed native selection collapse after closing help; selection restoration now passes immediate wrapping and continued input. A separate toolbar now uses explicit `onHelp` ownership instead of guessing a target field. The tutorial's LaTeX readout is not an extra live status region. English semantic locale-key checks pass.

The consolidated CI entry point now includes the learning suite. These are local Chromium/macOS results. Actual OS F1/Fn routing, screen readers and system clipboard exchange remain unverified. No npm/site publication was performed.

## Supported-notation editing milestone — workspace, 2026-09-13

The bounded milestone in [the roadmap](ROADMAP.md) passed its local gate. This is a workspace result; no package version or publication status changed.

- Core: **1,736 tests in 43 files**, strict core and browser-fixture type checks, and package build passed.
- Editing: **113 cases / 4,311 checkpoints** across 11 suites. All suites used identical source fingerprints, which still matched the candidate after execution.
- Rendering: **91 formulas / 330 PASS, 0 DIFF, 0 ERROR**. Existing thresholds were retained. Rendering sources matched the editing candidate. Twenty-one direct-shortcut cases also compare actual edited output with KaTeX.
- Main site/docs production build passed. The repository-owned runner and CI workflow use `node scripts/check-math-editor.mjs`. Workflow YAML and runner syntax passed; remote GitHub Actions execution is not claimed.

| Suite | Cases | Checkpoints | Result |
| --- | ---: | ---: | --- |
| EDIT-006 | 3 | 2766 | [PASS](../../output/playwright/editing-scenarios/2026-09-13T11-56-52-074Z/REPORT.md) |
| EDIT-007 | 4 | 76 | [PASS](../../output/playwright/editing-scenarios/2026-09-13T11-57-55-776Z/REPORT.md) |
| EDIT-013 | 2 | 10 | [PASS](../../output/playwright/editing-scenarios/2026-09-13T11-58-09-267Z/REPORT.md) |
| EDIT-016 | 2 | 28 | [PASS](../../output/playwright/editing-scenarios/2026-09-13T11-58-21-145Z/REPORT.md) |
| EDIT-018 | 8 | 60 | [PASS](../../output/playwright/editing-scenarios/2026-09-13T11-58-33-699Z/REPORT.md) |
| EDIT-018-options | 5 | 30 | [PASS](../../output/playwright/editing-scenarios/2026-09-13T11-58-46-765Z/REPORT.md) |
| EDIT-017-narrow | 3 | 12 | [PASS](../../output/playwright/editing-scenarios/2026-09-13T11-58-58-829Z/REPORT.md) |
| EDIT-029 | 3 | 156 | [PASS](../../output/playwright/editing-scenarios/2026-09-13T11-59-12-733Z/REPORT.md) |
| EDIT-034 | 3 | 131 | [PASS](../../output/playwright/editing-scenarios/2026-09-13T11-59-30-658Z/REPORT.md) |
| EDIT-033 | 63 | 510 | [PASS](../../output/playwright/editing-scenarios/2026-09-13T11-59-45-550Z/REPORT.md) |
| EDIT-019 | 17 | 532 | [PASS](../../output/playwright/editing-scenarios/2026-09-13T12-00-17-841Z/REPORT.md) |

[Consolidated evidence](../../output/playwright/math-editor-milestone/2026-09-13/REPORT.md) · [Rendering gallery](../../output/playwright/rendering-audit/2026-09-13T12-01-09-133Z/GALLERY.html)

Corrections include forward structure deletion, joining the following line, preferred vertical column retention, malformed clipboard rejection, multiline-paste rejection in React single-line fields, consistent Shift+Enter behavior and horizontal scrolling inside narrow inline hosts. English and Korean include the new invalid-clipboard message.

Clipboard checks use controlled ClipboardEvents/DataTransfer. Read-only is toggled without pointer blur to isolate the host state transition; clicking outside may intentionally apply a draft first. Editor.js data is checked after re-enabling because it cannot save while read-only. Its demo has no host Undo integration. Svelte option updates use its action API; the framework sample also covers actual Svelte mount/unmount.

Scope is desktop Chromium 152 on macOS with KaTeX 0.16.28. Safari, Firefox, Windows, real OS IME/clipboard, touch, screen readers, TinyMCE iframe and an installed WordPress admin are separate validation work. Geometry uses selected anchors and screenshot review, not complete pixel equality.

## Held arrow navigation — workspace validation, 2026-09-13

- React and native DOM now read the live input selection before keydown handling. Delayed selection events no longer leave token/slot boundary checks one key repeat behind.
- EDIT-034: 3 renderer/mode targets passed 131 checkpoints with repeated keydown and one final keyup. Both horizontal directions, fraction slots, held Shift selection, collapse, continued input and Undo are covered.
- EDIT-033: 63 cases / 510 checkpoints passed, including 21 actual edited-output comparisons with KaTeX.
- EDIT-019: all 17 standalone/integration targets passed 499 continuous editing checkpoints.
- Core: 1,677 tests / 42 files, type checking and package build passed. Evidence is linked from the source-only editing test README. This change is not published yet.

## Selection shortcuts — workspace validation, 2026-09-13

- Core: 1,677 tests / 42 files passed; type checking passed.
- EDIT-033: 63 cases / 510 checkpoints passed in Chromium. React block and native DOM block/inline each cover keyboard, native input and dragged selections, seven wrapping keys, continued typing and Undo/Redo.
- Geometry: 91 formulas / 330 combinations passed after fixing fraction term sizing and spacing. The same thresholds apply.
- Twenty-one keyboard cases also compare the actual edited output with KaTeX using the existing font-size and vertical-position thresholds.
- EDIT-019: all 17 standalone/integration targets passed 499 continuous editing checkpoints after the layout correction.
- Browser artifacts and measured rendering limits remain in the source-only editing/rendering ledgers. OS IME, other browser engines and the previously excluded host configurations remain separate work.

## Inline fence transformation suggestions — workspace, 2026-09-09

Core: **584 tests in 36 files passed**. Core type checking and the main site/docs
build passed. `fence-suggestions-check.js` passed in Chromium for rich React and
all nine host demos, including menu reopening, keyboard acceptance, cancellation,
retained caret, continued typing and separate Undo entries. Editor.js is a block
host; this run does not claim an inline placement for that adapter.

`fence-context-check.js` passed all eight bracket choices through the optional
footer in the same ten editor views. `fence-inline-options-check.js` passed in a
native inline iframe with toolbar and footer disabled, including nearest nested
fence targeting, ko/en switching, unchanged document on locale changes, retained
input focus/caret, continued typing and teardown.

Existing root conversion suggestions were rerun in React and Quill and passed.
`fence-rendering-check.js` verifies the exported source after changing a bracket
around a fraction. The editor and KaTeX screenshots were visually inspected:
`output/playwright/fence-transform-editor.png` and
`output/playwright/fence-transform-katex.png`. This uses the existing delimiter
renderer and does not claim pixel-identical layout.

See EDIT-029 through EDIT-032 for acceptance criteria. This is local Chromium
workspace evidence, not a release, real OS IME or cross-browser certification.

## Contextual radical tools — workspace, 2026-09-09

Core: **570 tests passed in 35 files**. Type checking and the main documentation/demo build passed.

`context-tools-check.js` passed in local Chromium for rich React and all nine
host examples: Tiptap, ProseMirror, Lexical, Editor.js, TinyMCE, CKEditor, Quill,
Slate and Gutenberg. It covers query-independent discovery, retained tools after
suggestion dismissal, F6/Escape focus, conversion, selected index editing, a
non-square-index explanation, radicand retention, Undo, leaving a radical and
hiding tools during model range selection.

`context-tools-options-check.js` passed for nearest nested targeting, native DOM
inside an iframe, owner-document keyboard focus, dynamic `contextTools`, en/ko
labels, synthetic composition guards, outside blur, teardown, and dynamic Web
Component `context-tools` attributes. Synthetic events do not certify OS IME.

The footer was visually inspected separately from the suggestion popup. Evidence
is in `output/playwright/context-tools-footer.png` and the two browser fixtures.
EDIT-021 through EDIT-028 record acceptance criteria and remaining checks: native
Tab order, document equality across locale changes, individual framework-wrapper
option smoke tests, and broader browsers/platforms. The new footer currently
covers square/indexed roots. Other structure families remain roadmap work.
These are workspace-source checks; no package or site was published.

## Fractional scripts and empty-slot deletion — workspace, 2026-09-09

Core: 568 tests passed in 35 files; type checking and formatting passed. The
main documentation/demo build passed. `empty-slot-deletion-check.js` passed
16 real-key checks across React/native DOM: Delete and Backspace from empty
root, fraction, exponent and root-index slots, retained content, focus and Undo.
Grid cells and populated rows are protected by the added core tests.

`rendering-regression-check.js` passed 12 Chromium comparisons: three formulas,
two base sizes and two renderers. Fraction terms matched KaTeX font sizes;
vertical offset differences were at most 0.109em against a 0.25em threshold.
Horizontal gap, active-input size and focus assertions passed. Matching-size
editor/KaTeX screenshots were visually inspected for the indexed-root power
and simple fractional power. Full pixel identity is not claimed.

Local evidence: `output/playwright/math-rendering-regression-evidence.json`
records metrics and source SHA-256 values. Screenshot pairs use the paths in
[Rendering checks](RENDERING-TESTS.md). This is workspace-source evidence, not
packed-release, all-host, cross-browser or full notation certification.

See [Editing scenarios](EDITING-SCENARIOS.md) for stable scenario IDs, acceptance criteria, coverage gaps and per-run reporting.


## Radical conversion suggestions — workspace, 2026-09-09

Core tests: 558 passed in 34 files; type checking passed. Ten added cases cover
nested radicands, retained node IDs, selected index `2`, safe reverse conversion,
non-square and structured indices, nearest-root targeting, stale targets, empty
slots, localization, literal text and Undo/Redo.

`root-transform-check.js` passed in Chromium for rich React and Quill's native
DOM field. It checks pointer and arrow/Enter acceptance, selected index editing,
radicand preservation, reverse conversion, and rejection of index `3` conversion.
The generated LaTeX and KaTeX preview match; editor/KaTeX radical screenshots
were inspected. This does not certify every browser or every host adapter.

## Selection suggestion navigation — workspace, 2026-09-09

`apps/math-integrations/tests/selection-suggestions-check.js` passed in Chromium
for rich React and all nine host integrations. The check covers Shift+arrow
ranges, Up/Down navigation, the Alt+Down alias, Enter wrapping the selected
characters, retained input focus after wrapping, and native mouse-drag selection.
No page errors were reported. Core tests: 548 passed; core type check passed.
`selection-collapse-check.js` also passed for React horizontal caret recovery,
fraction boundaries and resumed typing. `tinymce-inline-check.js` passed for
inline and classic iframe hosts, including vertical caret recovery after Escape
dismisses the wrapping menu, Apply/Cancel, serialization and Undo/Redo.

A visible wrapping menu now owns vertical arrows. Left/Right still collapses
a model selection to its ordered edge. This replaces the Alt-only menu
navigation policy in the historical selection-collapse record below.

## Styling and themes — workspace, 2026-09-09

Release browser regression: all 385 existing Chromium cases passed across the
full run and a focused rerun. Three stale expectations were updated for locale
query parameters, the explicit toolbar overflow button and Alt+arrow wrapping
navigation; all 26 cases in those three files passed on rerun. Shared integration
unit tests: 52 passing. No notation/model changes were needed for theming.

`apps/math-integrations/tests/style-customization-check.js` passed in Chromium:
independent light/dark instances, resolved host `var()` aliases, isolation from
unrelated portal-container variables, external toolbar styling, native iframe
menus, rich React suggestions/selection menus, and live theme switches preserving
input focus, document state and history. The site controls and styling reader
were also checked in Korean; English controls are covered by the fixture.

`tinymce-inline-check.js` additionally passed palette/action styling and the
existing typing, Apply/Cancel, serialization, history and cleanup cases in both
inline and classic iframe TinyMCE. The Apply control now has an explicit class,
so prepended size controls cannot prevent its primary style. These checks do not
certify arbitrary customer CSS palettes or browser/assistive-technology contrast.


## Selection collapse — workspace, 2026-09-09

Core unit regression: 503 tests in 31 files. The added cases cover ordered edges
for forward/reversed structural ranges, partial-text and collapsed ranges,
absent ranges/non-arrow keys and unchanged source. Plain arrows now restore
a caret from model selection in both renderers; Alt+Up/Down retains a range for
wrapping-suggestion navigation.

Real Chromium checks in `apps/math-integrations/tests/selection-collapse-check.js`
passed for rich React, including subsequent typing and fraction-boundary collapse.
`tinymce-inline-check.js` passed all four plain arrows and subsequent typing in
both inline TinyMCE and its classic iframe. Native selection/toolbar, shared iframe
and all nine matrix host regressions also passed. Wider browser and OS IME checks
remain open. This is workspace evidence, not a new published package version.

## Current release status — 0.2.1

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
- Saved-document validation, bounded LaTeX import and keyboard model ranges are implemented; model-version migration and recovery remain open. Host persistence/Undo evidence is recorded separately in the integration validation guide.
- Matrix rectangles and transpose are implemented in the workspace; full TeX interpretation and symbolic computation are not implemented.
- Deep nesting and very large expressions have no agreed performance budget yet.

## Integration gates

Before shipping inside a host product, test actual input methods and target browsers, establish a single undo owner, validate saved documents, verify focus across host/math boundaries, and define recoverable clipboard/import failures. Every new structure must have localized labels, deterministic transformations, one-step structural undo, browser interaction coverage and supported LaTeX output.

## Matrix cell ranges and transpose — 2026-09-09 workspace

- 498 core tests pass, including 16 cell-rectangle/model/history cases and a grid
  hit-test regression for tall fractions. Selection snapshots stay isolated;
  invalid shapes and oversized pastes preserve the entire document/history.
- `apps/math-integrations/tests/matrix-range-check.js` passes in both rich React
  and the native renderer with zero page errors. It covers active-input drag,
  reversed corners, keyboard extension/shrinking, Shift+click, exact nested-cell
  clipboard payloads, mismatched paste rejection, paste/cut/clear/typing Undo,
  anchored TSV growth, full transpose and resumed nested-denominator editing.
- The same exported transposed matrix was inspected in both editors and KaTeX.
  Screenshots: `output/playwright/matrix-range-native-katex.png` and
  `output/playwright/matrix-range-react-katex.png`. Cell order and nested structure
  match; editing retains its existing spacing and caret targets.
- Pointer hit testing uses row and column tracks independently once a cell range
  starts. A tall fraction no longer attracts the pointer away from a neighboring
  cell during edge scrolling. Pointer focus uses `preventScroll`, and the React
  selection hint is below the expression to avoid moving it mid-drag.
- Clipboard checks dispatch ClipboardEvent with DataTransfer; they do not certify
  system clipboard transfer to other applications. OS IME, touch, Safari/Firefox
  and screen-reader coverage remain open. No new LaTeX syntax or model version was
  introduced; neither npm publication nor site deployment is part of this run.

## Native controls and precise selection — 2026-09-09 workspace

The native surface now exposes symbol search, templates and matrix presets behind
More tools, plus contextual row/column/delimiter controls. Selected passive text
is highlighted at its exact endpoints. Pointer drags can start in the live input
and extend through structures while ordinary within-input selection stays native.

- The core suite passes 481 tests, including toolbar catalog restrictions,
  partial-text intersections, Shift-drag anchors, selection-menu dismissal and
  suggestion placement around reserved host controls.
- `apps/math-integrations/tests/native-parity-check.js` passes in Chromium with
  zero page errors: exact partial highlights, native within-input replacement,
  cross-fraction selection in both directions, Shift-drag forward/backward anchors,
  shrinking the range back, replacement and Undo, symbol insertion into selected
  text, editable templates, matrix edits, filtered/hidden toolbars and teardown.
- Selection Escape checks preserve the model/native range on the first Escape,
  reopen suggestions for a changed selection, and notify host Cancel on the second.
- The browser clipboard check dispatches a ClipboardEvent with DataTransfer and
  verifies both exact LaTeX endpoints and the structured MIME payload. This is
  handler validation, not an OS clipboard compatibility claim.
- Synthetic formula composition disables toolbar mutations and restores them on
  composition end. Real OS IME testing remains deferred.
- The existing fraction fixture is shown alongside its KaTeX output in
  `output/playwright/native-parity-editor-katex.png`; this addition changes
  controls and selection presentation, not supported notation or glyph geometry.

These are workspace changes awaiting release. Whole logical-run active inputs,
one active-run role color, additional
complete locale packs and broader browser/accessibility certification remain open.
Host-specific browser findings are recorded in the integration validation guide.

## Line numbers and symbol discovery

Three browser tests verify the UI-only line gutter through split/join/undo, its exclusion from LaTeX and model clipboard, the complete 90-symbol grid, bilingual search, insertion before typing, range replacement, undo, Escape and clipboard isolation in the search field. A native Home key did not move the caret in the macOS test environment; the test uses the supported Left arrow to reach the line start. The in-app browser visually confirmed the full symbol grid with names and search focus.

## Framework-neutral integration — 2026-09-07

- **76 unit tests passed**, including session snapshot isolation, navigation versus document notifications, atomic selection wrapping, inline rejection without data loss, and custom locale alias/fallback/direction behavior.
- **73 Chromium tests passed**: the previous 61 tests plus 12 native/adapter tests. The added cases mount real Vue and React components, a compiled Svelte 5 component, a Solid owner/directive, a Web Component and pure DOM surfaces. They verify fraction input, suggestion acceptance, undo, teardown, reconnect persistence, inline policy, external toolbar wrapping, custom French discovery and matrix row changes.
- Package and demo TypeScript checks, browser test type checking and both production builds passed. The adapter lab is also included in the production build.
- A packed tarball was extracted into a temporary directory. Five entry points (`core`, `dom`, `web-component`, `vue`, `svelte`) imported without framework peers or browser globals; main/React/Solid entries imported after installing links to only their relevant local peers. All eight JS export paths and declared CSS/type targets exist. This is a local packaging smoke test, not publication or an exhaustive downstream TypeScript/bundler matrix.
- The in-app browser visually verified the adapter lab and actual pure-JS `x/ → ↓ → Enter → 2` input, producing `\frac{x}{2}`. Inline mode displays without the block editor's large surface and toolbar.

Updated 2026-09-09: exact range highlighting, active-input cross-structure dragging
and native symbol/template/grid controls are implemented in the workspace.
Remaining adapter gates include token-level active input/colors, composition
preview parity, framework/version coverage and accessibility/browser coverage.
Native `MathEditorSurface` is not advertised as complete rich React parity.
OS IME testing remains deferred.

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

## Editing utilities — workspace, 2026-09-09

Core unit regression: **548 tests**. Shared integrations: **52 tests**. Core, integration package and both demo applications pass TypeScript checks. The main demo documentation/site build and the integration demo production build pass. The integration demo retains its existing large host-SDK chunk warnings.

- `token-paste-check.js`: Vue and rich React pass continuous token typing, middle insertion, boundary deletion, range replacement through explicit LaTeX paste, atomic diagnostics, continued typing and Undo.
- `quick-presentation-check.js`: Vue, rich React and Quill pass symbol/template favorites, recent items, insertion focus, bracket/size/limit changes and Undo. Editor views and the live KaTeX output were visually compared.
- `host-composition-check.js`: 16 supported inline/block combinations across nine host demos preserve browser preedit, commit/cancel and subsequent typing without per-key refocusing.
- `latex-paste-host-check.js`: the same 16 combinations keep Ctrl/Cmd+Enter inside the paste form. Inserted fractions remain local drafts, typing resumes, and Cancel preserves host serialization.
- `native-parity-check.js`: exact text and cross-structure selection, Shift-drag, shrinkback, structured copy, discovery, grid controls, restrictions and teardown pass. Its coordinate helper now maps logical text across token spans.
- Quill composition and typing regression fixtures pass, including read-only recovery, host history and matrix-cell entry.

This is local Chromium evidence. OS IME, Safari/Firefox, installed WordPress and cross-application system clipboard checks were not repeated. No new mathematical grammar or numerical behavior is introduced. Release artifacts prepared before these changes require regeneration; nothing was published by this work.


## EDIT-019 continuous editing — workspace, 2026-09-10

- Run: `2026-09-09T17-47-53-597Z`; source fingerprint remained stable.
- Evidence: [report](../../output/playwright/editing-scenarios/2026-09-09T17-47-53-597Z/REPORT.md), [checkpoints and source hashes](../../output/playwright/editing-scenarios/2026-09-09T17-47-53-597Z/report.json).
- Command: `pnpm --filter @barocss/math-editor test:editing`.
- Environment: Chromium 152 / macOS, English locale, workspace source.
- **React standalone block: PASS, 28 checkpoints. Quill in-place block: PASS, 29 checkpoints.**
- Real key input creates `fraction(indexedRoot(3, ab), 2) + matrix(1, 2; 3, 4)`;
  an explicit tree assertion checks content and nesting. The last cell becomes
  `456789` in a second uninterrupted typing chain.
- Both surfaces pass two five-step Undo/Redo chains, retained typing focus,
  empty-root Delete/Undo/Redo and unchanged retained content. Each first history
  step is compared with its recorded structural checkpoint.
- Quill draft operations leave host data unchanged. Apply is one host Undo step;
  Redo restores it. Save, page reload, Restore and reopen preserve the Delta and
  formula structure. The restored matrix remains editable; Cancel preserves the
  saved document. React has no host persistence lifecycle, so that part is N/A.
- The runner fails on either scenario failure or a changed source fingerprint.
  It stores the executed fixture, failure screenshots, diagnostics and final data.
- No runtime library changes were required. Earlier fixture failures exposed OS
  `End` assumptions and selection of the wrong saved block; the final fixture
  verifies caret offsets with arrows and reopens the uniquely identified formula.
- Not covered: other hosts, Quill inline mode, real OS IME/clipboard,
  Firefox/WebKit, touch, accessibility and performance budgets. No release-wide
  pass or new rendering pass is claimed.


## EDIT-019 Quill inline extension — workspace, 2026-09-10

- Run: `2026-09-09T22-30-59-017Z`; source fingerprint remained stable.
- [Report](../../output/playwright/editing-scenarios/2026-09-09T22-30-59-017Z/REPORT.md) and
  [checkpoints](../../output/playwright/editing-scenarios/2026-09-09T22-30-59-017Z/report.json).
- **React block: PASS (28 checkpoints); Quill block: PASS (29); Quill inline: PASS (30).**
- The unchanged continuous editing chain runs in all three targets. Renderer and
  mode are recorded separately, including artifact names and the failure summary.
- Quill inline commits with Enter from the outer boundary. No extra formula line
  or host paragraph appears; prose is unchanged by math editing.
- Apply/host Undo/Redo, Save/reload/Restore, re-edit and Cancel preserve the
  inline formula. A later Right-arrow exit returns focus to Quill; typing `q`
  inserts exactly one character immediately after that formula. Host Undo
  restores the committed Delta, including formula data.
- Runtime library code was unchanged. The runner and scenario documentation were
  extended; no npm publication or new rendering audit was required.
- Other hosts, standalone inline adapters, OS IME/clipboard, Firefox/WebKit,
  touch, accessibility and performance remain outside this run.


## EDIT-019 Tiptap and ProseMirror — workspace, 2026-09-10

- Run: `2026-09-09T22-39-51-097Z`, stable source fingerprint.
- [Report](../../output/playwright/editing-scenarios/2026-09-09T22-39-51-097Z/REPORT.md) and
  [checkpoints and hashes](../../output/playwright/editing-scenarios/2026-09-09T22-39-51-097Z/report.json).
- **7 targets PASS / 205 checkpoints:** React block (28), Quill block/inline
  (29/30), Tiptap block/inline (29/30), ProseMirror block/inline (29/30).
- Chromium 152 on macOS, English UI, workspace source. The extended runner hashes
  both newly covered plugin sources and package metadata.
- Each target passes the existing continuous formula chain. Integrated hosts
  additionally check Apply/host Undo/Redo, Save/reload/Restore, re-edit/Cancel,
  retained formula data and unchanged prose/container structure. Inline targets
  check Enter commit, right-boundary exit, exact prose position and host Undo.
- Initial integrated run `2026-09-09T22-36-38-459Z`: six PASS, Tiptap inline FAIL.
  A quick prose edit after Restore shared the restored document's history event;
  Undo removed both. The sample now brackets `setContent` with `closeHistory`
  transactions, keeping the replacement and subsequent typing separate.
- Corrected run `2026-09-09T22-38-26-544Z`: seven PASS. The final run above repeats
  all seven targets with the final runner documentation and source hashes.
- Integration-demo TypeScript and production build pass. Existing large-chunk
  build warnings remain. Test source formatting passes. Core/plugin runtime
  code was unchanged; the fix belongs to the Tiptap demo's restoration callback.
- Remaining: Lexical, Editor.js, TinyMCE, CKEditor, Slate and Gutenberg; native OS
  IME/clipboard, other browser engines, touch, accessibility and performance.


## EDIT-019 Lexical — workspace, 2026-09-10

- Run: `2026-09-09T23-08-15-353Z`, stable source fingerprint.
- [Report](../../output/playwright/editing-scenarios/2026-09-09T23-08-15-353Z/REPORT.md) and
  [checkpoints and hashes](../../output/playwright/editing-scenarios/2026-09-09T23-08-15-353Z/report.json).
- **9 targets PASS / 264 checkpoints:** React block (28), Quill block/inline
  (29/30), Tiptap block/inline (29/30), ProseMirror block/inline (29/30),
  Lexical block/inline (29/30).
- Chromium 152 on macOS, English UI, workspace source. Fingerprints now include
  the Lexical plugin source and package metadata.
- Lexical passes the full nested editing and two history chains, Apply as one
  host Undo event, Redo, Save/reload/Restore, re-edit and Cancel. Inline also
  passes Enter commit without a new paragraph, right-boundary exit, focus return,
  typing immediately after the formula and host Undo.
- Host checks read Lexical serialized state and retain container boundaries and
  formula atoms. Drafts must not change saved host state. Restoration must match
  the complete saved JSON; math rendering alone is not the persistence check.
- The initial run `2026-09-09T23-06-35-494Z` reached Save/Restore in both Lexical
  modes but used an incorrect locator for reopening. Lexical uses a mounted
  `.bme-lexical-node` widget; `data-barocss-math` belongs to its HTML export.
  The fixture now locates its live widget. No product code change was needed.
- Runner formatting passes. This change only extends tests and documentation;
  no new build, package publication or rendering audit was required.
- Next: Editor.js, TinyMCE, CKEditor, Slate and Gutenberg. Native OS IME/clipboard,
  other browser engines, touch, accessibility and performance remain outside this run.


## EDIT-019 Editor.js — workspace, 2026-09-10

- Run: `2026-09-09T23-25-26-845Z`, stable source fingerprint.
- [Report](../../output/playwright/editing-scenarios/2026-09-09T23-25-26-845Z/REPORT.md) and
  [checkpoints and hashes](../../output/playwright/editing-scenarios/2026-09-09T23-25-26-845Z/report.json).
- **10 targets PASS / 293 checkpoints:** React block (28), Quill/Tiptap/
  ProseMirror/Lexical block and inline (29/30 each), Editor.js block (29).
- Chromium 152 on macOS, English UI, workspace source. Fingerprints include
  Editor.js plugin source and package metadata.
- Editor.js passes nested fraction/root/matrix editing, suggestion selection,
  two uninterrupted formula Undo/Redo chains, empty-root deletion/restoration,
  Apply, Save/reload/Restore, re-edit and Cancel. Draft checks confirm saved host
  data stays unchanged until Apply; prose blocks and block order remain intact.
- Async `save()` comparisons exclude only the generated `time` field. Block IDs,
  saved model data, paragraph data and version remain in persistence assertions.
- **Editor.js host Undo/Redo is not covered:** the demo has no document history
  integration. The runner records this limitation in `hostHistory`; it retains
  the mandatory host Undo/Redo assertions for other configured hosts. Editor.js
  inline mode is outside the block tool's contract.
- Test-source formatting passes. Only the runner, fixture and documentation
  changed; no runtime fix, build, publication or new rendering audit was needed.
- Next: TinyMCE, CKEditor, Slate and Gutenberg. Native OS IME/clipboard, other
  browser engines, touch, accessibility and performance remain separate work.


## EDIT-019 TinyMCE — workspace, 2026-09-10

- Run: `2026-09-09T23-39-57-339Z`, stable source fingerprint.
- [Report](../../output/playwright/editing-scenarios/2026-09-09T23-39-57-339Z/REPORT.md) and
  [checkpoints and hashes](../../output/playwright/editing-scenarios/2026-09-09T23-39-57-339Z/report.json).
- **12 targets PASS / 352 checkpoints:** React block (28), Quill/Tiptap/
  ProseMirror/Lexical/TinyMCE block and inline (29/30 each), Editor.js block (29).
- Chromium 152 on macOS, English UI, workspace source. TinyMCE 8.9.0 uses
  `inline: true` for its host. Both math modes are covered; classic iframe mode
  is not covered by this run. Fingerprints include TinyMCE source and metadata.
- TinyMCE passes the sustained fraction/root/matrix chain, formula history,
  draft isolation, one host Undo/Redo for Apply, Save/reload/Restore, re-edit and
  Cancel. Inline also passes Enter commit, right-boundary exit, focus return,
  typing immediately after the formula and host Undo.
- The fixture applies and reopens an empty atom before the chain because TinyMCE
  inserts on Apply. This exposed a real bug: the empty preview renderer returned
  no visible content, leaving no click target. The adapter now shows the existing
  localized empty-formula message and skips the renderer for empty LaTeX.
  Serialized content stays empty; the test checks the label does not leak into HTML.
- HTML comparisons retain the complete serialized document. A detached parser
  reads prose and element boundaries for caret checks. Live locators exclude
  TinyMCE's `.mce-offscreen-selection` clone inside the editable body.
- Diagnostic run `2026-09-09T23-38-20-112Z` confirmed that a reported prose Undo
  failure was in the fixture: saved and actual HTML were identical, but building
  the expected prose result had mutated the saved units array. The fixture now
  copies that array. No timing wait or product history change is used to pass it.
- TinyMCE package TypeScript, two unit tests, build and changed-source formatting
  pass. Package-local build also exposed a metafile path check using the wrong
  working directory. The build now sets esbuild's working directory to the repo
  root; the normal package build command succeeds with its dependency checks intact.
- Patch changeset: `.changeset/tiny-math-empty-preview.md`. No package was published.
- Remaining: CKEditor, Slate, Gutenberg, TinyMCE iframe mode, native OS
  IME/clipboard and other browser/input environments. Editor.js document history
  remains unverified because its demo has no host history integration.


## EDIT-019 CKEditor — workspace, 2026-09-10

- Run: `2026-09-09T23-44-59-263Z`, stable source fingerprint.
- [Report](../../output/playwright/editing-scenarios/2026-09-09T23-44-59-263Z/REPORT.md) and
  [checkpoints and hashes](../../output/playwright/editing-scenarios/2026-09-09T23-44-59-263Z/report.json).
- **14 targets PASS / 411 checkpoints:** React block (28), Quill/Tiptap/
  ProseMirror/Lexical/TinyMCE/CKEditor block and inline (29/30 each),
  Editor.js block (29).
- Chromium 152 on macOS, English UI, workspace source. CKEditor 48.5.0 uses the
  local ClassicEditor demo. Fingerprints include CKEditor plugin source and
  package metadata. This run does not cover other CKEditor builds or collaboration.
- CKEditor passes the sustained fraction/root/matrix chain, keyboard suggestion
  selection, two formula Undo/Redo chains, empty-root deletion/restoration,
  unchanged host data during drafts, Apply as one host Undo event and host Redo.
- Save/reload/Restore retains the complete serialized HTML and editable math
  structure. Re-edit and Cancel leave that HTML unchanged. Inline also passes
  Enter commit without another paragraph, Right-arrow exit, focus return,
  prose input immediately after the formula and host Undo.
- The fixture reuses the detached HTML parser for prose/container checks and
  copies parsed units when constructing expectations. Full saved-state equality
  remains required for history and persistence checks.
- Test-source formatting passes. Only tests and documentation changed in this
  extension; no runtime fix, additional build or package publication was needed.
- Next: Slate and Gutenberg. TinyMCE iframe hosts, other CKEditor builds,
  native OS IME/clipboard and other browser/input environments remain separate
  targets. Editor.js document history is still outside its demo's configuration.


## EDIT-019 all integration demos — workspace, 2026-09-10

- Run: `2026-09-09T23-55-26-302Z`, stable source fingerprint.
- [Report](../../output/playwright/editing-scenarios/2026-09-09T23-55-26-302Z/REPORT.md) and
  [checkpoints and hashes](../../output/playwright/editing-scenarios/2026-09-09T23-55-26-302Z/report.json).
- **17 targets PASS / 499 checkpoints**, covering all nine integration demos
  plus standalone React block. Chromium 152 on macOS, English UI, workspace source.

| Editor | Tested math modes | Checkpoints | Host Undo/Redo |
| --- | --- | ---: | --- |
| React standalone | Block | 28 | Not applicable |
| Quill | Block + inline | 59 | PASS |
| Tiptap | Block + inline | 59 | PASS |
| ProseMirror | Block + inline | 59 | PASS |
| Lexical | Block + inline | 59 | PASS |
| Editor.js | Block | 29 | Not configured; unverified |
| TinyMCE | Block + inline, inline host | 59 | PASS |
| CKEditor | Block + inline, ClassicEditor | 59 | PASS |
| Slate | Block + inline | 59 | PASS |
| Gutenberg | Block, standalone provider | 29 | PASS |

- Slate passes the sustained nested editing chain, two formula Undo/Redo chains,
  Apply as one host history event, Save/reload/Restore, re-edit and Cancel.
  Inline also passes Enter commit, Right-arrow exit, host focus, exact prose
  insertion position and host Undo. Comparisons retain the saved descendant
  array and formula objects; prose checks also preserve paragraph boundaries.
- Gutenberg passes the same block chain and provider host Undo/Redo. Full saved
  HTML equality includes WordPress comments and encoded math data. A separate
  detached DOM comparison checks prose and block order; comments are not prose.
- Both new hosts keep saved document data unchanged while editing a draft.
  Restore reproduces the full saved state and reopens the same editable model.
- Fingerprints now include Slate and Gutenberg source/package metadata, as well
  as the previously covered hosts, core, shared helpers, demos and test runner.
- Formatting passes. This extension changed only tests and documentation; no
  runtime fix, new build or publication was needed.
- This run covers local demo configurations. It does not replace the separate
  WordPress admin/plugin ZIP checks. TinyMCE iframe, other CKEditor builds,
  collaboration, native OS IME/clipboard, Firefox/WebKit, touch, accessibility
  and performance remain separate targets. Editor.js/Gutenberg are block tools;
  no inline mode is claimed for them.

## Text editor integrations — 2026-09-13

- Source-range tests: 31 passing cases (`packages/math-editor-text/test/ranges.test.ts`).
- macOS Chromium browser adapters: 52 passing checkpoints across CodeMirror 6, CodeMirror 5, and Monaco. Includes nested root editing, display Enter, read-only changes, conflicting source, unsupported syntax, code exclusion, and Korean popup labels.
- VS Code 1.103.1 Extension Host: four command-opening checks and eight Webview Apply/Cancel/Undo/Redo checks across Markdown and LaTeX. A disposable copy uses a test-only DOM input driver; no test driver ships in the VSIX.
- Evidence: `output/playwright/math-text/`. Browser script: `apps/math-text-demo/test/editing.browser.js`. VS Code runner: `pnpm --filter barocss-math-editor test:extension`.
- Remaining coverage: Firefox/Safari, Windows/Linux shortcuts, screen readers, VS Code web/remote hosts, and custom Markdown/TeX dialect resolvers.

## Direct source completion and example guides — 2026-09-13

- Shared source unit coverage: 37 passing checks, including range detection, fraction/root argument positions, rectangular matrices, symbol aliases, canonical export spellings and localized completion labels.
- Browser source completion: 42 checks across CodeMirror 5, CodeMirror 6 and Monaco. Covers command-only replacement, focus retention, one-step Undo/Redo, forward argument navigation, scrolling, explicit catalog opening, incomplete source, read-only state and visual-popup fallback.
- Additional source layout checks: 9 across the three hosts, covering indexed roots, reverse argument navigation, KaTeX preview placement and composition-event suspension. Synthetic composition events test gating; this is not a complete OS IME certification.
- Existing visual-popup browser suite: 52 checkpoints still pass.
- Example guides: 12 pages, including all nine document editors, with installation instructions and links checked against rendered HTML documentation.
- Text packages, main site and integration site build successfully. Main and integration bundles retain existing large-chunk warnings.
- Scripts: `apps/math-text-demo/test/source.browser.js`, `source-layout.browser.js`, `example-guides.browser.js`. Evidence is under `output/playwright/math-text/`.
- This does not establish Firefox/Safari, Windows/Linux, screen-reader or VS Code source-completion support. No npm or site publication was performed for this change.
