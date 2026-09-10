# Svelte API guide

`mathEditor` is a Svelte action around the native DOM editor. Svelte 5 is covered by the integration harness; the package peer range also permits Svelte 4, which is not separately certified.

## Install

```sh
npm install @barocss/math-editor@0.4.0 svelte
```

## Complete component

This legacy-syntax component works with Svelte 4 and Svelte 5:

```svelte
<script lang="ts">
  import { mathEditor } from '@barocss/math-editor/svelte';
  import type { DOMMathEditorOptions } from '@barocss/math-editor/dom';
  import '@barocss/math-editor/style.css';

  let locale = 'en';
  let latex = '';
  $: options = {
    locale,
    mode: 'inline',
    toolbar: false,
    onChange(document, output) {
      latex = output;
      // Persist document through your application here.
    },
  } satisfies DOMMathEditorOptions;
</script>

<button on:click={() => locale = locale === 'en' ? 'ko' : 'en'}>Language</button>
<div use:mathEditor={options}></div>
<pre>{latex}</pre>
```

In a Svelte 5 runes component, use `$state` for locale/output and `$derived` for the options object. The action itself is unchanged.

## Action contract

`mathEditor(host, options)` returns `update(next)` and `destroy()`. Svelte invokes these as the action parameter changes and the element is removed. Mutable options merge into the renderer; explicitly use `toolbar: false` to hide tools.

For an external toolbar or loading another document, create one `createMathSession()` per component instance and pass it as `session`. Call `session.load(validatedDocument)` to reset document/history. Use `onDestroy` to release host subscriptions and the external session. Do not expect a changed `defaultValue` or `session` action parameter to remount the editor; use a keyed block for a deliberate remount.

## Popup and SSR

Actions mount in the browser. Avoid `document`, `window` and localStorage at module initialization in SSR applications. A popup should create a fresh draft session and commit only on Apply. `onCancel` is a host notification; it does not close your dialog or revert your data automatically. Keep the action host empty; do not render Svelte children into its editor subtree.

## Svelte 5 runes: session, Undo and saved snapshot

This is a complete runes component, not legacy `$:` syntax. Save retains a structured snapshot in memory; Restore deliberately resets undo history. Replace the in-memory persistence with the storage adapter in the shared API when needed.

```svelte
<script lang="ts">
  import { onDestroy } from 'svelte';
  import { mathEditor } from '@barocss/math-editor/svelte';
  import { createMathSession, createMathDocument } from '@barocss/math-editor/core';
  import '@barocss/math-editor/style.css';

  let saved = createMathDocument('x');
  const session = createMathSession({ document: saved, locale: 'en' });
  let snapshot = $state(session.getSnapshot());
  const unsubscribe = session.subscribe(next => { snapshot = next; });
  onDestroy(() => { unsubscribe(); session.destroy(); });
</script>

<button disabled={!snapshot.canUndo} onclick={() => session.execute({ type: 'undo' })}>Undo</button>
<button disabled={!snapshot.canRedo} onclick={() => session.execute({ type: 'redo' })}>Redo</button>
<button onclick={() => { saved = session.getSnapshot().state.document; }}>Save</button>
<button onclick={() => session.load(saved)}>Restore saved</button>
<div use:mathEditor={{ session, locale: 'en' }}></div>
<pre>{snapshot.latex}</pre>
```

## Persistence and ownership

Persist the `MathDocument` passed to `onChange`; LaTeX is derived output and is not an editable round-trip format. The package does not parse arbitrary LaTeX. Validate externally supplied JSON before loading it: loading assumes a trusted, structurally valid document with unique IDs. There is no server save or collaboration transport built in.

Keep the mount host empty. The editor owns its descendants; framework rendering into the same host can destroy caret and composition state. Use one editing surface per session. Destroy the renderer on teardown; a session supplied by the host remains the host's responsibility.

See [session and DOM API](API-SESSION.md) for exact options, commands, events and cleanup, and [renderer differences](ADAPTERS.md#current-renderer-parity) before choosing a native wrapper over the rich React editor.
