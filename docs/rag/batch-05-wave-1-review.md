# Batch 05 — Wave 1: revisión final

Fecha de implementación: 2026-09-13. Fuentes recuperadas/revisadas: 2026-09-12.

Rama: `rag/batch-05-aysen-wave-1`. Base: `664804ca762cba619bb156e3ee46260979b87e93`.

Se implementan siete paquetes canónicos completos (MDX y cinco JSON cada uno) y se extiende Carretera Austral. Los ocho nodos diferidos no tienen paquetes canónicos. No hay cambios de aplicación, políticas globales ni workflows.

## Controles conservados

- Fitz Roy: clasificación automática por país bloqueada; contexto de referencia del límite internacional y observación desde RP6 separados; visibilidad no determina soberanía.
- Campo de Hielo Sur: `requires_authoritative_review` para validación fronteriza actual; ejecución bilateral no acreditada; ninguna geometría fronteriza generada.
- Villa O’Higgins: roles `documented_expedition_support_context` y `campo_de_hielo_sur_access_context`; sin ranking comparativo.
- Conflictos sin resolver: 79,1/79,3 km, 90/100 km y 45/50 minutos; valores con procedencia y `selected_value: null`.
- Los seis PDFs conservan sus IDs Drive, hashes SHA-256 y páginas. El registro jurídico complementario conserva BCN/DIFROL.
- AthenaLab e interpretación jurídica permanecen en investigación restringida. Documentos completos, metadatos, geometrías y operación dinámica no son entradas del embedding general.
- Los chunks estables están preparados; no se realizó ingesta vectorial ni integración de estas entidades en respuestas del Travel Agent.
- Carretera Austral conserva literalmente sus claims/chunks anteriores y su ID histórico. SERNATUR tiene ID propio. La arista existente a Villa O’Higgins recibe procedencia sin duplicarse.

## Validación

| Comprobación | Resultado |
|---|---|
| `python -m unittest discover -s tests/knowledge -p test_batch05_wave1.py -v` | 7 controles Wave 1 aprobados |
| `npm run test:rag` | 72 pruebas aprobadas, 16 archivos |
| `npm run build:client` | Aprobado |
| `python projects/atlas/scripts/read_mdx_entities.py` | Aprobado; lector del contenido Atlas existente, no compilador del nuevo MDX |
| `npm test` | 355 aprobadas, 17 fallidas; mismos casos fallidos en base y Wave 1 |
| `npm run typecheck` | Fallido; salida idéntica en base y Wave 1 |
| `git diff --check` | Aprobado |

Las comprobaciones base se ejecutaron en un worktree independiente del commit base, usando las mismas dependencias. No se corrigieron errores ajenos al alcance autorizado. No hay compilador MDX general ni build raíz declarado; `build:client` corresponde al cliente del agente. Los evaluadores semánticos contra proveedores reales no se ejecutaron: no son validación local ni evidencia de ingesta del lote.

### Fallos de TypeScript preexistentes

```text
src/knowledge/straitProjection.ts(53,20): error TS2352: Conversion of type '{ entity_id: string; claims: ({ id: string; statement: string; status: string; sensitivity: string; source_ids: string[]; governance_guard?: undefined; embedding_eligible?: undefined; blocked_consumers?: undefined; requires_current_verification?: undefined; } | { ...; } | { ...; } | { ...; })[]; }' to type '{ entity_id: string; claims: CanonicalClaim[]; }' may be a mistake because neither type sufficiently overlaps with the other. If this was intentional, convert the expression to 'unknown' first.
src/knowledge/straitProjection.ts(79,39): error TS2345: Argument of type '(c: { claim_id: string; }) => string' is not assignable to parameter of type '(value: string, index: number, array: string[]) => string'.
tests/puertoWilliamsProjection.test.ts(58,57): error TS2339: Property 'card' does not exist on type 'TravelAnswer | DestinationCardAnswer'.
tests/puertoWilliamsProjection.test.ts(59,19): error TS2339: Property 'card' does not exist on type 'TravelAnswer | DestinationCardAnswer'.
tests/puertoWilliamsProjection.test.ts(60,19): error TS2339: Property 'card' does not exist on type 'TravelAnswer | DestinationCardAnswer'.
tests/puertoWilliamsProjection.test.ts(61,19): error TS2339: Property 'card' does not exist on type 'TravelAnswer | DestinationCardAnswer'.
```

### Casos fallidos de la suite general, idénticos en base y Wave 1

- `antarcticAccessFlow.test.ts`: Flow 3 — accessing Antarctica from Chile distinguishes source verification from independently verified operation in metadata
- `antarcticAccessFlow.test.ts`: Flow 3 — accessing Antarctica from Chile does not describe first-party commercial products as a currently operating service
- `antarcticAccessFlow.test.ts`: Flow 3 — accessing Antarctica from Chile frames commercial products as published/offered, not as independently verified current operation
- `antarcticAccessFlow.test.ts`: Flow 3 — accessing Antarctica from Chile keeps Puerto Williams as gateway-only (gateway vs service distinction)
- `antarcticAccessFlow.test.ts`: Flow 3 — accessing Antarctica from Chile separates gateway status from published transport products
- `puertoToroIdentity.test.ts`: Puerto Toro — no fabricated coordinates / population / schedules keeps maritime connectivity dynamic and non-tourist
- `puertoWilliamsCaboDeHornosFlow.test.ts`: Flow 2 — Puerto Williams / Cabo de Hornos relationship does not imply Puerto Williams is located at Cape Horn itself
- `puertoWilliamsCaboDeHornosFlow.test.ts`: Flow 2 — Puerto Williams / Cabo de Hornos relationship does not infer transport/access from geographic proximity
- `puertoWilliamsCaboDeHornosFlow.test.ts`: Flow 2 — Puerto Williams / Cabo de Hornos relationship explains the geographic distinction (Isla Navarino vs the cape/island)
- `puertoWilliamsCaboDeHornosFlow.test.ts`: Flow 2 — Puerto Williams / Cabo de Hornos relationship includes a warning that current access to the cape/island/park requires verification
- `puntaArenasPuertoWilliamsFlow.test.ts`: Flow 1 — Punta Arenas → Puerto Williams (deterministic connectivity) does not infer an operational service from infrastructure alone
- `puntaArenasPuertoWilliamsFlow.test.ts`: Flow 1 — Punta Arenas → Puerto Williams (deterministic connectivity) exposes verified transport modes (air and sea) as stable route identity
- `straitInfoFlow.test.ts`: Strait of Magellan — verified Chilean geographic/jurisdictional context (public_core) '¿Bajo qué jurisdicción está el Estrecho de Magallanes?' -> DIRECTEMAR jurisdiction fact, no treaty interpretation
- `straitProjection.test.ts`: Strait projection v1 — contract filtering exposes only the contract-allowed claim(s)
- `villaUkikaIdentity.test.ts`: Villa Ukika — identity and relationship queries (Spanish + English) describes Villa Ukika as a living/contemporary Yagán community context
- `villaUkikaIdentity.test.ts`: Villa Ukika — mandatory safeguards does NOT invent coordinates and keeps geometry pending; distance is provisional
- `villaUkikaIdentity.test.ts`: Villa Ukika — mandatory safeguards does NOT present Villa Ukika merely as a tourist attraction / static ethnographic site

## Archivos creados

Total: 58.

- `data/geospatial/campo-hielo-sur-authoritative-geospatial-plan.json`
- `data/knowledge/batch-05-wave-1-manifest.json`
- `data/knowledge/batch-05-wave-1-reconciliation.json`
- `data/knowledge/campo-hielo-sur-local-graph.json`
- `data/research/geopolitics/athenalab-campo-hielo-sur-review.json`
- `data/sources/athenalab-campo-hielo-sur-research-source.json`
- `data/sources/bcn-acuerdo-fitz-roy-daudet-1998.json`
- `data/sources/bienes-nacionales-parque-glaciar-mosco.json`
- `data/sources/bienes-nacionales-rp6-campo-hielo-sur.json`
- `data/sources/bienes-nacionales-rp6-ficha.json`
- `data/sources/carretera-austral-historical-context.json`
- `data/sources/sernatur-carretera-austral-aysen.json`
- `data/verification/campo-hielo-sur-chilean-authority-validation.json`
- `docs/rag/batch-05-wave-1-review.md`
- `knowledge-base/entities/geography/campo-de-hielo-sur.mdx`
- `knowledge-base/entities/geography/campo-de-hielo-sur/chunks.json`
- `knowledge-base/entities/geography/campo-de-hielo-sur/claims.json`
- `knowledge-base/entities/geography/campo-de-hielo-sur/metadata.json`
- `knowledge-base/entities/geography/campo-de-hielo-sur/relationships.json`
- `knowledge-base/entities/geography/campo-de-hielo-sur/sources.json`
- `knowledge-base/entities/geography/glaciar-ohiggins.mdx`
- `knowledge-base/entities/geography/glaciar-ohiggins/chunks.json`
- `knowledge-base/entities/geography/glaciar-ohiggins/claims.json`
- `knowledge-base/entities/geography/glaciar-ohiggins/metadata.json`
- `knowledge-base/entities/geography/glaciar-ohiggins/relationships.json`
- `knowledge-base/entities/geography/glaciar-ohiggins/sources.json`
- `knowledge-base/entities/geography/lago-ohiggins.mdx`
- `knowledge-base/entities/geography/lago-ohiggins/chunks.json`
- `knowledge-base/entities/geography/lago-ohiggins/claims.json`
- `knowledge-base/entities/geography/lago-ohiggins/metadata.json`
- `knowledge-base/entities/geography/lago-ohiggins/relationships.json`
- `knowledge-base/entities/geography/lago-ohiggins/sources.json`
- `knowledge-base/entities/geography/monte-fitz-roy-chalten.mdx`
- `knowledge-base/entities/geography/monte-fitz-roy-chalten/chunks.json`
- `knowledge-base/entities/geography/monte-fitz-roy-chalten/claims.json`
- `knowledge-base/entities/geography/monte-fitz-roy-chalten/metadata.json`
- `knowledge-base/entities/geography/monte-fitz-roy-chalten/relationships.json`
- `knowledge-base/entities/geography/monte-fitz-roy-chalten/sources.json`
- `knowledge-base/entities/places/candelario-mansilla.mdx`
- `knowledge-base/entities/places/candelario-mansilla/chunks.json`
- `knowledge-base/entities/places/candelario-mansilla/claims.json`
- `knowledge-base/entities/places/candelario-mansilla/metadata.json`
- `knowledge-base/entities/places/candelario-mansilla/relationships.json`
- `knowledge-base/entities/places/candelario-mansilla/sources.json`
- `knowledge-base/entities/places/villa-ohiggins.mdx`
- `knowledge-base/entities/places/villa-ohiggins/chunks.json`
- `knowledge-base/entities/places/villa-ohiggins/claims.json`
- `knowledge-base/entities/places/villa-ohiggins/metadata.json`
- `knowledge-base/entities/places/villa-ohiggins/relationships.json`
- `knowledge-base/entities/places/villa-ohiggins/sources.json`
- `knowledge-base/entities/routes/ruta-patrimonial-6.mdx`
- `knowledge-base/entities/routes/ruta-patrimonial-6/chunks.json`
- `knowledge-base/entities/routes/ruta-patrimonial-6/claims.json`
- `knowledge-base/entities/routes/ruta-patrimonial-6/metadata.json`
- `knowledge-base/entities/routes/ruta-patrimonial-6/relationships.json`
- `knowledge-base/entities/routes/ruta-patrimonial-6/sources.json`
- `knowledge-base/research/batch-05-wave-1-evidence-register.json`
- `tests/knowledge/test_batch05_wave1.py`

## Archivos modificados

Total: 5.

- `knowledge-base/entities/routes/carretera-austral/carretera-austral.mdx`
- `knowledge-base/entities/routes/carretera-austral/chunks.json`
- `knowledge-base/entities/routes/carretera-austral/claims.json`
- `knowledge-base/entities/routes/carretera-austral/relationships.json`
- `knowledge-base/entities/routes/carretera-austral/sources.json`

## Revisión y diff

Comparación: https://github.com/Alestelu1/austral-beacon-ai-lab/compare/664804ca762cba619bb156e3ee46260979b87e93...rag/batch-05-aysen-wave-1

No se hizo merge ni push directo a main. La rama queda pendiente de revisión final.
