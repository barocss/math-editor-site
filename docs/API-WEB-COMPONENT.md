# Web Component API guide

Use the custom element with plain HTML or a framework that can pass DOM properties and listen to native events. It uses the native renderer and light DOM, with no React dependency.

## Install and register

```sh
npm install @barocss/math-editor@0.2.1
```

```js
import { defineMathEditor } from '@barocss/math-editor/web-component';
import '@barocss/math-editor/style.css';
defineMathEditor();
```

```html
<barocss-math-editor locale="en" mode="inline" toolbar="false"></barocss-math-editor>
```

Call registration on the client. The default tag is `barocss-math-editor`; `defineMathEditor('my-formula')` registers a custom name. Repeated registration returns the existing constructor. Do not choose a tag another library owns.

## Properties and commands

```ts
import type { MathEditorElement } from '@barocss/math-editor/web-component';
import { createMathDocument } from '@barocss/math-editor/core';

const editor = document.querySelector<MathEditorElement>('barocss-math-editor');
if (!editor) throw new Error('Missing math element');
editor.value = createMathDocument('x'); // trusted MathDocument, resets undo
editor.session.execute({ type: 'structure', kind: 'superscript' });
editor.focusEditor();
const documentToSave = editor.value; // snapshot copy
```

Use the `value` **property**, not a JSON HTML attribute. Assigning it opens a new document and resets undo. The `session` property is readonly but its methods are available for commands, subscription and loading.

## Attributes

| Attribute | Values / default |
|---|---|
| `locale` | Registered locale code, default `ko` |
| `mode` | `inline` or `block`; default block |
| `toolbar` | `false` hides it; otherwise present means visible; absent follows mode |
| `line-numbers` | `false` hides UI line numbers; otherwise visible |
| `enter-behavior` | `commit` overrides block newline behavior; otherwise follows mode |

Set inline mode before loading a document. Inline mode rejects multiple top-level rows. Presence-only `toolbar` is true, whereas `toolbar="false"` is false.

## Events

```js
const save = event => {
  const { document, latex } = event.detail;
  console.log(document, latex);
};
editor.addEventListener('math-change', save);
editor.addEventListener('math-commit', event => console.log(event.detail.state.document));
editor.addEventListener('math-exit', event => console.log(event.detail.direction));
editor.addEventListener('math-cancel', () => console.log('Host decides whether to close'));
// On host teardown, remove your own listeners:
// editor.removeEventListener('math-change', save);
```

| Event | `detail` |
|---|---|
| `math-change` | `{ document, latex }` |
| `math-commit` | Full `MathSessionSnapshot` |
| `math-exit` | `{ direction: -1 | 1 }` |
| `math-cancel` | No detail payload |

Events bubble and are composed. Disconnect destroys the renderer; reconnect restores the same session/document/history. Permanent removal should also release host-owned subscriptions. Shared styles must be loaded in the page because this is light DOM, not a shadow-root widget.

## Complete form integration with JSON and LaTeX outputs

Custom elements do not automatically submit their document as form data. This function builds the form, synchronizes hidden fields, and calls a host callback with `FormData`. It does not assume a backend URL. Pass a trusted initial document and call the returned cleanup on route removal.

```js
import { defineMathEditor } from '@barocss/math-editor/web-component';
import '@barocss/math-editor/style.css';

export function mountFormulaForm(host, initialDocument, onSubmit) {
  defineMathEditor();
  const form = document.createElement('form');
  const editor = document.createElement('barocss-math-editor');
  editor.setAttribute('locale', 'en');
  editor.value = initialDocument;
  const json = document.createElement('input');
  const latex = document.createElement('input');
  json.type = latex.type = 'hidden';
  json.name = 'formulaDocument';
  latex.name = 'formulaLatex';
  const button = document.createElement('button');
  button.type = 'submit';
  button.textContent = 'Save formula';
  const sync = () => {
    const snapshot = editor.session.getSnapshot();
    json.value = JSON.stringify(snapshot.state.document);
    latex.value = snapshot.latex;
  };
  const submit = event => {
    event.preventDefault();
    sync(); // Include the initial value even when no edit occurred.
    onSubmit(new FormData(form));
  };
  editor.addEventListener('math-change', sync);
  form.addEventListener('submit', submit);
  form.append(editor, json, latex, button);
  host.append(form);
  sync();
  return () => {
    editor.removeEventListener('math-change', sync);
    form.removeEventListener('submit', submit);
    form.remove(); // disconnectedCallback releases the native renderer.
  };
}
```

The JSON field is the editable source; LaTeX is an export. Validate and authorize submitted JSON on your server. Browser form fields are not a trust boundary. The host callback can implement pending/error UI around its own request.

## Persistence and ownership

Persist the `MathDocument` passed to `onChange`; LaTeX is derived output and is not an editable round-trip format. The package does not parse arbitrary LaTeX. Validate externally supplied JSON before loading it: loading assumes a trusted, structurally valid document with unique IDs. There is no server save or collaboration transport built in.

Keep the mount host empty. The editor owns its descendants; framework rendering into the same host can destroy caret and composition state. Use one editing surface per session. Destroy the renderer on teardown; a session supplied by the host remains the host's responsibility.

See [session and DOM API](API-SESSION.md) for exact options, commands, events and cleanup, and [renderer differences](ADAPTERS.md#current-renderer-parity) before choosing a native wrapper over the rich React editor.
