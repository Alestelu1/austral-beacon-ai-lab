import { GET as spanishDemo } from "./demo.js";

/**
 * English counterpart of the protected preview UI.
 * Both pages use the same /api/answer endpoint; locale is explicit.
 * English coverage is intentionally limited to audited demo cases.
 */
export async function GET(): Promise<Response> {
  const original = spanishDemo();
  let html = await original.text();
  const replacements: Array<[string, string]> = [
    ['<html lang="es">', '<html lang="en">'],
    ['<nav aria-label="Idioma"><strong>Español</strong> · <a href="/api/demo-en" lang="en">English preview</a></nav>',
     '<nav aria-label="Language"><a href="/api/demo" lang="es">Español</a> · <strong>English preview</strong></nav>'],
    ['<p><a href="https://www.endoftheworld.travel/es/destinations/puerto-williams/" rel="noopener noreferrer">Volver a la guía de Puerto Williams en End of the World Travel ↗</a></p>',
     '<p><a href="https://www.endoftheworld.travel/destinations/puerto-williams/" rel="noopener noreferrer">Return to the Puerto Williams guide on End of the World Travel ↗</a></p>'],
    ['(demostración)', '(preview)'],
    ['Demostración documental. Informa sobre destinos del sur austral de Chile. No confirma horarios, tarifas, cupos ni condiciones actuales.',
     'Documented information about Chile’s far south. This preview does not confirm live schedules, fares, seats or availability. English coverage is currently limited to two verified examples.'],
    ['<label for="question">Consulta</label>', '<label for="question">Your question</label>'],
    ['¿Qué es Puerto Williams?', 'What is Puerto Williams?'],
    ['<button id="submit" type="submit">Consultar</button>', '<button id="submit" type="submit">Ask</button>'],
    ['<h2>Respuesta</h2>', '<h2>Answer</h2>'],
    ['Información importante para tu consulta', 'Important information'],
    ['Notas adicionales de verificación', 'Additional verification notes'],
    ['<h3>Fuentes</h3>', '<h3>Sources</h3>'],
    ['Para horarios, tarifas y disponibilidad, confirma siempre con el operador o la fuente oficial.',
     'For schedules, fares and availability, always confirm directly with the operator or official source.'],
    ["status.textContent='Consultando…'", "status.textContent='Checking information…'"],
    ["summary.textContent=typeof data.summary==='string'?data.summary:'No hay información suficiente.'",
     "summary.textContent=typeof data.summary==='string'?data.summary:'Insufficient information.'"],
    ["body:JSON.stringify({question})", "body:JSON.stringify({question,locale:'en'})"],
    ["status.textContent='El servicio de prueba no está disponible. No se ha enviado ninguna reserva.'",
     "status.textContent='The preview service is not available. No booking has been made.'"],
  ];
  for (const [from, to] of replacements) {
    if (!html.includes(from)) throw new Error("English demo template mismatch");
    html = html.replace(from, to);
  }
  // The actual source-language warning matching is not used for translated
  // facts: the English API returns its own known warning categories.
  return new Response(html, { status: 200, headers: original.headers });
}
