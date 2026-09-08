# Implementation guide

See the [JSON model specification](JSON-MODEL.md) for required fields, exact slot order, invariants and persistence limits.


See [LaTeX → JSON model mapping](LATEX-MODEL.md) for node types, slot order and complete conversion examples.


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

The UI disables unsupported structural insertion while a model range is selected. Template insertion explicitly replaces the selection. Selection actions use the regular portaled suggestion list beside the selected range. Printable keyboard input replaces a model selection and focuses the resulting input.

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

### Workspace: binomial and operand suggestions

`binomial` has exactly two slots, upper then lower, and serializes as `\binom{n}{k}`. It shares validation, wrapping, navigation and undo with other structures. Operand suggestions carry `wrapOperand: true`, so acceptance preserves the query as a selected operand instead of deleting it. Both React and native DOM use the same acceptance function. In operand-only menus, bare Enter retains normal behavior until an arrow key selects an action.

### Workspace: limits and function colors

`limit` stores `[condition, body]` and exports `\lim_{condition}{body}`. Parsing accepts an optional lower condition and one body atom; missing slots stay editable. Repeated lower conditions and upper-limit syntax fail atomically. The React and native renderers stack the condition beneath the `lim` glyph, then render the body alongside it. Function names and `lim` use `--me-function` (default `#087b78`); nested slot tokens keep their own semantic colors.

### Workspace: imported notation compatibility

- Implemented `quad`/`qquad` as zero-slot spacing nodes, including suggestion insertion and deletion/Undo.
- Preserved explicit `limits: true` on sum/product/integral/limit nodes through import/export.
- Implemented one-slot `roman` groups: scoped `\rm` declarations normalize to `\mathrm{…}`. Parsing restores the enclosing expression boundary after nested groups.
- Regression fixtures include the reported quotient limit with Chinese text, the three-sum inequality and the chain-rule derivative.

### Workspace: fences, annotations and indexed-root rendering

Added curly/angle fences, open-closed and closed-open interval presets, generic fences with independent ends, and annotation/body nodes for overset/underset. Both renderers share the physical delimiter definitions. Selection wrapping retains the original expression and focuses the annotation when appropriate. Indexed roots now draw a radical that meets the overbar at the same coordinate, with the index overlapping its shoulder.

## Editing typography and focus: 2026-09-08 (workspace)

Active token inputs use a tinted background and caret without an outline or outer halo. Forced-colors mode retains its system focus outline. Toolbar, suggestion and surface keyboard-focus indicators keep their own rules. This changes presentation only; selection, clipboard and JSON/LaTeX output are unchanged.

Single-script slots use inline flex layout to avoid an extra line-box descent below the base. Passive boundary targets within script bases are 1px wide and expand when focused; text and single-script wrappers omit extra side margins. This aligns coefficients with the base and brings subscripts closer without removing editable caret positions.

The stylesheet bundles the MIT-licensed KaTeX Main font as `Barocss Math Glyphs`, scoped to ASCII digits and U+223C. Digits have consistent lining heights, and the similarity sign stays distinct from infinity. Other glyphs retain their existing font fallback. Consumers must ship the stylesheet's relative font asset and license.

### Workspace spacing refinement

Grid fences reuse the scalable parenthesis/brace masks. Grid gaps are 4px vertically and 12px horizontally with 3px/5px padding. Fraction/script/accent slots use flex boxes to avoid extra text-line descent. Nested fraction text is bounded at 16px and then 12px; this is a conservative local rule, not a complete TeX display/text/script style engine. Combined scripts keep 16px text with tighter line height. Active structural boundaries now use a 12px minimum; real empty slots retain their existing larger targets. Accent offsets and large-operator body spacing are reduced. These shared CSS rules apply to rich React and native DOM.

## Required visual check for notation changes

For every new mathematical feature or LaTeX syntax extension, compare the editor with KaTeX rendering of the same exported expression before completion. Check both rich React and native DOM, passive and active inputs, empty and populated slots, and representative nesting. Review delimiter/glyph shapes, baselines, script sizes, accent and limit placement, spacing, clipping and focus-induced movement. Adjust the editor as part of the feature, not as deferred visual polish. Preserve usable caret targets and document deliberate differences from KaTeX. KaTeX is a visual reference, not a parser-support contract or a pixel-equality requirement. Save comparison evidence and verify typing, navigation, deletion and Undo after layout changes.

Workspace norm support: one editable body, shared double-bar fences, `norm`/`노름`/`||` suggestions, range wrapping and LaTeX import/export. The parser accepts short `\lVert…\rVert` and scalable double-bar aliases; export uses `\left\Vert…\right\Vert`. Available in 0.2.0.

## Triple and contour integrals (workspace)

| Input | Model | Slots / behavior |
| --- | --- | --- |
| `\iiint_a^b{f}` | `tripleIntegral` | `[lower, upper, body]` |
| `\oint_C{f}` | `contourIntegral` | `[lower, upper, body]`; absent upper stays empty |

Search `iiint` / `삼중적분` / `∭`, or `oint` / `폐곡선적분` / `∮`. Tab visits lower, upper and body. Backspace after the structure unwraps its contents; Undo restores it. Both accept and preserve `\limits` for stacked bounds; default editing places bounds alongside the slanted glyph. Unbraced input consumes one body atom, as for existing integrals. `\nolimits` is supported in the current workspace. These are editable notation, not integration or path analysis. Contour glyphs use the bundled KaTeX Size2-Regular U+222E directly, with its native ring and slant. No pseudo-element strokes are added.

## Brace annotations (workspace)

| Input | Model | Slots |
| --- | --- | --- |
| `\overbrace{a+b}^{n}` | `overbrace` | `[annotation, body]` |
| `\underbrace{a+b}_{n}` | `underbrace` | `[annotation, body]` |

Type `overbrace` / `위중괄호` or `underbrace` / `아래중괄호`. The annotation is edited first; Tab moves into the body. Wrapping a selection preserves it in the body and focuses the empty annotation. Both slots allow nested math. The brace stretches across the body/annotation container. Backspace immediately after the structure unwraps its contents; Undo restores the structure.

The parser accepts a bare brace body and creates an empty annotation. Export always includes the corresponding `^{…}` or `_{…}`, including an empty annotation. Repeated annotation markers fail. An opposite-side script is handled as an outer ordinary script, not a second brace annotation. Slot order is annotation then body even for underbraces; this matches overset/underset. This workspace addition retains document version 1; older consumers must reject unknown structure kinds during validation.

## Compact and filtered toolbars (workspace)

Toolbars initially show up to eight structure buttons. More tools / Fewer tools toggles the remainder without changing the formula or history. Rich React also places matrix presets, templates and symbol shortcuts in the expanded section; Undo, Redo and `toolbarEnd` stay visible. Native toolbars contain structure buttons and history only and show a toggle when needed. The layout wraps naturally on narrow screens; this is not a guaranteed single-row toolbar.

```tsx
<MathEditor toolbar={['fraction', 'root', 'superscript', 'matrix']}
  toolbarMaxItems={3} />
```

```js
mountMathEditor(host, session, {
  toolbar: ['fraction', 'root', 'norm'],
  toolbarMaxItems: 2,
});
mountMathToolbar(toolbarHost, session, {
  kinds: ['fraction', 'root', 'norm'],
  maxItems: 2,
});
```

`toolbar: false` hides the toolbar. A structure array filters its structure buttons only: it does not disable those structures in suggestions, parsing or the model, and does not filter React's auxiliary template/symbol controls. `toolbarMaxItems` (independent toolbar: `maxItems`) is a nonnegative count; zero initially hides all structure buttons behind More. A sufficiently large count shows all selected structure buttons initially. Expanded state belongs to the mounted toolbar and is not saved in the math document. The rich React `toolbar` array and compact behavior are available in 0.2.0.

## Additional accents (workspace)

| Syntax | Model / appearance | Search |
| --- | --- | --- |
| `\tilde{x}` | `tilde`, fixed-width centered wave | `tilde`, `물결악센트` |
| `\bar{x}` | `bar`, short centered line | `bar`, `짧은윗줄` |
| `\dot{x}` | `dot`, one centered dot | `dot`, `위점` |
| `\ddot{x}` | `ddot`, two dots | `ddot`, `두점` |
| `\widehat{AB}` | `widehat`, body-width hat | `widehat`, `넓은모자` |
| `\widetilde{AB}` | `widetilde`, body-width wave | `widetilde`, `넓은물결` |

Each is a structure with a unique `id` and exactly one MathRow in `slots: [body]`. Empty and nested bodies are supported, including scripts and fractions. Import preserves the command spelling; export emits the same command with a braced body. Selection wrapping retains the original expression. Tab continues outside; Backspace after the wrapper preserves its body, and Undo restores it. `dot` can also match a multiplication symbol: choose Dot accent explicitly or search `위점`. `bar` remains distinct from the existing body-width `overline`. These additions are in 0.2.0 and do not evaluate derivatives or estimates.

## Limit variants and placement (workspace)

`\limsup_{n}{x}` and `\liminf_{n}{x}` use `limsup` / `liminf` structures with exactly `[condition, body]` rows. Search `limsup` / `상극한` or `liminf` / `하극한`; Tab moves from condition to body. They do not evaluate sequence limits.

All limit-family, sum/product and integral nodes accept a single `\limits` or `\nolimits` immediately after the command, before scripts. The optional `limits` field is now boolean: omitted means default, `true` is stacked placement, `false` is side placement. Both explicit values survive JSON validation, copying and LaTeX export. Repeated/conflicting directives are rejected. Existing `limits: true` remains valid; older package builds do not accept `false` or the new limit kinds.

Placement is currently selected through imported LaTeX/model metadata, not a dedicated toolbar switch. Imported side conditions remain editable; normal limit suggestions use default placement. This is 0.2.0 functionality.

## Fine mathematical spacing (workspace)

| LaTeX | Node type | Width | Suggestion search |
| --- | --- | --- | --- |
| `\,` | `thinSpace` | 3mu / 1⁄6em | `thinspace`, `얇은간격` |
| `\:` | `mediumSpace` | 4mu / 2⁄9em | `mediumspace`, `중간간격` |
| `\;` | `thickSpace` | 5mu / 5⁄18em | `thickspace`, `두꺼운간격` |
| `\!` | `negativeThinSpace` | −3mu / −1⁄6em | `negativethinspace`, `간격줄이기` |

All four nodes have a unique ID and `slots: []`, like quad/qquad. Import/export preserve the exact command; ordinary source whitespace is still normalized. Insertion resumes immediately after the spacer. Backspace removes it and Undo restores it. Negative spacing uses a zero-width node with negative inline-end margin, not an overlay that intercepts pointer input. Click the adjoining text to edit; the spacer has no text slot. Plain punctuation remains literal and is not a spacing trigger.

Editor dimensions scale in script/limit slots. These are explicit gaps added to the editor's own token clearance, not a complete TeX math-glue or script-style suppression engine. Arbitrary dimensions (`\hspace`, `\kern`) and rubber-glue stretch/shrink remain unsupported. This is 0.2.0 functionality.

## Explicit fraction/binomial sizes

Reuse the existing two-slot structures with optional `mathStyle: 'display' | 'text'`. Validate metadata only on those two kinds, preserve it during model cloning, and choose the matching command at export. Suggestion presets carry `mathStyle` into insertion without duplicating toolbar structure kinds. React and DOM expose `data-math-style`; scoped size variables allow a nested explicit style to override its parent. Keep active inputs and passive tokens at the same size. General TeX style declarations are outside this implementation.

## Scoped math alphabets

`bold`, `calligraphic` and `blackboard` are one-slot structures validated by the document/clipboard codec. Both renderers use their generic structure path. Scoped CSS font variables keep inner alphabet choices independent of outer ones and leave structural glyphs unchanged. KaTeX font files live under `src/fonts` alongside their license. The parser retains the earlier five single number-set aliases to avoid changing stored symbol semantics.

## Labeled arrows

The `xrightarrow` and `xleftarrow` structures have two slots in upper/lower order. Parse the optional lower bracket before the required upper argument, then store in model order. Render the generic slots in three CSS grid rows, with a pseudo-element shaft and a fixed-size head in the middle row. Labels drive grid width; the decoration cannot intercept pointer events. These commands are inserted through the shared catalog and do not require a separate dialog.
