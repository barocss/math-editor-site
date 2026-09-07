# @barocss/math-editor

An embeddable math editor with a framework-independent model, an existing rich React UI, and a new native DOM surface for pure JavaScript, Web Components, Vue, Svelte, Solid and React. Write expressions in place, select existing math, and wrap it in fractions, roots, powers or delimiters. The demo includes a live KaTeX preview.

**Status:** working prototype, not yet a production-ready replacement for the math features in Note, Word or Slides. This package does not calculate, solve equations or parse arbitrary LaTeX.

See [framework adapters and inline/custom toolbar integration](ADAPTERS.md), [custom locales](LOCALIZATION.md), and [progress / roadmap](ROADMAP.md). The new native renderer has explicit parity gaps; existing React consumers keep their current UI.

For editor-only, external toolbar, LaTeX, preview, inline and popup compositions, see [Embedding](EMBEDDING.md) and `/layouts.html` in the demo.

## Quick start

Install version 0.1.0 from npm:

```sh
npm install @barocss/math-editor@0.1.0
# For the rich React UI:
npm install react react-dom
```

Import `@barocss/math-editor/style.css` once. Framework-free consumers use `/core` and `/dom`; each framework adapter has its own subpath. See [ADAPTERS.md](ADAPTERS.md).

To develop the package and demo from this monorepo:

```sh
pnpm install
pnpm --filter @barocss/math-editor build
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
| `toolbar?: boolean` | Show the rich React toolbar panels; defaults to `true`. |
| `toolbarEnd?: ReactNode` | Host actions such as reset/save appended to the toolbar. |
| `showTokenLegend?: boolean` | Show lexical color guidance; defaults to `true`. |
| `showLineNumbers?: boolean` | Defaults to `true`. Displays UI-only line numbers when there are two or more top-level rows. Never included in the model, clipboard or LaTeX. |
| `label?: string` | Host-provided accessible group name; otherwise localized. Hosts translate their own custom label. |
| `onChange?(document, latex)` | Receives committed model changes and their LaTeX output. IME drafts are not published. |
| `onExit?(direction)` | Requests host focus restoration at an outer navigation boundary: -1 before, +1 after. |

## Suggestion ordering

Matching literal characters appear before editable structures and templates. For example, `/` offers `÷` then Fraction; `^` offers `∧` before the script structures; `sum` offers `+`, `±`, then the editable sum. To create a fraction, type `x/`, press Down once, then Enter. The same ranking applies to all adapters.

## Editing flows

Use **All symbols** to browse all 90 symbols without knowing a name in advance. Search by glyph, English/Korean name, alias or LaTeX command, then click to insert at the last caret or replace the model selection. Escape closes the browser. Search-field clipboard actions do not affect the formula.

- Type `x/`, then Enter: convert to a fraction and enter the denominator. `/`, `^` and `_` remain opt-in suggestions, not immediate structural conversions.
- Type `matrix`, `identity`, `aligned` or `cases`, then choose a suggestion. Korean aliases work in both UI languages.
- Type `30degree`, `30도` or `30각도`, then Enter to insert `30°` on the current line. `angle` inserts the separate symbol `∠`.
- Search `reals`, `integers`, `setminus`, `parallel`, or their Korean names. [The complete catalog](./SUPPORT.md) lists every symbol and alias.
- Use the template selector for zero matrices, column vectors, the quadratic formula and the Pythagorean theorem. Every part remains editable. Template insertion replaces a model selection if one is active; otherwise it inserts at the caret.
- Click a token to edit it. Only the current token mounts a native `input`; the others are ordinary elements. Blur switches to preview. Escape closes suggestions first, then returns to preview.
- Drag to select math. The selection tools and main toolbar wrap it in a fraction, root, power, subscript, parentheses, brackets or absolute value. Fractions focus the denominator; powers/subscripts focus their new slot; roots/delimiters place the caret after the structure.
- Complex power bases receive parentheses. Existing structured delimiters are preserved. This is a conservative display rule, not symbolic algebra.

Variables, numeric literals and symbols use distinct colors. Classification is lexical: a letter named `c` or `e` is not automatically a declared constant. The model does not resolve names or binding scopes.

## Keyboard reference

| Context | Key | Action |
|---|---|---|
| Suggestions | Up / Down, Enter | Choose and apply; IME composition reserves these keys for the input method |
| Any active slot | Tab / Shift+Tab | Traverse tokens and structural slots |
| Token boundary | Left / Right | Move into a neighboring token or slot |
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
| Active input | Cmd/Ctrl+A | Select the current token text |
| Preview surface | Enter / F2 | Enter editing |
| Model selection | Cmd/Ctrl+C / X / V | Copy / cut / replace with clipboard contents |
| Model selection | Backspace / Delete | Delete selection |
| Editor | Cmd/Ctrl+Z / Cmd/Ctrl+Shift+Z | Undo / redo |

## Selection and clipboard boundaries

A range within one row preserves partial text and balanced structures. Selecting across a numerator and denominator expands to their common fraction; selecting across matrix cells expands to their common matrix. This is not a spreadsheet-style rectangular cell selection. Multiple document lines can be copied, replaced or deleted, but cannot be wrapped into a single structure.

Internal copies include `application/x-barocss-math+json` and plain-text LaTeX. Paste validates the custom payload and generates fresh IDs. Plain external text is inserted literally; newlines become top-level rows. Multiple-line paste into a nested slot is rejected without changing the document. If a destination strips custom clipboard formats, pasting back provides text rather than reconstructed math.

The demo's **Copy** button exports LaTeX only. General LaTeX import is not implemented.

## Model and package boundaries

`MathDocument` stores `version: 1`, a `root` row and optional `additionalLines`. Rows alternate text boundaries and structures; even an empty boundary is a valid caret address. LaTeX is an export format, not the editing source.

- Main export: model, React editor, navigation, matrices, range/clipboard operations, tokens, suggestions, templates, symbols and localization.
- `@barocss/math-editor/core`: all framework-free model helpers, sessions, suggestions and locale registration; no React dependency.
- `@barocss/math-editor/style.css`: explicit UI stylesheet using `me-` classes.
- KaTeX is a demo runtime dependency and a package test dependency; the library renderer does not require it.

Only pass trusted, well-formed saved documents to `defaultValue`. `parseFragment` validates clipboard fragments; it is not a saved-document validation API. Locale is host UI state and is not serialized in the math document.

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

The demo consumes package exports from `dist`; rebuild the package before browser tests. Browser tests use Playwright Chromium and start port 5184 if needed. Actual OS Korean IME tests remain deferred at the user's request.

- [Symbol / English / Korean name table](./SYMBOLS.md)
- [Supported formulas, templates and full symbol catalog](./SUPPORT.md)
- [Implementation guide](./IMPLEMENTATION.md)
- [Validation evidence and limitations](./VALIDATION.md)
- [Roadmap and acceptance criteria](./ROADMAP.md)
