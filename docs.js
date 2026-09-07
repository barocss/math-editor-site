// Keep the document list available without JavaScript; collapse it on small screens when enhanced.
const documentMenu = document.querySelector('.docs-nav details');
const compactLayout = window.matchMedia('(max-width: 900px)');
function updateDocumentMenu() {
  documentMenu.open = !compactLayout.matches;
}
updateDocumentMenu();
compactLayout.addEventListener('change', updateDocumentMenu);
