# Austral Beacon — Canonical Entity Taxonomy

Status: Active governance document  
Scope: `knowledge-base/entities/`  
Purpose: define the canonical category map and prevent duplicate, arbitrary or consumer-specific entity structures.

## 1. Core rule

`knowledge-base/` is the durable canonical knowledge layer for Austral Beacon.

Consumers such as End of the World Travel, End of the World Atlas, Travel Assistant, Observatorio de Conectividad Austral, Radar and future APIs must consume canonical knowledge through projections, adapters, retrieval corpora or other derived artifacts. They must not silently create parallel canonical truth.

A mature canonical entity should normally expose:

- `<slug>.mdx`
- `<slug>/metadata.json`
- `<slug>/sources.json`
- `<slug>/claims.json`
- `<slug>/relationships.json`
- `<slug>/chunks.json`

New or edited claims use `source_ids` arrays for provenance. Public/retrieval chunks must remain traceable to claims and/or sources and must state sensitivity.

## 2. Governing principle

Do not create a new root directory merely because a new `entity_type` appears.

Use:

- root category = broad durable semantic domain;
- `entity_type` = precise class inside that domain;
- relationships = graph semantics between entities;
- claims = factual state and assertions, including dynamic state;
- projections = consumer-specific views.

Prefer a small stable set of roots over an ever-growing folder taxonomy.

## 3. Canonical root map

### Existing roots — preserve

These roots already exist and must not be reorganized without a specific migration plan and demonstrated benefit.

| Root | Canonical role | Examples |
| --- | --- | --- |
| `places/` | Human settlements and inhabited localities | Puerto Williams, Puerto Toro, Villa Ukika, Punta Arenas |
| `geography/` | Physical geographic entities and land/water features | Strait of Magellan, Beagle Channel, Isla Dawson, Isla Santa Inés |
| `hydrology/` | Official hydrological units and watershed hierarchy | BNA 127, BNA 1270, BNA 1273, BNA 1274 |
| `ecosystems/` | Ecological systems, ecological units and functional bio-physical systems | ECOMAR units, Patagonian kelp forests |
| `heritage/` | Material and intangible heritage entities | Goleta Ancud, Fuerte Bulnes, heritage sites and historic objects |
| `history/` | Historical events, processes and documented episodes | Taking possession of the Strait in 1843, early settlement processes |
| `science/` | Scientific phenomena, research concepts and scientific knowledge entities | Patagonia–Antarctica geological connection, polar/sub-Antarctic research concepts |

### Approved future roots — create only when first justified entity is ready

| Root | Canonical role | Examples / intended entity types |
| --- | --- | --- |
| `jurisdictions/` | Formally established political-administrative, jurisdictional and recognized territorial units | region, province, commune, ADI or other formal jurisdictional unit |
| `protected-areas/` | Formal legal conservation designations | national park, national reserve, marine park, Ramsar site when modeled as a protected designation |
| `biodiversity/` | Species, subspecies, populations and other reusable biological taxa/entities | humpback whale, Magellanic penguin, South American sea lion |
| `communities/` | Living peoples and communities; never reduce living communities to heritage objects | Yagán people/community, Kawésqar communities, Selk'nam communities |
| `institutions/` | Organizations with stable identity and reusable competencies/roles | INACH, DIRECTEMAR, SHOA, CONAF, DGAC, UMAG; operators only when graph utility justifies canonical identity |
| `infrastructure/` | Durable built infrastructure and logistical/scientific facilities | aerodromes, airports, ports, piers, terminals, scientific bases, tunnels and other fixed infrastructure |
| `routes/` | Structuring physical or recognized corridors | Carretera Austral, Ruta Vicuña–Yendegaia, official trails, structurally relevant maritime corridors |

Target taxonomy if all approved roots become justified: 14 canonical roots.

## 4. Roots explicitly not approved

The following must not be created as canonical roots unless this governance document is deliberately revised.

### `transport/` — do not create

Transport services are not a stable canonical root by default.

Model instead:

- physical/recognized corridor -> `routes/`;
- operator or authority -> `institutions/` when canonically justified;
- airport, terminal, pier or other fixed asset -> `infrastructure/`;
- schedules, fares, frequencies, availability and current operating state -> `operational_dynamic` claims or consumer/live-service layers;
- operator-to-route linkage -> relationships such as `OPERATES_ON` or another governed predicate.

### `tourism/` — do not create

Tourism is primarily a consumer projection, not a canonical ontological root.

Travel experiences can be composed from canonical entities such as:

- `places/`
- `routes/`
- `protected-areas/`
- `heritage/`
- `infrastructure/`
- `communities/`

Hotels, restaurants, agencies and other businesses do not automatically become canonical entities. Admission requires durable graph value beyond ordinary commercial listing.

### `projects/` — do not create

A planned or in-construction project belongs to the category of the thing it is becoming, using lifecycle metadata rather than a temporary root.

Recommended lifecycle field:

`lifecycle_status: planned | in_construction | operational | decommissioned`

Examples:

- planned pier -> `infrastructure/`
- road under construction -> `routes/`

Temporal progress belongs in claims, not in canonical identity.

## 5. Semantic boundaries

### 5.1 `places/` vs `geography/` vs `jurisdictions/`

Use `places/` for inhabited settlements/localities.

Examples:

- Puerto Williams -> `places/`
- Puerto Toro -> `places/`

Use `geography/` for physical geographic entities.

Examples:

- Isla Navarino -> `geography/`
- Canal Beagle -> `geography/`
- Strait of Magellan -> `geography/`

Use `jurisdictions/` for formally established administrative/jurisdictional units.

Examples:

- Comuna de Cabo de Hornos -> `jurisdictions/`
- Provincia Antártica Chilena -> `jurisdictions/`
- Región de Magallanes y de la Antártica Chilena -> `jurisdictions/`

Stable verified country/region/province/commune/jurisdiction context may be `public_core` when factual and properly sourced. Do not confuse that with treaty interpretation, competing territorial claims, unresolved boundaries or geopolitical/legal argumentation.

### 5.2 `hydrology/` vs `geography/`

`hydrology/` remains a separate root.

Do not migrate BNA watershed entities into `geography/` merely for ontological simplification.

Reason:

- an established official hierarchy already exists;
- DGA/SIMBIO provenance and parent/child hydrological relationships form a coherent domain;
- preserving the root avoids unnecessary migration and keeps authority/domain semantics explicit.

Use `geography/` for non-hydrological physical geography. Use `hydrology/` for canonical watershed/subwatershed entities and official hydrological hierarchy.

### 5.3 `ecosystems/` vs `protected-areas/`

An ecological unit and a legal conservation designation are distinct entities even if their geometries overlap.

- ECOMAR / ecosystem -> `ecosystems/`
- national park / national reserve / marine park -> `protected-areas/`

Connect them with relationships; do not merge their identities.

### 5.4 `communities/` vs `heritage/`

Living peoples and communities are not heritage objects.

- living Yagán community/people -> `communities/`
- museum, historic vessel, monument or heritage manifestation -> `heritage/`

Heritage claims may relate to a community, but the community remains independently modeled.

### 5.5 `routes/` vs operational mobility

`routes/` represents relatively stable corridors.

Examples:

- Carretera Austral
- Ruta Vicuña–Yendegaia
- governed official trail/circuit

Do not store next departure, current fare, today's availability or current weather-dependent operating status as route identity. Those belong to operational/live layers or time-bounded claims.

### 5.6 `infrastructure/` admission rule

Infrastructure is for durable built assets with reusable territorial/logistical/scientific graph value.

Appropriate examples:

- airport or aerodrome
- port, pier or terminal
- scientific base/facility
- tunnel or other major permanent asset

Commercial facilities such as hotels must pass a stricter gate. A private business is not canonical merely because it exists or appears on the Travel website. Canonical admission should require durable strategic, logistical, scientific, territorial or graph-reuse value.

### 5.7 `institutions/` is not the same as `sources.json`

An organization can be both:

1. a canonical entity with identity, roles and relationships; and
2. the publisher/authority behind one or more sources.

These layers must remain distinct.

Example:

- DIRECTEMAR canonical entity -> `institutions/` when created;
- a DIRECTEMAR publication -> source entry in an entity package.

Use `entity_type` to distinguish categories such as:

- government_science_institution
- maritime_authority
- conservation_authority
- university
- municipality
- transport_operator
- private_operator

Do not semantically equate a private company with a state authority simply because both live under `institutions/`.

### 5.8 `biodiversity/` instead of species/flora/fauna roots

Do not create separate canonical roots such as `species/`, `flora/`, `fauna/` or `marine-species/`.

Use `biodiversity/` with precise `entity_type`, e.g.:

- species
- subspecies
- population
- taxon

This preserves a compact root taxonomy while retaining semantic precision.

## 6. Dynamic state vs canonical identity

Never encode volatile state as if it were timeless identity.

Examples of dynamic state:

- construction progress percentage;
- projected opening/completion date;
- current ferry frequency;
- current flight schedule;
- current trail/road status;
- current navigation condition;
- current availability or fare.

Use governed claim fields as appropriate, including existing canonical conventions such as:

- `source_ids`
- `status`
- `sensitivity`
- `verified_at` / verification timestamp
- `valid_from`
- `valid_until`
- `freshness_ttl`
- `requires_current_verification`

Do not introduce `source_ref` as a replacement for the repository convention `source_ids`.

For operational content exposed to retrieval, use the established safeguards where appropriate:

- `sensitivity: operational_dynamic`
- `requires_current_verification: true`
- `embedding_eligible: false`
- `blocked_consumers: ["travel-agent"]`

Stable identity may remain canonical even when operational state expires.

## 7. Sensitivity and legal/geopolitical boundary

Classification is based on claim intent and meaning, not isolated keywords.

Stable, verified geographic/administrative/jurisdictional facts about Chile may be `public_core`.

Do not automatically block factual context merely because a claim contains terms such as Chile, Chilean or jurisdiction.

Keep outside ordinary Travel projection unless specifically governed:

- treaty interpretation;
- competing sovereignty claims;
- unresolved/disputed boundaries;
- legal argumentation;
- international-law conclusions;
- geopolitical/strategic/military-sensitive interpretation.

These belong to `restricted_context` or other specialist governance as appropriate.

## 8. Category creation gate

Before creating any new root under `knowledge-base/entities/`, an AI or contributor must answer all of the following:

1. Does the entity fit an existing root using a precise `entity_type`?
2. Is the proposed distinction durable across multiple future entities?
3. Is the difference semantic, or merely a product/UI/use-case distinction?
4. Can relationships or claims model the distinction instead?
5. Would the new root create duplication or force migrations?
6. Is there at least one justified entity ready to use the root now?
7. Does the root improve provenance, governance, retrieval or graph reasoning materially?

If the answer is uncertain, do not create the root. Record the candidate and review the taxonomy first.

## 9. Entity admission gate

Not every named object deserves a canonical entity.

Create a canonical entity when it has durable independent identity and meaningful reuse across one or more of:

- Travel
- Atlas
- Knowledge Graph
- Observatorio
- Radar
- scientific/editorial workflows
- future APIs/agents

Prefer claims, relationships or consumer-specific data for transient, purely promotional or low-reuse objects.

## 10. Migration policy

Do not reorganize existing canonical entities in bulk merely to make the directory tree aesthetically uniform.

Migration must be incremental and evidence-driven.

Current priority:

1. preserve existing seven roots;
2. use this taxonomy for new modeling decisions;
3. create approved future roots only when their first entity is ready;
4. migrate legacy entities only when a concrete consumer/provenance/graph benefit justifies the work;
5. preserve aliases, provenance, claims, sensitivity and relationships during migration.

## 11. Decision record

### Accepted from external architecture review

The following refinements are accepted because they solve concrete modeling problems:

- add `jurisdictions/` as a distinct future root;
- keep legal protected designations separate from ecosystems;
- use `biodiversity/` rather than fragmented species/flora/fauna roots;
- distinguish living communities from heritage;
- approve `institutions/`, `infrastructure/` and `routes/` as future roots;
- do not create `transport/` for volatile mobility services;
- do not create `projects/`; use lifecycle metadata;
- do not create `tourism/` as canonical truth.

### Explicitly rejected / not adopted

#### Absorb `hydrology/` into `geography/`

Rejected.

Austral Beacon already has a coherent canonical hydrological hierarchy with official BNA entities and domain-specific provenance. The migration cost and semantic loss outweigh theoretical simplification.

#### Remove or omit `science/`

Rejected.

Science is a first-class domain for Patagonia, Magallanes, sub-Antarctic territory and Antarctic gateway knowledge and already has canonical entities. It remains a root.

## 12. Current taxonomy status

Existing now:

1. `places/`
2. `geography/`
3. `hydrology/`
4. `ecosystems/`
5. `heritage/`
6. `history/`
7. `science/`

Approved future roots, created only on demand:

8. `jurisdictions/`
9. `protected-areas/`
10. `biodiversity/`
11. `communities/`
12. `institutions/`
13. `infrastructure/`
14. `routes/`

Not canonical roots:

- `transport/`
- `tourism/`
- `projects/`

## 13. Instruction for AI agents

Before creating or moving a canonical entity:

1. Read this file.
2. Read `knowledge-base/README.md`.
3. Inspect existing entities for aliases and prior canonical identity.
4. Choose the existing/approved root by semantic identity, not by the current product consuming it.
5. Use `entity_type` before proposing another root.
6. Separate stable identity from dynamic state.
7. Preserve provenance using the repository's canonical field conventions.
8. Preserve sensitivity and consumer access rules.
9. Never create a parallel canonical copy under `data/`, Atlas, Travel or another consumer.
10. If classification is ambiguous, stop and request architectural review rather than inventing a category.
