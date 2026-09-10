# Tiptap integration

The imports below use the public package entry points. The repository demo uses
the same implementation from the private shared workspace. See the
[release guide](RELEASING.md) for package boundaries and verification.

The adapter targets Tiptap 3 and supplies both inline and block formula nodes.
It uses the same ProseMirror NodeView as the [ProseMirror adapter](PROSEMIRROR.md).
The Tiptap host owns its document, selection, and configured history.

[Open the Tiptap example](/integrations/?editor=tiptap) ·
[Host support](../HOST-SUPPORT.md) · [Validation](../VALIDATION.md)

```ts
import { Editor } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import { closeHistory } from "prosemirror-history";
import { BarocssMath } from "@barocss/math-editor-tiptap";
import katex from "katex";
import "@barocss/math-editor/style.css";
import "@barocss/math-editor-tiptap/style.css";
import "katex/dist/katex.min.css";

const editor = new Editor({
  element: document.querySelector("#editor")!,
  extensions: [
    StarterKit,
    BarocssMath.configure({
      locale: "en",
      editing: "inline",
      render(latex, host, displayMode) {
        katex.render(latex, host, {
          displayMode,
          throwOnError: false,
          trust: false,
        });
      },
    }),
  ],
});

editor.commands.insertMath(String.raw`x_i^2`, "inline");
editor.commands.insertMath(String.raw`\frac{a}{b}`, "block");
const saved = editor.getJSON();
const restoreDocument = (document: ReturnType<typeof editor.getJSON>) => {
  const boundary = () => editor.view.dispatch(
    closeHistory(editor.state.tr).setMeta("addToHistory", false)
  );
  boundary();
  editor.commands.setContent(document);
  boundary();
};
restoreDocument(saved);
```

The history boundaries keep document restoration separate from a quick subsequent
text edit. The sample preserves an undoable document replacement instead of
merging it with the next typed character.

The host provides compatible Tiptap and ProseMirror dependencies; avoid duplicate
ProseMirror model/state runtimes in a bundle. KaTeX is an optional preview renderer,
not an adapter runtime dependency. Without a renderer, previews display LaTeX text.
`BarocssMath` registers both formula node types, so do not register them twice.

## Editing and storage

`insertMath(source?, kind?)` accepts supported LaTeX or a validated `MathDocument`.
It returns false for unsupported input without changing the document. The default
kind is `inline`. Block formulas allow multiple top-level math rows; both kinds
support structures such as matrices.

`editing: 'inline'` uses compact editing at the formula's position. Outside clicks
apply the draft; the floating controls can expand it. `editing: 'panel'` opens the
expanded field with explicit Apply/Cancel. Formula placement and editing layout
are separate options.

The node attributes contain `latex`, authoritative `mathDocument`, and `fontSize`
(50–200 percent, default 100). Save with Tiptap's JSON or HTML APIs, not the live
NodeView DOM. Canonical HTML carries math data and plain LaTeX fallback text while
excluding preview HTML and editing controls. Unsupported stored models remain
preserved and cannot be edited by an older math editor.

Apply commits the draft to host history; Cancel discards it. Enabling host readonly
or replacing the same formula closes an open draft. Formula drafts have their own
undo history. Neighboring-text keyboard entry and optional shared toolbar behavior
are described in the [integration editing contract](../README.md#tiptapprosemirror-editing-contract).
Destroy the Tiptap editor through `editor.destroy()` to tear down its NodeViews.

See [Tiptap's NodeView documentation](https://tiptap.dev/docs/editor/extensions/custom-extensions/node-views)
for the host extension point.
