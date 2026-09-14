# @barocss/math-editor

## 0.7.0

### Minor Changes

- Make ^, \_ and / create powers, subscripts and fractions immediately during visual typing, using the preceding operand or selection and focusing the next slot. Preserve adjacent structures, combine opposite scripts on the same base, and retain Undo/Redo. Update keyboard help and add continuous typing and KaTeX placement checks for React and DOM editors.

### Patch Changes

- Keep combined superscripts and subscripts aligned to the start of their shared column. Growing one script no longer shifts the other horizontally. Add live typing and KaTeX horizontal-alignment regression checks for React and DOM editors.

## 0.6.1

### Patch Changes

- Keep fraction terms at their resolved TeX size inside norms, absolute values,
  parentheses and roots. Use the same font size for passive glyphs, active inputs
  and measurement spans, including nested fractions and explicit fraction styles.
- Remove extra inline line-box descent from fence bodies so nested parentheses,
  brackets and norms keep their contents aligned during display and editing.
  Preserve fence height for fractions and other tall bodies.
- Size radical glyphs from the containing mathematical style and editing minimum.
  Remove anonymous line-box descent and inactive boundary height from radicands,
  so roots in exponents stay smaller than the base while tall contents still fit.
- Keep nested editing glyphs and inputs at a readable 14px minimum. Expose
  `--me-min-font-size` for host configuration, with 0px preserving TeX size ratios.
  Reserve line space for elevated scripts in React and native DOM editors so
  larger nested math remains inside the editing surface without changing LaTeX.
- Add Ctrl+Left/Right (Option on macOS) to move by lexical units and whole math
  structures. Add Shift to extend or shrink a selection. Apply the same behavior
  in React and native DOM editors without changing document history. Move matrix
  column deletion to Alt+Shift+Backspace to avoid a selection shortcut conflict.

## 0.6.0

### Minor Changes

- Complete forward structural deletion and next-line joining, preserving retained content and one-step Undo. Keep the preferred horizontal caret position across vertical movement in React and native DOM. Reject malformed structured clipboard data without falling back to destructive plain-text insertion, and reject multiline paste in React single-line fields. Share Enter policy so Shift+Enter bypasses suggestions and follows row/newline rules.

  Add catalog-wide populated/empty deletion scenarios, structured and matrix clipboard checks, vertical/line editing, keyboard transformations, framework lifecycle and option updates, and extended host persistence/read-only scenarios. Provide a repository-owned browser runner and CI workflow alongside existing KaTeX comparisons.

  Constrain inline surfaces to their host width so long formulas remain horizontally scrollable.

- Wrap selected math immediately with opening parentheses, brackets, braces, absolute-value bars, fraction slash, superscript and subscript keys. Preserve the selected content and move to the denominator or script slot for continued input. Share the behavior across React and native DOM fields, including inline adapters, and retain existing literal-text and unselected-input behavior.

  Add keyboard, native-selection and drag regression scenarios with Undo/Redo checks, plus block and inline KaTeX rendering comparisons for the resulting notation.

  Correct inline fraction term sizes and compact fraction row spacing to match their resolved mathematical style. Keep active inputs and passive glyphs aligned.

- Add localized keyboard and clipboard help in React and native DOM fields, available from the toolbar or F1 in a focused field. Preserve the formula and restore focus when help closes. Include beginner, clipboard and keyboard guides, and link to independent, model-checked practice exercises on the demo site.

  Expose `showHelp()` on DOM and React handles and `onHelp` for an independently mounted toolbar, so help targets an explicit field. Restore native selection as well as focus after help closes.

### Patch Changes

- Center the keyboard-selected suggestion within the available list space in React, DOM and text-source editors. Clamp scrolling at list boundaries, account for sticky source hints, and scroll only the suggestion list so the host document stays in place.
- Read the native input selection before processing keydown in React and DOM editors. Held arrow keys now cross token and structure boundaries without waiting for keyup or a delayed selection event. Add repeated-keydown browser coverage for both directions, fraction slots, Shift selection, continued typing and Undo.
- Allow fixed suggestion menus to use viewport space outside compact dialogs. Constrain menus by actual CSS clipping boundaries, not dialog semantics, while retaining host action-control avoidance.

## 0.5.0

### Minor Changes

- Show query-independent radical tools below the active editing surface. Include conversion, index editing, disabled explanations, F6/Escape focus navigation, en/ko labels and a contextTools opt-out (context-tools for Web Components). Preserve model history and hide stale context during range selection or blur.
- Add contextual bracket transformations to suggestions, with Alt+Down discovery and keyboard acceptance in inline fields without toolbar or footer. Preserve contents, caret and history; target the nearest root/fence and reject stale actions. Include optional footer bracket controls and localized keyboard guidance.
- Add contextual suggestions to convert a square root to an indexed root while preserving the radicand. Select the new index `2` for immediate editing. Allow conversion back to a square root only for an empty index or `2`. Include English/Korean labels and shared behavior in React and native DOM integrations.

### Patch Changes

- Resolve operator presentation from mathematical slot context in React and native
  DOM editors. Use text/script-size glyphs and side limits inside fractions and
  scripts, preserve explicit limit placement, and apply smaller nested bounds.
  Add context-resolution unit tests and KaTeX glyph-width/font/position checks.
- Align named-function and fraction boundaries with mathematical spacing in React
  and native DOM. Remove repeated function glyph padding and fixed fraction outer
  margins. Preserve thin function spacing in script styles and omit it before plain
  opening parentheses.
- Use bundled KaTeX math faces for variables, upright symbols and display operators. Remove artificial integral skew, scale delimiter widths, and preserve curved over/underbrace ends with licensed KaTeX SVG slices. Refine radical sizing, root-index placement, matrix columns and integral limit spacing in both editable and passive views.

  Extend the source-only geometry audit with opt-in horizontal-position checks, font asset fingerprints, explicit font loading and multiple-integral/long-brace cases. Retain the KaTeX MIT attribution for bundled assets.

- Use shared mathematical spacing for text runs in React and native DOM. Distinguish
  unary signs from binary operators, space relations and punctuation, and suppress
  these gaps inside scripts. Remove excess glyph padding and reduce inactive caret
  boundary width while preserving empty input targets.
- Use small operator glyphs and side limits in inline mode. Reduce nested script
  size, adjust radicals inside superscripts, and preserve curved end caps on very
  tall parentheses. Extend source-only KaTeX comparisons to large fences, deep
  nesting, and actual inline mode.
- Fix KaTeX-compatible export and import for literal caret and tilde characters in
  math text runs. Protect complex root-index arguments without changing JSON
  structure. Add clearance between nested radical rules and extend rendering
  regression checks.
- Use KaTeX-derived SVG contours for radicals and short/tall parentheses. Keep
  existing editing boxes while improving tapered strokes and curved ends. Include
  the outline assets and attribution in the package, and extend visual comparison
  fixtures to simple roots and short parentheses.
- Correct the size, height and spacing of fraction terms used as scripts. Add editor/KaTeX geometry and screenshot fixtures for fractional powers and subscripts. Allow Delete and Backspace inside empty non-grid slots to remove their wrapper while retaining other content and Undo support.
- Match ordinary script and root-index font scales more closely to KaTeX in passive and active editing. Add a source-only rendering audit with per-formula measurements, screenshots and a tracked difference ledger.
- Keep formula selections intact when Up/Down navigates a visible wrapping suggestion menu. Enter applies the highlighted wrapper to the selected content. Left/Right still restores the caret, and Shift+arrows extends the selection. Apply the same behavior to React and native DOM fields used by host integrations.
- Align nested fraction terms, matrix rows, annotations and operator limits more closely with KaTeX. Scale large and contour integral geometry with the configured font size. Preserve explicit display-fraction sizes and positions inside scripts. Use matching input and passive-text metrics to retain edit positions.

  Expand the source-only geometry audit to 33 formulas, including two font sizes, React and DOM rendering, active typing checks and a local image comparison gallery.

## 0.4.1

### Patch Changes

- Move each host implementation, tests and host-specific styles into its own plugin
  package. Keep only shared data, draft-field UI and messages in the private common
  package. Preserve the public entry points and stored formula format.

  Declare ProseMirror as Tiptap's public dependency instead of bundling a second
  copy of its host implementation. Keep host SDKs and the math core external, and
  include common helpers and declarations within each published artifact.

  Resolve workspace imports from source without a prior build. Use publishConfig
  entry-point overrides for the core and all public plugins, and verify staged npm
  artifacts against their generated runtime and declaration paths.

## 0.4.0

### Minor Changes

- Exclude JavaScript and declaration source maps from the npm package. Verify their absence alongside the MIT license and runtime entry points during release preparation.

- Unify native token editing and role colors with the rich React editor. Preserve token-boundary navigation, deletion and composition in framework and host adapters.

  Add explicit LaTeX insertion at the caret or selection through `pasteLatex` and a nonmodal paste form. Add shareable recent/favorite symbol and template preferences, plus contextual bracket, fraction-size and operator-limit controls. Preserve formula contents, IDs and undo boundaries, and document the APIs and unreleased scope in English and Korean UI packs.

## 0.3.0

### Minor Changes

- Recognize matrix dimensions such as `2x1`, `1x2`, `3x7` and `4x4` as suggestion shortcuts, including uppercase `X` and `×`. Support 1–20 rows and 1–20 columns. Offer matching empty and zero matrices, with identity matrices only for square sizes. Focus the first cell after insertion and keep row-order Tab editing. Preserve the typed expression until a candidate is accepted, keep surrounding terms, and restore the shortcut in one Undo.

- Match native suggestion and selection menus to the rich React presentation, with larger glyphs, descriptions, localized guidance and one scrollable options list. Short host panels prioritize selectable rows; keyboard navigation keeps the host page stationary.

- Add rectangular matrix-cell selection to both editing surfaces. Drag between cells or Shift-click to select a rectangle; use Select cells and Shift+arrows for keyboard selection. Copy/cut preserves nested formulas and writes a matrix clipboard payload alongside the existing fragment and LaTeX formats. Paste validates dimensions before applying, grows from a single-cell anchor within 20 × 20, and supports tab-separated cell text.

  Add full-matrix transpose while preserving cell IDs, delimiters and nested caret positions. Cell paste, clear, cut and transpose are single history edits. Expose the selection and transformations through the framework-free session/core APIs, with English/Korean controls and updated documentation.

- Add native toolbar symbol search, editable formula templates, matrix presets and contextual row, column and delimiter controls. Keep additional tools behind More, preserve custom structure filters, and support composition disabling for independently mounted toolbars.

  Highlight exact selected text segments and allow selection to extend from the active input across formula structures. Preserve ordinary native input selection, Shift-drag anchors, iframe document ownership, clipboard behavior and structural Undo.

- Add structural Up/Down navigation in the React and native DOM editors. Fractions,
  scripts, indexed roots, annotations, grids, and equation lines choose a nearby
  rendered caret position. The core `moveVertical` helper also works without a DOM.

  Allow a separately mounted math toolbar to attach to the active editor through
  `setSession(session)` and detach with `setSession(null)`. A detached toolbar keeps
  its labels and disables editing commands.

- Expose inherited CSS variables for editor colors, token colors, slot backgrounds, toolbar density and menu appearance. Keep per-editor themes on portaled suggestion and selection menus, including live theme switches and iframe documents. Add a styling guide and website theme/size/density examples without changing formula data or LaTeX output.

### Patch Changes

- Preserve keyboard suggestion navigation while the mouse rests over the list. Highlight a pointer candidate only on actual mouse movement, so menu redraws cannot restore the previous choice or scroll position. Notify host adapters after pointer highlighting to preserve the native input caret during Quill reconciliation.
- Keep suggestion menus at their normal size inside scrolling host editors such as CKEditor and Quill. Respect transformed containers and dialog boundaries, isolate menu text alignment from the host document, and highlight pointer candidates without resetting list scroll.
- Use the embedding document for native editor elements, suggestion menus, range measurements, and event listeners. This keeps typing, toolbar controls, selection, and scrolling menus working inside same-origin iframe editors such as the WordPress block editor.
- Avoid a DOM Range exception when clicking an empty caret slot in the native DOM editor, including embedded Tiptap and ProseMirror math editing.
- Preserve operands when partial structure suggestions follow a coefficient, including absolute values, roots, fractions, and fences. Keep native suggestion-list scrolling from rebuilding the list and resetting its position; scroll keyboard-selected options into view.
- Restore the input caret when a plain arrow follows a Shift+arrow or dragged model selection. Left/Up collapses to the document-ordered start and Right/Down to the end, without changing the formula or host history. Apply the same behavior in both renderers. Use Alt+Up/Down to navigate wrapping suggestions while retaining a selection; Enter and pointer selection remain available.

## 0.2.1

### Patch Changes

- Support Shift+arrow model selection in React and native DOM editors, sharing drag-range copying, deletion and wrapping behavior. Extend horizontal selections across balanced structures and vertical selections between document lines. Restore Cases alongside paired braces for the `{` suggestion trigger, preserving paired braces as the default. Update English/Korean interaction guidance.

## 0.2.0

### Minor Changes

- Add bounded LaTeX import and validated JSON loading with atomic diagnostics and undoable editor imports. Expand editable notation with combined scripts, matrices and cases, integral and limit variants, scalable fences and radicals, accents and brace annotations, explicit sizes, mathematical alphabets, spacing and labeled arrows. Import unnumbered equation wrappers without numbering semantics.

  Improve model-based selection, copying, pasting and wrapping; compact configurable toolbars; and editing typography and focus presentation. Complete English/Korean labels for the new catalog and validate locale pack structure and coverage. Update API, model, syntax, localization and embedding guides. Framework subpaths share this release; unsupported TeX macros, numbering and additional environments remain explicitly excluded.

### Editing and compatibility details

- Preserve combined scripts, delimiter sizing, integral bounds and limit placement. Add norms, multiple/contour integrals, annotations, accents, explicit fraction/binomial sizes, scoped alphabets, fine spacing and labeled arrows.
- Improve arrow discovery, Korean keyword search, matrix presets, toolbar expansion and focus/spacing geometry using KaTeX comparisons.
- Import `equation*` as formula content; reject numbering, macros and unsupported environments without modifying the existing document.
- Keep en/ko message keys inside validated JSON packs. Custom locale dictionaries retain English fallback.

## 0.1.0

Initial public release.

- Structured expression model, LaTeX export, undo/redo and model-based selection/clipboard operations.
- Rich React editor with symbol discovery, matrices, aligned equations, cases and editable templates.
- Native DOM surface with pure JavaScript, Web Component, React, Vue, Svelte and Solid entry points.
- Optional toolbars, inline/block modes, host callbacks and independent LaTeX/preview views.
- English/Korean JSON locale packs and host-registered translations and suggestion aliases.

The native surface has documented feature differences from the rich React editor. See ADAPTERS.md and VALIDATION.md for the supported scope. This release does not parse arbitrary LaTeX or evaluate expressions.
