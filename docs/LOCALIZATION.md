# Localization and suggestion languages

## Support policy

Locale identifies UI language and regional wording, not a country restriction. The library accepts custom language tags such as `fr`, `ja`, `zh-CN` and `pt-BR`; it does not maintain an allowlist of countries.

| Level | Available now | Meaning |
| --- | --- | --- |
| Complete bundled UI packs | `en`, `ko` | All library message keys are present, including toolbars, suggestions, symbol names, slot labels and accessibility text. The main demo has separate matching page packs. |
| Custom language packs | Host-registered JSON | Translate messages and supply search aliases. Missing messages fall back to English. No limit to two languages is imposed by the API. |
| Working example | Partial `fr` pack in `examples/locales/fr.json` | Demonstrates localized fraction/symbol/matrix discovery in the adapter demo. It is not a complete French translation. |
| Search regression coverage | French, Japanese, Chinese, Arabic, Hindi, German | Tests exercise localized labels, aliases and combining marks. These fixtures are not bundled translations or native-speaker certification. |
| RTL UI | `direction: "rtl"` option | Formula layout remains LTR. Full RTL interaction, screen-reader and OS IME validation remain release work. |

We will add complete bundled languages when all messages, symbol names, aliases and interpolation parameters are translated and reviewed, with browser tests. There is no committed date or claim that every locale is fully supported. A new language should not require editing renderer logic.

## Register a JSON pack

Start from `src/locales/en.json` for a complete translation. All message keys are stable English identifiers; translate values only. A partial pack is also valid:

```json
{
  "direction": "ltr",
  "messages": {
    "structure.fraction": "Fraction",
    "structure.fractionDetail": "Modifier le numérateur et le dénominateur",
    "slot.numerator": "Numérateur",
    "slot.denominator": "Dénominateur",
    "expression.line": "Expression ligne {line}",
    "matrix.size": "Matrice {rows}×{columns}",
    "symbol.elementOf": "Appartient à",
    "suggestion.create": "Créer à partir de « {query} »"
  },
  "aliases": {
    "fraction": ["rapport"],
    "matrix": ["matrice"],
    "symbol-∈": ["appartient", "élément"]
  }
}
```

```ts
import french from './fr.json';
import { registerMathLocale, createMathSession } from '@barocss/math-editor/core';
import { mountMathEditor } from '@barocss/math-editor/dom';

registerMathLocale('fr', french);
const session = createMathSession({ locale: 'fr-CA' });
const editor = mountMathEditor(host, { session });
// Uses fr-CA overrides if registered, otherwise fr, then en.
session.configure({ locale: 'ko' }); // Retains formula and undo history.
```

Register before mounting. Use the `locale` prop on React `MathEditor`, the shared DOM options on framework adapters, or the Web Component's locale attribute. A host may load packs with its own JSON imports, fetch, or i18n framework. The editor performs no fetching or automatic translation.

The complete configuration is `messages`, optional `aliases`, and optional `direction`. Message values use named placeholders such as `{line}`, `{rows}` and `{columns}`. Keep their names unchanged. There are no source-text keys or custom formatting callbacks.

## How discovery works

`findSuggestions(text, caret, locale)` uses the same language registry as the renderer. It returns localized candidate labels and descriptions while preserving insertion IDs and formula content.

- Search accepts the localized label, locale-pack aliases and existing English/Korean catalog aliases.
- Symbol triggers such as `/`, `^`, `E/` and `->` are language-independent. Matching literal symbols appear before structures.
- Word matching is case-insensitive prefix matching on the trailing word, optionally preceded by `\`. Unicode letters and combining marks are accepted; NFC normalization handles composed/decomposed accents without changing replacement offsets.
- Supply single-word aliases for multiword names. Space-separated phrases, transliteration, fuzzy matching, accent removal and language-specific word segmentation are not implemented.
- Symbol-browser search also includes translated names, aliases, glyphs and LaTeX spellings. It uses substring matching.

| Alias key | Applies to | Example |
| --- | --- | --- |
| Structure ID | A structure candidate | `fraction`, `root`, `cases`, `aligned` |
| `matrix` | All standard matrix size presets | `"matrix": ["matrice"]` |
| `identity` | All identity matrix size presets | `"identity": ["identité"]` |
| Exact preset ID | One size only | `matrix-3`, `identity-4` |
| `symbol-` + glyph | One literal symbol | `symbol-α`, `symbol-∈` |
| `template-` + template ID | One editable template | `template-quadratic`, `template-zero-2`, `template-vector-3` |

Message keys and suggestion IDs have different jobs: `structure.fraction` selects display text; `fraction` selects an insertion candidate's aliases. See `mathStructures`, `mathSymbols` and `mathTemplates` from `/core` for catalog entries, and [SYMBOLS.md](./SYMBOLS.md) for symbol names.

## Resolution and ownership

The small `translate(locale, key, parameters)` helper performs dictionary lookup, fallback and literal interpolation. It has no dependency on a UI framework.

1. Look up an exact locale override, then its base language, then English. Tags are trimmed and case-normalized. Only the first language subtag is used as the base: `zh-Hant-TW` falls back to `zh`, not `zh-Hant`.
2. Resolve named parameters once. `$` and braces in parameter values stay literal. Missing parameters remain visible as placeholders; unknown keys remain visible as keys.
3. Merge search aliases from the exact locale and base pack. Registering a custom tag again replaces its definition; built-in `ko` and `en` cannot be overwritten.

Registration is startup configuration and does not notify mounted views on its own. Change a locale prop or session option to refresh the UI. No ICU plurals, dates, number formatting or locale-dependent decimal parsing are provided. Locale never rewrites user math, document IDs, clipboard content or LaTeX.

The main demo's heading/help/footer copy lives separately in `apps/math-demo/src/locales`. Registering a library pack does not translate the surrounding Site/Word/Slide/Note interface. To expose a third language throughout a host, add both its page translations and its library pack, then select the same locale for each. The main demo currently exposes only its complete English and Korean page translations.

Raw built-in packs are exported as `@barocss/math-editor/locales/en.json` and `/locales/ko.json`. `mathEnglishMessages` exposes the canonical key/value dictionary for tooling. The build emits equivalent ESM data modules so runtime imports do not require JSON import attributes. Edit JSON, never generated `dist` files.

## Verify a new pack

Compare its message keys and placeholder names against English. Exercise translated labels and aliases for a literal symbol, a structure, a matrix size and a template. Check nested slot names, language switching without data loss, and missing-message fallback. For a complete release, also review wording with a fluent speaker and test keyboard, screen-reader and relevant IME/RTL behavior in target browsers.

See [VALIDATION.md](./VALIDATION.md) for current test coverage and [ROADMAP.md](./ROADMAP.md) for remaining renderer and accessibility work.
