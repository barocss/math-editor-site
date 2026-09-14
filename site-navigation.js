// Shared by React, native sample pages and the static documentation renderer.
const escape = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        char
      ],
  );
export function renderSiteNavigation({
  locale = "en",
  active = "",
  root = "/",
  messages,
}) {
  const text = messages[locale];
  const href = (path, hash = "") => `${root}${path}?lang=${locale}${hash}`;
  const current = (id) => (active === id ? ' aria-current="page"' : "");
  const link = (id, target) =>
    `<a href="${escape(target)}" data-site-label="${id}"${current(id)}>${escape(
      text[id],
    )}</a>`;
  return `<header class="math-site-header"><div class="math-site-header-inner">
    <a class="math-site-brand" href="${escape(
      href(""),
    )}">barocss <span>/ math</span></a>
    <nav class="math-site-links" aria-label="${escape(text.main)}">
      ${link("playground", href("", "#playground"))}
      <details class="math-site-samples"><summary data-site-label="samples"${
        ["adapters", "integrations", "layouts", "textEditors"].includes(active)
          ? ' data-active="true"'
          : ""
      }>${escape(text.samples)}</summary><div>
        ${link("adapters", href("adapters.html"))}${link("integrations", href("integrations/"))}
      ${link("textEditors", href("text-editors.html"))}${link("layouts", href("layouts.html"))}</div></details>
      ${link("install", href("", "#install"))}${link(
        "docs",
        href("docs/index.html"),
      )}<a href="https://www.npmjs.com/package/@barocss/math-editor">npm ↗</a>
    </nav>
    <label class="math-site-language"><span data-site-label="language">${escape(
      text.language,
    )}</span><select aria-label="Language / 언어" data-site-locale>
      <option value="ko"${
        locale === "ko" ? " selected" : ""
      }>한국어</option><option value="en"${
        locale === "en" ? " selected" : ""
      }>English</option>
    </select></label>
  </div></header>`;
}

/** A React host can change locale without reloading its in-progress formula. */
export function bindSiteNavigation(host, onLocaleChange) {
  const select = host.querySelector("[data-site-locale]");
  const samples = host.querySelector(".math-site-samples");
  const doc = host.ownerDocument;
  const change = () => {
    if (onLocaleChange) return onLocaleChange(select.value);
    const target = new URL(doc.defaultView.location.href);
    target.searchParams.set("lang", select.value);
    doc.defaultView.location.assign(target.href);
  };
  const outside = (event) => {
    if (!samples.contains(event.target)) samples.open = false;
  };
  const escapeMenu = (event) => {
    if (event.key === "Escape" && samples.open) {
      samples.open = false;
      samples.querySelector("summary").focus();
    }
  };
  select.addEventListener("change", change);
  doc.addEventListener("pointerdown", outside, true);
  samples.addEventListener("keydown", escapeMenu);
  return () => {
    select.removeEventListener("change", change);
    doc.removeEventListener("pointerdown", outside, true);
    samples.removeEventListener("keydown", escapeMenu);
  };
}
