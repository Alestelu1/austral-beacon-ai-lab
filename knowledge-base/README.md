# Austral Beacon Knowledge Base

Canonical, provenance-aware knowledge layer for Austral Beacon consumers.

## Canonical package

A canonical entity should normally expose:

- `<slug>.mdx`
- `<slug>/metadata.json`
- `<slug>/sources.json`
- `<slug>/claims.json`
- `<slug>/relationships.json`
- `<slug>/chunks.json`

Candidate or research-only entities may be intentionally incomplete, but `metadata.json` must state that they are non-canonical and whether public retrieval is blocked.

## Canonical field conventions

### metadata.json

Use:

- `id`: canonical folder/entity slug.
- `canonical_name`: preferred display name.
- `entity_type`: semantic entity class.
- `status`: `canonical`, `sourced`, `candidate`, `candidate_stub`, or another explicit governed state.
- `sensitivity`: `public_core`, `operational_dynamic`, `restricted_context`, or `internal_research`.
- `retrieval_scope`: explicit authorized consumers/scopes.
- `official_id`: institutional identifier when one exists, such as BNA or ECOMAR.

### sources.json

Canonical source key: `sources[].id`.

Each source should preserve institution, source type, title, provenance locator when available, and capture/verification date where relevant.

### claims.json

Canonical provenance key: `claims[].source_ids` as an array, even when a claim uses one source.

Legacy `source_id` may exist during migration but new or edited claims should use `source_ids`.

Claims should state `status` and sensitivity/freshness fields whenever the fact is dynamic, operational, restricted, disputed, or time-sensitive.

### relationships.json

Use `predicate`, `target`, and `status`. Relationships are claims and should carry provenance when the source is not already unambiguously inherited from the entity package.

Alias targets are allowed only when declared in the graph reconciliation registry. Do not create duplicate canonical entities solely to resolve an alias.

### chunks.json

Public/retrieval chunks must be traceable to `claim_ids` and/or `source_ids`.

Every chunk must state `sensitivity`.

Operational or restricted chunks must not be projected as stable Travel Agent knowledge. For operational content use, as appropriate:

- `sensitivity: operational_dynamic`
- `requires_current_verification: true`
- `embedding_eligible: false`
- `blocked_consumers: ["travel-agent"]`

## Promotion lifecycle

`candidate -> verified/sourced -> canonical`

Do not silently promote candidate graph targets. Preserve conflicts, aliases, provenance and sensitivity through promotion.

## Consumer rule

`knowledge-base/` is the canonical durable knowledge layer. Consumer-specific artifacts under `data/`, Atlas content, retrieval corpora and Travel Agent structures are projections/operational layers and must not silently replace canonical truth.
