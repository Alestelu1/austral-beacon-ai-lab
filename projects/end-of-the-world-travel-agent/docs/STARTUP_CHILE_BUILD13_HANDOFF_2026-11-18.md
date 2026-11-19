# Austral Beacon — Build 13 / Travel Assistant — Handoff operativo
Fecha de consolidación: 2026-11-18 (Chile).
Estado: PLAN ACTIVO; NO se ha desplegado ni ejecutado la suite completa en esta sesión.

## Objetivo y plazo
Enviar postulación Start-Up Chile BIG 13 idealmente el lunes 2026-11-23. Cierre oficial verificado: martes 2026-11-24, 13:00 GMT-3, https://startupchile.org/postula/.
Narrativa: Austral Beacon AI Lab es la infraestructura de conocimiento con procedencia verificable; Travel Assistant es primer producto; End of the World Travel (sitio Astro EN/ES) es primer vertical público y canal de validación. No afirmar ventas, clientes pagos, pilotos o uso sin evidencia.

## Fuentes de decisiones
- Documento adjunto en conversación 2026-11-18: Austral_Beacon_StartUp_Chile_Readiness_Analysis.docx, preparado 2026-10-12. Diagnóstico: base técnica sólida, integración web incompleta, validación externa y modelo B2B por probar. Propuesta primera clientela: pequeños operadores turísticos, alojamientos o portales que respondan preguntas repetitivas. Estrategia: entrevistas, landing CTA, demo, pilotos y señal de precio.
- Documento adjunto MIFA Guía para ganar fondos Abiertos (1).pdf, edición septiembre 2026: útil como marco metodológico, NO como fuente de fechas/requisitos de BIG13.
- Bases oficiales BIG13: https://startupchile.org/content/uploads/terms-conditions-big-13.pdf y página de postulación. Revisar requisitos exactos, incompatibilidades, presupuesto y anexos ANTES de enviar.
- Repositorios: https://github.com/Alestelu1/austral-beacon-ai-lab y https://github.com/Alestelu1/end-of-the-world-travel-astro.

## Verificación estática en GitHub efectuada el 2026-11-18
Ruta del agente: projects/end-of-the-world-travel-agent/
- package.json scripts: npm run typecheck, npm test, npm run build:client, npm run api. No pruebas ejecutadas en este chat; último handoff de 2026-08-31 informa 35 archivos/358 pruebas correctas, cifra histórica.
- src/api/app.ts: GET /health, POST /api/answer con JSON {question}; tamaño máximo cuerpo 16 KB; respuesta JSON; sin comprobación explícita de Content-Type, sin rate limit visible en servidor.
- src/api/server.ts: inicia Node HTTP en PORT o 3000.
- src/ui/web/app.client.ts: fetch('/api/answer') mismo origen; UI es-CL.
- src/ui/web/renderAnswer.ts: solo renderConnectivity y renderDestination; relationship, antarctic-access, strait-info, knowledge se envían a unsupported aunque la API pudiera soportarlas.
- docs/WEB_INTEGRATION_READINESS.md: auditoría histórica identifica falta de rate limiting, timeouts, tratamiento de errores, compatibilidad de despliegue y renderizado de intenciones. Verificar puntos vigentes antes de cambiar código.
- Canonical source: knowledge-base/; sus proyecciones public_core son autoridad; no duplicar datos de verdad en sitio y asistente. Evitar geopolitical/restricted_context en Travel.
- End of the World Travel: Astro, repositorio separado, publicación ya realizada previamente. No mover dominios ni tocar DNS por esta integración.

## Decisión de MVP
Priorizar motor determinístico y GoldenCorpusRetriever offline; sin obligación de embeddings, Gemini ni nuevo modelo generativo. Primera demo: conectividad Punta Arenas–Puerto Williams, identidad/visita Cabo de Hornos, no-evidencia para información operacional; caso Villa O'Higgins solamente si se verifica proyección/datos. Inglés/español deben preservar hechos y reglas, aunque la interfaz inicial no sea todavía plenamente bilingüe. No ofrecer reservas, pagos, horarios o precios vigentes sin fuente en vivo.

## Orden de ejecución de código (próxima sesión)
1. Abrir workspace repositorio; git status/branch y pull; no sobrescribir trabajo ajeno.
2. cd projects/end-of-the-world-travel-agent; npm ci; npm run typecheck; npm run build:client; npm test. Registrar resultado nuevo (sin atribuir 358 tests actuales sin correr).
3. Iniciar npm run api; verificar GET /health, POST /api/answer con preguntas conocidas y negativas; guardar ejemplos redactados.
4. Elegir ruta de despliegue con Node persistente o adaptar a serverless si la plataforma lo requiere; NO asumir que un servidor createServer.listen() se despliega directamente a funciones Vercel.
5. Completar renderizado de intenciones desde un contrato typed; preservar escape de HTML y warnings/sources; escribir tests.
6. Añadir protección frente a abuso/rate limit, timeouts, límites de question y manejo explícito de Content-Type; revisar privacidad y logs.
7. Integración Astro mediante ruta same-origin /api/answer o proxy explícito; revisar CSP/CORS, estado móvil, accesibilidad, localización EN/ES y links internos.
8. Deploy Preview + smoke test E2E; publicar solo con aprobación del dueño, guardar URL + capturas + resultados.
9. Medir visitas/uso/CTA con política de privacidad; recoger 1-3 testimonios/entrevistas reales sin fabricar datos.
10. Preparar aplicación Build 13 con problema, solución, innovación, mercado, competencia, modelo B2B como hipótesis, métricas reales, presupuesto, equipo, riesgos, demo/video y revisión legal de admisibilidad.

## Bloqueos y límites
- Ninguna ejecución reciente de tests verificada.
- Ningún despliegue público del agente verificado.
- Ni el nivel de cobertura EN/ES del agente ni el caso Villa O'Higgins están validados.
- Datos de usuarios o negocios no deben inventarse para la postulación.
- Verificar requisitos de las bases 2026, persona natural sin sociedad y requisitos de equipo antes del envío.

## Prioridades por día
18 nov: auditoría reproducible y contrato de integración.
19 nov: renderizadores y API segura.
20 nov: widget Astro, preview.
21 nov: QA bilingüe + demo.
22 nov: evidencia + formulario + video.
23 nov: revisión y envío temprano.

## Protocolo contra longitud del chat
Este archivo es el handoff persistente. Al abrir un chat nuevo, pedir: «Continúa desde projects/end-of-the-world-travel-agent/docs/STARTUP_CHILE_BUILD13_HANDOFF_2026-11-18.md del repo austral-beacon-ai-lab. Comprueba estado actual de git, aplica el siguiente paso sin reiniciar arquitectura ni suponer tareas completadas. Respeta la fecha 23 de noviembre». Actualizar este archivo al final de cada etapa con commit/PR, tests, blockers y decisiones. No guardar credenciales en el documento.

## Actualización técnica 2026-11-18 — PR #27 (primera implementación)
- Draft PR: https://github.com/Alestelu1/austral-beacon-ai-lab/pull/27, rama fix/travel-assistant-web-intents-build13. No fusionado, no producción ni DNS.
- Se añadió renderizador web de `relationship`, `antarctic-access`, `strait-info`, `knowledge`, con resumen, advertencias, fuentes seguras y enlaces internos controlados; pruebas web nuevas.
- Se corrigieron incompatibilidades TypeScript preexistentes: campo canónico Strait `statement` vs `claim`, lista de `blocked_claims` como strings y type narrowing en test de Puerto Williams.
- CI de GitHub run https://github.com/Alestelu1/austral-beacon-ai-lab/actions/runs/44246207214: **success** en typecheck, build:client, test:rag y tests web enfocados. Las pruebas se ejecutaron en GitHub Actions, no en la máquina local.
- Nota de deuda técnica: al ensayar temporalmente `npm test` completo, se observaron **29 fallos / 435 tests** repartidos en pruebas históricas de varios subsistemas (incluidos tests que llaman a un commit base ya ausente). No son evidencia de regresión en los tests web nuevos; requieren issue separada, investigación y rebaseline. No declarar «suite completa verde».
- Además `npm ci` reportó 9 vulnerabilidades por audit en dependencias (1 moderate, 6 high, 2 critical). Revisar `npm audit` y mitigaciones antes de publicar API, sin `npm audit fix --force` a ciegas.
- Próximo paso de código: revisar PR #27, luego implementar protección API/hosting y widget Astro con preview; ejecutar smoke test y sincronización EN/ES. No fusionar automáticamente sin revisión.

## Actualización 2026-11-18 — API y primer componente Astro (sin publicación)
- **PR #29** https://github.com/Alestelu1/austral-beacon-ai-lab/pull/29 (Draft): acepta `Content-Type: application/json`, rechaza preguntas de más de 2000 caracteres, impone espera máxima configurable (12 s por defecto) y entrega respuesta HTTP 504 controlada. Cinco pruebas nuevas `tests/apiGuards.test.ts`; conservadas pruebas API existentes. Las correcciones de tipos de PR #27 se repitieron para mantener rama autovalidable; comprobar deduplicación en merge.
- CI último run PR #29 **success**: https://github.com/Alestelu1/austral-beacon-ai-lab/actions/runs/44247154703, incluye `npm run typecheck`, RAG y pruebas API. El timeout HTTP NO cancela el trabajo interno en curso; requiere abordaje operativo.
- **PR #3 Astro** https://github.com/Alestelu1/end-of-the-world-travel-astro/pull/3 (Draft): componente aislado `src/components/TravelAssistantPreview.astro` con EN/ES de interfaz, UI accesible, sanitización textContent, validación y fetch same-origin. Documento `TRAVEL_ASSISTANT_INTEGRATION.md` registra requisito de API/edge proxy. No hay página pública ni entrada en navegación; componente aún NO está conectado a endpoint real.
- Astro usa `output: 'static'`. La ruta `/api/answer` no puede servirse mediante esa app por sí sola. Resolver backend (Node persistente / serverless adaptado) más proxy HTTPS same-origin y rate limiting ANTES de habilitar demo. No desplegar API sin seguridad ni confirmar respuestas EN/ES solamente porque la interfaz está traducida.
- Sigue pendiente comprobar compilación CI del PR #3; inspeccionar https://github.com/Alestelu1/end-of-the-world-travel-astro/actions/runs/44247354778 y registrar conclusión. Revisar además accesibilidad, backend deployment y revisión npm audit (Issue #28).

### CI Astro PR #3 — Confirmación
La ejecución https://github.com/Alestelu1/end-of-the-world-travel-astro/actions/runs/44247354778 finalizó **SUCCESS**: comprobación Astro de tipos y contenido, build, verificación de configuración Vercel, redirects y simulación SEO offline. **Esto solo certifica compilación; no confirma funcionamiento API extremo a extremo** porque aún falta backend/proxy. En Vercel se observó una Preview ligada a la rama, pero el componente no se invoca desde ninguna página pública. No compartir Preview como demo funcional todavía.

## Actualización de despliegue protegido (noche 18 nov 2026 Chile)
- Se creó proyecto Vercel separado **austral-beacon-travel-agent-preview**, project ID `prj_IIIA8j6D9EE1CCGKffYpY5UZxpKa`, team ID `team_DqiZt3c5ypzg3PdRDWb77XfC`; framework Other/null, Node 24.x, SSO Protection **all**, ningún dominio personalizado, sin cambios DNS ni publicación en End of the World Travel.
- Código en PR #30 (Draft), rama `feat/travel-vercel-preview-api-build13`: `api/answer.ts`, `api/health.ts`, `api/demo.ts`, `api/smoke.ts`, paquete y tsconfig raíz. Ruta del motor real: `projects/end-of-the-world-travel-agent/src/application/answerViaAssistant.ts`; importa el corpus canónico desde raíz. Flags: `TRAVEL_ASSISTANT_PREVIEW_ENABLED=true` **solo en Preview, rama exacta**, configurado como variable cifrada; ningún flag de Production.
- El primer despliegue Vercel con framework Node falló por falta de entrypoint; se corrigió framework a null/Other y Node 24. Se corrigieron advertencias de compilación al incluir tsconfig ES2022 y TypeScript/@types/node en paquete raíz.
- Despliegue Preview validado con commit `3666d69f9ca051a6e1e356617dcc6a5cf6a2f863`, deployment ID `dpl_9qd4jsbgDeTY4nWEdZPqeMCRJ32d`, URL `https://austral-beacon-travel-agent-preview-5b38pckqr.vercel.app`; logs de build sin errores, ruta `GET /api/demo` HTTP 200 + noindex, prueba `GET /api/smoke` HTTP 200 con ambos casos OK (Puerto Williams supported/destination-info y pregunta sin evidencia unsupported/unknown). Smoke invoca la implementación `POST` internamente en el runtime remoto con Request JSON y comprueba status, pero **aún falta probar HTTP POST externo de navegador end-to-end**.
- La URL de demo protegida: `https://austral-beacon-travel-agent-preview-5b38pckqr.vercel.app/api/demo`. Requiere acceso Vercel por SSO. No compartir enlaces temporales con bypass de protección; no afirmar disponibilidad pública. Astro PR #3 agrega páginas `/assistant-preview/` EN y ES, noindex, pero el servicio separado no está conectado a esas páginas; demo funcional inicial se prueba en backend independiente.
- Seguridad pendiente: rate limiting distribuido/WAF, cancelar fetch saliente en timeout, análisis de 9 vulnerabilidades npm en agente, registro de costes/privacidad y QA bilingüe del contenido. No cambiar dominio, no fusionar drafts, no crear claves de producción ni habilitar públicamente hasta aprobación.
- CI PR #30: GitHub Actions Run `44249092490` (commit previo) pasó typecheck y RAG + smoke unitario; revisar CI del HEAD actualizado y confirmación runtime. El root package/tsconfig se introdujo en rama después de ese run.
- Próxima acción: ejecutar prueba POST real desde un navegador autenticado contra el backend `/api/answer`, verificar latencia, warnings y renderizado; decidir si se conecta directamente con Astro mediante arquitectura explícita compatible y segura o se mantiene demo independiente para Start-Up Chile. Después registrar evidencia de usuario/piloto y preparar formulario.

## Actualización 19 nov 2026 — Captura de navegador y ajuste editorial Puerto Williams
- Usuario aportó captura de `/api/demo` respondiendo realmente a «¿Qué es Puerto Williams?». Salida, advertencias y fuentes visibles confirman flujo desde formulario protegido hasta respuesta. Captura en chat 19 nov 2026, archivo adjunto `austral-beacon-travel-assistant-demostracion-20261119-000129.png`.
- Hallazgo UX: el resumen de destino decía solo «INE incorporó a Puerto Williams ... como ciudad en 2019», mientras que la proyección aprobada ya contenía ubicación (Isla Navarino / comuna Cabo de Hornos) y reconocimiento Best Tourism Villages 2021. Advertencias generales ocupaban más espacio que la respuesta.
- Cambio en rama `feat/travel-vercel-preview-api-build13` (PR #30): `src/knowledge/puertoWilliamsProjection.ts` combina `claimText(geography)`, `claimText(identity)` y `claimText(recognition)` para un resumen introductorio respaldado por las MISMAS reclamaciones public_core y procedencia. No se cambian knowledge-base ni políticas de acceso. Test `tests/puertoWilliamsProjection.test.ts` exige Isla Navarino/Cabo de Hornos/2019/Best Tourism Villages. CI ampliada para ejecutar test.
- Pendiente: confirmar CI en head, revisión de versión en Vercel Preview, pedir nueva captura y probar si advertencias genéricas pueden presentarse progresivamente sin eliminar protecciones. No afirmar que canal Beagle está en `claim-002` (solo en metadata geográfica) hasta vincular evidencia explícita si se incorpora en resumen.
- No fusionar ni cambiar producción Astro. El primer vertical público sigue siendo la futura integración de End of the World Travel; la demo hoy es autónoma y protegida.

### Confirmación del ajuste Puerto Williams
CI última rama `feat/travel-vercel-preview-api-build13` commit `12bb8ead7d41205a0bf6f33f9701db6a1d141e23`: PASS https://github.com/Alestelu1/austral-beacon-ai-lab/actions/runs/44448640103. Vercel preview READY deployment `dpl_9KeKTvQURSNGcaAYKX5GXfMBUzcB`, URL `https://austral-beacon-travel-agent-preview-fpmtfm2zp.vercel.app/api/demo`. `GET /api/health` HTTP 200 flag Preview true y `GET /api/smoke` HTTP 200 con supported destination-info y unsupported unknown. Aún solicitar captura de la respuesta ampliada desde el navegador.

## Actualización 19 nov 2026 — Segunda captura y UX contextual
- Nueva captura del usuario `austral-beacon-travel-assistant-demostracion-20261119-001457.png`: confirma que resumen ampliado Puerto Williams (isla Navarino / Cabo de Hornos / 2019 / Best Tourism Villages 2021) funciona en navegador. Aún mostraba tres advertencias técnicas.
- PR #30, rama `feat/travel-vercel-preview-api-build13`: `api/demo.ts` ahora presenta avisos relacionados con el tema de la pregunta (transporte, comunidades, coordenadas); los avisos restantes quedan bajo desplegable «Notas adicionales de verificación». Ninguna advertencia fue eliminada del JSON ni del motor; permanece disponible en pantalla para inspección. Descripción genérica de operaciones solo visible en preguntas de transporte; fuente continúa visible.
- Prueba `tests/vercelPreview.test.ts` exige UI contextual y analiza la sintaxis del script emitido con `node:vm.Script`. GitHub CI SUCCESS para commit `22edc1bb2df8fd29e82f8a4c087909fc86f7bb44`: https://github.com/Alestelu1/austral-beacon-ai-lab/actions/runs/44450336861. El intento anterior de test sintáctico falló por un regex mal escapado del test, corregido en commit final.
- Preview Vercel READY `dpl_3nhixMhQdoaGdWrgKcCVH6rn1iPJ`, demo `https://austral-beacon-travel-agent-preview-qdpyfcriu.vercel.app/api/demo` (SSO protected): GET /api/demo 200 con UI contextual; GET /api/smoke 200 (Puerto Williams supported y no-evidence unsupported). **Aún se necesita confirmación visual del desplegable contextual en navegador del usuario**.
- No se fusionaron PR ni se alteró la web pública. Próximo: comprobar comportamiento de consultas de conectividad/operativas y empezar respuestas EN/ES verdaderas. Revisar seguridad y gastos antes de exposición pública.

## 2026-11-19 — Prueba visual conectividad y corrección de lenguaje
- Usuario aportó captura `austral-beacon-travel-assistant-demostracion-20261119-002623.png` con pregunta «Cómo puedo viajar desde Punta Arenas a Puerto Williams?». La respuesta funcional reconoce corredor aire/mar y muestra dos fuentes; sin embargo mostraba «Knowledge Base» y «proyección de conocimiento canónico» al viajero.
- Archivo responsable `projects/end-of-the-world-travel-agent/data/routes/punta-arenas-puerto-williams.json`. En PR #30 rama `feat/travel-vercel-preview-api-build13`, se reemplazó el resumen por instrucción útil: alternativas publicadas Aerovías DAP (vuelo) y TABSA (vía marítima), con consulta de horarios, tarifas y disponibilidad directamente a operadores. Se actualizó la única advertencia visible para referir cambios operativos/meteorología; NO se inventaron horarios, frecuencias, precios ni duración. Se preservaron URLs de ambos operadores y contrato de conectividad.
- Test nuevo `tests/puntaArenasTravelCopy.test.ts` valida nombres de operadores, cautela, fuentes y ausencia de jerga Knowledge Base; agregado al CI de `.github/workflows/rag-qa.yml`. Commits `90d63c963c9b3228c0cb0e3c0e1468d1b26fe1f0`, `2faf6bec1d92a97973f54874fe32485895c3424a`, `058eb7bbb82ccc1e8097360ea9ce610b804aafea`.
- PENDIENTE: confirmar GitHub Actions HEAD `058eb7bbb...`; inspeccionar versión de Vercel Preview y obtener nueva prueba visual de conectividad. Antes de exposición externa revisar vigencia de enlaces DAP/TABSA y la experiencia EN/ES real. No alterar producción ni fusionar PR hasta QA.

### Confirmación CI y despliegue ruta
- GitHub Actions commit `058eb7bbb82ccc1e8097360ea9ce610b804aafea` SUCCESS: https://github.com/Alestelu1/austral-beacon-ai-lab/actions/runs/44451592350 (incluye test nueva copy, tests preview, RAG y typecheck). Despliegue Vercel Preview `dpl_D9Sz9jTi7atVfuewSezR8W7hwZwZ` READY, `https://austral-beacon-travel-agent-preview-47m8zgju0.vercel.app/api/demo`. GET `/api/health` 200 enabled true; GET `/api/smoke` 200 sobre Puerto Williams y respuesta unsupported. **No se comprobó visualmente la nueva pregunta de conectividad en este despliegue; usuario puede hacerlo con formulario**.

## 2026-11-19 — Confirmación usuario de conectividad y primer EN acotado
- Captura usuario `austral-beacon-travel-assistant-demostracion-20261119-003325.png`: comprobación visual de nuevo copy «¿Cómo puedo viajar desde Punta Arenas a Puerto Williams?» con DAP y TABSA, única advertencia de condiciones operativas y fuentes. **Resuelve el fallo editorial de jerga interna**. Queda redundancia menor por disclaimer adicional; posponer al pulido final.
- Se desarrolló en rama `feat/travel-vercel-preview-api-build13` / PR #30 la primera localización EN **acotada y determinista**: `api/locale.ts` con respuestas en inglés verificadas para identidad de Puerto Williams y conectividad Punta Arenas→Puerto Williams. El contrato API ahora admite `locale: "es" | "en"` con valor es por defecto, y rechaza idiomas inválidos. Las fuentes y estado siguen intactos; NO se usa traducción genérica o modelo generativo. Para otras intenciones EN informa que esa pregunta aún no está soportada en el Preview EN; no proclamar bilingüismo integral.
- Nuevo `api/demo-en.ts` servido en `/api/demo-en` con interfaz inglesa, vínculo de retorno a `/api/demo`, aviso explícito de cobertura EN limitada. La UI española enlaza a EN. Ambas protegidas por Vercel Authentication y noindex. `tests/previewEnglish.test.ts` comprueba ambos casos, no-evidencia EN, rechazo de locale inválido y HTML/JS.
- CI HEAD `b2d25ec11844668b3fe9f7c06c80b2f848fcbcbb` SUCCESS: https://github.com/Alestelu1/austral-beacon-ai-lab/actions/runs/44452807015 (typecheck/RAG/pruebas de preview EN).
- Vercel Preview READY `dpl_E6MGw4xhouQrgrvEjdXbJqGoGAxm`, URL `https://austral-beacon-travel-agent-preview-nsbg3hrvx.vercel.app/api/demo-en`. GET /api/health HTTP 200, GET /api/smoke HTTP 200 con 4 casos PASS (PW ES, sin evidencia ES, PW EN, ruta EN) via POST handler interno en runtime remoto, GET /api/demo-en HTTP 200 noindex. **Aún pedir al usuario una prueba manual en la interfaz EN** para validar lenguaje y renderizado final.
- No hubo cambios en producción de End of the World Travel, no se fusionaron PR, no se habilitó uso público. Sigue pendiente integración real Astro (PR #3), seguridad/rate limit/audit (Issue #28), validación comercial y formulario Build 13 antes del 23 nov.

## 19 nov 2026 — Capturas EN y ajuste visual contextual
- Usuario probó en navegador el Preview EN y entregó dos capturas: `austral-beacon-travel-assistant-preview-20261119-005504.png` (What is Puerto Williams?) y `austral-beacon-travel-assistant-preview-20261119-005556.png` (How can I travel from Punta Arenas to Puerto Williams?). Ambas respuestas en inglés legibles, con fuentes originales, sin horarios ni precios inventados. Esto demuestra cobertura EN de dos casos, NO soporte general para cualquier consulta.
- Hallazgo: Puerto Williams EN mostraba las tres advertencias genéricas aunque ES ya las plegaba; el renderizador clasificaba avisos solo por palabras españolas.
- PR #30, rama `feat/travel-vercel-preview-api-build13`: `api/demo.ts` clasifica además expresiones EN `schedules/fares`, `indigenous communities`, `coordinates` en función del tema de la consulta. Advertencias no pertinentes pasan a «Additional verification notes», sin suprimirse del API. `tests/previewEnglish.test.ts` extendido para detectar clasificación EN. Commits `a6007f151deed56b766f099a3364427d9693c74d`, `cef0c26a11c3f8d91dc4caa5a47eb92c70870c8c`.
- Este arreglo se debe verificar con CI último commit y una nueva captura EN desde el deployment Preview. Fuentes siguen en idioma original deliberadamente. No cambiar Astro público ni fusionar PR antes de cerrar seguridad y QA.
