# MVP roadmap

## Phase 0 — Definition

- Approve product scope and editorial rules.
- Select the first destination and question type.
- Define source metadata and freshness policy.
- Decide whether the first implementation uses TypeScript or Python.

## Phase 1 — Puerto Williams vertical slice

- Create a small curated source set.
- Implement retrieval behind a provider-independent port.
- Return an answer with citations, warnings and confidence.
- Add tests for missing, stale and conflicting evidence.
- Integrate a minimal chat interface.

## Phase 2 — Destinations

- Add Punta Arenas, Puerto Natales, Puerto Toro and Cabo de Hornos.
- Connect answers to internal End of the World Travel pages.
- Introduce geographic entity relationships.

## Phase 3 — Connectivity

- Integrate route and transport records.
- Add source freshness checks.
- Connect with the Observatorio de Conectividad Austral.

## Phase 4 — Planning

- Collect trip dates, duration, origin and interests.
- Generate evidence-backed itinerary suggestions.
- Keep booking, payment and real-time availability outside scope until a separate product decision.

## First Kiro spec

Create a spec named `puerto-williams-connectivity-answer` with:

- requirements for factual answer quality;
- architecture and response contract;
- tasks for fixtures, retrieval, validation, generation and tests;
- explicit acceptance tests preventing fabricated schedules and prices.