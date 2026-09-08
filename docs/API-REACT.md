# React API guide

React offers two components. Choose intentionally: they share document structure, but do not share a live session or renderer.

| Component | Use it for | State ownership |
|---|---|---|
| `MathEditor` | Rich symbol browser, token editing and selection tools | Internal React history; `defaultValue` is mount-only |
| `MathEditorSurface` | Native inline mode, external session/tools, host commit/cancel | DOM renderer with optional host-owned `MathSession` |

## Install

```sh
npm install @barocss/math-editor@0.1.0 react react-dom
```

## Rich editor

```tsx
import { MathEditor } from '@barocss/math-editor/react';
import { createMathDocument, type MathDocument } from '@barocss/math-editor/core';
import '@barocss/math-editor/style.css';

export function Formula({ id, saved, onSave }: {
  id: string;
  saved?: MathDocument;
  onSave: (document: MathDocument, latex: string) => void;
}) {
  return <MathEditor
    key={id}
    locale="en"
    defaultValue={saved ?? createMathDocument()}
    onChange={onSave}
    showTokenLegend={false}
    label="Formula editor"
  />;
}
```

Changing `saved` alone does not replace the document. Change `key` when opening a different document; do not change it on every save. There is no controlled `value` prop or `session` prop on this component. `onChange` reports committed model edits, not IME drafts.

## Rich component props in npm 0.1.0

| Prop | Default / behavior |
|---|---|
| `defaultValue` | Optional `MathDocument`, read once |
| `locale` | `ko`; locale changes preserve history |
| `toolbar` | `true`; hides/shows all rich toolbar panels |
| `toolbarEnd` | Optional React content appended to tools |
| `showTokenLegend` | `true` |
| `showLineNumbers` | `true`; UI-only multiline gutter |
| `label` | Localized default accessible group label |
| `onChange(document, latex)` | Save the document; LaTeX is derived |
| `onExit(direction)` | Host focus restoration request, `-1` or `1` |

Workspace development also adds `excludedStructures` and `multiline` to the rich component. These are **not part of the published 0.1.0 API**. For single-row behavior with 0.1.0, use `MathEditorSurface` with `mode="inline"`.

## Native surface

```tsx
import { MathEditorSurface } from '@barocss/math-editor/react';
import type { MathDocument } from '@barocss/math-editor/core';
import '@barocss/math-editor/style.css';

export function InlineFormula({ onSave, onExit }: {
  onSave: (document: MathDocument, latex: string) => void;
  onExit: (direction: -1 | 1) => void;
}) {
  return <MathEditorSurface
    locale="en"
    mode="inline"
    toolbar={false}
    onChange={onSave}
    onCommit={() => onExit(1)}
    onExit={onExit}
  />;
}
```

`MathEditorSurface` accepts [DOM options](API-SESSION.md), plus `className`. It mounts/destroys through React effects and updates mutable options. `defaultValue`, `session` and `menuHost` remain mount-only. For external commands, provide one stable session; `session.load(document)` opens a different trusted document and resets history. The host must clean up its own subscriptions and external toolbar/session. Avoid sharing a session across simultaneous surfaces.

## SSR and popup behavior

The native surface mounts on the client through an effect. Keep browser storage and DOM access in client lifecycle code. In server-component frameworks, put the integration in a client component; package import safety does not imply server-rendered editable content or hydration support.

For a popup, hold a draft in component state or a draft session. `onChange` should update that draft, not persist to the host document. Apply commits it; Cancel unmounts it. Use a fresh `key` each time a new original is opened. Keep host undo separate and create one host transaction on Apply.

## Common mistakes

- Passing `value`, `onCommit`, `mode` or `session` to rich `MathEditor`: use the native surface for those native options.
- Mirroring each `onChange` into a new component key, destroying undo and IME state.
- Assuming rich and native components have identical symbol/selection tools.

## Complete React modal with an isolated rich-editor draft

The parent supplies a trusted document and receives one Apply callback. Typing and Cancel never call `onApply`. Render a fresh instance for each editing request (for example, a monotonically increasing request key). This uses published 0.1.0 props only.

```tsx
import { useEffect, useRef } from 'react';
import { MathEditor } from '@barocss/math-editor/react';
import type { MathDocument } from '@barocss/math-editor/core';
import '@barocss/math-editor/style.css';

export function FormulaDialog({ original, onApply, onClose }: {
  original: MathDocument;
  onApply: (document: MathDocument) => void;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const draft = useRef(structuredClone(original));
  const finished = useRef(false);
  useEffect(() => {
    const element = dialog.current!;
    const previous = document.activeElement;
    element.showModal();
    return () => {
      element.close();
      if (previous instanceof HTMLElement && previous.isConnected) previous.focus();
    };
  }, []);
  function finish(apply: boolean) {
    if (finished.current) return;
    finished.current = true;
    if (apply) onApply(structuredClone(draft.current));
    onClose(); // Parent unmounts this component.
  }
  return <dialog ref={dialog} aria-label="Edit formula"
    onCancel={event => { event.preventDefault(); finish(false); }}>
    <MathEditor defaultValue={original} locale="en" showTokenLegend={false}
      onChange={document => { draft.current = document; }} />
    <button type="button" onClick={() => finish(false)}>Cancel</button>
    <button type="button" onClick={() => finish(true)}>Apply</button>
  </dialog>;
}
```

`onApply` is a synchronous host-state commit in this example. If saving requires a server request, keep a pending/error state, disable duplicate Apply, and close only after success. Do not replace `defaultValue` on every keystroke.

## Native React surface with Undo, Redo and document switching

This is an alternative to the rich modal. The stable session is created once per mounted component; loading a different trusted `source` resets its history. Keep `source` stable while saving: do not feed each emitted document back into it.

```tsx
import { useEffect, useState } from 'react';
import { MathEditorSurface } from '@barocss/math-editor/react';
import { createMathSession, type MathDocument } from '@barocss/math-editor/core';
import '@barocss/math-editor/style.css';

export function SessionFormula({ source }: { source: MathDocument }) {
  const [session] = useState(() => createMathSession({ document: source, locale: 'en' }));
  const [snapshot, setSnapshot] = useState(() => session.getSnapshot());
  useEffect(() => {
    const unsubscribe = session.subscribe(next => setSnapshot(next));
    setSnapshot(session.getSnapshot());
    return () => { unsubscribe(); session.destroy(); };
  }, [session]);
  useEffect(() => { session.load(source); }, [session, source]);
  return <>
    <button disabled={!snapshot.canUndo}
      onClick={() => session.execute({ type: 'undo' })}>Undo</button>
    <button disabled={!snapshot.canRedo}
      onClick={() => session.execute({ type: 'redo' })}>Redo</button>
    <MathEditorSurface session={session} locale="en" />
    <pre>{snapshot.latex}</pre>
  </>;
}
```

## Persistence and ownership

Persist the `MathDocument` passed to `onChange`; LaTeX is derived output and is not an editable round-trip format. The package does not parse arbitrary LaTeX. Validate externally supplied JSON before loading it: loading assumes a trusted, structurally valid document with unique IDs. There is no server save or collaboration transport built in.

Keep the mount host empty. The editor owns its descendants; framework rendering into the same host can destroy caret and composition state. Use one editing surface per session. Destroy the renderer on teardown; a session supplied by the host remains the host's responsibility.

See [session and DOM API](API-SESSION.md) for exact options, commands, events and cleanup, and [renderer differences](ADAPTERS.md#current-renderer-parity) before choosing a native wrapper over the rich React editor.
