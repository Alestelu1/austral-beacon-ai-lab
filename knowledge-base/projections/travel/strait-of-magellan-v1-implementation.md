# Strait of Magellan — Travel Projection v1 Implementation Brief

## Goal

Integrate the first safe, stable subset of the canonical `strait-of-magellan` knowledge into End of the World Travel Assistant without creating a second canonical entity and without exposing operational or restricted context.

Canonical source of truth:

- `knowledge-base/entities/geography/strait-of-magellan/`
- `knowledge-base/projections/travel/strait-of-magellan-v1.json`

The projection contract, not the legacy Atlas draft, defines what the Travel Assistant may consume.

## Architecture rule

```text
knowledge-base canonical claims
        ↓
travel projection contract
        ↓
projection/adaptor layer
        ↓
Travel Agent retrieval or deterministic relationship layer
```

Do not reverse this flow. `data/`, Atlas and Travel Agent artifacts are consumers/projections, not canonical replacements.

## First integration scope

The first implementation should support only stable identity/geographic context for the Strait.

Initial intents:

- `what_is_strait_of_magellan`
- `where_is_strait_of_magellan`
- `stable_geographic_context_strait`

The implementation may expose only claims listed under `allowed_claims` in the projection contract. Conditional claims require their stated guards.

## Explicit exclusions

Do not project as stable Travel Agent knowledge:

- currents;
- tides;
- traffic control procedures;
- vessel guidance;
- pilotage;
- VHF/radio procedures;
- current crossing/ferry conditions;
- treaty interpretation;
- sovereignty argumentation;
- strategic/military interpretation;
- detailed BNA hydrology;
- detailed marine ecosystem classification.

Any operational query must either use an existing live-verification path or return a safe response indicating current official verification is required.

## Provenance contract

Every projected fact must preserve:

- canonical `entity_id`;
- canonical `claim_id`;
- canonical `source_ids`;
- sensitivity;
- projection eligibility.

No freehand summarization may introduce facts not present in approved claim IDs.

## Punta Arenas relationship

`strait-of-magellan/relationships.json` currently records:

`punta-arenas` → `logistically_connected_to` with status `sourced_or_existing_entity`.

Do not expose this relationship in v1 until an explicit canonical claim/source relationship is verified for the public projection.

The future desired question set includes:

- `¿Qué relación tiene Punta Arenas con el Estrecho de Magallanes?`
- `Is Punta Arenas on the Strait of Magellan?`

but these should remain deferred until that provenance requirement is satisfied.

## Suggested implementation shape

Prefer a small projection/adaptor module rather than copying the canonical entity into a new `data/entities/*canonical*.json` file.

A generated artifact under `data/retrieval/` is acceptable only when it is clearly marked as generated/projected and contains canonical references.

Suggested conceptual record:

```json
{
  "projection_id": "travel-strait-of-magellan-v1",
  "canonical_entity_id": "strait-of-magellan",
  "claim_ids": ["strait-length-330-nm"],
  "source_ids": ["directemar-generalidades-estrecho-magallanes"],
  "sensitivity": "public_core",
  "embedding_ready": true
}
```

This example is structural. The implementation must derive final content from the canonical files and projection contract.

## Retrieval behavior

The existing Puerto Williams corpus must remain untouched until the projection adapter is validated.

Preferred sequence:

1. Build/read projection artifact.
2. Unit-test projection filtering.
3. Confirm blocked claims cannot enter the artifact.
4. Confirm source/claim provenance survives projection.
5. Add the minimal routing/retrieval integration.
6. Run full regression suite.
7. Manually test Spanish and English Strait identity questions.

## Required guard tests

At minimum:

1. Stable Strait identity/geographic query returns evidence-backed content.
2. English question can be answered without introducing new facts.
3. Current/tide/navigation question does not use static operational chunks.
4. Treaty/sovereignty query does not receive Travel projection content as legal interpretation.
5. `first-narrows-current-tide` cannot be embedded/projected.
6. `paso-tortuoso-traffic-control` cannot be embedded/projected.
7. Existing Puerto Williams, Puerto Toro, Villa Ukika and Cape Horn behavior remains unchanged.
8. Existing full suite remains green.

## Definition of done

Travel Projection v1 is complete only when:

- no parallel canonical Strait entity was created;
- only contract-approved claims are present;
- claim/source provenance is preserved;
- operational/restricted claims are excluded by tests;
- the Travel Agent can answer a basic Strait identity/geographic query;
- existing agent tests pass;
- git diff contains only intentional projection/integration changes.

## Not part of v1

- full Strait graph exposure;
- Paso Tortuoso travel guidance;
- Primera/Segunda Angostura operational guidance;
- hydrology BNA retrieval;
- ecosystem technical retrieval;
- Punta Arenas relationship until explicit canonical provenance is promoted;
- Atlas refactor;
- multilingual UX refactor beyond ensuring the new answer path can preserve current application behavior.
