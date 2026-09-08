# Composable math editing and host integration

The unit of integration is a **math session**, not a fixed editor panel. The host chooses where four independent surfaces live and what happens when editing ends. The package owns the math tree and caret; it does not create Note blocks, move slide objects, save a Site page or issue API requests.

## Four surfaces

| Surface | API | Ownership |
|---|---|---|
| Editing | `mountMathEditor(host, options)` | Native input, math selection, suggestions, math undo |
| Toolbar | `mountMathToolbar(host, session, options)` | Optional command UI; may be elsewhere in the page |
| LaTeX | `mountMathLatex(host, session)` | Read-only generated text; preserves browser selection on caret-only changes |
| Preview | `mountMathPreview(host, session, { render })` | Subscription and lifetime; host provides rendering implementation |

All four APIs are exported by `@barocss/math-editor/dom`. Toolbar, LaTeX and preview are optional. They do not recreate or reset the session when mounted/unmounted. Destroy each view when its host disappears. An externally supplied session outlives its views and must be destroyed by its owner.

| Composition | Suggested use | Completion policy |
|---|---|---|
| Editor only | Embedded form field / API input | `onChange(document, latex)` |
| Toolbar + editor | Dedicated formula tool | Internal multiline editing |
| Editor + LaTeX, optional toolbar | LaTeX generator | Exported source; no arbitrary LaTeX import |
| Editor + preview, optional toolbar | WYSIWYG verification | Render through a host-selected engine |
| Editor + LaTeX + preview | Authoring/debugging lab | Same session for all views |
| Inline editor | Formula in prose or a constrained field | Single top-level row, `onCommit`/`onExit` |
| Popup editor | Draft an expression away from the host canvas | Apply once or discard the separate draft |
| One editor per math block | Note-style consecutive formulas | Host creates the next block after `onCommit` |

Preview is not synonymous with a downloadable image. The sample uses KaTeX HTML/MathML. An SVG/PNG renderer, font embedding, image sizing and export are separate adapters still to be implemented. Keep the editable `MathDocument` even if a host also stores an image or LaTeX cache.

## Minimal composition

```ts
import { createMathSession } from '@barocss/math-editor/core';
import { mountMathEditor, mountMathToolbar, mountMathLatex, mountMathPreview } from '@barocss/math-editor/dom';
import '@barocss/math-editor/style.css';

const session = createMathSession({ locale: 'en' });
const editor = mountMathEditor(editorHost, { session, toolbar: false, onChange: saveDraft });
const toolbar = mountMathToolbar(toolbarHost, session, { onExecute: () => editor.focus() });
const latex = mountMathLatex(latexHost, session);
const preview = mountMathPreview(previewHost, session, {
  render(element, snapshot) {
    // Example only: the host imports/configures its renderer and handles errors.
    katex.render(snapshot.latex, element, { displayMode: snapshot.mode === 'block', trust: false });
  },
});
```

Hosts may arrange these in a column, side panel, floating toolbar or popup. No layout preset forces a markup hierarchy. `render` can return cleanup for resources/listeners; it runs again when LaTeX, mode or locale changes, not when only the caret moves. Handle rendering errors inside the supplied renderer. Dispose in reverse ownership order: preview/LaTeX/toolbar/editor, then the externally created session.

React's rich `MathEditor` additionally accepts `toolbar={false}`, `showTokenLegend={false}` and `toolbarEnd={<HostActions />}`. The sample's reset action uses this slot. React's native `MathEditorSurface` and the Vue/Svelte/Solid adapters accept the shared DOM options. The rich React renderer still has its own history; sharing a document format does not make it a live session view.

## Enter, Escape and host focus

`mode` and `enterBehavior` answer different questions:

- `mode: 'inline'` enforces one **top-level** row at every session mutation boundary. Nested matrices, cases and fractions may still be tall. It is not a fixed-height guarantee.
- `mode: 'block'` permits multiple top-level rows.
- `enterBehavior: 'newline'` uses internal block editing (default in block mode).
- `enterBehavior: 'commit'` reports completion to the host. Inline mode always completes instead of adding a top-level row, even if `newline` was requested.

Keyboard precedence is deliberate:

1. An unmodified Enter accepts a visible suggestion.
2. Shift+Enter inside a grid adds an internal row, including in inline or host-commit mode.
3. Inline/commit mode invokes `onCommit(snapshot)`; without it, the existing `onExit(1)` fallback is used.
4. Normal block mode splits an outer row; aligned/cases Enter adds a row; matrix Enter alone does nothing.

`onCommit` does not mutate the formula or create a host block. The snapshot includes the document, LaTeX and caret. A Note adapter can save the current node, insert a sibling math block and focus a new editor. A form can move focus to the next field. A popup can apply the draft and close. Treat this as a completion request, not proof that an asynchronous save succeeded.

Escape first dismisses suggestions or a selected grid. A subsequent Escape exits active editing and invokes `onCancel` if present. The host decides whether cancellation closes a popup and whether its draft is discarded. Tab/outer arrows use `onExit(-1 | 1)` for host focus restoration. The host must retain an outer selection bookmark before editing begins.

Web Components expose `enter-behavior="commit"`, `math-commit`, `math-cancel` and `math-exit` using the same policy. Native suggestions mount inside the nearest `<dialog>` by default so the browser's modal inertness does not block their mouse interaction. A mount-only `menuHost` override supports other overlay systems.

## Drafts, persistence and undo

For popup editing, clone the source into a **separate** session. Cancel destroys the draft without touching the original. Apply commits the draft through the host's transaction API once. The layout demo uses `sourceSession.apply(draftSnapshot.state)` so applying the popup is one undoable math edit; `load()` would incorrectly reset the source's history.

For direct inline editing, decide whether host persistence observes each `onChange` or only completion. Saving each update to an API is possible, but debounce/network state belongs to the host. Do not put every keystroke in both host and math undo stacks. A production bridge must define one user-visible undo path and handle undo across the math/host boundary.

## Existing product boundaries found in this repository

| Product | Current evidence / required bridge | Recommended first integration |
|---|---|---|
| Note | `office-note/src/note-schema.ts` defines `mathInline` and `mathBlock` with `tex`; `office-text/src/latex.ts` owns insertion/source commands. Markdown exchange also preserves `tex`. This editor uses a different `MathDocument` tree. | A versioned editable payload alongside the LaTeX cache, a node-view mount, and Enter-to-sibling-block transactions. Keep existing source editing for tex-only content until supported import exists. |
| Word | `office-word/src/math-schema.ts` uses named OMML-style slots, with existing buildup/navigation/commands. Its document model is not interchangeable with this package. | Explicit supported-subset conversion and round-trip tests. Preserve unsupported OMML nodes and current DOCX behavior; do not replace them with LaTeX strings. |
| Slide | The host controls object selection, position, scale and document transactions. This change has not connected its canvas objects to a math session. | Start with a popup draft/apply path, then test direct editing under canvas scaling and host focus restoration. |
| Site | The host controls authoring versus published output. This change has not connected its document nodes to a math session. | A dedicated math node/view; persist editable data, publish rendered output without toolbars, caret slots or development controls. |

The layout lab demonstrates the interaction contracts; it is not installation into these four products. A shared host bridge can consolidate data conversion, selection bookmarks, completion and transaction policy, while each product keeps its own placement/schema adapter. No general LaTeX parser, OMML converter, saved-document validator or host-wide undo bridge is included yet.

## Try and verify

Open `/layouts.html` in the math demo. Toggle each optional surface, edit the independent inline example, press Enter to create another host block, and open/cancel/apply the popup. Existing React UI and all framework adapters remain on `/` and `/adapters.html`.

The browser tests cover panel synchronization without extra change events, single-row completion, separate next-block creation, modal mouse suggestions, popup cancellation and one-step undo after applying a draft. OS IME testing remains deferred; this is not a full product integration certification.


## Note trial (0.2.0)

Note opts into the shared `LatexEditor` visual mode with `MathEditorSurface`. Existing tex-only atoms load through `parseLatex`; unsupported input stays in the original source editor. Visual draft changes produce `tex` plus JSON-encoded `mathDocument`. `setMathSource` validates the structure, source equality and inline policy, then applies one host transaction. Cancellation writes nothing. Direct source changes clear stale structure, while font/alignment-only edits retain it.

Other products must use the same [import scope](LATEX-SCOPE.md) and core parser. Do not add product-specific regex conversions. Existing Word OMML and Site/Slide ownership boundaries still need their own host adapters; the Note trial does not integrate those products automatically.
