# CKEditor 5 adapter

The examples below use its public entry points. See the [release guide](RELEASING.md).

[Open the CKEditor example](/integrations/?editor=ckeditor) · [Host support](../HOST-SUPPORT.md) · [Validation](../VALIDATION.md)

Development preview for CKEditor 5, implemented against version 48.5.0. The
adapter uses CKEditor model objects, conversion, commands, and widgets; it does
not include or vendor CKEditor. Install a compatible `ckeditor5` package in the
host application. The adapter is distributed through its own public package. The shared workspace helpers remain private.

## Setup

```ts
import { ClassicEditor, Essentials, Paragraph, Bold, Italic } from "ckeditor5";
import { BarocssMathCKEditor } from "@barocss/math-editor-ckeditor";
import "ckeditor5/ckeditor5.css";
import "@barocss/math-editor/style.css";
import "@barocss/math-editor-ckeditor/style.css";

async function createEditor(
  host: HTMLElement,
  licenseKey: string,
  toolbarHost?: HTMLElement
) {
  return ClassicEditor.create({
    attachTo: host,
    licenseKey,
    plugins: [Essentials, Paragraph, Bold, Italic, BarocssMathCKEditor],
    toolbar: [
      "undo",
      "redo",
      "|",
      "bold",
      "italic",
      "|",
      "insertBarocssMath",
      "insertBarocssMathBlock",
    ],
    barocssMath: {
      locale: "en",
      editing: "inline",
      toolbarHost,
      toolbarMaxItems: 6,
    },
  });
}
```

The example uses standard CKEditor features and does not load premium plugins.
Set `barocssMath.render(latex, host, displayMode)` for typeset previews. Without a
renderer, the preview shows LaTeX as text. Use the same trusted-renderer settings
and math-editor styles as the other integrations.

`barocssMath` accepts the shared `MathIntegrationOptions`: locale, message
overrides, inline or panel editing, toolbar configuration, and preview renderer.
An optional `toolbarHost` outside the editable document follows the active
formula. Use one toolbar container per editor. `toolbar: false` disables math
toolbars while preserving suggestions and draft actions.

## Insertion and editing

```ts
editor.execute("insertBarocssMath", { source: "x_i^2", kind: "inline" });
editor.execute("insertBarocssMath", {
  source: String.raw`\frac{a}{b}`,
  kind: "block",
});
```

`source` accepts supported LaTeX or a validated `MathDocument`; it defaults to an
empty formula. Unsupported input is rejected before insertion. The `Math` and
`Block formula` toolbar controls insert and open their corresponding node kind.
Clicking a preview, or pressing Enter with its CKEditor object selected, opens a
draft. Inline and block formulas use the shared native math editor, without a
React dependency.

Apply, Ctrl+Enter, or Cmd+Enter updates the node's content and size in one new
CKEditor undo batch. Keyboard exit applies before returning selection to the
host. Compact outside-click commits preserve the destination's focus. Cancel
discards draft changes; insertion itself is a separate host action, so cancelling
the first draft leaves its inserted node available for normal deletion or Undo.

One draft is active per CKEditor instance. Opening another formula applies the
previous draft, and active IME composition blocks that switch. Switching the
editor to read-only discards an uncommitted draft and disables editing. External
changes to the same node close its stale draft; removed widgets and editor
destruction release their fields and toolbar resources. Apply also checks that
the node still exists and its stored attributes have not changed.

## Storage

The CKEditor model contains `barocssMathInline` and `barocssMathBlock` object nodes
with `latex`, `mathDocument`, and `fontSize` attributes. `mathDocument` contains
the authoritative JSON model; LaTeX is the portable fallback. Display size is a
percentage independent of the mathematical content.

At the shared API boundary, LaTeX-only data has `mathDocument: null`. The CKEditor
model represents that state by omitting the attribute, since CKEditor reserves
null as the absence sentinel in its attribute operations. The adapter removes an
attribute when returning to LaTeX-only data instead of storing a null value.

`editor.getData()` returns standard CKEditor HTML. Formula output uses `span` for
inline math and `div` for block math, with `data-barocss-math`, `data-latex`,
`data-math-document`, and `data-math-size`. The data converter writes mathematical
data and LaTeX text only; editing controls and preview markup are not serialized.
`editor.setData(html)` restores these attributes. Preserve them in external HTML
sanitizers and clipboard pipelines. Applications can store the HTML string inside
their own JSON document envelope.

LaTeX-only HTML is parsed when opened. Unsupported or newer JSON remains stored
and uneditable, and is not replaced by its LaTeX fallback. Use the host's standard
object selection, deletion, clipboard, and Undo commands for whole formulas.

## Local demo and CKEditor licensing

The local sample is at `http://localhost:5185/?editor=ckeditor&lang=en`. It starts with
inline and block math and exposes insertion, Undo/Redo, save/restore, and read-only
controls. Its `mountCKEditorDemo(host, options)` accepts an optional
`options.licenseKey` supplied by the host application.

Without a supplied key, the sample uses `licenseKey: 'GPL'` only on localhost or a
loopback hostname and displays a local evaluation notice. This is not permission
to deploy a proprietary product with that setting. CKEditor offers GPL 2+ and
commercial licensing; a proprietary host that does not comply with the GPL needs
an appropriate CKEditor commercial license. Supply that host license separately;
the Barocss adapter grants no CKEditor license and does not activate paid keys.
See [CKEditor's official licensing guide](https://ckeditor.com/docs/ckeditor5/latest/getting-started/licensing/license-and-legal.html).

Both `@barocss/math-editor` and the Barocss CKEditor adapter use the MIT license.
See the [licensing guide](../COMMERCIAL-MODEL.md). The adapter's MIT license does
not replace CKEditor's terms.

## Verification scope

Six focused attribute tests cover JSON persistence, LaTeX-only loading, null
conversion, unsupported authoritative models, display-size normalization, and
stale-value detection. Type-check and the integration build pass.

On 2026-09-09, `apps/math-integrations/tests/ckeditor-check.js` passed in local
Chromium on macOS with zero page errors. It covers inline and block Apply,
LaTeX-only imports, Cancel, one-step host Undo/Redo, HTML saved inside JSON,
synthetic composition switching guards, compact outside Apply, read-only,
insertion, unsupported data, model removal, and teardown. The run caught and
verified the fix for storing null as a CKEditor model attribute. Native OS IME,
other browsers, and broader host-version compatibility remain unverified.

The adapter uses the documented [inline-widget conversion pattern](https://ckeditor.com/docs/ckeditor5/latest/framework/tutorials/widgets/implementing-an-inline-widget.html)
and [RawElement integration pattern](https://ckeditor.com/docs/ckeditor5/latest/framework/tutorials/widgets/using-react-in-a-widget.html).
The native math field occupies the raw DOM boundary and handles its own input;
CKEditor owns surrounding document editing and stored model changes.

The public static sample shows setup guidance until the host license is explicitly configured. Local development settings do not authorize a production TinyMCE or CKEditor deployment.

## Continuous editing checks

The workspace EDIT-019 run on 2026-09-10 passes both math block and math inline
modes in the local ClassicEditor demo, using CKEditor 48.5.0 and Chromium on macOS.
It covers nested fraction/root/matrix editing, two formula Undo/Redo chains,
draft isolation, Apply as one host history event, Save/reload/Restore, re-edit
and Cancel. Inline also checks Enter commit, Right-arrow exit, host focus,
prose input after the formula and Undo of that prose edit.

The test compares complete saved HTML for persistence and history. It also
checks prose and element boundaries, so a correct preview alone cannot pass.
See [validation evidence](../VALIDATION.md#edit-019-ckeditor--workspace-2026-09-10).
Other CKEditor builds, collaboration, native OS IME/clipboard and other browser
engines need separate validation.
