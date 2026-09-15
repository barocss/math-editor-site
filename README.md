# Math editor website

This site uses workspace source for the core and all nine host plugins. Core metadata version: 0.8.0. Versions describe the selected code; they do not assert npm publication.

Each plugin owns its source. The private common module is included in the site bundle and does not need a separate npm release. The default build does not build package dist folders, contact npm or require authentication. TinyMCE and CKEditor retain their existing deployed-site license guidance.

Site: https://math-editor.barocss.com

Build with pnpm build:math:site. For an explicit artifact check, pass a local core .tgz to pnpm release:math:site. release.json records the source mode and local package versions; artifact builds also record core integrity. This command prepares static output and does not publish packages or deploy the site.
