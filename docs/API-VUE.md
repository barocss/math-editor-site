# Vue 3 API guide

The `vMathEditor` directive mounts the native DOM editor. It is not a Vue component and does not implement `v-model`.

## Install

```sh
npm install @barocss/math-editor@0.2.1 vue
```

## Complete component

```vue
<script setup lang="ts">
import { computed, ref } from 'vue';
import { vMathEditor } from '@barocss/math-editor/vue';
import type { MathDocument } from '@barocss/math-editor/core';
import type { DOMMathEditorOptions } from '@barocss/math-editor/dom';
import '@barocss/math-editor/style.css';

const locale = ref('en');
const latex = ref('');
const saved = ref<MathDocument>();
const options = computed<DOMMathEditorOptions>(() => ({
  locale: locale.value,
  mode: 'inline',
  toolbar: false,
  onChange(document, output) {
    saved.value = document;
    latex.value = output;
  },
}));
</script>

<template>
  <button @click="locale = locale === 'en' ? 'ko' : 'en'">Language</button>
  <div v-math-editor="options"></div>
  <pre>{{ latex }}</pre>
</template>
```

With `<script setup>`, the imported `vMathEditor` is available as `v-math-editor`. Outside script setup, register it under `directives: { mathEditor: vMathEditor }`.

## Lifecycle and document replacement

| Vue hook | Adapter behavior |
|---|---|
| `mounted` | `mountMathEditor(host, options)` |
| `updated` | `editor.update(options)` |
| `unmounted` | `editor.destroy()` |

Reactive options change locale, mode, toolbar and callbacks without replacing history. `defaultValue` and `session` are mount-only; updating the options object is not a document load.

For commands or opening another document, create one `createMathSession()` instance in setup, pass it as `session` in options, and call `session.load(validatedDocument)`. Register host subscription cleanup and `session.destroy()` with `onUnmounted`. Avoid deeply proxying the session or recreating it inside a computed getter.

## Inline, popup and SSR

Use `mode: 'inline'` and `onCommit`/`onExit` for host caret handoff. In a modal, pass the modal element as mount-only `menuHost` when required by its focus trap. A new modal draft session keeps Cancel from modifying the original. Vue's `mounted` hook runs client-side; browser storage still belongs in your own client lifecycle. Keep the directive host empty and do not combine it with `v-html` or rendered children.

## Document switching, history buttons and explicit save

This complete component uses two trusted in-memory documents. Save stores a snapshot; switching tabs discards unsaved changes and resets history. Add a dirty-state confirmation in a product that must protect unsaved edits. The session is a plain variable, not a deeply reactive object.

```vue
<script setup lang="ts">
import { ref, shallowRef, onUnmounted } from 'vue';
import { vMathEditor } from '@barocss/math-editor/vue';
import { createMathSession, createMathDocument } from '@barocss/math-editor/core';
import '@barocss/math-editor/style.css';

const documents = [createMathDocument('x'), createMathDocument('y')];
const active = ref(0);
const session = createMathSession({ document: documents[0], locale: 'en' });
const snapshot = shallowRef(session.getSnapshot());
const unsubscribe = session.subscribe(next => { snapshot.value = next; });
const options = { session, locale: 'en' };
function open(index: number) {
  active.value = index;
  session.load(documents[index]);
}
function save() {
  documents[active.value] = session.getSnapshot().state.document;
}
onUnmounted(() => { unsubscribe(); session.destroy(); });
</script>

<template>
  <button @click="open(0)">Formula A</button>
  <button @click="open(1)">Formula B</button>
  <button :disabled="!snapshot.canUndo" @click="session.execute({ type: 'undo' })">Undo</button>
  <button :disabled="!snapshot.canRedo" @click="session.execute({ type: 'redo' })">Redo</button>
  <button @click="save">Save formula {{ active + 1 }}</button>
  <div v-math-editor="options"></div>
  <pre>{{ snapshot.latex }}</pre>
</template>
```

## Persistence and ownership

Persist the `MathDocument` passed to `onChange`; LaTeX is derived output and is not an editable round-trip format. The package does not parse arbitrary LaTeX. Validate externally supplied JSON before loading it: loading assumes a trusted, structurally valid document with unique IDs. There is no server save or collaboration transport built in.

Keep the mount host empty. The editor owns its descendants; framework rendering into the same host can destroy caret and composition state. Use one editing surface per session. Destroy the renderer on teardown; a session supplied by the host remains the host's responsibility.

See [session and DOM API](API-SESSION.md) for exact options, commands, events and cleanup, and [renderer differences](ADAPTERS.md#current-renderer-parity) before choosing a native wrapper over the rich React editor.
