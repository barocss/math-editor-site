# Copy and paste formulas

Choose the method that matches your source. **Ordinary paste does not automatically parse LaTeX.**

| Source and goal | Method | Result |
| --- | --- | --- |
| Selected math → another math-editor field | Select a model range, copy, then paste at the destination | Editable structure is preserved when the browser retains the custom clipboard format |
| Ordinary text → a formula slot | Paste normally | Literal text insertion; suggestions can help with subsequent editing |
| LaTeX source → an editable formula | Open **Paste as LaTeX** with `Alt+Shift+V`, paste the source, then `Ctrl/Cmd+Enter` | Supported syntax becomes editable nodes at the caret or replaces the selected range |
| Formula → a LaTeX-aware application | Copy a formula range, or use the site's LaTeX Copy button | Plain clipboard text is LaTeX; the receiving application decides how to use it |
| Formula → a slide, document or image tool | Use **Copy image** or **Download image** in the site's rendering preview | PNG pixels; this is not an editable math model |

On macOS, use Cmd for copy/cut/paste and Option for Alt. The editor does not read the system clipboard just because you open the paste panel.

## Move part of a formula

1. Drag across the math, or extend a range with Shift+Left/Right.
2. Press Ctrl/Cmd+C to copy. Use Ctrl/Cmd+X to cut.
3. Click the destination. Place the caret where the formula should go, or select content to replace.
4. Press Ctrl/Cmd+V. Check the result. Undo restores the previous content.

Selection inside one input can be a native text selection. A model range can include multiple tokens and nested structures. To copy the whole formula, focus the formula surface and use Select All; Select All inside an active input can select that input's text first. Check the highlight before copying.

Copying leaves the original unchanged. Cut and accepted structured paste are undoable. Pasted nodes receive fresh identities so editing one copy does not change the other.

## Insert LaTeX without replacing the whole formula

Place the caret after your existing expression. Open Paste as LaTeX and enter:

```latex
+\frac{a}{b}
```

Press Ctrl/Cmd+Enter to insert. Escape closes the panel. If the source is unsupported or malformed, the panel shows a diagnostic and keeps the existing formula unchanged. Correct the source or close the panel.

The site's **Load LaTeX** control replaces the whole formula. **Paste as LaTeX** inserts at the current location. See [LaTeX support](LATEX-SCOPE.md) for parsing limits.

## Matrices and multiline formulas

A selected rectangle of matrix cells carries row and column boundaries. Paste into a compatible matrix destination to replace that rectangle or grow from the target cell where supported. Tab-separated rectangular text can also supply matrix cells when the caret is in a matrix. Ragged, oversized or incompatible cell data is rejected.

Inline fields reject top-level multiline fragments. A multiline fragment also cannot be inserted inside an ordinary nested slot such as a fraction numerator. Matrix rows are internal structure; they are different from top-level formula lines.

## When pasting does not produce editable math

- Another application or browser can discard custom clipboard formats. If only plain LaTeX remains, use Paste as LaTeX explicitly.
- Malformed custom formula data is rejected. It does not silently fall back to replacing your selection with plain text.
- An image contains no editable model. This library does not perform formula OCR.
- Clipboard permissions can prevent image copying. Use Download image as the site alternative.
- A host editor can handle clipboard operations outside the active math field. Put the caret inside the math field before pasting there.

Controlled browser clipboard tests pass for the recorded scope. Actual exchange through the OS clipboard, other applications and all browsers is not yet certified. See [validation](VALIDATION.md).

Try [the practice exercises](https://math-editor.barocss.com/#tutorial) or open [the keyboard reference](KEYBOARD.md).
