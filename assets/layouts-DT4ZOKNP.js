import"./style-BZz4tLEA.js";import{c as M,k as P}from"./katex.min-7mfYMwxw.js";import{c as T,m as h,a as q}from"./dom-CZ9nPg1w.js";function A(e,o){const a=document.createElement("pre");a.className="me-latex-output",e.append(a);let l;const n=m=>{m.latex!==l&&(a.textContent=l=m.latex)};n(o.getSnapshot());const g=o.subscribe(n);return{destroy(){g(),a.remove()}}}function B(e,o,a){const l=document.createElement("div");l.className="me-rendered-preview",e.append(l);let n,g;const m=p=>{const k=JSON.stringify([p.latex,p.mode,p.locale]);k!==g&&(n==null||n(),n=void 0,l.replaceChildren(),n=a.render(l,p),g=k)};try{m(o.getSnapshot())}catch(p){throw l.remove(),p}const L=o.subscribe(m);let y=!1;return{destroy(){if(!y){y=!0,L();try{n==null||n()}finally{l.remove()}}}}}function D(e,o){e.innerHTML=`
    <header>
      <a href="/">← Math lab</a>
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
  `;for(const a of e.querySelectorAll("[data-message]"))a.textContent=o(a.dataset.message);e.querySelector("#layout-controls").setAttribute("aria-label",o("lab.controls"))}const x=document.querySelector("#layout-lab"),u=new URLSearchParams(location.search).get("lang")==="en"?"en":"ko",v=M(u);document.documentElement.lang=u;document.title=v("lab.title");D(x,v);const t=e=>x.querySelector(`#${e}`),d=T({locale:u});let N=0;const w=h(t("editor"),{session:d,toolbar:!1,onChange:()=>{t("changes").textContent=String(++N)}});let r,i,c;function $(e,o){try{P.render(o.latex,e,{displayMode:o.mode==="block",throwOnError:!0,trust:!1})}catch(a){e.textContent=a instanceof Error?a.message:String(a)}}function S(){r==null||r.destroy(),i==null||i.destroy(),c==null||c.destroy();const e=o=>t(o).checked;r=e("tools-toggle")?q(t("tools"),d,{onExecute:()=>w.focus()}):void 0,i=e("latex-toggle")?A(t("latex"),d):void 0,c=e("preview-toggle")?B(t("preview"),d,{render:$}):void 0,t("latex-panel").hidden=!i,t("preview-panel").hidden=!c}for(const e of["tools-toggle","latex-toggle","preview-toggle"])t(e).addEventListener("change",S);S();const I=h(t("inline"),{locale:u,mode:"inline",toolbar:!1,onCommit:({latex:e})=>{t("inline-result").textContent=`${v("lab.committed")} ${e}`}}),C=[];function E(e=!0){const o=document.createElement("div");t("blocks").append(o);const a=h(o,{locale:u,mode:"inline",toolbar:!1,enterBehavior:"commit",onCommit:()=>E()});C.push(a),e&&a.focus()}E(!1);const f=t("popup");let s;function b(e=!1){e&&s&&d.apply(s.session.getSnapshot().state),s==null||s.destroy(),s=void 0,f.close(),t("popup-open").focus()}t("popup-open").onclick=()=>{f.showModal(),s=h(t("popup-editor"),{locale:u,defaultValue:d.getSnapshot().state.document,enterBehavior:"commit",onCommit:()=>b(!0),onCancel:()=>b()}),s.focus()};t("popup-save").onclick=()=>b(!0);t("popup-cancel").onclick=()=>b();f.addEventListener("cancel",e=>{e.preventDefault(),b()});window.addEventListener("pagehide",()=>{s==null||s.destroy(),r==null||r.destroy(),i==null||i.destroy(),c==null||c.destroy(),w.destroy(),d.destroy(),I.destroy();for(const e of C)e.destroy()},{once:!0});
