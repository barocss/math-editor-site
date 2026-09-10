# ProseMirror integration

The imports below use the public package entry points. The repository demo uses
the same implementation from the private shared workspace. See the
[release guide](RELEASING.md) for package boundaries and verification.

The adapter targets ProseMirror 1 and adds atomic inline/block math nodes, a DOM
NodeView, insertion commands, and neighboring-text keyboard entry. The host retains
its document schema, editing commands, history, and selection.

[Open the ProseMirror example](/integrations/?editor=prosemirror) ·
[Host support](../HOST-SUPPORT.md) · [Validation](../VALIDATION.md)

```ts
import { Schema } from "prosemirror-model";
import { EditorState } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { schema as basicSchema } from "prosemirror-schema-basic";
import { history, undo, redo } from "prosemirror-history";
import { keymap } from "prosemirror-keymap";
import { baseKeymap } from "prosemirror-commands";
import {
  mathNodes,
  createMathPlugin,
  insertMath,
} from "@barocss/math-editor-prosemirror";
import "@barocss/math-editor/style.css";
import "@barocss/math-editor-prosemirror/style.css";

const schema = new Schema({
  nodes: basicSchema.spec.nodes.append(mathNodes),
  marks: basicSchema.spec.marks,
});
const view = new EditorView(document.querySelector("#editor"), {
  state: EditorState.create({
    schema,
    plugins: [
      createMathPlugin({ locale: "en", editing: "panel" }),
      history(),
      keymap({ "Mod-z": undo, "Mod-Shift-z": redo, "Mod-y": redo }),
      keymap(baseKeymap),
    ],
  }),
});

insertMath("x_i^2", "inline")(view.state, view.dispatch);
insertMath(String.raw`\frac{a}{b}`, "block")(view.state, view.dispatch);
const saved = view.state.doc.toJSON();
const restoredDocument = schema.nodeFromJSON(saved);
// Use restoredDocument when creating the replacement EditorState.
```

Install the host's own compatible ProseMirror dependencies. The example's basic
schema and keymap packages are application choices. Keep one model/state runtime
per editor bundle. An optional `render(latex, host, displayMode)` callback can
supply KaTeX or another preview renderer; without it the field displays LaTeX text.

## Drafts and host transactions

`insertMath(source?, kind?)` is a ProseMirror command accepting supported LaTeX or a
validated `MathDocument`. It returns false for unsupported input. Register
`mathNodes` in the schema and `createMathPlugin` in the same EditorState.

The shared field drafts changes locally. Apply commits content and size together;
Cancel discards them. The host must configure `prosemirror-history` and its normal
history shortcuts. Host readonly closes the draft and disables math editing.
Destroy the view with `view.destroy()` when unmounting.

Use `editing: 'inline'` for compact editing at the formula's position, or `'panel'`
for explicit Apply/Cancel. `toolbarHost` can attach the active formula's toolbar to
a dedicated container outside the editable document. Each EditorView coordinates
one math draft and has its own toolbar container. See the
[shared toolbar guide](../README.md#tiptapprosemirror-shared-toolbar).

Clicking a formula opens it. ArrowRight immediately before inline math and
ArrowLeft immediately after it enter the corresponding edge. Backspace/Delete at
a nonempty neighboring formula enter it before removing mathematical content.
Modified shortcuts and range selections preserve the host's behavior. The complete
[editing contract](../README.md#tiptapprosemirror-editing-contract) documents exit,
composition, deletion, and conflict handling.

## Persistence

Node attributes preserve `latex`, authoritative `mathDocument`, and `fontSize`
(50–200 percent, default 100). Use schema JSON or ProseMirror's DOM serialization
pipeline. Exported HTML contains the data attributes and escaped LaTeX fallback,
without live controls or renderer markup. Preserve custom math attributes in your
sanitizer. Unsupported model versions remain intact and cannot be edited.

See [ProseMirror's NodeView interface](https://prosemirror.net/docs/ref/#view.NodeView)
and [plugin specification](https://prosemirror.net/docs/ref/#state.PluginSpec)
for the host APIs used by this adapter.
