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
- connectivity and infrastructure relevant to travel.

### restricted_context
Useful for internal context but excluded from public-agent retrieval by default.

Typical domains:
- sovereignty;
- unresolved or disputed boundaries;
- territorial claims;
- treaty interpretation;
- legal positions of states;
- strategic or military-sensitive context.

Requirements:
- primary or authoritative sources where possible;
- explicit provenance;
- human review before publication or product exposure;
- no automatic inclusion in Travel Agent retrieval.

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

Default exclusions: `restricted_context` and `internal_research`.

### End of the World Atlas
Default scope: `public_core`. Restricted material may be used only when a dedicated editorial review explicitly authorizes it.

### Austral Intelligence / internal research workflows
May access `restricted_context` and `internal_research` where justified, with provenance and human review.

## Safety principles

1. Keep sources even when their claims are not suitable for public retrieval.
2. Separate source preservation from claim promotion.
3. Separate historical description from contemporary legal interpretation.
4. Do not turn secondary interpretation into an official state position.
5. Do not expose sensitive ecological, cultural, infrastructural or strategic details when publication could create foreseeable harm.
6. Use the least sensitive information needed to answer a public-facing question.
7. When uncertain, restrict retrieval rather than broaden it automatically.

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

## Project priority

Austral Beacon should prioritize knowledge development in science, tourism, geography, cartography, natural history, heritage, culture, ecology, protected areas and connectivity. Sensitive geopolitical and legal material may be preserved for context and research without becoming a default public capability.