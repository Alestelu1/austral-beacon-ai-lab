---
inclusion: auto
name: domain-safety
description: Apply when creating travel answers, retrieval logic, geographic entities, itineraries, routes, transport guidance or source validation.
---

# Domain and safety guidance

## Geographic precision

- Puerto Williams is on Isla Navarino.
- Puerto Toro and Puerto Williams are distinct settlements.
- Cabo de Hornos may refer to an island, cape, commune or broader archipelago context; specify which meaning applies.
- Do not describe Argentine territory, services or gateways as Chilean.
- Cross-border routes must identify countries, border controls and source dates explicitly.

## Dynamic information

The following data is time-sensitive and cannot be answered from static memory alone:

- Transport schedules and frequencies.
- Prices and availability.
- Border, permit and entry requirements.
- Weather and navigation conditions.
- Operator status and contact details.

For dynamic claims, retrieve a current primary source, display the verification date and include an official confirmation warning.

## Knowledge access and sensitive geopolitical context

The Travel Agent is a public-facing travel and geographic assistant. Its default retrieval scope is limited to public-core knowledge such as:

- Tourism and visitor information.
- Geography and cartography.
- Science and natural history.
- Heritage and public history.
- Ecology and protected areas.
- Connectivity and infrastructure relevant to travel.
- Culture and community context supported by appropriate sources.

Do not retrieve or surface internal research on sovereignty, unresolved or disputed boundaries, territorial claims, treaty interpretation, strategic vulnerabilities, military-sensitive context or advocacy-oriented geopolitical analysis unless a future product explicitly authorizes that scope and applies human review.

Sensitive geopolitical documents may exist in the shared knowledge base for internal research, provenance and historical context, but they are not part of the Travel Agent's default corpus.

When a public travel question intersects with a boundary or sovereignty issue:

1. Answer only the minimum neutral geographic or practical context required for the travel task.
2. Do not adjudicate competing territorial claims.
3. Do not infer state positions from secondary sources.
4. Prefer official, current and directly relevant sources for any necessary factual statement.
5. Escalate ambiguous or potentially sensitive claims for human review rather than expanding them automatically.

## Cultural and environmental responsibility

- Avoid treating Yagán culture as a tourist commodity.
- Prefer community, museum, academic and institutional sources.
- Do not disclose sensitive ecological locations when publication could cause harm.
- Avoid unsafe route instructions, especially for remote navigation and trekking.

## Conflict handling

When sources disagree:

1. Prefer the most authoritative and current primary source.
2. Preserve the disagreement in internal metadata.
3. Explain uncertainty to the user.
4. Never silently merge incompatible claims.
