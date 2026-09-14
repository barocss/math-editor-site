# Learn to edit a formula

Start with [the five practice exercises](https://math-editor.barocss.com/#tutorial). They use a separate field and leave your playground formula unchanged. Each exercise checks the resulting formula model. You can reset an exercise, go back or close the practice area.

## Make editing comfortable

If a fraction or nested formula feels small, choose **Math size → 26px** above
the playground. This enlarges the formula while keeping the relative sizes of
the base, exponent and radicand. A complex denominator makes the fraction taller;
it does not automatically enlarge the numerator.

편집할 분수나 중첩 수식이 작게 느껴지면 위의 **수식 크기 → 26px**를 선택하세요.
수식 내부의 크기 비율은 유지됩니다. 분모가 복잡해져도 분자 글자가 자동으로
커지지는 않습니다. 편집 크기는 저장되는 LaTeX와 미리보기 이미지 크기를 바꾸지 않습니다.

Nested editing text has a 14px minimum. In a text-editor visual popup, use
**125%** or **150%** zoom for a larger editing view. Editing size does not change
saved LaTeX or the preview/export size. Embedded apps can configure a larger
minimum and must allow the equation's line height to grow; see [Styling](STYLING.md).

## 1. Write, then correct

Type `x+1`. Click the number and change it to `2`. Use Left/Right to move the caret. A held arrow key should keep moving. Undo and Redo let you inspect changes without starting again.

## 2. Build structure from existing input

Type `a+b`, then select it by dragging or using Shift+arrows. Press `/`. The selected expression becomes the numerator, and the denominator receives the caret. Type `2`.

You do not have to choose a fraction before writing its contents. Selected math can also be wrapped with `(`, `[`, `{`, `|`, `^` and `_`.

## 3. Add a power or subscript

Select `x`, press `^`, then type `2`. Use `_` instead when you need a subscript. Use Tab to move between editable slots. The editor preserves the distinction between a base and its scripts.

## 4. Change an existing structure

Click inside a square root. Press Alt+Down to open suggestions. Choose Change to Indexed root and press Enter. The new index is selected; type `3` to replace it. The radicand stays intact.

The same suggestion area offers supported bracket transformations when the caret is inside a bracketed expression. You do not need a toolbar. Escape closes the list; Undo reverses a conversion.

## 5. Bring in existing LaTeX

Put the caret after a formula. Press Alt+Shift+V, enter `+c^2`, then Ctrl/Cmd+Enter. This adds parsed LaTeX at the caret. Ordinary paste inserts text or preserved editor clipboard data; it does not automatically interpret LaTeX.

Read [copy and paste](CLIPBOARD.md) before transferring formulas between applications. The site can also copy/download a PNG from its rendering preview. A PNG cannot be reopened as an editable formula.

## Keep these controls nearby

- **F1:** keyboard and clipboard help inside the field.
- **Alt+Down:** suggestions and available transformations.
- **Tab / Shift+Tab:** move between slots.
- **Ctrl/Cmd+Z:** undo the last edit.

The [keyboard reference](KEYBOARD.md) explains selection, Enter and deletion rules. The [LaTeX guide](LATEX-GUIDE.md) covers more notation. Developers embedding a field can continue with [framework guides](ADAPTERS.md).
