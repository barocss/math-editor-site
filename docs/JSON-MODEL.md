# JSON model specification — version 1

This document defines the persisted `MathDocument` used by math-editor. The TypeScript declarations live in `src/model.ts`; external JSON is checked by `parseMathDocument` in `src/document-codec.ts`, using the structural validator in `src/range.ts`.

This is a **presentation tree**: it records how a formula is arranged and edited. It is not an algebraic expression tree. For example, `a+b` is text, not an `Add` operation. For syntax conversion, see [LaTeX → JSON mapping](LATEX-MODEL.md). This specification describes version 0.2.0, including validated JSON and bounded LaTeX import.

## 1. Document envelope

| Field | Required | JSON type | Contract |
|---|---|---|---|
| `version` | Yes | Number | Exactly `1`, not the package version and not the string `"1"` |
| `root` | Yes | `MathRow` object | The first top-level formula line; always exists, even for an empty formula |
| `additionalLines` | No | Array of `MathRow` objects | Second and subsequent top-level lines, in display order; omit when unused |

A document is always an object, not a bare node or array. All rows and nodes are embedded objects; IDs are addresses, not references that replace the objects.

```ts
interface MathDocument {
  version: 1;
  root: MathRow;
  additionalLines?: MathRow[];
}
```

Minimal valid empty document:

```json
{
  "version": 1,
  "root": {
    "id": "row-root",
    "children": [{ "type": "text", "id": "text-root", "text": "" }]
  }
}
```

`root: null`, `children: []` and a missing `root` are invalid. `additionalLines: []` is accepted and omitted from the validated return value. `additionalLines: null` is invalid.

## 2. Rows and child ordering

| Field | Required | JSON type | Contract |
|---|---|---|---|
| `id` | Yes | String | Unique throughout this document, including both rows and nodes |
| `children` | Yes | Nonempty array of `MathNode` | Left-to-right formula content |

```ts
interface MathRow {
  id: string;
  children: MathNode[];
}

type MathNode = MathText | MathStructure;
```

A row has **no `type` field**. The root, each additional line and every structure slot all use this same row shape.

The first and last children must be text nodes. Every structure must have a text sibling immediately before and after it. Examples of child sequences:

| Sequence | Valid? | Reason |
|---|---|---|
| `text` | Yes | Empty or ordinary text-only row |
| `text → fraction → text` | Yes | Both outside caret boundaries exist |
| `text → root → text → superscript → text` | Yes | Text separates structures |
| `text → text` | Accepted | The validator permits adjacent text; generated edits normally merge them |
| `fraction → text` | No | Missing initial text boundary |
| `text → fraction` | No | Missing final text boundary |
| `text → fraction → root → text` | No | Missing text between structures |

Empty text nodes are meaningful **caret positions**, not padding. Do not delete them to reduce JSON size. `text: ""` differs from `text: " "`: the latter contains an actual space that exports as an escaped LaTeX space.

## 3. Text nodes

| Field | Required | JSON type | Contract |
|---|---|---|---|
| `type` | Yes | String | Exactly `"text"` |
| `id` | Yes | String | Unique document address |
| `text` | Yes | String | Actual characters, including empty text and Unicode symbol glyphs |

```ts
interface MathText {
  type: 'text';
  id: string;
  text: string;
}
```

| Formula content | Stored text | Not stored |
|---|---|---|
| A variable | `"x"` | No variable declaration, inferred type or value |
| A number | `"123"` | No numeric JSON value; do not write `text: 123` |
| A symbol | `"α"`, `"≤"`, `"ℝ"` | No LaTeX command name or translation key |
| An ordinary expression | `"a+b"` | No implicit addition node |
| A visible brace | `"{"` | No invisible LaTeX grouping |

Variable/number/symbol colors are derived by tokenization at render time. They are not distinct JSON node types. Storing `"\\alpha"` in a text node means literal backslash text; use `parseLatex` when the source is LaTeX.

## 4. Structures and exact slot order

Ordinary structures require `type`, `id` and `slots`. Every slot is a complete `MathRow`, never a string, nullable value or node ID. Slot counts are exact, including empty slots.

| `type` | Exact slots | `slots[0]` | `slots[1]` | `slots[2]` |
|---|---:|---|---|---|
| `fraction` | 2 | Numerator | Denominator | — |
| `root` | 1 | Radicand | — | — |
| `vec`, `hat`, `overline` | 1 | Accented body | — | — |
| `quad`, `qquad` | 0 | — | — | — |
| `roman` | 1 | Upright math body | — | — |
| `limit` | 2 | Approach condition | Expression body | — |
| `binomial` | 2 | Upper term (n) | Lower term (k) | — |
| `indexedRoot` | 2 | Root index | Radicand | — |
| `textGroup` | 1 | Literal text row | — | — |
| `operatorName` | 1 | Literal operator name row | — | — |
| `superscript` | 2 | Base | Exponent | — |
| `subscript` | 2 | Base | Subscript | — |
| `scripts` | 3 | Shared base | Subscript | Superscript |
| `parentheses` | 1 | Enclosed content | — | — |
| `brackets` | 1 | Enclosed content | — | — |
| `absolute` | 1 | Enclosed content | — | — |
| `sum` | 3 | Lower limit | Upper limit | Body |
| `product` | 3 | Lower limit | Upper limit | Body |
| `integral` | 3 | Lower limit | Upper limit | Body |

The lower limit comes **before** the upper limit in JSON, regardless of visual position. `root` means square root. `indexedRoot` has exactly two slots: index first, then radicand. An empty index remains an editable slot; Backspace in that empty slot converts the node to `root` and preserves the radicand. `scripts` stores both scripts on one base; slot order is base, lower, upper. Tab follows that order. Empty script slots remain editable; Backspace in an empty script removes that side and converts the node to `superscript` or `subscript`.

The following type makes the runtime slot rules explicit. The source TypeScript API currently uses the looser `MathRow[]`; runtime validation enforces these counts.

```ts
type OrdinaryStructure =
  | { type: 'quad' | 'qquad'; id: string; slots: [] }
  | { type: 'braces' | 'angle' | 'openClosed' | 'closedOpen' | 'roman' | 'root' | 'parentheses' | 'brackets' | 'absolute' | 'vec' | 'hat' | 'overline' | 'textGroup' | 'operatorName';
      id: string; slots: [MathRow] }
  | { type: 'overset' | 'underset' | 'fraction' | 'limit' | 'binomial' | 'superscript' | 'subscript' | 'indexedRoot';
      id: string; slots: [MathRow, MathRow] }
  | { type: 'sum' | 'product' | 'integral' | 'doubleIntegral' | 'scripts';
      id: string; slots: [MathRow, MathRow, MathRow] };

type MathStructure = OrdinaryStructure | MathMatrix | MathEquationGrid;
```

Slots can contain nested structures using the same child ordering rules. A fraction denominator can therefore contain a square root without a new node format.

## 5. Grids: matrices, alignment and cases

| Field | Matrix | Aligned / cases |
|---|---|---|
| `type` | `"matrix"` | `"aligned"` or `"cases"` |
| `id` | Required unique string | Required unique string |
| `columns` | Required integer, 1–20 | Required integer, exactly `2` |
| `slots` | Required flat array of cell rows | Required flat array of cell rows |
| `environment` | Required allowed string below | Not part of these node types |

```ts
type MatrixEnvironment =
  | 'matrix' | 'pmatrix' | 'bmatrix'
  | 'Bmatrix' | 'vmatrix' | 'Vmatrix';

interface MathMatrix {
  type: 'matrix';
  id: string;
  columns: number;
  environment: MatrixEnvironment;
  slots: MathRow[];
}

interface MathEquationGrid {
  type: 'aligned' | 'cases';
  id: string;
  columns: 2;
  slots: MathRow[];
}
```

| Environment | Matrix delimiters |
|---|---|
| `matrix` | None |
| `pmatrix` | Parentheses |
| `bmatrix` | Square brackets |
| `Bmatrix` | Braces |
| `vmatrix` | Single vertical bars |
| `Vmatrix` | Double vertical bars |

Rows are not stored as another matrix array. For zero-based cell coordinates `(r, c)`, the slot index is `r * columns + c`. The row count is `slots.length / columns`. A valid grid has 1–20 rows; slot count must be a positive multiple of `columns`.

For `aligned`, left/right cells are arbitrary formula rows: an equals sign must be stored explicitly in the appropriate text. For `cases`, each pair is value then condition. The node does not evaluate the condition.

Complete 2×2 identity-matrix document:

```json
{
  "version": 1,
  "root": {
    "id": "r0",
    "children": [
      { "type": "text", "id": "before", "text": "" },
      {
        "type": "matrix",
        "id": "matrix0",
        "columns": 2,
        "environment": "bmatrix",
        "slots": [
          { "id": "r00", "children": [{ "type": "text", "id": "t00", "text": "1" }] },
          { "id": "r01", "children": [{ "type": "text", "id": "t01", "text": "0" }] },
          { "id": "r10", "children": [{ "type": "text", "id": "t10", "text": "0" }] },
          { "id": "r11", "children": [{ "type": "text", "id": "t11", "text": "1" }] }
        ]
      },
      { "type": "text", "id": "after", "text": "" }
    ]
  }
}
```

Identity matrices, zero matrices, vectors and formula templates do not have template node types or template IDs in the saved model. They produce ordinary editable cells/structures.

## 6. Multiple lines versus nested rows

```json
{
  "version": 1,
  "root": {
    "id": "line1",
    "children": [{ "type": "text", "id": "text1", "text": "a=b" }]
  },
  "additionalLines": [
    {
      "id": "line2",
      "children": [{ "type": "text", "id": "text2", "text": "c=d" }]
    }
  ]
}
```

This has two top-level lines and exports as `gathered`. A two-row matrix inside `root` still has only one top-level line. Inline mode forbids `additionalLines` containing rows; it does not forbid a matrix or cases node in the root. There is no `line`, `gathered` or line-number JSON node.

## 7. IDs, state and persistence

- IDs must be unique across all row and node objects within a document. They are opaque strings, not paths, source offsets or content hashes.
- Use library constructors/transformations to create IDs. Preserve IDs when saving and reopening the same tree; separate imports and pasted fragments receive fresh IDs.
- The current validator checks string type and uniqueness, but does not enforce UUID syntax or nonempty IDs. Producers should generate nonempty IDs and must not depend on a particular format.
- `MathDocument` does not contain selection, focus, undo history, locale, toolbar settings, pixel sizes or the original LaTeX source.

| Object | Purpose | Part of persisted `MathDocument`? |
|---|---|---|
| `MathCaret` | Text node `id`, UTF-16 `start`/`end`, optional affinity | No |
| `MathState` | `{ document, caret }` while editing | No; save its `document` |
| `MathRange` | Structural selection endpoints | No |
| `MathHistory` | Past/present/future editing states | No |
| `MathFragment` | Clipboard `{ version: 1, rows: MathRow[] }` | No; different envelope from a document |
| Host `tex` / `mathDocument` attributes | Product-specific storage container | No; the host may store serialized document JSON alongside derived LaTeX |

The model version is independent of npm versioning. Version 1 has no automatic migration from unknown future versions. Reject unsupported versions rather than guessing their structure.

## 8. Validation and limits

```ts
import { parseMathDocument, toLatex } from '@barocss/math-editor/core';

const document = parseMathDocument(savedJson);
if (document) {
  session.load(document); // Deliberately resets session history.
  const latex = toLatex(document);
} else {
  // Keep existing content and report invalid saved data.
}
```

`parseMathDocument` returns a validated document or `undefined`; it does not return a diagnostic list. `parseLatex` has its own success/error result. Neither function mutates an editor.

| Check | Current bound / rule |
|---|---|
| Serialized input | At most 200,000 UTF-16 code units; not a byte limit |
| Structural validation envelope | The derived clipboard-shaped JSON must also fit the 200,000-unit bound |
| Top-level rows | 1–200, counting root |
| Nesting | Root row depth is 0; each descent into a structure slot adds 1; at most 40 |
| Object count | At most 10,000 row + node objects, including empty text boundaries |
| Grid dimensions | 1–20 rows and columns; aligned/cases require 2 columns |
| Node types and arity | Only listed types and exact slot counts |
| IDs | String type and uniqueness across the document |
| Text | String type; empty strings allowed |

The validator is **not a general metadata sanitizer**. Unknown properties are currently tolerated: the returned document envelope keeps only `version`, `root` and nonempty `additionalLines`, while nested row/node extras can remain. Extra properties have no defined semantics or preservation guarantee. Store application metadata outside this tree; do not use them to extend model behavior.

## 9. Invalid forms to avoid

| Invalid form | Correct representation |
|---|---|
| `root: [ ... ]` | `root: { id, children: [...] }` |
| `slots: ["a", "b"]` | Two embedded row objects, each with text children |
| `type: "variable"` or `type: "number"` | `type: "text"`, with a string value |
| `rows: [[a, b], [c, d]]` on a matrix | Flat `slots` plus `columns` |
| One missing sum limit | Keep the slot and give it an empty text row |
| Reused row ID as a text node ID | Generate different IDs for both objects |
| A structure without surrounding text | Add empty text boundaries |
| `version: "1"` | Numeric `version: 1` |

Use the [LaTeX mapping](LATEX-MODEL.md) for complete fraction and nested-expression examples, and [support scope](SUPPORT.md) for the corresponding editor features.


## Literal text and operator-name nodes (workspace)

Both use the ordinary `{ type, id, slots }` structure shape with exactly one slot. Every child of that slot must be a `MathText`; nested structures are invalid. `textGroup` preserves text such as `"if x > 0"` and exports `\text{if x > 0}`. `operatorName` stores the name, for example `"sin"`, and exports `\sin `; a custom name exports `\operatorname{custom}`. Neither node stores an argument or evaluates a function. The following argument is a sibling in the containing math row. A superscript can wrap the entire operator-name node.

Literal slots remain one editable input in React, including whitespace and punctuation. They do not trigger math suggestions. Escaping is applied during LaTeX export, not stored in `MathText.text`.

Accents store one complete math row in `slots[0]`. The mark is determined by the structure type and is never stored as a combining character in the body text. Unwrapping preserves that row. Slanted relation glyphs `⩾` and `⩽` remain ordinary symbol text.

### Explicit spacing, roman style and limit placement (workspace)

`quad` and `qquad` are zero-slot structures: `{ type: "quad", id: "…", slots: [] }`. They represent one and two em of math spacing. They still have surrounding text caret nodes, and can be copied, deleted and undone as model content. They are distinct from ordinary whitespace and empty caret hit areas.

`roman` has one editable math row and exports `\mathrm{…}`. Unlike `textGroup`, its content remains mathematical, with nested structures and mathematical whitespace rules. A parsed `\rm` declaration becomes a `roman` group that ends at the containing group or cell boundary.

The limit family (`limit`, `limsup`, `liminf`), sum/product and all supported integral kinds may carry optional boolean `limits`. Omitted means default placement, `true` preserves `\limits`, and `false` preserves `\nolimits`. Other values or node kinds are rejected. The directive is emitted immediately after the operator command. Existing `true` data remains valid; older builds reject the new `false` value.

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

The generic fence shape is `{ type: "fenced", id, slots: [body], left, right }`. `left` and `right` each use the physical-end set above. If supplied, both must be valid and may only appear on a `fenced` node. If omitted together, the pair defaults to `(` and `)`. The named preset nodes do not carry this metadata. Annotation slot order follows LaTeX argument order, not the visual top-to-bottom order of `underset`.


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
