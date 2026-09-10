# @barocss/math-editor

See [Editing scenarios](EDITING-SCENARIOS.md) for stable scenario IDs, acceptance criteria, coverage gaps and per-run reporting.


An embeddable math editor for writing LaTeX-compatible formulas. Edit expressions in place, select existing math, and wrap it in fractions, roots, powers or delimiters. The package includes a framework-independent model, a rich React editor, and a native DOM editor with framework adapters.

This editor does not calculate, solve equations or parse arbitrary LaTeX.

## Packaging changes in 0.4.1

Each host plugin owns its source and version. Workspace apps import source without
a prerequisite build; npm consumers receive generated runtime and declarations.
The private common module is included in each plugin and is not installed separately.

## Editing additions in 0.4.0

The native renderer now edits one lexical token at a time, matching the main React field's role colors. New utilities provide **Paste as LaTeX** (Alt+Shift+V), **Recent & favorites** for symbols/templates, and contextual **bracket, fraction-size and limit-placement settings**. These utilities are included in 0.4.0. See [editing utilities and API](API-SESSION.md#editing-utilities--workspace).

## Packages

Choose the core package for a standalone math field. Choose one additional host package to embed that field in an existing editor. The host packages share the same math model, parser, suggestions and toolbar. Each requires the core and its own host SDK as peer dependencies.

| Package | Purpose | Formula placement | Release status |
| --- | --- | --- | --- |
| `@barocss/math-editor` | Math model, LaTeX import/export, editor, toolbar and framework adapters | Standalone, inline or multiline | MIT |
| `@barocss/math-editor-tiptap` | Tiptap node extension | Inline and block | MIT |
| `@barocss/math-editor-prosemirror` | ProseMirror schema, commands and node views | Inline and block | MIT |
| `@barocss/math-editor-lexical` | Lexical math node and registration | Inline and block | MIT |
| `@barocss/math-editor-editorjs` | Editor.js math Tool | Block | MIT |
| `@barocss/math-editor-tinymce` | TinyMCE plugin with in-place or panel editing | Inline and block | MIT |
| `@barocss/math-editor-ckeditor` | CKEditor 5 model objects and widgets | Inline and block | MIT |
| `@barocss/math-editor-quill` | Quill math embeds and registration | Inline and block | MIT |
| `@barocss/math-editor-slate` | Slate void elements and React rendering | Inline and block | MIT |
| `@barocss/math-editor-gutenberg` | WordPress Gutenberg math block | Block | MIT |
| `@barocss/math-editor-integrations` | Common data, draft UI, messages and styles; each host owns its plugin source | Internal development | Private; not an install target |

Install the core with each host plugin; the package manifests declare compatible peer versions. The core and all nine host packages use the MIT license, with copyright attributed to barocss.com. Each package includes its own LICENSE file. Host SDKs retain their own licenses.

Each host package exports its adapter, `/shared` helpers and `/style.css`. Load the core stylesheet as well. Gutenberg also exports `/data` for its stored-data codec. Install only the host package you use; there is no public all-host bundle. Formula placement, keyboard entry, history and clipboard behavior depend on the host.

Host guides: [Tiptap](https://math-editor.barocss.com/docs/integrations/tiptap.html) · [ProseMirror](https://math-editor.barocss.com/docs/integrations/prosemirror.html) · [Lexical](https://math-editor.barocss.com/docs/integrations/lexical.html) · [Editor.js](https://math-editor.barocss.com/docs/integrations/editorjs.html) · [TinyMCE](https://math-editor.barocss.com/docs/integrations/tinymce.html) · [CKEditor 5](https://math-editor.barocss.com/docs/integrations/ckeditor.html) · [Quill](https://math-editor.barocss.com/docs/integrations/quill.html) · [Slate](https://math-editor.barocss.com/docs/integrations/slate.html) · [WordPress Gutenberg](https://math-editor.barocss.com/docs/integrations/gutenberg.html).

The [unified host sample](https://math-editor.barocss.com/integrations/) includes all nine editors. During development, guides are served under `http://localhost:5184/docs/integrations/`, and the host sample runs on port 5185. Website deployment is separate from npm publication.

## Framework adapters in the core package

These are subpath exports of `@barocss/math-editor`, not separate npm packages.

| Environment | Import | Guide |
| --- | --- | --- |
| Model and sessions without a UI | `@barocss/math-editor/core` | [Session API](https://math-editor.barocss.com/docs/api-session.html) |
| Pure JavaScript | `@barocss/math-editor/dom` | [JavaScript](https://math-editor.barocss.com/docs/api-javascript.html) |
| React | `@barocss/math-editor` for the rich UI; `/react` for the native DOM surface | [React](https://math-editor.barocss.com/docs/api-react.html) |
| Web Component | `@barocss/math-editor/web-component` | [Web Component](https://math-editor.barocss.com/docs/api-web-component.html) |
| Vue 3 | `@barocss/math-editor/vue` | [Vue](https://math-editor.barocss.com/docs/api-vue.html) |
| Svelte | `@barocss/math-editor/svelte` | [Svelte](https://math-editor.barocss.com/docs/api-svelte.html) |
| Solid | `@barocss/math-editor/solid` | [Solid](https://math-editor.barocss.com/docs/api-solid.html) |

Each guide covers installation, document replacement, saving and lifecycle cleanup. See the [framework samples](https://math-editor.barocss.com/adapters.html) to try each environment, and the [JSON model specification](https://math-editor.barocss.com/docs/json-model.html) for the storage contract.

See [framework adapters and inline/custom toolbar integration](https://math-editor.barocss.com/docs/adapters.html), [custom locales](https://math-editor.barocss.com/docs/localization.html), and [progress / roadmap](https://math-editor.barocss.com/docs/roadmap.html). The new native renderer has explicit parity gaps; existing React consumers keep their current UI.

**Included in 0.4.0:** the native toolbar now includes searchable All symbols, templates, matrix presets and active-grid controls. Native ranges show exact partial-text highlights, and a drag can start in the active input and continue across structures. See [renderer parity](https://math-editor.barocss.com/docs/adapters.html#current-renderer-parity) for the remaining limits.

For editor-only, external toolbar, LaTeX, preview, inline and popup compositions, see [Embedding](https://math-editor.barocss.com/docs/embedding.html) and the [layout examples](https://math-editor.barocss.com/layouts.html).

## Quick start

Install version 0.4.1 from npm:

```sh
npm install @barocss/math-editor@0.4.1
# For the rich React UI:
npm install react react-dom
```

Import `@barocss/math-editor/style.css` once. Framework-free consumers use `/core` and `/dom`; each framework adapter has its own subpath. See [ADAPTERS.md](https://math-editor.barocss.com/docs/adapters.html).

To develop the package and demo from this monorepo:

```sh
pnpm install
pnpm --filter @barocss/math-demo dev
# http://localhost:5184
```

A workspace consumer should declare `"@barocss/math-editor": "workspace:*"`. Framework peer dependencies are optional; React consumers install React and React DOM (>=18).

```tsx
import { MathEditor, createMathDocument, type MathDocument } from '@barocss/math-editor';
import '@barocss/math-editor/style.css';

function Formula({ documentId, saved, save }: {
  documentId: string;
  saved?: MathDocument;
  save: (document: MathDocument, latex: string) => void;
}) {
  return (
    <MathEditor
      key={documentId}
      locale="en"
      defaultValue={saved ?? createMathDocument()}
      onChange={save}
      onExit={direction => console.log('Return focus to the host:', direction)}
    />
  );
}
```

| Prop | Contract |
|---|---|
| `defaultValue?: MathDocument` | Read on mount. Change the React `key` to open another document. This is not a controlled `value` prop. |
| `locale?: MathLocale` | Defaults to `ko`. Changes UI text without resetting the document or undo history. |
| `autoFocus?: boolean` | Start in the initial editable token. Defaults to `false`. |
| `enterBehavior?: 'newline' \| 'commit'` | `commit` calls `onCommit` on Enter after suggestions/selection handling; Shift+Enter retains normal row behavior. |
| `onCommit?()` / `onCancel?()` | Host draft apply/cancel callbacks. Escape dismisses suggestions first; composition reserves its own keys. |
| `showPopovers?: boolean` | Defaults to `true`. Set `false` while keeping the editor mounted in an inactive host tab; its undo history is preserved. |
| `toolbar?: boolean \| readonly StructureKind[]` | Show or filter rich React structure buttons; defaults to `true`. |
| `toolbarMaxItems?: number` | Initially visible structure buttons; defaults to eight. |
| `toolbarEnd?: ReactNode` | Host actions such as reset/save appended to the toolbar. |
| `showTokenLegend?: boolean` | Show lexical color guidance; defaults to `true`. |
| `showLineNumbers?: boolean` | Defaults to `true`. Displays UI-only line numbers when there are two or more top-level rows. Never included in the model, clipboard or LaTeX. |
| `label?: string` | Host-provided accessible group name; otherwise localized. Hosts translate their own custom label. |
| `onChange?(document, latex)` | Receives committed model changes and their LaTeX output. IME drafts are not published. |
| `onExit?(direction)` | Requests host focus restoration at an outer navigation boundary: -1 before, +1 after. |

## Suggestion ordering

Matching literal characters appear before editable structures and templates. For example, `/` offers `÷` then Fraction; `^` offers `∧` before the script structures; `sum` offers `+`, `±`, then the editable sum. To create a fraction, type `x/`, press Down once, then Enter. The same ranking applies to all adapters.

## Editing flows

Use **All symbols** to browse the complete symbol catalog without knowing a name in advance. Search by glyph, English/Korean name, alias or LaTeX command, then click to insert at the last caret or replace the model selection. Escape closes the browser. Search-field clipboard actions do not affect the formula. The workspace native toolbar exposes this browser through More tools.

- Type `x/`, choose Fraction, then Enter to enter its denominator. The literal `÷` candidate comes first. `/`, `^` and `_` remain opt-in suggestions, not immediate structural conversions.
- Type `matrix`, `identity`, `aligned` or `cases`, then choose a suggestion. Korean aliases work in both UI languages. In the 0.4.0 release, type `rows x columns` without spaces, such as `2x1`, `1x2`, `3x7` or `4x4`. Each dimension can be 1–20. Suggestions offer an empty matrix and a zero matrix; square sizes also offer an identity matrix. Uppercase `X` and `×` also work. Enter accepts a suggestion; Space or Escape keeps the typed expression.
- Type `30degree`, `30도` or `30각도`, then Enter to insert `30°` on the current line. `angle` inserts the separate symbol `∠`.
- Search `reals`, `integers`, `setminus`, `parallel`, or their Korean names. [The complete catalog](https://math-editor.barocss.com/docs/support.html) lists every symbol and alias.
- Use the template selector for zero matrices, column vectors, the quadratic formula and the Pythagorean theorem. Every part remains editable. Template insertion replaces a model selection if one is active; otherwise it inserts at the caret.
- Click text to edit it. Rich React activates one lexical token; the native renderer activates a whole logical text run. Only that active text mounts an `input`. Blur switches to preview. Escape closes suggestions first, then returns to preview.
- Drag to select math. The selection tools and main toolbar wrap it in a fraction, root, power, subscript, parentheses, brackets or absolute value. Fractions focus the denominator; powers/subscripts focus their new slot; roots/delimiters place the caret after the structure.
- Complex power bases receive parentheses. Existing structured delimiters are preserved. This is a conservative display rule, not symbolic algebra.

Variables, numeric literals and symbols use distinct colors. Classification is lexical: a letter named `c` or `e` is not automatically a declared constant. The model does not resolve names or binding scopes.

Native passive text preserves these lexical colors; its whole active run still uses one role color. Precise selection highlights do not change that input granularity.

## Keyboard reference

| Context | Key | Action |
|---|---|---|
| Suggestions | Up / Down, Enter | Choose and apply; IME composition reserves these keys for the input method |
| Any active slot | Tab / Shift+Tab | Traverse tokens and structural slots |
| Token boundary | Left / Right | Move into a neighboring token or slot |
| Fraction, scripts, indexed root or operator slots | Up / Down | Move to a related slot at the nearest rendered horizontal caret position |
| Top-level row | Enter | Split the row, unless applying a suggestion |
| Start of a later top-level row | Backspace | Join the previous row |
| Grid | Up / Down | Move to the same column in the adjacent row |
| Grid | Shift+Enter | Insert a row |
| Matrix | Shift+Space | Insert a column |
| Grid | Alt+Shift+Up | Delete the current row |
| Matrix | Alt+Shift+Left | Delete the current column |
| Aligned / cases | Enter | Insert a row, unless applying a suggestion |
| Just after a fraction/root/delimiter | Backspace | Unwrap, preserving contents |
| Outer grid edge | Backspace / Delete | Delete empty grid; select filled grid first, press again to delete |
| Preview surface | Cmd/Ctrl+A | Select the whole math document |
| Active input | Cmd/Ctrl+A | Select the current input text: a React token or native logical run |
| Editor | Shift+Left / Right | Extend or shrink the model range across text and balanced structures |
| Editor | Shift+Up / Down | Extend the model range across top-level lines using logical offsets |
| Preview surface | Enter / F2 | Enter editing |
| Model selection | Cmd/Ctrl+C / X / V | Copy / cut / replace with clipboard contents |
| Model selection | Backspace / Delete | Delete selection |
| Editor | Cmd/Ctrl+Z / Cmd/Ctrl+Shift+Z | Undo / redo |

Vertical arrows use the nearest inner structure before an enclosing grid, then fall back to another equation line. Paired scripts can move along their shared column; a base moves up to its superscript and down to its subscript. Visible suggestions retain Up/Down priority, including after Shift+arrow or drag selection. Enter applies the highlighted wrapper to the selected content; Left/Right restores the caret, and Shift+arrows adjusts the range. Composition, literal text and noncollapsed text selections do not trigger structural movement. React and native surfaces share this behavior.

The framework-free `moveVertical(state, direction, geometry?)` helper is exported from `/core`. Without rendered geometry, it selects the first text run in the target slot and clamps the current offset. At a lexical token boundary, rendered geometry distinguishes the previous token's end from the next token's start. Each move uses the current caret's horizontal position; a preferred column is not retained across repeated moves through shorter rows. Shift+arrow selection remains a separate operation.

## Selection and clipboard boundaries

A range within one row preserves partial text and balanced structures. Selecting across a numerator and denominator expands to their common fraction; cross-cell pointer selection now creates a matrix rectangle in the workspace. A structural `MathRange` still expands to the common matrix; rectangular editing uses the separate `MathMatrixRange` contract. Multiple document lines can be copied, replaced or deleted, but cannot be wrapped into a single structure.

Workspace native highlights now show the exact selected text endpoints. A drag inside the active input uses native text selection until it leaves the input; it can then continue as a model range across structures. These refinements are included in 0.4.0 and retain the same clipboard and balanced-structure rules.

Internal copies include `application/x-barocss-math+json` and plain-text LaTeX. Paste validates the custom payload and generates fresh IDs. Plain external text is inserted literally; newlines become top-level rows. Multiple-line paste into a nested slot is rejected without changing the document. If a destination strips custom clipboard formats, pasting back provides text rather than reconstructed math.

The demo's LaTeX Copy action exports source text; its separate sized PNG download/copy controls render the website preview. The library exports mathematical data and LaTeX, with no reusable SVG/PNG image-export API yet. Version 0.2.0 includes explicit bounded LaTeX import; see [the import contract](https://math-editor.barocss.com/docs/latex-scope.html). Ordinary clipboard text is still inserted literally.

## Model and package boundaries

`MathDocument` stores `version: 1`, a `root` row and optional `additionalLines`. Rows alternate text boundaries and structures; even an empty boundary is a valid caret address. LaTeX is an export format, not the editing source.

- Main export: model, React editor, navigation, matrices, range/clipboard operations, tokens, suggestions, templates, symbols and localization.
- `@barocss/math-editor/core`: all framework-free model helpers, sessions, suggestions and locale registration; no React dependency.
- `@barocss/math-editor/style.css`: explicit UI stylesheet using `me-` classes.
- KaTeX is a demo runtime dependency and a package test dependency; the library renderer does not require it.

Only pass trusted, well-formed saved documents to `defaultValue`. `parseFragment` validates clipboard fragments; use `parseMathDocument(json)` to validate persisted version-1 documents and reject duplicate IDs. Locale is host UI state and is not serialized in the math document.

## Source maintenance

Source, tests and CSS use the package Prettier configuration. `pnpm --filter @barocss/math-editor format:check` checks readability conventions. Toolbar presentation, output views, locale data and host Enter policy are separate modules; caret/IME invariants are documented at the event boundaries.

## Verification and next steps

```sh
pnpm --filter @barocss/math-editor test:run
pnpm --filter @barocss/math-editor type-check
pnpm --filter @barocss/math-editor build
pnpm --filter @barocss/math-demo type-check
pnpm exec tsc --noEmit -p apps/math-demo/tsconfig.tests.json
pnpm --filter @barocss/math-demo build
pnpm --filter @barocss/math-demo test:e2e
```

The demo consumes workspace source exports and does not require a package build. Release checks use `publishConfig.exports` and inspect the packed JavaScript and declarations. Browser tests use Playwright Chromium and start port 5184 if needed. Actual OS Korean IME tests remain deferred at the user's request.

- [Symbol / English / Korean name table](https://math-editor.barocss.com/docs/symbols.html)
- [LaTeX editing guide and upcoming notation](https://math-editor.barocss.com/docs/latex-guide.html)
- [Supported formulas, templates and full symbol catalog](https://math-editor.barocss.com/docs/support.html)
- [Implementation guide](https://math-editor.barocss.com/docs/implementation.html)
- [Validation evidence and limitations](https://math-editor.barocss.com/docs/validation.html)
- [Roadmap and acceptance criteria](https://math-editor.barocss.com/docs/roadmap.html)


## LaTeX loading (0.2.0)

```ts
import { parseLatex, createMathSession, initialState } from '@barocss/math-editor/core';

const result = parseLatex(String.raw`\frac{a}{b} + x^2`);
if (result.ok) {
  const session = createMathSession({ document: result.document });
  // For an existing session, apply(initialState(result.document)) replaces in one undo step.
} else {
  console.log(result.diagnostics); // Original UTF-16 positions; no partial document.
}
```

The shared contract is **editable structure ↔ exported LaTeX ↔ imported structure**, within the [documented limits](https://math-editor.barocss.com/docs/latex-scope.html). It covers the current structure and symbol catalog, not arbitrary KaTeX input. Failed imports never modify a session. Framework adapters do not implement their own parsers. Use source editing as a fallback in hosts.


During an existing edit, use `session.importLatex(source)` rather than resetting `defaultValue`: this preserves Undo/Redo and enforces inline policy. The rich React editor exposes `MathEditorHandle.importLatex` through `apiRef`; see [React import](https://math-editor.barocss.com/docs/api-react.html) and [shared session import](https://math-editor.barocss.com/docs/api-session.html). Both paths use the same parser and fail without a partial update.

Workspace presentation refinements include aligned script bases, lining numerals and background-only token focus. See [implementation notes](https://math-editor.barocss.com/docs/implementation.html#editing-typography-and-focus-2026-09-08-workspace), [supported notation](https://math-editor.barocss.com/docs/support.html) and the [remaining LaTeX priorities](https://math-editor.barocss.com/docs/roadmap.html#remaining-latex-priorities-workspace-review-2026-09-08). These changes are included in 0.2.0.

Workspace norm support: one editable body, shared double-bar fences, `norm`/`노름`/`||` suggestions, range wrapping and LaTeX import/export. The parser accepts short `\lVert…\rVert` and scalable double-bar aliases; export uses `\left\Vert…\right\Vert`. Available in 0.2.0.

Workspace: added triple and contour integral structures (`\iiint`, `\oint`) with parser/export parity, localized suggestions, editable bounds/body and explicit `\limits`. KaTeX comparison informed contour-glyph rendering. Available in 0.2.0.

Workspace: `\overbrace`/`\underbrace` support includes LaTeX parsing/export, localized suggestions, selection wrapping, editable annotation/body slots and scalable brace rendering. Available in 0.2.0.

## Compact and filtered toolbars (workspace)

Toolbars initially show up to eight structure buttons. More tools / Fewer tools toggles the expanded section without changing the formula or history. In the workspace native toolbar, More tools also reveals All symbols search, templates, 2×2/3×3/4×4 matrix and identity presets, and symbol shortcuts. More remains available even when all selected structures already fit. Undo and Redo stay visible; rich React also retains `toolbarEnd`. The layout wraps on narrow screens.

The workspace native grid toolbar follows the active caret. Matrices expose row/column insertion and deletion plus delimiter selection; aligned/cases expose row operations. Text or model selections disable row/column and delimiter mutations. The workspace adds Select cells, Select all cells and Transpose matrix in both renderers. These additions are included in 0.4.0.

```tsx
<MathEditor toolbar={['fraction', 'root', 'superscript', 'matrix']}
  toolbarMaxItems={3} />
```

```js
mountMathEditor(host, {
  session,
  toolbar: ['fraction', 'root', 'norm'],
  toolbarMaxItems: 2,
});
mountMathToolbar(toolbarHost, session, {
  kinds: ['fraction', 'root', 'norm'],
  maxItems: 2,
});
```

`toolbar: false` hides the toolbar. A structure array filters structure buttons; the workspace native toolbar also filters templates by their structure kinds and limits grid presets/context controls to allowed kinds. Symbol search remains available. Rich React's auxiliary controls retain their existing behavior. Toolbar filtering does not restrict suggestions, parsing or the model. `toolbarMaxItems` (independent toolbar: `maxItems`) is a nonnegative count; zero initially hides all structure buttons behind More. A sufficiently large count shows all selected structure buttons initially. Expanded state is not saved in the math document. The rich React `toolbar` array and compact behavior are available in 0.2.0; the native discovery/context additions are included in 0.4.0.

Workspace: added `\tilde`, `\bar`, `\dot`, `\ddot`, `\widehat` and `\widetilde` with exact-command parsing/export, localized suggestions, one-slot wrapping and fixed/stretchy accent rendering. Available in 0.2.0.

Workspace: `\limsup`/`\liminf` now have editable condition/body slots and localized suggestions. `\nolimits` is preserved as `limits: false` across parsing, JSON and export; existing `true` remains supported. Repeated placement directives are rejected. Available in 0.2.0.

Workspace: fine spacing commands `\,`, `\:`, `\;` and `\!` now support parsing/export, localized suggestion insertion, zero-slot deletion/Undo and positive/negative layout. Available in 0.2.0.

### Embedded editor sizing

Set `--me-font-size` on the host (for example `18px`) to keep React token previews, their focused inputs and script sizes consistent. The default base is22px. The host owns document layout/scale; focusing a token does not alter its size.

### Explicit fraction sizes (workspace)

Import or type the suggestions `dfrac`, `tfrac`, `dbinom`, and `tbinom` for display/text fraction and binomial presets. The editor preserves their size on export. See [LaTeX guide](https://math-editor.barocss.com/docs/latex-guide.html); available in 0.2.0.

### Math alphabet support (workspace)

`\mathbf`, `\mathcal` and multi-letter `\mathbb` now support import, suggestions, range wrapping, editing and export. See [alphabet scope and examples](https://math-editor.barocss.com/docs/latex-guide.html#mathematical-alphabets--020). Available in 0.2.0.

### Labeled arrows (workspace)

`\xrightarrow[below]{above}` and `\xleftarrow[below]{above}` support parsing, suggestions, editable math labels and export. See [label syntax and slot order](https://math-editor.barocss.com/docs/latex-guide.html#labeled-arrows--020). Available in 0.2.0.

## Keyboard ranges and brace discovery (0.2.1)

Shift+Left/Right extends or shrinks the same model range used by dragging. Structures are crossed as balanced units; copied and deleted ranges use existing model normalization. Shift+Up/Down extends to an adjacent top-level document line, using a logical text offset rather than pixel-based column matching; when a matrix-cell selection is active, Shift+arrows instead moves its rectangular focus corner. Copy, cut, wrapping, deletion and Undo use the existing range behavior. IME composition and modifier shortcuts retain their existing handling.

After a model selection, plain Left/Up restores the caret at its document-ordered
start; Right/Down restores it at the end. The same rule applies to reverse drags
and Shift+arrow selections, without consuming another character or changing the
formula. Alt+Up/Down browses the wrapping suggestions while retaining the range;
Enter applies a candidate. Ordinary input suggestions still use Up/Down.

Typing `{` offers both paired braces and cases. Paired braces remain the first candidate; choose Cases explicitly to insert its editable grid.


### Sharing a native toolbar between editors (workspace)

`mountMathToolbar(host, sessionOrNull, options)` now returns
`{ setSession, setDisabled, destroy }`. Call `setSession(activeEditor.session)` when an editor
becomes active and `setSession(null)` when editing ends. Detaching disables editing
actions and unsubscribes from the previous session. `options.locale` supplies labels
before the first session is attached; active sessions supply their own locale.
`setDisabled(true)` keeps the session attached while disabling mutations and closing
symbol search; restore it with `false` after composition. An internally mounted
native toolbar coordinates this automatically. Independent toolbar hosts own focus,
draft lifecycle and composition handling. `onExecute` runs after a successful command
so the host can return focus to the math editor; browsing tools does not commit the
draft. See the [session toolbar API](https://math-editor.barocss.com/docs/api-session.html#independent-toolbar-and-outputs).
The Tiptap/ProseMirror integration coordinates these through its `toolbarHost` option.

These native UI additions use the existing model and LaTeX grammar. English/Korean
remain the complete bundled locale packs, and actual OS IME testing remains deferred.

## Matrix cell editing — workspace

Drag across matrix cells or Shift+click another cell to select a rectangle. For
keyboard selection, choose **Select cells**, then extend with Shift+arrows;
**Select all cells** selects the whole matrix. Copy and cut include nested formulas.
Delete clears selected contents while keeping the grid; typing replaces the
rectangle with text in its upper-left cell. Enter or Escape returns to editing.

Paste a copied rectangle into a matching selection, or start at one cell and let
the matrix grow within 20 × 20. A single copied cell fills a larger selection.
Rectangular tab-separated spreadsheet text is also accepted inside matrices;
ragged or mismatched shapes fail without partial writes. Copied cells pasted
outside a matrix become a new matrix. The plain-text clipboard fallback is LaTeX.

**Transpose matrix** exchanges all rows and columns, preserving the delimiter,
nested content and caret. Paste, cut, clear and transpose each take one Undo.
These operations are available in both renderers and the framework-free
[session API](https://math-editor.barocss.com/docs/api-session.html#matrix-cell-selections).

## Style customization

Use inherited CSS variables for colors, slot backgrounds, typography, toolbar density and menu appearance. Scoped themes also follow portaled suggestions in both renderers. See [Styling & themes](https://math-editor.barocss.com/docs/styling.html) for the public variables, dark/monochrome examples, shared toolbars and iframe/plugin sizing.

## License

MIT License. Copyright (c) 2026 barocss.com.

The npm package includes the full license in `LICENSE`. Bundled KaTeX fonts retain
their separate copyright and MIT notice in `src/fonts/LICENSE-KaTeX.txt`.

### Change an existing radical

Place the caret inside a square root and choose **Change to Indexed root** in
the suggestions. The radicand, including nested structures, stays intact. The
new index is `2` and is selected so you can immediately type `3`, `n`, or another
index. The explicit choice creates one Undo step.

**Change to Square root** is available inside an indexed root with an empty
index or index `2`. Other indices must be edited first; conversion does not
discard them. The nearest enclosing radical is the target. Conversion choices
do not consume the text used to search, and an unselected conversion does not
intercept Enter. Both React and native DOM integrations support this behavior.

Empty non-grid slots support Delete and Backspace directly. Removing the wrapper
keeps other slot content and can be undone. See [Rendering checks](RENDERING-TESTS.md)
for editor/KaTeX comparison fixtures and the current visual verification scope.

### Contextual structure tools

While the caret is inside a radical, the optional editor footer shows its current type,
conversion action and, for indexed roots, **Edit index**. No search text is needed.
Dismissing suggestions leaves the footer available. An unavailable conversion
stays disabled with an explanation. F6 moves focus to the tools; Escape returns
to input. The footer hides outside the radical, on blur, or during model selection.

Set `contextTools={false}` on rich React, or `contextTools: false` in native DOM
options, to hide this footer. Native framework wrappers accept the same option.
The Web Component uses `context-tools="false"`. This setting does not remove
conversion suggestions. See [Editing scenarios](EDITING-SCENARIOS.md) EDIT-021
through EDIT-028 for acceptance criteria and pending coverage.

### Change brackets from suggestions

Place the caret inside brackets and press **Alt+Down** (Option+Down on macOS).
The existing suggestion list opens with a transformation selected. Use Up/Down
and Enter to change the surrounding brackets; Escape closes the list unchanged.
“Change brackets” preserves the enclosed formula and caret, unlike an action
that wraps text in a new pair. Available pairs include parentheses, brackets,
braces, angle brackets, absolute value, norm and both half-open intervals.

This works in inline fields with `toolbar: false` and `contextTools: false`.
Automatic contextual suggestions do not consume Enter until you navigate them.
The optional footer also offers bracket buttons via F6, Left/Right and Enter.
Nested roots and fences share a nearest-wrapper target. See EDIT-029 through
EDIT-032 in [Editing scenarios](EDITING-SCENARIOS.md).
