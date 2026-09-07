# Supported math and editing features

This is a presentation and editing scope, not a claim of full LaTeX or computer-algebra support. Blank slots remain editable and export as empty groups. All catalog symbols are exercised against KaTeX in unit tests.

## Structural notation

| Family | Implemented input / structure | LaTeX output | Limits |
|---|---|---|---|
| Fractions | Two editable slots; wrap a selection as numerator | `\frac{a}{b}` | No automatic algebraic simplification |
| Square roots | Editable radicand; selection wrapping | `\sqrt{x}` | Indexed roots not yet implemented |
| Powers | Base and superscript; automatic parentheses when wrapping a compound base | `{x}^{2}` | No combined sub/superscript structure |
| Subscripts | Base and lower script | `{x}_{i}` | No declaration or index semantics |
| Parentheses | Editable group | `\left(x\right)` | Generic group; no function-argument semantics |
| Brackets | Editable group | `\left[x\right]` | Not an interval data type |
| Absolute value | Editable group | `\left&#124;x\right&#124;` | No evaluation |
| Sum | Lower limit, upper limit, body | `\sum_{i=1}^{n}x` | No bound-variable resolution |
| Product | Lower limit, upper limit, body | `\prod_{i=1}^{n}x` | No evaluation |
| Integral | Lower limit, upper limit, integrand | `\int_{a}^{b}x` | Differential entered as text; no integration engine |
| Matrices / vectors | Editable nested cells; row/column changes | `matrix`, `pmatrix`, `bmatrix`, `Bmatrix`, `vmatrix`, `Vmatrix` | 1–20 rows and columns; no rectangular cell clipboard |
| Aligned equations | Two columns, left side right-aligned and right side left-aligned | `aligned` | 1–20 rows, one alignment point; type the relation explicitly |
| Cases | Expression and condition columns, left brace | `cases` | 1–20 rows; conditions are math, not a dedicated text mode |
| Multiple document lines | Split/join top-level rows | `gathered` | No wrapping several document lines into one structure |

## Editing, discovery and integration

| Area | Supported | Remaining boundary |
|---|---|---|
| Languages | Korean and English UI, demo, accessible names, hints and suggestions | Custom host labels require host translation |
| Discovery | All-symbol grid with English/Korean/glyph/LaTeX search, click to insert | Scroll through the complete 90-symbol catalog |
| Line numbers | UI gutter for multiple top-level rows, optional prop | Excluded from math output and clipboard |
| Aliases | English and Korean in both locales; longest symbolic trigger first | Prefix search, not natural-language parsing |
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

Catalog size: **90 symbols**.

| Glyph | English label | Korean label | English aliases | Symbolic triggers | LaTeX |
|---|---|---|---|---|---|
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
| ↦ | Maps to | 대응 | mapsto maps | &#124;-> | `\mapsto` |
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
| → | Right arrow | 오른쪽 화살표 | rightarrow arrow | -> - | `\to` |
| ← | Left arrow | 왼쪽 화살표 | leftarrow arrow | <- < | `\leftarrow` |
| ↔ | Left-right arrow | 양방향 화살표 | leftrightarrow arrow | <-> | `\leftrightarrow` |
| ⇒ | Implies | 함의 | implies arrow | => = | `\Rightarrow` |
| ⇔ | If and only if | 필요충분 | iff arrow | <=> | `\Leftrightarrow` |
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
