# Math editor roadmap

This roadmap describes priorities, not release promises. The current package is an independent editing prototype. Production integration requires the reliability work below even if additional notation is implemented first.

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
| Note/Word/Site/Slide persistence adapters | Not implemented | Versioned math payload, tex-only fallback, OMML conversion and host transactions |
| Downloadable SVG/PNG output | Not implemented | Dedicated renderer/export contract, fonts and scaling |

See [Embedding](EMBEDDING.md) for existing Note/Word model boundaries. The next concrete target is one real Note integration with a preserved host caret and one coherent undo path, not simultaneous schema replacement in all four products.

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

Next: finish the native symbol panel and precise range highlights; unify token editing/composition behavior; add keyboard structural selection. Then integrate one real inline host and measure load/typing cost. Do not add new notation to both renderers independently before shared behavior is stable. See [adapter parity and API](ADAPTERS.md).

## Delivered baseline

- Korean/English library UI and demo; bilingual search aliases in both modes.
- Native input at the active token, passive expression rendering, lexical role colors and composition-aware suggestions.
- Thirteen structure kinds, multiline documents, aligned equations, cases and editable matrices.
- Model ranges, balanced copy/cut/paste, wrapping, undo/redo and LaTeX export.
- Identity/zero matrix presets, column vectors and editable formula templates.
- A demo-only KaTeX rendering view and automated model/Chromium regression tests.

## Priority 1 — Reliable editing and integration

| Work | Acceptance criteria |
|---|---|
| Real input-method matrix | macOS and Windows Korean composition, cancellation, blur and locale change preserve text and commit once; currently deferred by user request |
| Keyboard model ranges | Shift+arrows extend/collapse across tokens and structures; typing replaces selection; undo restores a predictable caret |
| Structural navigation | Predictable up/down movement in fractions, roots and scripts; direction and selection affinity covered by tests |
| Saved-document validation | Reject malformed shapes and duplicate IDs; version migration and recoverable failure behavior |
| Host session adapter | Enter/exit and save work in one target product; a single coherent undo path across host and formula |
| Browser/accessibility coverage | Safari, Firefox and Windows Chromium; screen-reader names and suggestion announcements; touch selection and narrow layouts |
| Performance budget | Agree supported document size/depth; benchmark typing, selection, paste and 100-step undo before optimizing |

## Priority 2 — More notation

| Feature | Acceptance criteria |
|---|---|
| Combined superscript/subscript | One shared base, consistent script order, cursor navigation, clipboard and LaTeX round trip |
| Indexed roots and binomials | Editable root index / upper-lower entries; nested sizing, wrapping and deletion rules |
| Functions and logarithms | Named operators with proper LaTeX spacing and editable arguments; distinguish variable names from operators |
| Limits and derivatives | Explicit slots and approach notation; distinguish derivative structures from the existing ∂ symbol |
| Text in formulas and cases | Dedicated natural-language mode, escaping, localization-independent content, IME and clipboard support |
| Accents and annotations | Vectors, bars, hats and over/under braces with editable children |
| More templates | Deterministic model builders, localized discovery, one-step undo; no hidden computed values or false solver claims |

## Priority 3 — Interchange and richer grids

| Feature | Acceptance criteria |
|---|---|
| Subset LaTeX import | Define a grammar and supported environments; preserve unsupported input visibly instead of silently dropping it |
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
5. Render the supported LaTeX and document unsupported cases.
6. Update the support table, README and implementation notes with actual behavior.
