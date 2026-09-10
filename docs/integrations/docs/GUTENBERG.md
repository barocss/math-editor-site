# WordPress Gutenberg integration (development preview)

The examples below use its public entry points. See the [release guide](RELEASING.md).

[Open the Gutenberg example](/integrations/?editor=gutenberg) · [Host support](../HOST-SUPPORT.md) · [Validation](../VALIDATION.md)

`registerBarocssMathBlock(options)` registers the real `barocss/math` block through
WordPress's block API. This first version supports block formulas. Its editing
surface uses the shared Barocss math field inside the block; it does not add an
inline formula format to RichText paragraphs.

```ts
import { createBlock } from "@wordpress/blocks";
import { dispatch } from "@wordpress/data";
import { store as blockEditorStore } from "@wordpress/block-editor";
import {
  registerBarocssMathBlock,
  encodeGutenbergMathData,
} from "@barocss/math-editor-gutenberg";
import { mathAttributes } from "@barocss/math-editor-gutenberg/shared";
import "@barocss/math-editor/style.css";
import "@barocss/math-editor-gutenberg/style.css";

registerBarocssMathBlock({ locale: "en", editing: "panel" });
dispatch(blockEditorStore).insertBlocks(
  createBlock("barocss/math", {
    mathData: encodeGutenbergMathData(
      mathAttributes(String.raw`\frac{x^2}{y}`, "block")!
    ),
  })
);
```

Register before the block editor mounts. Repeated registration returns the existing
block type, so the first options supplied in that WordPress blocks registry win.
Pass the common `locale`, `messages`, toolbar and preview `render` options. A custom
renderer is editor-only and must use the provided element's `ownerDocument` when
creating nodes. Load math and renderer CSS in the editor canvas as well as the
outer document when WordPress uses an iframe.

The React edit wrapper uses WordPress's `useBlockProps` and public block store. Draft typing and font-size changes stay outside block attributes until
Apply. Cancel discards the draft. An Apply updates `mathData` with one
`updateBlock` action, preserving the other attributes and block identity. This
keeps consecutive Apply operations as separate history steps instead of grouping
them as continuous attribute typing. See the official
[`updateBlock` action](https://developer.wordpress.org/block-editor/reference-guides/data/data-core-block-editor/#updateblock). The field closes when its attributes change externally or
its inherited block editing mode becomes `disabled`. WordPress retains control of
block selection, ordering, deletion, and document history. See the official
[Edit and Save API](https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/)
and [block editing modes](https://developer.wordpress.org/block-editor/reference-guides/data/data-core-block-editor/#getblockeditingmode).

## Stored data

The block uses API version 3, category `text`, and disables HTML editing and custom
class names. Its complete attribute schema is exported as
`barocssMathBlockAttributes`:

```json
{ "mathData": { "type": "string", "default": "" } }
```

`mathData` is UTF-8 base64 encoding of this versioned JSON envelope:

```ts
{
  version: 1,
  value: {
    latex: string,
    mathDocument: MathDocument | null,
    fontSize: number // 50–200; default 100
  }
}
```

The authoritative math JSON and LaTeX fallback are encoded together because
WordPress recursively filters strings inside parsed block attributes. Raw model
text such as `<widget>` could otherwise be treated as HTML by KSES. Encoding is a
data-preservation format; it does not authorize executing decoded content. The
adapter does not disable WordPress sanitization. See
[`filter_block_kses_value`](https://developer.wordpress.org/reference/functions/filter_block_kses_value/).

The pure `@barocss/math-editor-gutenberg/data` entry exports
`encodeGutenbergMathData` and `decodeGutenbergMathData` without importing WordPress
or React. Empty data decodes to an editable empty formula. Invalid or newer
envelopes return `undefined` and remain byte-for-byte preserved. Newer math-model
versions retain their source and cannot be edited by an older math editor. Valid
JSON controls the editor preview even if its stored LaTeX fallback differs.

The pure save function writes a `div.wp-block-barocss-math` with
`data-barocss-math="block"`, the original `data-math-data`, `data-math-size`, and
escaped LaTeX fallback text. WordPress's block comment also contains `mathData`.
Preview HTML, toolbar controls, and live inputs never enter the saved content.
Keep this save output stable: WordPress validates saved block HTML on reload.
See [block registration](https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/).

## Standalone host and WordPress deployment

The local demo uses actual `BlockEditorProvider`, `BlockList`, `BlockTools`, core
paragraph blocks, and WordPress `parse`/`serialize`. A private document store made
with `@wordpress/data` tracks persistent provider changes for Undo/Redo. That
standalone host history is separate from the native WordPress post editor's
history. The readonly demo toggles the public block editing mode. See the official
[standalone block editor example](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/)
and [data registry API](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-data/).

The development package set uses `@wordpress/blocks` 15.27.0,
`@wordpress/block-editor` 17.0.0, `@wordpress/components` 40.0.0,
`@wordpress/data` 10.54.0, `@wordpress/element` 8.6.0, and React 19.2.8. These npm
versions do not establish a minimum compatible WordPress installation version.
WordPress SDKs and React remain peer imports in the integration package's `tsc`
output; consumers load the dependencies for their chosen adapter. A WordPress
plugin build should use the host's `wp` script dependencies and separately register
the server-side block metadata. The installable plugin scaffold and its runtime
validation have their own documentation and acceptance checks.

The [WordPress preview ZIP guide](../../../apps/math-integrations/wordpress/README.md)
provides the build and installation steps. The local wrapper was verified with
WordPress 7.1 / PHP 8.3, including its iframe editor, restricted author saves,
consecutive Apply/Undo, full reload/re-edit and frontend KaTeX rendering. See
[VALIDATION](../VALIDATION.md) for the evidence and untested environments.

The WordPress packages declare GPL-2.0-or-later. Review the applicable distribution
terms for your combined plugin; the Barocss core's MIT license is unchanged. The Gutenberg adapter is distributed through its own public package; shared
workspace helpers remain private. See
[WordPress's license](https://wordpress.org/about/license/).

## Continuous editing checks

The workspace EDIT-019 run on 2026-09-10 passes Gutenberg math blocks in the
standalone BlockEditorProvider demo, using Chromium on macOS. It covers nested
fraction/root/matrix input, two formula Undo/Redo chains, unchanged saved data
during drafts, Apply as one provider history event, Save/reload/Restore, re-edit
and Cancel. The demo's Undo/Redo callbacks are included in the test.

Persistence and history checks compare the full serialized block HTML, including
WordPress comments and encoded math data. Prose checks also retain block order.
See [validation evidence](../VALIDATION.md#edit-019-all-integration-demos--workspace-2026-09-10).
This run is separate from installed WordPress admin/plugin ZIP validation. It
does not establish WordPress version compatibility or cover native OS input.
