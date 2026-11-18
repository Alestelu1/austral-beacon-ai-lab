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
