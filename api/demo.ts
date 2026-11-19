/** Preview-only, noindex browser surface. The same-origin function answers queries. */
export function GET(): Response {
  const html = `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="robots" content="noindex,nofollow,noarchive">
  <title>Austral Beacon · Travel Assistant (demostración)</title>
  <style>
    :root{font-family:system-ui,-apple-system,sans-serif;background:#f4f7f5;color:#193536}
    body{max-width:720px;margin:3rem auto;padding:0 1.2rem;line-height:1.55}
    h1{line-height:1.2} .eyebrow{letter-spacing:.08em;text-transform:uppercase;color:#56716d;font-size:.8rem}
    form{display:grid;gap:.75rem}label{font-weight:700}
    textarea{font:inherit;width:100%;box-sizing:border-box;padding:1rem;border:1px solid #74948d;border-radius:8px;min-height:110px}
    button{font:inherit;font-weight:700;background:#0d3738;color:#fff;padding:.8rem 1.3rem;border:0;border-radius:8px;cursor:pointer;width:max-content}
    button:disabled{opacity:.5}section{background:white;border:1px solid #d7e0dd;border-radius:12px;padding:1.1rem;margin-top:1.2rem}
    .muted{color:#566c68;font-size:.9rem}details{margin-top:1rem;font-size:.9rem;color:#455c59}summary{cursor:pointer;font-weight:600}a{color:#145d62;overflow-wrap:anywhere}:focus-visible{outline:3px solid #a87827;outline-offset:3px}
    [hidden]{display:none!important}
  </style>
</head>
<body>
  <p class="eyebrow">Austral Beacon AI Lab · MVP</p>
  <h1>Travel Assistant</h1>
  <nav aria-label="Idioma"><strong>Español</strong> · <a href="/api/demo-en" lang="en">English preview</a></nav>
  <p>Demostración documental. Informa sobre destinos del sur austral de Chile. No confirma horarios, tarifas, cupos ni condiciones actuales.</p>
  <form id="form">
    <label for="question">Consulta</label>
    <textarea id="question" maxlength="2000" required>¿Qué es Puerto Williams?</textarea>
    <button id="submit" type="submit">Consultar</button>
  </form>
  <p id="status" role="status" aria-live="polite"></p>
  <section id="result" hidden>
    <h2>Respuesta</h2><p id="summary"></p>
    <div id="warning-area" hidden><h3>Información importante para tu consulta</h3><ul id="warnings"></ul></div>
    <details id="technical-notes" hidden><summary>Notas adicionales de verificación</summary><ul id="other-warnings"></ul></details>
    <div id="source-area" hidden><h3>Fuentes</h3><ul id="sources"></ul></div>
    <p class="muted" id="travel-disclaimer" hidden>Para horarios, tarifas y disponibilidad, confirma siempre con el operador o la fuente oficial.</p>
  </section>
  <script>
    const form=document.getElementById('form'),input=document.getElementById('question'),button=document.getElementById('submit');
    const status=document.getElementById('status'),result=document.getElementById('result'),summary=document.getElementById('summary');
    const warnings=document.getElementById('warnings'),sources=document.getElementById('sources');
    const extraWarnings=document.getElementById('other-warnings'),notes=document.getElementById('technical-notes'),disclaimer=document.getElementById('travel-disclaimer');
    form.addEventListener('submit',async(e)=>{
      e.preventDefault();const question=input.value.trim();if(!question||question.length>2000)return;
      button.disabled=true;result.hidden=true;status.textContent='Consultando…';
      const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),13000);
      try{
        const response=await fetch('/api/answer',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({question}),signal:controller.signal});
        if(!response.ok)throw new Error('Servicio no disponible');
        const data=await response.json();
        summary.textContent=typeof data.summary==='string'?data.summary:'No hay información suficiente.';
        warnings.replaceChildren();extraWarnings.replaceChildren();sources.replaceChildren();
        // Preserve every warning; prioritize only notices relevant to the question.
        // Presentation filtering cannot change the underlying verified answer or safeguards.
        const normalized=question.toLocaleLowerCase('es').normalize('NFD').replace(/[\\u0300-\\u036f]/g,'');
        const aboutTravel=/\\b(como llegar|viajar|vuelo|ferry|transporte|horario|frecuencia|tarifa|precio|cupo|disponibilidad|reserv|route|flight|schedule|price|fare|availability|how (do|can) i get|travel)\\b/.test(normalized);
        const aboutCommunity=/\\b(yagan|yaman|ukika|comunidad|indigena|community|indigenous|visit|visitar)\\b/.test(normalized);
        const aboutCoordinates=/\\b(coordenada|latitud|longitud|mapa|ubicacion exacta|coordinate|latitude|longitude|map|exact location)\\b/.test(normalized);
        const all=Array.isArray(data.warnings)?data.warnings:[];
        for(const value of all){
          if(typeof value!=='string')continue;
          const low=value.toLocaleLowerCase('es');
          const transport=low.includes('horarios')&&low.includes('tarifas');
          const community=low.includes('comunidades indigenas')||low.includes('comunidades indígenas');
          const coordinates=low.includes('coordenadas')||low.includes('geometría canónica');
          const show=(transport&&aboutTravel)||(community&&aboutCommunity)||(coordinates&&aboutCoordinates)||(!transport&&!community&&!coordinates);
          const item=document.createElement('li');item.textContent=value;
          (show?warnings:extraWarnings).append(item);
        }
        document.getElementById('warning-area').hidden=!warnings.childElementCount;
        notes.hidden=!extraWarnings.childElementCount;
        notes.open=false;
        disclaimer.hidden=!aboutTravel;
        for(const source of Array.isArray(data.sources)?data.sources:[]){if(!source||typeof source.title!=='string')continue;const item=document.createElement('li');let valid=false;try{const url=new URL(source.url);valid=url.protocol==='http:'||url.protocol==='https:';}catch{}if(valid){const link=document.createElement('a');link.href=source.url;link.textContent=source.title;link.rel='noopener noreferrer';link.target='_blank';item.append(link);}else item.textContent=source.title;sources.append(item);}
        document.getElementById('source-area').hidden=!sources.childElementCount;
        status.textContent='';result.hidden=false;
      }catch{status.textContent='El servicio de prueba no está disponible. No se ha enviado ninguna reserva.';}finally{clearTimeout(timer);button.disabled=false;}
    });
  </script>
</body>
</html>`;
  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex, nofollow, noarchive",
      "X-Content-Type-Options": "nosniff",
      "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline'; connect-src 'self'; base-uri 'none'; form-action 'self'; frame-ancestors 'self'",
    },
  });
}
