# @barocss/math-editor

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

