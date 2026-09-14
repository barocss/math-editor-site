# Keyboard reference

Open **Keyboard & clipboard help** from the math toolbar, or press **F1 while the formula has focus**. This also works in a toolbar-free inline field. Some keyboards require Fn+F1. Close help to return to the previously focused input without editing the formula.

Use Cmd on macOS and Ctrl on Windows/Linux. Alt is Option on macOS. The host and operating system can reserve keys; the field only handles its shortcuts while it has focus.

| Context | Keys | Action |
| --- | --- | --- |
| Active input | Left / Right | Move the caret; repeated keydown continues across token and slot boundaries |
| Active input, no suggestion menu | Up / Down | Move between supported structural slots or lines; repeated vertical movement retains the preferred column |
| Editable slots | Tab / Shift+Tab | Next / previous slot |
| Formula selection | Shift+Left / Right | Extend or shrink the selected range |
| Active formula | Ctrl+Left / Right (Option+Left / Right on macOS) | Move by text units or whole math structures |
| Active formula | Ctrl+Shift+Left / Right (Option+Shift+Left / Right on macOS) | Extend or shrink selection by text units or structures |
| Matrix cell | Alt+Shift+Backspace | Delete the current column; Undo restores it |
| Matrix cell | Alt+Shift+Up | Delete the current row; Undo restores it |
| Nonempty math selection | `(`, `[`, `{`, `\|` | Wrap in parentheses, brackets, braces or absolute value |
| Nonempty math selection | `/` | Use the selection as numerator; enter the denominator next |
| Nonempty math selection | `^` / `_` | Use the selection as base; enter the exponent or subscript next |
| Caret after an operand | `^` / `_` | Create a power/subscript and enter its empty script slot |
| Caret after an operand | `/` | Use the preceding operand as numerator and enter the denominator |
| Active formula | Alt+Down | Open suggestions, including transformations for the nearest supported structure |
| Suggestions open | Up / Down, Enter | Choose and apply a suggestion |
| Suggestions open | Escape | Dismiss suggestions before returning to ordinary navigation |
| Active formula | Ctrl/Cmd+Z / Ctrl/Cmd+Shift+Z | Undo / Redo |
| Selected range | Ctrl/Cmd+C / X | Copy / Cut |
| Active formula | Ctrl/Cmd+V | Paste available editor data or literal text |
| Active formula | Alt+Shift+V | Open Paste as LaTeX |
| LaTeX paste panel | Ctrl/Cmd+Enter / Escape | Insert / close the panel |
| Active formula | F1 | Open help |
| Context footer available | F6 | Move focus between the input and contextual controls |

## Enter depends on context

An active suggestion normally receives Enter. Escape dismisses it first if you want a different action. Operand-only suggestions require navigation before Enter applies them, so ordinary Enter does not unexpectedly wrap an operand.

In a block field, Enter follows the configured newline/commit policy. Shift+Enter bypasses suggestion acceptance and creates a row in a grid or a line at the outer block level. Inline fields do not create top-level formula lines. Their completion and boundary-exit behavior belongs to the embedding host.

## Delete depends on context

Backspace/Delete removes a selection. At a structure boundary it can unwrap retained contents. An empty slot can remove or reduce its enclosing structure. Populated grids require their grid selection/deletion policy so cells are not silently flattened. At the end of a top-level line, Delete joins the following line; Backspace at the next line's start joins backward. Undo restores the change.

Without a selection, `^`, `_`, and `/` immediately use the preceding operand. `a+b/` becomes `a+\frac{b}{}`; selecting all of `a+b` before `/` uses the whole selection as numerator. An existing structure immediately before the caret is one operand. `x^2_3` puts both scripts on the same base. With no operand, `/` starts in an empty numerator; `^` and `_` start in an empty script. Each conversion is one Undo step. Bracket wrapping keys still require a selection. Literal text, matrix rectangles and multiline ranges retain their own rules. See [selection editing](LATEX-GUIDE.md#select-replace-and-wrap), [copy and paste](CLIPBOARD.md) and [practice exercises](https://math-editor.barocss.com/#tutorial).
