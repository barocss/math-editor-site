# Integration product roadmap

## Completed local editing milestone — 2026-09-13

All nine current host demos passed the continuous editing chain with the current core candidate. [Validation](VALIDATION.md) records host persistence, history, read-only and inline-boundary scope. The shared gate also checks standalone/framework behavior and KaTeX geometry. This closes the current local editing milestone, not compatibility certification or publication. The broader stages below retain their own criteria.

The developer SDK now has development-preview adapters for Tiptap, ProseMirror,
Lexical, Editor.js, TinyMCE, CKEditor 5, Quill, Slate, and WordPress Gutenberg. The common math editor remains
the source of truth for notation, parsing, and draft editing. Each adapter owns
its host's document representation, commands, selection, history, and teardown.

| Stage | Status | Scope / remaining criteria |
| --- | --- | --- |
| ProseMirror NodeView and Tiptap 3 extension | Implemented preview | Inline/block nodes, insertion, host JSON/HTML storage |
| Common native math field | Implemented preview | Draft Apply/Cancel, previews, display scale, compact/panel layouts, optional shared toolbar |
| Native toolbar and pointer selection parity | Implemented in workspace; awaiting release | All-symbol search, templates/presets, active-grid row/column/delimiter controls, partial-text highlights and drag from the active input across structures |
| Additional host adapters | Development previews | Lexical, Editor.js, TinyMCE, CKEditor, Quill, Slate and Gutenberg; host-specific limits below |
| Installable WordPress plugin | Development preview | ZIP build, server-side block registration and local assets; actual WordPress 7.1 author save/reload and frontend rendering verified |
| Tiptap/ProseMirror keyboard boundaries | Implemented preview | Adjacent inline entry, deletion policy, one active draft per EditorView, IME switch protection |
| Unified developer sample | Implemented preview | All nine hosts in one selector, shared save/restore/readonly/history controls, preserved older links |
| Main-site integration documentation | Implemented preview | Rendered setup guides for all nine hosts, support/validation/release guides and the unified sample under `/integrations/` |
| Individual npm artifacts | Published 0.1.0 | Nine public host packages with MIT, external core/host peers and no private runtime dependency or source maps |
| Plugin source ownership | Implemented in workspace | Each plugin owns source, tests and build configuration; common helpers contain no host SDK imports; Tiptap depends on the public ProseMirror package |
| Product-scoped Changesets and publishing | Implemented | Independent versions, scoped version preview and one local pnpm batch release for the core and nine public plugins |
| Integration verification | In progress | Record unit and browser evidence per adapter in VALIDATION and HOST-SUPPORT; availability is not certification |
| Embedding polish | Planned | Mobile controls, keyboard entry parity where supported by the host, insertion/focus refinements |
| Compatibility certification | Planned | Pinned host/browser matrix, Safari/Firefox, OS IME and accessibility audit |
| Document interoperability | Planned | Sanitizer recipes, clipboard tests, Markdown hooks, migration from other math extensions |
| Collaborative editing | Planned | Document-level conflict UX and host-specific collaboration tests; no math-token merge guarantee |
| Package licensing | Implemented | MIT LICENSE and metadata in the core, all nine plugins, and the shared source package; copyright barocss.com |
| Paid distribution | Deferred | No paid integration license or billing in the current release scope |
| Public launch | Not released | Release criteria and customer pilot completed |

The integration package remains private and unreleased. The core, all nine host
plugins, and the shared integration source use MIT. Each includes its own LICENSE
file. Private package metadata prevents accidental npm publishing; it does not
make a public repository private. Generated integration modules leave host imports
external. Each prepared public package requires the core and its own host SDKs;
the internal workspace has no host SDK peers. Tiptap also depends on the public
ProseMirror plugin. The local demo consumes the public package exports and
bundles its host dependencies separately. See the [release guide](docs/RELEASING.md).


## Scoped style customization — workspace, 2026-09-09

Implemented: inherited CSS variables for UI/token colors, slot backgrounds,
controls, toolbar density and floating menus. Both renderers retain per-editor
palette values on suggestion/selection portals and follow live ancestor theme
switches. Shared plugin panels/actions use the same palette; persisted host
formula sizing remains document data. The site includes default/dark/monochrome,
base-size and compact-spacing controls. See [Styling & themes](../math-editor/STYLING.md).


## TinyMCE in-place editing — workspace, 2026-09-09

TinyMCE now defaults to `editing: "inline"` in both inline and classic iframe
hosts. Existing formulas open in place; new formulas use a temporary marker at
the selection. The explicit external panel remains available. Transient UI is
excluded from normal serialization and raw Undo snapshots, and pending openings
respect Cancel, reload, read-only and destruction. See the [TinyMCE guide](docs/TINYMCE.md)
for iframe style loading and the normal serialization lifecycle contract.

The shared field prevents a host's synchronous focus changes during Apply from
reapplying the same draft. A visible wrapping menu uses Up/Down to navigate
while retaining the selection. Left/Right restores the caret; Shift+arrows
adjusts the range. Alt+Up/Down also navigates the menu.
This work is implemented in the workspace and awaits release.

## Native editing progress — workspace, 2026-09-09

The shared native editor now supplies searchable All symbols, templates and matrix
presets through More tools. Its active-grid controls edit matrix rows, columns and
delimiters, with row controls for aligned/cases. Precise partial-text highlights and
dragging from an active input across structures use the existing model selection
and clipboard rules. These additions await the planned core release; they do not
change host persistence formats or add LaTeX syntax.

Toolbar panels remain inside their editing/toolbar host so browsing can keep the
draft open. The native toolbar's `setDisabled` and `setSession` methods support
composition and active-draft coordination; adapters retain their Apply/Cancel,
focus restoration and host-history responsibilities. See the
[native toolbar API](../math-editor/API-SESSION.md#independent-toolbar-and-outputs).

Shift+arrow model ranges are implemented. Native input now uses one lexical token, with matching role colors and token-boundary editing. Rectangular
matrix selection, shape-checked clipboard and transpose are now implemented in both
renderers in the workspace; broader host/browser validation remains. Complete bundled locales remain
English/Korean; native OS IME validation is deferred. The website's PNG download/copy
controls are preview features, not a library or host-adapter image-export API.
Workspace utilities now add explicit LaTeX paste, recent/favorite symbols/templates and contextual presentation settings through the common core. These changes do not alter host storage.
Host/browser evidence continues to be recorded in [VALIDATION.md](VALIDATION.md).

## Current host scope

The versions below are development targets. Local Chromium workflows have been
checked for all nine adapters, including Gutenberg in WordPress 7.1. These
results are not broad compatibility claims.

| Host | Target | Delivery scope |
| --- | --- | --- |
| [Tiptap](README.md#tiptap) | 3 | Extension over the ProseMirror NodeView and draft coordinator; inline/block formulas |
| [ProseMirror](README.md#prosemirror) | 1 | Node specs, plugin, commands and NodeView; inline/block formulas |
| [Lexical](docs/LEXICAL.md) | 0.50.0 | DecoratorNode, commands and native math field; inline/block formulas; host history configured separately |
| [Editor.js](docs/EDITORJS.md) | 2.31.6 | Block Tool and native math field; block formulas only; no built-in document Undo/Redo |
| [TinyMCE](docs/TINYMCE.md) | 8.9.0 | Plugin, toolbar/menu/command, atomic inline/block HTML formulas; in-place editing in inline/iframe hosts; optional external panel |
| [CKEditor 5](docs/CKEDITOR.md) | 48.5.0 | Model objects, conversion, commands and native widgets; inline/block formulas |
| [Quill](docs/QUILL.md) | 2.0.3 | Inline Embed and BlockEmbed, Delta persistence and native math field; development preview |
| [Slate](docs/SLATE.md) | slate 0.126.2 / slate-react 0.126.4 | Inline/block void elements, React rendering, node JSON, insertion and Slate history batches |
| [Gutenberg](docs/GUTENBERG.md) | npm blocks 15.27.0 / block-editor 17.0.0; WordPress 7.1 | Dedicated math block, encoded `mathData`, deterministic save markup and [installable WordPress preview ZIP](../../apps/math-integrations/wordpress/README.md); local author persistence and frontend checks passed |

Inline **formula placement** does not promise in-place editing, and a shared math
field does not promise identical clipboard or keyboard behavior across hosts.
Editor.js's separate block model needs its own inline proposal and host-history
solution before either capability can be advertised. See
[host support](HOST-SUPPORT.md) and [VALIDATION.md](VALIDATION.md) for evidence
and the checks still required.
Gutenberg's current block support does not include inline formulas inside RichText
paragraphs. Its encoded storage format preserves model text through WordPress
sanitization; use the adapter's versioned codec rather than raw comment attributes.

TinyMCE and CKEditor license configuration belongs to the host application. Local
demo GPL/evaluation settings are not a deployment entitlement. Follow the
[TinyMCE license-key documentation](https://www.tiny.cloud/docs/tinymce/latest/license-key/)
and [CKEditor licensing guide](https://ckeditor.com/docs/ckeditor5/latest/getting-started/licensing/license-and-legal.html)
when choosing the applicable host configuration. Barocss distribution terms do
not replace those SDK terms, and the adapters do not supply paid keys or features.

## Future host expansion

| Host / surface | Status | Separate work required |
| --- | --- | --- |
| Gutenberg RichText inline math | Future | Inline format registration, paragraph caret/selection behavior, serialization and interoperability |
| CodeMirror | Future source-editor adapter | LaTeX source ranges, decorations, explicit math editing and source transaction mapping |
| Monaco | Future source-editor adapter | LaTeX source model ranges, decorations/widgets, selection and undo mapping |
| Google Docs | Future, separate add-on track | Google Workspace APIs, document insertion/update, authorization and add-on distribution |
| Google Slides | Future, separate add-on track | Slide object insertion/update, authorization and add-on distribution |

CodeMirror and Monaco edit source text; their planned scope is distinct from rich
text inline atoms. Google Docs and Slides require separate add-on delivery, not
a drop-in JavaScript plugin attached to their web editors. No implementations,
release dates, or compatibility certification are implied by this future list.

## Licensing

The current release uses MIT for the core and all Barocss host plugins. Paid
integration licensing is deferred. The earlier free/paid proposal is not an active
distribution policy. See the [licensing guide](COMMERCIAL-MODEL.md) and the LICENSE
included in each package. Host SDKs retain their own licenses.

## Suggested first customer scope

Choose one host and a pinned supported version range for the initial pilot. Verify
its supported formula placements, local editing, LaTeX import, native document
round trips, configured host history, HTML/clipboard preservation where applicable,
read-only behavior and teardown. Define the browser and support policy around
that evidence before making a maintenance commitment. Additional editor hosts,
source-editor adapters and Google Workspace add-ons need their own delivery and
verification criteria.


## Continuous editing evidence — workspace, 2026-09-10

EDIT-019 covers all nine integration demos: Quill, Tiptap, ProseMirror, Lexical,
TinyMCE, CKEditor and Slate in block/inline modes, plus Editor.js and Gutenberg
block modes. With standalone React block, 17 targets pass 499 checkpoints.
The chain verifies nested editing, formula history, persistence and inline prose
continuation. Apply is one host history event where host history is configured.
Editor.js document Undo/Redo remains unverified because its demo has no history
integration.

The Tiptap demo separates Restore from subsequent typing in history. TinyMCE
keeps empty formulas clickable through a localized preview placeholder. The
Slate/Gutenberg extension required no runtime fixes.

This baseline uses Chromium on macOS. TinyMCE classic iframe, other CKEditor
builds, installed WordPress admin and native OS input require separate runs.
Next: range clipboard, populated/grid deletion and broader browser/input coverage.
Passing this one chain does not certify every integration scenario.
