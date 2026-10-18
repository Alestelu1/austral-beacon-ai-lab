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


## Verificación geoespacial — 2026-10-18

### Método

Se consultaron directamente los endpoints REST públicos de las capas candidatas. La selección se hizo mediante atributos, no por inspección visual ni por proximidad:

- Ruta Y-905: `ROL = 'Y-905'`.
- Puerto Williams: capa `Ciudades - 2017`, `URBANO = 'PUERTO WILLIAMS'`.
- Puerto Toro: capa `Caserios - 2017`, `NOM_ENT = 'PUERTO TORO'`.

Las consultas se limitaron a identificar registros, metadatos y condiciones de reutilización. No se copiaron geometrías al repositorio ni se modificaron entidades canónicas.

### Resultados

| Objeto | Productor/origen | Capa y registro | Geometría/CRS | Hallazgo | Decisión |
|---|---|---|---|---|---|
| Ruta Y-905 | Dirección de Vialidad/MOP, republicada en ArcGIS por `SubtelChile` | `RED_VIAL_MOP / Red_Vial_Chile`; `OBJECTID 3476`; `GlobalID 5c945491-9cbc-445e-9d7c-6b30d3c7bd81` | línea; servicio en EPSG:4326 | El registro identifica `Y-905` como “Puerto Navarino - Puerto Williams - Caleta Eugenia”, carpeta `RIPIO`, Región de Magallanes y de la Antártica Chilena | Candidato sólo como trazado vial histórico/fechado; no promover como red actual |
| Puerto Williams | INE, Censo 2017; capa nominada por Esri Chile desde Geodatos Abiertos INE | `Ciudades - 2017`; `OBJECTID 222`; `URBANO PUERTO WILLIAMS` | polígono; EPSG:3857 | Clasificado como capital provincial y ciudad; el polígono representa delimitación censal 2017 | Candidato para contexto censal fechado, no como límite urbano actual sin contraste con fuente INE vigente |
| Puerto Toro | INE, Censo 2017; capa nominada por Esri Chile desde Geodatos Abiertos INE | `Caserios - 2017`; `OBJECTID 3643`; `COD_LOC 25`; `COD_ENT 30` | polígono; EPSG:3857 | Clasificado como `CASERÍO`; el área y perímetro publicados son demasiado extensos para asumir que representan la huella precisa del asentamiento | Rechazar como punto o límite canónico de Puerto Toro; conservar sólo como evidencia censal fechada de la entidad |

### Procedencia y límites de uso

#### Red Vial MOP

- Servicio: `https://services3.arcgis.com/Dhl01RVOOnbjTdY7/ArcGIS/rest/services/RED_VIAL_MOP/FeatureServer`.
- Ítem ArcGIS: `833efdfc62f14c9cb1e901e3be2f7349`.
- La descripción de la capa indica levantamientos GPS 2000–2003, actualizaciones parciales y fecha de actualización 2013.
- La propia capa declara que es una base dinámica de trabajo y que **no representa la naturaleza jurídica** de los caminos.
- El ítem público no publica licencia ni términos de uso explícitos.

Consecuencia: el registro respalda la identificación histórica del rol y nombre de la Y-905, pero no autoriza todavía copiar su geometría al repositorio ni usarla como prueba de condición, transitabilidad, continuidad o estado actual.

#### Ciudades y pueblos — Censo 2017

- Servicio: `https://services.arcgis.com/r7t1P5pnkoOLRdhr/arcgis/rest/services/Ciudades__Pueblos___Censo_2017_WFL1/FeatureServer`.
- Ítem ArcGIS: `879c8fb5409547a9bfa171f0bb8cf8e1`.
- Esri Chile declara que nominó datos obtenidos desde Geodatos Abiertos del INE; el productor acreditado es el Instituto Nacional de Estadísticas.
- El ítem publica licencia Creative Commons Reconocimiento-CompartirIgual 4.0 Internacional y exige reconocer autoría, enlazar la licencia, indicar cambios y no atribuir al INE análisis o transformaciones de terceros.
- Las capas corresponden al Censo 2017. Sus cifras, categorías y delimitaciones deben conservar esa fecha.

Consecuencia: la reutilización es potencialmente admisible con atribución y ShareAlike, pero antes de incorporar geometría se debe localizar el producto directo del INE y comprobar si existe una versión 2024 o posterior equivalente.

### Evaluación de suficiencia

| Requisito | Y-905 | Puerto Williams | Puerto Toro |
|---|---:|---:|---:|
| Productor identificado | sí | sí | sí |
| Registro seleccionable de forma reproducible | sí | sí | sí |
| Geometría consultable | sí | sí | sí |
| Fecha/temporalidad entendida | sí, actualización 2013 | sí, Censo 2017 | sí, Censo 2017 |
| Licencia explícita | no | sí, CC BY-SA 4.0 | sí, CC BY-SA 4.0 |
| Adecuada como geometría canónica actual | no | no todavía | no |
| Apta para contexto fechado | sí, con límites | sí | sí, sin interpretar el polígono como huella urbana |

### Decisión del bloque

**CANDIDATOS IDENTIFICADOS — GEOMETRÍA CANÓNICA BLOQUEADA.**

La consulta por atributos elimina la ambigüedad de identidad, pero no resuelve actualidad, granularidad ni licencia en todos los casos. Por tanto:

1. no se crearán archivos GeoJSON ni coordenadas canónicas desde estas capas;
2. no se inferirá conectividad operacional desde el trazado Y-905;
3. el polígono censal de Puerto Williams sólo podrá presentarse como delimitación de 2017;
4. el polígono de Puerto Toro no se usará como huella del asentamiento;
5. el siguiente paso es localizar la descarga directa y metadatos vigentes del INE, además de una fuente MOP actual con condiciones claras de reutilización.

Este tratamiento conserva el principio rector: Austral Beacon puede orientar al usuario hacia la evidencia espacial y explicar sus límites, pero la visualización o síntesis no sustituye al dataset productor.


## Contraste con cartografía oficial Censo 2024 — 2026-10-18

### Material inspeccionado

Se inspeccionó la descarga regional oficial conservada como `Cartografia_censo2024_R12.zip`, correspondiente a la Región de Magallanes y de la Antártica Chilena. El paquete contiene:

- `Cartografia_censo2024_R12.gpkg`, GeoPackage con diez capas vectoriales;
- `Diccionario_variables_geograficas_CPV24.xlsx`, diccionario de campos por capa.

Identificadores de integridad calculados durante la auditoría:

| Archivo | SHA-256 |
|---|---|
| ZIP regional | `29e47b1ef88859f832c9286a80cb685c05547499e15181af17585985f8434ae0` |
| GeoPackage | `a813dda3a813c7016042c0fc018ce13291d53823ae2e2467102d54e4db32fe52` |
| Diccionario | `e09d706364a0436b56854bfd3e6e0f1b045f7ea411eeb4e7142b4f7f8b2d182d` |

El GeoPackage declara `SIRGAS 2000 / EPSG:4674`. Las capas relevantes usan geometría `MULTIPOLYGON`.

### Registros localizados

| Objeto | Capa 2024 | Regla de selección | Identificadores | Clasificación publicada | Interpretación permitida |
|---|---|---|---|---|---|
| Puerto Williams urbano | `Limite_Urbano_CPV24` | `ENTIDAD = 'PUERTO WILLIAMS'` | `OBJECTID 428`; `ID_ENTIDAD 1220102600101`; `ID_LOCALIDAD 122011026` | `AREA_C URBANO`; categoría `Ciudad` | delimitación censal urbana 2024, no límite municipal, predial ni operacional |
| Puerto Williams rural | `Localidades_CPV24` | `LOCALIDAD = 'PUERTO WILLIAMS'` y `AREA_C = 'RURAL'` | `OBJECTID 7611`; `ID_LOCALIDAD 122012026` | localidad rural | entidad estadística distinta del límite urbano; no fusionar por igualdad de nombre |
| Puerto Toro | `Entidades_CPV24` | `ENTIDAD = 'PUERTO TORO'` | `OBJECTID 23515`; `ID_ENTIDAD 1220102502404`; `ID_LOCALIDAD 122012025` | `AREA_C RURAL`; categoría `Caserío` | polígono de entidad censal rural; no asumir huella construida del poblado |
| Puerto Toro | `Localidades_CPV24` | `LOCALIDAD = 'PUERTO TORO'` | `OBJECTID 7610`; `ID_LOCALIDAD 122012025` | localidad rural | contexto territorial censal; no punto canónico del asentamiento |

Los valores demográficos contenidos en las capas no se promueven en este bloque. Su uso futuro requerirá definir exactamente el universo estadístico y evitar sumar o comparar unidades urbanas y rurales sólo porque comparten un topónimo.

### Comparación con Censo 2017

| Tema | Capa 2017 republicada | Descarga INE 2024 | Decisión |
|---|---|---|---|
| Autoridad y cadena de procedencia | datos INE nominados por Esri Chile | paquete regional directo del Censo 2024/INE | priorizar 2024 |
| Puerto Williams | ciudad, polígono EPSG:3857 | límite urbano + localidad rural homónima, EPSG:4674 | usar límite urbano 2024 sólo como geometría censal fechada |
| Puerto Toro | caserío en polígono muy extenso | entidad y localidad rural, con IDs oficiales 2024 | 2024 mejora actualidad e identidad, pero no equivale a huella física precisa |
| Licencia | CC BY-SA 4.0 declarada en el ítem Esri | términos abiertos generales del INE: CC BY-SA 4.0 | reutilización potencial con atribución, enlace, indicación de cambios y ShareAlike |
| Uso canónico inmediato | bloqueado | todavía requiere perfil de derivación y atribución | mantener bloqueado hasta aprobar transformación mínima |

### Decisión actualizada

**FUENTE DIRECTA 2024 ACEPTADA PARA LA AUDITORÍA — DERIVADOS CANÓNICOS AÚN BLOQUEADOS.**

La descarga oficial reemplaza al servicio Esri/Censo 2017 como fuente preferente para geometría censal de Puerto Williams y Puerto Toro. Antes de incorporar un derivado al repositorio se requiere una propuesta separada que defina:

1. qué unidad se necesita —límite urbano, localidad rural, entidad rural o punto representativo—;
2. si se conservará la geometría completa o se derivará un centroide/punto, con método reproducible;
3. atribución INE, enlace a licencia CC BY-SA 4.0 e indicación explícita de transformaciones;
4. conservación de `EPSG:4674`, IDs oficiales, versión Censo 2024 y hashes de procedencia;
5. separación entre geometría censal y afirmaciones sobre acceso, infraestructura o conectividad.

La mejora de actualidad no elimina la obligación de explicar qué representa cada geometría. El mapa debe conducir al dataset del INE y a su definición estadística, no reemplazarlos.


## Hallazgo geoespacial complementario — infraestructura portuaria MOP/DOP

El Catálogo Nacional de Información Geoespacial registra `Infraestructura Portuaria`, publicada el 2026-02-18 y producida por la Dirección de Obras Portuarias del MOP. La ficha enlaza el servicio:

`https://rest-sit.mop.gob.cl/arcgis/rest/services/DOP/CATASTRO_DOP/MapServer/0`

La capa es puntual, consultable y declara como contexto cartográfico levantamientos topográficos a escala 1:10.000 compilados a escala 1:50.000. La consulta por nombre localizó:

| Obra | Identificador MOP | OBJECTID | Uso permitido en esta auditoría |
|---|---|---:|---|
| Embarcadero Muelle Puerto Toro | `120201-01` | 1947 | punto de infraestructura portuaria; no punto canónico del asentamiento |
| Terminal de Conectividad Puerto Williams | `120201-02` | 1948 | punto de obra portuaria; no centro de la ciudad |
| Caleta Pesquera Puerto Williams | `120201-020` | 1961 | punto de obra portuaria |
| Infraestructura Portuaria Multipropósito de Puerto Williams | `120201-021` | 2426 | punto de obra portuaria; no prueba por sí solo el estado de la segunda etapa ni disponibilidad de servicios |

La capa publica `OPERATIVA = Si` para estos registros. Ese atributo se conserva estrictamente como propiedad de la obra cartografiada: no permite inferir horarios, frecuencia, acceso público, atención de pasajeros, capacidad disponible ni finalización de ampliaciones posteriores.

### Decisión

**ACEPTAR COMO GEOMETRÍA DE INFRAESTRUCTURA; PROHIBIR SUSTITUCIÓN DE ENTIDAD.**

El punto del muelle de Puerto Toro mejora la inmersión cartográfica porque permite mostrar una obra oficial relacionada con el asentamiento. Sin embargo, no resuelve la geometría de `puerto-toro` como lugar. En el Atlas futuro deberán existir, si la evidencia lo permite, dos objetos diferenciados:

- entidad territorial: Puerto Toro;
- infraestructura: Embarcadero Muelle Puerto Toro.

La misma separación se aplica entre Puerto Williams y sus distintas obras portuarias.
