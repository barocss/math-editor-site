# Quill 2 adapter

The examples below use its public entry points. See the [release guide](RELEASING.md).

[Open the Quill example](/integrations/?editor=quill) · [Host support](../HOST-SUPPORT.md) · [Validation](../VALIDATION.md)

Register the math formats before creating Quill, then mount their native editing views:

```ts
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { registerQuillMath, mountQuillMath } from "@barocss/math-editor-quill";
import "@barocss/math-editor/style.css";
import "@barocss/math-editor-quill/style.css";

registerQuillMath(Quill);
const quill = new Quill(host, {
  theme: "snow",
  modules: { history: { userOnly: true } },
});
const math = mountQuillMath(quill, { locale: "en" });
math.insert("x_i^2", "inline");
math.insert("\\frac{a}{b}", "block");
// math.open(index) edits an existing formula at its Quill document index.
// math.setReadOnly(true) disables the host and closes active drafts.
// math.destroy() removes adapter listeners and views; the host owns its Quill instance.
```

`barocssMathInline` extends Quill's inline Embed and `barocssMathBlock` extends BlockEmbed. Both store a `MathAttributes` object containing model JSON, LaTeX, and display size. `createQuillMathInsert(source, kind)` creates a serializable Delta insert or returns `undefined` for unsupported input. Save `quill.getContents()` and restore with `quill.setContents()` after registering the formats. When using a `formats` allowlist, include both math names.

Click an embed to edit a local native DOM draft. Apply replaces the immutable embed in one Delta transaction, with `history.cutoff()` before and after it; Cancel does not change the host. Readonly host changes disable math editing. Each mounted Quill editor has independent draft ownership.

Use `quill.getSemanticHTML()` for HTML persistence and clipboard output. The adapter's blot `html()` methods emit escaped mathematical data and LaTeX only, so live inputs, controls, and renderer markup stay out of saved HTML. Standard Quill HTML import recognizes the registered `bme-quill-inline` / `bme-quill-block` classes. Do not persist the editing surface's `innerHTML`. Unsupported saved model data is preserved and kept uneditable.

This first adapter targets Quill 2.0.3 with its default global format registry. Custom registries, collaboration-specific Delta merging, and wider browser/IME coverage require separate host validation. It follows the official [Embed/BlockEmbed guide](https://quilljs.com/docs/guides/cloning-medium-with-parchment), [API](https://quilljs.com/docs/api/), and [history boundaries](https://quilljs.com/docs/modules/history).

The real-browser regression in `apps/math-integrations/tests/quill-typing-check.js`
checks sequential input, middle insertion, Shift-arrow replacement and matrix-cell
navigation in both placements. The adapter restores the math input caret after
Quill processes internal draft DOM changes, so host selection reconciliation does
not consume typed characters. During input composition, the adapter uses Quill
scroll batching to defer those DOM updates. It flushes its batch after composition
ends and restores the committed input caret. Blur, read-only transitions and
destruction also release an adapter-owned batch. Existing batches owned by Quill
or the host are left to their owner. Quill selection methods are not replaced.

`apps/math-integrations/tests/quill-composition-check.js` uses Chromium input
protocol composition events to verify Latin and Korean preedit updates, commit,
cancel, subsequent typing, unchanged draft Delta, host Undo and read-only
recovery in inline and block formulas. These checks do not replace validation
with operating-system IMEs or other browsers.
