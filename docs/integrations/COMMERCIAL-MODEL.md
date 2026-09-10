# Licensing

The math-editor core, all nine Barocss host plugins, and the shared integration
source package use the **MIT License**. Copyright (c) 2026 barocss.com.
Each package includes its own `LICENSE` file with the full license text.

## Package scope

| Package | License | Distribution status |
| --- | --- | --- |
| `@barocss/math-editor` | MIT | Core release 0.4.0 |
| `@barocss/math-editor-tiptap` | MIT | First release 0.1.0 |
| `@barocss/math-editor-prosemirror` | MIT | First release 0.1.0 |
| `@barocss/math-editor-lexical` | MIT | First release 0.1.0 |
| `@barocss/math-editor-editorjs` | MIT | First release 0.1.0 |
| `@barocss/math-editor-tinymce` | MIT | First release 0.1.0 |
| `@barocss/math-editor-ckeditor` | MIT | First release 0.1.0 |
| `@barocss/math-editor-quill` | MIT | First release 0.1.0 |
| `@barocss/math-editor-slate` | MIT | First release 0.1.0 |
| `@barocss/math-editor-gutenberg` | MIT | First release 0.1.0 |
| `@barocss/math-editor-integrations` | MIT | Private shared source; not an npm install target |

The shared integration source remains private. Only the core and nine host plugin
packages are npm release targets. A LICENSE file does not publish a package or its repository.

## Current release policy

Paid integration licensing is deferred. The earlier proposal to charge for use in
paid services is not an active policy. These packages are distributed under their
included MIT licenses; no Barocss license key, billing account, or entitlement
check is required.

Retain the copyright and permission notice as required by the included LICENSE.
The license text also defines the warranty and liability terms. No paid support
service is part of this release.

## Host SDKs and bundled assets

Host editor SDKs retain their own licenses. The Barocss adapter license does not
replace the licenses of TinyMCE, CKEditor, WordPress, or any other host dependency.
Host SDKs remain external dependencies of the individual npm plugins.

The core includes a separate KaTeX font license at
`src/fonts/LICENSE-KaTeX.txt`. Keep that notice with the bundled fonts.

See [host support](HOST-SUPPORT.md) for host setup and
[release preparation](docs/RELEASING.md) for package verification.
