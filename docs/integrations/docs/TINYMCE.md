# TinyMCE integration (development preview)

The examples below use its public entry points. See the [release guide](RELEASING.md).

[Open the TinyMCE example](/integrations/?editor=tinymce) · [Host support](../HOST-SUPPORT.md) · [Validation](../VALIDATION.md)

This independently implemented adapter uses TinyMCE 8's public plugin, selection,
serialization, mode and undo APIs. It does not depend on another math editor's code.

```ts
import tinymce from "tinymce";
import katex from "katex";
import { registerBarocssMath } from "@barocss/math-editor-tinymce";
import "@barocss/math-editor/style.css";
import "@barocss/math-editor-tinymce/style.css";
import "katex/dist/katex.min.css";

registerBarocssMath(tinymce, {
  locale: "en",
  render(latex, host, displayMode) {
    // Optional renderer: treat LaTeX as untrusted input.
    katex.render(latex, host, {
      displayMode,
      throwOnError: false,
      trust: false,
    });
  },
});

await tinymce.init({
  target: document.querySelector<HTMLElement>("#editor")!,
  // Configure the TinyMCE license and locally served assets in your host.
  plugins: "barocssmath",
  toolbar: "undo redo | barocssmath",
  menu: { insert: { title: "Insert", items: "barocssmath barocssmathblock" } },
  noneditable_class: "mceNonEditable",
});
```

Register the plugin before `tinymce.init`. Options are captured per editor when
it initializes. `editing: "inline"` is the default: an existing formula opens at
its position in the text, and insertion opens at the current selection. Both
inline TinyMCE hosts and classic iframe hosts support this behavior. The math
field lives in the same document as the formula.

Choose `editing: "panel"` for the previous explicit Apply/Cancel workflow.
`panelHost` applies only to that option and must be outside TinyMCE's editable
body. Without it, the panel follows the editable element in inline TinyMCE mode
or the editor container in classic iframe mode. `toolbarHost` can provide a
separate math toolbar in either editing mode, including outside an iframe.

### Styles in a classic iframe

CSS imported into the application page does not style TinyMCE's iframe. Serve the
core CSS, this adapter's CSS, and any preview renderer's CSS (with their font
assets) inside the iframe using TinyMCE's `content_css` option. For example,
after copying/bundling those assets to your application's public asset directory:

```ts
await tinymce.init({
  target: document.querySelector<HTMLTextAreaElement>("#editor")!,
  plugins: "barocssmath",
  content_css: [
    "/assets/math-editor.css", // @barocss/math-editor/style.css
    "/assets/math-editor-tinymce.css", // @barocss/math-editor-tinymce/style.css
    "/assets/katex.min.css", // When using the optional KaTeX preview renderer
  ],
  // Supply your normal TinyMCE assets, toolbar and license configuration.
});
```

Keep the application-page CSS imports when using an outside toolbar or panel.
The asset URLs above are examples; the package does not inject styles into
another document automatically.

The `barocssmath` toolbar button edits a selected formula or starts an inline
formula. Click an existing formula, or select it and press Enter, to edit it.
The Insert menu offers inline and block formulas. Existing unsupported model data
remains visible and cannot be replaced by an empty draft.

```ts
import type { TinyMCEMathPlugin } from "@barocss/math-editor-tinymce";

const math = editor.plugins.barocssmath as TinyMCEMathPlugin;
math.insert(String.raw`\frac{x^2}{y}`, "inline");
math.insert(String.raw`\begin{pmatrix}1&0\\0&1\end{pmatrix}`, "block");
math.edit(); // Selected formula; returns false when editing is unavailable.
math.cancel();

editor.execCommand("BarocssMath", false, { kind: "block", latex: "x=y" });
const html = editor.getContent();
editor.setContent(html);
editor.mode.set("readonly");
editor.remove();
```

Opening or cancelling a draft does not modify saved host content. The inline
insertion marker preserves any selected prose until Apply; Cancel restores that
selection. Apply replaces or inserts one atomic node inside one
`undoManager.transact` call. Clicking outside a compact inline field commits
without taking focus back. Ctrl/Cmd+Enter applies explicitly; Escape first
closes suggestions and then cancels. Expanding More tools keeps the draft open
until an explicit Apply/Cancel, matching the shared field's panel behavior.

Temporary controls stop input, clipboard and pointer events from reaching the
host's noneditable-object handlers. TinyMCE still owns surrounding prose,
selection, Backspace/Delete and document Undo/Redo. A second open command does
not discard the active draft. Loading content, undo/redo, read-only mode and
editor removal close it. Applying checks that its target still exists with the
same source data; insertion checks that the document has not changed since the
selection bookmark was captured.

The inline field opens after TinyMCE finishes its click/command focus handling.
`insert()` / `edit()` returning `true` means opening was accepted; the input is
mounted/focused on the next animation frame. The API closes pending openings on
Cancel, content replacement, read-only transitions and editor removal too.

Inline formulas persist as `span`, block formulas as `div`, with these attributes:

| Attribute                 | Meaning                                    |
| ------------------------- | ------------------------------------------ |
| `data-barocss-math`       | `inline` or `block`                        |
| `data-latex`              | Portable LaTeX fallback                    |
| `data-math-document`      | Authoritative versioned math document JSON |
| `data-math-size`          | Display scale, 50–200 percent              |
| `contenteditable="false"` | Atomic host content                        |

Normal `getContent()` serialization removes transient math UI from TinyMCE's
detached `PreProcess` clone before parsing the HTML, then replaces preview
descendants with escaped LaTeX in its AST filter. This prevents the inline field's
block controls from being reparented out of the formula by HTML normalization.
Bogus subtrees and a registered temporary attribute also keep drafts out of raw
Undo snapshots. Use the normal serialization lifecycle; `no_events: true`
bypasses the adapter's preprocessing and is not supported for saving active drafts.
TinyMCE's default schema preserves `data-*` attributes; host sanitizers or custom
schemas must also preserve the attributes above. Sanitizing or importing the
surrounding HTML remains the host application's responsibility.

The local demo loads TinyMCE core, icons, theme, DOM model and skin from the pinned
NPM package. It declares `license_key: "gpl"` only inside its unpublished Vite
development entry and refuses production initialization. The reusable adapter
sets no license or cloud configuration. Hosts must deliberately choose GPL or
their own eligible commercial configuration before deploying TinyMCE. No premium
features, embedded keys, CDN scripts or tracking are added by this adapter.

Official API references: [custom plugins](https://www.tiny.cloud/docs/tinymce/latest/creating-a-plugin/),
[UndoManager](https://www.tiny.cloud/docs/tinymce/latest/apis/tinymce.undomanager/),
[serializer](https://www.tiny.cloud/docs/tinymce/latest/apis/tinymce.dom.serializer/),
[Vite bundling](https://www.tiny.cloud/docs/tinymce/latest/vite-es6-npm/), and
[license configuration](https://www.tiny.cloud/docs/tinymce/latest/license-key/).

Run the real-browser regression in `apps/math-integrations/tests/tinymce-check.js`
against the local demo server. It covers Apply/Cancel, one-step undo/redo,
HTML round trips, read-only mode, draft invalidation and destroy cleanup.

The public static sample shows setup guidance until the host license is explicitly configured. Local development settings do not authorize a production TinyMCE or CKEditor deployment.

## Continuous editing checks

The workspace EDIT-019 run on 2026-09-10 passes both math block and math inline
modes in a TinyMCE `inline: true` host, using Chromium on macOS. It covers nested
editing, repeated formula Undo/Redo, Apply as one host history event,
Save/reload/Restore, re-edit and Cancel. Inline also checks Enter commit,
Right-arrow exit, prose input after the formula and Undo of that prose edit.
See [validation evidence](../VALIDATION.md#edit-019-tinymce--workspace-2026-09-10).

An empty saved formula shows the localized empty-formula placeholder so it remains
clickable. The preview renderer is called only when LaTeX is nonempty. The label
is presentation only; saved HTML still contains empty formula content.

Classic iframe hosts, native OS IME/clipboard and other browser engines need
separate validation. The continuous editing run does not certify those targets.
