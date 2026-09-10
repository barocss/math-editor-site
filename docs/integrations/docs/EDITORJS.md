# Editor.js formula blocks

The examples below use its public entry points. See the [release guide](RELEASING.md).

[Open the Editor.js example](/integrations/?editor=editorjs) · [Host support](../HOST-SUPPORT.md) · [Validation](../VALIDATION.md)

The package root exports `BarocssMathTool`, a dedicated Block Tool tested
against Editor.js 2.31.6. It does not modify paragraph tools or implement inline
formulas inside arbitrary text blocks.

```ts
import EditorJS from "@editorjs/editorjs";
import { BarocssMathTool } from "@barocss/math-editor-editorjs";
import "@barocss/math-editor/style.css";
import "@barocss/math-editor-editorjs/style.css";

const editor = new EditorJS({
  holder: "editor",
  tools: { barocssMath: { class: BarocssMathTool, config: { locale: "en" } } },
});
```

Pass a `render(latex, element, displayMode)` callback in tool config for typeset
previews, such as KaTeX with `trust: false`. The default safely shows LaTeX as text.

Each block saves `{ latex, mathDocument, fontSize }`. The structured document is
authoritative when present. Unsupported data remains stored and visible, and is
not replaced by a blank formula. Model fields bypass HTML stripping so strings
such as `a<b>c` survive; renderers must treat these fields as untrusted data.

Click to edit. Apply commits and calls `block.dispatchChange()` once; Cancel keeps
the stored value. Outside clicks apply the compact draft. Block and editor teardown
remove editing listeners. Runtime read-only toggling uses Editor.js's tool lifecycle.

Insert from the toolbox, or use the block API:

```ts
const block = editor.blocks.insert("barocssMath", {
  latex: "",
  mathDocument: null,
});
block.call("edit");
const document = await editor.save();
await editor.render(document);
```

Editor.js does not provide the same built-in document history API as the other
sample hosts. Its integration does not claim host Undo/Redo; install and validate
an Editor.js history extension separately. Undo inside an open math draft remains
available through the common math editor.

Official references: [Tools API](https://editorjs.io/tools-api/),
[Sanitize saved data](https://editorjs.io/sanitize-saved-data/),
[Saving data](https://editorjs.io/saving-data/).

## Continuous editing checks

The workspace EDIT-019 run on 2026-09-10 passes 29 checkpoints for Editor.js block
editing in Chromium on macOS. It covers fraction/root/matrix editing, suggestion
selection, two formula Undo/Redo chains, Apply, Save/reload/Restore, re-edit and
Cancel. Draft edits leave saved host data unchanged. Saved documents are compared
with only the generated save timestamp excluded.

Document Undo/Redo remains unverified because the demo has no host history
extension. Inline editing is outside this Block Tool's contract. See the
[validation evidence](../VALIDATION.md#edit-019-editorjs--workspace-2026-09-10)
for the tested scope and remaining browser/input checks.
