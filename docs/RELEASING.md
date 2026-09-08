# Releasing math editor

The source stays in this monorepo. Release only `@barocss/math-editor`; framework subpaths share its version. The initial release is **0.1.0**, public, on the **latest** npm tag.

## Local release

```sh
# Repository root. Login is handled by npm, never by storing credentials in the repository.
npm login
pnpm release:math:prepare
# After reviewing changes and browser validation:
pnpm release:math
```

Both commands check formatting, types and unit tests, clean/build the package, create a temporary tarball and verify all package entry points. The publish command sends only that verified tarball to the public npm registry. It never runs recursive publishing. `pnpm release` is an alias for this math-only workflow. npm may request account authentication or 2FA during publishing.

Before releasing UI changes, also run `pnpm --filter @barocss/math-demo test:e2e` and the demo build. Verify the intended package name/version and changelog. A version already published to npm must never be reused. The repository's release workflow is manual validation only; it does not publish on main pushes.

## Subsequent versions

1. Run `pnpm changeset`, select only `@barocss/math-editor`, and write a user-facing change summary.
2. Use patch for compatible fixes and minor for features. During 0.x development, clearly identify breaking API changes in a minor release. Reserve 1.0.0 for the agreed stable API.
3. Run `pnpm version:math`. It runs Changesets in a temporary math-only workspace and copies back only this package manifest/changelog, preventing dependent product version bumps. The consumed changeset summary is retained in CHANGELOG.md.
4. Review and commit the version/changelog and any dependency/lockfile changes with the implementation. Run release validation, then publish locally.
5. Record a package-specific Git tag such as `math-editor-v0.1.1` on the release commit, and update the site with the matching package version.

The first 0.1.0 changelog is seeded explicitly; do not add a version-bump changeset just to publish the initial version. Avoid `pnpm version-packages` for a math-only release because that command processes the entire workspace plan.

## Website

`apps/math-demo` remains the site source. The intended static deployment repository is `barocss/math-editor-site`, with GitHub Pages at `math-editor.barocss.com`. Website deployment is separate from npm publication; page-only changes do not require a package version bump. Keep the displayed version and built editor version in sync. Successful npm publication alone does not mean the site or DNS has been configured.
