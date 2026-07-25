# Implementation Plan: Local Destination Cards

## Overview

Implementación del módulo de fichas de destino locales como segundo slice vertical del sistema End of the World Travel Agent. El plan sigue la arquitectura hexagonal existente: extiende tipos de dominio, extrae la función de normalización a módulo compartido, implementa validación de esquema manual, crea un repositorio JSON local con indexación por slug y nombre, y expone el caso de uso `getDestinationCard`. Se incluyen 3 fichas JSON de fixture (Punta Arenas, Puerto Williams, Cabo de Hornos) y tests unitarios con Vitest.

## Tasks

- [x] 1. Extend domain types and extract normalize function
  - [x] 1.1 Extract `normalize` function to `src/domain/normalize.ts`
    - Create `src/domain/normalize.ts` exporting the `normalize` function (NFD → remove diacritics → lowercase → trim)
    - Update `src/application/answerTravelQuestion.ts` to import `normalize` from `../domain/normalize.js` instead of defining it locally
    - Verify existing tests still pass after extraction
    - _Requirements: 1.4, 9.6_

  - [x] 1.2 Extend `src/domain/types.ts` with destination card types
    - Add `"destination-info"` to `TravelIntent` union type
    - Add interfaces: `GeoCoordinates`, `StableData`, `InternalLink`, `DestinationCard`, `DestinationCardAnswer`
    - Add `"high" | "medium" | "none"` confidence type
    - Ensure `SourceReference` is reused (already exists)
    - Ensure `AnswerStatus` is reused (already exists)
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 5.1, 5.2_

- [x] 2. Implement schema validator
  - [x] 2.1 Create `src/adapters/validateDestinationCard.ts`
    - Export `ValidationError` interface with `path`, `violation`, and `message` fields
    - Export `ValidationResult` discriminated union type
    - Implement `validateDestinationCard(raw: unknown): ValidationResult`
    - Validate required fields present and non-empty: `id`, `name`, `region`, `comuna`, `coordinates`, `summary`, `stableData`, `warnings`, `sources`, `suggestedInternalLinks`, `verifiedAt`
    - Validate types: strings, numbers for coordinates, arrays for warnings/sources/links
    - Validate coordinate ranges: latitude ∈ [-90, 90], longitude ∈ [-180, 180]
    - Validate at least one source in `sources` array
    - Validate each source has non-empty `url` field
    - Validate `verifiedAt` is valid ISO 8601 (YYYY-MM-DD) and not future
    - Validate each internal link `path` starts with `/`
    - Return all errors found (not just the first one)
    - _Requirements: 2.1, 2.6, 4.1, 4.2, 4.3, 4.4, 6.5_

- [x] 3. Implement repository port and adapter
  - [x] 3.1 Create port interface `src/ports/DestinationCardRepository.ts`
    - Export `DestinationCardRepository` interface with methods: `findByNormalizedKey`, `listAll`, `listByRegion`
    - Import `DestinationCard` from domain types
    - _Requirements: 3.2_

  - [x] 3.2 Create adapter `src/adapters/LocalJsonDestinationCardRepository.ts`
    - Implement `LocalJsonDestinationCardRepository` class implementing `DestinationCardRepository`
    - In constructor: read all `*.json` files from given directory path synchronously
    - Parse and validate each file with `validateDestinationCard`
    - Index valid cards in two Maps: `cardsBySlug` (by `id` normalized) and `cardsByName` (by `name` normalized)
    - `findByNormalizedKey`: search first in `cardsBySlug`, then in `cardsByName`, return first match or `undefined`
    - `listAll`: return all valid cards
    - `listByRegion`: filter by normalized region match
    - On I/O error reading a file: skip it, log error with `console.error` including filename
    - On validation failure: skip file, log error with field path and violation type
    - On missing/empty directory: initialize with empty maps, log warning with `console.warn`
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 4.2, 4.5_

- [x] 4. Implement use case
  - [x] 4.1 Create `src/application/getDestinationCard.ts`
    - Export function `getDestinationCard(identifier: string, repository: DestinationCardRepository): DestinationCardAnswer`
    - If identifier is empty/null/whitespace-only → return `unsupported` response with `intent: "destination-info"`, `confidence: "none"`, empty arrays, summary indicating invalid identifier
    - Normalize identifier using shared `normalize` function
    - Call `repository.findByNormalizedKey(normalized)`
    - If not found → return `unsupported` response with summary "destino no disponible", `confidence: "none"`, empty arrays, no `verifiedAt`
    - If found → build `DestinationCardAnswer`:
      - `status: "supported"`, `intent: "destination-info"`
      - Derive `confidence`: all sources `"verified"` → `"high"`; any source `"provisional"` → `"medium"` with warning
      - Check each source `verifiedAt`: if >180 days from today → add warning with title and date
      - Include `suggestedInternalLinks` directly from card (no cross-repo validation)
      - Include `card` in response
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 5.1, 5.2, 5.3, 5.4, 5.5, 6.3, 6.4, 7.4_

- [x] 5. Checkpoint - Verify core logic compiles
  - Ensure `npm run typecheck` passes with no errors, ask the user if questions arise.

- [ ] 6. Create JSON fixture files
  - [ ] 6.1 Create `data/destinations/punta-arenas.json`
    - Include all required fields per schema
    - `id`: "punta-arenas", `name`: "Punta Arenas"
    - Region: "Magallanes y de la Antártica Chilena", Comuna: "Punta Arenas"
    - Coordinates: approximate (-53.1638, -70.9171)
    - `stableData` with `geographicContext` and `culturalContext`
    - At least one verified institutional source
    - `suggestedInternalLinks` referencing `/puerto-williams` and `/cabo-de-hornos`
    - Warnings about dynamic data (seasonal flights, weather)
    - `verifiedAt` with recent valid ISO date
    - _Requirements: 8.1, 8.4, 2.1, 2.2, 2.4, 7.1, 7.2, 7.3_

  - [ ] 6.2 Create `data/destinations/puerto-williams.json`
    - Include all required fields per schema
    - `id`: "puerto-williams", `name`: "Puerto Williams"
    - Region: "Magallanes y de la Antártica Chilena", Comuna: "Cabo de Hornos"
    - Coordinates: approximate (-54.9333, -67.6167)
    - `stableData.geographicContext` must mention Isla Navarino location
    - Summary uses neutral geographic language (NOT "ciudad más austral del mundo" without institutional source)
    - `stableData.culturalContext` referencing Yagán heritage
    - At least one verified Chilean institutional source
    - `suggestedInternalLinks` with relative paths starting with `/`
    - _Requirements: 8.1, 8.2, 2.1, 2.2, 2.4, 7.1_

  - [ ] 6.3 Create `data/destinations/cabo-de-hornos.json`
    - Include all required fields per schema
    - `id`: "cabo-de-hornos", `name`: "Cabo de Hornos"
    - Region: "Magallanes y de la Antártica Chilena", Comuna: "Cabo de Hornos"
    - Coordinates: approximate (-55.9833, -67.2667)
    - Represent the comuna as primary entity
    - `stableData` must include disambiguation note: three meanings (island, geographic cape, administrative comuna)
    - Summary must mention the island and cape as related entities
    - At least one verified Chilean institutional source
    - _Requirements: 8.1, 8.3, 8.5, 2.1, 2.2, 2.4_

- [ ] 7. Checkpoint - Validate fixtures load correctly
  - Ensure all 3 JSON files pass validation when loaded by the repository, ask the user if questions arise.

- [ ] 8. Write unit tests
  - [ ] 8.1 Create `tests/getDestinationCard.test.ts` — retrieval tests
    - Test: Retrieve Punta Arenas → response `supported` with all required fields, links to Puerto Williams and Cabo de Hornos
    - Test: Retrieve Puerto Williams → response `supported` with Isla Navarino geographic data
    - Test: Retrieve Cabo de Hornos → response `supported` with disambiguation note (comuna, isla, cabo)
    - Instantiate `LocalJsonDestinationCardRepository` with `data/destinations/` path
    - Verify `intent` is always `"destination-info"`
    - Verify `confidence` is `"high"` when all sources are `"verified"`
    - _Requirements: 9.1, 5.2, 5.3_

  - [ ] 8.2 Add normalization and search tests to `tests/getDestinationCard.test.ts`
    - Test: "Puerto Williams", "puerto williams", "PUERTO WILLIAMS", "puerto-williams" all resolve to same card
    - Test: "Cabo de Hornos", "cabo de hornos", "CABO DE HORNOS" resolve to same card
    - Test: variant without accent resolves correctly
    - _Requirements: 9.3, 1.4_

  - [ ] 8.3 Add unsupported destination tests to `tests/getDestinationCard.test.ts`
    - Test: Query non-existent destination → `status: "unsupported"`, `confidence: "none"`, empty arrays, message about unavailable destination
    - Test: Query empty string → `status: "unsupported"`, message about invalid identifier
    - Test: Query whitespace-only string → `status: "unsupported"`
    - _Requirements: 9.2, 1.2, 1.3, 5.5_

  - [ ] 8.4 Add validation tests to `tests/getDestinationCard.test.ts`
    - Test: JSON with missing required field → validator reports error with field path and `"missing"` violation
    - Test: JSON with invalid `verifiedAt` format → validator reports error with `"format"` violation
    - Test: JSON with coordinates out of range → validator reports `"range"` violation
    - Test: JSON with empty sources array → validator reports error
    - _Requirements: 9.4, 4.2, 4.3_

- [ ] 9. Final checkpoint - Run full test suite
  - Run `vitest run` to ensure all new tests pass alongside existing `answerTravelQuestion.test.ts` tests, ask the user if questions arise.

## Notes

- No property-based testing (fast-check) — only deterministic unit tests with Vitest
- No new dependencies added; uses only existing Vitest + TypeScript setup
- No connection to route repository — `getDestinationCard` is fully independent from `answerTravelQuestion`
- Internal links validated by format only (path starts with `/`), no cross-repository existence checking
- Puerto Williams description uses neutral geographic language per editorial guidelines
- All tests run offline — no network, LLM, RAG, or external API calls
- Existing connectivity flow (`answerTravelQuestion`) remains unchanged except importing `normalize` from shared module

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.2"] },
    { "id": 1, "tasks": ["2.1", "3.1"] },
    { "id": 2, "tasks": ["3.2"] },
    { "id": 3, "tasks": ["4.1"] },
    { "id": 4, "tasks": ["6.1", "6.2", "6.3"] },
    { "id": 5, "tasks": ["8.1", "8.2", "8.3", "8.4"] }
  ]
}
```
