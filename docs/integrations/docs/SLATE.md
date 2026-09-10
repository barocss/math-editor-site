# Slate adapter

The examples below use its public entry points. See the [release guide](RELEASING.md).

[Open the Slate example](/integrations/?editor=slate) · [Host support](../HOST-SUPPORT.md) · [Validation](../VALIDATION.md)

Use Slate's React renderer with real inline and block void elements. The math UI edits a local native DOM draft; Apply updates the Slate node, and Cancel leaves the document unchanged.

```tsx
import { createEditor } from "slate";
import { Slate, Editable, withReact } from "slate-react";
import { withHistory } from "slate-history";
import {
  SlateMath,
  isSlateMathElement,
  insertSlateMath,
  withBarocssMath,
} from "@barocss/math-editor-slate";
import "@barocss/math-editor/style.css";
import "@barocss/math-editor-slate/style.css";

// Create once, for example in useState(() => ...).
const editor = withBarocssMath(withHistory(withReact(createEditor())));
const initialValue = [{ children: [{ text: "Start writing here." }] }];

<Slate editor={editor} initialValue={initialValue}>
  <Editable
    readOnly={false}
    renderElement={(props) =>
      isSlateMathElement(props.element) ? (
        <SlateMath
          {...props}
          element={props.element}
          options={{ locale: "en" }}
        />
      ) : (
        <p {...props.attributes}>{props.children}</p>
      )
    }
  />
</Slate>;

insertSlateMath(editor, "x_i^2", "inline");
insertSlateMath(editor, "\\frac{a}{b}", "block");
```

Add the exported `SlateMathElement` to your application's Slate `CustomTypes.Element` union. The adapter does not declare global custom types or change other elements' inline/void behavior. Its reserved node type is `barocss-math`, with `kind`, `latex`, optional `mathDocument`, `fontSize`, and `children: [{ text: "" }]`. Absent model data is omitted because Slate reserves `null` in operations.

Save `editor.children` as JSON and restore it using your host's document-loading flow. Slate's own fragment clipboard format also preserves node data. `slateMathToElement(node, document)` and `slateMathFromElement(element)` provide safe HTML conversion for host serializers; register them in your host's HTML pipeline if needed. They persist mathematical data and escaped fallback text without the editor UI. Unsupported authoritative models remain stored and uneditable.

`insertSlateMath` validates source before inserting, selects the new void, and opens its draft once rendered. `openSlateMath(editor, path)` opens an existing rendered formula. Each Apply uses `HistoryEditor.withNewBatch` when `withHistory` is installed; Undo and Redo remain owned by Slate. Readonly changes close active drafts. React unmount disposes native fields and tracked paths.

This development adapter targets Slate 0.126.2, slate-react 0.126.4, slate-dom 0.126.0, and slate-history 0.113.1. It preserves Slate's required outer attributes/ref, empty selection child, and `contentEditable={false}` wrapper. Host-specific HTML schemas, collaboration conflict resolution, and wider browser/IME coverage require separate validation. See the official [void element requirements](https://docs.slatejs.org/api/nodes/element), [editable void example](https://github.com/ianstormtaylor/slate/blob/main/site/examples/ts/editable-voids.tsx), and [history batches](https://docs.slatejs.org/libraries/slate-history/history-editor).

## Continuous editing checks

The workspace EDIT-019 run on 2026-09-10 passes Slate block and inline modes in
Chromium on macOS. It checks nested fraction/root/matrix input, two formula
Undo/Redo chains, unchanged host data during drafts, Apply as one host Undo
event, Save/reload/Restore, re-edit and Cancel. Inline also checks Enter commit,
Right-arrow exit, host focus, prose input immediately after the formula and Undo.

Saved descendant arrays are compared in full for persistence and history.
Paragraph boundaries and formula atoms are preserved in prose checks.
See [validation evidence](../VALIDATION.md#edit-019-all-integration-demos--workspace-2026-09-10).
Other host schemas, collaboration, native OS IME/clipboard and browser engines
need separate validation.
