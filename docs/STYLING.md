# Styling and themes

The editor exposes CSS custom properties for presentation. Set them on a wrapper around an editor, or on a shared ancestor for multiple editors. This works with React, native JavaScript, the light-DOM Web Component, Vue, Svelte and Solid. No theme provider or additional runtime is required. Styling does not change the JSON model, exported LaTeX or undo history.

Import the package stylesheet once, then add your application stylesheet:

```js
import '@barocss/math-editor/style.css';
import './math-theme.css';
```

```css
.product-math {
  --me-font-size: 18px;
  --me-accent: #6b4bb3;
  --me-variable: #385ea1;
  --me-number: #a65316;
  --me-symbol: #8056ad;
  --me-function: #147d77;
  --me-surface-padding: 24px 16px;
  --me-surface-min-height: 100px;
  --me-toolbar-padding: 6px;
  --me-control-radius: 4px;
}
```

```tsx
// Rich React editor. Native framework adapters use the same wrapper pattern.
<div className="product-math">
  <MathEditor onChange={(document, latex) => save(document, latex)} />
</div>
```

```js
// Native JavaScript. The wrapper may already carry application theme variables.
const host = document.querySelector('.product-math');
const editor = mountMathEditor(host, { onChange: save });
host.style.setProperty('--me-font-size', '20px');
// On unmount:
editor.destroy();
```

```html
<!-- Register with defineMathEditor() first. This component uses light DOM. -->
<barocss-math-editor class="product-math" locale="en"></barocss-math-editor>
```

Try the website's **Theme**, **Math size** and **Compact spacing** controls in the [playground](https://math-editor.barocss.com/#playground). These are application examples, not required library presets.

## Public CSS variables

For complex fractions, start with a **26px editing base** instead of enlarging
only the numerator or denominator. Use a **16px minimum** if nested text remains
hard to read. Keep the KaTeX preview/export size separate from editing size:

```css
.product-math {
  --me-font-size: 26px;
  --me-min-font-size: 16px;
}
```

복잡한 분수는 편집 기본 크기를 **26px**, 중첩 글자의 최소 크기를 **16px**로
설정해 보세요. KaTeX 미리보기와 이미지 출력 크기는 앱에서 별도로 설정합니다.
수식이 커지면 줄 높이도 늘어날 수 있도록 호스트 영역의 고정 높이를 피하세요.

Unset variables preserve the existing default appearance. Some controls intentionally have slightly different default shades/radii; a supplied token unifies them. Set lengths such as the base font size in `px` or `rem` when the editor and its portal have different parents.

| Variable | Controls | Default behavior |
| --- | --- | --- |
| `--me-font-size` | Base formula text and relative script sizes | `22px` in standalone editors |
| `--me-min-font-size` | Minimum editing glyph/input size, including nested fractions and scripts | `14px`; `0px` disables the floor |
| `--me-ui-font-family` | Toolbars, menus and helper text | `system-ui, sans-serif` |
| `--me-text` | UI text and neutral math glyphs | Dark green/gray |
| `--me-muted` | Help text, line numbers, menu details | Muted gray/green |
| `--me-accent` | Buttons, active borders, matrix selection | Green |
| `--me-line` | Toolbar separators and control/menu borders | Pale gray/green |
| `--me-background` | Editor root | Transparent |
| `--me-panel-background` | Suggestion menus, symbol cards, inputs/selects in toolbars | White |
| `--me-toolbar-background` | Main toolbar | Transparent |
| `--me-subtle-background` | Symbol browser and grid tools | Pale neutral |
| `--me-hover-background` | Toolbar hover | Pale green |
| `--me-active-background` | Selected suggestion and active controls | Pale green |
| `--me-variable` | Variable tokens, including focused inputs | Blue |
| `--me-number` | Numeric tokens (`constant` token kind) | Brown/orange |
| `--me-symbol` | Symbol tokens | Purple |
| `--me-function` | Function/operator names and their legend | Teal |
| `--me-input-background` | Editing slot background | Context-specific slot tint |
| `--me-input-focus-background` | Focused/hovered slot background | Stronger context-specific tint |
| `--me-selection-background` | Text and structural range selection | Blue |
| `--me-selection-color` | Native selected input text | White |
| `--me-focus-color` | Keyboard focus indicator | Blue |
| `--me-radius` | Suggestion panel corners | `10px` |
| `--me-control-radius` | Buttons and toolbar fields | `4px`–`7px` depending on control |
| `--me-surface-padding` | Block editing area padding | `48px 32px` |
| `--me-inline-padding` | Native inline area padding | `2px 4px`; plugin compact fields `0 2px` |
| `--me-surface-min-height` | Block area minimum height | Standalone `190px`; plugin panels `60px` |
| `--me-toolbar-padding` | Main toolbar padding | `12px` |
| `--me-toolbar-gap` | Gap between main toolbar controls | `4px` |
| `--me-line-gap` | Gap between top-level equation rows | `18px` |
| `--me-menu-shadow` | Floating menu shadow | Soft dark shadow |
| `--me-menu-z-index` | Suggestion menu stacking level | `1000` |

Inline mode retains its content-driven minimum height. The editor reserves extra line space when scripts extend beyond the row. The host must allow this height to grow instead of clipping the editor into a fixed-height line.

Nested math uses TeX size ratios with a readable `14px` floor. The same floor applies to glyphs, measuring spans and focused inputs, so fractions and fences grow with their contents. Explicit small LaTeX styles are also subject to this editing floor. To use a larger minimum:

```css
.product-math {
  --me-font-size: 22px;
  --me-min-font-size: 16px;
}
```

Set `--me-min-font-size: 0px` for unmodified TeX size ratios, for example in a typography comparison. Use a nonnegative length in `px` or `rem`. The floor changes editing layout only; it does not add sizing commands to LaTeX, change history, or enlarge suggestion menu labels. Formula export/KaTeX rendering is owned by the consumer and does not inherit this floor or semantic editing colors automatically. The base-size token is not an image scaling API.

## Dark and monochrome themes

Define a theme in your own stylesheet. Supply foregrounds and backgrounds together so active inputs, selection and menus remain readable.

```css
.product-math[data-theme='dark'] {
  color-scheme: dark;
  --me-background: #18232c;
  --me-text: #e5edf3;
  --me-muted: #a4b5c2;
  --me-line: #435565;
  --me-panel-background: #202f3b;
  --me-subtle-background: #243441;
  --me-hover-background: #334857;
  --me-active-background: #354e61;
  --me-accent: #83d5bc;
  --me-variable: #9ac7ff;
  --me-number: #ffc28b;
  --me-symbol: #d0b7ff;
  --me-function: #7bddd5;
  --me-input-background: #223444;
  --me-input-focus-background: #334d63;
  --me-selection-background: #436483;
  --me-selection-color: #fff;
  --me-focus-color: #9ac7ff;
}

.product-math[data-theme='mono'] {
  --me-variable: #303740;
  --me-number: #303740;
  --me-symbol: #303740;
  --me-function: #303740;
  --me-input-background: #f1f2f4;
  --me-input-focus-background: #e0e4e9;
}
```

Change `data-theme`, an ancestor class, or inline custom properties without remounting. The semantic model remains intact even when all token colors match.

## Suggestions, separate toolbars and iframes

Suggestion and selection-wrapping menus usually mount under `document.body` or the nearest dialog. Both renderers copy the owning editor's resolved presentation tokens to these menus. Two editors can use different themes without applying a global `.me-suggestion-panel` rule. Ancestor attribute changes, window resizing and preferred color-scheme changes refresh the menu theme. Dynamic stylesheet replacement without those events is picked up on the next menu render/open; prefer changing a scoped class or custom property.

Host integrations keep menus inside the math node's event boundary. They use the same glyphs, labels and details as the main React editor. Pointer movement highlights candidates; a stationary pointer does not replace keyboard choices when the list scrolls or redraws. Menu text does not inherit paragraph alignment or letter spacing. Ordinary scrolling text areas do not reduce the fixed menu's height; dialogs and clipping containers that establish a local containing block still constrain it. In a short dialog, the native menu hides its guidance before reducing the space for selectable rows.

An independently mounted toolbar inherits from **its own host**. Put it under the same themed ancestor or apply the same theme class to the editor and toolbar containers. A toolbar shared between different themes does not automatically switch to the selected editor's theme.

CSS does not cross document boundaries. For a TinyMCE classic iframe, load both core and plugin stylesheets using `content_css` and load your theme CSS into that iframe too. Apply the theme to its body or a wrapper within that document. Style a shared toolbar outside the iframe separately. The menu bridge uses the editor's owner document; it does not copy parent-page CSS into an iframe. See [TinyMCE integration](../math-editor-integrations/docs/TINYMCE.md).

## Editor plugin chrome

Import the chosen plugin's `style.css` alongside the core CSS. Shared plugin panels, Apply/Cancel buttons, size controls and hover states use the same `--me-*` palette. Additional host chrome variables are:

| Variable | Controls |
| --- | --- |
| `--bme-inline-background` | Background behind an in-place math draft |
| `--bme-action-color` | Text on the primary Apply button (default white) |
| `--bme-error-color` | Draft validation messages |

Formula size in host integrations is a **document attribute**: the plugin measures surrounding prose and combines it with the formula's saved percentage. Use the plugin's `fontSize` attribute/size controls for persisted math size. The internal `--bme-font-size` is computed from that value; setting a standalone `--me-font-size` on a wrapper does not override persisted host sizing.

For dark plugin fields, also set `--bme-inline-background: #223444` and choose a readable `--bme-action-color` for your accent. Themes style editor UI, not the surrounding host editor's own menu bar or rendered formula HTML.

## Custom toolbar and layout

Use `toolbar: false` for editor-only embedding, a list of structure kinds to limit commands, or `toolbarMaxItems` for overflow. A completely custom toolbar can call `session.execute(...)`. See [embedding](EMBEDDING.md) and the [session API](API-SESSION.md).

Treat internal `.me-*` and `.bme-*` layout selectors as implementation details. Prefer these variables over overriding fractions, scripts, radical paths, integral glyphs, or input positioning: those metrics are coordinated for editing and KaTeX comparison. Theme changes should be checked with keyboard focus, selections, suggestions and tall nested formulas, as well as at rest.
