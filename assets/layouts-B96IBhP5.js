import{c as P,r as T,n as N,b as q}from"./style-DLHZhnv-.js";import{k as A,l as B}from"./katex.min-uqarkG4-.js";import{c as D,m as v,a as $}from"./dom-BjSkF9mC.js";function H(e,o){const a=document.createElement("pre");a.className="me-latex-output",e.append(a);let i;const n=m=>{m.latex!==i&&(a.textContent=i=m.latex)};n(o.getSnapshot());const g=o.subscribe(n);return{destroy(){g(),a.remove()}}}function I(e,o,a){const i=document.createElement("div");i.className="me-rendered-preview",e.append(i);let n,g;const m=u=>{const w=JSON.stringify([u.latex,u.mode,u.locale]);w!==g&&(n==null||n(),n=void 0,i.replaceChildren(),n=a.render(i,u),g=w)};try{m(o.getSnapshot())}catch(u){throw i.remove(),u}const M=o.subscribe(m);let x=!1;return{destroy(){if(!x){x=!0,M();try{n==null||n()}finally{i.remove()}}}}}function O(e,o){e.innerHTML=`
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
  `;for(const a of e.querySelectorAll("[data-message]"))a.textContent=o(a.dataset.message);e.querySelector("#layout-controls").setAttribute("aria-label",o("lab.controls"))}const h=document.querySelector("#layout-lab"),p=new URLSearchParams(location.search).get("lang")==="en"?"en":"ko",f=P(p);document.documentElement.lang=p;document.title=f("lab.title");O(h,f);const y=document.createElement("div");y.innerHTML=T({locale:p,active:"layouts",messages:N});h.before(y);q(y);const t=e=>h.querySelector(`#${e}`),d=D({locale:p});let V=0;const S=v(t("editor"),{session:d,toolbar:!1,onChange:()=>{t("changes").textContent=String(++V)}});let c,l,r;function X(e,o){try{A.render(o.latex,e,{displayMode:o.mode==="block",throwOnError:!0,trust:!1,macros:B})}catch(a){e.textContent=a instanceof Error?a.message:String(a)}}function C(){c==null||c.destroy(),l==null||l.destroy(),r==null||r.destroy();const e=o=>t(o).checked;c=e("tools-toggle")?$(t("tools"),d,{onExecute:()=>S.focus()}):void 0,l=e("latex-toggle")?H(t("latex"),d):void 0,r=e("preview-toggle")?I(t("preview"),d,{render:X}):void 0,t("latex-panel").hidden=!l,t("preview-panel").hidden=!r}for(const e of["tools-toggle","latex-toggle","preview-toggle"])t(e).addEventListener("change",C);C();const J=v(t("inline"),{locale:p,mode:"inline",toolbar:!1,onCommit:({latex:e})=>{t("inline-result").textContent=`${f("lab.committed")} ${e}`}}),E=[];function L(e=!0){const o=document.createElement("div");t("blocks").append(o);const a=v(o,{locale:p,mode:"inline",toolbar:!1,enterBehavior:"commit",onCommit:()=>L()});E.push(a),e&&a.focus()}L(!1);const k=t("popup");let s;function b(e=!1){e&&s&&d.apply(s.session.getSnapshot().state),s==null||s.destroy(),s=void 0,k.close(),t("popup-open").focus()}t("popup-open").onclick=()=>{k.showModal(),s=v(t("popup-editor"),{locale:p,defaultValue:d.getSnapshot().state.document,enterBehavior:"commit",onCommit:()=>b(!0),onCancel:()=>b()}),s.focus()};t("popup-save").onclick=()=>b(!0);t("popup-cancel").onclick=()=>b();k.addEventListener("cancel",e=>{e.preventDefault(),b()});window.addEventListener("pagehide",()=>{s==null||s.destroy(),c==null||c.destroy(),l==null||l.destroy(),r==null||r.destroy(),S.destroy(),d.destroy(),J.destroy();for(const e of E)e.destroy()},{once:!0});
