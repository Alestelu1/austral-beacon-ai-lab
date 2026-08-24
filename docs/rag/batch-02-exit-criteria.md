# Batch 02 Exit Criteria — Magallanes / Ruta de los Parques

Status: **conditionally ready for merge as a knowledge-layer milestone; not ready for general embeddings or live travel claims without revalidation.**

## Exit criteria

### 1. Source and provenance
- Stable territorial claims must have an identifiable source class and source scope.
- Dynamic transport, border, park-opening and road-condition claims must carry freshness/recheck rules.
- Geometry must not be promoted to Atlas core without producer, dataset/layer, CRS and retrieval date.

### 2. Canonical entity model
- Canonical IDs are reused consistently across retrieval and knowledge graphs.
- Stable identity/administrative hierarchy is separated from dynamic schedules, fares, closures and availability.
- Shared IDs across graphs do not transfer operational meaning automatically.

### 3. Connectivity graph safeguards
The graph must explicitly prevent at least these unsupported inferences:
- Ruta Y-85 is a completed through-road to Puerto Williams.
- Puerto Navarino infrastructure proves a scheduled international passenger ferry.
- Puerto Williams–Puerto Toro subsidized transport is a normal tourism product.

### 4. Retrieval behavior
- Historical map timings never override current first-party transport data.
- Construction status is never silently upgraded to completed.
- Park access is separated from visitor services and public-use infrastructure.
- Booking-sensitive services require first-party recheck at answer time.

### 5. QA coverage
Required suites:
- `tests/rag/magallanes-travel-qa.json`
- `tests/rag/southern-magallanes-access-qa.json`
- `tests/rag/tierra-del-fuego-navarino-qa.json`
- `tests/knowledge/southern-magallanes-graph-qa.json`
- `tests/knowledge/atlas-geospatial-provenance-qa.json`
- `tests/knowledge/southern-magallanes-atlas-promotion-qa.json`

Current limitation: these are regression datasets, not yet an executable retrieval test runner.

## Embedding gate

### Eligible after chunk-level provenance review
- stable place identity and administrative hierarchy;
- protected-area identity and conservation context;
- stable route identity and non-temporal network relationships;
- responsible-travel principles;
- sourced historical/contextual material when clearly labeled by date.

### Keep outside general semantic embeddings or route through a dynamic layer
- current ferry schedules and fares;
- current border hours/open/closed state;
- temporary road conditions;
- current park opening/ticketing conditions;
- tour availability and booking inventory;
- construction progress presented as a live status;
- any future claim whose correctness depends on answer date.

Dynamic facts may still be indexed for discovery only if they retain `checked_at`/`verified_at`, freshness class and mandatory revalidation before user-facing use.

## Geometry gate
The following remain `geometry_pending`: Puerto Williams, Puerto Navarino, Puerto Toro, Porvenir, Cerro Sombrero, Primera Angostura, San Sebastián, Bellavista, Ruta Y-905, Ruta Y-85, Yendegaia, Alberto de Agostini and Cabo de Hornos.

Geometry pending is **not a blocker for merging the knowledge-layer milestone** because the current Atlas-ready index explicitly prevents promotion without authoritative geometry provenance. It is a blocker for declaring those records fully Atlas-ready.

## Merge decision
A merge may proceed when:
1. PR is conflict-free and checks pass.
2. No unresolved high-severity factual/structural inconsistency is detected in the final audit.
3. Geometry remains gated rather than guessed.
4. General embeddings remain disabled until the embedding-readiness classification is implemented.

After merge, continue geometries and executable RAG QA on a separate branch/PR.