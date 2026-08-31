# End of the World Travel Assistant — Project Context

## Product role

End of the World Travel Assistant is the public-facing travel and geographic assistant for the Austral Beacon ecosystem. It consumes approved projections from the canonical `knowledge-base/` rather than maintaining a second canonical truth.

## Core geographic-context rule

The Travel Assistant MUST include relevant Chilean geographic, administrative and jurisdictional context when it is a stable, sourced fact.

Examples of normal `public_core` context include:

- country: Chile;
- Región de Magallanes y de la Antártica Chilena, Región de Aysén, or other verified Chilean administrative context;
- province, commune or locality when supported;
- stable relationships between Chilean cities, islands, channels, straits, protected areas and settlements;
- stable jurisdictional context explicitly supported by an authoritative Chilean source.

Mentioning Chile, a Chilean region, or a stable jurisdictional fact is not by itself sensitive, propagandistic or geopolitical analysis. The assistant should not omit important Chilean context merely because terms such as `Chile`, `chileno`, `jurisdicción` or `territorial` appear.

## What the Travel Assistant must NOT do

The Travel Assistant is not the agent for:

- treaty interpretation;
- unresolved or disputed boundary analysis;
- competing territorial claims;
- legal argumentation about sovereignty;
- international-law conclusions;
- geopolitical or strategic analysis;
- military-sensitive interpretation.

Those subjects belong to a future specialized Austral Intelligence / legal-geopolitical agent with stronger primary-source requirements and human review.

## Classification principle

Classify by user intent and claim type, not by isolated keywords.

### Stable geographic / administrative intent

Examples:

- `¿Dónde está el Estrecho de Magallanes?`
- `¿En qué país está?`
- `¿En qué región se encuentra?`
- `¿Está bajo jurisdicción chilena?`

When supported by canonical sources, these may be answered from `public_core`.

### Legal / treaty intent

Examples:

- `¿Qué establece jurídicamente el Tratado de 1881?`
- `¿Qué derechos soberanos deriva Chile de este tratado?`
- `¿Quién tiene mejor derecho territorial?`

These must not be answered from the Travel projection.

### Operational-dynamic intent

Examples:

- current currents or tides;
- pilotage;
- traffic-control instructions;
- ferry status;
- navigation conditions;
- weather-sensitive access.

These require current official verification and must not be answered from stale canonical facts.

## Strait of Magellan v1 decision

For `strait-of-magellan`:

- stable geographic identity is public;
- Chilean geographic context should be explicit when relevant;
- the stable DIRECTEMAR jurisdiction claim may be used as factual context;
- treaty interpretation remains excluded;
- currents, tides, pilotage and traffic-control information remain operational and require current verification.

A natural answer should prefer complete geographic context over artificially neutral wording. For example, `extremo sur de Chile, Región de Magallanes y de la Antártica Chilena` is preferable when supported, rather than omitting Chile and saying only `extremo sur de Sudamérica`.

## Architecture rule

Canonical truth:

`knowledge-base/`

Consumer flow:

`knowledge-base -> projection contract -> adapter/projection -> Travel Assistant`

Do not create a parallel canonical entity under `data/entities/` for the same knowledge.

## Legacy destinations to migrate later

Puerto Williams, Puerto Toro, Villa Ukika and Cabo de Hornos predate the current canonical projection methodology. They should be migrated incrementally to the same structured pattern:

`sources -> claims -> provenance -> entity -> relationships -> sensitivity -> chunks -> projection -> agent`

Do not break their existing passing behavior while migrating.

## Current implementation milestone

Strait of Magellan Travel Projection v1 has been implemented locally with stable-knowledge routing and operational/legal leakage guards. The next correction is to ensure the intent detector does not suppress Chilean geographic or jurisdictional context merely because of isolated terms such as `jurisdicción` or `territorial`.

The desired rule is:

`stable geographic fact -> public_core`

`treaty/legal interpretation -> restricted_context`

`current operational fact -> operational_dynamic`
