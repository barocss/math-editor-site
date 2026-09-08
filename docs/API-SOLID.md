# Solid API guide

The `mathEditor` directive mounts the native editor, updates options in a reactive effect and tears down through Solid's owner cleanup.

## Install

```sh
npm install @barocss/math-editor@0.1.0 solid-js
```

## Complete component

```tsx
import { createSignal } from 'solid-js';
import { mathEditor } from '@barocss/math-editor/solid';
import '@barocss/math-editor/style.css';

// Preserve the value import used by the JSX directive transform.
void mathEditor;
export function Formula() {
  const [locale, setLocale] = createSignal('en');
  const [latex, setLatex] = createSignal('');
  return <>
    <button onClick={() => setLocale(locale() === 'en' ? 'ko' : 'en')}>Language</button>
    <div use:mathEditor={{
      locale: locale(),
      mode: 'inline',
      toolbar: false,
      onChange(document, output) {
        setLatex(output);
        // Persist document through your application here.
      },
    }} />
    <pre>{latex()}</pre>
  </>;
}
```

The adapter augments Solid's JSX `Directives` type. Keep the directive import as a runtime value, and compile this with Solid's JSX transform, not the React transform.

## Reactive options and sessions

The directive reads an accessor in `createEffect`, so a signal read in its options updates the renderer. It mounts once; `defaultValue`, `session` and `menuHost` stay mount-only. There is no controlled document prop.

Create an external `createMathSession()` once in the component body when you need commands, undo state or an external toolbar. Pass it as `session`, use `session.load(validatedDocument)` to open another document, and register your own subscription/session cleanup with `onCleanup`. Do not create sessions in reactive option expressions.

## Host lifecycle

The directive calls `editor.destroy()` on cleanup. It cannot clean up arbitrary host event listeners or save subscriptions. Its host must remain an empty DOM element in your JSX because the editor owns descendants. DOM mounting is client-only; use the framework's client-only boundary when integrating into an SSR route.

For inline or popup integration, use the native `mode`, `enterBehavior`, `onCommit`, `onCancel` and `onExit` options described in the shared API. Those notifications do not automatically create the next prose block or close a modal.

## History, templates and saved-document restoration

This complete component keeps the session outside reactive effects, subscribes to snapshots, and releases the subscription on teardown. Save is in-memory; Restore opens that snapshot and clears undo history.

```tsx
import { createSignal, onCleanup } from 'solid-js';
import { mathEditor } from '@barocss/math-editor/solid';
import { createMathSession, createMathDocument } from '@barocss/math-editor/core';
import '@barocss/math-editor/style.css';

void mathEditor;
export function FormulaWithHistory() {
  let saved = createMathDocument('x');
  const session = createMathSession({ document: saved, locale: 'en' });
  const [snapshot, setSnapshot] = createSignal(session.getSnapshot());
  const unsubscribe = session.subscribe(next => setSnapshot(next));
  onCleanup(() => { unsubscribe(); session.destroy(); });
  return <>
    <button disabled={!snapshot().canUndo}
      onClick={() => session.execute({ type: 'undo' })}>Undo</button>
    <button disabled={!snapshot().canRedo}
      onClick={() => session.execute({ type: 'redo' })}>Redo</button>
    <button onClick={() => session.execute({ type: 'template', id: 'quadratic' })}>Quadratic formula</button>
    <button onClick={() => { saved = session.getSnapshot().state.document; }}>Save</button>
    <button onClick={() => session.load(saved)}>Restore saved</button>
    <div use:mathEditor={{ session, locale: 'en' }} />
    <pre>{snapshot().latex}</pre>
  </>;
}
```

## Persistence and ownership

Persist the `MathDocument` passed to `onChange`; LaTeX is derived output and is not an editable round-trip format. The package does not parse arbitrary LaTeX. Validate externally supplied JSON before loading it: loading assumes a trusted, structurally valid document with unique IDs. There is no server save or collaboration transport built in.

Keep the mount host empty. The editor owns its descendants; framework rendering into the same host can destroy caret and composition state. Use one editing surface per session. Destroy the renderer on teardown; a session supplied by the host remains the host's responsibility.

See [session and DOM API](API-SESSION.md) for exact options, commands, events and cleanup, and [renderer differences](ADAPTERS.md#current-renderer-parity) before choosing a native wrapper over the rich React editor.
