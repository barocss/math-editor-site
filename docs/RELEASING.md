# Releasing math editor

See [Editing scenarios](EDITING-SCENARIOS.md) for stable scenario IDs, acceptance criteria, coverage gaps and per-run reporting.


The source stays in this monorepo. The local batch release includes
`@barocss/math-editor` and the nine public host plugins. All use MIT, public npm
access and the `latest` tag. Framework adapters are core subpaths and share the
core version. The private integration workspace and other products are excluded.

The published baseline is core **0.4.0** and host plugins **0.1.0**. Later versions
remain independent; a batch release does not force every package to change.

## Local release

```sh
# Repository root. Login is handled by npm, never by storing credentials in the repository.
npm login --registry=https://registry.npmjs.org/
# After reviewing versions, changelogs and browser validation:
pnpm release:math
```

This one command runs release-tool tests, core formatting/type/unit checks,
integration type/unit checks, builds and package validation. It verifies the core
entry points and each plugin's packed declarations, runtime imports and required
files. It then runs **one `pnpm -r publish` command** for the ten allowed names.
`pnpm release` is an alias for this workflow.

Only the inspected package contents enter a generated workspace under
`output/math-batch-releases/release-*/`. Wrapper manifests use
`publishConfig.directory` to point at those contents. They give pnpm an explicit
core-first dependency order without adding dependencies to the published plugin
manifests. Publish lifecycle scripts are disabled because validation and builds
already ran. Git checks are disabled only for this generated workspace.

pnpm checks npm and skips package versions that already exist. It packs the
inspected contents again, so the final archive checksum can differ from the
preparation archive. The batch is not an atomic registry transaction. npm may
still request authentication for individual packages; one command does not
guarantee one authentication prompt.

For checks without publishing:

```sh
# Build and inspect all ten packages. No registry publication.
pnpm release:math:prepare
# Also exercise recursive publishing with npm's dry-run flag.
# This can read registry metadata; it does not upload packages.
pnpm release:math:dry-run
```

`release.json` records the candidate versions, artifact hashes and command status.
On success, `pnpm-publish-summary.json` lists newly published packages; versions
skipped by pnpm are absent. A dry-run summary is not evidence of publication.
If publishing fails, preserve the report and check each candidate version on npm.
pnpm 8 may not write its summary after a partial failure. Resolve any uncertain
results before running the batch again; never use `--force` to retry.

Before releasing UI changes, also run `pnpm --filter @barocss/math-demo test:e2e` and the demo build. Verify the intended package name/version and changelog. A version already published to npm must never be reused. The repository's release workflow is manual validation only; it does not publish on main pushes.

## Subsequent versions

1. Run `pnpm changeset`, select the affected math core and/or public plugins, and write a user-facing change summary.
2. Use patch for compatible fixes and minor for features. During 0.x development, clearly identify breaking API changes in a minor release. Reserve 1.0.0 for the agreed stable API.
3. Run `pnpm version:math:plan` to preview the core and nine plugin versions. Run `pnpm version:math` to apply that plan. Changesets runs in a temporary math-only workspace and copies back only affected math manifests/changelogs. Unrelated product changesets remain untouched. Review plugin peer-range changes before publishing.
4. Review and commit the version/changelog and any dependency/lockfile changes with the implementation. Run release validation, then publish locally.
5. Record package-specific Git tags on the release commit, and update the site with the matching package version. The batch command does not create commits or tags.

Versioning is separate from publishing. Repeating a publish command must not create
another version. Avoid `pnpm version-packages` and unfiltered `pnpm -r publish`
for a math-only release because they can include other products.

The [host release guide](../math-editor-integrations/docs/RELEASING.md) lists the
nine plugins and explains changes to shared implementation. For an explicit
core-only release, use `pnpm version:math:core`,
`pnpm release:math:core:prepare` and `pnpm release:math:core`.

## Website

`apps/math-demo` remains the site source. The static deployment repository is
`barocss/math-editor-site`, with GitHub Pages at `math-editor.barocss.com`.
Build the site directly from workspace source:

```sh
pnpm build:math:site
```

This builds the main site and the nine-plugin integration sample without a core
tarball, package `dist` build, npm login, registry lookup or publication check.
Workspace package exports resolve local source, including the private common
module. No package version bump is required to rebuild or deploy the site.
`release.json` records `source: "workspace-source"` and the local package versions
as metadata; those versions do not claim that the packages are published.

For an explicit package-artifact check, the previous command remains available:

```sh
pnpm release:math:site /path/to/barocss-math-editor.tgz
```

Both commands print the prepared static site directory and do not deploy it.
Website deployment and npm publication are independent operations.
