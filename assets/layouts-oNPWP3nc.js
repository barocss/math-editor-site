import{aC as T,aE as P,aD as D}from"./style-D2uUzp2L.js";import{c as N,m as h,b as q,g as A,a as B}from"./dom-DuX_i-Pm.js";import{l as $}from"./katex-options-6CNcQzBb.js";import{c as H}from"./i18n-B_j_LDgG.js";import{k as I}from"./katex.min-D4PEI1Lh.js";function O(e,o){const a=document.createElement("pre");a.className="me-latex-output",e.append(a);let i;const n=m=>{m.latex!==i&&(a.textContent=i=m.latex)};n(o.getSnapshot());const g=o.subscribe(n);return{destroy(){g(),a.remove()}}}function V(e,o,a){const i=document.createElement("div");i.className="me-rendered-preview",e.append(i);let n,g;const m=u=>{const E=JSON.stringify([u.latex,u.mode,u.locale]);E!==g&&(n==null||n(),n=void 0,i.replaceChildren(),n=a.render(i,u),g=E)};try{m(o.getSnapshot())}catch(u){throw i.remove(),u}const L=o.subscribe(m);let x=!1;return{destroy(){if(!x){x=!0,L();try{n==null||n()}finally{i.remove()}}}}}function X(e,o){e.innerHTML=`
    <header>
      <h1 data-message="lab.title"></h1>
      <p data-message="lab.description"></p>
    </header>
    <nav id="layout-controls">
      <label><input id="tools-toggle" type="checkbox" checked> Toolbar</label>
      <label><input id="latex-toggle" type="checkbox" checked> LaTeX</label>
      <label><input id="preview-toggle" type="checkbox" checked> Preview</label>
      <button id="popup-open" data-message="lab.openPopup"></button>
    </nav>
    <section class="lab-card">
      <div id="tools"></div>
      <div id="editor"></div>
    </section>
    <div class="lab-outputs">
      <section id="latex-panel" class="lab-card"><h2>LaTeX</h2><div id="latex"></div></section>
      <section id="preview-panel" class="lab-card"><h2>Preview</h2><div id="preview"></div></section>
    </div>
    <p>onChange API: <output id="changes">0</output></p>
    <section class="lab-card">
      <h2>Inline editing</h2>
      <p>
        <span data-message="lab.inlineBefore"></span>
        <span id="inline"></span>
        <span data-message="lab.inlineAfter"></span>
        <span id="inline-result" role="status"></span>
      </p>
    </section>
    <section class="lab-card">
      <h2 data-message="lab.blocksTitle"></h2>
      <p data-message="lab.blocksDescription"></p>
      <div id="blocks"></div>
    </section>
    <dialog id="popup">
      <h2 data-message="lab.popupTitle"></h2>
      <p data-message="lab.popupDescription"></p>
      <div id="popup-editor"></div>
      <button id="popup-save" data-message="lab.apply"></button>
      <button id="popup-cancel" data-message="lab.cancel"></button>
    </dialog>
  `;for(const a of e.querySelectorAll("[data-message]"))a.textContent=o(a.dataset.message);e.querySelector("#layout-controls").setAttribute("aria-label",o("lab.controls"))}const v=document.querySelector("#layout-lab"),r=new URLSearchParams(location.search).get("lang")==="en"?"en":"ko",f=H(r);document.documentElement.lang=r;document.title=f("lab.title");X(v,f);const y=document.createElement("div");y.innerHTML=T({locale:r,active:"layouts",messages:P});v.before(y);D(y);const t=e=>v.querySelector(`#${e}`),p=N({locale:r});let G=0;const M=h(t("editor"),{session:p,toolbar:!1,onChange:()=>{t("changes").textContent=String(++G)}});let d,l,c;function J(e,o){try{I.render(o.latex,e,{displayMode:o.mode==="block",throwOnError:!0,trust:!1,macros:$})}catch(a){e.textContent=a instanceof Error?a.message:String(a)}}function S(){d==null||d.destroy(),l==null||l.destroy(),c==null||c.destroy();const e=o=>t(o).checked;d=e("tools-toggle")?B(t("tools"),p,{onExecute:()=>M.focus()}):void 0,l=e("latex-toggle")?O(t("latex"),p):void 0,c=e("preview-toggle")?V(t("preview"),p,{render:J}):void 0,t("latex-panel").hidden=!l,t("preview-panel").hidden=!c}for(const e of["tools-toggle","latex-toggle","preview-toggle"])t(e).addEventListener("change",S);S();const R=h(t("inline"),{locale:r,mode:"inline",toolbar:!1,onCommit:({latex:e})=>{t("inline-result").textContent=`${f("lab.committed")} ${e}`}}),w=[];function C(e=!0){const o=document.createElement("div");t("blocks").append(o);const a=h(o,{locale:r,mode:"inline",toolbar:!1,enterBehavior:"commit",onCommit:()=>C()});w.push(a),e&&a.focus()}C(!1);const k=t("popup");let s;function b(e=!1){e&&s&&p.apply(s.session.getSnapshot().state),s==null||s.destroy(),s=void 0,k.close(),t("popup-open").focus()}t("popup-open").onclick=()=>{k.showModal(),s=h(t("popup-editor"),{locale:r,defaultValue:p.getSnapshot().state.document,enterBehavior:"commit",onCommit:()=>b(!0),onCancel:()=>b()}),s.focus()};t("popup-save").onclick=()=>b(!0);t("popup-cancel").onclick=()=>b();k.addEventListener("cancel",e=>{e.preventDefault(),b()});window.addEventListener("pagehide",()=>{s==null||s.destroy(),d==null||d.destroy(),l==null||l.destroy(),c==null||c.destroy(),M.destroy(),p.destroy(),R.destroy();for(const e of w)e.destroy()},{once:!0});q(v,{locale:r,install:"npm install @barocss/math-editor katex",code:`import { createMathSession } from "@barocss/math-editor/core";
import { mountMathEditor, mountMathToolbar } from "@barocss/math-editor/dom";
import "@barocss/math-editor/style.css";

const session = createMathSession();
const field = mountMathEditor(editorElement, { session, toolbar: false });
const toolbar = mountMathToolbar(toolbarElement, session);`,steps:A[r].layoutSteps});
