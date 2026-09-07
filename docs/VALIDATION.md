# Validation report

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
