# LaTeX editing in text editors

The browser text-editor adapters support a visual popup and optional LaTeX source completion with a formula preview. They do not replace the host's text model. WGSL and GLSL expression editing is a separate project.

## Available implementations

| Package or extension | Editing surface | Lifecycle |
| --- | --- | --- |
| `@barocss/math-editor-text` | Shared range scanner and DOM popup | Explicit controller cleanup |
| `@barocss/math-editor-codemirror6` | Caret popup, Alt+Enter | CodeMirror 6 view plugin |
| `@barocss/math-editor-codemirror5` | Caret popup, Alt+Enter | Attachment with `destroy()` |
| `@barocss/math-editor-monaco` | Caret popup, Alt+Enter | Attachment and editor disposal |
| Barocss Math Editor for VS Code | Webview beside the document | VS Code extension lifecycle |

[Open the browser examples](../text-editors.html). The three examples import individual workspace packages directly from source. Published package exports target their own build artifacts. npm packages and the VS Code extension are published separately.

## CodeMirror 6

```sh
npm install @barocss/math-editor @barocss/math-editor-text @barocss/math-editor-codemirror6 @codemirror/state @codemirror/view @codemirror/commands
```

```ts
import { mathEditor } from '@barocss/math-editor-codemirror6';
import '@barocss/math-editor/style.css';
import '@barocss/math-editor-text/style.css';

// Add to your EditorState extensions alongside the host's history extension.
const extension = mathEditor({
  locale: 'en',
  syntax: 'markdown',
  onError: message => { statusElement.textContent = message; },
});
```

For CodeMirror 5 and Monaco, import `attachMathEditor` from the corresponding package and pass the host editor instance. The return value has `open()` and `destroy()`. CodeMirror 5 also has `refresh()`; call it after changing host options such as read-only mode. CodeMirror 6 exports the `openMathEditor(view)` command for custom controls. CodeMirror 5 uses its own package because its API differs from CodeMirror 6. Monaco applications retain their normal worker configuration.


## Direct LaTeX input

[Try source completion](../text-editors.html?mode=source). Choose **LaTeX completion** on the example page. The visual popup remains the default for existing integrations.

Pass `sourceEditing` to the CodeMirror 5, CodeMirror 6, or Monaco adapter. An empty object enables completion without a preview. To show a preview, install KaTeX separately and supply a renderer:

```sh
npm install katex
```

```ts
import katex from 'katex';
import 'katex/dist/katex.min.css';
import '@barocss/math-editor/style.css';
import '@barocss/math-editor-text/style.css';

const options = {
  locale: 'en',
  sourceEditing: {
    renderPreview(latex, element, displayMode) {
      katex.render(latex, element, {
        displayMode,
        throwOnError: true,
        trust: false,
        maxExpand: 1000,
      });
    },
  },
};
// CodeMirror 6: mathEditor(options), included in EditorState extensions.
// CodeMirror 5 / Monaco: attachMathEditor(editor, options).
```

| Action | Result |
| --- | --- |
| Type `\frac`, `\sqrt`, or another command inside a detected math range | Show localized catalog suggestions below the caret |
| Place the caret after `a`, `4ab`, or `x_i^2` | Offer fractions, roots, scripts and fences that retain the operand |
| Select a complete expression inside one math range | Preview the selection and offer source-preserving wrappers after drag release |
| Ctrl+Space inside a math range | Open the catalog without typing a command |
| Up / Down with suggestions open | Choose a candidate without moving the source caret |
| Enter or Tab after choosing a suggestion | Apply the selected command or operand wrapper and enter its next argument |
| Tab / Shift+Tab after insertion | Move through template arguments; this takes priority over operand wrapping suggestions |
| Tab after the last argument | Exit the inserted template |
| Escape | Dismiss source tools without changing source or collapsing its selection |
| Alt+Enter | Open the existing visual editor |

The preview sits above the caret when space permits. Incomplete syntax displays a short status instead of changing the source or blocking typing. The renderer is optional and is owned by the host. It must render only trusted UI; when using KaTeX, keep `trust: false` for document content.

Completion uses the math-editor catalog and serializer to create an **isolated insertion**. It does not parse or normalize the surrounding formula. For example, `\rightarrow` suggestions may insert the catalog's equivalent `\to ` spelling. A trailing space terminates a control word so it cannot absorb the following variable. Operand wrapping fills a catalog template with the original variable/number run and simple scripts, without reserializing the source. For example, `4ab` becomes `\frac{4ab}{}` and the caret enters the denominator. Existing-structure transformations remain visual-editor actions.

Automatic operand and selection menus do not preselect an action. Until you choose an item with Up/Down, Enter and Tab retain their normal host behavior. Typing a command or explicitly opening Ctrl+Space still preselects a completion.

Selection mode shows the selected source and keyboard hints in a fixed menu header. Up/Down keeps the native selection; Enter/Tab or a click wraps exactly that range. Shift+Arrow continues to adjust the selection. The shared core parser validates selected expressions without serializing them. Split command names, unbalanced groups, literal text, cross-formula selections and ordinary document text do not get math wrapping suggestions.

A position-aware lexical scan distinguishes command names, operand spans, comments, and braced text/environment names. Completing `\fr|ac{a}{b}` replaces the complete command name while preserving the arguments. Text and comments do not offer math wrappers. This is not a full TeX semantic parser: custom macros and arbitrary compound-expression boundaries are not inferred. Source mode accepts whitespace beside paired delimiters, including the trailing space inserted after a symbol command. The default visual-import scanner remains strict.

The shared dropdown keeps focus in the host and applies changes through the host edit/history API. It handles navigation keys only while its suggestions or template navigation are active. IME composition suspends suggestions. Read-only state, selection outside the math range, and host disposal remove the tools. Multi-caret completion, arbitrary TeX macro completion, and full snippet-language syntax are not supported. Argument navigation ends after leaving the template, undoing its insertion, or replacing across its argument boundaries.

`latexCompletions(query, locale)` is also exported from `@barocss/math-editor-text`. Each result includes `id`, `label`, `glyph`, `insert`, and UTF-16 `stops` relative to `insert`. A host can use this data in its own native completion provider instead of enabling the supplied dropdown. The `messages` option includes `suggestions`, `preview`, and `incomplete`; suggestion labels use the core locale catalog.

This source-completion mode applies to the three browser adapters. The VS Code extension currently retains its separate visual Webview workflow.

## User workflow

1. Place the caret within `$…$`, `$$…$$`, `\(…\)`, or `\[…\]`. Alternatively, select a bare LaTeX expression.
2. Press Alt+Enter (Option+Enter on macOS) or click **Edit formula**.
3. Edit the draft. Math suggestions and clipboard controls operate inside the popup.
4. Apply to replace the formula contents. Cancel to preserve the original.
5. Continue in the host text editor. Undo once to reverse the applied edit.

Opening the affordance never steals focus. An unchanged Apply does not normalize the original or add an undo entry. Changed formulas use the core serializer, which can normalize commands and whitespace inside the edited range. Existing dollar/backslash delimiters and surrounding prose remain intact. Leading/trailing whitespace inside the delimiters is preserved, including blank lines and indentation. For example, `$$\nx+1\n$$` becomes `$$\ny+1\n$$` after changing `x` to `y`. Newly serialized rows retain the source CRLF/LF convention; one-line display formulas remain one line.

While the popup is open, move the source caret to another formula to switch its contents. This does not take focus from the source editor. Moving outside math hides the popup; entering another formula shows it again. Unapplied drafts survive formula switches while the source version is unchanged. Apply changes only the current formula. If other drafts remain, Apply or Cancel first shows a warning. The explicit discard button finishes the session; returning to another formula keeps its draft. Repeated Enter/Escape does not confirm discarding.

## Source safety and limitations

The default scanner skips ordinary Markdown code fences, inline code, indented code lines, and HTML comments. LaTeX mode skips percent line comments and common `\verb`, `verbatim`, `lstlisting`, and `minted` literal constructs. It supports a bounded set of equation, alignment, cases, and matrix environments. Detection is followed by the core LaTeX parser; unsupported syntax cannot overwrite the source. Complete environment ranges can be normalized when edited.

The scanner is not a full Markdown/TeX parser. Hosts with custom macros, custom literal environments, or nested Markdown containers should provide `resolveRange(source, selection)` using their syntax tree. A return value of `undefined` disables automatic fallback for that position. Source offsets are UTF-16 positions.

Any source edit or document switch invalidates an open draft, including edit-then-undo. External changes while editing in the popup still block Apply. Returning to the source caret reloads its current formula from the new source. Old-version drafts are not restored or rebased. Read-only documents reject Apply. Multiple selections are rejected. Multi-caret batch editing and concurrent-edit rebasing are not implemented.

## Localization and styling

`locale` controls the math editor. The popup includes English and Korean dictionaries. `messages` overrides individual popup labels for additional locales. Register core locale messages separately for mathematical suggestions and controls.

The popup exposes `--me-text-background`, `--me-text-foreground`, `--me-text-border`, `--me-text-muted`, `--me-text-accent`, and `--me-text-on-accent`. Import both the core and text popup styles.

## VS Code

Install [Barocss Math Editor from the Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=barocss.barocss-math-editor), or search for `Barocss Math Editor` in the Extensions view.

The extension supplies **Barocss: Edit Formula** and **Barocss: Insert Formula**. It uses a Webview and the public VS Code document API, not the internal Monaco DOM. In Markdown and LaTeX documents, Alt+Enter opens editing; users can change that binding in VS Code.

In the visual editor, type `^`, `_`, or `/` after an operand or selection to create a power, subscript, or fraction. The cursor moves to the next input slot. For example, `x^2` creates a power; `a+b/2` makes only `b` the numerator. Select `a+b` before `/` to use the whole expression. Use the arrow keys to leave a slot.

Build and package from the workspace:

```sh
pnpm --filter barocss-math-editor type-check
pnpm --filter barocss-math-editor package
```

Install the generated VSIX through **Extensions: Install from VSIX**. Desktop Extension Host validation and Marketplace publication must be checked separately from browser adapter tests.

## Validation scenarios

| Scenario | Expected result |
| --- | --- |
| Caret enters a formula | Edit affordance appears without taking focus |
| Apply `x` → `y` | Only the formula contents change |
| Undo / Redo | One host history step restores/reapplies the edit |
| Cancel | Original text and history remain unchanged |
| Apply unchanged draft | Exact original source remains |
| Source edited while popup is open | Conflict shown; newer source preserved |
| Unsupported command | Error shown; source preserved |
| Caret in Markdown code | No automatic formula popup |
| Read-only host | No source edit allowed |
| Host destroyed | Popup and listeners removed |

Browser scenario source: `apps/math-text-demo/test/editing.browser.js`. Range tests: `packages/math-editor-text/test/ranges.test.ts`.

When wrapping a compound source expression in an exponent, visible parentheses preserve its scope: selecting `a+b` inserts `{\left(a+b\right)}^{}`. A single variable, number, or already grouped structure does not receive redundant parentheses. Source text inside the base remains unchanged.
