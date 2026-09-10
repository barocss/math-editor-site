# Lexical adapter

The examples below use its public entry points. See the [release guide](RELEASING.md).

[Open the Lexical example](/integrations/?editor=lexical) · [Host support](../HOST-SUPPORT.md) · [Validation](../VALIDATION.md)

This development adapter targets Lexical 0.50. Register `BarocssMathNode` with your editor, then attach its native DOM lifecycle:

```ts
import { createEditor } from "lexical";
import { registerRichText } from "@lexical/rich-text";
import { createEmptyHistoryState, registerHistory } from "@lexical/history";
import {
  BarocssMathNode,
  INSERT_MATH_COMMAND,
  registerBarocssMath,
} from "@barocss/math-editor-lexical";
import "@barocss/math-editor/style.css";
import "@barocss/math-editor-lexical/style.css";

const editor = createEditor({
  namespace: "document",
  nodes: [BarocssMathNode],
  onError: (error) => {
    throw error;
  },
});
editor.setRootElement(contentEditableElement);
const removeRichText = registerRichText(editor);
const removeHistory = registerHistory(editor, createEmptyHistoryState(), 300);
const removeMath = registerBarocssMath(editor, { locale: "en" });

editor.dispatchCommand(INSERT_MATH_COMMAND, {
  source: "x_i^2",
  kind: "inline",
});
// Use kind: 'block' for a displayed equation. Unsupported input returns false.

// When unmounting:
removeMath();
removeHistory();
removeRichText();
editor.setRootElement(null);
```

Click a formula to edit a local draft. Apply creates one Lexical history entry; Cancel leaves the document unchanged. A renderer can be supplied through `render(latex, host, displayMode)`; otherwise previews display LaTeX. The math field uses native DOM and does not require React. `editor.setEditable(false)` closes drafts and disables math editing and insertion.

Save `editor.getEditorState().toJSON()` and restore with `editor.parseEditorState()` / `editor.setEditorState()`. A math node stores `type: 'barocss-math'`, `kind`, and `value: MathAttributes`; the value preserves model JSON, LaTeX, and display size. Unsupported saved math models remain preserved and cannot be edited through a lossy LaTeX fallback. Standard Lexical HTML export/import uses `data-barocss-math`, `data-latex`, `data-math-document`, and `data-math-size`; draft controls are excluded.

Register the adapter once per editor. Its teardown removes its commands, editable/root/mutation listeners, and every mounted math field. Host history belongs to `@lexical/history`; collaboration, custom clipboard pipelines, and cross-browser IME behavior still need host-specific validation.

The adapter follows Lexical's documented [DecoratorNode](https://lexical.dev/docs/concepts/nodes), [mutation and editable listeners](https://lexical.dev/docs/concepts/listeners), [serialization](https://lexical.dev/docs/serialization/), and [history update tags](https://lexical.dev/docs/concepts/updates).

## Continuous editing checks

The workspace EDIT-019 run on 2026-09-10 passes both inline and block modes in
Chromium on macOS. It covers nested fraction/root/matrix editing, repeated
Undo/Redo, Apply, Save/reload/Restore, re-edit and Cancel. Inline checks also
verify Enter commit, Right-arrow exit, prose input immediately after the formula,
and Undo of that prose edit. See [validation evidence](../VALIDATION.md#edit-019-lexical--workspace-2026-09-10).

These checks use the demo's registered history and restore lifecycle. A custom
host must verify its own history, persistence and focus behavior. Other browser
engines and native OS IME/clipboard are not covered by this run.
