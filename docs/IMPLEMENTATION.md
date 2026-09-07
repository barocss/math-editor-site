# Implementation guide

## Ownership and data flow

The host owns document persistence, placement and outer focus. `MathEditor` owns an editing session, its caret, composition draft, model range and up to 100 previous history states. Do not record each internal change into a second host undo stack without a session adapter.

A typical edit follows:

1. A native input event supplies text and UTF-16 selection offsets.
2. The editor maps those offsets from the active lexical token to its logical `MathText` run.
3. A pure model operation returns the next document and caret.
4. `commit` records the prior state; `publish` updates React and calls `onChange` for committed document changes.
5. A layout effect focuses the new active input and restores its local selection.

Navigation does not create a document history entry. Locale changes do not remount the editor. `defaultValue` is deliberately mount-only.

## Source map

| Module | Responsibility |
|---|---|
| `model.ts` | Serializable types, constructors, basic insertion/unwrapping, text traversal, history and LaTeX export |
| `tokens.ts` | Lexical variable/numeric/symbol segmentation and boundary affinity |
| `math-editor.tsx` | Native input lifecycle, IME, pointer hit testing, selection UI, keyboard routing and portal |
| `range.ts` | Endpoint ordering, balanced selection resolution, slicing, insertion, wrapping and clipboard validation |
| `matrix.ts` | Innermost grid lookup, row/column changes, delimiters and grid navigation |
| `lines.ts` | Top-level line split/join and vertical navigation |
| `suggestions.ts` | Longest symbolic triggers, bilingual aliases, candidates and acceptance |
| `symbols.ts` | Glyph, message key, search aliases, symbolic triggers and LaTeX mapping |
| `templates.ts` | Fresh editable template trees and insertion through the range model |
| `math-editor-toolbar.tsx` | Rich React toolbar presentation and host action slot; no history ownership |
| `dom/toolbar.ts`, `dom/elements.ts` | Native command toolbar and safe element construction |
| `outputs.ts` | Independent LaTeX/preview subscriptions and cleanup |
| `enter-policy.ts` | Suggestion/grid/newline/host completion precedence |
| `locales/*.json` | Built-in translation data and parameterized message templates |
| `i18n.ts`, `editor-labels.ts` | Keyed dictionary lookup, fallback, interpolation and shared accessible editor paths |
| `symbol-browser.tsx` | Browse/search the shared catalog, preserve the math caret, isolate search clipboard/keyboard events |
| `style.css` | Mathematical layout, token colors, focus, range marks and tools |
| `apps/math-demo` | Language selector, examples, LaTeX text, copy action and KaTeX verification view |

## Presentation tree invariants

- Every row starts and ends with a text node. Structures have text boundaries on both sides.
- IDs address rows, structures and logical text runs. Clipboard insertion regenerates IDs; never reuse IDs for a pasted instance.
- Fractions have two slots; roots one; powers/subscripts two; delimiters one; large operators three (lower, upper, body).
- Matrices have a row-major slots array, a column count and one of six delimiter environments. Both dimensions are 1–20.
- Aligned equations and cases use the same grid machinery but always have two columns and 1–20 rows.
- `additionalLines` is a document-level concept. A nested `MathRow` is a horizontal expression, not a multiline document.

`structuredClone` is used for model changes. This is intentionally simple and has not been benchmarked for very large documents.

## Active-input rendering and composition

Passive tokens render as spans. Only the active token renders an input. A hidden text mirror supplies browser-shaped width and pointer offset measurements. Variable, numeric constant and symbol colors do not change the stored text. Logical text runs remain intact when the UI displays several tokens.

During composition, the token partition and input element are held stable. Suggestions are visible but disabled. Enter and arrows remain with the IME; parent handlers do not receive editing keystrokes. On composition end, the complete text is committed as one history change and tokenization resumes. Synthetic composition tests are not a substitute for actual OS input-method validation.

## Ranges and transformations

`MathRange` has anchor/focus points identified by logical text ID and UTF-16 offset. `resolveRange` orders them in document traversal order and finds the deepest shared row. Endpoints in different slots expand to a balanced common structure; endpoints on different document lines produce multiple row slices.

Pointer hit testing uses token rectangles and mirror text ranges. A drag inside the current input stays native until it leaves that field. A model selection suppresses the active input. Partial token marks reflect the actual selected substring.

`wrapRange` accepts one selected row and one of the supported wrapper kinds. It copies that balanced fragment into the new structure and replaces the range through `pasteFragment`. Fraction/power/subscript operations focus their empty second slot. Other wrappers leave the caret after the inserted structure. Power bases receive parentheses unless they are a simple name/number or an already grouped structure. This rule is not a precedence parser and does not infer algebraic equivalence.

The UI disables unsupported structural insertion while a model range is selected. Template insertion explicitly replaces the selection. Contextual wrap tools appear below the surface so their appearance does not move the expression during a drag.

## Clipboard boundary

Copies write a versioned `MathFragment` and plain-text LaTeX. `parseFragment` rejects oversized payloads (>200,000 characters), too many nodes (>10,000), excessive nesting (>40), more than 200 rows, invalid slot arities and invalid grid geometry. Valid insertion creates fresh IDs and preserves the destination prefix/suffix. Malformed custom data falls back to plain text when available.

External text is literal input, not executable HTML and not parsed LaTeX. Newlines produce top-level rows; a multiline insertion in a nested slot is rejected. Whole saved documents still require a future validator and version-migration policy.

## Localization

`locale` defaults to `ko` and is propagated through toolbar labels, slot accessible names, token descriptions, suggestions, matrix controls, status text and wrap tools. The portal has its own `lang` attribute. The demo separately translates surrounding copy and updates the HTML language/title.

Catalog labels and details are English message keys with explicit interpolation parameters. `translate` resolves JSON dictionaries with regional/base/English fallback. Accessible line, grid and slot paths are built by `editor-labels.ts`, shared by both renderers. `findSuggestions(text, caret, locale)` returns localized labels/details while preserving stable IDs, aliases and insertion payloads. English/Korean aliases remain available; localized names and registered aliases add discovery in the selected language. Never translate user-authored formula text or persist locale in the math tree.

To add a locale, register a JSON pack with message values and search aliases; no type union or renderer changes are needed. Translate host page copy separately, then test the full catalog and accessible names. See [LOCALIZATION.md](LOCALIZATION.md) for supported scope and examples. Custom host labels are translated by the host. A composition in progress must not be remounted when locale changes.

## Adding a symbol, template or structure

**Symbol:** add a catalog tuple with glyph, label, aliases, optional trigger and valid LaTeX. The catalog powers discovery and export. Prefer unambiguous triggers; existing `/`, `^` and `_` stay opt-in. Test longest-trigger ordering, alias acceptance, undo, and KaTeX output.

**Template:** construct fresh model rows, preserve text boundaries, register an ID/label/aliases, and insert through `pasteFragment`. Do not embed opaque LaTeX. Test ID independence, editing, clipboard validation, insertion/replacement and renderer output. The quadratic template is a presentation of the formula; it does not enforce `a ≠ 0` or compute roots.

**Structure:** extend `StructureKind`, constructors, slot labels, rendering/CSS, LaTeX export and clipboard arity validation together. Decide cursor order, deletion, range normalization and nested layout before exposing a button. Add model tests and browser input/undo tests. A new symbol glyph alone does not implement a new structural editing capability.

## Integration and testing

Use package exports in consumers, not source-path imports. Mount with a new key only when changing documents. Integrators must implement persistence, trusted-data validation, outer focus, and an explicit host/internal undo ownership contract.

Unit tests cover deterministic transformations and export. Browser tests exercise the active-input transition, navigation, drag ranges, clipboard events, wrapping, language switches and templates. Clipboard automation uses synthetic DataTransfer payloads; separate manual in-app checks exercised real copy/paste shortcuts. See [VALIDATION.md](./VALIDATION.md) for evidence and remaining platform limits.

## Line gutter and symbol discovery

The line gutter renders only for multiple top-level rows when `showLineNumbers` is enabled. Numbers are outside `MathRow` rendering, hidden from accessibility and unselectable; pointer events on the gutter do not start math selection. Deleting/joining rows derives the updated numbering from document order.

The symbol browser is a localized, searchable section, not a modal. It opens with search focus and lists the shared catalog in a scrollable grid. Native search input copy/cut/paste and keyboard events stop propagation to the editor. Choosing a glyph inserts through `pasteFragment` at the saved caret/range and closes the browser as one undoable change. Escape closes without changing the formula.

## Framework-neutral integration layer (2026-09-07)

`session.ts` owns immutable history snapshots, model ranges, command dispatch, locale and block/inline policy. It reports document mutations separately from caret or configuration notifications. `dom.ts` mounts a native view and one active logical-run input; the standalone toolbar subscribes to the same session. Destroy removes DOM, portal, event listeners and subscriptions. Framework wrappers only connect mount/update/cleanup; custom elements retain their session across disconnect/reconnect.

The existing React renderer still owns its original history and token-level input behavior. Shared document transformations do not yet imply shared renderer behavior. See [ADAPTERS.md](ADAPTERS.md) for exact lifecycle contracts, parity gaps and distribution entries, and [LOCALIZATION.md](LOCALIZATION.md) for external dictionaries. Inline policy is enforced at session mutations, load, paste and undo/redo boundaries, so a toolbar cannot accidentally introduce a second top-level row.

## Composition refactor — 2026-09-08

The math package and demo source/CSS are consistently formatted. The React toolbar and native toolbar were extracted without moving caret/history ownership. Comments explain composition identity, publication/save notifications and structural clipboard boundaries. Formatting is intentionally separate from changing the selection algorithms: the two renderer implementations are still present.

Output views subscribe to one session and skip caret-only redraws. Host completion is explicit (`onCommit`, `onCancel`, `onExit`) and independent of the single-top-level-line model policy. Popup drafts apply through a transaction, not a history-resetting load. See [Embedding](EMBEDDING.md) for the layouts, product-specific data mismatches and the next integration gates.
