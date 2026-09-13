# Batch 05 — Authority Closure Patch

Estado: preparado para auditoría; no merge. Base auditada: `01baf78d67431fc8fedc60641fb563d0dd9401c9`. Rama: `rag/batch-05-authority-closure`. Revisión documental: 2026-09-13.

## Resultado y límites de la evidencia

Este parche agrega seis registros de fuentes, cinco familias de productos cartográficos y diez claims de alcance documental. Modifica siete archivos de Wave 1 y crea once archivos. No añade entidades canónicas, nodos de grafo, chunks, geometrías ni datos vectoriales.

La campaña se verifica por el título y fecha del historial oficial del IGM; el cuerpo de la noticia sigue pendiente. `official_geodetic_activity_2025 = verified` significa únicamente campaña, mediciones en Villa O’Higgins y año 2025. No identifica técnicas, segmento fronterizo ni resultados bilaterales.

La condición de registro de la carta aeronáutica se cumple para la **identidad y objeto de la resolución en el registro administrativo oficial**: número 76, 24-06-2025, SAF, escala 1:500.000 e información aeronáutica 2024. El source record es `qualified`: no se recuperó el PDF resolutivo ni se verificaron firma, cláusulas o vigencia operativa. No se atribuye una autorización específica más allá del asiento consultado.

La página DIFROL consultada muestra recursos versión 2.0 publicados el 30-12-2025. El sufijo `2026` es el ciclo de revisión solicitado; la fecha y el texto del anuncio de 2026 **no quedaron verificados**. No se reemplaza la fecha de los recursos por la del anuncio.

## Fuentes nuevas

| Source ID | Ubicación oficial y alcance | Estado |
| --- | --- | --- |
| `igm-campo-hielo-sur-campaign-2025` | [IGM realizó mediciones en Villa O’Higgins para la Campaña Campo de Hielo Sur 2025](https://www.igm.cl/?menu=5&page=noticias-actividades-igm2); Título y fecha en el historial oficial del IGM: denominación de campaña, mediciones en Villa O’Higgins y año 2025. No se recuperó el cuerpo de la noticia. | `verified` |
| `igm-campos-de-hielo-sur-250k` | [Campos de Hielo Sur — carta regular 1:250.000 (JPG)](https://www.igm.cl/tiendaonline/inicio/5760-campos-de-hielo-sur-jpg.html); Sólo los hechos identificados en evidence_register; sin inferencias de soberanía, resultados fronterizos ni operación actual. | `verified` |
| `igm-j134-cerro-ohiggins-50k` | [Carta J134 — Cerro O’Higgins, 1:50.000](https://www.igm.cl/tiendaonline/1178-carta-j134-cerro-o-higgins); Sólo los hechos identificados en evidence_register; sin inferencias de soberanía, resultados fronterizos ni operación actual. | `verified` |
| `igm-villa-lago-ohiggins-50k-catalog` | [Catálogo oficial IGM — cartas J113, J135 y J136, serie 1:50.000](https://www.igm.cl/tiendaonline/content/4-nuestra-tienda); Identidad y pertenencia a la serie 1:50.000 en el catálogo; J113 además tiene una entrada descriptiva en Sección J página 34. No se verificaron sus fichas individuales ni variantes. | `verified` |
| `difrol-official-maps-2026` | [DIFROL — Esquicio de Chile, colección consultada en 2026](https://www.difrol.cl/descarga-esquicio-de-chile/); Página oficial de recursos: disponibilidad de esquicios y versión 2.0, fecha publicada 30-12-2025. El nombre de archivo 2026 identifica el ciclo de revisión, no una fecha de edición. | `verified` |
| `difrol-villa-ohiggins-aeronautical-chart-2025` | [DIFROL — registro oficial de Resolución 76/2025, Carta Aeronáutica Villa O’Higgins](https://www.difrol.cl/transparencia/terceros_instrucciones-dictamenes-circulares_2025.html); Existencia, número, fecha y objeto de la resolución verificados en la tabla oficial de DIFROL. No equivale a lectura del texto íntegro, verificación de firma o revisión de cláusulas. | `qualified` |

## Productos IGM registrados

| Producto | Escala | Formatos documentados | CRS / cobertura |
| --- | --- | --- |
| Campos de Hielo Sur | 1:250000 | JPG | Proyección, datum, huso y cobertura detallada pendientes |
| J113 Villa O’Higgins | 1:50000 | Pendientes por producto | Entrada de catálogo; no hereda metadatos de J134 |
| J134 Cerro O’Higgins | 1:50000 | JPG, GeoTIFF, SHP, papel | Ficha SHP: U.T.M, GRS80, SIRGAS (WGS84), huso 18; topónimos Ventisquero O’Higgins, Lago O’Higgins y Lago Chico |
| J135 Lago O’Higgins | 1:50000 | Pendientes por producto | Entrada de catálogo |
| J136 Brazo Nordeste–Lago O’Higgins | 1:50000 | Pendientes por producto | Entrada de catálogo |

Todos quedan `not_acquired`, `license_status: requires_review` y `canonical_geometry_authorized: false`. La oferta de catálogo no garantiza stock. Los datos técnicos de J134 proceden del cuerpo de su ficha SHP recuperado por búsqueda web; una reapertura directa falló. No se inspeccionó ningún archivo GIS, asignó EPSG, trazó cobertura ni normalizó su descripción administrativa. Los metadatos de variantes no consultadas quedan vacíos.

## Claims añadidos

- `ac05-001` — El historial oficial del IGM registra una actividad denominada Campaña Campo de Hielo Sur 2025. (`verified`; source `igm-campo-hielo-sur-campaign-2025`).
- `ac05-002` — El título publicado por el IGM informa mediciones en Villa O’Higgins para esa campaña. (`verified`; source `igm-campo-hielo-sur-campaign-2025`).
- `ac05-003` — La campaña se identifica con el año 2025; su entrada en el historial del IGM está fechada el 13 de octubre de 2025. (`verified`; source `igm-campo-hielo-sur-campaign-2025`).
- `ac05-004` — El IGM ofrece en su catálogo una carta Campos de Hielo Sur a escala 1:250.000 en formato JPG. (`verified`; source `igm-campos-de-hielo-sur-250k`).
- `ac05-005` — El catálogo del IGM identifica J134 Cerro O’Higgins a escala 1:50.000 y lista variantes JPG, GeoTIFF, SHP y papel. (`verified`; source `igm-j134-cerro-ohiggins-50k`).
- `ac05-006` — El catálogo oficial del IGM incluye la carta J113 Villa O’Higgins bajo la serie 1:50.000; las variantes individuales no fueron verificadas. (`verified`; source `igm-villa-lago-ohiggins-50k-catalog`).
- `ac05-007` — El catálogo oficial del IGM incluye la carta J135 Lago O’Higgins bajo la serie 1:50.000; las variantes individuales no fueron verificadas. (`verified`; source `igm-villa-lago-ohiggins-50k-catalog`).
- `ac05-008` — El catálogo oficial del IGM incluye la carta J136 Brazo Nordeste–Lago O’Higgins bajo la serie 1:50.000; las variantes individuales no fueron verificadas. (`verified`; source `igm-villa-lago-ohiggins-50k-catalog`).
- `ac05-009` — DIFROL dispone una colección de esquicios en Adobe Illustrator y PDF; la página identifica versión 2.0 y fecha de publicación 30 de diciembre de 2025. (`verified`; source `difrol-official-maps-2026`).
- `ac05-010` — La tabla oficial de DIFROL registra la resolución 76 del 24 de junio de 2025 para SAF: Carta Aeronáutica Villa O’Higgins a escala 1:500.000 con información aeronáutica de 2024. (`qualified`; source `difrol-villa-ohiggins-aeronautical-chart-2025`).

Los tres claims de campaña se añaden también a Villa O’Higgins. `relationships.json.source_contexts` los vincula a un **source record de actividad**, no a una nueva entidad o nodo. Los hechos previos permanecen intactos; la colección `relationships` no se altera. No se modifica el grafo derivado, porque no se añadieron relaciones entre entidades.

## Estados de verificación

| Campo nuevo | Estado | Alcance |
| --- | --- | --- |
| `legal_instrument_status` | `verified` | Existencia/texto del instrumento ya verificados en Wave 1; no nueva interpretación ni ejecución |
| `official_geodetic_activity_2025` | `verified` | Sólo denominación, mediciones en Villa O’Higgins y año |
| `official_igm_mapping_products_available` | `verified` | Existencia en catálogo; variantes sólo donde comprobadas |
| `current_joint_cartographic_execution_status` | `requires_authoritative_review` | Requiere declaración chilena explícita y reciente sobre Sección B |
| `canonical_boundary_geometry_status` | `not_authorized` | Restricción del parche |

Los estados existentes de los claims AthenaLab, la ejecución bilateral y los tres conflictos no cambian. Los cinco campos nuevos incluyen un alcance diferenciado en `authority_closure.status_evidence`. La actividad IGM y la oferta de cartas no cierran la ejecución conjunta.

## Vacíos pendientes

- Declaración reciente MINREL/DIFROL sobre el estado específico de Sección B.
- Cuerpo de la noticia de campaña y resultados expresamente documentados, sin inferencias limítrofes.
- Fichas individuales de J113/J135/J136; otras variantes de 250k; licencias, fecha de edición de cartas y revisión de metadatos internos si una futura adquisición se autoriza.
- URL y texto íntegro del anuncio DIFROL 2026; texto íntegro de resolución 76/2025.
- Evidencia MOP/Vialidad/DOP/MTT/DIRECTEMAR sobre obras y operación; la cartografía y el asiento aeronáutico no acreditan infraestructura ejecutada ni servicios actuales.
- Conflictos preservados: RP6 79,1/79,3 km; Río Bravo–Villa O’Higgins 90/100 km; cruce 45/50 min.
- Claims AthenaLab siguen sujetos a validación primaria.

El navegador recibió controles de seguridad en IGM y DIFROL y se cerró esa vía. Se usaron páginas y cuerpos de resultados oficiales recuperados por la consulta web, con sus límites explícitos. No se intentó eludir los controles ni acceder a productos de pago.

## Archivos creados

- `data/geospatial/campo-hielo-sur-igm-product-registry.json`
- `data/knowledge/batch-05-authority-closure-manifest.json`
- `data/sources/difrol-official-maps-2026.json`
- `data/sources/difrol-villa-ohiggins-aeronautical-chart-2025.json`
- `data/sources/igm-campo-hielo-sur-campaign-2025.json`
- `data/sources/igm-campos-de-hielo-sur-250k.json`
- `data/sources/igm-j134-cerro-ohiggins-50k.json`
- `data/sources/igm-villa-lago-ohiggins-50k-catalog.json`
- `docs/rag/batch-05-authority-closure-review.md`
- `knowledge-base/research/batch-05-authority-closure-evidence-register.json`
- `tests/knowledge/test_batch05_authority_closure.py`

## Archivos modificados

- `data/geospatial/campo-hielo-sur-authoritative-geospatial-plan.json`
- `data/verification/campo-hielo-sur-chilean-authority-validation.json`
- `knowledge-base/entities/geography/campo-de-hielo-sur/metadata.json`
- `knowledge-base/entities/places/villa-ohiggins/claims.json`
- `knowledge-base/entities/places/villa-ohiggins/metadata.json`
- `knowledge-base/entities/places/villa-ohiggins/relationships.json`
- `knowledge-base/entities/places/villa-ohiggins/sources.json`

## Validación

- Controles Wave 1: 7 pruebas. Controles Authority Closure: 11 pruebas; comparan los archivos con la base auditada, procedencia, contratos JSON, ausencia de geometría, adquisición, ingesta, promoción de candidatos y cambios fuera de alcance.
- Suite RAG: `npm run test:rag`, **72/72**, 16 archivos de tests.
- Build cliente: `npm run build:client`, **aprobado**.
- `npm run typecheck`: **falló** con los mismos diagnósticos preexistentes observados en Wave 1: `straitProjection.ts` (TS2352 y TS2345) y `puertoWilliamsProjection.test.ts` (cuatro TS2339). Esos archivos no se modifican en este parche.
- La suite completa `npm test` no se repitió; el control solicitado es la suite RAG. No se afirma que toda la aplicación pase sus tests.
- Las pruebas usan datos locales y dobles de prueba; no llaman proveedores de embeddings ni realizan ingesta.
- Los primeros ensayos del nuevo control detectaron el informe aún no creado, una referencia textual de geometría preexistente confundida con datos geométricos y el enlace temporal de dependencias. Se completó el informe, se acotó la excepción a las referencias idénticas del plan original y se retiró el enlace tras ejecutar las pruebas de la aplicación.
- JSON UTF-8 con indentación de dos espacios, claves únicas y salto final; `git diff --check`.
- El workflow RAG existente no se amplía; sus filtros no cubren esta rama y estas rutas. Los resultados locales no se presentan como checks remotos.

## Revisión y diff

El manifest enumera exactamente los archivos del parche. Para revisar el diff completo, desde esta rama:

```sh
git diff 01baf78d67431fc8fedc60641fb563d0dd9401c9...HEAD
```

El commit publicado contiene sólo este parche sobre la base esperada. No se modifica `main`, no se crea un PR, no se realiza merge ni se inicia Wave 2. La rama queda detenida para auditoría.
