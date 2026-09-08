# LaTeX to JSON model mapping

See the [JSON model specification](JSON-MODEL.md) for required fields, exact slot order, invariants and persistence limits.


This is the conversion reference for the **0.2.0 loader**. Read [LaTeX support](LATEX-SCOPE.md) for accepted syntax, exclusions and limits. This document explains the JSON produced by `parseLatex`, not KaTeX's internal tree.

## Data model at a glance

| JSON object | Fields | Meaning |
|---|---|---|
| `MathDocument` | `version: 1`, `root`, optional `additionalLines` | One formula document with one or more top-level rows |
| `MathRow` | `id`, `children` | Ordered sequence of text and structures; also used for every editable slot |
| `MathText` | `type: "text"`, `id`, `text` | Literal characters, including normalized symbol glyphs |
| Ordinary structure | `type`, `id`, `slots` | Structure-specific ordered rows |
| Matrix | `type: "matrix"`, `id`, `slots`, `columns`, `environment` | Rectangular cells in row-major order with delimiter style |
| Equation grid | `type: "aligned"` or `"cases"`, `id`, `slots`, `columns: 2` | Two cells per visual row |

Every row starts and ends with a text node. Structures have text boundaries on both sides, even when the text is empty. These empty strings provide editable positions before, after and between structures; they are not visible spaces and must not be removed from persisted documents.

IDs address rows and caret positions. Each import creates fresh IDs. The JSON examples below replace generated IDs with short labels for readability.

## Syntax-to-node table

`row("x")` below is shorthand for a real `MathRow` containing one `MathText`. It is explanatory notation, not a JSON field or serialized function.

| LaTeX input | JSON node / document field | Ordered slot meaning | Canonical export |
|---|---|---|---|
| `abc123` | `text`, `text: "abc123"` | No slots | `abc123` |
| `\alpha + \beta` | `text`, `text: "α+β"` | Symbols become catalog glyphs | `\alpha +\beta ` |
| `\mathbb{R}` or `\mathbb R` | `text`, `text: "ℝ"` | Blackboard set symbol | `\mathbb{R} ` |
| `\neq` | `text`, `text: "≠"` | Alias normalizes to one glyph | `\ne ` |
| `\text{if x > 0}` | `textGroup` | `[0]` literal-only row | `\text{if x > 0}` |
| `\sin`, `\operatorname{custom}` | `operatorName` | `[0]` editable literal name; argument is a sibling | `\sin `, `\operatorname{custom}` |
| `\frac{a}{b}` | `fraction` | `slots[0]` numerator; `[1]` denominator | `\frac{a}{b}` |
| `\sqrt{x}` | `root` | `[0]` radicand | `\sqrt{x}` |
| `\\lim_{x\\to 0}{x}` | `limit` | `[0]` approach condition; `[1]` body | `\\lim_{x\\to 0}{x}` |
| `\\binom{n}{k}` | `binomial` | `[0]` upper term; `[1]` lower term | `\\binom{n}{k}` |
| `\sqrt[3]{x}` | `indexedRoot` | `[0]` index; `[1]` radicand | `\sqrt[3]{x}` |
| `\vec{x}`, `\hat{x}`, `\overline{AB}` | `vec`, `hat`, `overline` | `[0]` editable body | Same command with the exported body |
| `\geqslant`, `\leqslant` | `text` containing `⩾` or `⩽` | No slots | Original command preserved |
| `(a+b)^2` | `superscript` with a `parentheses` base | Entire balanced parenthesis is the base | `{\left(a+b\right)}^{2}` |
| `x^2`, `x^{2}` | `superscript` | `[0]` base; `[1]` exponent | `{x}^{2}` |
| `x_i`, `x_{i}` | `subscript` | `[0]` base; `[1]` subscript | `{x}_{i}` |
| `x_i^2`, `x^2_i` | `scripts` | `[0]` shared base; `[1]` subscript; `[2]` superscript | `{x}_{i}^{2}` |
| `{x_i}^{2}` | `superscript` containing `subscript` in its base | Outer base contains the entire inner structure | `{{x}_{i}}^{2}` |
| `\left(x\right)` | `parentheses` | `[0]` enclosed row | `\left(x\right)` |
| `\left[x\right]` | `brackets` | `[0]` enclosed row | `\left[x\right]` |
| `\left\vert x\right\vert` | `absolute` | `[0]` enclosed row | `\left\vert x\right\vert` normalizes to literal vertical delimiters after left/right |
| `\sum_{i=1}^{n}{x}` | `sum` | `[0]` lower limit; `[1]` upper limit; `[2]` body | `\sum_{i=1}^{n}{x}` |
| `\prod_{i=1}^{n}{x}` | `product` | `[0]` lower; `[1]` upper; `[2]` body | `\prod_{i=1}^{n}{x}` |
| `\int_{0}^{1}{x}` | `integral` | `[0]` lower; `[1]` upper; `[2]` body | `\int_{0}^{1}{x}` |
| `\begin{bmatrix}a&b\\c&d\end{bmatrix}` | `matrix`, `columns: 2`, `environment: "bmatrix"` | `[a, b, c, d]`, each cell a row | Same environment, normalized separators |
| `\begin{aligned}a&=b\\c&=d\end{aligned}` | `aligned`, `columns: 2` | `[a, =b, c, =d]`; equals signs remain text | Same environment |
| `\begin{cases}x&x>0\\0&x=0\end{cases}` | `cases`, `columns: 2` | `[value1, condition1, value2, condition2]` | Same environment |
| `\begin{gathered}a\\b\end{gathered}` | `root: row("a")`, `additionalLines: [row("b")]` | No `gathered` structure node | `gathered` when there is more than one top-level row |
| `{}^{\circ}` | `text`, `text: "°"` | Degree catalog glyph | `{}^{\circ} ` |
| `\{x\}` | `text`, `text: "{x}"` | Escaped braces are visible characters | `\{x\}` |
| `{a+b}` | Contents flattened into the containing row | Grouping alone does not create visible parentheses | `a+b` |
| `$x$`, `\(x\)` | Same document as `x` | Outer wrapper is not saved in the model | `x` |

All six matrix environments share the `matrix` node: `matrix`, `pmatrix`, `bmatrix`, `Bmatrix`, `vmatrix`, `Vmatrix`. Only the `environment` field changes.

## A complete fraction example

Input:

```latex
\frac{a}{b}
```

Actual parser output shape, with IDs relabeled:

```json
{
  "version": 1,
  "root": {
    "id": "root",
    "children": [
      { "type": "text", "id": "before", "text": "" },
      {
        "type": "fraction",
        "id": "fraction",
        "slots": [
          {
            "id": "numerator-row",
            "children": [{ "type": "text", "id": "numerator-text", "text": "a" }]
          },
          {
            "id": "denominator-row",
            "children": [{ "type": "text", "id": "denominator-text", "text": "b" }]
          }
        ]
      },
      { "type": "text", "id": "after", "text": "" }
    ]
  }
}
```

The root boundaries allow typing before and after the fraction. The numerator and denominator each have their own row and text address. Editing the numerator changes `slots[0].children[0].text`; the exporter recursively reads those slots. There is no hidden LaTeX string inside the fraction node.

## Binding and nested structures

| Input | Result | Why |
|---|---|---|
| `ab^2` | Text `a`, then a superscript whose base is `b` | An unbraced base is one atom |
| `{ab}^2` | One superscript whose base row contains text `ab` | Braces collect the base |
| `\sqrt{x^2}` | Root → radicand row → superscript | Each slot can contain another structure |
| `{x_i}^{2}` | Superscript → base row → subscript | Explicit nesting is preserved |
| `x_i_i` | Failure, no document | Repeated scripts require explicit grouping |

A row can contain several structures. For example, `\frac{a}{b}+x^2` has the sequence `empty text → fraction → text "+" → superscript → empty text`. Text nodes between structures can hold operators and other ordinary characters.

## Matrix and line addressing

For a matrix with `columns: C`, cell `(rowIndex, columnIndex)` is `slots[rowIndex * C + columnIndex]`. Indices are zero-based.

| Cell in a 2×2 matrix | Slot index | Example text |
|---|---|---|
| First row, first column | `slots[0]` | `a` |
| First row, second column | `slots[1]` | `b` |
| Second row, first column | `slots[2]` | `c` |
| Second row, second column | `slots[3]` | `d` |

A blank cell is still a row containing an empty text node. Matrix and aligned rows must have consistent cell counts. A cases row may omit its condition; the loader adds an empty condition cell. `aligned` and `cases` use the same indexing with exactly two columns. Top-level `gathered` lines instead become `root` and `additionalLines`; line numbers are UI-only.

## What is normalized, and what is not stored

| Concern | Behavior |
|---|---|
| Variables, numbers, symbols | All are stored in `MathText.text`. Token colors/roles are derived by the renderer, not separate variable/constant AST nodes |
| Spaces and comments | Ordinary LaTeX formatting whitespace/comments are discarded; an explicit escaped space becomes a text space |
| Command aliases | Different accepted spellings map to the same glyph/structure and export canonically |
| Invisible braces | Group the argument/base; no standalone brace node is stored |
| Original source | `result.source` preserves it for the caller; `MathDocument` does not store it |
| Selection and undo | Belong to editor state/session, not the document JSON |
| Mathematical meaning | This is a presentation tree, not a computer-algebra AST; no evaluation, simplification or variable binding |
| Unsupported commands | No opaque or partial node is created; the entire import fails with source offsets |

## Product integration rule

Parse once through `/core`; do not create Note-specific or framework-specific LaTeX mappings. Use `session.importLatex` or the rich React import handle for undoable replacement. Save a validated `MathDocument` and derive LaTeX with `toLatex`. If a host also stores source, changing it directly must invalidate stale structure.

The mapping is guarded by symbol/template fixtures and all nested pairs of supported structure kinds. A new model node must add its slot contract, importer, exporter and editor tests together. See [implementation](IMPLEMENTATION.md), [support](SUPPORT.md) and [validation](VALIDATION.md).

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

All structured fences scale with their contents. Short angle notation normalizes to scalable `\left\langle…\right\rangle` on export. Supported physical ends are `(`, `)`, `[`, `]`, `{`, `}`, `⟨`, `⟩`, `|` and `.`. Plain punctuation stays literal unless imported with a structural command. Double norm bars, `\big`/`\Big` remain unsupported; brace annotations are implemented in the workspace.


### Double integrals (workspace)

`\iint_R f(x,y)` imports as `doubleIntegral` with exactly three slots: `[lower/domain, upper, body]`, matching integral navigation. Missing bounds remain editable empty slots. `\iint\limits` preserves the explicit placement directive. Export uses `\iint_{lower}^{upper}{body}`. Search `iint`, `이중적분` or `∬` to insert; Tab visits the domain, upper bound and body in order. The reported expression with `\rm dx \rm dy`, `\xi`, `\eta` and `\text{Area}` is covered by import/round-trip and browser editing fixtures. This is notation support, not numerical integration. Triple and contour integrals are now implemented in the workspace; see the section below.

### Norm node (workspace)

| Field / input | Contract |
| --- | --- |
| `type` | `"norm"` |
| `id` | Unique structure ID |
| `slots` | Exactly one MathRow: `[body]`; nested math and empty content allowed |
| LaTeX aliases | `\lVert…\rVert`, `\left\|…\right\|`, `\left\Vert…\right\Vert` |
| Canonical export | `\left\Vert …\right\Vert ` |
| Generic fence metadata | `"‖"` is also a valid independent `left` / `right` value for `fenced` |

The document version remains 1. Older package builds do not understand this workspace node; validate saved documents against the consuming package's supported kinds.

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

## Explicit fraction and binomial sizes — workspace

| LaTeX | JSON `type` | `mathStyle` | Slots |
| --- | --- | --- | --- |
| `\frac{a}{b}` | `fraction` | Omitted | Numerator, denominator |
| `\dfrac{a}{b}` | `fraction` | `"display"` | Numerator, denominator |
| `\tfrac{a}{b}` | `fraction` | `"text"` | Numerator, denominator |
| `\binom{n}{k}` | `binomial` | Omitted | Upper term, lower term |
| `\dbinom{n}{k}` | `binomial` | `"display"` | Upper term, lower term |
| `\tbinom{n}{k}` | `binomial` | `"text"` | Upper term, lower term |

The parser, validated JSON, copy/paste and exporter preserve this optional field. It is valid only on `fraction` and `binomial`; other values or node kinds are rejected. Omission retains the ordinary structure behavior. Nested explicit sizes override the enclosing explicit size.

Both editing surfaces use larger display operands (22 px) and smaller text operands (16 px), retaining editable scripts and slots. This is a bounded editing presentation, not a complete TeX style cascade; `\displaystyle`, `\textstyle` and script-style declarations remain unsupported. KaTeX controls the final exported formula's typesetting.

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
