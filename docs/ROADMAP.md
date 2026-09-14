# Math editor roadmap

## Learning and discoverability — implemented, 2026-09-13

- Five interactive site exercises use their own field and validate normalized formula models: correction, fraction wrapping, power, root conversion and LaTeX insertion.
- Beginner, clipboard and keyboard guides are in the documentation navigation. Outdated claims that norms/integrals/brace annotations were still planned were removed from the LaTeX guide.
- Localized F1/toolbar help works in React and native fields, including toolbar-free inline. Closing restores native input selection. Custom controls can use `showHelp()`; separate native toolbars connect with `onHelp`.
- EDIT-035 and the extended 17-target host chain pass; see [validation](VALIDATION.md).

Possible later convenience work: configurable key bindings with host-conflict rules, and selection-only image export. These are not implemented by the help API. Prioritize demonstrated input problems and platform validation before adding more notation.

## Completed milestone: reliable editing of supported notation — 2026-09-13

Complete an uninterrupted formula workflow: **input → select → wrap or transform → navigate → delete → copy/paste → undo/redo → save → reopen and edit**. The JSON tree, exported LaTeX, visible notation and active caret must agree at each relevant checkpoint.

This section defines the current work and its completion criteria. The dated records below are historical evidence; their old “next” and “awaiting release” statements do not define current priority or publication status. Dates describe verification runs, not release promises.

### Starting baseline

- EDIT-019: 17 standalone/integration targets, 499 continuous-editing checkpoints.
- EDIT-033: 63 selection-shortcut cases, 510 checkpoints, including 21 comparisons of actual edited output with KaTeX.
- EDIT-034: React block and native DOM block/inline, 131 held-arrow checkpoints.
- Rendering: 91 formulas, 330 renderer/mode/size combinations. These are selected geometry checks, not complete pixel or behavior coverage.
- Core: 1,677 tests in 42 files at the latest recorded run.

See [validation](VALIDATION.md) and [editing scenarios](EDITING-SCENARIOS.md). The starting counts above are historical; the closure results below supersede them.

### Execution order and bounded deliverables

All six batches are **complete for the environment and checks stated here**. The local gate passed 1,736 core tests, 113 editing cases / 4,311 checkpoints and 330 KaTeX comparisons. Strict type checks, core build and site/docs build passed. [Validation](VALIDATION.md) contains the per-suite evidence. The CI workflow is configured and its entry point passed locally; remote execution and publishing remain separate actions.

| Order | Batch | Scope | Completion check |
| --- | --- | --- | --- |
| 1 | Structure and grid deletion | EDIT-006/015: Backspace and Delete inside/outside empty and populated structures; selected ranges; matrix, cases and alignment rows/cells | Define the expected action before implementation. Preserve all content not explicitly deleted. One Undo restores the exact tree and a valid caret. Follow deletion with typing and Redo. |
| 2 | Range interchange | EDIT-007/015: text plus nested structures; copy, cut and paste within/across instances; matrix rectangles; supported LaTeX fallback; malformed and mismatched payloads | Preserve selected structure and unselected content. Cut is undoable. Rejected paste changes nothing. Distinguish controlled clipboard-event checks from actual system clipboard verification. |
| 3 | Lines and keyboard navigation | EDIT-012/013/016/034: line split/merge; cases/alignment row edits; matrix traversal; repeat keys; vertical movement; suggestion navigation | Preserve the preferred horizontal caret position across repeated vertical movement where geometry permits. Menus own their documented keys. Inline Enter follows the host contract and creates no formula line. |
| 4 | Selection and transformations | EDIT-002–005/021–033: direct wrapping, suggestion-based conversion, nearest nested target, Escape and continued input without a toolbar | Current supported transformations remain discoverable by keyboard. They preserve operands, use the intended slot and support one-step Undo. Do not add new notation as a prerequisite. |
| 5 | Host lifecycle | EDIT-008–011/018/019: extend current host chains with the completed operations; Apply/Cancel; storage reload; read-only; multiple instances; teardown | Draft operations do not modify stored host content. Apply creates one host history event where supported. Reopened formulas remain editable. Menus and listeners do not survive instance destruction. |
| 6 | Consolidated verification and release checks | Run the required suites on the same candidate source; update scenario status, support limits, docs and release notes; connect the required checks to CI | Checks fail on regressions or missing required results, retain reports/screenshots and work without a developer-specific absolute CLI path. No required in-scope scenario remains unrun or failed. Publishing is a separate action. |

For each batch: reproduce → specify the expected tree/caret → add a failing case → fix the shared behavior → compare editor/KaTeX → rerun affected scenarios → record evidence. Rerun the complete geometry set when shared layout rules change. Keep every discovered regression as a stable scenario.

### Structure and visual comparison contract

1. Cover every currently supported structure kind in the catalog with a populated edit and an empty-slot/boundary case where applicable. Shared structural families may share fixtures, but each catalog kind must map to coverage or an explicit non-applicable reason.
2. Keep the existing catalog-driven parser/exporter combination checks. Add browser combinations by behavior: structure in a fraction slot, a script, a radical/fence, an operator bound, or a grid cell. Include repeated siblings, compound operands, mixed text/math and at least three nested structural levels. This is a finite representative matrix, not every possible expression.
3. For changed flows, compare **the LaTeX produced by actual editing**, not only a separately imported formula. Verify the expected JSON structure independently; a visually correct preview cannot excuse lost or misplaced model content.
4. Compare idle and focused states at 22px and 36px, with matching KaTeX display mode. Check baseline/relative positions, script and index size, fences/radicals, operator bounds, horizontal spacing, clipping and input-induced movement.
5. Retain the existing metric thresholds: font difference ≤ 0.1px, relative vertical-center difference ≤ 0.25em, active-position change ≤ 0.2em, and horizontal difference ≤ 0.25em where comparable anchors are defined. These proxies are not complete glyph-ink measurements. Add a check when a visible defect is outside the measured anchors; do not relax thresholds to hide it.
6. Review screenshots of changed notation. Reject obscured symbols, overlapping slots, clipped content or a position that suggests the wrong mathematical attachment, even if a measured probe passes. Record intentional differences for empty slots, focus backgrounds and caret hit areas. Exact pixel equality with KaTeX is not a milestone requirement.

Detailed comparison tables and screenshots stay in the source-only rendering ledger. Public guides describe supported behavior and limitations.

### Environments included in this milestone

- Automated editing and visual acceptance: desktop Chromium on macOS, with the recorded browser and font versions.
- Core surfaces: React block and native DOM block/inline. Smoke-check Pure JS, Web Component, Vue, Svelte and Solid wrappers for focus, option updates, independent instances and teardown; shared DOM passes alone do not certify wrapper lifecycle.
- Existing host configurations: Tiptap, ProseMirror, Lexical, Quill, Slate, TinyMCE inline host and CKEditor ClassicEditor in their current block/inline math demos; Editor.js and Gutenberg standalone in block mode. Run the relevant chain in each host that supports the operation.
- Editor.js host history is not configured in the current demo. Formula history is required; do not count host Undo as passed. Gutenberg RichText inline math and additional host configurations are outside this scope.
- English/Korean labels and custom-locale fallback must remain valid. Include a narrow desktop container to check clipping and suggestion placement, without claiming touch support.

### Closure rule

Close this milestone only when all six batches have executable coverage, the required checks pass on the candidate source, and no known in-scope content-loss, blocked-input, incorrect-structure or visual-attachment defect remains. Each result must identify its scenario, renderer/mode, source fingerprint and observed limitation. A test count alone is not completion evidence.

If a new defect is within this contract, fix and rerun before closure. If it requires a new notation family, platform or product, record it in the later queue instead of silently expanding the milestone. “Complete” refers to this bounded milestone, not all TeX or every device.

### Subsequent milestones

| Next stage | Work deferred from the current milestone |
| --- | --- |
| Platform validation | Safari, Firefox, Windows Chromium, real Korean IME, actual OS/application clipboard exchange, touch/mobile input and screen-reader verification. The earlier deferral of real OS input testing remains explicit; synthetic checks do not replace it. |
| Library operating contract | Versioned JSON migration/recovery, measured document-size/depth and performance budgets, supported host-version policy and broader installed-host configurations such as TinyMCE iframe and WordPress admin. |
| Demand-led expansion | Additional LaTeX environments/style declarations, reviewed language packs, new editor integrations and optional radial suggestions. Require a concrete input/editing use case first. |

Full TeX documents, arbitrary macros/packages, symbolic computation, collaboration and a paper-writing service are separate products or projects. They are not required to finish this editor milestone.

## Historical implementation records

The following entries preserve past decisions and dated evidence. Use the completed milestone and subsequent milestones above for current scope.

## Direct selection shortcuts — workspace, 2026-09-13

Implemented immediate range wrapping for `(`, `[`, `{`, `|`, `/`, `^` and `_` in both renderers. Selection content, script/fraction caret placement and one-step Undo use the existing model operation. Other characters still replace selections. Unselected input and literal text retain their current behavior.

Validation: EDIT-033 passes 63 cases / 510 checkpoints; geometry passes 91 formulas / 330 combinations after correcting fraction sizing and spacing. EDIT-019 still passes 17 targets / 499 checkpoints.

EDIT-033 adds a repeatable browser suite for keyboard, native and dragged selections. VIS-080–093 add block/inline KaTeX position comparisons for the resulting formulas. Continue running editing and rendering checks together when shortcuts or notation change. Ambiguous keys such as `<` (relation, angle bracket, arrow prefix) and word commands such as `sqrt` remain suggestions.

## Current focus: continuous editing — workspace, 2026-09-10

The rendering pass is now the maintenance baseline. Further contour refinement
is deferred; keep existing checks when notation or layout changes.

EDIT-019 now runs through keyboard input, range wrapping, radical conversion,
matrix input, five-step Undo/Redo, empty-root deletion and restoration, then a
second typing/history chain without resetting the editor. React standalone block
plus Quill/Tiptap/ProseMirror/Lexical/TinyMCE/CKEditor/Slate in-place block/inline and
Editor.js/Gutenberg block pass (17 targets, 499 checkpoints). Host checks verify unchanged draft data,
Save, reload/Restore, re-edit and Cancel. One-step host Undo/Redo passes where
configured; the Editor.js demo has no host history integration. Inline also
checks Enter commit without new paragraphs, right-boundary exit and prose
continuation at the correct host position.

Run `pnpm --filter @barocss/math-editor test:editing`. Timestamped reports include
checkpoints, browser scope, fixture copy and source fingerprints. The Tiptap sample now separates document Restore from subsequent typing in host history;
TinyMCE now keeps empty formulas visible with a localized placeholder. Its
block/inline checks use an inline TinyMCE host; classic iframe mode is separate.
All nine integration demos now pass this chain. Gutenberg uses the standalone
provider demo; WordPress admin and other host configurations remain separate.
Next: range clipboard and populated/grid deletion sequences. Real OS IME
and clipboard remain deferred; this is not a release-wide certification.


## Named-function and fraction spacing — workspace, 2026-09-10

Named functions and fractions now share horizontal spacing with adjacent text.
Repeated functions, parentheses after functions, products of functions and
repeated fractions have paired editor/KaTeX comparisons. Named-function thin
spacing remains in first and nested exponents. Fixed function glyph padding and
fraction outer margins no longer accumulate across these expressions.

Next: the remaining wrapper atom classes, longer mixed expressions, explicit
spacing commands, and full painted-bound comparisons. Passing selected anchors
does not imply whole-expression pixel equality.


## Contextual operator layout — workspace, 2026-09-10

The shared model-to-presentation pass now distinguishes display, text, script and
scriptscript operator contexts. React and DOM use it for small glyphs, nested
bound sizes and automatic side limits. Explicit limits remain supported.

New comparisons cover numerator/denominator operators, one/two levels of
superscripts, an operator inside another bound, inline/text fractions and an
explicit stacked inline integral. Full ink alignment, all multi-operator mixtures
and narrow-host/cross-browser checks remain separate work.

## Radical and parenthesis outlines — workspace, 2026-09-10

Root strokes and short/tall parenthesis contours now use KaTeX-derived SVG masks.
Tall parentheses retain bounded end caps and extend the straight middle. The
package includes these assets with their provenance and existing KaTeX MIT notice.
This removes the old radical polygon without adding a KaTeX runtime dependency.

Full KaTeX size-variant selection, vertical brace silhouettes, operators inside
scripts and cross-browser geometry remain separate work. The renderer continues
to reserve its existing editing boxes and caret hit areas.

## LaTeX compatibility and nested-root layout — workspace, 2026-09-10

- Fixed math-mode literal caret/tilde export while retaining text-run JSON semantics.
- Protected complex optional root indices during export; all 55 structure kinds
  now have KaTeX render and JSON round-trip regression checks in that slot.
- Added clearance between nested radical rules and a browser gap measurement.
- Still open: radical hook outlines, fence ink geometry, operators inside scripts,
  explicit style combinations, broader interaction sequences and other browsers.

These are workspace changes. Browser evidence remains in the source-only rendering
ledger; a metric PASS does not mean complete visual parity or release certification.

## Editing utilities — workspace, 2026-09-09

Included in 0.4.0:

- Native lexical-token input now matches rich React colors and offsets. Token-boundary navigation/deletion preserves surrounding text; composition retains the input until commit.
- Explicit LaTeX insertion at the caret or range, exposed as `pasteLatex`, More tools → Paste as LaTeX, and Alt+Shift+V. Parsing/placement failures preserve the document. Ordinary paste stays literal.
- Recent symbols/templates and favorites, with a shareable validated preference store. Preferences are separate from formula history; persistence belongs to the host.
- Contextual fence, fraction/binomial size, and operator-bound placement controls. Existing contents, IDs and caret are preserved with one-step Undo.

See [API and usage](API-SESSION.md#editing-utilities--workspace). No new LaTeX grammar or automatic algebraic transformation is added. Persistent vertical columns, broader browsers, performance budgets and accessibility remain open.

## Scoped style customization — workspace, 2026-09-09

Implemented: inherited CSS variables for UI/token colors, slot backgrounds,
controls, toolbar density and floating menus. Both renderers retain per-editor
palette values on suggestion/selection portals and follow live ancestor theme
switches. Shared plugin panels/actions use the same palette; persisted host
formula sizing remains document data. The site includes default/dark/monochrome,
base-size and compact-spacing controls. See [Styling & themes](STYLING.md).


## Selection-to-caret keyboard behavior — workspace, 2026-09-09

A visible wrapping menu owns Up/Down in both renderers. The selected formula
stays selected while the highlighted suggestion changes; Enter applies it.
Left/Right returns to the ordered start/end of the selection. Shift+arrows
continues to adjust the range. Alt+Up/Down remains supported. When the wrapping
menu is closed, plain arrows restore the caret without changing the formula.

## Matrix rectangles and transpose — workspace, 2026-09-09

Both editing surfaces now distinguish cross-cell rectangles from text selection
inside a cell. Drag between cells or Shift+click to select a rectangle. Select
cells starts keyboard selection; Shift+arrows changes the focus corner. Copy/cut
preserves nested formula trees; paste accepts matching rectangles or grows from
a single cell within 20 × 20. One copied cell can fill a rectangle. Ragged TSV,
invalid clipboard data, mismatched shapes and oversized results are rejected
without changing the formula. Delete clears cells; Enter/Escape resumes editing.

Transpose matrix moves the entire matrix, preserving cell IDs, nested caret,
delimiters and one-step Undo. No numerical evaluation or new LaTeX grammar is
introduced. See [the API contract](API-SESSION.md#matrix-cell-selections) for payloads
and paste rules. Real OS clipboard and touch selection remain separate checks.

## Native toolbar and selection parity — workspace, 2026-09-09

Included in 0.4.0: More tools exposes searchable All symbols,
templates, matrix/identity presets and symbol shortcuts. The active grid toolbar
offers matrix row/column operations and delimiter changes, with row operations for
aligned/cases. External toolbar handles now expose `setDisabled` alongside
`setSession` and `destroy` for composition and draft lifecycle coordination.

Native selection highlights now preserve partial text endpoints. A drag can begin
inside the active input and continue across structures as a model range. Shift+arrow
model ranges are already implemented; vertical range extension uses logical line
offsets. The new work does not add LaTeX syntax.

Remaining work includes persistent vertical preferred
columns, and wider browser/accessibility coverage. English/Korean remain the complete
bundled locale packs; additional complete packs remain open. Native OS IME validation
is still deferred at the user's request. See [renderer parity](ADAPTERS.md#current-renderer-parity)
and [validation](VALIDATION.md) for the current boundary and evidence.

## Remaining LaTeX priorities: workspace review, 2026-09-08

These are proposals, not accepted import syntax. Complete each feature through the model, parser, exporter, suggestions and both editing surfaces before calling it supported.

| Order | Candidate syntax | Value | Required contract |
| --- | --- | --- | --- |
| 1 — implemented in workspace | `\lVert x\rVert`, `\left\|x\right\|` | Norms and vector notation | One-slot norm, scalable double bars, wrapping, aliases and round trips implemented; release remains open |
| 2 — implemented in workspace | `\iiint`, `\oint` | Multiple and contour integration | Operator variants with editable lower/upper/body slots and slanted bound placement |
| 3 — implemented in workspace | `\overbrace`, `\underbrace` | Annotated groups and derivations | Body/annotation model, script attachment policy and scalable braces |
| 4 — implemented in workspace | `\tilde`, `\bar`, `\dot`, `\ddot`, `\widehat`, `\widetilde` | Statistics, derivatives and estimates | Distinguish fixed and stretchy accents; nested editing and glyph geometry |
| 5 — implemented in workspace | `\nolimits`, `\limsup`, `\liminf` | Explicit operator placement and limit variants | Preserve placement metadata; migrate the current `limits: true` contract deliberately |
| 6 — implemented in workspace | `\,`, `\:`, `\;`, `\!` | Fine mathematical spacing | Bounded spacing kinds, negative-gap hit testing and canonical export; `\quad`/`\qquad` already work |
| 7 — four commands implemented in workspace | `\dfrac`, `\tfrac`, `\dbinom`, `\tbinom` | Common pasted formula compatibility | Preserve `mathStyle` metadata and explicit command export; general `\displaystyle` / `\textstyle` declarations remain open |
| 8 — implemented in workspace | `\mathbf`, `\mathcal`, broader `\mathbb` | Common mathematical alphabets | One-slot alphabet structures, bundled fonts, semantic colors and nested editing; decorative glyph coverage is Latin capitals |
| 9 — implemented in workspace | `\xrightarrow`, `\xleftarrow` | Labeled transformations and reactions | Two math-label slots, optional lower-label parsing, fixed arrowhead and expanding shaft; other extensible arrows remain open |
| 10 — `equation*` implemented; others open | `equation`, `align`, `split`, `array` | Broader imported equation layouts | Define numbering exclusions, alignment columns and normalization before adding environments |

Do not accept arbitrary macros, package loading, external resources or full TeX documents. Chemical formulas can use text, scripts and arrows; dedicated `\ce`/mhchem grammar and equation balancing are not supported.

Norms are implemented in the workspace. Triple and contour integrals are implemented in the workspace. Annotated over/under braces are implemented in the workspace. Six additional accents are implemented in the workspace. Operator placement, fine spacing and explicit fraction/binomial sizes are implemented in the workspace. General style declarations and further compatibility features remain open. Keep visual editing and atomic failure tests in the same change as parsing. Note inline editing is resolved according to the user. Further product integration is outside this math-editor release.

## LaTeX loader and Note integration — 2026-09-08

- Scope contract written in [LaTeX import/export](LATEX-SCOPE.md): bounded model grammar, explicit exclusions, diagnostics and acceptance gates.
- Core parser and saved-document validation: implemented and tested in the workspace; included in 0.2.0.
- Catalog/template and catalog-driven nested structure-pair round-trip checks pass. Explicit demo import and Note popup draft integration are implemented; product trial tests cover apply/cancel, persistence and source fallback. Wider platform testing remains open.
- Version 0.2.0 includes bounded LaTeX import. Do not advertise workspace imports as released support.

## Locale extension and cleanup — 2026-09-08

- Completed key-only translation lookup and shared editor path labels; removed source-text conversion and custom formatting callbacks.
- Added JSON French example, matrix-family aliases and NFC/combining-mark search. Language tests cover French, Japanese, Chinese, Arabic, Hindi and German without claiming complete language packs.
- Documented bundled en/ko versus host-supplied translations in [LOCALIZATION.md](LOCALIZATION.md). Complete reviewed third-language packs, RTL interaction and native OS IME testing remain open.
- Build now cleans its generated directory so deleted modules are excluded from packages.

## Locale keys and suggestion ranking — 2026-09-08

- Completed English semantic keys in all library/demo JSON packs and static UI call sites. Catalogs and renderers now use keyed messages and named parameters; source-text conversion and formatting hooks have been removed.
- Matching literal symbols now precede structural/template candidates. `/` selects `÷` by default; choose the following Fraction candidate to create a fraction. Relative ordering and uppercase Greek preference remain stable.

## Composition and maintainability — 2026-09-08

| Work | Status | Next gate |
|---|---|---|
| Source/CSS formatting and behavioral comments | Implemented | Continue splitting renderer internals when their behavior is unified |
| React/native toolbar extraction and host action slot | Implemented | Contextual tool catalog shared across both renderers |
| JSON locale packs, named templates, regional fallback | Implemented | English semantic JSON keys completed; complete third-language packs |
| Independently mounted editor/toolbar/LaTeX/preview | Implemented | Framework component conveniences only if real hosts need them |
| Host Enter/commit/cancel contract and modal suggestions | Implemented | Product selection/undo integration and real IME/browser matrix |
| Layout lab: inline, next-block flow, popup draft/cancel/apply | Implemented | Integrate the actual Note node view first |
| Note/Word/Site/Slide persistence adapters | Note workspace popup trial implemented | Validate other browsers and real host caret/undo workflows; Word/Site/Slide adapters and OMML conversion remain open |
| Reusable library SVG/PNG output | Not implemented | Dedicated renderer/export contract, fonts and scaling; the website already provides sized PNG download/copy from its preview |

See [Embedding](EMBEDDING.md) for existing Note/Word model boundaries. Note has a popup integration trial. The user confirmed that Note inline editing is resolved. This release focuses on math-editor; product-specific validation is tracked separately.

## Integration progress — 2026-09-07

| Work | Status | Remaining gate |
|---|---|---|
| Framework-free session / public commands | Implemented | Host-wide undo integration, performance and document validation |
| Native DOM surface / pure JS entry | Integration preview | Native discovery/context tools and precise pointer ranges implemented in workspace; token-level input/color is implemented; wider composition coverage remains |
| Web Component / Vue / Svelte / Solid / React native wrappers | Implemented | Wider framework-version matrix and SSR/hydration strategy |
| Optional and separately mounted toolbar | Implemented in native surface | Symbol browser, templates/presets and grid context controls added in workspace; broader context grouping and user customization remain |
| Inline single-top-level-line policy | Implemented in native surface | Real product prose integration, baseline/keyboard exit UX |
| External locale dictionary / aliases / fallback / direction | Implemented | Complete extra language packs and RTL audit |
| ESM subpath distribution / optional framework peers | Implemented | Release approval, registry publication, bundle budgets |
| Rich React renderer remains available | Preserved | Move main export only after measured parity |

Next integration work: verify the new active-input parity across more browsers, extend browser/accessibility coverage, and measure load/typing cost in host products. The native symbol panel, precise range highlights, active-input cross-structure drag and Shift+arrow model selection are implemented in the workspace. Note inline editing is already resolved. Do not add new notation to both renderers independently before shared behavior is stable. See [adapter parity and API](ADAPTERS.md).

## Delivered baseline

- Korean/English library UI and demo; bilingual search aliases in both modes.
- Native input at the active token, passive expression rendering, lexical role colors and composition-aware suggestions.
- The original structures plus combined scripts, indexed roots, accents, binomials, limits, literal/upright text, independent fences, annotations, spacing and double integrals; multiline documents, aligned equations, cases and editable matrices.
- Model ranges, balanced copy/cut/paste, wrapping, undo/redo and LaTeX export.
- Identity/zero matrix presets, column vectors and editable formula templates.
- A demo-only KaTeX rendering view and automated model/Chromium regression tests.

## Priority 1 — Reliable editing and integration

| Work | Acceptance criteria |
|---|---|
| Real input-method matrix | macOS and Windows Korean composition, cancellation, blur and locale change preserve text and commit once; currently deferred by user request |
| Keyboard model ranges — implemented | Shift+arrows extend/collapse across text and structures; typing replaces selection; wider browser/IME coverage and pixel-column vertical extension remain |
| Structural navigation — implemented in workspace | Shared React/native Up/Down movement for fractions, scripts, indexed roots and operator slots; nearest rendered horizontal caret, inner-structure precedence and matrix columns covered by model tests. Persistent preferred-column state and wider browser coverage remain open |
| Saved-document validation | Shape/duplicate-ID validation is implemented; version migration and host recovery remain |
| Host session adapter | Enter/exit and save work in one target product; a single coherent undo path across host and formula |
| Browser/accessibility coverage | Safari, Firefox and Windows Chromium; screen-reader names and suggestion announcements; touch selection and narrow layouts |
| Performance budget | Agree supported document size/depth; benchmark typing, selection, paste and 100-step undo before optimizing |

## Priority 2 — More notation

See the [LaTeX editing guide](LATEX-GUIDE.md) for supported examples and the next implementation order.

| Feature | Current status | Remaining work |
|---|---|---|
| Combined superscript/subscript | Implemented in workspace | Wider browser/IME validation and release |
| Literal text and 19 named functions/custom names | Implemented in workspace | Mixed text/math and styled text remain excluded |
| Indexed roots | Implemented in workspace | Wider nested-layout/browser validation and release |
| Vectors, hats and overlines | Implemented in workspace | Wider layout/browser validation and release |
| Binomials | Implemented in workspace | Implemented and Chromium-tested; wider browsers and release remain |
| Limits | Implemented in workspace | Approach slot and dedicated operator placement; `lim` is not in the current function catalog |
| Additional delimiters | Implemented in workspace | Independent left/right metadata, mixed and invisible ends |
| Over/under annotations | Implemented in workspace | Implemented and Chromium-tested; wider browsers and release remain |
| More templates | Ongoing | Deterministic builders, localized discovery and one-step undo |

## Priority 3 — Interchange and richer grids

| Feature | Acceptance criteria |
|---|---|
| Subset LaTeX import — implemented in workspace | Extend the documented grammar incrementally; preserve unsupported input without changing the existing formula |
| Rectangular cell selection — implemented in workspace | Cross-cell drag, Shift+click, keyboard expansion, shape-checked copy/paste, clear and one-step Undo; external clipboard/touch validation remains |
| Matrix transformations — implemented in workspace | Delimiter changes and full-matrix transpose preserve cell contents, nested caret and Undo; selected-submatrix transforms and numeric computation are not included |
| Drag matrix size picker | Accessible keyboard equivalent, touch behavior, 1–20 bounds and one-step insertion |
| Multi-alignment and multiline wrapping | Explicit grouping semantics; do not flatten lines or move relation signs unexpectedly |
| External clipboard compatibility | Verify custom-format survival and LaTeX fallback across target browsers and applications |

## Later, only with product requirements

Declared variables/constants, stable symbol references, binding scopes, computation, collaborative editing, and server persistence are distinct systems. Do not infer that lexical colors or a quadratic formula template already provide these capabilities.

## Definition of done for each addition

1. State the supported input and its exact output/caret behavior.
2. Preserve IDs outside edits, regenerate inserted identities and support one-step undo for structural actions.
3. Cover Korean/English UI, aliases, accessibility labels and composition interaction.
4. Verify deterministic model transformations and representative real browser interaction.
5. Render the supported LaTeX with KaTeX and compare it with both rich React and native editing surfaces. Inspect passive and focused states, empty/populated slots and nested examples. Adjust glyph shapes, baselines, script sizes, spacing and caret-induced movement before marking the feature complete. Record intentional editing-space differences and unsupported cases.
6. Update the support table, README and implementation notes with actual behavior.

### 2026-09-08 — Framework API documentation

Added dedicated Pure JavaScript, React, Web Component, Vue 3, Svelte and Solid guides,
plus the shared session/DOM API reference. Guides document the 0.2.0 APIs and distinguish them from
future options, describe mount-only versus mutable settings and explain
persistence, ownership, cleanup and renderer parity. React/Solid examples type-check;
Vue/Svelte complete examples compile; the 19-page HTML documentation build and new-guide
cross-document/heading links are verified. Website publication is documentation-only;
the npm version and deployed runtime artifact are unchanged.

### API guide practical examples (2026-09-08)

- Added isolated JavaScript/React modal drafts with Apply/Cancel, React session history, Vue document switching, Svelte 5 runes, Solid history/templates, Web Component form submission, and shared debounced browser storage with restore/error handling.
- Verified React/Solid/storage TypeScript, Vue/Svelte compilation, Chromium modal/form/storage behavior, documentation links and demo production build. Server persistence remains host-owned; examples use published 0.1.0 APIs.

### Combined scripts — workspace implementation

- [x] Shared `scripts` model: `[base, subscript, superscript]`, JSON validation and LaTeX export.
- [x] Both LaTeX script orders, nested placement, duplicate-script diagnostics.
- [x] React/native rendering, completion from an existing script, Tab traversal and empty-side deletion.
- [x] Include this addition in the 0.2.0 release.

### Text and function notation — workspace implementation

- [x] Literal text node, escaped LaTeX interchange, text-only slot validation and editing.
- [x] Editable operator-name node, 19 standard functions, custom names and scripts on function names.
- [x] Shared suggestions, English/Korean messages, native/React editing and round-trip checks.
- [x] Indexed roots with two slots, selection wrapping, literal typing and empty-index deletion.
- [x] Vector, hat and overline accents with editable bodies and selection wrapping.
- [x] Additional delimiters, mixed/invisible ends and overset/underset annotations.
- [x] Over/under brace annotations with editable annotation/body slots.
- [x] Explicit side-placement import/export (`\nolimits`) and contextual toolbar placement controls.

- [x] Workspace: `limit` condition/body model, LaTeX import/export, localized suggestions and React/native editing.
- [x] Semantic function color for named/custom operators and the limit glyph.

### Workspace: imported notation compatibility

- Implemented `quad`/`qquad` as zero-slot spacing nodes, including suggestion insertion and deletion/Undo.
- Preserved explicit `limits: true` on sum/product/integral/limit nodes through import/export.
- Implemented one-slot `roman` groups: scoped `\rm` declarations normalize to `\mathrm{…}`. Parsing restores the enclosing expression boundary after nested groups.
- Regression fixtures include the reported quotient limit with Chinese text, the three-sum inequality and the chain-rule derivative.

- Implemented in workspace: double integrals (`\iint`), localized suggestions, domain/bounds/body editing, explicit limits preservation, and regression coverage for the reported mean-value equation.

## Latest presentation status — 2026-09-08

Completed in the workspace: scalable fences and radicals, slanted integral side bounds, visible absolute bars, aligned script bases, lining numerals, borderless token focus, 117 symbols including 31 arrows, substring discovery and all-direction `-`/`->` suggestions. See [validation](VALIDATION.md) for the targeted Chromium checks. Full browser/accessibility coverage, native/rich React interaction parity, product-specific integration validation remain separate.

## Spacing audit follow-up — 2026-09-08

Seven rich React/KaTeX comparisons are complete; production fixes are pending. Prioritize grid delimiter shapes, nested fraction/script sizing, script separation, grid row spacing and accent clearance, then reduce the measured 20px first-boundary focus expansion. See [the comparison findings](VALIDATION.md#editor-versus-katex-spacing-audit--2026-09-08). Repeat the revised layouts in native DOM and test active inner slots before marking the work complete.

Spacing follow-up implemented: shared grid fence shapes, tighter grid/fraction/script/accent layouts, bounded nested fraction sizes, and a smaller boundary focus target. Chromium import/edit checks pass; the measured first-boundary expansion fell from 20px to 8px. Full recursive math-style sizing, additional browser/accessibility checks and eliminating all cursor-induced movement remain open.

Workspace toolbar overflow is implemented: configurable structure-button limits and More/Fewer controls, rich React/native filtering, and always-visible history actions. Native symbol/template discovery and grid context controls are also implemented as described above. Broader context-sensitive grouping and user-persisted toolbar customization remain future work.

Locale regression: misplaced alphabet/arrow messages moved inside `messages`; pack-shape/build validation and en/ko browser coverage added.

### 0.2.1

Keyboard model selection with Shift+arrows and `{` cases discovery are implemented. The dedicated demo adds sized PNG download/copy and fit preview; image generation remains site-only. Pixel-column vertical selection remains future work. Matrix cell rectangles and transpose are implemented in the workspace; aligned/cases retain structural ranges.

## Tiptap / ProseMirror integration preview (2026-09-08)

A separate private development package, `packages/math-editor-integrations`, now
provides Tiptap 3 and ProseMirror 1 math nodes using the existing DOM editor. It
supports direct editing in the text flow, optional panel editing, JSON/LaTeX storage,
HTML clipboard round trips, Apply/Cancel, and host Undo. The sample runs from
`apps/math-integrations` at port 5185.

As of 2026-09-09, the integration preview covers nine hosts in one sample page.
Site staging includes `/integrations/` and rendered integration documentation.
The shared source package stays private; nine host-specific npm packages have
separate Changesets and artifact preparation. The release set is core `0.4.0` and plugins `0.1.0`. The
core and all nine plugins now use MIT, with a LICENSE file in each package.
Plugin publication remains pending. See the [integration roadmap](../math-editor-integrations/ROADMAP.md),
[validation record](../math-editor-integrations/VALIDATION.md), and
[release guide](../math-editor-integrations/docs/RELEASING.md).

## Radical conversions — workspace, 2026-09-09

Implemented contextual square-root/indexed-root conversion suggestions in React
and native DOM. The radicand tree and IDs are retained; conversion adds a selected
index `2`. Square-root conversion accepts only an empty index or `2`. Changes
participate in normal Undo/Redo and use English/Korean locale messages. Other
structure conversions are not included in this step.

## Editing scenario register — workspace, 2026-09-09

[Editing scenarios](EDITING-SCENARIOS.md) defines EDIT-001 through EDIT-020,
expected behavior, test mappings, environment scope and a run-record template.
It distinguishes historical evidence from current verification. The EDIT-019
sustained chain and source-fingerprinted runner were added on 2026-09-10. Other
scenario assertions and CI/release enforcement remain separate work.

## Rendering regression baseline — workspace, 2026-09-09

[Rendering checks](RENDERING-TESTS.md) now defines executable size and position
comparisons for fractional exponents/subscripts and a tall indexed-root base.
React and native DOM share compact script-fraction rules. Empty non-grid slots
now remove their wrapper with Delete or Backspace and retain other content.
Next: paired scripts, multi-line collision, explicit style overrides and other
notation families. Current checks do not implement an automated CI release gate.

## Contextual structure footer — workspace, 2026-09-09

Added query-independent radical actions, index editing, disabled explanations,
F6/Escape access and embedding opt-out. EDIT-021 through EDIT-028 extend the
scenario register with discovery, target, focus, locale, composition guard and
lifecycle cases. Future work: context actions for additional structure families,
explicit Tab-order assertions and broader framework/device coverage.

## Inline-first fence transformations — workspace, 2026-09-09

Implemented eight fence presentations through the existing suggestion list,
Alt+Down discovery/reopening, nearest-wrapper targeting, retained caret/content
and one-step conversion history. Optional footer controls support F6 and horizontal
navigation. EDIT-029 through EDIT-032 add keyboard, cancellation, iframe, locale
and no-toolbar coverage. Additional transformation families and the proposed
optional radial menu remain future work; the list layout remains the default.

## Horizontal text spacing — workspace, 2026-09-10

Replaced fixed inter-token gaps with shared binary/relation/punctuation spacing,
including unary-sign context and compact script rows. Removed per-token padding
from mathematical glyph measurement. Empty expression inputs remain available;
inactive structural caret boundaries are narrower. VIS-066 through VIS-073 add
addition, equality, unary signs, parentheses, named functions, fractions,
punctuation and script comparisons at 22 px and 36 px in React and native DOM.

Next: longer expressions, complete atom classification across structure wrappers,
named-function boundaries, explicit spacing commands and browser font differences.
The source-only rendering ledger records measured limits and remaining work.

## Text editor integrations — 2026-09-13

- Implemented: optional direct LaTeX completion and caret preview for the three browser adapters; keyboard template navigation and source-preserving command insertion.
- Implemented: grouped Examples navigation and per-example installation, usage and guide links.
- Remaining: VS Code native source completion, wider platform/assistive-technology validation, and custom TeX dialect completion.

- Implemented: shared LaTeX source-range discovery and draft popup; separate CodeMirror 6, CodeMirror 5, and Monaco packages.
- Implemented: VS Code Edit Formula and Insert Formula commands, Webview UI, and VSIX build. VS Code 1.103.1 desktop command and Webview round-trip checks passed.
- Added: workspace-source examples, English/Korean popup messages, source conflict protection, unchanged-source preservation, and one-step host undo.
- Next: host syntax-tree resolvers for additional Markdown/TeX dialects, rebasing non-overlapping source edits, multi-caret policy, and broader VS Code platform QA.
- Separate project: typed WGSL/GLSL expression editing. No shader parser is used by these adapters.
- Publication: the four browser text packages are in the math release allowlist. The VS Code extension remains a separate release.

## Editing readability and navigation — 2026-09-14

- Added a configurable 14px editing minimum and extra line space for raised scripts.
- Corrected fraction descendant sizes, nested fence alignment and radical geometry in scripts.
- Added lexical/structural movement and selection: Ctrl+arrows, or Option+arrows on macOS, with Shift to select.
- Added 100/125/150% visual text-popup zoom; default 125%, with a saved browser preference.
- Documented a 26px editing base and optional 16px minimum for complex formulas. Output size stays separate.
- Remaining: exact glyph contours/spacing, the full updated rendering audit, cross-editor suggestion dismissal, and wider browser/platform checks. Focused browser checks are recorded in the source rendering ledger; historical all-suite PASS results are not evidence for the new size policy.
