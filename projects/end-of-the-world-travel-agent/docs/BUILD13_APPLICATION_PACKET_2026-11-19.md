# Austral Beacon AI Lab — Paquete de postulación Build 13

**Versión:** 2026-11-19 · Preparación, no presentada.
**Fecha interna objetivo:** lunes 23-11-2026.
**Cierre público oficial:** martes 24-11-2026, 13:00 GMT-3. https://startupchile.org/postula/

## 0. Precauciones y alcance
- No afirmar ventas, clientes pagos, acuerdos, entrevistas, piloto comercial ni usuarios externos que aún no estén documentados.
- Producto postulado: **Austral Beacon AI Lab**, infraestructura de conocimiento territorial verificable y motor de asistentes especializados.
- Primer producto funcional: **Travel Assistant**.
- Primer vertical de demostración: **End of the World Travel** (sitio Astro EN/ES). La conexión actual es un **recorrido de páginas Preview hacia un backend independiente autenticado**, no un widget embebido público.
- Motor de respuestas determinístico y conocimiento estructurado; el MVP NO debe presentarse como una IA generativa capaz de responder libremente todas las preguntas.
- Inglés demostrado en dos casos concretos. No afirmar cobertura total bilingüe.
- El repositorio de Travel Assistant no es el mismo que el de Astro. No se fusionaron los PR de integración a producción.

## 1. Resumen de propuesta (borrador para formulario, adaptar al límite de caracteres)
**Problema:** La información territorial y operativa para explorar destinos remotos está fragmentada entre operadores, guías y organismos; los asistentes genéricos pueden presentar datos operacionales desactualizados o sin fuentes. La hipótesis de mercado es que visitantes y operadores necesitan respuestas consistentes y actualizables.

**Solución:** Austral Beacon AI Lab estructura información verificable sobre territorios, rutas y servicios, registra su procedencia y la entrega a través de asistentes especializados. El primer producto, Travel Assistant, utiliza el sitio End of the World Travel para demostrar preguntas de destino y conectividad. Separa hechos documentales de información operacional que requiere verificación vigente.

**Tecnología diferenciadora:** un motor de recuperación y reglas, contratos tipados de respuesta, proyecciones desde base canónica, tratamiento de ausencia de evidencia, fuentes asociadas y canales web reutilizables. Lo desarrollado por el equipo se debe describir con exactitud y separar del software de terceros, Vercel, Astro y bibliotecas utilizadas.

**Estado:** prototipo funcional con backend desplegado y protegido, interfaz ES y dos respuestas EN verificadas, primeras pruebas en navegador por el fundador y páginas de enlace desde el sitio Astro en Preview. Sin pilotos o tracción comercial acreditados a esta fecha.

**Hipótesis comercial a validar:** integración B2B de asistentes territoriales para agencias receptivas, operadores de expedición, alojamientos y organizaciones de información turística; posibles ingresos por implementación, mantenimiento y suscripción. **No hay modelo de precios validado.**

**Escalabilidad propuesta:** misma arquitectura de fuente/contratos/adaptadores permite extenderse a territorios, idiomas y entidades distintas. Es una hipótesis técnica/comercial por comprobar, no un crecimiento exponencial ya demostrado.

## 2. Requisitos de video — información crucial
La sección 7.1 n) de las bases BIG13 indica **video de duración máxima 90 segundos** (si es mayor solo consideran primeros 90 s), sin contraseña, disponible durante evaluación, alojado en servicio que identifique fecha de carga, sin modificaciones posteriores al cierre. Debe contestar:
1) Producto/servicio, atributos e innovación;
2) Si resuelve problema global, nacional o local y por qué;
3) Equipo fundador y razón por la que es apto para desarrollarlo.
**IMPORTANTE**: el link privado del Travel Assistant protegido por Vercel Authentication **NO sirve por sí solo como enlace del video exigido**. Grabar y subir video distinto con enlace de reproducción sin contraseña (por ejemplo video no listado en YouTube), verificando acceso en incógnito. No compartir credenciales ni bypass de Vercel.
Fuente oficial: https://startupchile.org/content/uploads/terms-conditions-big-13.pdf, sección 7.1 n).

### Guion tentativo de 90 segundos (cronometrar en voz real antes de grabar)
[00–10] «Soy el fundador de Austral Beacon AI Lab, un proyecto tecnológico chileno que desarrolla asistentes especializados a partir de información territorial verificable.»

[10–26] «En destinos remotos, la información de conectividad, servicios y lugares está distribuida entre múltiples fuentes. Esto dificulta orientar a viajeros y puede generar respuestas poco confiables.»

[26–48] «Creamos Travel Assistant, nuestro primer producto funcional. Aquí responde qué es Puerto Williams y cómo viajar desde Punta Arenas: identifica alternativas publicadas, incluye fuentes y reconoce cuándo no puede confirmar horarios ni disponibilidad.»

[48–64] «Su motor utiliza una base de conocimiento estructurada y reglas para distinguir información documentada de datos que deben verificarse. Nuestro primer vertical es End of the World Travel, con una demostración inicial en español e inglés.»

[64–79] «Nuestra siguiente etapa es validar este servicio con operadores turísticos y organizaciones que necesiten asistentes integrados en sus sitios web. Aún estamos probando esa demanda y el modelo comercial.»

[79–90] «Desde Chile buscamos convertir esta tecnología en infraestructura reutilizable para nuevos territorios y sectores. Como fundador he desarrollado el prototipo y coordino sus validaciones técnicas y editoriales.»

**Nota de exactitud:** evitar afirmar que se desarrolló solo todo el software si hubo contribuciones de terceros. Completar la pregunta sobre experiencia/formación del fundador con antecedentes acreditables, no con títulos o certificaciones pendientes.

### Secuencia visual y edición (sin exceder 90 segundos)
- 0–10 s: título Austral Beacon AI Lab, producto y fundador.
- 10–26 s: problema en pantalla, una imagen/guía de un destino y tres fuentes dispersas esquematizadas sin atribuir métricas.
- 26–48 s: grabación real de pantalla: pregunta «¿Qué es Puerto Williams?» ES, luego ruta DAP/TABSA; mostrar fuentes y limitación.
- 48–64 s: diagrama simple y demostración EN («What is Puerto Williams?») y salida de la página Preview Astro al servicio protegido; no mostrar pantallas de autenticación/credenciales.
- 64–90 s: mercado como hipótesis, uso B2B futuro y habilidades demostrables del fundador.
- **Abrir video en incógnito** para confirmar reproducción sin autenticación, conservar URL, fecha de carga y copia maestra.

## 3. Inventario de evidencias (no confundir pruebas)
| Afirmación | Prueba actual | Estado |
|---|---|---|
| Motor corre en infraestructura remota | Vercel Preview separado, `/api/health` 200 y `/api/smoke` 200 (4 casos) | Validado remotamente |
| Destino PW ES y ruta PA↔PW ES | Capturas manuales del fundador en conversación, con fuentes | Validado por usuario |
| Dos respuestas EN | Capturas manuales y pruebas automáticas | Validado en cobertura limitada |
| Vista de integración Astro EN y ES | HTTP 200 de ambas, usuario mostró ambas vistas | Validado como navegación |
| Integración API directa embebida en Astro | No existe; la página Astro usa CTA externo al backend | No logrado / fuera del MVP previo a postulación |
| Modelo comercial con clientes interesados | Ninguna entrevista/piloto o carta actualmente verificada | No validado |
| Seguridad abierta al público | No hay protección distribuida completa y npm audit pendiente | No listo |
| Postulación enviada a Build13 | Sin comprobante | No enviado |

### Referencias
- Backend: https://github.com/Alestelu1/austral-beacon-ai-lab/pull/30 (Draft)
- Astro: https://github.com/Alestelu1/end-of-the-world-travel-astro/pull/3 (Draft)
- CI registrada y evidencia previa: `STARTUP_CHILE_BUILD13_HANDOFF_2026-11-18.md`
- Deuda de seguridad/test: https://github.com/Alestelu1/austral-beacon-ai-lab/issues/28
- Postulación: https://startupchile.org/postula/

## 4. Trabajo urgente restante para 23 nov
1. **Acceso formulario**: entrar a Charly.io por enlace oficial Start-Up Chile, crear/buscar aplicación Build13 y completar lo editable. Guardar captura del progreso sin credenciales.
2. **Elegibilidad**: confirmar documentos de identidad, equipo, dedicación, situación de persona natural y cualquier requisito/incompatibilidad conforme a formulario y bases; no colocar información ficticia.
3. **Video obligatorio**: grabar, cortar a <=90 s, subir sin contraseña, probar en incógnito, conservar enlace y fecha. No reemplazar con URL protegida de Vercel.
4. **Evidencia MVP**: seleccionar capturas que muestran preguntas ES/EN + fuentes y conexión Astro↔agente, esconder datos privados.
5. **Hipótesis comercial**: documentar al menos un contacto/entrevista con posible operador/alojamiento si se consigue; resultados reales, incluso si no hay interés.
6. **Formulario**: problema, tecnología diferenciadora, equipo, competencia, estado, escalabilidad, metas 4 meses y gastos proyectados. Ajustar a texto/campos y bases; no inventar presupuesto aprobado.
7. **Última revisión 23 nov**: video abierto, URL permanencia, postulación completa, requisitos formales, enviar y guardar comprobante.
8. **Diferido explícitamente**: contraste visual del header del Astro Preview, arreglo del Git accidental local, widget en producción, opening público de API hasta security review.

## 5. Handoff para chat nuevo
«Lee `projects/end-of-the-world-travel-agent/docs/BUILD13_APPLICATION_PACKET_2026-11-19.md` y `STARTUP_CHILE_BUILD13_HANDOFF_2026-11-18.md` del repo Austral Beacon AI Lab. Ya se acordó posponer contraste visual y reparación local Git. Prioriza entrega de video <=90 s sin contraseña, formulario Build13, evidencia y validación comercial. Distingue prototipo protegido de integración pública. No afirmar postulación enviada sin comprobante».
