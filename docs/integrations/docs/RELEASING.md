# Publishing the host plugins

The release set contains the core and nine host adapters as separate
npm packages. Changesets manage the core and each plugin independently.
The source repository and the shared integration workspace stay
private. Generated JavaScript remains readable by anyone who receives it.

## Package boundaries

| Host | npm package | Public entries |
| --- | --- | --- |
| Tiptap | `@barocss/math-editor-tiptap` | main, `/shared`, `/style.css` |
| ProseMirror | `@barocss/math-editor-prosemirror` | main, `/shared`, `/style.css` |
| Lexical | `@barocss/math-editor-lexical` | main, `/shared`, `/style.css` |
| Editor.js | `@barocss/math-editor-editorjs` | main, `/shared`, `/style.css` |
| TinyMCE | `@barocss/math-editor-tinymce` | main, `/shared`, `/style.css` |
| CKEditor 5 | `@barocss/math-editor-ckeditor` | main, `/shared`, `/style.css` |
| Quill | `@barocss/math-editor-quill` | main, `/shared`, `/style.css` |
| Slate | `@barocss/math-editor-slate` | main, `/shared`, `/style.css` |
| Gutenberg | `@barocss/math-editor-gutenberg` | main, `/shared`, `/style.css`, `/data` |

Each public plugin owns its host source, tests and TypeScript configuration.
The private `@barocss/math-editor-integrations` package contains only common
data, draft-field UI, messages and styles, with no host SDK dependencies.
The common build helper compiles each plugin's own `src/` and bundles only the
common modules it uses. It includes declarations and message JSON
needed by TypeScript, but omits implementation TypeScript and source maps. The
public packages have no runtime or type dependency on the private package.

Changing workspace `exports` to source paths does not change that distribution
boundary. Do not add the private common package to the npm release set. The release
check rejects its name in dependency fields, JavaScript and type imports. A consumer
site must work with the ten public package archives and no common package installed.

Workspace `exports`, `main` and `types` resolve source files for Vite and
TypeScript consumers. Apps do not need a package build before development.
`publishConfig.exports`, `publishConfig.main` and `publishConfig.types` resolve
the shipped JavaScript and declarations. Core CSS/font paths remain unchanged.
The private common package exposes source only and is never published.

Use the release commands below or `pnpm pack` for public packages. pnpm applies
the publish overrides; the plugin release staging code applies them explicitly
before its `npm pack` call. Direct `npm pack` on a workspace source manifest is
not the release workflow. Declaration builds use `tsconfig.math-build.json` to
read already-built dependency declarations without including sibling source.
An explicit artifact directory in the sample Vite configuration selects published
exports. Ordinary development and `pnpm build:math:site` select workspace source
exports. The default site build does not require npm publication, a version bump
or package dist folders. It records local versions only as build metadata.

Tiptap declares ProseMirror as a normal public package dependency and imports its
existing API. The build keeps that dependency external. pnpm/Changesets can track
this relationship, and batch publishing places ProseMirror before Tiptap. Private
common declarations are copied under each artifact's `dist/_shared/` directory.

Each package lists the public math core and its own host SDKs as required peers.
It does not bundle React, WordPress, CKEditor, or any other host runtime. The first
release requires `@barocss/math-editor` **at the compatible peer version declared by each plugin**, which
includes the shared toolbar, token editing, LaTeX insertion and iframe APIs.

WordPress has two delivery paths: the npm Gutenberg adapter for custom builds,
and the separately built [installable plugin ZIP](../../../apps/math-integrations/wordpress/README.md).
Publishing the npm adapter does not publish a WordPress.org plugin.

## Changesets and versions

Keep independent versions: `fixed` and `linked` groups are unnecessary. Add a
Changeset for every affected public package. Because shared implementation is
bundled rather than installed as a public dependency, Changesets cannot infer all
affected hosts from an edit to the private workspace.

- A Slate-only bug fix names the Slate package with `patch`.
- A shared draft/clipboard fix names every adapter that embeds that code.
- An additive public API uses `minor`; a breaking API or storage change requires
  an explicit compatibility and migration decision.
- A core change also names `@barocss/math-editor`; raise plugin peer minimums when
  they start calling newly released core APIs.

Preview the complete math product release, then apply the reviewed plan:

```sh
pnpm version:math:plan
pnpm version:math
```

The product versioner isolates the core and nine public plugin packages. It preserves unrelated
workspace changesets and refuses a changeset that mixes selected products with
an unrelated package. `pnpm version:math` applies the complete math product plan;
it does not bump other products. `pnpm version:math:core` is available when only
the core must be versioned. Do not run repository-wide version commands or an
unfiltered recursive publish for a math-only release.

The first plugin release is already published. Review future peer-range changes
as compatibility changes: Changesets can promote a plugin to a major version
when a core update changes its peer requirement. Independent versions do not
mean that a shared implementation change affects only one package.

## Local batch release

```sh
# One command: build, validate and publish the core plus all nine public plugins.
pnpm release:math
# Check the same flow without uploading packages:
pnpm release:math:dry-run
```

The command runs `pnpm -r publish` in a generated workspace containing only the
ten inspected packages. It orders the core before the plugins, keeps framework
and host SDKs external, and skips versions already present on npm. It does not
publish the private integration workspace or other products. npm can still ask
for authentication per package. See the [batch release guide](../../math-editor/RELEASING.md)
for reports, partial failures, validation and website deployment.

## Build and inspect

```sh
pnpm build:math:plugins
# Build and test only CKEditor and its common prerequisites:
pnpm --filter @barocss/math-editor-ckeditor build
pnpm --filter @barocss/math-editor-ckeditor test
# Preferred preparation for the complete math product:
pnpm release:math:prepare
# Optional plugin-only artifact inspection:
pnpm release:math:plugins:prepare
# Or prepare just the selected host artifacts:
pnpm release:math:plugins:prepare --editor slate,lexical
```

Preparation builds the selected plugins and their public plugin dependencies,
checks each package's types/tests, creates npm tarballs and a
release report, and verifies that private imports, undeclared host dependencies,
implementation sources and source maps are absent. It works before publication;
the report records any version or license condition that still prevents publishing.
The isolated consumer check loads declarations from the extracted tarballs with
the pinned workspace SDKs supplied as external peers. It is not a claim that an
unreleased peer version is already installable from npm.

## Publication prerequisites

The plugin manifests use `license: "MIT"` and each package includes a LICENSE file
with copyright attributed to barocss.com. Only the nine public plugin manifests
have `private: false`; the shared source remains private. Before producing publishable artifacts:

1. Verify that each selected tarball includes its README and MIT LICENSE, and
   that its manifest declares `license: "MIT"`. Host SDK licenses are separate;
   see the [licensing guide](../COMMERCIAL-MODEL.md).
2. Set `private: false` only for packages selected for publication, and apply the
   reviewed version plan. Update the README's unpublished status at that point.
3. Verify that plugin peer ranges accept the core version in the batch. Batch
   preparation checks this before publishing. For a plugin-only release, verify
   that a compatible core is already on npm.
4. Prepare new plugin artifacts and review their report. Ensure the npm account
   has publish access to the `@barocss` scope and can satisfy registry authentication.

The default is `pnpm release:math`. For an explicitly selected plugin-only
release, the existing artifact command can publish the exact reviewed tarballs
from plugin preparation:

```sh
pnpm release:math:plugins --from output/math-plugin-releases/<release>/release.json
```

The command accepts only the nine known plugin names, verifies artifact hashes and
manifest contents again, checks the published core requirement, and publishes
stable versions with the `latest` tag. It never publishes the private integration
workspace, the core, or other products as a side effect. If a registry operation
fails partway through, `publish-results.json` records each attempt, including
successful and uncertain results. A report with an existing attempt record cannot
be reused. Preserve that record, reconcile the versions on npm, and prepare a new
report containing only packages confirmed unpublished. Published versions cannot
be overwritten.

TinyMCE, CKEditor and WordPress licensing obligations are separate from the Barocss
license. The public sample build currently leaves TinyMCE/CKEditor demos disabled
until an appropriate host license configuration is supplied. Their local examples
and all nine documentation pages remain available. See the host guides before
deploying those SDKs.

References: [Changesets configuration](https://changesets.dev/guide/config),
[Changesets CLI](https://changesets.dev/guide/cli),
[npm package metadata](https://docs.npmjs.com/cli/v11/configuring-npm/package-json/),
and [scoped public packages](https://docs.npmjs.com/creating-and-publishing-scoped-public-packages/).
