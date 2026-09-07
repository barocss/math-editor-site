# LaTeX scope

The current, consolidated scope lives in [SUPPORT.md](./SUPPORT.md), including structural notation, all 90 catalog symbols, template discovery and editing limitations.

LaTeX is an export format. The editor's source of truth is its version-1 JSON presentation tree. Backslash aliases in suggestions do not make this a general LaTeX parser. External LaTeX paste, unsupported environments and macros remain future work; see the [roadmap](./ROADMAP.md).

The demo uses KaTeX 0.16.28 with `trust: false` and `throwOnError: true`. Unit tests render every catalog symbol and template, and representative matrices/line structures. Renderer compatibility is not proof of mathematical correctness or complete TeX support.
