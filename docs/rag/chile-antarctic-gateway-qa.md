# QA validation — Chile Antarctic Gateway retrieval

## Purpose

Validate that the current Knowledge Layer retrieves the correct evidence and respects source/status boundaries before semantic embeddings are enabled.

The machine-readable suite is stored at:

`tests/rag/chile-antarctic-gateway-qa.json`

## What is being tested

The suite does not test general Antarctic knowledge. It tests whether an agent using the Austral Beacon retrieval view can:

- retrieve the expected canonical chunks;
- distinguish institutional evidence from first-party commercial evidence;
- distinguish current operation from policy and planning;
- distinguish tourism/public access from state/scientific capability;
- preserve freshness requirements for routes, seasons and prices;
- refuse unsupported inference instead of inventing a bridge between facts.

## Initial cases

The first version contains 12 cases covering:

1. Punta Arenas → Isla Rey Jorge access.
2. Puerto Williams and the absence of established current commercial operations in the present corpus.
3. Teniente Marsh vs Glaciar Unión.
4. Existing vs planned Antarctic infrastructure.
5. Villa Las Estrellas vs scientific bases.
6. Evidence for Punta Arenas as a gateway.
7. State/scientific deep-field capability vs tourism to the South Pole.
8. Base Profesor Julio Escudero and its planned 2030 renewal.
9. INACH Antarctic climate monitoring network.
10. Source-routing behavior for the Travel Assistant.
11. Operational differences between Punta Arenas and Puerto Williams.
12. Isla Rey Jorge → Península de Fildes → Villa Las Estrellas geographic relationship.

## Pass criteria

A case passes only when the answer:

- contains all required factual points;
- uses evidence from the expected retrieval chunks or equivalent canonical evidence;
- does not trigger any `must_not_claim` condition;
- carries planning/current-operation qualifiers where required;
- requests or performs freshness verification before exposing volatile commercial details as current.

## Failure classes

`retrieval_failure`
: The relevant chunk was not retrieved.

`source_routing_failure`
: The answer used the wrong source class, such as promotional material for a geographic fact when an institutional source exists.

`temporal_failure`
: Planned, historical or seasonal information was presented as current permanent fact.

`capability_access_failure`
: Military, scientific or logistical capability was converted into public/tourist availability.

`entity_failure`
: Distinct entities were conflated, such as Villa Las Estrellas and Base Escudero.

`unsupported_inference`
: The answer added a relationship not established by the current corpus.

## Execution stages

### Stage 1 — Manual / deterministic review

Run each question against the current retrieval view and inspect whether the expected chunk IDs and answer constraints are satisfied. This is the current stage.

### Stage 2 — Retrieval engine

Once semantic chunks and embeddings are generated, execute the same questions automatically and log:

- top-k retrieved chunks;
- retrieval score;
- source IDs;
- generated answer;
- pass/fail result;
- failure class.

### Stage 3 — Regression

Every new corpus batch — for example Ruta de los Parques, Magallanes destination material or new Antarctic operator documents — reruns the suite. New documents must improve coverage without causing existing answers to regress.

## Relationship with future corpus batches

This test structure is reusable. Future suites should include, for example:

- `tests/rag/magallanes-travel-qa.json`
- `tests/rag/ruta-de-los-parques-qa.json`
- `tests/rag/puerto-williams-qa.json`
- `tests/rag/austral-connectivity-qa.json`

This makes QA part of the ingestion pipeline rather than an afterthought after embeddings have already been generated.

## Current decision

Do not mark the Antarctic retrieval view as embedding-ready solely because the documents have been extracted. First validate source routing and prohibited inferences against this QA suite.
