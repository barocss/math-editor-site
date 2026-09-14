# Validation record

## Continuous editing milestone — workspace, 2026-09-13

The current local core candidate passed the shared continuous suite in all nine host demos (16 host/mode combinations, plus React standalone). The complete suite has 17 cases / 532 checkpoints. It verifies nested input, selection wrapping, radical conversion, matrix entry, multiple Undo/Redo sequences, copy/delete/paste history, Apply/Cancel, save/reload/restore, reopened editing and active-draft read-only transitions. Inline hosts also verify prose continuation and Enter completion.

[Host-chain evidence](../../output/playwright/editing-scenarios/2026-09-13T12-00-17-841Z/REPORT.md). The core validation record contains the other editing and geometry suites. This run uses workspace source; it does not replace the dated packed-consumer checks below or prove npm publication.

Editor.js has no configured host history and cannot save while read-only; saved data is compared after re-enabling. Read-only changes are triggered without pointer blur to isolate them from intentional Apply-on-blur behavior. TinyMCE uses its inline host configuration, CKEditor uses ClassicEditor, and Gutenberg uses the standalone provider. Other configurations, actual OS clipboard/IME and other browser engines remain outside this run.

Development preview. Latest recorded run: 2026-09-13. This record covers the
environments and workflows below, not a cross-browser or commercial compatibility
guarantee.

## Site consumption of packed plugins — 2026-09-09

Copied the integration app, shared site navigation and TypeScript configuration
into a temporary consumer outside the repository. Extracted the ten reviewed npm
archives from batch `release-QoRuhz`, verified their SHA-256 hashes, and used their
published exports without workspace aliases. Only third-party SDK dependencies
were linked from the local installation. The private integrations package was not
installed, and no math implementation TypeScript was present in the archives.

| Check | Result |
| --- | --- |
| Distribution boundary | No private common dependency or import in the ten public artifacts; common helpers and declarations are included within each plugin |
| `unified-check.js` on packed dependencies | All nine hosts passed input, Apply/Cancel, configured history, Save/Restore, read-only transitions and navigation; no page errors |
| `latex-paste-host-check.js` on packed dependencies | All 16 supported inline/block combinations passed |
| Production Vite build | Passed using only the extracted public math packages |
| `packed-static-site-check.js` | Seven enabled production hosts passed sequential typing, Cancel, Apply and reopening; no failed asset requests or page errors |
| Production licensing guidance | TinyMCE and CKEditor retain their existing static-site guidance; both passed editing in the local evaluation site |

The independent copy uses the same JSX configuration as the app. The temporary
development server allows the linked SDK font directory explicitly; neither
adjustment changes package code. The production check served the emitted static
assets through an ordinary HTTP server. These are locally prepared archives,
not a fresh registry installation or a deployed website. Versions and publication
state were not changed. Compact evidence is stored in
`output/math-plugin-site-checks/2026-09-09-packed-consumer/evidence.json`.

## Per-plugin source ownership — workspace, 2026-09-09

All nine public plugins now own their implementation, tests, styles and TypeScript
configuration. The private common package contains only data, draft-field UI,
messages and common styles. Tiptap depends on the public ProseMirror plugin.
The demo and WordPress entry points import the public packages.

The following checks passed for this refactor:

| Check | Result |
| --- | --- |
| Release and source-boundary tooling | 35 tests; verifies package ownership, dependency order, packed workspace ranges, source/published exports and isolated consumers |
| Core regression | 548 tests |
| Common and host regression | 59 tests across the private common package and nine public plugins |
| Type checks and package builds | All nine plugins, the common package and integration demo passed |
| Packed artifacts | All nine runtime/type consumer checks passed; 57 declaration files checked; no private common package imports remain in published output |
| `unified-check.js` | All nine hosts passed sequential typing, Apply/Cancel, configured history, Save/Restore, read-only transitions, navigation and locale checks; no page errors |
| `latex-paste-host-check.js` | All 16 supported inline/block combinations passed LaTeX insertion, continued editing and Cancel preservation |
| WordPress ZIP build | Passed using the public Gutenberg package; this does not repeat an installed WordPress test |
| Static site preparation | Passed with the core tarball and nine public plugin builds; the generated release manifest records each plugin version |
| Source-only development | All math entry points bundled with no workspace `dist` input. Both demo apps passed type checks and source builds; WordPress ZIP also built from source exports |
| Source imports in Chromium | Quill loaded plugin, common field and core source modules directly; sequential `123` typing and Cancel passed with no page errors |

Browser checks used local Chromium. TinyMCE checks wait for the deferred draft
opening before interacting with it. The final nine-host run passed after the
development server completed dependency prebundling. OS IMEs, Safari, Firefox and
screen readers were not re-certified. Workspace exports now point to source;
publishConfig overrides point to shipped runtime and declarations. Consumer
checks copy local generated dependencies with published manifests, so workspace
source cannot satisfy a missing artifact import. The source-ownership Changeset
proposes patch releases for the core and nine plugins; these checks did not apply
versions or publish.

## Scoped host themes — workspace, 2026-09-09

TinyMCE in-place and classic iframe regression checks pass with custom palette,
inline-background and primary-action foreground variables. Native/React theme
fixtures also cover scoped portals, shared toolbars, live theme switches,
per-instance isolation and cleanup. See the core [styling guide](../math-editor/STYLING.md)
for CSS ownership and iframe boundaries. User themes do not change stored formula
size or serialized data.


## Environment

- Tiptap core / StarterKit: 3.31.3
- ProseMirror state: 1.4.4; model: 1.25.11; view: 1.42.3
- Lexical: 0.50.0; Editor.js: 2.31.6; Quill: 2.0.3
- TinyMCE: 8.9.0; CKEditor 5: 48.5.0
- Slate: 0.126.2; slate-react: 0.126.4; slate-history: 0.113.1
- Gutenberg blocks: 15.27.0; block-editor: 17.0.0; data: 10.54.0
- Barocss Math Editor: local 0.2.1 workspace build
- KaTeX preview: 0.16.28, `trust: false`
- Browser: local Playwright Chromium on macOS

## TinyMCE in-place drafts and selection collapse — 2026-09-09 workspace

Core regression: **503 tests**; shared integrations: **52 tests**. The TinyMCE
adapter now honors the default inline editing mode in both inline and classic
iframe hosts. The existing external panel tests explicitly select `editing: "panel"`.

The following checks passed against the final workspace build in local Chromium:

| Check | Evidence |
| --- | --- |
| `tinymce-inline-check.js` | Both host modes: click and real character typing, symbol suggestions, draft event/drag containment, unchanged normal and raw HTML during editing, no draft-only Undo entry, Cancel, Ctrl/Cmd+Enter Apply, one Undo/Redo, outside-click commit with focus retained, iframe outer toolbar, inline/block insertion replacing selected prose, Cancel restoring that selection, HTML reload/re-edit, read-only transitions, stale content replacement, empty/root-boundary insertion cleanup, pending-open cancellation and destruction |
| Model selection inside TinyMCE | In both host modes, Shift+arrows selects multiple characters; plain Left/Right/Up/Down restores the ordered edge and subsequent real typing inserts there without replacing the former range or changing host content before Apply |
| `tinymce-check.js`, `tinymce-iframe-check.js` | Previous explicit external-panel workflow continues to pass, including size changes, authoritative model reload and single-step host history |
| `selection-collapse-check.js` | Rich React partial and structural ranges collapse with Left/Right to the ordered edges; real typing resumes; Alt+arrows also navigates wrapping suggestions while retaining the range |
| `matrix-range-host-check.js` | All nine hosts passed matrix selection, clipboard, clearing, draft Undo, transpose, Apply/reopen, Cancel and configured host history |
| `native-parity-check.js`, `iframe-field-check.js` | Native toolbar/selection behavior and shared iframe field regressions passed |
| `suggestion-menu-check.js` | All nine host samples match the main React menu's typography, colors and 336 × 340 px desktop panel. Pointer highlighting, independent wheel scrolling, keyboard visibility and clicking a scrolled matrix candidate passed |
| `suggestion-arrow-check.js`, `suggestion-menu-check.js` | Eight framework examples passed discrete Down/Up presses with a stationary pointer, Enter application and scrollbar track clicks. All nine host samples retain each keyboard choice after redraw; pointer highlighting also preserves the Quill input caret |
| `quill-composition-check.js` | Quill inline/block: Chromium input-protocol composition preserves Latin/Korean preedit text and caret, commit/cancel and subsequent typing. Draft Delta and Cancel remain unchanged; host editing/Undo and read-only recovery pass. This does not claim OS IME coverage |
| `host-composition-check.js` | All nine local host demos passed the same Chromium input-protocol sequence: first character, Latin/Korean preedit and commit, cancelled composition and continued typing, without per-key refocusing. All 16 supported host/placement combinations passed (Editor.js and Gutenberg are block-only). No matching caret-loss failure was observed in the other eight hosts; Quill passed with its adapter fix. TinyMCE block coverage uses a newly inserted draft. OS IMEs and other browsers are not covered |
| `matrix-size-shortcut-check.js` | Rich React, native JavaScript and Quill passed 18 character-by-character cases: `2x2`, `3×3`, `4X4`, `2x1`, `1×2` and `3x7`. Checks covered matching candidates (identity only for square sizes), rendered column counts, first-cell editing and Tab navigation. Rich output rendered in KaTeX, including all 21 cells of a 3×7 matrix; Escape preserved the unaccepted shortcut |
| `suggestion-menu-clipping-check.js` | Ordinary overflow no longer reduces menu height. Transformed, translated, paint-contained and `will-change` containers, nested scrolling regions and a short dialog preserve visible, clickable options; paragraph alignment and letter spacing do not enter the menu |

These checks reported no page errors. The TinyMCE fixture supplies editor/adapter
styles inside the iframe; production consumers must do the same through
`content_css`. Normal serialization uses the adapter's `PreProcess` hook before
AST filtering; bypassing it with `no_events: true` is not supported while a draft
is active. OS IME, Safari/Firefox, touch and accessibility remain separate checks.
The nine-host run uses standalone Gutenberg; it does not repeat installed WordPress
validation for this change. No version or publication was performed by these checks.

## Matrix cell editing — 2026-09-09 workspace

The common field now exposes cell rectangles, shape-checked clipboard operations
and full-matrix transpose. The new core APIs do not change any host's stored math
attributes. Core regression: 498 tests; integration regression: 52 tests. Both
packages and both demo applications passed type checks.

`matrix-range-host-check.js` passed in local Chromium with zero page errors for
Tiptap, ProseMirror, Lexical, Editor.js, TinyMCE, CKEditor, Quill, Slate and standalone
Gutenberg. Each host created a 2 × 2 matrix through suggestions, filled its cells,
selected/copied and cleared cell contents, restored them through draft Undo, transposed
the matrix and applied it. Reopening retained the transposed order. Pasting a copied
rectangle followed by Cancel preserved the saved document. One host Undo restored
the initial formula where host history was configured; Editor.js has no native
document history.

`matrix-range-check.js` also passed against native and rich React surfaces with
nested fractions and a non-square matrix. It verifies actual drag/Shift+click,
keyboard expansion, exact cell payloads, rejected size mismatches, anchored TSV
growth, transpose with a nested caret and resumed editing. Its clipboard events
use DataTransfer, not a system clipboard transfer between applications.

An initial combined run reported a Slate document comparison mismatch. The
unchanged isolated Slate workflow passed; the final all-nine run passed after
the test waited for the initial host render before capturing its baseline. No
Slate adapter fix or established runtime defect is claimed for that first result.

These are workspace changes awaiting release. Installed WordPress, OS IME,
Safari/Firefox, touch and screen readers were not re-certified by this run.
See the core [matrix API contract](../math-editor/API-SESSION.md#matrix-cell-selections)
for paste dimensions, matrix size limits and transient selection metadata.

## Native tools and selection — 2026-09-09 workspace

These checks use the rebuilt local core and integration modules, without browser
response overrides. The changes await release; package versions were not changed
and no npm packages were published during this work.

| Area | Evidence |
| --- | --- |
| Unit suites and types | 481 core tests, 52 integration tests, and both package type checks passed |
| Demo builds | Both sample applications' type checks and production builds passed; the main site regenerated the integration guides and new native API documentation |
| All nine host adapters (`native-tools-host-check.js`) | Selected `bc` in `abcd`, expanded tools, searched for a down arrow, closed/reopened the picker, replaced the selection with `↓`, resumed typing, applied, and cancelled a template edit without changing stored data; zero page errors |
| Host history | The same workflow restores the original formula with one host Undo where the sample provides history; Editor.js has no built-in document history |
| Shared toolbar (`shared-symbol-tools-check.js`) | Tiptap and ProseMirror retain selected text and the active draft while search/results take focus; symbol insertion, resumed typing, Apply, one Undo and disabled idle controls passed |
| Existing input regressions | `shared-boundary-check.js` passed host entry/exit, toolbar ownership, composition guards and read-only cleanup; `quill-typing-check.js` passed inline/block typing, middle insertion, selected replacement and matrix cells |
| Native field (`native-parity-check.js`) | Exact partial highlights, ordinary native text selection, active-input drag across a fraction in both directions, Shift-drag anchors, shrinking selection, replacement/Undo, symbol search, matrix presets/controls, templates, restricted/hidden toolbars and teardown passed |
| Selection Escape | First Escape closes wrapping suggestions while retaining the range; a changed range can reopen suggestions; second Escape reaches host Cancel |
| Same-origin iframe (`iframe-field-check.js`) | Search and symbol insertion remain in the child document; typing, selection replacement, matrix controls, Apply/Cancel, menu scrolling, cross-structure drag and teardown passed with zero page errors |
| Compact action placement | Five unit cases check menu placement around reserved controls; the all-host browser workflow opens More tools directly while wrapping suggestions are visible |
| Korean symbol discovery | Actual Quill picker search for `화살표` returned all 31 arrow entries with Korean names; screenshot `output/playwright/native-tools-quill-ko.png` |

The browser checks exposed three defects and passed after their fixes. Suggestions
could cover compact actions, so the native editor now accepts `menuAvoidElements`
and adapters reserve their action bar. Shared-toolbar focus transfer could
temporarily leave `activeElement` on the document body and commit a draft; the
coordinator now respects the explicit focus destination. Quill could lose a native
selection after expanding tools because selection-only renders were not reported
to the host. The native `onRender` callback now reports the final DOM/caret state,
allowing the existing Quill observer recovery to retain the correct range.

Browser tests target the active math input with `input.me-input`: an unqualified
combobox locator also matches the new matrix/template select controls. Clipboard
payload checks use synthetic ClipboardEvent/DataTransfer, and composition checks
use synthetic events. They do not certify OS clipboard or real input methods.
The visual reference is `output/playwright/native-parity-editor-katex.png`.
Safari/Firefox, touch, assistive technology and arbitrary constrained host layouts
remain separate validation work. Installed WordPress was not rerun for this change;
the Gutenberg result above uses the local standalone BlockEditorProvider sample.

## Historical checks — 2026-09-08

| Area | Evidence |
| --- | --- |
| Model persistence | 7 unit tests: nested structures, JSON round trip, invalid model, multiline policy, LaTeX-only import, insertion, Undo/Redo isolation |
| Core regression | 390 math-editor unit tests passed after guarding empty-slot hit testing |
| Sequential keyboard input | Both hosts: letter-by-letter typing, block row creation and commit |
| Build | Integration TypeScript build and demo type-check/build |
| Panel editing, both hosts | Real input and suggestions; Apply/Cancel; host Undo/Redo; JSON and HTML save/reload; readonly; Ctrl+Enter without accidental row insertion |
| Direct editing, both hosts | Compact formula height; toolbar hidden; suggestion click keeps draft open; outside click applies; one host Undo; expand keeps draft; Escape cancels |
| Host keyboard and clipboard, both hosts | Enter opens selected formula; Backspace deletes atom; Undo restores; system Cmd+C / Cmd+V preserves full math attributes |
| Conflict and unsupported data | External update closes stale draft with notice; unsupported LaTeX remains visible and does not open an empty editor |
| Language / visual inspection | Korean compact editing controls and English workflow; screenshots of editor and KaTeX preview |

The direct-editing checks caught a real integration issue: native input replacement
emits blur without a destination. Treating that as a host exit committed the draft
before Cancel. The integration now ignores transient/internal blur and checks the
actual destination. The same workflows passed after the fix. The final run of all four browser workflows captured page errors and completed with none. Empty native caret slots also received a DOM Range guard after an exception was found in the browser log; the core patch has a pending Changeset.

## Core and ProseMirror checks — 2026-09-09

The following checks passed in local Chromium on macOS. The historical results
above remain a record of the earlier implementation; current boundary deletion
behavior is covered by the newer checks below.

| Area | Evidence |
| --- | --- |
| Core regression | 461 math-editor unit tests passed |
| Integration regression | 22 integration unit tests passed, including pure host selection and math-boundary analysis |
| Build and types | Core, integration, and demo builds and type-checks passed |
| Vertical movement (`vertical-check.js`) | Fraction geometry, paired scripts, indexed-root navigation, inner fraction before matrix, same-column movement, and native selection checks passed |
| React vertical movement (`react-vertical-check.js`) | Actual 5184 demo: unequal-width fractions, lexical token boundary affinity, and paired scripts passed |
| Vertical movement during composition (`vertical-check.js`) | Synthetic IME guard passed |
| Host boundary entry and exit (`shared-boundary-check.js`) | Both Tiptap and ProseMirror: ArrowLeft/ArrowRight and Backspace/Delete entered adjacent inline formulas at the expected caret edge; exiting at the formula boundary returned to the host |
| Shared toolbar (`shared-boundary-check.js`) | Active-formula targeting, target switching, previous-draft Apply, and Undo passed |
| Read-only cleanup (`shared-boundary-check.js`) | Read-only mode cleaned up the active draft and shared toolbar state |
| Composition coordination (`shared-boundary-check.js`) | Synthetic composition disabled toolbar editing actions and blocked draft switching |
| Keyboard focus exit (`shared-boundary-check.js`) | Shift+Tab from the shared toolbar to an outside control committed the compact draft |

Synthetic composition events check application guards; they do not validate an
OS input method or replace the pending native IME checks.

### Historical limitation from this run

Suggestions overlapped compact draft actions at some viewport positions. Those
checks dismissed suggestions before clicking Apply, so their passing result did
not establish a placement fix. The later native-controls work below reserves the
action bar and tests opening More tools without dismissing the selection menu.

## Additional host adapters — 2026-09-09

These are local development checks, using real host SDKs and the native math field.
Editor.js is a block tool; TinyMCE uses an external explicit-Apply panel. Host
placement and the location of the draft editor are different capabilities.

| Area | Evidence |
| --- | --- |
| Integration unit regression | 42 tests passed: 14 boundary, 8 common model, 6 Lexical, 6 CKEditor, 5 Quill, 3 Editor.js |
| Build and types | Integration TypeScript build/type-check and both demo entry points' type-check/production build passed |
| Package contents | `npm pack --dry-run --ignore-scripts` includes all adapter entry points, declarations, styles and guides; no host SDK files or original TypeScript implementation files |
| Lexical / Editor.js / CKEditor / Quill (`plugins-check.js`) | Actual matrix suggestion, cell input, Cancel without host mutation, Apply, exact model save/reload, matrix re-editing, and read-only transition passed |
| Host history (`plugins-check.js`) | One Undo/Redo restores a complete formula edit in Lexical, CKEditor, and Quill with their host history configured; Editor.js does not provide core document history |
| Localized controls and real typing (`plugins-locale-check.js`) | All five new adapters passed sequential keyboard input, Korean matrix suggestions and Cancel; zero page errors |
| Quill caret regression (`quill-typing-check.js`) | Inline/block continuous typing, middle insertion, Shift-arrow replacement, matrix cell navigation and Cancel preserve the host Delta |
| Editor.js data preservation | Saving `a<b>c` retains comparison characters instead of passing math data through HTML sanitization |
| CKEditor (`ckeditor-check.js`) | LaTeX-only import and Apply, inline/block drafts, Undo/Redo, HTML reload, switching drafts, outside Apply, synthetic composition guard, readonly, toolbar insertion, unsupported model preservation, removal and destruction passed with zero page errors |
| Quill additional browser checks | Block Cancel preserves Delta; semantic HTML while editing excludes draft controls; semantic HTML import preserves inline/block attributes |
| TinyMCE inline host (`tinymce-check.js`) | Draft placed immediately beside the editable element; inline/block edits, Cancel, one-step Undo/Redo, size Undo, HTML save/reload, authoritative-model preview/editing, no live UI in serialization, read-only cleanup, external setContent invalidation and destruction passed |
| TinyMCE classic iframe (`tinymce-iframe-check.js`) | Formula click focuses the outer-document input; sequential typing stays in the draft; Cancel, Apply/Undo/Redo, clean HTML reload and teardown passed |

The CKEditor checks found that the model treats `null` as attribute absence. Storing
`mathDocument: null` as a model attribute caused Apply to fail for LaTeX-only imports.
The converter now omits that attribute on creation and removes it for a null update;
regression tests exercise both directions. Editor.js's sanitizer also needed an
explicit pass-through rule for math strings and model data. Rendering still uses
textContent or the host's trusted rendering callback; data preservation does not
turn formula text into HTML.

TinyMCE previews now derive their expression from the authoritative model, including
when the stored LaTeX fallback differs. A custom renderer receives an empty preview
container. Clicking a formula also refocuses the math field after TinyMCE finishes
its selection handling, so the next keystroke reaches the draft rather than the host.

Quill initially restored a host document Range over the focused math input after
DOM reconciliation. This prevented real keystrokes even though programmatic input
filling worked. The adapter now captures the native math caret after rendering and
restores it after observer delivery, using DOM selection APIs without overriding
Quill internals. Sequential typing and selected replacement are covered explicitly.

The first mixed-host run reported a Quill Cancel mismatch, but the same unchanged
workflow passed on a fresh session, as did four isolated Cancel repetitions and
block Cancel. HMR timing was suspected but not established; no unverified fix is
claimed for that first result.

The new adapters share EN/KO math control messages and accept custom overrides.
The host editors' own built-in menus and language packs are configured separately.
These checks do not certify OS IME, browser clipboard integration, screen readers,
collaboration, or keyboard-boundary parity for every new host.

## Slate, Gutenberg and iframe embedding — 2026-09-09

| Area | Evidence |
| --- | --- |
| Unit suites | 461 core tests and 52 integration tests passed; integration total includes 6 Slate model/history tests and 4 Gutenberg codec tests |
| Build and types | Core/integration builds, integration/demo type-checks, demo production build and WordPress ZIP build passed |
| Slate (`slate-check.js`) | EN/KO inline/block typing, middle insertion, matrix cell navigation, Cancel, Apply, exact JSON reload/re-edit, one Undo/Redo, readonly and rapid consecutive inline/block insertion passed with zero page errors |
| Gutenberg standalone (`gutenberg-check.js`) | Real BlockEditorProvider/BlockList; authoritative model preview/edit, encoded Unicode data, canonical parse/serialize, Cancel, repeated and consecutive Apply/Undo/Redo, readonly, unsupported model/envelope preservation, insertion and destroy passed with zero page errors |
| Gutenberg Korean demo | Korean edit/apply/cancel controls, `행렬` matrix and identity suggestions, matrix Cancel, exact Save/Restore and readonly toggling passed with zero page errors; screenshot `output/playwright/gutenberg-ko.png` |
| Same-origin iframe (`iframe-field-check.js`) | Sequential typing, replacement, matrix cells, composition guards, Apply/Cancel, child/parent outside pointer and keyboard focus, toolbar, menu document ownership, scroll positioning, mouse range selection and teardown passed |
| Installed WordPress (`wordpress-check.js`) | WordPress 7.1 / PHP 8.3, through Playground CLI 3.1.53; real iframe canvas typing/matrix suggestions, Cancel, consecutive Apply/Undo/Redo, author-role save, full page reload, valid block re-editing and frontend KaTeX rendering passed |
| WordPress data preservation | A restricted author without `unfiltered_html` saved a valid editable model containing `<widget>`, Korean, an escaped ampersand, quotes and emoji. Encoded data remained byte-for-byte equal after the server save and reload; no invalid-block recovery was needed |
| WordPress assets | No plugin asset HTTP errors or JavaScript page errors in the passing workflow. ZIP contains local fonts, scripts, styles, PHP/metadata and notices, without a bundled WordPress or React SDK |
| Existing host regression | `inline-check.js` and `host-check.js` passed again for Tiptap and ProseMirror after the shared iframe changes, including real macOS clipboard model preservation |

Slate focus restoration needed to wait for pending Slate operations and avoid
stealing focus from a newly inserted formula. Gutenberg's continuous
`setAttributes` changes initially merged multiple Apply actions into one undo
step. The adapter now dispatches one public `updateBlock` action per Apply while
preserving other attributes and the block identity. The consecutive-Apply browser
checks cover this behavior in both the standalone host and actual WordPress.

Iframe testing found that DOM constructors, node creation, selection ranges and
default menu placement were using the outer document. Native UI now uses the
embedding document; the shared field also listens to accessible same-origin
ancestor documents for outside pointer/focus changes and removes those listeners
on destroy. This does not claim support for reaching across cross-origin frames.

The WordPress check mounted and activated the same generated plugin directory
that is archived in the ZIP. It did not exercise the dashboard upload wizard,
WordPress.org distribution, other WordPress/PHP versions, or production hosting.
The manifest's WordPress 6.6 / PHP 7.4 loader minimum is not a tested compatibility
range. The local author account triggered a WordPress settings-endpoint 403, and
the host emitted preload/theme-style notices; these were not plugin asset or
JavaScript execution failures. A test fixture initially omitted LaTeX's required
escape before `&`; the corrected `\&` fixture passed.

Editor and frontend screenshots are saved as
`output/playwright/wordpress-editor.png` and `wordpress-frontend.png`. The demo
production build retains a large-chunk warning from the host SDK bundles. The
WordPress plugin build externalizes its host SDKs and does not use that demo bundle.

## Unified samples and npm preparation — 2026-09-09

The canonical sample is now `/?editor=<host>&lang=<locale>`. All nine hosts share
one navigation and sample shell; only the selected host is mounted. Old
`plugins.html` links preserve their host, language and mode when redirected.

| Area | Evidence |
| --- | --- |
| Unified browser flow (`unified-check.js`) | All nine hosts passed real draft typing, Cancel, keyboard Apply, UI Save/Restore, read-only blocking and reopening; zero page errors |
| Host history | One Undo/Redo passed in every host that supplies document history; Editor.js has no built-in document history |
| Navigation | All nine host links, explicit/default legacy redirects, locale/mode preservation and development links to the main documentation site passed |
| Existing ProseMirror workflows | Panel, inline, host keyboard/clipboard, shared-boundary and vertical-navigation checks passed for both Tiptap and ProseMirror |
| TinyMCE regression | Inline and iframe checks passed with Ctrl+Enter; inline also covers Meta+Enter. A keyboard-applied edit is restored with one host Undo |
| Source regression | Final package preparation passed 461 core tests, 52 integration tests and core/integration type checks and builds |
| Site and samples | Both sample apps passed type checks and production builds. The site renders 38 documentation pages, including all nine host guides and the release guide |
| Static navigation | Staged documentation → Korean Gutenberg sample → documentation and mobile document navigation passed |
| Static host SDKs | Production sample assets exclude TinyMCE/CKEditor runtime and CSS chunks. Those two pages show localized setup guidance; all nine hosts run in the local development sample |
| Release tooling | 20 tests passed across scoped Changesets versioning, tarball validation, consumer validation and publication gates, including preservation of prior publish results on retry |
| Packed artifacts | All nine preview tarballs passed source-map/source-file exclusion, export existence, external peer and private-import checks |
| Isolated consumer | Extracted tarballs passed 51 own declaration checks, 19 typed entry points, nine CSS exports and 17 Node imports; Gutenberg's data codec also passed |

TinyMCE's preview refresh now runs inside the same undo transaction as the model
update. Previously the later preview DOM change could create another undo step
after keyboard Apply. The Lexical sample also establishes its initial history
baseline before the first edit. These are separate host-history corrections.

Artifact consumer checks use the installed host SDKs and the local public core
build as external peers, without linking the private integration package. The
core manifest is still `0.2.1` in this workspace; the reviewed version preview is
`0.3.0` for core and `0.1.0` for each new plugin. The test does not establish that
the required `^0.3.0` core is already available from npm. CKEditor and Gutenberg
main modules need a browser; their Node checks cover the shared/data entries and
static dependency graph, with host interaction verified separately above.

Preparation produced local `0.0.0` preview tarballs and a release report under
`output/math-plugin-releases/`. No real versions were applied, no packages were
published, and no public site was deployed in this run. The current workspace now
includes MIT LICENSE files and metadata for all nine plugins and the shared source
package. The earlier tarballs predate that update and must be regenerated. Private
flags and version preparation remain publication prerequisites. See
[Publishing the host plugins](docs/RELEASING.md) for the release order.

## Re-run

Run the sample at port 5185 after building the public plugins. Unit tests:

```sh
pnpm build:math:plugins
pnpm -r --filter '@barocss/math-editor-*' test
pnpm --dir packages/math-editor test
```

Browser checks are Playwright CLI `run-code` functions, not Playwright Test specs.
With Node 20+ and `@playwright/cli` available, from the repository root:

```sh
mkdir -p output/playwright
npx @playwright/cli -s=math-integrations open 'http://localhost:5185/?lang=en' --headed
npx @playwright/cli -s=math-integrations run-code "$(cat apps/math-integrations/tests/browser-check.js)"
npx @playwright/cli -s=math-integrations run-code "$(cat apps/math-integrations/tests/inline-check.js)"
npx @playwright/cli -s=math-integrations run-code "$(cat apps/math-integrations/tests/host-check.js)"
npx @playwright/cli -s=math-integrations run-code "$(cat apps/math-integrations/tests/typing-check.js)"
```

Re-run the newer checks in the same browser session (the React check also needs the main demo on port 5184):

```sh
check_source=$(mktemp -t math-integrations-check)
for check_name in unified-check vertical-check react-vertical-check shared-boundary-check plugins-check plugins-locale-check quill-typing-check ckeditor-check tinymce-check tinymce-iframe-check slate-check gutenberg-check iframe-field-check; do
  node -e 'const fs = require("node:fs"); process.stdout.write(fs.readFileSync(process.argv[1], "utf8").trimEnd().replace(/;$/, ""));' \
    "apps/math-integrations/tests/$check_name.js" > "$check_source"
  npx @playwright/cli -s=math-integrations run-code "$(cat "$check_source")"
done
rm "$check_source"
```

The CLI used for this run rejects a trailing semicolon after the supplied function
expression. The temporary source above removes only that final semicolon and
leaves the checked-in scripts unchanged. When supplying a function manually, omit
its trailing semicolon. Use the same normalization for an earlier check if its
source triggers this CLI issue.

For `wordpress-check.js`, first build the [WordPress preview ZIP](../../apps/math-integrations/wordpress/README.md)
and activate it in a disposable WordPress site at `http://127.0.0.1:9400`.
Open a separate Playwright CLI session and log in as an author without
`unfiltered_html`; then run that file with the same trailing-semicolon normalization.
The script publishes a fixture only on that loopback test site. It checks real
server persistence, unlike the standalone Gutenberg browser test. Existing
drafts in that disposable session may be discarded during navigation.

The clipboard check uses macOS Command shortcuts. Change them for another OS.
Inspect CLI errors/results; a script printing its source is not by itself an assertion.
The checks throw on failed invariants. Visual artifacts are under `output/playwright/`.

## Still required before customer certification

- Safari/Firefox, mobile and touch; OS-level IME composition (not exercised here).
- Screen reader behavior and a complete keyboard-only accessibility review.
- Complex surrounding documents: tables, lists, nested custom nodes, drag/drop.
- Real collaborative editing sessions and network conflict recovery.
- Additional host versions, external sanitizer recipes, Markdown conversion hooks.
- Suggestion-menu and compact-action placement at different viewport positions.
- Deployment, product licensing, billing and support arrangements.

The operand/size browser check covers both Tiptap and ProseMirror: `4ab` to
`4\left|ab\right|`, suggestion scroll position after entering `4`, cancelling
native dragstart during editing, and committing/undoing a size change. Core
regressions additionally check all 30 wrapping structures, their destination
slots, adjacent text preservation, and Undo.

## Shared editing utilities — workspace, 2026-09-09

The core now supplies token-level active inputs, explicit LaTeX paste, recent/favorite symbol/template preferences and contextual presentation settings. Both the ProseMirror NodeView and the shared field reserve utility-form Ctrl/Cmd+Enter before host Apply handling.

`latex-paste-host-check.js` passed all **16** supported host/placement combinations across Tiptap, ProseMirror, Lexical, Editor.js, TinyMCE, CKEditor, Quill, Slate and standalone Gutenberg. Insertion keeps the draft open and the host data unchanged; typing continues after the fragment and Cancel preserves the original. `host-composition-check.js` also passed all 16 combinations. The Quill focused typing/composition fixtures and native selection regression pass. Core: 548 unit tests; integrations: 52. Both demo builds and all four type checks pass.

See the [core utility API](../math-editor/API-SESSION.md#editing-utilities--workspace). These results use local Chromium, not OS IME or broad browser certification. Updated source and pending Changesets require new release artifacts before publication.

## Selection suggestion navigation — workspace, 2026-09-09

`selection-suggestions-check.js` passed in Chromium for rich React and all nine
host adapters. Shift+arrow selection and native mouse-drag selection retain
content while Up/Down navigates the wrapping menu. Enter wraps the selected
content and restores input focus. Alt+Down remains an alias. No page errors
were reported. These are local-source checks, not a publication claim.


## EDIT-019 Tiptap and ProseMirror — workspace, 2026-09-10

- Run: `2026-09-09T22-39-51-097Z`, stable source fingerprint.
- [Report](../../output/playwright/editing-scenarios/2026-09-09T22-39-51-097Z/REPORT.md) and
  [checkpoints and hashes](../../output/playwright/editing-scenarios/2026-09-09T22-39-51-097Z/report.json).
- **7 targets PASS / 205 checkpoints:** React block (28), Quill block/inline
  (29/30), Tiptap block/inline (29/30), ProseMirror block/inline (29/30).
- Chromium 152 on macOS, English UI, workspace source. The extended runner hashes
  both newly covered plugin sources and package metadata.
- Each target passes the existing continuous formula chain. Integrated hosts
  additionally check Apply/host Undo/Redo, Save/reload/Restore, re-edit/Cancel,
  retained formula data and unchanged prose/container structure. Inline targets
  check Enter commit, right-boundary exit, exact prose position and host Undo.
- Initial integrated run `2026-09-09T22-36-38-459Z`: six PASS, Tiptap inline FAIL.
  A quick prose edit after Restore shared the restored document's history event;
  Undo removed both. The sample now brackets `setContent` with `closeHistory`
  transactions, keeping the replacement and subsequent typing separate.
- Corrected run `2026-09-09T22-38-26-544Z`: seven PASS. The final run above repeats
  all seven targets with the final runner documentation and source hashes.
- Integration-demo TypeScript and production build pass. Existing large-chunk
  build warnings remain. Test source formatting passes. Core/plugin runtime
  code was unchanged; the fix belongs to the Tiptap demo's restoration callback.
- Remaining: Lexical, Editor.js, TinyMCE, CKEditor, Slate and Gutenberg; native OS
  IME/clipboard, other browser engines, touch, accessibility and performance.


## EDIT-019 Lexical — workspace, 2026-09-10

- Run: `2026-09-09T23-08-15-353Z`, stable source fingerprint.
- [Report](../../output/playwright/editing-scenarios/2026-09-09T23-08-15-353Z/REPORT.md) and
  [checkpoints and hashes](../../output/playwright/editing-scenarios/2026-09-09T23-08-15-353Z/report.json).
- **9 targets PASS / 264 checkpoints:** React block (28), Quill block/inline
  (29/30), Tiptap block/inline (29/30), ProseMirror block/inline (29/30),
  Lexical block/inline (29/30).
- Chromium 152 on macOS, English UI, workspace source. Fingerprints now include
  the Lexical plugin source and package metadata.
- Lexical passes the full nested editing and two history chains, Apply as one
  host Undo event, Redo, Save/reload/Restore, re-edit and Cancel. Inline also
  passes Enter commit without a new paragraph, right-boundary exit, focus return,
  typing immediately after the formula and host Undo.
- Host checks read Lexical serialized state and retain container boundaries and
  formula atoms. Drafts must not change saved host state. Restoration must match
  the complete saved JSON; math rendering alone is not the persistence check.
- The initial run `2026-09-09T23-06-35-494Z` reached Save/Restore in both Lexical
  modes but used an incorrect locator for reopening. Lexical uses a mounted
  `.bme-lexical-node` widget; `data-barocss-math` belongs to its HTML export.
  The fixture now locates its live widget. No product code change was needed.
- Runner formatting passes. This change only extends tests and documentation;
  no new build, package publication or rendering audit was required.
- Next: Editor.js, TinyMCE, CKEditor, Slate and Gutenberg. Native OS IME/clipboard,
  other browser engines, touch, accessibility and performance remain outside this run.


## EDIT-019 Editor.js — workspace, 2026-09-10

- Run: `2026-09-09T23-25-26-845Z`, stable source fingerprint.
- [Report](../../output/playwright/editing-scenarios/2026-09-09T23-25-26-845Z/REPORT.md) and
  [checkpoints and hashes](../../output/playwright/editing-scenarios/2026-09-09T23-25-26-845Z/report.json).
- **10 targets PASS / 293 checkpoints:** React block (28), Quill/Tiptap/
  ProseMirror/Lexical block and inline (29/30 each), Editor.js block (29).
- Chromium 152 on macOS, English UI, workspace source. Fingerprints include
  Editor.js plugin source and package metadata.
- Editor.js passes nested fraction/root/matrix editing, suggestion selection,
  two uninterrupted formula Undo/Redo chains, empty-root deletion/restoration,
  Apply, Save/reload/Restore, re-edit and Cancel. Draft checks confirm saved host
  data stays unchanged until Apply; prose blocks and block order remain intact.
- Async `save()` comparisons exclude only the generated `time` field. Block IDs,
  saved model data, paragraph data and version remain in persistence assertions.
- **Editor.js host Undo/Redo is not covered:** the demo has no document history
  integration. The runner records this limitation in `hostHistory`; it retains
  the mandatory host Undo/Redo assertions for other configured hosts. Editor.js
  inline mode is outside the block tool's contract.
- Test-source formatting passes. Only the runner, fixture and documentation
  changed; no runtime fix, build, publication or new rendering audit was needed.
- Next: TinyMCE, CKEditor, Slate and Gutenberg. Native OS IME/clipboard, other
  browser engines, touch, accessibility and performance remain separate work.


## EDIT-019 TinyMCE — workspace, 2026-09-10

- Run: `2026-09-09T23-39-57-339Z`, stable source fingerprint.
- [Report](../../output/playwright/editing-scenarios/2026-09-09T23-39-57-339Z/REPORT.md) and
  [checkpoints and hashes](../../output/playwright/editing-scenarios/2026-09-09T23-39-57-339Z/report.json).
- **12 targets PASS / 352 checkpoints:** React block (28), Quill/Tiptap/
  ProseMirror/Lexical/TinyMCE block and inline (29/30 each), Editor.js block (29).
- Chromium 152 on macOS, English UI, workspace source. TinyMCE 8.9.0 uses
  `inline: true` for its host. Both math modes are covered; classic iframe mode
  is not covered by this run. Fingerprints include TinyMCE source and metadata.
- TinyMCE passes the sustained fraction/root/matrix chain, formula history,
  draft isolation, one host Undo/Redo for Apply, Save/reload/Restore, re-edit and
  Cancel. Inline also passes Enter commit, right-boundary exit, focus return,
  typing immediately after the formula and host Undo.
- The fixture applies and reopens an empty atom before the chain because TinyMCE
  inserts on Apply. This exposed a real bug: the empty preview renderer returned
  no visible content, leaving no click target. The adapter now shows the existing
  localized empty-formula message and skips the renderer for empty LaTeX.
  Serialized content stays empty; the test checks the label does not leak into HTML.
- HTML comparisons retain the complete serialized document. A detached parser
  reads prose and element boundaries for caret checks. Live locators exclude
  TinyMCE's `.mce-offscreen-selection` clone inside the editable body.
- Diagnostic run `2026-09-09T23-38-20-112Z` confirmed that a reported prose Undo
  failure was in the fixture: saved and actual HTML were identical, but building
  the expected prose result had mutated the saved units array. The fixture now
  copies that array. No timing wait or product history change is used to pass it.
- TinyMCE package TypeScript, two unit tests, build and changed-source formatting
  pass. Package-local build also exposed a metafile path check using the wrong
  working directory. The build now sets esbuild's working directory to the repo
  root; the normal package build command succeeds with its dependency checks intact.
- Patch changeset: `.changeset/tiny-math-empty-preview.md`. No package was published.
- Remaining: CKEditor, Slate, Gutenberg, TinyMCE iframe mode, native OS
  IME/clipboard and other browser/input environments. Editor.js document history
  remains unverified because its demo has no host history integration.


## EDIT-019 CKEditor — workspace, 2026-09-10

- Run: `2026-09-09T23-44-59-263Z`, stable source fingerprint.
- [Report](../../output/playwright/editing-scenarios/2026-09-09T23-44-59-263Z/REPORT.md) and
  [checkpoints and hashes](../../output/playwright/editing-scenarios/2026-09-09T23-44-59-263Z/report.json).
- **14 targets PASS / 411 checkpoints:** React block (28), Quill/Tiptap/
  ProseMirror/Lexical/TinyMCE/CKEditor block and inline (29/30 each),
  Editor.js block (29).
- Chromium 152 on macOS, English UI, workspace source. CKEditor 48.5.0 uses the
  local ClassicEditor demo. Fingerprints include CKEditor plugin source and
  package metadata. This run does not cover other CKEditor builds or collaboration.
- CKEditor passes the sustained fraction/root/matrix chain, keyboard suggestion
  selection, two formula Undo/Redo chains, empty-root deletion/restoration,
  unchanged host data during drafts, Apply as one host Undo event and host Redo.
- Save/reload/Restore retains the complete serialized HTML and editable math
  structure. Re-edit and Cancel leave that HTML unchanged. Inline also passes
  Enter commit without another paragraph, Right-arrow exit, focus return,
  prose input immediately after the formula and host Undo.
- The fixture reuses the detached HTML parser for prose/container checks and
  copies parsed units when constructing expectations. Full saved-state equality
  remains required for history and persistence checks.
- Test-source formatting passes. Only tests and documentation changed in this
  extension; no runtime fix, additional build or package publication was needed.
- Next: Slate and Gutenberg. TinyMCE iframe hosts, other CKEditor builds,
  native OS IME/clipboard and other browser/input environments remain separate
  targets. Editor.js document history is still outside its demo's configuration.


## EDIT-019 all integration demos — workspace, 2026-09-10

- Run: `2026-09-09T23-55-26-302Z`, stable source fingerprint.
- [Report](../../output/playwright/editing-scenarios/2026-09-09T23-55-26-302Z/REPORT.md) and
  [checkpoints and hashes](../../output/playwright/editing-scenarios/2026-09-09T23-55-26-302Z/report.json).
- **17 targets PASS / 499 checkpoints**, covering all nine integration demos
  plus standalone React block. Chromium 152 on macOS, English UI, workspace source.

| Editor | Tested math modes | Checkpoints | Host Undo/Redo |
| --- | --- | ---: | --- |
| React standalone | Block | 28 | Not applicable |
| Quill | Block + inline | 59 | PASS |
| Tiptap | Block + inline | 59 | PASS |
| ProseMirror | Block + inline | 59 | PASS |
| Lexical | Block + inline | 59 | PASS |
| Editor.js | Block | 29 | Not configured; unverified |
| TinyMCE | Block + inline, inline host | 59 | PASS |
| CKEditor | Block + inline, ClassicEditor | 59 | PASS |
| Slate | Block + inline | 59 | PASS |
| Gutenberg | Block, standalone provider | 29 | PASS |

- Slate passes the sustained nested editing chain, two formula Undo/Redo chains,
  Apply as one host history event, Save/reload/Restore, re-edit and Cancel.
  Inline also passes Enter commit, Right-arrow exit, host focus, exact prose
  insertion position and host Undo. Comparisons retain the saved descendant
  array and formula objects; prose checks also preserve paragraph boundaries.
- Gutenberg passes the same block chain and provider host Undo/Redo. Full saved
  HTML equality includes WordPress comments and encoded math data. A separate
  detached DOM comparison checks prose and block order; comments are not prose.
- Both new hosts keep saved document data unchanged while editing a draft.
  Restore reproduces the full saved state and reopens the same editable model.
- Fingerprints now include Slate and Gutenberg source/package metadata, as well
  as the previously covered hosts, core, shared helpers, demos and test runner.
- Formatting passes. This extension changed only tests and documentation; no
  runtime fix, new build or publication was needed.
- This run covers local demo configurations. It does not replace the separate
  WordPress admin/plugin ZIP checks. TinyMCE iframe, other CKEditor builds,
  collaboration, native OS IME/clipboard, Firefox/WebKit, touch, accessibility
  and performance remain separate targets. Editor.js/Gutenberg are block tools;
  no inline mode is claimed for them.
