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

## Persistence and ownership

Persist the `MathDocument` passed to `onChange`; LaTeX is derived output and is not an editable round-trip format. The package does not parse arbitrary LaTeX. Validate externally supplied JSON before loading it: loading assumes a trusted, structurally valid document with unique IDs. There is no server save or collaboration transport built in.

Keep the mount host empty. The editor owns its descendants; framework rendering into the same host can destroy caret and composition state. Use one editing surface per session. Destroy the renderer on teardown; a session supplied by the host remains the host's responsibility.

See [session and DOM API](API-SESSION.md) for exact options, commands, events and cleanup, and [renderer differences](ADAPTERS.md#current-renderer-parity) before choosing a native wrapper over the rich React editor.
