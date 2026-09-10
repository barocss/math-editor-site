import { bindSiteNavigation, renderSiteNavigation } from "/site-navigation.js";
// Keep the document list available without JavaScript; collapse it on small screens when enhanced.
const documentMenu = document.querySelector(".docs-nav details");
const compactLayout = window.matchMedia("(max-width: 900px)");
function updateDocumentMenu() {
  documentMenu.open = !compactLayout.matches;
}
updateDocumentMenu();
compactLayout.addEventListener("change", updateDocumentMenu);

// The guides are English source documents; retain the chosen demo language
// while moving through static documentation pages and integration examples.
const locale =
  new URLSearchParams(location.search).get("lang") === "ko" ? "ko" : "en";
for (const link of document.querySelectorAll("a[href]")) {
  if (link.hasAttribute("data-locale-switch")) continue;
  const href = link.getAttribute("href");
  if (!href || href.startsWith("#")) continue;
  const target = new URL(href, location.href);
  if (target.origin !== location.origin) continue;
  if (
    target.pathname === "/" ||
    target.pathname.startsWith("/docs/") ||
    target.pathname.startsWith("/integrations/")
  ) {
    target.searchParams.set("lang", locale);
    link.href = `${target.pathname}${target.search}${target.hash}`;
  }
}

// The document itself stays English; the common navigation follows the selected UI locale.
const header = document.querySelector(".math-site-header");
const unbindHeader = bindSiteNavigation(header);
if (locale === "ko") {
  fetch("/site-navigation.json")
    .then((response) => response.json())
    .then((messages) => {
      const next = document.createElement("div");
      next.innerHTML = renderSiteNavigation({
        locale,
        active: "docs",
        messages,
      });
      unbindHeader();
      header.replaceWith(next.firstElementChild);
      bindSiteNavigation(document.querySelector(".math-site-header"));
    })
    .catch(() => {
      /* Static English navigation remains usable if locale loading fails. */
    });
}
