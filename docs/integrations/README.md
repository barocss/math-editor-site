# Barocss Math Editor Integrations

Private common data, draft-field UI, messages and styles for math editor plugins.
Each host owns its implementation and tests in its own `math-editor-<host>`
package. This common package has no host SDK imports or host entry points.
Install the public plugins alongside the core and their host editor SDKs. Compatibility ranges are declared in each package manifest.

## Why this package stays private

Source exports are for workspace development. They do not make this package a
runtime dependency of the published plugins. Each plugin build includes the common
JavaScript and CSS it uses, and copies common declarations into `dist/_shared/`.
The packed plugin has no import or dependency on `@barocss/math-editor-integrations`.
Consumers install the core, their selected plugin and its host SDK peers.
Tiptap also installs the public ProseMirror plugin through its declared dependency.

| Environment | Common implementation |
| --- | --- |
| Workspace app | Imports this private package's source through the selected plugin |
| npm consumer or deployed site | Uses the common code already included in the public plugin |

Making the common code external in a future build would require a public runtime
package and dependency versions. The current build deliberately includes it instead.

## License

The core, this shared source package, and all nine host
packages use the MIT license. Each package includes a LICENSE file with copyright
attributed to barocss.com. See the included `LICENSE` file.

See the [release guide](docs/RELEASING.md) for package boundaries, Changesets,
artifact checks and the remaining publication prerequisites.
The [complete package catalog](../math-editor/README.md#packages) separates the
published core, its framework subpaths and all nine prepared host packages.

## Choose a host adapter

Import the public package for your host. Formula placement and the editing surface are
separate: an inline formula can be stored inside a sentence even when its draft
opens in a panel outside the document.

| Host / development target | Prepared npm package | Formula placement | Editing surface and guide |
| --- | --- | --- | --- |
| Tiptap 3 | `@barocss/math-editor-tiptap` | Inline and block | Shared ProseMirror NodeView; compact or panel editing; [setup below](#tiptap) |
| ProseMirror 1 | `@barocss/math-editor-prosemirror` | Inline and block | DOM NodeView; compact or panel editing; [setup below](#prosemirror) |
| Lexical 0.50.0 | `@barocss/math-editor-lexical` | Inline and block | DecoratorNode with the native math field; [Lexical guide](docs/LEXICAL.md) |
| Editor.js 2.31.6 | `@barocss/math-editor-editorjs` | Block only | Block Tool with the native math field; [Editor.js guide](docs/EDITORJS.md) |
| TinyMCE 8.9.0 | `@barocss/math-editor-tinymce` | Inline and block | In-place editing in inline/iframe hosts; optional Apply/Cancel panel; [TinyMCE guide](docs/TINYMCE.md) |
| CKEditor 5 / 48.5.0 | `@barocss/math-editor-ckeditor` | Inline and block | Model objects and widgets with the native math field; [CKEditor guide](docs/CKEDITOR.md) |
| Quill 2.0.3 | `@barocss/math-editor-quill` | Inline and block | Embed/BlockEmbed with the native math field; [Quill guide](docs/QUILL.md) |
| Slate 0.126.2 / slate-react 0.126.4 | `@barocss/math-editor-slate` | Inline and block | Void elements with a React wrapper and native math field; [Slate guide](docs/SLATE.md) |
| Gutenberg npm block-editor 17.0.0 | `@barocss/math-editor-gutenberg` | Block only | Registered WordPress math block with the native math field; [Gutenberg guide](docs/GUTENBERG.md) |

These are development targets, not a certified compatibility matrix. Local Chromium
checks cover all nine adapters, including Gutenberg in WordPress 7.1. Broader
browser and host-version testing remains. See
[host support](HOST-SUPPORT.md) and [VALIDATION.md](VALIDATION.md) for recorded
checks and remaining limits.

Each public plugin declares its own host SDK peers and the public math core.
Its development dependencies provide those SDKs for local builds and tests.
Tiptap also declares the public ProseMirror plugin as a runtime dependency:

| Adapter | Host dependencies |
| --- | --- |
| Tiptap | `@tiptap/core` and the host's compatible ProseMirror packages |
| ProseMirror | `prosemirror-model`, `prosemirror-state`, `prosemirror-view`, `prosemirror-history` |
| Lexical | `lexical`; register the host features and `@lexical/history` separately when needed |
| Editor.js | `@editorjs/editorjs`; document history requires a separate host solution |
| TinyMCE | `tinymce`, its locally served/bundled assets, and host license configuration |
| CKEditor | `ckeditor5`, host features/styles, and host license configuration |
| Quill | `quill` and the host theme/styles |
| Slate | `slate`, `slate-react`, `slate-dom`, `slate-history`, `react`, and `react-dom` |
| Gutenberg | Compatible WordPress blocks, block-editor, components, data, element and i18n packages; an installed WordPress plugin uses the host's script dependencies |

Each plugin builds its own TypeScript source and bundles the private common helpers.
Host SDKs and the public math core remain external. The demo application installs
and bundles the SDKs it uses. Consumers
load only their selected public package. Each one exports `/shared` for common
attributes, options, and native math-field helpers, plus `/style.css`.

## What works

- The common math editor supplies suggestions, structure tools, draft history,
  Apply/Cancel, display size, and English/Korean messages.
- Adapters preserve the math document model and LaTeX fallback in host-native data.
  HTML-capable adapters serialize mathematical data without live preview controls.
- Supported LaTeX can be inserted explicitly; unsupported authoritative models are
  preserved instead of being replaced by a lossy LaTeX conversion.
- Each adapter connects draft changes, read-only behavior, and teardown to its host
  lifecycle. History requires the host's configured history support. Editor.js core
  has no built-in document Undo/Redo, and its math Tool does not add one.

Keyboard entry at neighboring text boundaries and the detailed behavior below are
the Tiptap/ProseMirror contract. Other adapters have their own guides; shared math
input does not imply identical host navigation, clipboard, or insertion behavior.

## Run the development sample

From the repository root:

```sh
pnpm --dir apps/math-integrations dev
```

Open the [unified sample](http://localhost:5185/?lang=ko) or
[the English sample](http://localhost:5185/?lang=en). All nine editors use the same
page and selector; `editor=tiptap`, `prosemirror`, `lexical`, `editorjs`, `tinymce`,
`ckeditor`, `quill`, `slate`, or `gutenberg` chooses the host. Old `plugins.html`
links redirect here while preserving their selected editor and language.
Workspace exports resolve the plugins, core and private common module directly from
`src/`. Source edits reach Vite without a package rebuild. Package `build` commands
remain available to validate publishable output. Tiptap's build includes its public
ProseMirror dependency. The website stages this sample under `/integrations/` and
renders its guides under `/docs/integrations/`.
Staging the site does not publish the individual npm packages.

## Source ownership and package versions

Each public package has `src/`, `test/`, TypeScript configuration and its own
`build`, `type-check`, `test` and `format` scripts. ProseMirror owns its schema,
NodeView, keyboard boundaries and host toolbar coordination. Tiptap imports its
public API through a declared package dependency. Other adapters depend on the
core, common helpers and their own host SDKs.

The common build helper in `scripts/build-math-plugins.mjs` reads each plugin's
own source. It bundles common helpers, keeps public plugin/SDK imports external,
and copies the common declaration graph into each artifact. Consumers never need
to install this private package. The public entry points remain unchanged.

Version each affected plugin with Changesets. A CKEditor-only change names the
CKEditor package. A ProseMirror change follows the declared Tiptap dependency.
Changes to bundled common helpers must name every affected public plugin because
the private common package is not a runtime npm dependency. See the
[release guide](docs/RELEASING.md) for the batch command and package checks.

For an installable Gutenberg development plugin, follow the
[WordPress preview ZIP build guide](../../apps/math-integrations/wordpress/README.md).
That artifact is separate from the standalone browser sample and supports dedicated
math blocks; inline formulas inside Gutenberg RichText paragraphs remain future work.

TinyMCE and CKEditor samples use local development/evaluation license settings;
configure the host's own license and assets before deployment. TinyMCE documents
its GPL/commercial choice and `license_key` setting in its
[license configuration guide](https://www.tiny.cloud/docs/tinymce/latest/license-key/).
CKEditor documents its separate GPL/commercial terms in its
[licensing guide](https://ckeditor.com/docs/ckeditor5/latest/getting-started/licensing/license-and-legal.html).
The Barocss adapter does not grant either host SDK's license or activate paid features.

## Tiptap

The integration consumes the host's Tiptap and ProseMirror dependencies. Do not install
multiple independent copies of ProseMirror state/model in the same editor bundle.

```ts
import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import { BarocssMath } from '@barocss/math-editor-tiptap';
import katex from 'katex';
import '@barocss/math-editor/style.css';
import '@barocss/math-editor-tiptap/style.css';
import 'katex/dist/katex.min.css';

const editor = new Editor({
  element: document.querySelector('#editor')!,
  extensions: [
    StarterKit,
    BarocssMath.configure({
      locale: 'en',
      editing: 'inline', // Default: compact editing in the text flow. Use 'panel' for explicit Apply/Cancel.
      toolbar: true,
      toolbarMaxItems: 6,
      render(latex, host, displayMode) {
        katex.render(latex, host, { displayMode, throwOnError: false, trust: false });
      },
    }),
  ],
});

editor.commands.insertMath(String.raw`x_i^2`, 'inline');
editor.commands.insertMath(String.raw`\frac{a}{b}`, 'block');
const documentJSON = editor.getJSON();
editor.commands.setContent(documentJSON);
```

`insertMath(source?, kind?)` accepts LaTeX or a validated MathDocument. Unsupported
input returns false without changing the document. Both node types are installed by
`BarocssMath`; avoid registering them again yourself.

## ProseMirror

```ts
import { Schema } from 'prosemirror-model';
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { schema as basicSchema } from 'prosemirror-schema-basic';
import { history } from 'prosemirror-history';
import { mathNodes, createMathPlugin, insertMath } from '@barocss/math-editor-prosemirror';

const schema = new Schema({
  nodes: basicSchema.spec.nodes.append(mathNodes),
  marks: basicSchema.spec.marks,
});
const view = new EditorView(document.querySelector('#editor'), {
  state: EditorState.create({
    schema,
    plugins: [createMathPlugin({ locale: 'en', toolbar: false }), history()],
  }),
});

insertMath('x_i^2', 'inline')(view.state, view.dispatch);
```

Register your usual host keymaps, history shortcuts, and document commands as well.
The sample shows a complete setup. Supply the same `render` callback as the Tiptap
example to display typeset formulas; the default displays escaped LaTeX text.
KaTeX is a sample dependency, not an integration runtime dependency.

## Tiptap/ProseMirror: direct editing and panel editing

`editing: 'inline'` is the default. The input replaces the displayed formula at its
original position, without a full toolbar taking up document space. Suggestions still
work. A small floating bar offers More tools, Apply, and Cancel. More tools expands
the current draft into the panel without losing input. Clicking outside or moving
focus to another control applies the compact draft without stealing the destination
focus. Internal input replacement and suggestion clicks do not end editing.

`editing: 'panel'` starts with the toolbar and explicit Apply/Cancel actions. An outside
click leaves that draft open. The `inline`/`block` **node kind** separately determines
whether top-level multiple rows are allowed; editing layout does not change storage.

Each host `EditorView` coordinates one active math draft across both editing layouts.
Opening another supported formula applies the previous draft before opening the next.
A switch is blocked while the active draft is composing IME input. Separate host
editors have separate coordinators; the usual outside-click behavior still applies when focus moves between host editors.

## Tiptap/ProseMirror: shared toolbar

Provide `toolbarHost: HTMLElement` to place one toolbar in a dedicated container
outside the editable document. It follows the active formula and uses that draft's
session for structure insertion and Undo/Redo. With no active draft, editing actions
are disabled. The integration manages the toolbar's session and lifecycle; the host
application owns the container.

```ts
const toolbarHost = document.querySelector<HTMLElement>('#math-toolbar')!;

// Tiptap extension configuration:
BarocssMath.configure({ locale: 'en', toolbarHost, toolbarMaxItems: 6 });

// Equivalent ProseMirror plugin configuration:
createMathPlugin({ locale: 'en', toolbarHost, toolbarMaxItems: 6 });
```

Shared toolbar editing commands are disabled during IME composition. In compact mode, moving keyboard focus out of both the draft and shared toolbar applies the draft.

Use a separate toolbar container for each host editor. `toolbar: false` disables the
math toolbar, including the shared toolbar when a host is supplied. Without
`toolbarHost`, the existing compact inline and expanded panel toolbar behavior is
preserved. Suggestions and draft Apply/Cancel controls remain available.

For a custom embedding outside these integrations, the native math editor also
exports an independently mounted toolbar from `@barocss/math-editor/dom`:

```ts
import { mountMathToolbar } from '@barocss/math-editor/dom';
import type { MathSession } from '@barocss/math-editor/core';

const toolbar = mountMathToolbar(toolbarHost, null, {
  locale: 'en',
  maxItems: 6,
  onExecute: () => {
    // Restore focus to your active math editor if your host UI requires it.
  },
});

function activateFormula(session: MathSession | null) {
  toolbar.setSession(session);
}

// On host teardown:
toolbar.destroy();
```

`mountMathToolbar(host, session | null, { locale, maxItems, onExecute })` returns
`setSession(next | null)` and `destroy()`. Switching sessions removes the previous
subscription. An attached session supplies its locale; `locale` initializes labels
before a session is attached. Passing `null` detaches the session and disables
editing actions. This API controls a toolbar only; the custom host owns draft and
focus coordination. Do not mount it into a container already managed by
`toolbarHost`.

## Tiptap/ProseMirror: editing contract

| Action | Result |
| --- | --- |
| Click a formula or press Enter on its node selection | Open a draft for that formula |
| ArrowRight immediately before inline math / ArrowLeft immediately after it | Open at the formula's start / end |
| Delete immediately before nonempty inline math / Backspace immediately after it | Open at the start / end before deleting mathematical content |
| Delete or Backspace beside empty inline math | Keep the host's normal deletion behavior |
| Delete or Backspace with a whole formula selected | Keep the host's normal selection deletion behavior |
| Open another formula in the same host editor | Apply the previous draft, then open the next; block switching during composition |
| Apply / Ctrl+Enter / Cmd+Enter | Commit and return the cursor to the host |
| Enter in inline math | Accept a suggestion first; otherwise apply |
| Enter in block math | Accept a suggestion first; otherwise add a row according to math editor policy |
| Escape | Dismiss math suggestions/selection first; then cancel |
| Tab or an arrow that exits the math editor | Apply and return to the host boundary |
| Cancel | Discard the draft |
| Host read-only enabled | Discard the draft and disable editing |
| Host changes the same formula while a draft is open | Close the draft and show a conflict notice |
| Save host document programmatically while a draft is open | Save the committed document; draft is not included |
| Click outside compact editing | Apply before the destination receives the click |
| More tools | Expand the same draft into panel editing |

Boundary entry requires a collapsed host text selection immediately beside supported
inline math. Range selections, Shift selection, modifier shortcuts, IME input, and
read-only mode retain their host behavior. Unsupported formulas do not consume host
navigation or deletion keys. Block math still opens by clicking it or pressing Enter
on its node selection.

Math editing has its own undo history while a draft is open. After Apply, the host's
history owns the committed change. Multiple users editing the same formula are not
merged at the level of individual math tokens. Do not advertise collaborative formula
editing from this integration alone.

## Storage and clipboard

All adapters preserve these shared formula values, with host-specific envelopes:

```ts
interface MathAttributes {
  latex: string;
  mathDocument: MathDocument | null;
  fontSize?: number; // Display scale in percent; defaults to 100.
}
```

Tiptap/ProseMirror, Lexical, and Slate use their document JSON formats; Editor.js uses the
math Tool's block `data`; Quill uses Delta embed values. Slate omits an absent
`mathDocument` property because its operations reserve `null`. TinyMCE's `getContent()`
and CKEditor's `getData()` return HTML. Use the corresponding host save/load APIs,
not a live editing container's `innerHTML`. Adapter guides describe their exact
node names and data conversion hooks.

The JSON model is authoritative when present. `latex` is its portable representation.
A null model enables LaTeX import when editing. An invalid/newer model is preserved
and cannot be edited; it is never silently replaced by a partial LaTeX conversion.
Inline mode rejects multiple top-level rows, while structured matrices remain allowed.

Most HTML converters use `data-barocss-math="inline|block"`,
`data-latex`, `data-math-document`, and `data-math-size`. The serialized visible
content is plain LaTeX; editing views render it after loading. Preserve these
attributes in HTML sanitizers. Quill also uses its registered math classes when
importing HTML. Editor.js's block Tool saves JSON and does not provide a general
host HTML/inline clipboard converter.

Gutenberg instead stores a single `mathData` string containing a versioned
UTF-8/base64 envelope of the shared values. This preserves model text through
WordPress's block-attribute sanitization. Its saved block comment contains
`mathData`, and saved HTML uses `data-math-data` with an escaped LaTeX fallback.
Encoding is for data preservation, not encryption or permission to execute content.
Use the [Gutenberg codec and save format](docs/GUTENBERG.md#stored-data);
do not substitute raw `mathDocument`/`latex` comment attributes.

An external editor that strips custom attributes may retain only the LaTeX text.
Cross-host clipboard conversion is not a blanket support guarantee; use each
adapter's documented pipeline. Plain text is not automatically interpreted as
LaTeX: use an explicit insertion command.

## Localization

Integration labels are in `src/locales/en.json` and `ko.json` with English keys.
Set `locale` for the underlying math editor, and override integration labels through
`messages: { apply: '...', cancel: '...', ... }`. For another language, register its
math-editor locale separately; `messages` covers only host integration controls.
English is the integration fallback. Runtime locale changes require recreating the
integration/plugin; live locale switching is not yet an API contract.

## Verification and release boundaries

See [host support](HOST-SUPPORT.md), [VALIDATION.md](VALIDATION.md),
[ROADMAP.md](ROADMAP.md), and the
[licensing guide](COMMERCIAL-MODEL.md).
Barocss adds no licensing server, billing, or integration license-key enforcement to
this preview. Host SDK license configuration is separate. No commercial support
commitment is made. `release:math` validates and batch-publishes the core and all
nine public plugins. The private implementation workspace is excluded. See the
[release guide](docs/RELEASING.md) for versioning and individual artifact checks.
`release:math:site` stages the shared sample and documentation while identifying
the integration preview separately from the supplied core artifact.

The adapters use the documented host extension points: [Tiptap node views](https://tiptap.dev/docs/editor/extensions/custom-extensions/node-views),
[Lexical nodes](https://lexical.dev/docs/concepts/nodes),
[Editor.js Tools](https://editorjs.io/tools-api/),
[TinyMCE plugins](https://www.tiny.cloud/docs/tinymce/latest/creating-a-plugin/),
[CKEditor widgets](https://ckeditor.com/docs/ckeditor5/latest/framework/tutorials/widgets/implementing-an-inline-widget.html),
[Quill's API](https://quilljs.com/docs/api/),
[Slate void elements](https://docs.slatejs.org/api/nodes/element),
and [Gutenberg block registration](https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/). Host-specific setup and verification
remain necessary even when adapters share the same math editor.

### Formula size and dragging

The editing controls adjust the formula's display size from 50% to 200% in
10-point steps. The formula data stores `fontSize` as a percentage (default `100`),
separately from `latex` and `mathDocument`. HTML clipboard/export preserves it as
`data-math-size`. Applying commits content and size together; Cancel discards
both. With host history configured, Undo restores the previous values; Editor.js
requires a separate document-history solution. LaTeX export does not include
this host presentation setting.

In Tiptap/ProseMirror, native node dragging is disabled while editing so mouse
selection belongs to the math editor. Preview nodes remain draggable. Other hosts
retain their own object/embed/block selection and dragging behavior.

## Styling

Core CSS variables also style plugin panels, buttons and in-place fields. See [Styling & themes](../math-editor/STYLING.md) for scoped themes, separate toolbar hosts, iframe CSS and persisted formula sizing.
