# Batch 05 — Wave 2: auditoría

Base: `8ce686831f14bed8f9ebb16e1f586cb37004153a`. Rama: `rag/batch-05-wave-2-connectivity-protected-areas`. Estado: preparado para auditoría, sin PR, merge ni ingesta.

## Arquitectura y alcance

Cinco paquetes con MDX dentro de su carpeta, conforme al ejemplo solicitado. Se mantienen intactos todos los archivos preexistentes, incluido Authority Closure. El manifiesto Wave 2 apunta a una proyección que hereda relaciones del grafo anterior, actualiza las promociones y añade relaciones con inversas. Los estados de Wave 1 son un registro histórico; los consumidores futuros deben resolver IDs y estados mediante la proyección y reconciliación Wave 2. Ningún consumidor operativo fue conectado o modificado.

Río Bravo identifica exclusivamente el extremo del cruce, no el río ni una geometría de rampa. El nombre preferido Parque Glaciar Río Mosco es una normalización editorial autorizada; la denominación institucional BNP Río Mosco se conserva separada. Ruta, río y glaciar no se fusionan. Puerto Bahía Bahamondes permanece alias pendiente porque no se verificó un localizador de esa forma exacta.

## Paquetes

| Entidad | Ruta | Claims | Chunks |
|---|---|---:|---:|
| puerto-yungay | `knowledge-base/entities/places/puerto-yungay` | 6 | 6 |
| rio-bravo | `knowledge-base/entities/infrastructure/rio-bravo` | 5 | 5 |
| bahia-bahamondes | `knowledge-base/entities/geography/bahia-bahamondes` | 4 | 4 |
| parque-glaciar-rio-mosco | `knowledge-base/entities/protected-areas/parque-glaciar-rio-mosco` | 5 | 5 |
| parque-nacional-bernardo-ohiggins | `knowledge-base/entities/protected-areas/parque-nacional-bernardo-ohiggins` | 6 | 6 |

21 claims únicos; 26 chunks por entidad, 19 elegibles por contenido estable pero todos pendientes de auditoría y sin embedding generado. Las repeticiones entre paquetes conservan IDs y contenido idénticos; no son corroboración independiente.

## Fuentes nuevas

- [Diseño para ampliar infraestructura portuaria en Puerto Yungay ingresó a MIDESO para obtener recomendación satisfactoria y posteriormente licitar obras](https://aysen.mop.gob.cl/diseno-para-ampliar-infraestructura-portuaria-en-puerto-yungay-ingreso-a-mideso-para-obtener-recomendacion-satisfactoria-y-posteriormente-licitar-obras/) — `mop-puerto-yungay-design-2026`, publicación 2026-08-07; consulta 2026-09-14.
- [Obras Portuarias expone en Caleta Tortel y Villa O´Higgins estudio para ampliar infraestructura portuaria en Puerto Yungay](https://aysen.mop.gob.cl/direccion-de-obras-portuarias-del-mop-expone-en-caleta-tortel-y-villa-ohiggins-estudio-de-diseno-para-ampliar-infraestructura-portuaria-en-puerto-yungay/) — `mop-puerto-yungay-design-2023`, publicación 2023-11-09; consulta 2026-09-14.
- [Nueva infraestructura portuaria en Bahía Bahamonde mejora conectividad de pobladores e impulsa el turismo en la zona](https://aysen.mop.gob.cl/nueva-infraestructura-portuaria-en-bahia-bahamonde-mejora-conectividad-de-pobladores-e-impulsa-el-turismo-en-la-zona/) — `mop-bahia-bahamonde-port-2021`, publicación 2021-06-10; consulta 2026-09-14.
- [Río Mosco](https://www.bienesnacionales.cl/rio-mosco/) — `bienes-nacionales-rio-mosco-web`, publicación sin fecha verificada; consulta 2026-09-14.
- [Parque Nacional Bernardo O’Higgins](https://www.conaf.cl/parque_nacionales/parque-nacional-bernardo-ohiggins/) — `conaf-parque-nacional-bernardo-ohiggins`, publicación sin fecha verificada; consulta 2026-09-14.

## Claims nuevos

| ID | Clase | Afirmación | Fuentes |
|---|---|---|---|
| b05w2-001 | stable_fact | MOP documenta conexión por embarcación entre Puerto Yungay y Río Bravo. | mop-puerto-yungay-design-2026 |
| b05w2-002 | stable_fact | MOP vincula Puerto Yungay y Río Bravo con la continuidad de Ruta 7. | mop-puerto-yungay-design-2023 |
| b05w2-003 | stable_fact | La topoguía Mosco sitúa Puerto Yungay y Río Bravo en el acceso a Villa O’Higgins. | bienes-nacionales-parque-glaciar-mosco |
| b05w2-004 | historical_fact | Al 7-08-2026, MOP informaba diseño ingresado a evaluación y una inversión prevista de 10.500 millones de pesos. | mop-puerto-yungay-design-2026 |
| b05w2-005 | stable_fact | Río Bravo se documenta como extremo del cruce desde Puerto Yungay. | bienes-nacionales-parque-glaciar-mosco |
| b05w2-006 | conflicted_fact | Persisten discrepancias documentales: 90/100 km entre Río Bravo y Villa O’Higgins y 45/50 minutos de cruce. | bienes-nacionales-parque-glaciar-mosco, sernatur-carretera-austral-aysen |
| b05w2-007 | stable_fact | MOP sitúa Bahía Bahamonde en la ribera del Lago O’Higgins. | mop-bahia-bahamonde-port-2021 |
| b05w2-008 | stable_fact | MOP documentó terminal portuario, muelle y ampliación de rampa existente en 2021. | mop-bahia-bahamonde-port-2021 |
| b05w2-009 | stable_fact | MOP relaciona esta infraestructura con desplazamientos por el Lago O’Higgins. | mop-bahia-bahamonde-port-2021 |
| b05w2-010 | stable_fact | RP6 ubica Bahía Bahamondes al sur de Villa O’Higgins y documenta acceso lacustre hacia Candelario Mansilla. | bienes-nacionales-rp6-campo-hielo-sur |
| b05w2-011 | stable_fact | Bienes Nacionales identifica Río Mosco como BNP de 10.316,52 ha. | bienes-nacionales-rio-mosco-web |
| b05w2-012 | stable_fact | La conservación del BNP incluye el hábitat del huemul. | bienes-nacionales-rio-mosco-web |
| b05w2-013 | stable_fact | Bienes Nacionales sitúa el BNP Río Mosco a dos kilómetros al este de Villa O’Higgins. | bienes-nacionales-rio-mosco-web |
| b05w2-014 | historical_fact | La ficha registra una Ruta Patrimonial creada en 2002, desde Villa O’Higgins hacia Glaciar Mosco. | bienes-nacionales-rio-mosco-web |
| b05w2-015 | dynamic_operational_fact | La topoguía documenta senderos de Mosco; su apertura y condiciones actuales no fueron comprobadas. | bienes-nacionales-parque-glaciar-mosco |
| b05w2-016 | historical_fact | CONAF fecha la creación del parque el 22-07-1969, mediante DS 264 de Agricultura. | conaf-parque-nacional-bernardo-ohiggins |
| b05w2-017 | stable_fact | La ficha CONAF declara 3.525.901,20 ha. | conaf-parque-nacional-bernardo-ohiggins |
| b05w2-018 | stable_fact | CONAF describe presencia del parque en Aysén y Magallanes. | conaf-parque-nacional-bernardo-ohiggins |
| b05w2-019 | stable_fact | CONAF relaciona el parque con Campo de Hielo Sur. | conaf-parque-nacional-bernardo-ohiggins |
| b05w2-020 | stable_fact | CONAF documenta acceso desde Villa O’Higgins por Lago O’Higgins hacia Paso Marconi. | conaf-parque-nacional-bernardo-ohiggins |
| b05w2-021 | dynamic_operational_fact | La ficha exige coordinación y autorización previa de CONAF Aysén bajo el reglamento de zonas remotas; verificar vigencia antes de viajar. | conaf-parque-nacional-bernardo-ohiggins |

## Relaciones nuevas

- `carretera-austral` → `connects_with` → `puerto-yungay`; `b05w2-002`; inversa explícita.
- `puerto-yungay` → `connects_by_ferry` → `rio-bravo`; `b05w2-001`; inversa explícita.
- `puerto-yungay` → `connectivity_context` → `carretera-austral`; `b05w2-002`; inversa explícita.
- `rio-bravo` → `road_access_context` → `villa-ohiggins`; `b05w2-003`; inversa explícita.
- `villa-ohiggins` → `lacustrine_access_context` → `bahia-bahamondes`; `b05w2-010`; inversa explícita.
- `bahia-bahamondes` → `lacustrine_connectivity_context` → `lago-ohiggins`; `b05w2-009`; inversa explícita.
- `villa-ohiggins` → `local_protected_area_context` → `parque-glaciar-rio-mosco`; `b05w2-013`; inversa explícita.
- `villa-ohiggins` → `access_context` → `parque-nacional-bernardo-ohiggins`; `b05w2-020`; inversa explícita.
- `lago-ohiggins` → `navigation_access_context` → `parque-nacional-bernardo-ohiggins`; `b05w2-020`; inversa explícita.
- `parque-nacional-bernardo-ohiggins` → `official_icefield_context` → `campo-de-hielo-sur`; `b05w2-019`; inversa explícita.

## Exclusiones y pendientes

Claims excluidos de embeddings generales: `b05w2-004`, `b05w2-006`, `b05w2-014`, `b05w2-015`, `b05w2-016`, `b05w2-021`. También quedan fuera todas las fuentes completas y las relaciones como registros, los horarios, tarifas, operadores, frecuencias, servicios, permisos y condiciones actuales. Los accesos estables no autorizan itinerarios: el acceso PNBO referencia expresamente su condición operacional b05w2-021.

Conflictos intactos: RP6 79,1/79,3 km; Río Bravo–Villa O’Higgins 90/100 km; Mitchell 45/50 min. No hay valor elegido.

Cerro Torre, Lago Chico y Glaciar Chico siguen candidatos sin paquete canónico. No se adquieren productos IGM ni se generan geometrías. Fitz Roy y Campo de Hielo Sur conservan todas sus salvaguardas.

Pendientes: estado actual del proyecto Puerto Yungay; operación de servicios y permisos; texto legal y administración vigente del BNP; discrepancia interna de comunas en ficha CONAF. La superficie PNBO se conserva exactamente como figura en la tabla (3.525.901,20 ha), sin derivar polígonos ni inferir soberanía.

## Validaciones

- Wave 2: 15/15 controles offline aprobados, incluidos los 13 requisitos solicitados y controles de JSON/procedencia.
- RAG: 72/72 tests en 16 archivos aprobados.
- Build disponible (`npm run build:client`): aprobado. No existe script genérico `build`.
- Typecheck: falla con seis diagnósticos preexistentes: TS2352 y TS2345 en `src/knowledge/straitProjection.ts` (53 y 79), y cuatro TS2339 en `tests/puertoWilliamsProjection.test.ts` (58–61). No se modificaron archivos del proyecto.
- Contratos históricos Wave 1 + Authority Closure: 18/18 aprobados en el checkout auditado `14a79f74c4a6631a6ce6d2a1d52e150c0a205e38`, con árbol idéntico a la base de esta wave. Los controles históricos que prohíben Wave 2 no son controles de alcance para el nuevo árbol; no se reescribieron.
- JSON: todos los JSON nuevos se validan con rechazo de claves duplicadas y formato de dos espacios.
- `git diff --check`: aprobado.

Limitación: pasar RAG demuestra que los consumidores existentes no sufren regresión; estos paquetes nuevos todavía no están conectados a esos consumidores.

## Archivos creados

- `data/knowledge/batch-05-wave-2-connectivity-graph.json`
- `data/knowledge/batch-05-wave-2-manifest.json`
- `data/knowledge/batch-05-wave-2-reconciliation.json`
- `data/sources/bienes-nacionales-rio-mosco-web.json`
- `data/sources/conaf-parque-nacional-bernardo-ohiggins.json`
- `data/sources/mop-bahia-bahamonde-port-2021.json`
- `data/sources/mop-puerto-yungay-design-2023.json`
- `data/sources/mop-puerto-yungay-design-2026.json`
- `data/verification/batch-05-wave-2-connectivity-validation.json`
- `knowledge-base/entities/geography/bahia-bahamondes/bahia-bahamondes.mdx`
- `knowledge-base/entities/geography/bahia-bahamondes/chunks.json`
- `knowledge-base/entities/geography/bahia-bahamondes/claims.json`
- `knowledge-base/entities/geography/bahia-bahamondes/metadata.json`
- `knowledge-base/entities/geography/bahia-bahamondes/relationships.json`
- `knowledge-base/entities/geography/bahia-bahamondes/sources.json`
- `knowledge-base/entities/infrastructure/rio-bravo/chunks.json`
- `knowledge-base/entities/infrastructure/rio-bravo/claims.json`
- `knowledge-base/entities/infrastructure/rio-bravo/metadata.json`
- `knowledge-base/entities/infrastructure/rio-bravo/relationships.json`
- `knowledge-base/entities/infrastructure/rio-bravo/rio-bravo.mdx`
- `knowledge-base/entities/infrastructure/rio-bravo/sources.json`
- `knowledge-base/entities/places/puerto-yungay/chunks.json`
- `knowledge-base/entities/places/puerto-yungay/claims.json`
- `knowledge-base/entities/places/puerto-yungay/metadata.json`
- `knowledge-base/entities/places/puerto-yungay/puerto-yungay.mdx`
- `knowledge-base/entities/places/puerto-yungay/relationships.json`
- `knowledge-base/entities/places/puerto-yungay/sources.json`
- `knowledge-base/entities/protected-areas/parque-glaciar-rio-mosco/chunks.json`
- `knowledge-base/entities/protected-areas/parque-glaciar-rio-mosco/claims.json`
- `knowledge-base/entities/protected-areas/parque-glaciar-rio-mosco/metadata.json`
- `knowledge-base/entities/protected-areas/parque-glaciar-rio-mosco/parque-glaciar-rio-mosco.mdx`
- `knowledge-base/entities/protected-areas/parque-glaciar-rio-mosco/relationships.json`
- `knowledge-base/entities/protected-areas/parque-glaciar-rio-mosco/sources.json`
- `knowledge-base/entities/protected-areas/parque-nacional-bernardo-ohiggins/chunks.json`
- `knowledge-base/entities/protected-areas/parque-nacional-bernardo-ohiggins/claims.json`
- `knowledge-base/entities/protected-areas/parque-nacional-bernardo-ohiggins/metadata.json`
- `knowledge-base/entities/protected-areas/parque-nacional-bernardo-ohiggins/parque-nacional-bernardo-ohiggins.mdx`
- `knowledge-base/entities/protected-areas/parque-nacional-bernardo-ohiggins/relationships.json`
- `knowledge-base/entities/protected-areas/parque-nacional-bernardo-ohiggins/sources.json`
- `knowledge-base/research/batch-05-wave-2-audit.md`
- `knowledge-base/research/batch-05-wave-2-retrieval-policy.json`
- `tests/knowledge/test_batch05_wave2.py`

Archivos modificados: 0. Eliminados: 0.

## Diff completo

`git diff 8ce686831f14bed8f9ebb16e1f586cb37004153a HEAD` tras obtener el commit publicado. Incluye exclusivamente los archivos enumerados arriba.
