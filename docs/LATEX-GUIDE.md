# Writing and editing LaTeX

This guide describes **version 0.2.0**, including bounded LaTeX import and editable notation. See [installation and API guides](README.md) for package usage and [the support contract](LATEX-SCOPE.md) for the exact grammar.

Start with [practice exercises](GETTING-STARTED.md), [copy and paste](CLIPBOARD.md), or the [keyboard reference](KEYBOARD.md).

## Load and edit a formula

In the demo, open **Import LaTeX**, enter a supported expression and apply it. Click a displayed slot to edit it. A successful import is undoable; a failed import preserves the existing formula and returns diagnostics.

For a session-based integration:

```ts
import { createMathSession } from '@barocss/math-editor/core';

const session = createMathSession();
const result = session.importLatex(String.raw`\log_{2}x + x_i^2`);
if (!result.ok) {
  console.log(result.diagnostics);
}
```

React's rich editor exposes the same operation through `apiRef`; see [React](API-REACT.md). Vue, Svelte, Solid, Web Component and native React surfaces share the [session API](API-SESSION.md).

Typing LaTeX into an ordinary editor slot is not the same as importing it. Use the import API for complete source expressions. Ordinary clipboard text is inserted literally; structured editor clipboard data preserves model nodes.

## Expressions you can try now

| Expression | Editable parts | Important behavior |
|---|---|---|
| `\frac{a+b}{c}` | Numerator and denominator | Select existing math and choose Fraction to make it the numerator |
| `\sqrt{x+1}` | Radicand | Square root; use indexed-root notation for an explicit index |
| `\sqrt[3]{x}` | Index and radicand | Tab moves from index to radicand; empty-index Backspace keeps a square root |
| `\vec{x}`, `\hat{x}`, `\overline{AB}` | One editable body | Select math to wrap it; Tab out and Backspace to unwrap without losing content |
| `x_i^2` or `x^2_i` | Shared base, lower script, upper script | Both forms normalize to `{x}_{i}^{2}` |
| `{x_i}^2` | Nested script structures | Explicit grouping keeps nesting distinct from shared scripts |
| `\sin^2 x` | Function name, exponent, following `x` | The exponent belongs to the function name; the argument remains neighboring math |
| `\log_{2}x` | Function name, subscript and argument | The base is an editable script; no numerical evaluation |
| `\operatorname{custom}(x)` | Custom operator name and following math | A name outside the standard catalog exports with `operatorname` |
| `\text{if x > 0}` | One literal text slot | Spaces and punctuation are text, not structural shortcuts |
| `\begin{cases}x&\text{if x > 0}\\0&\text{otherwise}\end{cases}` | Expression/condition cells and text | Use text nodes for words inside conditions |
| `\begin{pmatrix}1&0\\0&1\end{pmatrix}` | Four cells | Tab changes cells; row/column operations preserve contents through Undo |
| `\begin{aligned}x&=1\\y&=2\end{aligned}` | Two columns per row | Enter the relation explicitly in the right column |
| `\begin{gathered}x=1\\y=2\end{gathered}` | Two top-level lines | Inline hosts reject multiple top-level lines |

## Type with suggestions

- In the 0.4.0 release, enter a matrix size as `rows x columns` without spaces. `2x1` creates two rows and one column, `1x2` creates one row and two columns, and `3x7` creates three rows and seven columns. Each dimension must be an integer from 1 to 20, without leading zeros. Uppercase `X` and `×` also work. Suggestions offer an empty matrix and a zero matrix; square sizes additionally offer an identity matrix. Enter accepts the highlighted candidate and focuses its first cell; Tab moves through cells in row order. Space or Escape keeps the original text. These are editor shortcuts, not LaTeX commands; accepted matrices export as the usual `bmatrix` environment.
- Type `nthroot`, `nroot` or `n제곱근` and choose Indexed root. Enter the index, press Tab, then enter the radicand. A selected expression can be wrapped; it becomes the radicand and the index receives focus.
- Type `text` or `텍스트`, choose Text and write the description. Tab returns to math input. Mathematical suggestions are disabled inside literal text.
- Type a function name such as `sin`, `cos`, `log` or `ln`, then select its suggestion. Accept the suggestion before typing the argument; plain `log` remains variable text until converted.
- Type `operatorname` to enter a custom upright function name. Tab moves to the argument position.
- After a function suggestion, choose an exponent or subscript to attach it to that function name.
- At the end of an existing lower script, type `^` and choose Exponent to add an upper script to the same base. The reverse works with `_` and Subscript.
- A symbol query can show a literal character first. For example, `/` offers division before Fraction. Use the candidate label or arrow keys to choose the structure you intend.

Standard function names: `sin`, `cos`, `tan`, `cot`, `sec`, `csc`, `arcsin`, `arccos`, `arctan`, `sinh`, `cosh`, `tanh`, `log`, `ln`, `exp`, `min`, `max`, `det`, `gcd`. These represent notation; they do not calculate values. Hosts can add translated search aliases through [locale JSON](LOCALIZATION.md).

## Select, replace and wrap

Drag across a formula to select a model range. The regular suggestion list offers fraction, root, superscript, subscript, parentheses, brackets and absolute value. Click a candidate, or use arrow keys and Enter. Compound bases receive parentheses when wrapped in an exponent.

With a nonempty math selection, these keys apply immediately without choosing a suggestion:

| Key | Result | Caret after wrapping |
| --- | --- | --- |
| `(` | Parentheses | After the closing parenthesis |
| `[` | Square brackets | After the closing bracket |
| `{` | Braces | After the closing brace |
| `\|` | Absolute value | After the closing bar |
| `/` | Fraction with selection as numerator | Empty denominator |
| `^` | Selection as the base of a power | Empty exponent |
| `_` | Selection as the subscript base | Empty subscript |

Compound power bases receive parentheses. Each wrap is one Undo step; subsequent typing is a separate edit. This works with mouse dragging, Shift+arrows and native input selections in React and DOM fields, including toolbar-free inline fields. The key handling is shared by the framework and host adapters through their renderer.

Other printable characters replace the selection. Without a selection, the existing suggestion behavior stays unchanged; `{` can still offer braces and cases. Literal text slots retain text input. Ctrl/Cmd/Alt combinations and IME composition are not structural shortcuts. Multi-line selections remain selected and unchanged when a wrapping key is pressed. Rectangular matrix-cell selection retains its own typing behavior.

Backspace/Delete removes the selection. Undo restores content. In combined scripts, Backspace in an empty script removes that side while retaining the other script.

## Text boundaries

`textGroup` and `operatorName` contain literal-only rows. Escape LaTeX special characters, for example `\text{a\_b costs \$2}`. Nested mathematical structures, styles and embedded `$...$` inside these text arguments are not supported. Do not use `\text` to hide unsupported math from the parser.

The editor retains structure and canonical notation, not the exact original source spelling. IDs, redundant groups, aliases and formatting whitespace can change after import/export. See [JSON model](JSON-MODEL.md) and [LaTeX-to-model mapping](LATEX-MODEL.md).

## What should be added next?

Norms, triple/contour integrals, brace annotations and additional accents are already supported. See the [current roadmap](ROADMAP.md#subsequent-milestones) for remaining work. New notation must keep the model, parser, keyboard editing and rendering aligned.

Each addition needs a documented JSON shape, import/export round trips, unsupported-input diagnostics, actual per-character typing, cursor movement, selection, deletion and Undo tests in both renderers. See [roadmap](ROADMAP.md) for progress and [validation](VALIDATION.md) for tested coverage.


## Cauchy–Schwarz example

This expression imports in the workspace, including `cdots`, shared scripts and the slanted relation:

```latex
(a_1^2 + a_2^2 + \cdots + a_n^2)(b_1^2 + b_2^2 + \cdots + b_n^2) \geqslant (a_1b_1 + a_2b_2 + \cdots + a_nb_n)^2
```

The final parenthesized expression is the base of the exponent. Its export uses `\left` / `\right`; the slanted relation remains `\geqslant`. The original source whitespace is normalized. Use the explicit LaTeX import control for this complete expression.

## Binomials and typing an operand first (workspace)

Type `binom`, `binomial`, `이항계수` or `조합`, then choose the binomial coefficient. Enter the upper term, press Tab and enter the lower term. `\binom{n}{k}` imports as two editable slots; exporting preserves the command. Nested fractions and scripts work in either term. Available in 0.2.0.

You can also type an operand first. Single variables, numbers and names without a command match offer parentheses, brackets, absolute value, root, fraction, scripts and binomial wrapping. For example, type `12`, click Parentheses, then type `+x`: the result is `\left(12\right)+x`. These actions preserve the operand instead of replacing it. Symbol matches remain above wrapping actions; full command names keep their existing search behavior.

Parentheses, brackets, absolute value and square root resume after the wrapped expression. Fraction and binomial move to the second term; exponent and subscript move to their new slot. Drag a range to wrap several terms. An operand-only menu requires an arrow key before Enter applies a choice; Enter alone keeps its normal newline/host behavior. Escape dismisses the menu. Undo restores the unwrapped input in one step.

## Limits (workspace)

Type `lim`, `limit` or `극한` and apply the suggestion. Enter the approach condition, press Tab, then enter the expression. For an arrow, type `->` and choose `→`. A typical export is `\lim_{x\to 0}{\frac{\sin x}{x}}`.

The model has two slots: condition first, expression second. LaTeX without a braced body consumes one following atom, as for sums and integrals; use braces to include a whole expression. Missing conditions or bodies remain empty editable slots. Backspace immediately after the structure removes its wrapper while retaining its contents; Undo restores it.

This supports `\lim`, not evaluation, upper limits, `\limsup`, `\liminf`, `\nolimits`. Explicit `\limits` is now supported. Function names and the `lim` glyph share a teal color; the condition and body retain their variable, number and symbol colors. Hosts can override `--me-function` on their editor element. All additions here are workspace-only until release.

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

Fence shortcuts: type `{` for braces, or `<` / `⟨` for angle brackets. The literal less-than symbol stays ahead of the angle-bracket action. Korean `꺽쇠` and `꺾쇠` both find angle brackets; `langle` is also accepted. Select the desired candidate with arrow keys and Enter, or click it.


Equation-only cases are supported in the workspace: `\begin{cases}ax+by=c\\dx+ey=f\end{cases}`. Each row may have one expression cell or two cells separated by `&`. The model always stores two cells per row; a missing condition becomes an editable empty cell. Export includes the `&` for that empty condition. More than two cells still fails validation.


### Double integrals (workspace)

`\iint_R f(x,y)` imports as `doubleIntegral` with exactly three slots: `[lower/domain, upper, body]`, matching integral navigation. Missing bounds remain editable empty slots. `\iint\limits` preserves the explicit placement directive. Export uses `\iint_{lower}^{upper}{body}`. Search `iint`, `이중적분` or `∬` to insert; Tab visits the domain, upper bound and body in order. The reported expression with `\rm dx \rm dy`, `\xi`, `\eta` and `\text{Area}` is covered by import/round-trip and browser editing fixtures. This is notation support, not numerical integration. Triple and contour integrals are now implemented in the workspace; see the section below.

Integral and double-integral bounds now sit beside the slanted glyph by default: the upper bound is offset farther right than the lower bound. An explicit `\limits` directive retains the stacked above/below layout. This presentation change preserves the existing lower/upper/body model and Tab order.

Arrow discovery now uses substring matching: `화살표` / `arrow` finds directional, double, diagonal, long, hook, harpoon and equilibrium arrows. There are 31 arrow symbols and 117 catalog symbols in total. Exact spellings rank ahead of partial matches, including case-sensitive LaTeX names. All additions share parsing, export, suggestions and the symbol browser.

Arrow punctuation shortcuts: `-` offers subtraction first, then arrow alternatives. `->` offers `→` first, followed by all 31 arrow symbols, including left/up/down/diagonal and equilibrium directions. Select a candidate to convert; ordinary typing such as `x-2` stays unchanged. Longer triggers such as `<->` and `-+` retain their own matches.

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

### KaTeX 0.16.28 limit-name preview compatibility

This KaTeX version expands limsup/liminf through starred operator names, whose HTML display layout can ignore explicit nolimits. The demo uses the following rendering-only definitions so conditions agree with the editor (default stacked, explicit nolimits beside the name):

```js
const macros = {
  '\\limsup': String.raw`\mathop{\mathrm{lim\,sup}}\limits`,
  '\\liminf': String.raw`\mathop{\mathrm{lim\,inf}}\limits`,
};
```

Pass these as the KaTeX `macros` option when using this renderer with the editor's default stacked layout. They do not change saved JSON or exported LaTeX. They also keep default bounds stacked in inline previews, matching this editor's current limit layout rather than TeX's automatic inline-style choice. The package itself does not require KaTeX.

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

## Keyboard ranges and brace discovery (0.2.1)

Shift+Left/Right extends or shrinks the same model range used by dragging. Structures are crossed as balanced units; copied and deleted ranges use existing model normalization. Shift+Up/Down extends to an adjacent top-level document line, using a logical text offset rather than pixel-based column matching; an active matrix-cell selection instead uses Shift+arrows to move its rectangular focus corner. Copy, cut, wrapping, deletion and Undo use the existing range behavior. IME composition and modifier shortcuts retain their existing handling.

Typing `{` offers both paired braces and cases. Paired braces remain the first candidate; choose Cases explicitly to insert its editable grid.

## Insert or adjust existing math — workspace

Use **Paste as LaTeX** in More tools, or **Alt+Shift+V**, to paste a source fragment at the current caret or selected range. Ctrl/Cmd+Enter inserts it; unsupported input stays in the source field with a diagnostic. Ordinary paste retains its existing literal-text behavior.

When the caret is inside a structure, the toolbar can change its bracket pair, fraction/binomial display size, or operator limit placement. These actions preserve contents and support one-step Undo. Recent & favorites keeps frequently used symbols/templates available without searching again. See [editing utilities](API-SESSION.md#editing-utilities--workspace).

### Change a radical while editing

Inside `\sqrt{x}`, choose **Change to Indexed root** in the suggestions. The
result is `\sqrt[2]{x}` with `2` selected for replacement. The content under the
radical is preserved. An indexed root with an empty index or `2` offers **Change
to Square root**. Other indices must be edited before that conversion is offered.
This editing operation does not change the LaTeX grammar or JSON model schema.


## Literal caret/tilde and complex root indices

A literal `^` or `~` in a model text run exports as `\char"005E{}` or
`\char"007E{}`. These spellings render in KaTeX math mode and load back into the
same text run. The importer also accepts `\textasciicircum{}` and
`\textasciitilde{}` as input aliases. Inside `\text{...}`, text-mode escaping
remains unchanged. General TeX `\char` codes are not supported.

An index containing braces or brackets is grouped when exported. For example,
`\sqrt[{x^2}]{y}` and `\sqrt[{\left[a\right]}]{y}` keep the optional index
argument intact. Grouping does not add a JSON node or remove editable structure.
Simple indices continue to export as `\sqrt[3]{x}`.

## Boundary deletion and continued editing

- At the outside right edge of a non-grid structure, Backspace removes the wrapper and retains its contents. At the outside left edge, Delete does the same and leaves the caret before the retained contents.
- An empty non-grid slot can remove its wrapper with Backspace or Delete. Removing an empty root index or one empty paired-script slot retains the other structure parts.
- Populated matrices, aligned equations and cases use a separate boundary selection before a second deletion removes the whole grid. Removing a wrapper never silently flattens a populated grid into text. A cell's ordinary text deletion remains local.
- Backspace at the start of a top-level line joins the previous line. Delete at the end joins the next line. Undo restores the original structure and lines.
- Repeated Up/Down movement retains its preferred horizontal position through shorter rows. Horizontal movement, typing and pointer placement reset that preference. Visible suggestions retain ownership of Up/Down; Escape dismisses them.
- Shift+Enter bypasses suggestions. In a grid it inserts a row; in a block top-level expression it follows the newline policy. Inline mode remains one top-level line.
- Invalid structured clipboard data leaves the formula unchanged and reports an error. Multiline paste is rejected in inline mode and inside nested math slots. Plain clipboard text remains literal; use the explicit LaTeX paste action for parsing.
