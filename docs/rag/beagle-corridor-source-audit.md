# Auditoría de fuentes — corredor Beagle

## Estado del documento

- **Rama:** `research/beagle-corridor-source-audit`
- **Base:** `main` en `a04d03354b54da8f8ba96824f6167f05178a498f`
- **Fecha de apertura:** 2026-10-18
- **Estado:** inventario inicial; auditoría en curso
- **Decisión de promoción:** no tomada
- **Efecto en runtime:** ninguno
- **Cambios canónicos autorizados:** ninguno

Este documento abre una auditoría documental y geoespacial del corredor formado por Puerto Williams, Puerto Toro, isla Navarino y el canal Beagle. No crea entidades, claims, relaciones, chunks, embeddings ni geometrías. Tampoco habilita nuevas respuestas en Travel Agent.

## Principio rector

> El agente interpreta y contextualiza; la fuente acredita.

La finalidad es construir una experiencia de inmersión en el conocimiento, no reemplazar las fuentes originales. Toda futura respuesta deberá conservar una ruta verificable:

`respuesta → afirmación → entidad/relación → registro documental → fuente original`

Una explicación puede combinar documentos, datos y relaciones espaciales, pero no debe presentar una inferencia del modelo como si fuera un hecho publicado por una fuente.

## Pregunta de auditoría

¿Existe evidencia suficiente, con autoridad y granularidad adecuadas, para describir el corredor Beagle como un sistema territorial conectado —lugares, geografía, infraestructura y conectividad— sin convertir datos históricos, proyectos, mapas turísticos o condiciones operacionales en afirmaciones actuales?

## Alcance

### Entidades principales existentes

| Entidad | Paquete existente | Foco de esta auditoría |
|---|---|---|
| Puerto Williams | `knowledge-base/entities/places/puerto-williams/` | Identidad, función territorial y conexiones, sin reabrir servicios ya auditados |
| Puerto Toro | `knowledge-base/entities/places/puerto-toro/` | Infraestructura, ubicación relacional y límites de conectividad |
| Isla Navarino | `knowledge-base/entities/geography/isla-navarino/` | Geografía autoritativa y relaciones espaciales |
| Canal Beagle | `knowledge-base/entities/geography/canal-beagle/` | Identidad geográfica, navegación y relaciones con localidades |
| Muelle multipropósito de Puerto Williams | `knowledge-base/entities/infrastructure/muelle-multiproposito-puerto-williams/` | Identidad, alcance y estado de proyecto separados de operación futura |

### Relaciones candidatas para revisión

Las siguientes relaciones son preguntas de investigación, no edges aprobados:

- Puerto Williams — `located_on` / `is_part_of` → isla Navarino.
- Puerto Toro — `located_on` / `is_part_of` → isla Navarino.
- Puerto Williams — `adjacent_to` / relación costera documentada → canal Beagle.
- Puerto Toro — relación geográfica documentada → canal Beagle.
- Infraestructura portuaria — `serves` → localidad, sólo con alcance explícito.
- Conectividad marítima o aérea — `connects` → localidades, sólo si se separan existencia estructural, modalidad, frecuencia y estado operacional.

No se elegirán predicados definitivos hasta revisar el vocabulario existente y la evidencia exacta de cada fuente.

## Línea base ya auditada

### Batch 03 — Puerto Williams y Navarino

`data/quality/batch-03-puerto-williams-final-audit.json` registró un **conditional pass** el 2026-08-24. Deben preservarse estas reglas:

- Puerto Williams, Puerto Toro y Puerto Navarino son entidades distintas.
- La existencia de infraestructura no prueba un servicio regular vigente.
- La rampa de Puerto Navarino no prueba por sí sola un ferry internacional regular.
- El transporte subsidiado Puerto Williams–Puerto Toro no se presenta como producto turístico estándar.
- Horarios, frecuencia, disponibilidad, stock, estado de caminos y condiciones de senderos requieren verificación reciente.
- Las posiciones de mapas turísticos no son coordenadas canónicas autoritativas.
- La geometría autoritativa de Puerto Williams y nodos de Navarino quedó pendiente.

### Batch 04 — recuperación y control operacional

`data/quality/batch-04-puerto-williams-final-audit.json` registró otro **conditional pass** el 2026-08-26:

- el conocimiento estable y las consultas operacionales deben seguir rutas distintas;
- las preguntas dinámicas no deben resolverse desde embeddings estables;
- cuando no exista evidencia oficial suficientemente reciente, el sistema debe fallar cerrado;
- la geometría canónica autoritativa continuó pendiente.

Esta auditoría no degrada esos controles.

## Inventario inicial de fuentes ya registradas

### Puerto Williams

El paquete existente contiene fuentes institucionales y verificaciones especializadas. Esta auditoría reutilizará sus registros; no copiará claims sin revisar su alcance.

Registros especialmente relevantes:

- Armada de Chile: contexto histórico y territorial de Puerto Williams/Navarino.
- SERNATUR y Chile Travel: descripción de destino y contexto turístico, con autoridad limitada para operación actual.
- verificaciones Batch 03 sobre conectividad, servicios y emergencias;
- plan geoespacial autoritativo Batch 04;
- registro live para MOP Magallanes y Delegación Presidencial Provincial de la Antártica Chilena.

### Puerto Toro

Fuentes ya registradas:

| ID | Institución | Uso máximo preliminar |
|---|---|---|
| `dga-puerto-toro-2025` | DGA/MOP | Existencia y alcance publicado de infraestructura de monitoreo hídrico |
| `mop-puerto-toro-port-2025` | MOP | Identidad y alcance publicado de infraestructura portuaria |
| `mop-dap-puerto-toro-navarino-2025` | Dirección de Aeropuertos/MOP | Punto de posada y ubicación territorial publicada; no disponibilidad operacional |
| `sernatur-puerto-toro-attractiveness-catalog` | SERNATUR | Contexto histórico/turístico fechado; no condiciones actuales |

### Canal Beagle

Fuentes ya registradas:

| ID | Institución | Uso máximo preliminar |
|---|---|---|
| `armada-esmeralda-canal-beagle-2020` | Armada de Chile | Contexto de navegación institucional del hecho documentado |
| `armada-puerto-williams-navarino-2004` | Armada de Chile | Contexto histórico y geográfico fechado |

Dos notas web no bastan para una geometría, delimitación o caracterización hidrográfica exhaustiva. Se requiere localizar cartografía o datos de SHOA, IDE Chile u otra autoridad competente y revisar condiciones de reutilización.

### Isla Navarino

Fuentes ya registradas:

| ID | Institución | Uso máximo preliminar |
|---|---|---|
| `bcn-isla-navarino-concesion-2008` | BCN/LeyChile | Contexto jurídico y referencia territorial del instrumento específico |
| `armada-puerto-williams-navarino-2004` | Armada de Chile | Contexto histórico/geográfico fechado |

El decreto de un inmueble no debe reutilizarse como autoridad general sobre la geometría completa de la isla.

### Muelle multipropósito de Puerto Williams

Fuentes ya registradas:

| ID | Institución | Uso máximo preliminar |
|---|---|---|
| `mop-obras-maritimas-muelle-multiproposito-puerto-williams` | MOP/DOP | Identidad y alcance oficial del proyecto |
| `mop-programa-inversiones-2026-puerto-williams` | MOP | Programación presupuestaria y estado publicado a la fecha del documento |

La construcción, porcentaje de avance, fecha proyectada y futura operación son dimensiones diferentes. Ninguna debe convertirse automáticamente en disponibilidad portuaria actual.

## Fuentes candidatas aportadas, aún no promovidas

Estos enlaces se conservan como pistas de auditoría. Deben abrirse, fecharse, atribuirse y contrastarse antes de generar registros canónicos:

| Candidato | Tipo preliminar | Objetivo | Estado |
|---|---|---|---|
| `https://www.gob.cl/noticias/presidente-gabriel-boric-encabeza-inicio-segunda-etapa-infraestructura-portuaria-puerto-williams/` | comunicación oficial | Segunda etapa de infraestructura portuaria | pendiente de lectura y extracción controlada |
| `https://radiomagallanes.cl/muelle-multiproposito-de-puerto-wiliams-supera-el-55-de-avance-y-proyecta-iniciar-operaciones-en-marzo-de-2027/` | medio regional | Avance y proyección operacional | pendiente; requiere contraste con MOP/DOP |
| `https://www.radiopolar.com/expectativa-region-magallanes-proxima-apertura-hotel-the-cormorant-puerto-williams` | medio regional | Infraestructura turística privada | pendiente; no confundir expectativa con apertura efectiva |
| `https://kusanovic.cl/senador-kusanovic-coordina-con-el-mop-avance-de-proyectos-estrategicos-para-magallanes/` | sitio parlamentario | Proyectos Puerto Toro/Yendegaia y contexto MOP | pendiente; localizar fuente ejecutora primaria |

La presencia en esta tabla no implica aprobación, actualidad ni elegibilidad para embeddings.

## Clasificación obligatoria de cada afirmación

| Clase | Definición | Tratamiento |
|---|---|---|
| `stable` | Identidad o relación territorial persistente respaldada por autoridad competente | candidata a conocimiento estable tras revisión |
| `dated_historical` | Hecho cierto dentro de una fecha o periodo explícito | conservar fecha y contexto; no actualizar por inferencia |
| `dynamic` | Horario, frecuencia, disponibilidad, condición, avance u operación susceptible de cambio | excluir de embeddings generales; verificar al responder |
| `planned` | Proyecto, anuncio, fecha estimada o infraestructura futura | atribuir y fechar; nunca redactar como existente/operativa |
| `interpretation` | Síntesis o relación explicativa construida por Austral Beacon | etiquetar como interpretación y enlazar evidencias |
| `insufficiently_verified` | Evidencia incompleta, indirecta o con autoridad inadecuada | bloquear promoción y respuesta afirmativa |

## Brechas prioritarias

| Brecha | Autoridad buscada | Resultado requerido |
|---|---|---|
| Geometría de isla Navarino y localidades | IDE Chile, IGM, MOP u organismo productor competente | dataset/layer, productor, CRS, tipo de geometría, licencia y fecha de recuperación |
| Caracterización del canal Beagle | SHOA/Armada u otra fuente hidrográfica oficial | fuente original y alcance; sin digitalizar límites por intuición |
| Estado del muelle multipropósito | MOP/DOP | separar obra, avance publicado, hitos contractuales y operación efectiva |
| Infraestructura portuaria de Puerto Toro | MOP/DOP | alcance estable, fecha de inauguración y límites operacionales |
| Conectividad Puerto Williams–Puerto Toro | operador/autoridad contractual competente | modalidad, condición de subsidio, vigencia y frecuencia como datos dinámicos |
| Conectividad aérea de Puerto Williams | DGAC/DAP/operador competente | infraestructura estable separada de itinerarios actuales |
| Relaciones territoriales | fuentes geográficas oficiales | soporte explícito para cada edge; no derivar sólo desde proximidad visual |
| Contexto yagán | fuentes culturales/comunitarias apropiadas | terminología actual y respeto por comunidad viva; no turistificación reductiva |

## Reglas de parada

La auditoría debe detener promoción cuando ocurra cualquiera de estas condiciones:

- una fuente secundaria atribuye un dato a MOP, Armada, SHOA u otra autoridad, pero no se localiza el original;
- una fecha futura se presenta como compromiso cumplido;
- la existencia de un muelle, rampa, helipunto o aeródromo se usa para inferir servicio disponible;
- un mapa turístico se usa como geometría canónica;
- una nota histórica se usa para responder una condición actual;
- dos fuentes publican valores distintos de avance, longitud, frecuencia, población o fecha sin que su alcance temporal explique la diferencia;
- no se puede distinguir claramente hecho, interpretación y proyección.

## Productos esperados de la auditoría

1. Matriz de fuentes con autoridad, alcance, fecha y estado de verificación.
2. Matriz claim–source para cada afirmación candidata.
3. Inventario de entidades y relaciones existentes, nuevas o rechazadas.
4. Registro geoespacial con procedencia completa para cada geometría candidata.
5. Lista explícita de temas que requieren verificación live.
6. Preguntas de evaluación para inmersión y trazabilidad.
7. Decisión final: `APROBADO`, `PARCIAL` o `NO PROMOVER`.
8. Sólo después de aprobación: propuesta separada para `rag/beagle-corridor-wave-1`.

## Preguntas de evaluación futuras

Las respuestas deben explicar y conducir a fuentes, no sustituirlas:

1. ¿Cómo se relacionan Puerto Williams, Puerto Toro, isla Navarino y el canal Beagle?
2. ¿Qué fuentes respaldan cada relación territorial?
3. ¿Qué infraestructura portuaria existe según documentos oficiales y cuál continúa en proyecto o construcción?
4. ¿Qué significa que una conexión sea subsidiada y qué no permite inferir sobre su disponibilidad turística?
5. ¿Qué información es estable y cuál debe verificarse al momento de viajar?
6. ¿Cómo cambió la infraestructura documentada del corredor a través del tiempo?
7. ¿Qué mapa o dataset produjo cada geometría mostrada?
8. ¿Dónde puede el usuario consultar directamente la fuente original?

## Siguiente bloque de trabajo

1. Verificar las fuentes oficiales ya registradas y anotar si continúan accesibles.
2. Abrir y fechar los cuatro candidatos aportados.
3. Localizar fuentes primarias para los datos secundarios relevantes.
4. Revisar el plan geoespacial Batch 04 y buscar datasets productores.
5. Construir la matriz claim–source sin editar paquetes canónicos.
6. Someter el resultado a revisión antes de abrir una rama de implementación.


## Verificación documental — 2026-10-18

### Resultado de los cuatro candidatos

| Candidato | Verificación | Clasificación | Decisión |
|---|---|---|---|
| Gob.cl — inicio de segunda etapa | La URL aportada devolvió 403 durante esta revisión, pero el mismo hecho tiene respaldo primario accesible en MOP Magallanes: `https://magallanes.mop.gob.cl/presidente-gabriel-boric-encabeza-inicio-de-obras-de-la-ii-etapa-de-la-construccion-de-infraestructura-portuaria-multiproposito/` | `dated_historical` para el inicio de obras; identidad/alcance del proyecto potencialmente estable | Conservar el enlace Gob.cl como pista; usar MOP como fuente primaria de trabajo |
| Radio Magallanes — 55 % y marzo de 2027 | La página no fue accesible durante esta revisión. Una publicación oficial MOP del 2026-09-22 informa posteriormente 64 % de avance, término proyectado para febrero de 2027 e inicio de operaciones proyectado durante 2027: `https://magallanes.mop.gob.cl/segunda-etapa-del-muelle-multiproposito-de-puerto-williams-supera-el-60-de-avance-y-proyecta-iniciar-operaciones-en-2027/` | porcentaje: `dated_historical`; término/operación: `planned` | No promover 55 % ni marzo de 2027 como estado actual. Registrar cada corte temporal por separado y priorizar MOP |
| Radio Polar — The Cormorant | Publicación fechada 2026-09-17. Atribuye a un representante del hotel la llegada de primeros huéspedes el 2026-10-19 y describe 150 habitaciones. El sitio oficial `https://www.thecormorantat55south.com/` y el registro SERNATUR `https://serviciosturisticos.sernatur.cl/850-the-cormorant-at-55-south-lodge` respaldan identidad y localización, pero la fecha futura no prueba apertura cumplida | identidad/localización: candidata `stable`; apertura: `planned` y luego `dynamic` hasta verificación posterior | No afirmar “hotel abierto” antes de evidencia posterior al 2026-10-19. Separar infraestructura privada de servicio disponible |
| Kusanovic — MOP y avance hacia Puerto Toro | Nota fechada 2026-08-22. Informa una mesa de trabajo y dice que el senador “planteó la necesidad” de avanzar posteriormente desde Yendegaia hacia Puerto Toro. No constituye aprobación, financiamiento ni ejecución de esa extensión | reunión: `dated_historical`; extensión Yendegaia–Puerto Toro: `interpretation/proposal` | No modelar una ruta aprobada Yendegaia–Puerto Toro desde esta nota |

### Fuentes primarias localizadas durante la verificación

| Fuente | Alcance válido | Límite |
|---|---|---|
| `https://www.mop.gob.cl/project/construccion-obras-maritimas-infraestructura-portuaria-multiproposito-en-puerto-williams/` | Identidad y ficha general del proyecto portuario | La ficha general no sustituye el último corte de avance |
| `https://magallanes.mop.gob.cl/segunda-etapa-del-muelle-multiproposito-de-puerto-williams-supera-el-60-de-avance-y-proyecta-iniciar-operaciones-en-2027/` | Corte oficial publicado el 2026-09-22: 64 % de avance y término proyectado para febrero de 2027 | Avance mutable; operación futura no cumplida por el solo anuncio |
| `https://proyectos.mop.gob.cl/proyecto.asp?cod_p=41639` | Registro presupuestario/proyecto MOP 2026 para Puerto Williams | No prueba puesta en servicio |
| `https://vialidad.mop.gob.cl/2025/12/09/presentan-proyecto-definitivo-de-camino-de-penetracion-caleta-eugenia-puerto-toro-a-comunidad-de-la-provincia-antartica-chilena/` | Proyecto definitivo Caleta Eugenia–Puerto Toro presentado a la comunidad | No equivale a ruta terminada ni a extensión terrestre directa desde Yendegaia |
| `https://vialidad.mop.gob.cl/2025/05/05/avanza-la-construccion-de-la-ruta-mas-austral-del-mundo/` | Estado publicado del camino Vicuña–Yendegaia y proyección del corredor bimodal | Proyección 2031; no afirmar finalización ni continuidad vial a Puerto Toro |
| `https://magallanes.mop.gob.cl/grandes-noticias-para-la-provincia-antartica-mop-inicio-obras-de-construccion-de-infraestructuras-portuarias-en-puerto-toro-y-en-puerto-navarino/` | Inicio documentado de infraestructura portuaria en Puerto Toro y Puerto Navarino | Debe contrastarse con fuentes posteriores para estado final y operación |
| `https://magallanes.mop.gob.cl/mop-realiza-entrega-de-terreno-para-iniciar-obras-de-infraestructura-portuaria-en-puerto-toro/` | Alcance original publicado de las obras de Puerto Toro | No reutilizar proyecciones antiguas como estado actual |
| `https://www.thecormorantat55south.com/` | Fuente del propio establecimiento para identidad y propuesta comercial | Fuente interesada; no reemplaza registro público ni prueba por sí sola una apertura efectiva |
| `https://serviciosturisticos.sernatur.cl/850-the-cormorant-at-55-south-lodge` | Registro SERNATUR que vincula el establecimiento con Puerto Williams | La inscripción no prueba disponibilidad de habitaciones en una fecha concreta |

### Primera matriz afirmación–fuente

| Afirmación candidata | Fuente preferente | Fecha/temporalidad | Estado |
|---|---|---|---|
| Existe un proyecto de infraestructura portuaria multipropósito en Puerto Williams | Ficha de proyecto MOP | estable como identidad del proyecto | respaldada para auditoría; ya existe paquete canónico |
| La segunda etapa registraba 64 % de avance | MOP Magallanes | corte del 2026-09-22 | respaldada sólo como dato histórico fechado |
| El término estaba proyectado para febrero de 2027 | MOP Magallanes | proyección publicada el 2026-09-22 | respaldada como `planned`; no como cumplimiento |
| El muelle operará en 2027 | MOP Magallanes | proyección | no afirmar operación efectiva; requiere verificación futura |
| The Cormorant está localizado en Puerto Williams | SERNATUR + sitio oficial | verificado como identidad/localización | candidata estable con atribución |
| The Cormorant abrirá/abrió el 2026-10-19 | Radio Polar/representante del hotel | fecha futura al momento de esta auditoría | bloqueada hasta evidencia posterior a la fecha |
| El camino Vicuña–Yendegaia está en construcción y forma parte de un esquema bimodal hacia Puerto Williams | Vialidad/MOP | estado y proyección publicados | usar sólo con fecha y alcance de la fuente |
| Existe una ruta terrestre aprobada Yendegaia–Puerto Toro | ninguna fuente localizada | — | no respaldada; rechazar |
| Existe un proyecto definitivo Caleta Eugenia–Puerto Toro | Dirección de Vialidad | presentado en 2025 | respaldado como proyecto; no como obra terminada |
| Puerto Toro posee infraestructura portuaria documentada | MOP/DOP | obra documentada; operación requiere corte posterior | identidad/alcance potencialmente estable; operación dinámica |

### Discrepancias resueltas y abiertas

- **55 % frente a 64 %:** no es una contradicción canónica si son cortes de fechas distintas. Para el estado más reciente de la auditoría se prioriza el 64 % oficial del 2026-09-22; ambos valores siguen siendo históricos y no deben incrustarse como verdad atemporal.
- **Marzo de 2027 frente a febrero de 2027:** las fechas se refieren aparentemente a hitos distintos —operaciones y término de obras— y proceden de publicaciones diferentes. No se deben fusionar en una sola fecha. La operación continúa como proyección.
- **Yendegaia hacia Puerto Toro:** la aspiración parlamentaria no debe mezclarse con el camino Vicuña–Yendegaia ni con el proyecto separado Caleta Eugenia–Puerto Toro.
- **Hotel próximo a abrir frente a abierto:** identidad y registro turístico no prueban inicio efectivo de atención a huéspedes. Se requiere evidencia posterior al 2026-10-19.

### Decisión de este bloque

**VERIFICACIÓN PARCIAL — SIN PROMOCIÓN CANÓNICA.**

Se localizó autoridad primaria suficiente para reemplazar o acotar varios datos secundarios, pero siguen pendientes:

1. comprobar apertura efectiva de The Cormorant después del 2026-10-19;
2. localizar un corte oficial posterior sobre operación del muelle cuando corresponda;
3. verificar el estado contractual/ejecutivo del camino Caleta Eugenia–Puerto Toro;
4. ampliar la evidencia hidrográfica y geoespacial de SHOA/IDE Chile;
5. revisar la operación actual de conectividad sólo mediante fuentes live competentes.


## Decisión actual

**INVENTARIO ABIERTO — NO PROMOVER.**

La base existente permite iniciar la auditoría, pero todavía no demuestra cobertura suficiente y uniforme para presentar el corredor Beagle como paquete multimodal y geoespacial integrado. No se autorizan cambios canónicos, embeddings, nuevas geometrías, rutas live ni modificaciones del Travel Agent desde esta rama.
