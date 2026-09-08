# LaTeX import and export contract

See [LaTeX → JSON model mapping](LATEX-MODEL.md) for node types, slot order and complete conversion examples.


## Status and purpose

This document defines the bounded LaTeX import/export contract in **0.2.0**. Workspace implementation notes below are included in this release unless explicitly marked as future work.

The loader belongs to `@barocss/math-editor/core`. It converts a bounded presentation grammar into editable `MathDocument` nodes. It does not execute TeX, evaluate formulas, expand macros or use KaTeX's internal parse tree. All framework adapters consume the same result.

The first product target is Note: open an existing supported LaTeX formula in a popup, edit a draft, apply one host transaction, and reopen it after saving. Unsupported formulas must remain available in the existing source editor.

## Three different capabilities

| Capability | Responsibility | Acceptance evidence |
|---|---|---|
| Display LaTeX | Host KaTeX renderer | The host renderer accepts the source |
| Import for editing | `parseLatex` and the editor model | Parser succeeds and every resulting node remains editable |
| Export LaTeX | `toLatex` | Supported model produces valid presentation output |

KaTeX display support does **not** imply editable import support. For example, KaTeX can display annotations such as underbraces that the editor cannot yet import. Unsupported notation must fail without a partial conversion.

## V1 grammar

| Family | Accepted forms / examples | Model / policy | Status |
|---|---|---|---|
| Plain values | `abc`, `123`, Unicode text, `+ - = < >` | Ordinary text nodes; no variable evaluation | Workspace |
| Grouping | `{a+b}`, empty `{}` | Grouping controls the next argument; braces are not visible parentheses | Workspace |
| Fractions | `\frac{a}{b}`, single-token arguments such as `\frac12` | Numerator and denominator slots | Workspace |
| Square roots | `\sqrt{x}`, `\sqrt x` | One radicand slot | Workspace |
| Superscripts | `x^2`, `x^{2}`, `{a+b}^{n}` | Base and exponent; an unbraced base is one atom | Workspace |
| Subscripts | `x_i`, `x_{ij}` | Base and subscript | Workspace |
| Simultaneous scripts | `x_i^2`, `x^2_i` | `scripts`: shared base, lower, upper; exports `{x}_{i}^{2}` | Workspace |
| Literal text | `\text{otherwise}` | `textGroup`, one literal row; spaces and escaped characters retained | Workspace |
| Named operators | `\sin`, `\log`, `\operatorname{custom}` | `operatorName`, one editable literal name; following arguments remain adjacent math | Workspace |
| Limits | `\\lim_{x\\to 0}{x}`, `\\lim x` | `limit`: `[condition, body]`; absent condition/body remains editable | Workspace |
| Binomial coefficients | `\\binom{n}{k}` | `binomial`: `[upper, lower]`; nested editable terms | Workspace |
| Indexed roots | `\sqrt[3]{x}`, `\sqrt[n+1]{x}` | `indexedRoot`: `[index, radicand]`; an empty index remains editable | Workspace |
| Accents | `\vec{x}`, `\hat{x}`, `\overline{AB}` | One editable body; supports nested math and selection wrapping | Workspace |
| Slanted relations | `\geqslant`, `\leqslant` | Preserve `⩾` / `⩽`, including their exported commands | Workspace |
| Scripted plain parentheses | `(a+b)^2` | Group the complete parenthesis as the script base; export scalable parentheses | Workspace |
| Explicitly nested scripts | `{x_i}^{2}` | Nested model nodes; different from a simultaneous script pair | Workspace |
| Scalable delimiters | `\left(a\right)`, `\left[a\right]`, `\left|a\right|` | Matched, mixed and invisible ends; curly/angle delimiters are also supported; equivalent `\lparen`, `\rparen`, `\lbrack`, `\rbrack`, `\lvert`, `\rvert`, `\vert` accepted after left/right | Workspace |
| Ordinary delimiters | `(a+b)`, `[a,b]`, `|x|` | Literal text; do not infer grouping or absolute-value semantics | Workspace |
| Large operators | `\sum_{i=1}^{n}{x}`, `\prod`, `\int` | Lower, upper and body slots; missing limits are empty; an unbraced body is one atom | Workspace |
| Symbols | Every mapping in [Symbol reference](SYMBOLS.md) / `mathSymbols` | Shared export/import catalog, including `\mathbb{N/Z/Q/R/C}` and unbraced `\mathbb R` | Workspace |
| Common aliases | `\neq`, `\leq`, `\geq`, `\rightarrow`, `\gets`, `\land`, `\lor`, `\lnot` | Canonical catalog equivalents | Workspace |
| Degree | `{}^{\circ}` (the catalog's export form) | Degree glyph; `30^{\circ}` also imports as the degree notation | Workspace |
| Matrices | `matrix`, `pmatrix`, `bmatrix`, `Bmatrix`, `vmatrix`, `Vmatrix` | Preserve environment and rectangular cells | Workspace |
| Equation alignment | `\begin{aligned}a&=b\\c&=d\end{aligned}` | Exactly two cells per row | Workspace |
| Cases | `\begin{cases}x&x>0\\0&x=0\end{cases}` | One expression cell or expression plus condition; omitted conditions become empty model cells | Workspace |
| Multiple lines | Top-level `gathered`, one cell per row | Root plus `additionalLines`; not a nested environment | Workspace |
| Escaped literals | `\{`, `\}`, `\_`, `\%`, `\$`, `\#`, `\&`, `\backslash`, `\textasciicircum{}`, `\textasciitilde{}` | Literal text | Workspace |
| Whitespace | Ordinary source whitespace, `%` line comments, `\ ` | Ignore formatting whitespace/comments; retain explicit spaces | Workspace |
| Math wrappers | `$…$`, `$$…$$`, `\(…\)`, `\[…\]` | Optional single outer wrapper; errors retain original offsets | Workspace |

Empty editable slots are valid import data, even if a host requires a nonempty formula before saving. Top-level line breaks must use `gathered`; bare `\\` outside an environment are rejected.

## Deliberate exclusions

| Syntax | Reason / handling |
|---|---|
| `x_i_j`, `x^2^3` | Repeated scripts require explicit grouping |
| `\boldsymbol`, `\mathfrak`, other undocumented styles, math inside `\text` | Only documented alphabet commands are supported; literal text cannot embed math |
| `\displaystyle`, `\textstyle`, arbitrary spacing dimensions | Explicit style/spacing is not preserved by the current model |
| `array`, `align`, `align*`, `equation`, nested `gathered`, `split` | Only environments listed above are accepted |
| Ragged grids, multiple alignment pairs, row spacing like `\\[6pt]` | Reject; the documented omitted condition in cases is the sole padding exception |
| `\newcommand`, `\def`, packages, labels, references, document preambles | No macro expansion or document-level TeX processing |
| `\input`, URLs, HTML or trust-enabled renderer commands | Never execute or resolve resources |

New syntax enters this table only with a model mapping, export policy, positive/negative fixtures and editor tests. Additional delimiters and overset/underset annotations are implemented in the workspace. Wider accents, under/over braces and explicit delimiter sizes remain future candidates. See the [editing guide and expansion priorities](LATEX-GUIDE.md); these are not implemented support.

## API and failure behavior

```ts
import { parseLatex, initialState } from '@barocss/math-editor/core';

const result = parseLatex(source, { multiline: true, excludedStructures: [] });
if (result.ok) {
  session.load(result.document); // Initial popup load; resets local history.
  // During editing, use session.apply(initialState(result.document)) instead:
  // replacement is then one undoable session edit, and inline policy can reject it.
} else {
  // Show result.diagnostics and keep the source and existing document intact.
}
```

`parseLatex` is state-independent. Success contains `document`, the unchanged `source`, and an empty `diagnostics` array. Failure contains the unchanged `source` and a diagnostic, with **no partial document**. The first error is sufficient in V1; error recovery is not required.

Diagnostic codes: `syntax`, `unsupported-command`, `unsupported-environment`, `unsupported-structure`, `limit`. `start` and exclusive `end` are zero-based UTF-16 offsets into the original source, including any outer wrapper. Consumers should use codes to localize UI; English messages are developer details.

Limits: 10,000 source UTF-16 units, 40 nested parser atoms, 20×20 grid cells, 200 top-level rows. The resulting persisted JSON must also satisfy `parseMathDocument` limits (200,000 serialized units, 10,000 nodes/rows and unique IDs). Limits must produce diagnostics, not stack overflows or unbounded work. Input longer than the limit is preserved in the failure result, not truncated.

`session.importLatex(source)` is the shared in-place API: success replaces the formula as one undoable edit, while syntax, size and inline-policy failures emit no changes and preserve selection/history. Use `parseLatex` plus `session.load` only to initialize a different document and deliberately reset history. The rich React UI offers the same operation through `MathEditorHandle.importLatex` / `apiRef` and additionally enforces its `excludedStructures` policy.

`parseLatex` accepts optional `multiline` and `excludedStructures` policies. Exclusions are checked recursively, including nested structures. These are host restrictions, not additional grammar. A policy rejection has code `unsupported-structure` and no document.

Import is explicit. Ordinary text paste and symbol suggestions keep their current behavior; they must not suddenly interpret all backslashes as LaTeX. Inline sessions reject multiple **top-level** rows; a matrix or cases node can remain within a single root row.

## Normalization and round-trip checks

Byte-for-byte source preservation is not promised after successful editing. Whitespace, grouping, aliases and generated IDs may change. The contract is preservation of represented notation, slot boundaries and editability, without dropping unsupported syntax.

Required gates:

1. Every catalog symbol and template: export → parse → export is canonically stable.
2. Every structure, matrix environment, empty cell, nested structure and multiline document round-trips.
3. Equivalent supported forms normalize consistently (`x^2` and `x^{2}`).
4. Malformed braces, mismatched environments, unsupported syntax and limits fail with original source and valid offsets.
5. A failed import leaves session content, selection and undo/redo unchanged. Successful replacement is undone once.
6. Demo import: success can be edited; failure keeps the previous formula; locale changes do not alter the draft.
7. Note: apply/cancel, one host undo, save/reload/reopen, inline policy, readonly state, legacy LaTeX fallback and math-adjacent caret/deletion regressions pass.

## Note persistence boundary

Use versioned structure data as the editing source and LaTeX as display/interchange output. Load saved structure only after validation and consistency checks. Existing tex-only atoms can be parsed on first edit. A source edit invalidates any stale structure data; never reopen a previous structure instead of the current source.

Markdown remains `$…$` / `$$…$$`. A Markdown round trip preserves LaTeX, not private editor structure IDs. Unsupported imported LaTeX remains editable as source and is never overwritten by a partial conversion.

The public website must keep documenting its published npm artifact. The 0.2.0 website is built against the matching npm artifact.

## Expansion priority after the first Note trial

1. **Simultaneous sub/superscripts** (`x_i^2`): implemented in the workspace as `scripts`, with a shared base, two script slots, Tab navigation and export.
2. **Named functions and text runs**: `\text`, `\operatorname` and the documented function catalog are implemented in the workspace. `\lim` is also implemented with editable condition/body slots.
3. **Indexed roots** (`\sqrt[3]{x}`): implemented in the workspace as `indexedRoot`, with index/radicand slots and empty-index removal.
4. **Accents** (`\vec`, `\hat`, `\overline`): implemented in the workspace as one-body wrappers. Additional delimiters and overset/underset annotations are implemented; under/over braces are implemented in the workspace.
5. **Explicit typography and spacing**: `\mathrm`, scoped `\rm`, `\quad`, `\qquad` and `\limits` are implemented. Further styles and spacing remain planned; see the [current backlog](ROADMAP.md#remaining-latex-priorities-workspace-review-2026-09-08).

Items marked implemented are workspace support; the remaining items are candidates. Macro expansion and complete TeX document processing remain out of scope.


### Literal text and operator names (workspace)

The named-function catalog is `sin`, `cos`, `tan`, `cot`, `sec`, `csc`, `arcsin`, `arccos`, `arctan`, `sinh`, `cosh`, `tanh`, `log`, `ln`, `exp`, `min`, `max`, `det`, `gcd`. These are notation nodes, not evaluators. Unknown names can use `\operatorname{...}`. The name is editable; known names export their standard command, others export `\operatorname`.

`\text{...}` accepts literal Unicode, spaces, nested plain grouping, comments and escaped special characters. Embedded math, styling commands and macros are rejected atomically. Text and operator-name slots contain only text nodes: structure insertion/wrapping and structured clipboard insertion into them are rejected. Use Tab to return to math input. The function argument remains outside the operator node, so `\sin^2 x` attaches the exponent to the operator name.

### Spacing, explicit limits and upright math (workspace)

| Input | Model / export policy |
| --- | --- |
| `\quad`, `\qquad` | Zero-slot spacing structures, one/two em; original command preserved |
| `\sum\limits_{i=1}^n`, `\prod\limits`, `\int\limits`, `\lim\limits` | Operator with `limits: true`; explicit directive preserved |
| `\mathrm{dx}` | One-slot `roman` math group; same command exported |
| `{\rm dx}` | Scoped upright declaration; normalizes to `\mathrm{dx}` |

Type `quad` / `qquad` (or `간격` / `큰간격`) for an explicit gap. The caret resumes after the gap; Backspace there removes it and Undo restores it. Type `mathrm` / `직립체` for an editable upright group. Math inside a roman group keeps semantic colors and structure editing. It is not a literal text group.

`\limits` is accepted immediately after the supported operator, before its scripts. Arbitrary TeX dimensions (`\hspace`, `\kern`) and other font declarations remain unsupported. These additions are included in 0.2.0.

## Additional fences and annotations (workspace)

| Input | Model | Editing |
| --- | --- | --- |
| `\left\{x\right\}` | `braces`, one body slot | Search `braces` or `중괄호` |
| `\langle u,v\rangle` or `\left\langle u,v\right\rangle` | `angle`, one body slot | Search `angle`, `내적` or `꺾쇠괄호` |
| `\left(a,b\right]` | `openClosed`, one body slot | Search `openclosed` or `열린닫힌구간` |
| `\left[a,b\right)` | `closedOpen`, one body slot | Search `closedopen` or `닫힌열린구간` |
| Other `\left…\right…` pairs, including `\left.x\right|` | `fenced`, one body slot and independent `left`/`right` | Imported ends are preserved; `.` denotes an invisible end |
| `\overset{a}{b}` | `overset`, `[annotation, body]` | Search `overset` or `위주석`; Tab moves from annotation to body |
| `\underset{a}{b}` | `underset`, `[annotation, body]` | Search `underset` or `아래주석`; Tab follows model order, even though the annotation is below |

Select an expression and choose a fence or annotation in the regular suggestion menu. Fences wrap the expression and resume after it. Annotations keep the selected expression in the body and focus the empty annotation slot. Nested fractions, scripts and other editable structures are allowed in both annotation slots. Backspace after a structure removes its wrapper while preserving its content; Undo restores it.

All structured fences scale with their contents. Short angle notation normalizes to scalable `\left\langle…\right\rangle` on export. Supported physical ends are `(`, `)`, `[`, `]`, `{`, `}`, `⟨`, `⟩`, `|` and `.`. Plain punctuation stays literal unless imported with a structural command. Norm bars are supported in the workspace; `\big`/`\Big` remain unsupported; brace annotations are implemented in the workspace.


### Double integrals (workspace)

`\iint_R f(x,y)` imports as `doubleIntegral` with exactly three slots: `[lower/domain, upper, body]`, matching integral navigation. Missing bounds remain editable empty slots. `\iint\limits` preserves the explicit placement directive. Export uses `\iint_{lower}^{upper}{body}`. Search `iint`, `이중적분` or `∬` to insert; Tab visits the domain, upper bound and body in order. The reported expression with `\rm dx \rm dy`, `\xi`, `\eta` and `\text{Area}` is covered by import/round-trip and browser editing fixtures. This is notation support, not numerical integration. Triple and contour integrals are now implemented in the workspace; see the section below.

## Norm fences (workspace)

Type `norm`, `노름`, `||` or `‖` and choose Norm. Enter the body and use Tab to continue outside. The same action wraps a selected expression. `\lVert x\rVert`, `\left\|x\right\|`, `\left\Vert x\right\Vert` and scalable Unicode double bars import as a one-slot `norm` node. Export canonicalizes to `\left\Vert x\right\Vert` (command-separating spaces may be included). Mixed scalable ends retain generic `fenced` metadata with `‖` as a valid physical end. Missing closing delimiters fail atomically. This represents notation; it does not calculate a vector norm.

## Triple and contour integrals (workspace)

| Input | Model | Slots / behavior |
| --- | --- | --- |
| `\iiint_a^b{f}` | `tripleIntegral` | `[lower, upper, body]` |
| `\oint_C{f}` | `contourIntegral` | `[lower, upper, body]`; absent upper stays empty |

Search `iiint` / `삼중적분` / `∭`, or `oint` / `폐곡선적분` / `∮`. Tab visits lower, upper and body. Backspace after the structure unwraps its contents; Undo restores it. Both accept and preserve `\limits` for stacked bounds; default editing places bounds alongside the slanted glyph. Unbraced input consumes one body atom, as for existing integrals. `\nolimits` is supported in the current workspace. These are editable notation, not integration or path analysis. Contour glyphs use the bundled KaTeX Size2-Regular U+222E directly, with its native ring and slant. No pseudo-element strokes are added.

## Brace annotations (workspace)

| Input | Model | Slots |
| --- | --- | --- |
| `\overbrace{a+b}^{n}` | `overbrace` | `[annotation, body]` |
| `\underbrace{a+b}_{n}` | `underbrace` | `[annotation, body]` |

Type `overbrace` / `위중괄호` or `underbrace` / `아래중괄호`. The annotation is edited first; Tab moves into the body. Wrapping a selection preserves it in the body and focuses the empty annotation. Both slots allow nested math. The brace stretches across the body/annotation container. Backspace immediately after the structure unwraps its contents; Undo restores the structure.

The parser accepts a bare brace body and creates an empty annotation. Export always includes the corresponding `^{…}` or `_{…}`, including an empty annotation. Repeated annotation markers fail. An opposite-side script is handled as an outer ordinary script, not a second brace annotation. Slot order is annotation then body even for underbraces; this matches overset/underset. This workspace addition retains document version 1; older consumers must reject unknown structure kinds during validation.

## Additional accents (workspace)

| Syntax | Model / appearance | Search |
| --- | --- | --- |
| `\tilde{x}` | `tilde`, fixed-width centered wave | `tilde`, `물결악센트` |
| `\bar{x}` | `bar`, short centered line | `bar`, `짧은윗줄` |
| `\dot{x}` | `dot`, one centered dot | `dot`, `위점` |
| `\ddot{x}` | `ddot`, two dots | `ddot`, `두점` |
| `\widehat{AB}` | `widehat`, body-width hat | `widehat`, `넓은모자` |
| `\widetilde{AB}` | `widetilde`, body-width wave | `widetilde`, `넓은물결` |

Each is a structure with a unique `id` and exactly one MathRow in `slots: [body]`. Empty and nested bodies are supported, including scripts and fractions. Import preserves the command spelling; export emits the same command with a braced body. Selection wrapping retains the original expression. Tab continues outside; Backspace after the wrapper preserves its body, and Undo restores it. `dot` can also match a multiplication symbol: choose Dot accent explicitly or search `위점`. `bar` remains distinct from the existing body-width `overline`. These additions are in 0.2.0 and do not evaluate derivatives or estimates.

## Limit variants and placement (workspace)

`\limsup_{n}{x}` and `\liminf_{n}{x}` use `limsup` / `liminf` structures with exactly `[condition, body]` rows. Search `limsup` / `상극한` or `liminf` / `하극한`; Tab moves from condition to body. They do not evaluate sequence limits.

All limit-family, sum/product and integral nodes accept a single `\limits` or `\nolimits` immediately after the command, before scripts. The optional `limits` field is now boolean: omitted means default, `true` is stacked placement, `false` is side placement. Both explicit values survive JSON validation, copying and LaTeX export. Repeated/conflicting directives are rejected. Existing `limits: true` remains valid; older package builds do not accept `false` or the new limit kinds.

Placement is currently selected through imported LaTeX/model metadata, not a dedicated toolbar switch. Imported side conditions remain editable; normal limit suggestions use default placement. This is 0.2.0 functionality.

## Fine mathematical spacing (workspace)

| LaTeX | Node type | Width | Suggestion search |
| --- | --- | --- | --- |
| `\,` | `thinSpace` | 3mu / 1⁄6em | `thinspace`, `얇은간격` |
| `\:` | `mediumSpace` | 4mu / 2⁄9em | `mediumspace`, `중간간격` |
| `\;` | `thickSpace` | 5mu / 5⁄18em | `thickspace`, `두꺼운간격` |
| `\!` | `negativeThinSpace` | −3mu / −1⁄6em | `negativethinspace`, `간격줄이기` |

All four nodes have a unique ID and `slots: []`, like quad/qquad. Import/export preserve the exact command; ordinary source whitespace is still normalized. Insertion resumes immediately after the spacer. Backspace removes it and Undo restores it. Negative spacing uses a zero-width node with negative inline-end margin, not an overlay that intercepts pointer input. Click the adjoining text to edit; the spacer has no text slot. Plain punctuation remains literal and is not a spacing trigger.

Editor dimensions scale in script/limit slots. These are explicit gaps added to the editor's own token clearance, not a complete TeX math-glue or script-style suppression engine. Arbitrary dimensions (`\hspace`, `\kern`) and rubber-glue stretch/shrink remain unsupported. This is 0.2.0 functionality.

## Explicit sizes (0.2.0)

`\dfrac`, `\tfrac`, `\dbinom` and `\tbinom` can be imported and edited without losing their size choice on export. Type `dfrac`, `tfrac`, `dbinom` or `tbinom` and select the matching suggestion, then edit the two slots with Tab. See [JSON size mapping](LATEX-MODEL.md#explicit-fraction-and-binomial-sizes--workspace). General `\displaystyle` and `\textstyle` declarations remain unsupported.

## Mathematical alphabets — 0.2.0

| Input | Model kind | Editable slots | Intended glyph coverage |
| --- | --- | --- | --- |
| `\mathbf{Ax+2}` | `bold` | One math body | Bold upright Latin letters and numerals |
| `\mathcal{ABC}` | `calligraphic` | One math body | Calligraphic Latin capitals |
| `\mathbb{ABH}` | `blackboard` | One math body | Double-struck Latin capitals |

Type `mathbf`, `mathcal` or `mathbb` and select the suggestion, or import the LaTeX command. These structures can also wrap a selected expression. Their bodies remain math rows: fractions, scripts and nested font groups remain editable. Export preserves the scoped command. Existing single `\mathbb{N}`, `Z`, `Q`, `R`, `C` imports retain the previous Unicode-symbol normalization; multi-letter inputs use a `blackboard` structure.

The editor bundles KaTeX Main Bold, Caligraphic and AMS font faces with the existing MIT license. Decorative faces are limited to Latin capitals; other characters use fallback glyphs and are not claimed to match every KaTeX alphabet substitution. Semantic token colors remain visible. This does not add `\boldsymbol`, `\mathfrak`, arbitrary font declarations or mixed math inside literal `\text`.

## Labeled arrows — 0.2.0

| LaTeX | Model kind | `slots[0]` | `slots[1]` |
| --- | --- | --- | --- |
| `\xrightarrow[below]{above}` | `xrightarrow` | Upper label | Lower label |
| `\xleftarrow[below]{above}` | `xleftarrow` | Upper label | Lower label |

Both slots are math rows, including an empty lower row when the optional argument is absent. The exporter omits `[below]` when the lower label is empty, and always emits the upper `{above}` argument. Nested fractions and scripts stay editable. An unfinished optional bracket rejects the complete import without applying a partial document.

Type `xrightarrow`, `xleftarrow`, or search for “labeled arrow” / “설명화살표” in suggestions. Enter applies the candidate; edit the upper label, then Tab to the lower label. The shaft expands to fit the longer label while its arrowhead keeps a fixed size. Empty slots retain an editing affordance. This is a dedicated two-label arrow, distinct from ordinary arrow symbols and generic `overset` annotations. Other extensible arrow commands (`\xleftrightarrow`, harpoons, etc.) remain unsupported.

## Unnumbered equation wrapper — workspace

`\begin{equation*} ... \end{equation*}` imports its body into the existing root math row. It creates no new node kind and adds no suggestion item. Export emits the body without the environment wrapper. Nested supported structures remain editable. Missing/mismatched endings and unsupported commands fail atomically.

Numbered `equation`, `\tag` and `\label` are not supported: the model cannot preserve numbering or references. Use `equation*` only when formula-only import is intended. `align`, `split` and `array` remain open.
