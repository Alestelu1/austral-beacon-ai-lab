# Austral Beacon Knowledge Access and Sensitivity Policy

## Purpose

Austral Beacon may preserve a broad documentary corpus while exposing only the minimum knowledge appropriate to each product or agent. Storage does not imply public retrieval authorization.

## Sensitivity classes

### public_core
Suitable for public-facing products when sourced and reviewed as needed.

Typical domains:
- tourism;
- geography and cartography;
- science and natural history;
- heritage and public history;
- ecology and protected areas;
- culture and community context;
- connectivity and infrastructure relevant to travel;
- verified country, region, province, commune and other basic administrative/geographic context;
- verified jurisdictional or territorial context when it is a straightforward descriptive fact and does not require treaty interpretation, adjudication of a dispute or legal analysis.

### restricted_context
Useful for internal context but excluded from public-agent retrieval by default.

Typical domains:
- unresolved or disputed boundaries;
- competing territorial claims;
- treaty interpretation;
- legal positions of states;
- adjudication or inference about sovereignty from disputed evidence;
- strategic or military-sensitive context.

Important distinction:
- References to Chile, Chilean regions, communes, provinces, institutions, territorial location or ordinary jurisdiction are NOT restricted merely because they identify Chile.
- A sourced statement such as a place being in Chile, in the Region of Magallanes and Chilean Antarctica, or under ordinary Chilean administrative/jurisdictional context may remain `public_core` when it is a stable descriptive fact.
- What is restricted is the interpretive/legal layer: treaty construction, unresolved delimitations, competing claims, legal conclusions, or geopolitical argumentation.

Requirements:
- primary or authoritative sources where possible;
- explicit provenance;
- human review before publication or product exposure;
- no automatic inclusion in Travel Agent retrieval when the claim itself is legal, disputed or interpretive.

### internal_research
Research notes, comparisons, hypotheses, narrative analysis, unverified material and working conclusions.

Requirements:
- never treated as canonical facts;
- never exposed automatically to public-facing agents;
- promote individual claims only after validation.

### operational_dynamic
Time-sensitive public information such as transport schedules, access conditions, weather, navigation status, prices, permits and operator status.

Requirements:
- current-source verification;
- verification timestamp;
- avoid treating stale data as durable knowledge.

## Consumer policy

### End of the World Travel Agent
Default scope: `public_core` plus verified `operational_dynamic` data.

The Travel Agent SHOULD provide relevant Chilean geographic and administrative context when it is verified and useful to answer the question. It should not omit the country, region, commune, province, Chilean institutional context, or other basic territorial facts merely to avoid geopolitical subject matter.

Default exclusions: legal/treaty interpretation, unresolved or disputed boundaries, competing territorial claims, strategic/military-sensitive analysis, and `internal_research`.

The Travel Agent must classify the intent and the claim, not block individual words such as `Chile`, `Chilean`, `jurisdiction`, `territorial` or `sovereignty` mechanically. A query requesting basic location or administrative context may use verified `public_core` facts. A query requesting treaty interpretation, a legal conclusion or analysis of a dispute must route away from the ordinary Travel projection.

### End of the World Atlas
Default scope: `public_core`. Restricted material may be used only when a dedicated editorial review explicitly authorizes it.

### Austral Intelligence / internal research workflows
May access `restricted_context` and `internal_research` where justified, with provenance and human review.

## Safety principles

1. Keep sources even when their claims are not suitable for public retrieval.
2. Separate source preservation from claim promotion.
3. Separate historical description from contemporary legal interpretation.
4. Separate stable geographic/administrative facts from treaty or sovereignty analysis.
5. Do not turn secondary interpretation into an official state position.
6. Do not suppress verified Chilean geographic context simply because a nearby domain can also have geopolitical relevance.
7. Do not expose sensitive ecological, cultural, infrastructural or strategic details when publication could create foreseeable harm.
8. Use the least sensitive information needed to answer a public-facing question, while still preserving material context necessary for an accurate answer.
9. When uncertain whether a claim is geographic fact or legal interpretation, restrict the interpretive claim rather than deleting surrounding verified geographic context.

## Recommended metadata

Each canonical entity, claim, source or chunk should support fields equivalent to:

```yaml
sensitivity: public_core
retrieval_scope:
  - travel
  - atlas
requires_citation: true
requires_human_review: false
public_answer_allowed: true
```

Restricted example:

```yaml
sensitivity: restricted_context
retrieval_scope:
  - internal-research
  - austral-intelligence
requires_citation: true
requires_human_review: true
public_answer_allowed: false
```

## Classification examples

```yaml
claim: "Puerto Williams is in Chile, in the Region of Magallanes and Chilean Antarctica."
sensitivity: public_core
```

```yaml
claim: "DIRECTEMAR identifies the Strait of Magellan as being under Chilean jurisdiction."
sensitivity: public_core
# Allowed as a sourced descriptive fact when no treaty interpretation is added.
```

```yaml
claim: "Treaty X proves that State A has a superior legal claim over State B."
sensitivity: restricted_context
requires_human_review: true
```

```yaml
claim: "The boundary in this sector should legally be interpreted as..."
sensitivity: restricted_context
requires_human_review: true
```

## Project priority

Austral Beacon should prioritize knowledge development in science, tourism, geography, cartography, natural history, heritage, culture, ecology, protected areas and connectivity. Verified Chilean geographic and administrative context is part of this public mission and should be retained in public-facing answers when relevant. Sensitive geopolitical and legal material may be preserved for context and research without becoming a default public capability.