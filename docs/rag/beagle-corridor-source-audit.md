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

## Decisión actual

**INVENTARIO ABIERTO — NO PROMOVER.**

La base existente permite iniciar la auditoría, pero todavía no demuestra cobertura suficiente y uniforme para presentar el corredor Beagle como paquete multimodal y geoespacial integrado. No se autorizan cambios canónicos, embeddings, nuevas geometrías, rutas live ni modificaciones del Travel Agent desde esta rama.
