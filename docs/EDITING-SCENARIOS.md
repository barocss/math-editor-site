# Editing scenarios

Use this document to manage editing behavior. [Supported features](SUPPORT.md)
lists notation; this register describes what a person does with that notation.
[Validation](VALIDATION.md) stores dated execution evidence. Neither the number
of features nor the number of unit tests proves that an editing flow works.

## Status and ownership

Keep each scenario ID stable. Add the ID to the browser fixture that exercises
it and to a bug report when that flow fails. The person changing the behavior
updates its expected result, test mapping and execution record in the same change.
The release owner reviews unresolved cases before publishing.

| Status | Meaning |
| --- | --- |
| Recorded | A dated run is recorded for the stated scope. This is not a pass for every adapter or a future build. |
| Rerun | Related browser checks exist, but this register does not certify the full scenario on the current source. |
| Extend | Some assertions exist; additional browser steps or checks are required. |
| Manual | Requires a person or device. No automated pass is claimed. |

P0 covers loss of content, blocked input, invalid output and host persistence.
P1 covers discoverability, navigation and presentation. P2 covers additional
platform coverage. A known P0 failure blocks release for the affected scope.
An unrun or unsupported case must never be counted as passed.

## Scenario register

Start each case with a fresh editor unless the steps specify saved content.
Use actual key presses for typing and actual pointer movement for drag cases.
`Cmd` applies on macOS; `Ctrl` applies on Windows/Linux. Do not substitute a
programmatic value assignment for a focus or typing assertion.

| ID | Priority / flow | Steps | Required result | Status / test mapping |
| --- | --- | --- | --- | --- |
| EDIT-001 | P0 — Continuous input | Enter `4ab+12`, one key at a time. Pause after `4`. Resume while suggestions are visible. Move left, insert `x`, then delete it. | Each key appears once. The input retains focus. Numbers and variables remain in order; no key changes host prose. | Rerun — `quill-typing-check.js`, `typing-check.js`, `token-paste-check.js` |
| EDIT-002 | P0 — Operand wrapping | Type `4ab`. Choose absolute value for the `ab` operand. Continue typing after the structure. Repeat with parentheses, fraction and root. | `ab` remains inside the chosen structure; `4` remains outside. The cursor reaches the intended slot or following boundary. No operand disappears. | Rerun — `operand-size-check.js`; `suggestions.test.ts` |
| EDIT-003 | P0 — Selected suggestion | Type `abcd`. Select `cd` with Shift+Left twice. Use Down/Up, choose root, then Enter. Repeat with mouse drag. | The range stays selected while options change. Only `cd` is wrapped. The input receives focus after acceptance. | Rerun — `selection-suggestions-check.js`. Recorded 2026-09-09 for React and nine hosts before radical suggestions were added; rerun after suggestion changes. |
| EDIT-004 | P0 — Return to a caret | Select part of `abcd`, press Left or Right, then type `q`. Repeat with a selection that includes a fraction. In the native field, dismiss the menu with Escape before testing Up/Down collapse. | Left uses the ordered start; Right uses the ordered end. Typing inserts at that edge instead of replacing the old range. A fraction boundary does not enter the wrong slot. | Rerun — `selection-collapse-check.js`, `tinymce-inline-check.js` |
| EDIT-005 | P0 — Radical conversion | Load `\sqrt{x+1}`. Choose Change to Indexed root. Replace the selected `2` with `3`. Return to the radicand, then edit the index to `2` and convert back. Undo and Redo. | The radicand and nested nodes survive. Index `2` is selected on conversion. Index `3` cannot be silently discarded. One conversion is one Undo step. | Recorded, partial scope — `root-transform-check.js` (React/Quill, pointer and keyboard acceptance, 2026-09-09); `root-transform.test.ts` (Undo/Redo and nested trees). Browser Undo/Redo and the other hosts still need a run. |
| EDIT-006 | P0 — Structure deletion | Create a fraction, scripts, aligned equations and cases. Test Backspace/Delete at inner and outer boundaries with empty and populated slots. Undo each deletion. | Behavior matches the documented boundary rule. Populated grid cells are not silently merged or lost. Undo restores content and structure. | Extend — `empty-slot-deletion-check.js` recorded React/DOM Delete, Backspace and Undo for empty roots, fractions, exponents and root indices on 2026-09-09. Grid and populated-boundary checks remain separate: `grid-deletion.test.ts`, `native-parity-check.js`. |
| EDIT-007 | P0 — Copy and paste a range | Select text plus a nested fraction. Copy, move the caret, paste, then cut and Undo. Repeat across two editor instances. | The selected structure is preserved; unselected content stays unchanged. Cut can be undone. A rejected paste leaves the document unchanged. | Extend — `native-parity-check.js`, `token-paste-check.js`, `range.test.ts`; real OS clipboard coverage remains separate. |
| EDIT-008 | P0 — LaTeX import failure | Import `\frac{x}{y}+z`. Edit `x`. Attempt an unsupported command and malformed braces. Cancel, then reopen. | Valid input is editable. Invalid or unsupported input reports a diagnostic and retains the previous formula. Cancel does not replace host content. | Rerun — `latex-paste-host-check.js`, `latex-insertion.test.ts`, `latex.test.ts` |
| EDIT-009 | P0 — Apply, Cancel and history | Open an existing host formula. Edit and Cancel. Reopen, edit and Apply. Run host Undo and Redo. | Cancel leaves the stored host data unchanged. Apply creates one host history operation. Host serialization contains formula data, not input/menu DOM. | Rerun — host fixtures, including `tinymce-inline-check.js`, `quill-composition-check.js`, `ckeditor-check.js` |
| EDIT-010 | P0 — Save and reopen | Edit nested content, Apply, Save and Restore. Reload the stored host document and reopen the formula. | Structure, LaTeX and configured presentation survive. The formula is editable after restoration. Do not claim persistence from a preview-only check. | Rerun — `unified-check.js` and host-specific fixtures; record each supported storage format. |
| EDIT-011 | P0 — Host boundary and read-only | Move from prose into an inline formula with a boundary arrow. Edit, exit and continue prose. Switch the host to read-only with a draft open. | Math key events do not edit prose. Read-only closes or disables the draft according to the host contract and prevents new mutations. | Rerun — `shared-boundary-check.js`, `host-check.js`, host-specific fixtures |
| EDIT-012 | P1 — Suggestion scrolling | Type `matrix`. Park the pointer over a menu item. Press Down repeatedly with pauses; reverse with Up. Test near the bottom of the viewport and in an iframe. | Each press moves one option. The selected option stays visible. The list does not jump back; the page and host do not scroll unexpectedly. | Rerun — `suggestion-arrow-check.js`, `suggestion-menu-clipping-check.js`, `iframe-field-check.js` |
| EDIT-013 | P1 — Nested navigation | Enter `x_i^2`, a fraction inside a root, and a limit. Move with Left/Right, Up/Down and Tab at every slot boundary. | The nearest structure owns vertical movement when no suggestion menu is active. Selection and caret positions remain valid. | Rerun — `react-vertical-check.js`, `vertical-check.js`, `vertical-navigation.test.ts` |
| EDIT-014 | P1 — Rectangular matrix | Type `3x7` and accept the matrix. Fill cells; add/delete rows and columns. Test `1x2` and `2x1` boundaries. | Dimensions match the request. Existing cells retain their content. Cursor movement follows the resulting grid. | Rerun — `matrix-size-shortcut-check.js`, `matrix.test.ts`, `native-tools-host-check.js` |
| EDIT-015 | P0 — Matrix range editing | Select a cell rectangle. Copy/paste, clear, Undo and transpose. Test a mismatched or oversized paste. | Cell boundaries and nested structures survive. Invalid operations leave the matrix unchanged. Draft operations do not create host history entries. | Rerun — `matrix-range-check.js`, `matrix-range-host-check.js`, `matrix-range.test.ts` |
| EDIT-016 | P1 — Lines, alignment and cases | Create two lines. Insert aligned equations and cases; add a row and edit both columns. Try Enter in inline mode. | Block layouts retain their rows. Inline mode does not create an extra formula line. Enter follows the configured host commit policy. | Extend — `typing-check.js`, `lines.test.ts`, `equation.test.ts`, `embedding.test.ts`; add a combined browser flow. |
| EDIT-017 | P1 — Preview agreement | Edit a nested root, scripts, tall fences, integrals with limits, and a chemical formula. Compare exported LaTeX in KaTeX at a matched base size. Repeat with the input active. | Mathematical structure agrees. Baselines, fences, indices and limits remain readable. Focus backgrounds and hit areas do not obscure notation. | Recorded metric baseline — 77 formulas / 288 React/DOM mode-size comparisons passed on 2026-09-10. See the source-only `test/rendering/STATUS.md` ledger. Selected metrics and active-input checks do not certify every glyph or every editing flow. |
| EDIT-018 | P1 — Language and multiple instances | Switch en/ko with a draft open. Open another editor and its suggestions. Repeat with a registered custom locale. | Labels resolve, formulas do not change, focus and menus stay with the right instance, and search aliases use the locale fallback rules. | Rerun — `plugins-locale-check.js`, `shared-symbol-tools-check.js`, `locale-discovery.test.ts` |
| EDIT-019 | P0 — Long edit session | Build a fraction, wrap a selection, convert a radical, insert a matrix, undo five steps, redo five, Apply, Save and reopen. Repeat without resetting the page. | No stuck focus, lost selection, duplicated operation or draft leakage. All checkpoints retain the expected formula. | Recorded, scoped — `test/editing/continuous.browser.js`, run with `pnpm --filter @barocss/math-editor test:editing`. React standalone block, Quill/Tiptap/ProseMirror/Lexical/TinyMCE/CKEditor/Slate in-place block/inline, and Editor.js/Gutenberg block passed on 2026-09-10 (17 targets, 499 checkpoints); includes two uninterrupted formula history chains and host Apply/Save/reload/Restore/Cancel. Editor.js has no host history integration, so document Undo/Redo remains unverified there. Inline additionally verifies Enter commit without new paragraphs, right-boundary exit, prose caret position and host Undo. TinyMCE uses its inline host, CKEditor uses ClassicEditor, and Gutenberg uses the standalone provider demo. Other configurations and native OS input remain unverified by this run. |
| EDIT-020 | P2 — Native IME and clipboard | On a real OS, compose Korean text, move the caret, use suggestions, cancel composition and paste with the system clipboard. | Composed text appears once; composition keys do not apply suggestions or host commands prematurely. Clipboard data is preserved according to the documented formats. | Manual — previously deferred by the user. Synthetic composition/DataTransfer checks do not certify OS behavior. |

## Contextual structure tools

These scenarios specify the footer independently from the suggestion list. The
footer has a single target: the nearest enclosing radical or fence. It is shown only
while that editor is active, outside literal text and model/matrix selections.
Native text selection within the active slot is allowed, including the selected
index produced by conversion.

| ID | Priority / flow | Steps | Required result | Coverage |
| --- | --- | --- | --- | --- |
| EDIT-021 | P1 — Discover without search | Click inside a root. Put the caret at the start of its text. Dismiss suggestions with Escape. Move outside the root. | Footer shows the current structure and conversion even with no query or no open suggestions. Leaving the radical hides it. | `context-tools-check.js` |
| EDIT-022 | P0 — Footer conversion and index edit | Convert a root using the footer. Replace selected index `2` with `3`. Click the radicand, choose Edit index, type `2`, convert back and Undo. | Content survives, index editing selects the existing index, a non-square index blocks reverse conversion with a visible reason, and Undo restores the structure. | `context-tools-check.js` |
| EDIT-023 | P0 — Keyboard-only footer | From input, press F6, Escape, F6 and Enter. Tab between available buttons. | F6 enters tools; Escape returns to the same input. Button activation edits the intended structure. Keys do not reach host prose. Tab uses native button order. | F6/Escape/Enter recorded in `context-tools-check.js`; explicit Tab-order assertion remains to add. |
| EDIT-024 | P0 — Nearest nested target | Open `\sqrt[3]{a+\sqrt{x}}`. Move between `a` and `x`. | Footer identifies the outer indexed root at `a` and inner square root at `x`. Index editing targets the corresponding root. | `context-tools-options-check.js`, `root-transform.test.ts` |
| EDIT-025 | P1 — Locale without model changes | Show tools, change en to ko, then edit the index. | Structure name, actions, disabled reason and keyboard hint update together. Stored formula content is unchanged by locale selection. | `context-tools-options-check.js`; direct document equality on locale switch remains to add. |
| EDIT-026 | P0 — Scope and focus | Create a model range, collapse it, blur the field, reopen, then destroy the instance. Repeat focus navigation inside an iframe. | Range mode does not show stale caret actions. Collapse restores context; blur hides it; destroy removes it. Focus stays in the iframe's own document. | `context-tools-check.js`, `context-tools-options-check.js` |
| EDIT-027 | P0 — Composition guard | Dispatch composition start and end in the native field with context visible. | Actions are disabled during composition and resume afterward. This guard test is not OS IME certification. | Synthetic coverage in `context-tools-options-check.js`; real OS behavior remains EDIT-020. |
| EDIT-028 | P1 — Embedding opt-out | Set `contextTools: false`, then update to true. Repeat with `context-tools="false"` on a Web Component. | Footer hides without changing the formula or removing suggestion-based conversions. Attribute updates take effect without remounting. | Visibility/update coverage in `context-tools-options-check.js`; per-framework wrapper smoke checks remain to add. |

## Inline transformation suggestions

The suggestion list is the primary keyboard entry point for structural changes.
It remains available when both toolbar and context footer are hidden. Alt+Down
opens or reopens suggestions and highlights the first available transformation;
Up/Down browses, Enter applies, and Escape dismisses without editing the formula.
Automatic context-only suggestions require navigation before Enter can apply them,
so an inline host's commit key is not silently replaced.

| ID | Priority / scenario | Steps | Expected result | Coverage |
| --- | --- | --- | --- | --- |
| EDIT-029 | P0 — Fence suggestions in inline fields | Type inside parentheses. Press Alt+Down, Enter, then continue typing. Repeat after dismissing the menu. | The list distinguishes changing a fence from wrapping an operand. Existing content and caret are preserved; the menu does not take DOM focus. | `fence-suggestions-check.js`, `context-tools.test.ts` |
| EDIT-030 | P0 — Browse, cancel and Undo | Open changes, browse with Up/Down, cancel with Escape. Reopen, apply, type, then undo typing and conversion separately. | Browsing and cancellation do not change the formula. Conversion makes one history entry. | `fence-suggestions-check.js` |
| EDIT-031 | P0 — Nearest wrapper and all fence pairs | Change each of eight fence types. Test nested fractions, roots, mixed delimiters and stale targets. Use F6/Left/Right/Enter if the optional footer is enabled. | Only the nearest supported wrapper changes. Slot IDs, content and caret remain stable. Explicit left/right metadata is removed when selecting a standard pair. | `context-tools.test.ts`, `fence-context-check.js`; browser nested targeting in EDIT-032 |
| EDIT-032 | P0 — No-toolbar inline iframe | Hide toolbar/footer in an inline iframe field. Change an inner fence with suggestions, switch ko/en and continue typing. Destroy the editor. | The complete workflow works without auxiliary UI. Locale changes leave the document unchanged. Focus uses the iframe document; teardown removes suggestions. | `fence-inline-options-check.js`; installed host/browser breadth remains separate validation work |

Execution scope is recorded in [Validation](VALIDATION.md). A mapped case may
still contain pending assertions, as stated in the Coverage column.

Browser fixture names above refer to `apps/math-integrations/tests/`. Unit fixture
names refer to `packages/math-editor/test/`. A mapping identifies related coverage,
not an assertion that every step already exists in that file. Extend cases need
explicit browser assertions before they can receive a full pass.

## Test environments

Record renderer, adapter, mode and browser separately. An integration using the
native DOM field does not prove the rich React field, and an iframe can have its
own focus, event and CSS failures.

| Layer | Required scope when that layer changes |
| --- | --- |
| Shared model / suggestions | Unit checks plus affected editing scenarios on rich React and native DOM. |
| Framework adapter | The affected adapter: pure JS, Web Component, Vue, Svelte, Solid, or React wrapper. Record the actual renderer used. |
| Host integration | Every affected host. Shared field changes need the nine-host smoke set: Tiptap, ProseMirror, Lexical, Editor.js, TinyMCE, CKEditor, Quill, Slate, Gutenberg. |
| Mode / container | Inline and block where supported; TinyMCE classic iframe as well as inline. Editor.js and Gutenberg block-only scenarios are N/A for inline tests. |
| Browser | Record Chromium, Firefox or WebKit explicitly. Current Chromium evidence does not cover the other engines. |
| Build source | Workspace source for development; packed artifacts for release checks. Neither implies the other. |

## Per-run record

Append detailed evidence to [Validation](VALIDATION.md), using this template.
Record an immutable revision when possible. For an uncommitted workspace, record
that fact and save the tested patch or a source fingerprint with the run artifacts.
A date alone does not identify the tested code.

```text
Run ID: edit-YYYYMMDD-NN
Scenario IDs:
Source: commit / workspace fingerprint / package versions and archive hashes
Fixture revision:
Renderer and host:
Mode and container:
Browser, OS, locale:
Input formula and steps:
Expected result:
Observed result:
Outcome: PASS / FAIL / BLOCKED / NOT RUN / N/A
Evidence: log, screenshot pair, trace or recorded host data
Remaining steps and excluded environments:
Issue / follow-up:
```

A scenario passes only when all required assertions pass in the recorded scope.
For partial coverage, report the passing steps and keep the rest unverified.
Do not convert historical validation totals into a current release pass.

## Change workflow

1. Assign a scenario ID to each editing bug before changing its behavior.
2. Reproduce the smallest failing input sequence. Capture the caret, selection,
   highlighted suggestion, document and host data where relevant.
3. Add or update a regression fixture with the same ID. Check the final model,
   cursor/focus and history behavior, not only whether an element is visible.
4. Implement the change. Run its model tests, affected browser scenarios and the
   nearest negative case. Compare editor/KaTeX output when notation changes.
5. Record the result and its scope. Mark related scenarios for rerun if later
   changes touch their input, selection, suggestions, history or host handling.
6. Before release, run the applicable P0 cases against the release candidate and
   check packed imports. Any excluded host/browser must be stated explicitly.

The Markdown register is the source of truth for scope and acceptance criteria.
The browser fixtures contain executable assertions. The validation report holds
run evidence. The documentation site renders this register; it does not execute
the browser checks. Automated release enforcement is not implemented by this
register alone.

## Next work

1. Maintain the EDIT-019 baseline across all nine integration demos and React
   standalone block. Extend it separately to TinyMCE iframe, WordPress admin and
   other host configurations. Preserve exact checkpoints and host-history assertions.
2. Add missing browser steps for EDIT-006, EDIT-007 and EDIT-016. Include negative
   cases and real host Undo/Redo rather than testing only model transformations.
3. Reuse the EDIT-019 runner pattern for additional scenario IDs. It already
   records source fingerprints and fails on changed source or failed assertions.
   CI/release enforcement remains separate work.
4. Schedule Firefox/WebKit and real OS IME/clipboard coverage separately. Keep
   manual requirements visible without representing synthetic events as a substitute.
