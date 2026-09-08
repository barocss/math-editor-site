# Pure JavaScript API guide

Use this integration for vanilla JavaScript, custom application shells and imperative editor hosts. Neither `/core` nor `/dom` imports React. Examples assume an ESM bundler such as Vite; the package does not provide a global script/IIFE build.

## Install

```sh
npm install @barocss/math-editor@0.1.0
```

## Mount a complete editor

Create `<div id="formula"></div><pre id="latex"></pre>` in your page, then run this module after those elements exist:

```js
import { createMathSession } from '@barocss/math-editor/core';
import { mountMathEditor } from '@barocss/math-editor/dom';
import '@barocss/math-editor/style.css';

const host = document.querySelector('#formula');
const output = document.querySelector('#latex');
if (!(host instanceof HTMLElement) || !output) throw new Error('Missing editor host');

const session = createMathSession({ locale: 'en', mode: 'block' });
const editor = mountMathEditor(host, {
  session,
  toolbar: true,
  onChange(document, latex) {
    localStorage.setItem('formula', JSON.stringify(document));
    output.textContent = latex;
  },
});
editor.focus();

// Call when your route/component is removed.
function dispose() {
  editor.destroy();
  session.destroy();
}
```

Creating a session is optional: without `session`, the renderer creates and owns one, accessible as `editor.session`. In that case `editor.destroy()` also releases the owned session.

## Open, update and execute

```js
// savedDocument must have been validated by your host.
session.load(savedDocument); // resets undo history
editor.update({ locale: 'ko', toolbar: false });
session.execute({ type: 'text', value: 'α' });
session.execute({ type: 'structure', kind: 'fraction' });
session.execute({ type: 'undo' });
const snapshot = session.getSnapshot();
console.log(snapshot.latex, snapshot.canUndo);
```

These snippets continue the mounted example. `defaultValue`, `session` and `menuHost` are read at mount; use `load()` rather than changing `defaultValue`. `update()` merges options: pass `false` explicitly to hide a toolbar.

## External toolbar

Create a separate `#tools` element. It can sit beside the document or in a floating panel:

```js
import { mountMathToolbar } from '@barocss/math-editor/dom';
const toolsHost = document.querySelector('#tools');
if (!(toolsHost instanceof HTMLElement)) throw new Error('Missing toolbar host');
const tools = mountMathToolbar(toolsHost, session, {
  kinds: ['fraction', 'root', 'superscript'],
  onExecute: () => editor.focus(),
});
// Include this in dispose(), before destroying editor/session:
// tools.destroy();
```

A toolbar kind list controls the visible buttons, not which structures may exist in a document. Validate the final model if your product supports only a subset.

## Inline and popup hosting

Set `mode: 'inline'` for a single top-level row and `toolbar: false` for an editor-only surface. Inline equations may still be tall, for example fractions or matrices. Inline Enter first accepts a suggestion; otherwise it invokes `onCommit(snapshot)` or `onExit(1)`. `onExit(-1 | 1)` asks your host to restore its caret before/after the equation.

For a popup, create a draft session from a copy of the original document. Commit `session.getSnapshot().state.document` only after Apply. Cancel destroys the draft without modifying the original. Set `menuHost` to your modal element if your modal's focus trap needs suggestion menus inside it. See the complete [popup composition](EMBEDDING.md).

## Common mistakes

- Importing the package root in a React-free application: use `/core` and `/dom` instead.
- Mounting before an element exists or re-mounting on each keystroke.
- Saving every `subscribe` callback: caret and locale changes also emit; check `documentChanged`.
- Treating LaTeX output as a source document or a computation API.

## Complete modal: Apply, Cancel and focus restoration

This function creates its own native dialog and draft. Call it from a user action with a trusted document. It resolves to a new document on Apply, or `undefined` on Cancel. No host document changes while typing. Block mode permits multiline formulas; use inline mode only when the source is single-row.

```js
import { createMathSession } from '@barocss/math-editor/core';
import { mountMathEditor } from '@barocss/math-editor/dom';
import '@barocss/math-editor/style.css';

export function editFormula(original) {
  const previousFocus = document.activeElement;
  const dialog = document.createElement('dialog');
  const title = document.createElement('h2');
  title.textContent = 'Edit formula';
  const titleId = `formula-${crypto.randomUUID()}`;
  title.id = titleId;
  dialog.setAttribute('aria-labelledby', titleId);
  const host = document.createElement('div');
  const apply = document.createElement('button');
  const cancel = document.createElement('button');
  apply.textContent = 'Apply';
  cancel.textContent = 'Cancel';
  apply.type = cancel.type = 'button';
  dialog.append(title, host, cancel, apply);
  document.body.append(dialog);
  const session = createMathSession({ document: original, locale: 'en' });

  return new Promise(resolve => {
    let finished = false;
    const finish = accepted => {
      if (finished) return;
      finished = true;
      const result = accepted ? session.getSnapshot().state.document : undefined;
      editor.destroy();
      session.destroy();
      dialog.close();
      dialog.remove();
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected)
        previousFocus.focus();
      resolve(result);
    };
    const editor = mountMathEditor(host, {
      session,
      menuHost: dialog,
      onCancel: () => finish(false),
    });
    apply.addEventListener('click', () => finish(true));
    cancel.addEventListener('click', () => finish(false));
    dialog.addEventListener('cancel', event => {
      event.preventDefault();
      finish(false);
    });
    dialog.addEventListener('close', () => finish(false));
    dialog.showModal();
    editor.focus();
  });
}
```

Use `const next = await editFormula(currentDocument); if (next) commitToHost(next);` in your host's click handler. `currentDocument` and `commitToHost` belong to your application. Commit as one host undo transaction. For route teardown while a modal is open, close the dialog before removing its DOM so the `close` handler releases the draft.

## Persistence and ownership

Persist the `MathDocument` passed to `onChange`; LaTeX is derived output and is not an editable round-trip format. The package does not parse arbitrary LaTeX. Validate externally supplied JSON before loading it: loading assumes a trusted, structurally valid document with unique IDs. There is no server save or collaboration transport built in.

Keep the mount host empty. The editor owns its descendants; framework rendering into the same host can destroy caret and composition state. Use one editing surface per session. Destroy the renderer on teardown; a session supplied by the host remains the host's responsibility.

See [session and DOM API](API-SESSION.md) for exact options, commands, events and cleanup, and [renderer differences](ADAPTERS.md#current-renderer-parity) before choosing a native wrapper over the rich React editor.
