# Host support matrix

Workspace development previews. The adapters are not a claim of support for every
host version or browser. Each subpath uses its host SDK as an optional peer, and
the SDK must be installed by that adapter's consumer. The TypeScript build leaves
host imports external; the library package does not vendor these editors.

| Host | Implementation target | Entry | Formula kinds | Editing surface | Persistence | Host Undo |
| --- | --- | --- | --- | --- | --- | --- |
| Tiptap | 3.31.3 | `/tiptap` | Inline and block | In-place or panel; shared toolbar | JSON and HTML | Host history |
| ProseMirror | model 1.25.11, state 1.4.4, view 1.42.3 | `/prosemirror` | Inline and block | In-place or panel; shared toolbar | JSON and HTML | Host history |
| Lexical | 0.50.0 | `/lexical` | Inline and block | Native DOM field in a DecoratorNode | EditorState JSON and HTML | With `@lexical/history` |
| Editor.js | 2.31.6 | `/editorjs` | Dedicated block | Native DOM field in a Block Tool | OutputData block data | Separate host history extension required |
| TinyMCE | 8.9.0 | `/tinymce` | Inline and block | In-place draft; optional panel | Canonical HTML | Undo manager transaction |
| CKEditor 5 | 48.5.0 | `/ckeditor` | Inline and block | Native DOM field in a model object widget | Canonical HTML | One model batch per Apply |
| Quill | 2.0.3 | `/quill` | Inline and block | Native DOM field in Embed/BlockEmbed | Delta and semantic HTML | History module boundaries |
| Slate | slate 0.126.2, slate-react 0.126.4, slate-dom 0.126.0, slate-history 0.113.1 | `/slate` | Inline and block | Native DOM field in React-rendered void elements | Slate node JSON; explicit HTML conversion helpers | One `withNewBatch` per Apply |
| WordPress Gutenberg | npm blocks 15.27.0, block-editor 17.0.0; WordPress 7.1 / PHP 8.3 checked locally | `/gutenberg` | Dedicated block | Native DOM field inside `barocss/math` | Versioned encoded `mathData` in block comments and saved HTML | One public block update per Apply; WordPress post history or standalone document store |

The model format is shared: `{ latex, mathDocument, fontSize }`. A non-null model
is authoritative. Invalid or newer models stay stored and uneditable, rather than
being silently replaced by a partial LaTeX import. Host converters must exclude
the live input, suggestion list, action buttons, and renderer markup from storage.
Slate omits an absent model property. Gutenberg wraps the shared values in a
UTF-8/base64 `mathData` envelope to preserve text through WordPress sanitization;
its format is not the raw attribute envelope used by the other adapters.

All adapters use the same math core, suggestion catalog, parser, and native
editing surface. The established Tiptap/ProseMirror boundary-arrow behavior is
not automatically promised for every new host. New adapters support their host's
object selection and explicit edit controls; keyboard, clipboard and accessibility
certification remains host-specific. Editor.js paragraph-level inline formulas
and built-in document Undo are outside the current tool's scope.
Gutenberg currently provides dedicated math blocks, not a RichText inline format.

## Verification and distribution

See [VALIDATION.md](VALIDATION.md) for actual tests and outstanding checks. Local
examples share `/` with an `editor` query for all nine hosts; old `/plugins.html`
links redirect there. The main site stages this page at `/integrations/`. Demo
sources and host SDK assets are separate from the library's published-file list.
The internal integration package stays private. Nine host-specific npm packages
are prepared for version 0.1.0, but are not published. See the
[release guide](docs/RELEASING.md) for their names and required host peers.
Recorded Chromium workflows cover all nine adapters. Gutenberg also passed an
actual WordPress 7.1 author save/reload and frontend-rendering workflow. The
[WordPress plugin ZIP guide](../../apps/math-integrations/wordpress/README.md)
describes the separate preview artifact; its loader requirements are not a tested
WordPress compatibility range.

The math-editor core and all Barocss host adapters use the MIT license. TinyMCE
and CKEditor licensing belongs to the host application; the adapters' MIT license
does not replace those terms. Their local demos use explicit development/evaluation
settings and are not a proprietary deployment recipe. Read their official
[TinyMCE license configuration](https://www.tiny.cloud/docs/tinymce/latest/license-key/)
and [CKEditor license guide](https://ckeditor.com/docs/ckeditor5/latest/getting-started/licensing/license-and-legal.html).

## Further adapters

| Candidate | Integration shape still to implement |
| --- | --- |
| Gutenberg RichText inline math | Separate inline format, caret/selection behavior, saved markup and paragraph interoperability |
| CodeMirror / Monaco | Source-editor decorations, command/selection mapping, and preview widgets |
| Google Docs / Slides | Separate Workspace add-ons using supported document and presentation APIs |

These rows are future work, not current capabilities. Add a host only with a real
sample, storage round-trip tests, edit/cancel/read-only behavior, and the host's
history contract documented.
