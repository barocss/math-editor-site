# Math editor roadmap

This roadmap describes priorities, not release promises. The current package is an independent editing prototype. Production integration requires the reliability work below even if additional notation is implemented first.

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
| Downloadable SVG/PNG output | Not implemented | Dedicated renderer/export contract, fonts and scaling |

See [Embedding](EMBEDDING.md) for existing Note/Word model boundaries. Note has a popup integration trial. The user confirmed that Note inline editing is resolved. This release focuses on math-editor; product-specific validation is tracked separately.

## Integration progress — 2026-09-07

| Work | Status | Remaining gate |
|---|---|---|
| Framework-free session / public commands | Implemented | Host-wide undo integration, performance and document validation |
| Native DOM surface / pure JS entry | Integration preview | Rich React selection, catalog and composition parity |
| Web Component / Vue / Svelte / Solid / React native wrappers | Implemented | Wider framework-version matrix and SSR/hydration strategy |
| Optional and separately mounted toolbar | Implemented in native surface | Context-sensitive professional toolbar and symbol browser |
| Inline single-top-level-line policy | Implemented in native surface | Real product prose integration, baseline/keyboard exit UX |
| External locale dictionary / aliases / fallback / direction | Implemented | Complete extra language packs and RTL audit |
| ESM subpath distribution / optional framework peers | Implemented | Release approval, registry publication, bundle budgets |
| Rich React renderer remains available | Preserved | Move main export only after measured parity |

Next integration work: finish the native symbol panel and precise range highlights; unify token editing/composition behavior; add keyboard structural selection. Measure load/typing cost in host products; Note inline editing is already resolved. Do not add new notation to both renderers independently before shared behavior is stable. See [adapter parity and API](ADAPTERS.md).

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
| Keyboard model ranges | Shift+arrows extend/collapse across tokens and structures; typing replaces selection; undo restores a predictable caret |
| Structural navigation | Predictable up/down movement in fractions, roots and scripts; direction and selection affinity covered by tests |
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
| Rectangular cell selection | Row/column geometry, copy/paste shape rules, partial destination handling and undo |
| Matrix transformations | Transpose and delimiter changes preserve all cell contents and caret; no implicit numeric computation |
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
- [x] Explicit side-placement import/export (`\nolimits`); a dedicated toolbar switch remains open.

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

Workspace toolbar overflow is implemented: configurable structure-button limits and More/Fewer controls, rich React/native filtering, and always-visible history actions. Context-sensitive grouping and user-persisted toolbar customization remain future work.

Locale regression: misplaced alphabet/arrow messages moved inside `messages`; pack-shape/build validation and en/ko browser coverage added.
