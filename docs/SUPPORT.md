# Supported math and editing features

This is a presentation and editing scope, not a claim of full LaTeX or computer-algebra support. Blank slots remain editable and export as empty groups. All catalog symbols are exercised against KaTeX in unit tests.

## Editing / LaTeX parity (0.2.0)

| Existing editor capability | Export | Editable import | Acceptance |
|---|---|---|---|
| 117 catalog symbols | Yes | Yes | Every symbol round-trips; aliases normalize |
| Fractions, roots, scripts and three delimiter structures | Yes | Yes | Empty/filled slots and nested pairs |
| Sums, products and integrals | Yes | Yes | Limits and bodies preserved |
| All six matrix environments | Yes | Yes | Rectangular cells and environment preserved |
| Two-column alignment and cases | Yes | Yes | Cell structure preserved |
| Top-level multiple lines | `gathered` | Yes | Root/additional lines preserved; rejected by inline host |
| Identity/zero matrices, vectors, formula templates | Yes | Yes | Restored as editable structure, not template IDs |
| Arbitrary TeX styling, macros and unsupported model nodes | No | No | Fail atomically; source editor fallback |

The [LaTeX contract](LATEX-SCOPE.md) defines syntax, limits and normalization. Version 0.2.0 includes the bounded loader described here. UI interaction parity between rich React and native renderers remains a separate concern.

See the [LaTeX editing guide](LATEX-GUIDE.md) for input examples and prioritized additions.

## Structural notation

| Family | Implemented input / structure | LaTeX output | Upper/lower limits | Editable condition/body | `\limsup`, `\liminf` | Not evaluation |
| Limits |
|---|---|---|---|
| Fractions | Two editable slots; wrap a selection as numerator | `\frac{a}{b}` | No automatic algebraic simplification |
| Upper/lower limits | Editable condition/body | `\limsup`, `\liminf` | Not evaluation |
| Limits | Editable approach condition and expression | `\\lim_{x\\to 0}{x}` | One lower condition; `\limits` accepted, `\nolimits` supported in workspace |
| Binomial coefficients | Two editable terms; selection wrapping | `\\binom{n}{k}` | Parentheses without a fraction bar |
| Square roots | Editable radicand; selection wrapping | `\sqrt{x}` | Use `indexedRoot` for an explicit index |
| Indexed roots | Index and radicand; selection wrapping | `\sqrt[n]{x}` | Empty index can be removed to recover a square root |
| Additional accents | Fixed wave/bar/dots and wide hat/wave; one editable body | `\tilde`, `\bar`, `\dot`, `\ddot`, `\widehat`, `\widetilde` | Fixed variants do not stretch across a long body |
| Accents | Editable body; selection wrapping | `\vec{x}`, `\hat{x}`, `\overline{AB}` | Additional wide accents are separate structures; overset/underset are separate supported structures |
| Brace annotations | Editable annotation and body, selection wrapping | `\overbrace{a+b}^{n}`, `\underbrace{a+b}_{n}` | No automatic algebraic grouping |
| Powers | Base and superscript; automatic parentheses when wrapping a compound base | `{x}^{2}` | Combined scripts use a separate shared-base node |
| Combined scripts | Shared base, lower and upper slots | `{x}_{i}^{2}` | Explicit grouping can still represent nesting |
| Literal text | One editable literal row | `\text{otherwise}` | No embedded math or text styling |
| Named functions | Editable upright name, 19 standard functions and custom names | `\sin x`, `\operatorname{custom}` | Arguments remain adjacent math; no evaluation |
| Subscripts | Base and lower script | `{x}_{i}` | No declaration or index semantics |
| Parentheses | Editable group | `\left(x\right)` | Generic group; no function-argument semantics |
| Brackets | Editable group | `\left[x\right]` | Not an interval data type |
| Norm | One editable body; selected-expression wrapping | `\left\Vert x\right\Vert` | Not numerical evaluation |
| Absolute value | Editable group | `\left&#124;x\right&#124;` | No evaluation |
| Sum | Lower limit, upper limit, body | `\sum_{i=1}^{n}x` | No bound-variable resolution |
| Product | Lower limit, upper limit, body | `\prod_{i=1}^{n}x` | No evaluation |
| Triple / contour integrals | Three editable slots; side bounds or explicit limits | `\iiint`, `\oint` | No computation; `\nolimits` supported in workspace |
| Integral | Lower limit, upper limit, integrand | `\int_{a}^{b}x` | Differential entered as text; no integration engine |
| Matrices / vectors | Editable nested cells; row/column changes | `matrix`, `pmatrix`, `bmatrix`, `Bmatrix`, `vmatrix`, `Vmatrix` | 1–20 rows and columns; no rectangular cell clipboard |
| Aligned equations | Two columns, left side right-aligned and right side left-aligned | `aligned` | 1–20 rows, one alignment point; type the relation explicitly |
| Cases | Expression and condition columns, left brace | `cases` | 1–20 rows; conditions accept math and literal text nodes |
| Multiple document lines | Split/join top-level rows | `gathered` | No wrapping several document lines into one structure |

## Editing, discovery and integration

| Area | Supported | Remaining boundary |
|---|---|---|
| Languages | Korean and English UI, demo, accessible names, hints and suggestions | Custom host labels require host translation |
| Discovery | All-symbol grid with English/Korean/glyph/LaTeX search, click to insert | Scroll through the complete 117-symbol catalog |
| Line numbers | UI gutter for multiple top-level rows, optional prop | Excluded from math output and clipboard |
| Aliases | English and Korean in both locales; longest symbolic trigger first | Substring matching with exact matches first; no natural-language parsing |
| Native input | Active token only; composition draft held stable | Real OS IME validation deferred |
| Roles | Variables, numeric literals, symbols, spaces | Lexical colors are not semantic declarations |
| Selection | Partial text, drag across tokens/structures, whole document in preview | No keyboard Shift-arrow model expansion or rectangular cell selection |
| Wrapping | Fraction, root, power, subscript, parentheses, brackets, absolute value | One balanced row; cross-slot range expands to common structure |
| Clipboard | Structured internal fragment plus LaTeX text; cut/paste replacement | External LaTeX is literal text; nested multiline paste rejected |
| History | Undo/redo of model changes and caret, up to 100 prior states | No shared host undo adapter yet |
| Deletion | Text boundaries, line join, structure unwrap, two-step filled-grid deletion | General structural deletion rules are still limited |
| Serialization | Version-1 JSON document and change callback | No persistence service, saved-document validator or migrations |
| Preview | Demo-only KaTeX view | Library renders its own editable presentation |
| Accessibility | Localized labels, combobox suggestions, keyboard slot navigation | Not a complete mathematical screen-reader implementation |
| Computation | None | No solving, simplification, units engine or collaboration |

## Editable templates and presets

| Template / preset | Sizes | Discovery | Behavior |
|---|---|---|---|
| Empty matrix | 2×2, 3×3, 4×4 | `matrix`, `행`, `행렬`; matrix menu | Editable empty cells |
| Identity matrix | 2×2, 3×3, 4×4 | `identity`, `단위`, `단위행렬`; matrix menu | Diagonal 1, other entries 0 |
| Zero matrix | 2×2, 3×3, 4×4 | `zero`, `영행렬`; template menu | All entries 0, editable |
| Column vector | 2×1, 3×1 | `vector`, `column`, `벡터`, `열벡터`; template menu | Empty editable column; existing generic matrix candidates may also match |
| Quadratic formula | One expression | `quadratic`, `근의공식`; template menu | `x=(-b±√(b²−4ac))/(2a)` using fraction/root/power nodes; assumes a≠0 mathematically, does not enforce it |
| Pythagorean theorem | One expression | `pythagorean`, `피타고라스`; template menu | `a²+b²=c²` using editable power nodes |

Template insertion uses fresh IDs and is undoable. Template search aliases do not include spaces as a complete multiword query parser: use the compact aliases shown above. A template is not a solver.

## Symbol catalog

For the compact three-column reference, see [Symbol names](./SYMBOLS.md).

The table below is generated from `src/symbols.ts`. Aliases are space-separated alternative names. Korean labels are also searchable. LaTeX control words receive separating whitespace during export. Literal Latin names and numbers remain ordinary text; typing a LaTeX command does not imply general LaTeX parsing.

Catalog size: **117 symbols**.

| Glyph | English label | Korean label | English aliases | Symbolic triggers | LaTeX |
|---|---|---|---|---|---|
| ↑ | Up arrow | 위쪽 화살표 | uparrow arrow 화살표 | - -> | `\\uparrow` |
| ↕ | Up-down arrow | 상하 화살표 | updownarrow arrow 화살표 | - -> | `\\updownarrow` |
| ⇐ | Double left arrow | 왼쪽 이중 화살표 | Leftarrow arrow 화살표 | - -> | `\\Leftarrow` |
| ⇑ | Double up arrow | 위쪽 이중 화살표 | Uparrow arrow 화살표 | - -> | `\\Uparrow` |
| ⇓ | Double down arrow | 아래쪽 이중 화살표 | Downarrow arrow 화살표 | - -> | `\\Downarrow` |
| ⇕ | Double up-down arrow | 상하 이중 화살표 | Updownarrow arrow 화살표 | - -> | `\\Updownarrow` |
| ↗ | Northeast arrow | 오른쪽 위 대각선 화살표 | nearrow arrow 화살표 | - -> | `\\nearrow` |
| ↘ | Southeast arrow | 오른쪽 아래 대각선 화살표 | searrow arrow 화살표 | - -> | `\\searrow` |
| ↙ | Southwest arrow | 왼쪽 아래 대각선 화살표 | swarrow arrow 화살표 | - -> | `\\swarrow` |
| ↖ | Northwest arrow | 왼쪽 위 대각선 화살표 | nwarrow arrow 화살표 | - -> | `\\nwarrow` |
| ⟶ | Long right arrow | 긴 오른쪽 화살표 | longrightarrow arrow 화살표 | - -> | `\\longrightarrow` |
| ⟵ | Long left arrow | 긴 왼쪽 화살표 | longleftarrow arrow 화살표 | - -> | `\\longleftarrow` |
| ⟷ | Long left-right arrow | 긴 양방향 화살표 | longleftrightarrow arrow 화살표 | - | `\\longleftrightarrow` |
| ⟹ | Long double right arrow | 긴 오른쪽 이중 화살표 | Longrightarrow arrow 화살표 | - -> | `\\Longrightarrow` |
| ⟸ | Long double left arrow | 긴 왼쪽 이중 화살표 | Longleftarrow arrow 화살표 | - -> | `\\Longleftarrow` |
| ⟺ | Long double left-right arrow | 긴 양방향 이중 화살표 | Longleftrightarrow arrow | — | `\\Longleftrightarrow` |
| ↪ | Hook right arrow | 갈고리 오른쪽 화살표 | hookrightarrow arrow 화살표 | - -> | `\\hookrightarrow` |
| ↩ | Hook left arrow | 갈고리 왼쪽 화살표 | hookleftarrow arrow 화살표 | - -> | `\\hookleftarrow` |
| ⇀ | Right harpoon up | 오른쪽 위 반쪽 화살표 | rightharpoonup arrow 화살표 | - -> | `\\rightharpoonup` |
| ↼ | Left harpoon up | 왼쪽 위 반쪽 화살표 | leftharpoonup arrow 화살표 | - -> | `\\leftharpoonup` |
| ⇁ | Right harpoon down | 오른쪽 아래 반쪽 화살표 | rightharpoondown arrow 화살표 | - -> | `\\rightharpoondown` |
| ↽ | Left harpoon down | 왼쪽 아래 반쪽 화살표 | leftharpoondown arrow 화살표 | - -> | `\\leftharpoondown` |
| ⇌ | Equilibrium right-left arrows | 평형 오른쪽 왼쪽 화살표 | rightleftharpoons arrow 화살표 | - -> | `\\rightleftharpoons` |
| ⇋ | Equilibrium left-right arrows | 평형 왼쪽 오른쪽 화살표 | leftrightharpoons arrow 화살표 | - -> | `\\leftrightharpoons` |
| ↓ | Down arrow | 아래쪽 화살표 | downarrow down 아래화살표 아래쪽화살표 | - -> | `\\downarrow` |
| ∋ | Contains as an element | 원소를 포함 | ni contains | — | `\ni` |
| ⊃ | Superset | 상위집합 | supset superset | — | `\supset` |
| ⊇ | Superset or equal | 상위집합 또는 같음 | supseteq | — | `\supseteq` |
| ⊈ | Not a subset or equal | 부분집합 아님 | nsubseteq | — | `\nsubseteq` |
| ∖ | Set difference | 차집합 | setminus difference | — | `\setminus` |
| ℕ | Natural numbers | 자연수 집합 | naturals natural | — | `\mathbb{N}` |
| ℤ | Integers | 정수 집합 | integers integer | — | `\mathbb{Z}` |
| ℚ | Rational numbers | 유리수 집합 | rationals rational | — | `\mathbb{Q}` |
| ℝ | Real numbers | 실수 집합 | reals real | — | `\mathbb{R}` |
| ℂ | Complex numbers | 복소수 집합 | complexes complex | — | `\mathbb{C}` |
| ⊥ | Perpendicular | 수직 | perp perpendicular | — | `\perp` |
| ∥ | Parallel | 평행 | parallel | — | `\parallel` |
| ≅ | Congruent | 합동 | cong congruent | — | `\cong` |
| ∼ | Similar | 닮음 | sim similar | — | `\sim` |
| ↦ | Maps to | 대응 | mapsto maps arrow 화살표 | \|-> - -> | `\\mapsto` |
| … | Ellipsis | 말줄임표 | ldots ellipsis | — | `\ldots` |
| ⋯ | Centered dots | 가로 점 | cdots | — | `\cdots` |
| ⋮ | Vertical dots | 세로 점 | vdots | — | `\vdots` |
| ⋱ | Diagonal dots | 대각 점 | ddots | — | `\ddots` |
| ° | Degree | 도 | degree degrees 각도 | — | `{}^{\circ}` |
| ∠ | Angle | 각 기호 | angle | — | `\angle` |
| + | Plus | 더하기 | plus sum | + | `+` |
| − | Minus | 빼기 | minus | - | `-` |
| ± | Plus or minus | 플러스 마이너스 | plusminus sum | +- + | `\pm` |
| ∓ | Minus or plus | 마이너스 플러스 | minusplus | -+ - | `\mp` |
| × | Times | 곱하기 | times multiply | * | `\times` |
| · | Dot | 가운데 점 | dot multiply | * | `\cdot` |
| ÷ | Divide | 나누기 | divide division | / | `\div` |
| = | Equal | 같음 | equal | = | `=` |
| ≠ | Not equal | 같지 않음 | neq unequal | != /= = | `\ne` |
| ≈ | Approximately equal | 근삿값 | approx | ~ ~~ = | `\approx` |
| ≡ | Equivalent | 동치 | equiv | === = | `\equiv` |
| < | Less than | 작음 | less | < | `<` |
| > | Greater than | 큼 | greater | > | `>` |
| ≤ | Less than or equal | 작거나 같음 | leq less | <= <- < | `\le` |
| ≥ | Greater than or equal | 크거나 같음 | geq greater | >= >- > | `\ge` |
| ∝ | Proportional | 비례 | proportional | ~ | `\propto` |
| → | Right arrow | 오른쪽 화살표 | rightarrow arrow | -> - | `\\to` |
| ← | Left arrow | 왼쪽 화살표 | leftarrow arrow | <- < - -> | `\\leftarrow` |
| ↔ | Left-right arrow | 양방향 화살표 | leftrightarrow arrow | <-> - -> | `\\leftrightarrow` |
| ⇒ | Implies | 함의 | implies arrow 화살표 | => = - -> | `\\Rightarrow` |
| ⇔ | If and only if | 필요충분 | iff arrow 화살표 | <=> - -> | `\\Leftrightarrow` |
| ∈ | Element of | 원소 | in element | E | `\in` |
| ∉ | Not an element of | 원소 아님 | notin element | E/ | `\notin` |
| ∀ | For all | 모든 | forall | A | `\forall` |
| ∃ | There exists | 존재 | exists | E | `\exists` |
| ∪ | Union | 합집합 | union | U | `\cup` |
| ∩ | Intersection | 교집합 | intersection | — | `\cap` |
| ⊂ | Subset | 부분집합 | subset | < | `\subset` |
| ⊆ | Subset or equal | 부분집합 또는 같음 | subseteq | <= | `\subseteq` |
| ∅ | Empty set | 공집합 | emptyset | — | `\emptyset` |
| ∞ | Infinity | 무한대 | infinity infty | — | `\infty` |
| ∂ | Partial derivative | 편미분 | partial derivative | — | `\partial` |
| ∇ | Nabla | 나블라 | nabla gradient | — | `\nabla` |
| ∧ | Logical and | 논리곱 | and wedge | ^ | `\wedge` |
| ∨ | Logical or | 논리합 | or vee | — | `\vee` |
| ¬ | Logical not | 부정 | not neg | ! | `\neg` |
| α | Alpha | 알파 | alpha | — | `\alpha` |
| β | Beta | 베타 | beta | — | `\beta` |
| γ | Gamma | 감마 | gamma | — | `\gamma` |
| δ | Delta | 델타 | delta | — | `\delta` |
| ε | Epsilon | 엡실론 | epsilon | — | `\epsilon` |
| ζ | Zeta | 제타 | zeta | — | `\zeta` |
| η | Eta | 에타 | eta | — | `\eta` |
| θ | Theta | 세타 | theta | — | `\theta` |
| ι | Iota | 이오타 | iota | — | `\iota` |
| κ | Kappa | 카파 | kappa | — | `\kappa` |
| λ | Lambda | 람다 | lambda | — | `\lambda` |
| μ | Mu | 뮤 | mu | — | `\mu` |
| ν | Nu | 뉴 | nu | — | `\nu` |
| ξ | Xi | 크시 | xi | — | `\xi` |
| π | Pi | 파이 | pi | — | `\pi` |
| ρ | Rho | 로 | rho | — | `\rho` |
| σ | Sigma | 시그마 | sigma | — | `\sigma` |
| τ | Tau | 타우 | tau | — | `\tau` |
| υ | Upsilon | 입실론 | upsilon | — | `\upsilon` |
| φ | Phi | 파이 / 피 | phi | — | `\phi` |
| χ | Chi | 카이 | chi | — | `\chi` |
| ψ | Psi | 프사이 | psi | — | `\psi` |
| ω | Omega | 오메가 | omega | — | `\omega` |
| Γ | Uppercase Gamma | 대문자 감마 | Gamma | — | `\Gamma` |
| Δ | Uppercase Delta | 대문자 델타 | Delta | — | `\Delta` |
| Θ | Uppercase Theta | 대문자 세타 | Theta | — | `\Theta` |
| Λ | Uppercase Lambda | 대문자 람다 | Lambda | — | `\Lambda` |
| Ξ | Uppercase Xi | 대문자 크시 | Xi | — | `\Xi` |
| Π | Uppercase Pi | 대문자 파이 | Pi | — | `\Pi` |
| Σ | Uppercase Sigma | 대문자 시그마 | Sigma | — | `\Sigma` |
| Φ | Uppercase Phi | 대문자 파이 / 피 | Phi | — | `\Phi` |
| Ψ | Uppercase Psi | 대문자 프사이 | Psi | — | `\Psi` |
| Ω | Uppercase Omega | 대문자 오메가 | Omega | — | `\Omega` |

## Renderer availability

This formula catalog describes the shared model and the existing rich React editor. New native DOM/framework surfaces share the notation model but have a smaller interaction UI. See the [renderer parity table](ADAPTERS.md#current-renderer-parity) before choosing an adapter.

### Combined scripts (workspace)

`x_i^2` and `x^2_i` load into one `scripts` node with slots `[base, subscript, superscript]`. In either renderer, enter `^` at the end of a subscript and choose Exponent, or `_` at the end of an exponent and choose Subscript. The other script is added to the same base. Tab / Shift+Tab move between slots; Backspace in an empty script removes only that side. Explicit grouping such as `{x_i}^2` still represents nesting. Repeated scripts without grouping remain syntax errors. Available in 0.2.0.

### Contextual selection menu (workspace)

Selecting a range opens wrapping actions beside the selection in both renderers, including toolbar-free inline surfaces. Actions include fraction, square root, superscript, subscript, parentheses, brackets and absolute value. A multi-line selection keeps the actions disabled. Applying an action preserves the selected model content and supports Undo. React also respects the host's excluded structure list.

### Literal text and functions (workspace)

Type `text` or `텍스트` and select Text to write a description, then Tab to resume math. Type `sin`, `cos`, `log` and choose the corresponding function suggestion; `operatorname` opens an editable custom name. Function arguments remain ordinary neighboring math. LaTeX import supports `\text{otherwise}`, the 19 names listed in [LaTeX scope](LATEX-SCOPE.md), and `\operatorname{custom}`. Imported names and text can be edited in React and native adapters. Mixed math inside text and text styling remain unsupported.

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

All structured fences scale with their contents. Short angle notation normalizes to scalable `\left\langle…\right\rangle` on export. Supported physical ends are `(`, `)`, `[`, `]`, `{`, `}`, `⟨`, `⟩`, `|` and `.`. Plain punctuation stays literal unless imported with a structural command. Double norm bars, `\big`/`\Big`, `\overbrace` and `\underbrace` remain unsupported.


### Double integrals (workspace)

`\iint_R f(x,y)` imports as `doubleIntegral` with exactly three slots: `[lower/domain, upper, body]`, matching integral navigation. Missing bounds remain editable empty slots. `\iint\limits` preserves the explicit placement directive. Export uses `\iint_{lower}^{upper}{body}`. Search `iint`, `이중적분` or `∬` to insert; Tab visits the domain, upper bound and body in order. The reported expression with `\rm dx \rm dy`, `\xi`, `\eta` and `\text{Area}` is covered by import/round-trip and browser editing fixtures. This is notation support, not numerical integration. Triple and contour integrals remain outside this addition.

Fine spacing: `\,`, `\:`, `\;`, `\!` are preserved as zero-slot structures. Positive spacing expands and negative thin spacing contracts the next boundary; these are not editable text spaces.

## Explicit sizes (0.2.0)

`\dfrac`, `\tfrac`, `\dbinom` and `\tbinom` can be imported and edited without losing their size choice on export. Type `dfrac`, `tfrac`, `dbinom` or `tbinom` and select the matching suggestion, then edit the two slots with Tab. See [JSON size mapping](LATEX-MODEL.md#explicit-fraction-and-binomial-sizes--workspace). General `\displaystyle` and `\textstyle` declarations remain unsupported.

### Math alphabet support (workspace)

`\mathbf`, `\mathcal` and multi-letter `\mathbb` now support import, suggestions, range wrapping, editing and export. See [alphabet scope and examples](LATEX-GUIDE.md#mathematical-alphabets--020). Available in 0.2.0.

### Labeled arrows (workspace)

`\xrightarrow[below]{above}` and `\xleftarrow[below]{above}` support parsing, suggestions, editable math labels and export. See [label syntax and slot order](LATEX-GUIDE.md#labeled-arrows--020). Available in 0.2.0.

## Keyboard ranges and brace discovery (0.2.1)

Shift+Left/Right extends or shrinks the same model range used by dragging. Structures are crossed as balanced units; copied and deleted ranges use existing model normalization. Shift+Up/Down extends to an adjacent top-level document line, using a logical text offset rather than pixel-based column matching; grid-cell rectangular selection is not added. Copy, cut, wrapping, deletion and Undo use the existing range behavior. IME composition and modifier shortcuts retain their existing handling.

Typing `{` offers both paired braces and cases. Paired braces remain the first candidate; choose Cases explicitly to insert its editable grid.
