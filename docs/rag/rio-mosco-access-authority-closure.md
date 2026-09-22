# Río Mosco: auditoría de autoridad para acceso

Fecha de consulta: 2026-09-21. Base: `0be8f9e501b26c4a36452585fdc0ab7ae4ce8816`.
Rama: `research/rio-mosco-access-authority-closure`.
Estado: investigación/propuesta exclusivamente; no habilita retrieval de producto, embeddings ni relaciones.

## Decisión: PARCIAL

Hay respaldo institucional para identificar Villa O’Higgins como origen documental de la ruta patrimonial. No se ha cerrado la autoridad de una ruta completa de acceso estable vigente al parque. La evidencia permite una atribución documental estrecha, no la instrucción operacional «se accede desde…» sin reservas. El producto permanece bloqueado hasta una revisión editorial posterior.

Afirmación máxima propuesta (no claim incorporado): «Bienes Nacionales documenta Villa O’Higgins como origen de la Ruta Patrimonial Glaciar Río Mosco». No implica apertura, transitabilidad, seguridad, transporte ni servicios actuales; tampoco identifica parque, ruta y glaciar como un mismo objeto.

## Fuentes y trazabilidad

Los IDs R01–R06 son temporales de esta investigación, no source records operativos. Fecha desconocida se registra como tal; consulta o indexación reciente no equivale a publicación ni validación operacional. Ninguna fuente secundaria habilita la propuesta.

| ID | Institución / título y URL | Fecha | Tipo / autoridad | Scope y afirmación relevante | Estabilidad | operational_dependency | provenance quality | suitability_for_travel_agent / notas |
|---|---|---|---|---|---|---|---|---|
| R01 | Ministerio de Bienes Nacionales: [Río Mosco](https://www.bienesnacionales.cl/rio-mosco/) | Publicación no indicada | Ficha institucional de oferta de concesión; primaria chilena | Descripción: ruta interpretativa desde Villa O’Higgins al glaciar, creada en 2002; objeto de conservación cita decreto de 2006 | historical_access_fact | No para atribución documental; sí para operación | Alta para texto y URL; baja para actualidad | Sólo origen documental propuesto; no servicios actuales |
| R02 | MBN / Rutas Patrimoniales: [Topoguía Parque Glaciar Mosco](https://rutas.bienes.cl/wp-content/uploads/2020/03/Topoguia-Mosco.pdf) | Edición no verificada; /2020/03/ no prueba fecha | Guía patrimonial oficial; primaria chilena | PDF de 59 páginas; índice cartográfico en PDF p.2 identifica administración e inicio de senderos. Recomienda consultar estado de senderos | historical_access_fact | Sí para recorrido utilizable hoy | Parcial: lectura pública inicial; segunda apertura falló por timeout | Contexto documental únicamente; identidad binaria con Drive no comprobada |
| R03 | MBN / Rutas Patrimoniales: [Ruta Patrimonial Parque Glaciar Mosco: Bien Nacional Protegido](https://rutas.bienes.cl/ruta_patrimonial/glaciar-de-rio-mosco-campos-de-hielo-sur/) | Fecha de edición no acreditada | Catálogo institucional HTML; primaria chilena | Descripción enumera Sendero Miradores, Sendero Ruta Patrimonial Glaciar Mosco y circuito La Bandera/Los Cóndores/Mirador del Valle. Recomienda consultar estados y remite horarios fuera de la ficha | historical_access_fact para trazado; dynamic_access_fact para operación | Sí para recomendaciones de recorrido actuales | Alta para secciones y nombres; sin validación operacional fechada | Nombres documentados, no itinerario habilitado ni garantía de apertura |
| R04 | MBN: [Invita a recorrer la Ruta Patrimonial Río Mosco](https://www.bienesnacionales.cl/bienes-nacionales-invita-a-recorrer-la-ruta-patrimonial-rio-mosco-en-la-comuna-de-ohiggins/) | 2023-11-03 | Noticia institucional; primaria para actividad fechada | Visita de funcionarios para conocer estado y acciones; refiere red de senderos. No certifica condiciones de 2026 | historical_access_fact | Sí para extrapolar condición actual | Alta para fecha y descripción; limitada para estatus jurídico | Corroboración histórica; no habilitación live |
| R05 | MBN: [Bases Mosco 29-12-11](https://www.bienesnacionales.cl/wp-content/uploads/Bases-Mosco-29-12-11.pdf) | 29-12-2011 según rótulo/enlace; fecha de aprobación no verificada | Bases de concesión; primaria, sin revisión jurídica exhaustiva | Marco general, numerales 1–3 y 6: predio, ruta de 2002 y condiciones previstas de acceso público; posibilidad de tarifas | historical_access_fact; dynamic_access_fact para tarifas | Sí para adjudicación, operador o cobro vigente | Buena para pasaje recuperado, sin acto de adjudicación | No convertir condiciones de licitación en servicio actual |
| R06 | MBN: [Licitaciones finalizadas](https://www.bienesnacionales.cl/avisos/licitaciones-finalizadas/) | No indicada | Índice institucional | Incluye Río Mosco en licitaciones finalizadas | historical_access_fact, sólo contexto editorial | No resuelve acceso | Alta para pertenencia al índice, no resultado contractual | Advierte que R01 no es un boletín operativo actual |

## Inspección del repositorio

Paquete: `knowledge-base/entities/protected-areas/parque-glaciar-rio-mosco/` (claims, metadata, relationships y sources). Entity ID exacto: `parque-glaciar-rio-mosco`.

- `b05w2-014` procede de `bienes-nacionales-rio-mosco-web`, R01. Locator: descripción de Ruta Patrimonial Glaciar Río Mosco; retrieved_at 2026-09-14; published_at null. Propósito de la página: oferta institucional/concesión, no monitoreo operacional. Describe ruta patrimonial; no acredita operación vigente. Mantener historical_fact, internal_research, bloqueos general-rag/travel-agent, embedding_eligible false.
- `b05w2-015` procede de `bienes-nacionales-parque-glaciar-mosco`, copia [Drive](https://drive.google.com/file/d/1l-UD0Xa4oyjJHz6cgCgiVqyv-t8zTt_N/view), derivado de `b05-012`. Provenance del repositorio: PDF p.23, numeración PDF desde 1, dos páginas impresas por página PDF. Emisor MBN; edición desconocida. Mantener dynamic_operational_fact, requires_current_verification true, bloqueos general-rag/travel-agent y embedding_eligible false.
- El source record de la copia Drive registra 59 páginas y SHA256 `0505507d9da8916e133d5248c9c1fc166defdd645f0cce2e1883d864a7a65ce8`. No se reabrió Drive ni se recalculó ese hash: son metadatos existentes. No trasladar automáticamente sus locators a R02 como si fueran copias idénticas.
- `b05-012`, en `knowledge-base/research/batch-05-wave-1-evidence-register.json`, describe inicio en la administración y Miradores Urbanos como stable_semantic. Es evidencia de investigación, no autorización para saltarse el bloqueo de Wave 2.
- `b05w2-011/012/013` sostienen identificación, conservación y localización; no habilitan instrucciones de acceso.
- `b05w2-rel-07-inverse` sólo expresa inverse_of_local_protected_area_context hacia villa-ohiggins. No se reutiliza como edge de acceso.
- Política aplicable: `knowledge-base/research/batch-05-wave-2-retrieval-policy.json`: hechos dinámicos excluidos del retrieval estable; contexto histórico fechado; solicitud de itinerario requiere condiciones y verificación live. No se modifica esta política.

## Comparación A–D y propuesta

| Claim | A: clasificación actual | B: claim adicional estrecho | C: revisión controlada | D: insuficiencia |
|---|---|---|---|---|
| b05w2-014 | Mantener | Proponer atribución de origen documental separada, no desbloqueo | Sí, para contexto de origen; aprobación pendiente | No alcanza para ruta completa vigente |
| b05w2-015 | Mantener dinámico/bloqueado | No reutilizar apertura/condiciones como hecho estable | Sólo tras separar evidencia documental y operación, con revisión explícita | Sin prueba de transitabilidad actual |

Un claim NUEVO podría expresar únicamente la afirmación máxima propuesta. Su clasificación candidata sería stable_access_fact en sentido de origen documental, nunca de acceso vigente. Esto es una propuesta editorial, no un ID ni un claim creado. Si la revisión exige vigencia del trazado para esa clasificación, debe conservarse como historical_access_fact y no habilitar el intent.

No recomendar todavía una relación canónica `access_context_from` entre parque y localidad: la fuente describe una ruta hacia el glaciar y metadata distingue esos objetos. Hace falta precisar dominio, destino y alcance mediante claim aprobado. Ninguna edge se deriva de proximidad ni mapas.

## Respuestas a las diez preguntas

1. «Se accede desde Villa O’Higgins»: no como instrucción vigente ni desde el paquete elegible actual; sólo la atribución documental propuesta tras aprobación.
2. Ruta concreta: puede describirse documentalmente la ruta patrimonial; no ofrecer navegación o itinerario completo actual.
3. Sendero por nombre: sí como nombre publicado, previa estructuración/revisión de evidencia; no como recomendación operativa.
4. Estable: atribución de origen y existencia documental. No confundir antigüedad documental con vigencia del camino.
5. Live: condiciones, restricciones, cierres, clima, seguridad y servicios.
6. Máximo: la frase atribuida de la decisión, sin distancias ni tiempos nuevos.
7. Nuevo claim: sí, si se aprueba la separación estrecha; los existentes no deben alterarse por conveniencia.
8. Nueva relation: no aún; no necesaria para una respuesta puramente textual atribuida.
9. Mantener b05w2-014 bloqueado: sí.
10. Mantener b05w2-015 dinámico/bloqueado: sí.

## Discrepancias y condiciones de parada

- Temporal/jurídica: R04 sitúa la creación del BNP «hace 21 años» en 2023; R01 diferencia ruta de 2002 y decreto de 2006. No igualar creación de ruta con protección jurídica ni elegir una fecha. Revisión del instrumento fuera de este cierre limitado.
- Granularidad: R03 describe tres agrupaciones de senderos; R02 enumera hitos/tramos y usa Miradores Urbanos. No convertir agrupaciones, hitos y nombres en un recuento canónico uniforme.
- Magnitudes: R03 publica 12,37 km y 20 hitos; R04 refiere una visita de 8 km. Distinto scope aparente, no contradicción numérica demostrada ni valores intercambiables; no seleccionar longitud de acceso.
- Tarifas: gratuidad general del programa y posibilidad de cobro en R05 no resuelven tarifa de Mosco hoy. No afirmar gratis ni precio vigente.
- Semántica: BNP, parque editorial, ruta patrimonial, río y glaciar no son identidades equivalentes. No convertir destino de sendero en acceso completo al predio.
- Gobernanza: b05-012 y b05w2-015 tienen granularidad y tratamiento distintos; no resolverlo favoreciendo el registro más permisivo.

Se activa parada conservadora por ambigüedades de fecha/alcance y falta de prueba de acceso vigente. Se documentan límites y se termina sin promoción. No afirmar que no existen otras fuentes: la búsqueda no es exhaustiva.

## Estructura mínima futura (propuesta, no datos operativos)

- stable_access_claims: vacío en runtime; pendiente claim estrecho aprobado de origen documental.
- historical_access_context: referencias bloqueadas 014/015 sólo para investigación, no evidencia estable publicada.
- relation_ids: ninguna relación de acceso autorizada; no usar 07-inverse para ese fin.
- source_ids: actuales bienes-nacionales-rio-mosco-web y bienes-nacionales-parque-glaciar-mosco; R02–R06 siguen temporales, no incorporados como fuentes canónicas.
- live_required_topics: trail_condition, temporary_closure, weather, current_safety_conditions, current_access_restrictions, current_services. road_condition y transport_availability sólo si la futura pregunta incluye aproximación vial/transporte. Todos unavailable_from_static_rag, sin valores.
- Reutilizar la taxonomía existente trail_opening, weather, permission y refuge_operation donde semánticamente corresponda; cualquier extensión tipada requiere revisión posterior, no se implementa aquí.

No autorizar afirmaciones sobre apertura, seguridad, duración, dificultad, transporte diario, horarios, tarifas, guardaparques, camping/refugios disponibles, señal, estacionamiento, vehículos, puentes, agua potable o reservas actuales.

## Método, límites y validación

Inspección local de registros, política y provenance; lectura pública de R01, catálogo R03, nota R04, pasaje de R05, índice R06 y apertura inicial de R02. La apertura posterior de R02 falló por timeout: p.23 se conoce por el registro previo, no por nueva inspección visual. No se adquirieron geometrías ni se usaron mapas genéricos. No se contactó a organismos ni se conectó un proveedor live al producto.

La primera búsqueda con motor 1 devolvió resultados mayormente irrelevantes; se contrastó con motor 2 y apertura directa de la ficha oficial. Se priorizó MBN. No se amplió a MOP/Vialidad/municipio/SERNATUR/GORE/CONAF/DGA una vez detectadas las condiciones de parada; no se atribuyen resultados negativos a esos organismos.

Sólo se añade este Markdown. Sin JSON nuevo. Validación de alcance y git diff --check; no corresponde ejecutar build, tests de producto ni typecheck. No cambios canónicos, CI ni proyectos. Sin implementación, PR, merge o Wave 3.
