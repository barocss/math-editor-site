# Framework adapters and embedding

## Framework-specific API guides

[Pure JavaScript](API-JAVASCRIPT.md) · [React](API-REACT.md) · [Web Component](API-WEB-COMPONENT.md) · [Vue 3](API-VUE.md) · [Svelte](API-SVELTE.md) · [Solid](API-SOLID.md) · [Session and DOM API](API-SESSION.md)


## Distribution architecture

One ESM npm package exposes independent entry points. This keeps document types, commands and clipboard formats on one version. Six separate npm packages are unnecessary until independently versioned adapters are useful.

```text
model / range / grids / suggestions / locale
                    ↓
               MathSession
                    ↓
          native DOM surface + toolbar
       ↙       ↓       ↓      ↓       ↘
 Web Component Vue   Svelte   Solid   React surface

Rich React MathEditor → same model operations, its own renderer/history
```

| Import | Purpose | Runtime dependency |
|---|---|---|
| `@barocss/math-editor` | Existing rich React editor and public model helpers | React + React DOM |
| `@barocss/math-editor/core` | All pure helpers, commands, sessions and locale registration | None |
| `@barocss/math-editor/dom` | Native surface and independent toolbar | Browser DOM |
| `@barocss/math-editor/web-component` | Explicit custom-element registration | Browser DOM |
| `@barocss/math-editor/react` | Existing `MathEditor` and native `MathEditorSurface` | React + React DOM |
| `@barocss/math-editor/vue` | Vue 3 directive `vMathEditor` | Vue host; type-only import |
| `@barocss/math-editor/svelte` | Svelte action `mathEditor` | Svelte host; type-only import |
| `@barocss/math-editor/solid` | Solid directive `mathEditor` | Solid |
| `@barocss/math-editor/style.css` | Shared presentation styles | None |

Framework peers are optional: install only the framework you import. Importing `core`, `dom` or `web-component` does not load React. DOM mounting and element registration are client-only; module import safety is not SSR rendering or hydration support. Use your framework's client lifecycle. The package is ESM-only and unbundled; use a bundler or browser import map. No CDN global/IIFE build is provided.

## Pure JavaScript, inline mode and external toolbars

```ts
import { createMathSession } from '@barocss/math-editor/core';
import { mountMathEditor, mountMathToolbar } from '@barocss/math-editor/dom';
import '@barocss/math-editor/style.css';

const session = createMathSession({ locale: 'en', mode: 'inline' });
const editor = mountMathEditor(document.querySelector('#formula'), {
  session,
  toolbar: false,
  onChange(document, latex) { save(document, latex); },
  onExit(direction) { restoreHostCaret(direction); },
});
const tools = mountMathToolbar(document.querySelector('#tools'), session, {
  kinds: ['fraction', 'root', 'superscript'],
  onExecute: () => editor.focus(),
});
// A custom button, floating menu or professional toolbar uses the same API.
session.execute({ type: 'text', value: 'α' });
session.execute({ type: 'structure', kind: 'fraction' });
session.execute({ type: 'template', id: 'quadratic' });

// On host teardown:
tools.destroy();
editor.destroy();
session.destroy();
```

Use real non-null HTMLElements for the mount hosts. `toolbar` accepts `false`, `true`, or a list of structure kinds. By default block mode shows tools and inline mode hides them. `mountMathToolbar` may live anywhere in the page and retains the session's last caret/range. Custom tools can use `session.getSnapshot()` and `session.subscribe()` for context and disabled states, then call `execute`, `apply`, or `paste`. For example, `session.apply(resizeMatrix(session.getSnapshot().state, 'row', 'delete'))` reuses the grid command. Avoid replacing the session on each framework render.

`inline` means **one top-level equation row**, not a fixed-height text glyph. Fractions, matrices, aligned blocks and cases may still be tall. Top-level newline commands and multiline paste return `false` without altering the document. Loading a multiline document or changing such a document to inline throws an error. Enter first accepts a visible suggestion. Shift+Enter inside a grid edits that grid. Otherwise inline Enter calls `onCommit(snapshot)`, or `onExit(1)` when no commit callback is supplied. Tab navigates slots and calls `onExit` at an outer boundary when provided. The host owns the surrounding prose, focus restoration and its own undo integration. No automatic `contenteditable` host binding is included.

Session snapshots are copies. `subscribe((snapshot, documentChanged) => ...)` also reports caret/locale changes with `false`; save only document changes. `load()` opens a trusted document and resets undo. `defaultValue`, `session` and `menuHost` are mount-only; call `session.load()` to open another document. Options passed to `update()` merge with existing options; explicitly pass `toolbar: false` or another concrete value to change them. Externally supplied sessions survive renderer teardown; internally created sessions are owned by the renderer. Use one editing surface per session; multiple synchronized simultaneous editors are not a supported collaboration feature.

## React

```tsx
import { MathEditorSurface } from '@barocss/math-editor/react';
<MathEditorSurface locale="en" mode="inline" toolbar={false} onChange={save} />
```

Keep `MathEditor` for the existing full editor, including the symbol browser and richer selection UI. `MathEditorSurface` uses the new native renderer and options. They share document formats, not a live history instance. Do not assume feature parity; see below.

## Web Component

```ts
import { defineMathEditor, type MathEditorElement } from '@barocss/math-editor/web-component';
defineMathEditor(); // once; repeated calls for the same tag return its constructor
const element = document.querySelector('barocss-math-editor') as MathEditorElement;
element.value = savedDocument;
element.addEventListener('math-change', event => {
  const { document, latex } = (event as CustomEvent).detail;
  save(document, latex);
});
```

```html
<barocss-math-editor locale="en" mode="inline" toolbar="false"></barocss-math-editor>
```

The element uses light DOM, so import the shared CSS in the page. Attributes: `locale`, `mode`, `toolbar`, `line-numbers`, `enter-behavior`. Use the `value` property for a document, not a JSON attribute. `session` is available for custom toolbar commands; `focusEditor()` activates the caret. `math-change`, `math-commit`, `math-cancel` and `math-exit` bubble across boundaries. Disconnect removes the DOM and subscriptions; reconnect restores the same document and history. Set the mode before loading documents to apply its policy. Do not reuse a custom-element tag already owned by another library.

## Vue 3

```vue
<script setup lang="ts">
import { vMathEditor } from '@barocss/math-editor/vue';
import '@barocss/math-editor/style.css';
const options = { locale: 'en', toolbar: false };
</script>
<template><div v-math-editor="options" /></template>
```

The directive mounts, updates options and destroys through Vue's directive hooks. Keep its host empty: the editor owns the children. [Vue directive lifecycle](https://vuejs.org/guide/reusability/custom-directives.html).

## Svelte

```svelte
<script>
  import { mathEditor } from '@barocss/math-editor/svelte';
  import '@barocss/math-editor/style.css';
</script>
<div use:mathEditor={{ locale: 'en', mode: 'inline' }}></div>
```

The action returns `update` and `destroy`. Svelte 5 was used for the browser integration test; Svelte 4 is allowed by the peer range but not separately tested. No compiler or Svelte runtime is shipped in the action. [Svelte actions](https://svelte.dev/docs/svelte/use).

## Solid

```tsx
import { mathEditor } from '@barocss/math-editor/solid';
import '@barocss/math-editor/style.css';
// Keep the directive import as a value in TypeScript builds.
void mathEditor;
<div use:mathEditor={{ locale: 'en', toolbar: false }} />
```

The directive reads its accessor in a reactive effect and cleans up with `onCleanup`. Do not also render children into its host. [Solid directives](https://docs.solidjs.com/reference/jsx-attributes/use).

## Current renderer parity

| Capability | Existing React `MathEditor` | Native surface and all wrappers |
|---|---|---|
| 13 structure kinds / 90 symbol suggestions / templates | Yes | Same model and suggestion catalog |
| Multiline block, grids and grid keyboard commands | Yes | Implemented; representative Chromium coverage |
| Single top-level row inline policy | No dedicated prop | Yes |
| Separately mounted/custom toolbar | Not a session API | Yes |
| English/Korean/custom locale registry | Yes | Yes |
| Active input granularity | Lexical token | Whole logical text run |
| Variable/constant/symbol colors | Editing and preview | Preview segments; active run uses one color |
| Pointer range, structural clipboard, wrapping | Rich implementation | Initial implementation; whole-run visual highlight |
| Drag starting inside the active input across structures | Yes | Pending; start in preview |
| Searchable all-symbol panel, matrix context toolbar | Yes | Pending; suggestions/core commands available |
| Composition candidate preview | Disabled choices while composing | Menu hidden while composing |
| Keyboard model ranges / OS IME matrix / full accessibility audit | Pending | Pending |

The native renderer is an integration preview, not a replacement of the rich React editor. Completing parity before switching the main entry is the next release gate. Trusted document loading still needs schema/ID validation. LaTeX is export-only; plain-text paste is not a LaTeX parser.

## Local verification and packaging

The demo's `/adapters.html` mounts pure JS, inline, custom French, Web Component, Vue, Svelte, Solid and React surfaces. Its checked-in Svelte harness is generated with `node packages/math-editor/examples/compile-svelte.mjs`; this fixture tooling is not part of the published API.

```sh
pnpm --filter @barocss/math-editor build
pnpm --filter @barocss/math-editor test
pnpm --filter @barocss/math-demo test:e2e
pnpm --filter @barocss/math-demo build
# Inspect a tarball locally; this does not publish:
pnpm --dir packages/math-editor pack --pack-destination /tmp/math-editor-package
node packages/math-editor/scripts/check-package.mjs /tmp/math-editor-package/barocss-math-editor-0.1.0.tgz
```

Release work still includes package ownership/versioning, an explicit release decision, supported-browser and framework-version CI, bundle budgets and renderer parity. No registry publication has been performed.

## Independent outputs and host completion

The DOM entry also exports `mountMathLatex` and `mountMathPreview`. See [Embedding](EMBEDDING.md) for the four-surface composition contract, native `enterBehavior`/`onCommit`/`onCancel`, popup draft handling and Note-style next-block creation. The rich React editor adds `toolbar`, `toolbarEnd` and `showTokenLegend`; its dedicated single-line/host-completion API remains the native `MathEditorSurface`.
