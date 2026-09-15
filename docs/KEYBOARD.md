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

An active suggestion normally receives Enter. Escape dismisses it first if you want a different action. Operand-only suggestions and existing-symbol replacement suggestions require an explicit keyboard choice before Enter applies them. The first Down selects the first candidate; further Up/Down changes the choice. Alt+Down explicitly opens and selects a context action. Clicking a candidate applies it directly. Moving the caret, changing the formula, leaving the field, or dismissing the menu clears the previous keyboard choice. Without a choice, Enter follows the field or host policy.

In a block field, Enter follows the configured newline/commit policy. Shift+Enter bypasses suggestion acceptance and creates a row in a grid or a line at the outer block level. Inline fields do not create top-level formula lines. Their completion and boundary-exit behavior belongs to the embedding host.

## Delete depends on context

Backspace/Delete removes a selection. At a structure boundary it can unwrap retained contents. An empty slot can remove or reduce its enclosing structure. Populated grids require their grid selection/deletion policy so cells are not silently flattened. At the end of a top-level line, Delete joins the following line; Backspace at the next line's start joins backward. Undo restores the change.

Without a selection, `^`, `_`, and `/` immediately use the preceding operand. `a+b/` becomes `a+\frac{b}{}`; selecting all of `a+b` before `/` uses the whole selection as numerator. An existing structure immediately before the caret is one operand. `x^2_3` puts both scripts on the same base. With no operand, `/` starts in an empty numerator; `^` and `_` start in an empty script. Each conversion is one Undo step. Without a selection, opening fence keys create an empty body at the caret without consuming the preceding operand. Literal text, matrix rectangles and multiline ranges retain their own rules. See [selection editing](LATEX-GUIDE.md#select-replace-and-wrap), [copy and paste](CLIPBOARD.md) and [practice exercises](https://math-editor.barocss.com/#tutorial).

## Change an existing symbol

Move the caret directly before or after a catalog symbol such as `ℝ`, `α`, or `→`. Suggestions show related symbols first. Press Down to select the first replacement, use Up/Down to change the choice, then Enter to apply it. Merely moving beside a symbol does not let Enter replace it. Only that symbol changes; surrounding text and the caret side remain intact. Escape closes the menu. At a boundary between two symbols, the left symbol is the target.

A bare letter prioritizes related mathematical letter forms: `r` or `R` shows `ℝ` and `ρ` before right-arrow matches. Use `right`, `rightarrow`, or `->` to search for arrows explicitly. Text changes only after you accept a candidate.


## Type brackets directly

| Input | Behavior |
| --- | --- |
| `(`, `[`, `{` | Create parentheses, brackets or braces at the caret and focus the body |
| `)`, `]`, `}` | At the end of the matching immediate fence body, move outside without inserting another delimiter |
| `\|` | At the end of an absolute-value body, close it; elsewhere create a new absolute-value body |
| `‖`, `⟨`, `⟩` | Support norm and angle fences when these characters arrive as key events |
| Backspace in an empty body | Remove the empty wrapper |

A nonempty selection is wrapped instead. Nested fences close one at a time. A cursor inside a fraction or other nested slot must leave that slot before it can close the outer fence. A mismatched closer or a closer in the middle of a body remains ordinary text.

Half-open intervals and custom fences use their actual closing delimiter, including `(…]` and `[… )`. Choose their shape in suggestions or the toolbar; `(` and `[` start the ordinary matched pair. `<` and `>` remain comparison symbols. Two `|` keystrokes open and close an empty absolute value; use the norm tool or the `‖` character for a norm. Clipboard and IME input retain their own rules. Type `cases` or use the toolbar for a cases structure; `{` now creates braces directly.
