# Framework adapters and embedding

## Framework-specific API guides

[Pure JavaScript](API-JAVASCRIPT.md) · [React](API-REACT.md) · [Web Component](API-WEB-COMPONENT.md) · [Vue 3](API-VUE.md) · [Svelte](API-SVELTE.md) · [Solid](API-SOLID.md) · [Session and DOM API](API-SESSION.md)

Each guide covers installation, a complete integration, document replacement, saving, lifecycle cleanup and host limitations.


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

`MathEditor` keeps the rich React renderer and token-level active input. `MathEditorSurface` uses the native renderer and session options. The workspace native toolbar now includes the symbol browser, templates and grid context controls described below; these additions are included in 0.4.0. The renderers share document formats but own separate history instances. See the remaining differences below.

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
| Structure, symbol and template catalog | Yes | Same model and suggestion catalog |
| Suggestion and selection menu presentation | Glyph, name, detail and keyboard guidance | Same presentation in the 0.4.0 release; options scroll independently of the host |
| Multiline block, grids and grid keyboard commands | Yes | Implemented; representative Chromium coverage |
| Single top-level row inline policy | No dedicated prop | Yes |
| Separately mounted/custom toolbar | Not a session API | Yes |
| English/Korean/custom locale registry | Yes | Yes |
| Active input granularity | Lexical token | Lexical token (workspace) |
| Variable/constant/symbol colors | Editing and preview | Editing and preview (workspace); named functions retain their own color |
| Pointer range, structural clipboard, wrapping | Yes | Exact partial-text highlights included in 0.4.0 |
| Drag starting inside the active input across structures | Yes | Implemented in workspace; local input selection becomes a model range after leaving the input |
| Searchable all-symbol panel, templates and matrix presets | Yes | Available through More tools in 0.4.0 |
| Matrix rectangles, shape-checked clipboard and transpose | Implemented in workspace | Implemented in workspace |
| Active grid row/column and delimiter controls | Yes | Implemented in workspace; aligned/cases expose row controls |
| Shift+arrow model ranges | Yes | Yes; vertical extension uses logical line offsets |
| Composition candidate preview | Disabled choices while composing | Menu hidden and toolbar mutations disabled while composing |
| OS IME matrix / full accessibility audit | Deferred / pending | Deferred / pending |

The native renderer remains an integration preview. Its active input now covers one lexical token, with model offsets mapped across token boundaries. Composition keeps that input stable until commit. A persistent preferred column for vertical navigation, and a full accessibility/browser audit remain open. Complete English/Korean packs are bundled; additional complete packs and native OS IME validation remain deferred work. The new toolbar and selection UI use existing model operations and add no LaTeX syntax. Use `parseMathDocument` to validate schema and IDs before trusted document loading. Bounded LaTeX import is available through `importLatex`; ordinary plain-text paste remains literal. The workspace adds explicit `pasteLatex` and Alt+Shift+V insertion, recent/favorite items, and contextual presentation controls; see [editing utilities](API-SESSION.md#editing-utilities--workspace).

## Local verification and packaging

The demo's `/adapters.html` mounts pure JS, inline, custom French, Web Component, Vue, Svelte, Solid and React surfaces. Its checked-in Svelte harness is generated with `node packages/math-editor/examples/compile-svelte.mjs`; this fixture tooling is not part of the published API.

```sh
pnpm --filter @barocss/math-editor build
pnpm --filter @barocss/math-editor test
pnpm --filter @barocss/math-demo test:e2e
pnpm --filter @barocss/math-demo build
# Inspect a tarball locally; this does not publish:
pnpm --dir packages/math-editor pack --pack-destination /tmp/math-editor-package
node packages/math-editor/scripts/check-package.mjs /tmp/math-editor-package/barocss-math-editor-0.2.0.tgz
```

Release work still includes package ownership/versioning, an explicit release decision, supported-browser and framework-version CI, bundle budgets and renderer parity. No registry publication has been performed.

## Independent outputs and host completion

The DOM entry also exports `mountMathLatex` and `mountMathPreview`. See [Embedding](EMBEDDING.md) for the four-surface composition contract, native `enterBehavior`/`onCommit`/`onCancel`, popup draft handling and Note-style next-block creation. The rich React editor adds `toolbar`, `toolbarEnd` and `showTokenLegend`; its dedicated single-line/host-completion API remains the native `MathEditorSurface`.

## Compact and filtered toolbars (workspace)

Toolbars initially show up to eight structure buttons. More tools / Fewer tools toggles the expanded section without changing the formula or history. In the workspace, native More tools also exposes the searchable All symbols panel, templates, 2×2/3×3/4×4 matrix and identity presets, and symbol shortcuts. It remains available when every selected structure button already fits. Undo and Redo stay visible; rich React also retains its `toolbarEnd` slot. The layout wraps on narrow screens.

The native grid toolbar follows the active caret: matrices expose row/column insertion and deletion plus delimiter selection; aligned/cases expose row operations. A text or model selection disables these grid mutations. These native toolbar additions are included in 0.4.0. See [the session toolbar API](API-SESSION.md#independent-toolbar-and-outputs) for attaching, disabling and destroying an external toolbar.

```tsx
<MathEditor toolbar={['fraction', 'root', 'superscript', 'matrix']}
  toolbarMaxItems={3} />
```

```js
mountMathEditor(host, {
  session,
  toolbar: ['fraction', 'root', 'norm'],
  toolbarMaxItems: 2,
});
mountMathToolbar(toolbarHost, session, {
  kinds: ['fraction', 'root', 'norm'],
  maxItems: 2,
});
```

`toolbar: false` hides the toolbar. A structure array filters visible structure buttons. The workspace native toolbar also filters templates by all their structure kinds and limits matrix presets/context controls to allowed grid kinds; symbol search remains available. Rich React's auxiliary controls retain their existing behavior. Toolbar filtering does not restrict suggestions, parsing or the model. `toolbarMaxItems` (independent toolbar: `maxItems`) is a nonnegative count; zero initially hides all structure buttons behind More. A sufficiently large count shows all selected structure buttons initially. Expanded state belongs to the mounted toolbar and is not saved in the math document. The rich React `toolbar` array and compact behavior are available in 0.2.0; the native discovery/context additions are included in 0.4.0.

## Style customization

Use inherited CSS variables for colors, slot backgrounds, typography, toolbar density and menu appearance. Scoped themes also follow portaled suggestions in both renderers. See [Styling & themes](STYLING.md) for the public variables, dark/monochrome examples, shared toolbars and iframe/plugin sizing.
