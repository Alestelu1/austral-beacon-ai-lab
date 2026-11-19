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
