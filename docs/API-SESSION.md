# Session and native DOM API reference

This reference applies to pure JavaScript, `MathEditorSurface`, Web Component, Vue, Svelte and Solid native integrations in npm 0.1.0. Rich React `MathEditor` owns separate history and has its own [props](API-REACT.md).

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
| `getSnapshot()` | Copy containing `state`, optional `range`, `locale`, `mode`, `canUndo`, `canRedo`, `latex` |
| `subscribe(listener)` | Listener receives `(snapshot, documentChanged)`; returns unsubscribe |
| `execute(command)` | Boolean result; text/structure/template/newline/undo/redo |
| `apply(state)` | Apply `MathState`; returns false for invalid inline multiline state |
| `select(caret)` | Set `MathCaret`, clear structural range, emit non-document change |
| `selectRange(range?)` | Set/clear `MathRange`, emit non-document change |
| `configure({ locale?, mode? })` | Keep document/history; throws on multiline-to-inline change |
| `load(document)` | Open trusted document and reset history/range; emits document change |
| `copy()` | `MathFragment` for structural range, or undefined |
| `paste(fragment)` | Boolean result; rejects multiline in inline mode |
| `destroy()` | Release subscribers; host must also destroy renderers/tools |

A snapshot's `state` contains `document` and `caret`. Never mutate a snapshot expecting it to affect the session. Use a command or `apply` instead. `false` is also returned for undo/redo when no history change occurs; it is not always an error.

## Commands

```ts
session.execute({ type: 'text', value: 'x + α' });
session.execute({ type: 'structure', kind: 'fraction' });
session.execute({ type: 'template', id: 'quadratic' });
session.execute({ type: 'newline' });
session.execute({ type: 'undo' });
session.execute({ type: 'redo' });
```

These examples assume an existing session. Structure kinds: `fraction`, `root`, `superscript`, `subscript`, `parentheses`, `brackets`, `absolute`, `sum`, `product`, `integral`, `matrix`, `aligned`, `cases`. A selected structural range can only wrap in supported wrapping kinds. Use exported grid helpers plus `apply()` for grid resizing; there is no `execute({ type: 'resizeMatrix' })` command.

## mountMathEditor(host, options)

`host` must be a real HTMLElement. Mount on the client, once per surface.

| Option | Contract |
|---|---|
| `session` | Host session; mount-only; survives renderer destruction |
| `defaultValue` | Trusted document for an internally created session; mount-only |
| `menuHost` | Suggestion portal HTMLElement; mount-only; nearest native dialog or body by default |
| `locale`, `mode` | Configure locale/mode; same defaults as session |
| `toolbar` | Boolean or readonly structure kind list; block defaults on, inline off |
| `showLineNumbers` | Whether UI-only multiline gutter is displayed |
| `enterBehavior` | `newline` or `commit`; block defaults newline, inline commit |
| `onChange(document, latex)` | Committed document changes |
| `onCommit(snapshot)` | Host completion request; no automatic save or block creation |
| `onCancel()` | Escape after dismissing suggestions/grid state; host decides whether to close |
| `onExit(direction)` | Host caret handoff, `-1` before or `1` after |

Return value: `{ session, focus(), update(options), destroy() }`. `update` accepts mutable options only and merges them. Locale updates preserve history. Do not pass a fresh session to `update`; recreate the renderer if changing ownership.

Inline mode means one top-level row, not a fixed visual height. It rejects newline commands and multiline paste and throws when loading multiline documents. Enter accepts suggestions first; grid keyboard operations have their own priority. CSS alone cannot establish these model constraints.

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

`mountMathToolbar(host, session, { kinds?, onExecute? })` exposes `destroy()`. Use `onExecute: () => editor.focus()` to return keyboard focus after choosing a tool. `mountMathLatex(host, session)` renders derived LaTeX and returns `destroy()`.

`mountMathPreview(host, session, { render(host, snapshot) })` delegates rendering to your application. `render` may return a cleanup function. The math-editor package does not ship KaTeX as a runtime requirement; import your chosen renderer separately. All output handles must be destroyed when their hosts are removed.

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
