# Session and native DOM API reference

This reference applies to pure JavaScript, `MathEditorSurface`, Web Component, Vue, Svelte and Solid native integrations. The base session/DOM API is available in 0.2.0; the native discovery/context toolbar, `setDisabled` and precise pointer-selection changes below are additions in 0.4.0. Rich React `MathEditor` owns separate history and has its own [props](API-REACT.md).

## Imports

```ts
import { createMathSession, createMathDocument } from '@barocss/math-editor/core';
import { mountMathEditor, mountMathToolbar, mountMathLatex, mountMathPreview }
  from '@barocss/math-editor/dom';
import '@barocss/math-editor/style.css';
```

## createMathSession(options)

| Option | Type | Default |
|---|---|---|
| `document` | Trusted `MathDocument` | Empty document |
| `locale` | Registered locale string | `ko` |
| `mode` | `block` or `inline` | `block` |

| Method | Contract |
|---|---|
| `getSnapshot()` | Copy containing `state`, optional `range` / `matrixRange`, `locale`, `mode`, `canUndo`, `canRedo`, `latex` |
| `subscribe(listener)` | Listener receives `(snapshot, documentChanged)`; returns unsubscribe |
| `execute(command)` | Boolean result; text/structure/template/newline/undo/redo and matrix selection/clear/transpose |
| `apply(state)` | Apply `MathState`; returns false for invalid inline multiline state |
| `select(caret)` | Set `MathCaret`, clear structural range, emit non-document change |
| `selectRange(range?)` | Set/clear `MathRange`, emit non-document change |
| `selectMatrixRange(range?)` | Validate and set/clear a cell rectangle; clear structural range, emit non-document change; false leaves state unchanged |
| `copyMatrix()` | Copy selected cells as `MathMatrixFragment`, or undefined |
| `pasteMatrix(fragment)` | Paste at the selected rectangle or active matrix cell as one edit; false leaves document, selection and history unchanged |
| `configure({ locale?, mode? })` | Keep document/history; throws on multiline-to-inline change |
| `load(document)` | Open trusted document and reset history/range; emits document change |
| `copy()` | `MathFragment` for structural range; matrix rectangle becomes a single-matrix fragment; otherwise undefined |
| `paste(fragment)` | Boolean result; rejects multiline in inline mode |
| `destroy()` | Release subscribers; host must also destroy renderers/tools |

A snapshot's `state` contains `document` and `caret`. Never mutate a snapshot expecting it to affect the session. Use a command or `apply` instead. `false` is also returned for undo/redo when no history change occurs; it is not always an error.

## Matrix cell selections

Available in 0.4.0. `MathRange` and `MathMatrixRange` are
mutually exclusive. `select(caret)`, document changes, load and Undo/Redo clear cell
selection. Selecting cells does not emit a document change or create history.

```ts
import { createMathSession } from '@barocss/math-editor/core';

const session = createMathSession({ document: savedDocument });
// Assume a loaded matrix has three columns; select rows 1–2, columns 2–3.
session.selectMatrixRange({ matrixId, anchor: 1, focus: 5 });
const cells = session.copyMatrix();
// Move to another matrix/cell or select its destination rectangle first.
if (cells && !session.pasteMatrix(cells)) {
  // The destination shape or 20 × 20 bound rejected this paste; no partial write.
}
session.execute({ type: 'matrix-select' }); // Current cell, ready for Shift+arrows.
session.execute({ type: 'matrix-select', all: true });
session.execute({ type: 'matrix-clear' });
session.execute({ type: 'matrix-transpose' }); // Entire selected/active matrix.
```

`MathMatrixRange` is `{ matrixId: string, anchor: number, focus: number }`.
Endpoints are zero-based row-major cell indices. Reversed endpoints work; bounds
are derived from row and column coordinates, not the linear span between indices.
`MathMatrixFragment` is `{ version: 1, columns, cells: MathRow[], environment }`.
Its `cells` are row-major and may contain any supported nested formula.

| Destination | Paste behavior |
| --- | --- |
| Caret in a matrix or one selected cell | Replace whole cells from that anchor; grow/pad the matrix up to 20 × 20 |
| Larger selected rectangle | Require matching dimensions; a single copied cell fills every selected cell |
| Different rectangle dimensions, invalid payload or size overflow | Return false with no write, selection change or history entry |
| Outside a matrix in the browser UI | Insert the copied rectangle as a new matrix through its normal math-fragment fallback |

Pasting keeps the destination delimiter, preserves unselected cells, and assigns
fresh IDs recursively to inserted content. Typing over a cell selection clears
its contents and inserts text into the upper-left cell. Delete/Cut clear contents
without deleting rows or columns. Enter/Escape resumes editing; Shift+arrows
extends the rectangle. Transpose reorders the entire matrix, retaining existing
cell IDs, delimiter and nested caret. Each content operation takes one Undo.

Browser clipboard handlers write `MATH_MATRIX_CLIPBOARD_TYPE`
(`application/x-barocss-math-matrix+json`), the existing math fragment MIME, and
plain LaTeX. Read external matrix payloads with `parseMatrixFragment`; normal
`parseFragment` remains the structural clipboard parser. `paste(fragment)` does
not overwrite a cell rectangle: use `pasteMatrix` for that operation. Tab-separated
spreadsheet data inside a matrix is treated as cell text, not interpreted LaTeX.
Clipboard formats can be stripped by other applications; OS interoperability is
a separate check. Neither selection nor clipboard metadata changes MathDocument v1.

## Commands

```ts
session.execute({ type: 'text', value: 'x + α' });
session.execute({ type: 'structure', kind: 'fraction' });
session.execute({ type: 'template', id: 'quadratic' });
session.execute({ type: 'newline' });
session.execute({ type: 'undo' });
session.execute({ type: 'redo' });
```

These examples assume an existing session. `kind` accepts the exported `StructureKind`; see the [structure catalog](JSON-MODEL.md) for the current kinds and slot contracts. A selected structural range can only wrap in supported wrapping kinds. Use exported grid helpers plus `apply()` for grid resizing; there is no `execute({ type: 'resizeMatrix' })` command.

## mountMathEditor(host, options)

`host` must be a real HTMLElement. Mount on the client, once per surface.

| Option | Contract |
|---|---|
| `session` | Host session; mount-only; survives renderer destruction |
| `defaultValue` | Trusted document for an internally created session; mount-only |
| `menuHost` | Suggestion portal HTMLElement; mount-only; nearest native dialog or body by default |
| `menuAvoidElements` | Workspace: optional callback returning host controls the suggestion menu should avoid; measured in their current position when the menu opens or moves |
| `locale`, `mode` | Configure locale/mode; same defaults as session |
| `toolbar` | Boolean or readonly structure kind list; block defaults on, inline off |
| `toolbarMaxItems` | Initially visible structure buttons; defaults to eight; More tools reveals the expanded controls |
| `showLineNumbers` | Whether UI-only multiline gutter is displayed |
| `enterBehavior` | `newline` or `commit`; block defaults newline, inline commit |
| `onChange(document, latex)` | Committed document changes |
| `onRender()` | Workspace: final DOM/caret notification, including focus and selection-only updates; no automatic model write |
| `onCommit(snapshot)` | Host completion request; no automatic save or block creation |
| `onCancel()` | Escape after dismissing suggestions/grid state; host decides whether to close |
| `onExit(direction)` | Host caret handoff, `-1` before or `1` after |

Return value: `{ session, focus(), update(options), destroy() }`. `update` accepts mutable options only and merges them. Locale updates preserve history. Do not pass a fresh session to `update`; recreate the renderer if changing ownership.

`onRender` runs synchronously after the native surface/menu update, before host mutation observers reconcile their selections. It can also run during initial mounting, before `mountMathEditor` returns. Hosts can inspect the current input and schedule caret restoration; avoid issuing commands or calling `focus()` from the callback, which can trigger another render. This notification is distinct from `onChange` and does not imply a document or history change. It is available in 0.4.0.

Notifications are suppressed during composition and after teardown. A notification does not guarantee that an input is focused. Any deferred caret restoration should check that its input is still connected and focused, so a later callback cannot revive a closed draft or steal focus from another control.

Inline mode means one top-level row, not a fixed visual height. It rejects newline commands and multiline paste and throws when loading multiline documents. Enter accepts suggestions first; grid keyboard operations have their own priority. CSS alone cannot establish these model constraints.

For a compact draft, pass `menuAvoidElements: () => [actionsElement]` to keep
suggestions clear of Apply, Cancel and tool-expansion controls. The callback can
return elements added after mounting. Placement remains constrained by the
viewport and clipping ancestors; the menu scrolls when the available gap is short.
This option changes presentation only and adds no model data.

## Saving without caret-only writes

```ts
const unsubscribe = session.subscribe((snapshot, documentChanged) => {
  if (!documentChanged) return;
  localStorage.setItem('formula', JSON.stringify(snapshot.state.document));
});
// On teardown: unsubscribe(); editor.destroy(); session.destroy();
```

If a server persists changes asynchronously, debounce/serialize writes and handle failed saves in your host. The library does not resolve write races or validate arbitrary documents returned by a server.

## Independent toolbar and outputs

`mountMathToolbar(host, sessionOrNull, { kinds?, maxItems?, locale?, onExecute? })` mounts a toolbar whose current workspace handle exposes:

| Method | Contract |
|---|---|
| `setSession(sessionOrNull)` | Switch the active draft subscription; `null` disables mutations; switching/detaching closes symbol search |
| `setDisabled(boolean)` | Disable mutations while keeping the session attached; disabling closes symbol search; restore with `false` after composition |
| `destroy()` | Remove the toolbar, its panels and session subscription |

`maxItems` defaults to eight. `locale` supplies labels before a session is attached; an active session supplies its own locale. Use `onExecute: () => editor.focus()` to return focus after a successful command. Opening or searching the symbol browser leaves focus in that browser. The toolbar uses the session's caret/range even when the math input has blurred.

The workspace More tools section exposes the full symbol catalog with search, templates, matrix/identity presets and symbol shortcuts. `kinds` filters structure buttons, templates containing excluded kinds, and grid presets/context controls; it does not limit model or parser support. Active matrices provide row/column operations and delimiter selection; aligned/cases provide row operations. Grid mutations are disabled while text or a model range is selected. The symbol panel stays inside its toolbar host, and Escape closes it without requesting host Cancel.

An internally mounted toolbar is disabled during native formula composition. Hosts mounting an independent toolbar must coordinate composition with `setDisabled`, or temporarily detach with `setSession(null)`. Host integrations also own containment: keep the toolbar and its panels inside the declared `toolbarHost` so an outside-click handler does not commit the draft while browsing. See [adapter embedding](ADAPTERS.md) for lifecycle ownership.

`mountMathLatex(host, session)` renders derived LaTeX and returns `destroy()`.

`mountMathPreview(host, session, { render(host, snapshot) })` delegates rendering to your application. `render` may return a cleanup function. The math-editor package does not ship KaTeX as a runtime requirement; import your chosen renderer separately. All output handles must be destroyed when their hosts are removed.

The website's sized PNG download/copy controls belong to its preview renderer. They are not native DOM/session image-export methods; a reusable library SVG/PNG export API remains future work.

## Native selection behavior

Shift+Left/Right extends or shrinks a model range; Shift+Up/Down extends across top-level lines using logical offsets. In the workspace, passive highlights cover exact selected text endpoints. Dragging within the active input keeps native text selection; crossing its boundary can extend a model range across structures. Structural normalization remains unchanged: a `MathRange` crossing fraction slots or matrix cells selects their common structure. Cross-cell pointer gestures instead create a separate `MathMatrixRange` in the workspace; see the matrix selection contract above.

After a model selection, plain Left/Up restores the caret at its document-ordered
start; Right/Down restores it at the end. The same rule applies to reverse drags
and Shift+arrow selections, without consuming another character or changing the
formula. Alt+Up/Down browses the wrapping suggestions while retaining the range;
Enter applies a candidate. Ordinary input suggestions still use Up/Down.

The first Escape dismisses a selection's wrapping suggestions while preserving
the selection and draft. A subsequent Escape reaches the host Cancel callback.
Changing the selection or beginning a new pointer gesture makes suggestions
available again.

The active native input still edits a whole logical text run with one role color. Passive runs retain lexical colors. The cell-selection work adds full-matrix transpose through existing model structures; no new LaTeX grammar is needed. Native OS IME validation and additional complete locale packs remain deferred; see [renderer parity](ADAPTERS.md#current-renderer-parity) for remaining limits.

## Reusable browser-storage adapter with restore and error reporting

This adapter avoids writes for caret changes, debounces edits, flushes on page hide, and removes its listeners on teardown. Restore runs before subscribing so opening saved content does not immediately write it back. It does not validate documents itself: supply your application's schema validator as `decode`, which must throw for invalid or unsupported JSON. Use a different key per document. Call `dispose()` before changing the session's document/key.

```ts
import type { MathDocument } from '@barocss/math-editor/core';
import { createMathSession } from '@barocss/math-editor/core';

type Session = ReturnType<typeof createMathSession>;
export function attachBrowserStorage(
  session: Session,
  key: string,
  decode: (json: unknown) => MathDocument,
  onError: (error: unknown) => void,
) {
  // Invoke on the client only. Storage may be unavailable or full.
  try {
    const stored = localStorage.getItem(key);
    if (stored !== null) session.load(decode(JSON.parse(stored)));
  } catch (error) { onError(error); }
  let timer: ReturnType<typeof setTimeout> | undefined;
  let pending: MathDocument | undefined;
  function flush() {
    clearTimeout(timer);
    timer = undefined;
    if (!pending) return;
    try {
      localStorage.setItem(key, JSON.stringify(pending));
      pending = undefined;
    } catch (error) { onError(error); }
  }
  const unsubscribe = session.subscribe((snapshot, documentChanged) => {
    if (!documentChanged) return;
    pending = snapshot.state.document;
    clearTimeout(timer);
    timer = setTimeout(flush, 300);
  });
  window.addEventListener('pagehide', flush);
  return {
    flush,
    dispose() {
      unsubscribe();
      window.removeEventListener('pagehide', flush);
      flush();
    },
  };
}
```

The host owns validation because it knows supported structures, size limits and schema versions. Do not replace `decode` with a TypeScript cast. Page-hide flushing is best effort, not a guarantee against crashes; localStorage is not cross-device persistence or multi-tab conflict resolution. Display `onError` failures and offer a retry via `flush()`.

## Failure and compatibility boundaries

- All adapters are ESM; no CommonJS/global-script API is promised.
- Loading expects trusted structured JSON; arbitrary LaTeX parsing and evaluation are not supported.
- Native and rich React editing UX differ; see [the parity table](ADAPTERS.md#current-renderer-parity).
- One session is not a concurrent multi-user collaboration engine.
- Host UI, permissions, persistence, clipboard environment restrictions and SSR boundaries remain the integrator's responsibility.


## LaTeX import (0.2.0)

```ts
const result = session.importLatex(String.raw`\frac{a}{b}`);
if (!result.ok) {
  // No mutation or subscription notification. Retain the caller's source.
  console.log(result.diagnostics);
}
```

This operation replaces the current formula in one undo step; redo restores the imported formula. Inline sessions reject multiple top-level lines before modifying state. All framework adapters using a session share this API; Web Components expose it as `element.session.importLatex(source)`.

For state-independent inspection, use `parseLatex(source, { multiline?, excludedStructures? })` from `/core`. For opening a different saved document, validate JSON with `parseMathDocument` and call `session.load`. Loading deliberately resets history, importing does not. See [the exact syntax contract](LATEX-SCOPE.md); arbitrary LaTeX macros are not supported. These APIs are available in 0.2.0.

## Editing utilities — workspace

These additions are included in 0.4.0. Earlier releases do not provide these APIs.

### LaTeX insertion

`session.pasteLatex(source)` inserts at the current caret or replaces the selected model range. It returns `LatexInsertionResult`: success includes the parsed document and resulting state; failure includes source offsets and diagnostics. It creates one Undo entry, leaves the caret after the inserted fragment, and generates fresh IDs. It does not reset history or replace the entire document. `importLatex(source)` continues to replace the whole formula.

```ts
const result = session.pasteLatex(String.raw`\frac{a}{b} + x_i^2`);
if (!result.ok) console.log(result.diagnostics);
```

Empty input, unsupported syntax, multiline insertion inside a nested slot or inline session, structures in literal text, and matrix-rectangle targets are rejected without changing document, caret, selection or history. Ordinary clipboard paste is still literal. More tools → Paste as LaTeX opens a nonmodal source field. Alt+Shift+V opens it even when the toolbar is hidden; Ctrl/Cmd+Enter inserts and Escape closes. The UI accepts a user paste and does not read the system clipboard automatically.

The pure `insertLatex(state, source, range?, options?)` helper supplies the same behavior without a session. The rich React `MathEditorHandle.pasteLatex` method applies the same helper with its multiline/excluded-structure policy.

### Recent items and favorites

`createMathPreferences(saved?)` creates a UI-only store. Each session has `session.preferences`; pass an existing store in `createMathSession({ preferences })` to share it. An internally owned native session also accepts mount-only `DOMMathEditorOptions.preferences`. Rich React accepts `preferences` as a prop.

```ts
import { createMathPreferences, createMathSession } from '@barocss/math-editor/core';

const preferences = createMathPreferences();
const first = createMathSession({ preferences });
const second = createMathSession({ preferences });
preferences.toggleFavorite('symbol-α');
preferences.toggleFavorite('template-quadratic');
const saved = preferences.getSnapshot(); // { version: 1, recent: [], favorites: [...] }
const restored = createMathPreferences(saved);
```

The default store lives in memory. The host can serialize `getSnapshot()` and use `subscribe(listener)` to persist changes; unsubscribe when finished. No localStorage, cookies, network calls or user identity are implicit. `record(id)` moves a known item to the front of the 12-entry recent list. `toggleFavorite(id)` adds/removes a favorite, bounded to 100. `clearRecent()` clears recents. Unknown IDs are ignored; restored lists are validated and deduplicated. These actions do not change formula JSON, document change callbacks or Undo.

More tools → Recent & favorites supplies search, All/Recent/Favorites filters and separate star buttons. Symbol/template selections are recorded; arbitrary typed text and full imported formulas are not stored. Toolbar template filters still apply. A preference store can outlive an individual editor.

### Contextual presentation settings

Place the caret inside a fence, fraction/binomial, or supported limit/sum/product/integral. The toolbar displays settings for the nearest applicable structure. Nested contents, IDs and caret remain unchanged. A structural or matrix range disables these settings.

```ts
import { activePresentation } from '@barocss/math-editor/core';
const target = activePresentation(session.getSnapshot().state);
if (target) session.execute({
  type: 'presentation', id: target.id, change: { mathStyle: 'text' },
});
```

Choose the change appropriate to the target:

| Change | Accepted values | Applies to |
| --- | --- | --- |
| `fence` | `parentheses`, `brackets`, `braces`, `angle`, `absolute`, `norm`, `openClosed`, `closedOpen` | Structural fences; changes both ends together |
| `mathStyle` | `default`, `display`, `text` | Fractions and binomials |
| `limits` | `default`, `above-below`, `side` | Supported limit, sum/product and integral variants |

`default` removes the explicit metadata. `setMathPresentation(state, id, change)` is the pure equivalent. Unsupported changes or stale IDs return the original state; the session command returns false. This is presentation editing of existing syntax, not algebraic conversion or general TeX styling.

Toolbars expose `closePanels()` to dismiss their nonmodal utilities without editing the formula. `onOpenPanel` and `onPasteLatex` are optional mounting callbacks for a host that coordinates its own utility panels. Built-in surfaces keep only one utility/discovery panel open at a time.

### Keyboard access to transformations

In React and native DOM fields, **Alt+Down** opens or reopens suggestions and
selects the first available contextual transformation. Up/Down browses and Enter
applies; Escape dismisses. On macOS, Alt is the Option key. Root and bracket
transformations preserve the existing operand. The shortcut works with
`toolbar: false` and `contextTools: false`, including inline mode. Normal text
input continues to use the standard suggestion ordering; a context-only menu
requires navigation before Enter can apply a change instead of a host commit.
