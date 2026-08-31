# CODEX_HANDOFF — End of the World Travel Assistant

> Durable technical handoff for Codex and future AI agents. Captured from the
> repository state on 2026-08-31. Verified against source on disk, not chat memory.
> Baseline at handoff: server typecheck clean, client typecheck clean,
> **35 test files / 358 tests / 0 failures**.

This document is the authoritative onboarding for anyone (human or AI) continuing
development. It does not redesign anything; it records what exists and the rules
that must not be broken.

---

## Product role

End of the World Travel Assistant is the public-facing travel and geographic
assistant for the Austral Beacon ecosystem, focused on the far south of Chile
(Magallanes, Tierra del Fuego, Cabo de Hornos) and Chilean Antarctic gateways.

It answers destination identity, connectivity, place relationships, Antarctic
access and (now) stable Strait-of-Magellan geographic/jurisdictional questions.
It **consumes approved projections** from the canonical `knowledge-base/`; it is
not a second canonical source of truth.

It deliberately does NOT do bookings, live prices/availability, treaty
interpretation, sovereignty argumentation, or operational navigation guidance.

---

## Current architecture

Two-tier, deterministic-first, provider-agnostic:

```
User question
  → HTTP API (src/api/app.ts, POST /api/answer) or CLI (src/cli.ts / semanticCli.ts)
  → answerViaAssistant()            [default, offline entry point]
  → answerTravelAssistantQuestion() [orchestrator]
       1. answerTravelQuestion()    [DETERMINISTIC, no network, no key]
          → if status "supported": return deterministic answer
       2. else answerKnowledgeQuestion() [KNOWLEDGE LAYER]
          → RoutedRetrievalService → RetrievalQueryRouter
              • live_verification signals → DefaultLiveVerificationExecutor (Y-905 only today)
              • otherwise → stable RAG retriever (GoldenCorpusRetriever offline, or SemanticRetriever)
  → toUnifiedAnswer() flattens into UnifiedTravelAnswer for UI/API
```

- **Default path (`answerViaAssistant`)** uses the offline `GoldenCorpusRetriever`
  (term-matching, no API key, no network) + `DefaultLiveVerificationExecutor`.
  It runs with zero credentials. This is what `src/api/app.ts` (`npm run api`)
  and the web UI hit.
- **Semantic path (`createGeminiTravelAssistantFromEnv`)** is opt-in via
  `src/api/semanticServer.ts` (`npm run api:semantic`) / `src/semanticCli.ts`
  (`npm run demo:semantic`). It injects a `GeminiEmbeddingProvider` and requires
  `GEMINI_API_KEY`. It is wired through the same `createApp({ answerFn })` seam.

---

## Directory map

```
projects/end-of-the-world-travel-agent/
├── src/
│   ├── api/
│   │   ├── app.ts                       HTTP server; default answerFn = answerViaAssistant
│   │   ├── server.ts                    starts default (offline) server (npm run api)
│   │   ├── semanticServer.ts            starts Gemini-backed server (npm run api:semantic)
│   │   └── staticHandler.ts             serves public/ static files
│   ├── application/
│   │   ├── answerViaAssistant.ts        SINGLE default entry point; flat UnifiedTravelAnswer
│   │   ├── answerTravelAssistantQuestion.ts  deterministic-first orchestrator
│   │   ├── answerTravelQuestion.ts      deterministic intent detectors (all flows)
│   │   ├── answerKnowledgeQuestion.ts   RAG + live-verification knowledge layer
│   │   ├── answerAntarcticAccess.ts     Antarctic access answer (from data/relationships)
│   │   ├── answerPlaceRelationship.ts   relationship answer (PW/Cabo, Villa Ukika)
│   │   ├── answerStraitInfo.ts          Strait stable-info answer (from projection)
│   │   ├── getDestinationCard.ts        destination-card lookup + confidence/staleness
│   │   └── createSemanticTravelAssistant.ts  Gemini/semantic wiring (opt-in)
│   ├── knowledge/
│   │   └── straitProjection.ts          PROJECTION/ADAPTER over canonical knowledge-base
│   ├── retrieval/
│   │   ├── EmbeddingProvider.ts         provider interface + cosineSimilarity
│   │   ├── GeminiEmbeddingProvider.ts   embedding provider (needs GEMINI_API_KEY)
│   │   ├── VercelGatewayEmbeddingProvider.ts  embedding provider (needs AI_GATEWAY_API_KEY)
│   │   ├── SemanticRetriever.ts         provider-agnostic vector retriever
│   │   ├── GoldenCorpusRetriever.ts     offline term-match retriever (default)
│   │   ├── Retriever.ts                 Retriever interface + chunk/hit types
│   │   ├── RoutedRetrievalService.ts    routes stable_rag vs live_verification
│   │   ├── RetrievalQueryRouter.ts      9 live-signal regex categories
│   │   └── evaluateRetriever.ts         eval harness (used by scripts/)
│   ├── live/                            Y-905 road-condition live-verification pipeline
│   │   ├── LiveVerificationExecutor.ts  DefaultLiveVerificationExecutor (road_condition only)
│   │   ├── LiveVerificationSourceRegistry.ts  official source registry + planLiveVerification
│   │   ├── OfficialRoadSourceFetcher.ts / OfficialRoadPublicationAdapter.ts / RoadConditionVerifier.ts
│   │   └── Y905LiveVerificationService.ts  end-to-end conservative verifier
│   ├── adapters/
│   │   ├── LocalJsonDestinationCardRepository.ts  loads data/destinations/*.json
│   │   └── validateDestinationCard.ts   schema validation (coordinates optional)
│   ├── ports/DestinationCardRepository.ts
│   ├── domain/
│   │   ├── types.ts                     all answer/record types + TravelIntent union
│   │   └── normalize.ts                 NFD diacritic-insensitive normalization
│   ├── qa/ragRegression.ts             RAG regression harness
│   ├── ui/
│   │   ├── formatAnswer.ts              CLI text formatter (all intents)
│   │   ├── cliFormat.ts                 URL compaction for narrow terminals (render-only)
│   │   └── web/                         browser client + pure HTML renderers
│   ├── cli.ts / semanticCli.ts / index.ts
├── data/                                LEGACY / projection consumer layer (NOT canonical)
│   ├── destinations/{puerto-williams,puerto-toro,punta-arenas,cabo-de-hornos}.json
│   ├── relationships/{antarctica-access-from-chile,puerto-williams-cabo-de-hornos,villa-ukika-puerto-williams}.json
│   └── routes/{santiago-puerto-williams,punta-arenas-puerto-williams}.json
├── public/                              static web UI (index.html, styles.css, js/)
├── tests/                               35 vitest files
├── scripts/                            embedding evaluation scripts
├── PROJECT_CONTEXT.md                   product/policy context (current)
└── CODEX_HANDOFF.md                     this file

MONOREPO ROOT (canonical + shared):
austral-beacon-ai-lab/
├── knowledge-base/                      ← CANONICAL SOURCE OF TRUTH
│   ├── README.md                        canonical package/field conventions
│   ├── entities/…/<slug>/{metadata,sources,claims,relationships,chunks}.json + <slug>.mdx
│   ├── projections/travel/strait-of-magellan-v1.json          projection contract
│   └── projections/travel/strait-of-magellan-v1-implementation.md
├── data/retrieval/golden-corpus-puerto-williams-v1.json  ← the ONLY corpus the agent imports
│   (imported from src via ../../../../data/retrieval/…; 15 chunks, 13 embedding_ready)
├── docs/knowledge/knowledge-access-and-sensitivity-policy.md  sensitivity policy
└── AGENTS.md                            ecosystem-wide agent rules
```

Note the import depth: agent code imports the corpus and the knowledge-base with
`../../../../` from `src/*/`, i.e. these live at the MONOREPO ROOT, not inside the
project. The project `data/` folder holds only legacy destination/relationship/route
JSON — it has no `retrieval/` corpus of its own.

---

## Request lifecycle

1. `POST /api/answer` with `{"question": "..."}` (max 16 KB; validated in `app.ts`).
2. `answerViaAssistant(question)` calls `answerTravelAssistantQuestion`.
3. **Deterministic first** — `answerTravelQuestion(question)` normalizes (NFD,
   lowercase) and checks detectors in this order:
   - `0` antarctic-access (`isAntarcticAccessQuestion`)
   - `1` Santiago → Puerto Williams connectivity
   - `1b` Punta Arenas → Puerto Williams connectivity (distinct; excludes Santiago)
   - `1c` Puerto Williams / Cabo de Hornos (Cape Horn) relationship
   - `1d` Villa Ukika (living Yagán community context) relationship
   - `1e` Strait of Magellan stable-info (`isStraitStableInfoQuestion`)
   - `2` destination-info → `getDestinationCard` (Puerto Williams, Puerto Toro,
     Punta Arenas, Cabo de Hornos)
   - `3` fallback `unknown`
4. If deterministic returns `status: "supported"`, that answer is returned as
   `kind: "deterministic_travel"`.
5. Otherwise `answerKnowledgeQuestion` runs the routed knowledge layer:
   - `RetrievalQueryRouter` detects live-operational signals → `live_verification`
     (empty hits; `DefaultLiveVerificationExecutor` runs Y-905 for `road_condition`).
   - Otherwise stable RAG retrieval over the golden corpus.
6. `toUnifiedAnswer` flattens to `UnifiedTravelAnswer`; `no_evidence` maps to a safe
   `unsupported/unknown`; live answers carry time-sensitive warnings + official-source
   pointers derived from `verificationPlans` (never invented).

---

## Retrieval architecture

- **Router (`RetrievalQueryRouter`)** — 9 regex signal categories (relative_time,
  schedule, availability, road_condition, service_outage, fuel_or_cash_state,
  medical_operational_state, weather_or_trail_state, commercial_operation_now).
  Any match → `live_verification`; else `stable_rag`.
- **RoutedRetrievalService** — on `live_verification` returns empty hits (never
  serves stale embeddings as current state); on `stable_rag` delegates to the
  injected `Retriever`.
- **GoldenCorpusRetriever** (default, offline) — term-match with entity/scope
  boosts over `embedding_ready` chunks. No API key, no network.
- **SemanticRetriever** (opt-in) — provider-agnostic: embeds `embedding_ready`
  chunks via an injected `EmbeddingProvider` and ranks by cosine similarity.
- **Golden corpus** — `data/retrieval/golden-corpus-puerto-williams-v1.json`
  (monorepo root): 15 chunks / 13 embedding_ready. Puerto-Williams/Navarino
  focused. It contains NO Strait chunk — Strait answers are deterministic via the
  projection, not RAG.

---

## Gemini / embedding architecture

- `EmbeddingProvider` interface: `{ id, embedQuery(text), embedDocuments(texts) }`
  plus `cosineSimilarity`/`assertEmbeddingVector` helpers.
- `GeminiEmbeddingProvider` — Google `embedContent` API; default model
  `gemini-embedding-2`, 768 dims; reads `GEMINI_API_KEY` (throws if missing);
  configurable via `GEMINI_EMBEDDING_MODEL`.
- `VercelGatewayEmbeddingProvider` — OpenAI-compatible embeddings via Vercel AI
  Gateway; reads `AI_GATEWAY_API_KEY` (throws if missing).
- **Both providers are EMBEDDING-ONLY.** There is currently NO confirmed
  text-generation engine. Answers are assembled deterministically from curated
  data/projections; there is no LLM prose generation in the request path.
- Provider injection keeps `SemanticRetriever` and the assistant vendor-agnostic
  and testable (tests inject a keyword fake provider).

---

## Knowledge governance

- `knowledge-base/` is the canonical, provenance-aware source of truth. Canonical
  packages: `<slug>/{metadata,sources,claims,relationships,chunks}.json` + `<slug>.mdx`.
- Field conventions (from `knowledge-base/README.md`): `metadata.id`,
  `canonical_name`, `entity_type`, `status`, `sensitivity`, `retrieval_scope`,
  `official_id` (BNA/ECOMAR); `sources[].id`; `claims[].source_ids` (array;
  legacy `source_id` tolerated during migration); relationships use
  `predicate`/`target`/`status`; chunks must trace to `claim_ids`/`source_ids`
  and state `sensitivity`.
- Sensitivity classes (`docs/knowledge/knowledge-access-and-sensitivity-policy.md`):
  `public_core`, `operational_dynamic`, `restricted_context`, `internal_research`.
- Consumers (Travel Agent `data/`, Atlas, retrieval corpora) are projections and
  must NOT silently replace canonical truth.

---

## Projection architecture

The Strait of Magellan is the reference implementation of the consumer pattern:

```
knowledge-base/entities/geography/strait-of-magellan/{claims,sources,chunks,metadata}.json
  + knowledge-base/projections/travel/strait-of-magellan-v1.json  (contract)
      → src/knowledge/straitProjection.ts   (adapter; reads canonical files)
          → src/application/answerStraitInfo.ts (deterministic answer)
              → answerTravelQuestion 1e → answerViaAssistant
```

`straitProjection.ts` invariants (defense in depth; throws on violation):
1. Only `allowed_claims` from the contract are eligible.
2. Any `blocked_claims` or `conditionally_allowed_claims` id is rejected.
3. Each eligible claim must be `public_core` and all `source_ids` must resolve in
   the canonical `sources.json`.
4. Projected text comes only from a canonical chunk that is `public_core`, not
   `blocked_consumers: ["travel-agent"]`, and not `embedding_eligible: false`.

Current v1 `allowed_claims`: `strait-length-330-nm` and `strait-jurisdiction-chile`
(both embedding-eligible; jurisdiction stated as sourced descriptive fact only).
Provenance (`entityId`, `claimId`, `sourceIds`, `sensitivity`) is preserved on
every projected fact. Punta Arenas relationship is DEFERRED (no promoted canonical
provenance yet).

The four legacy destinations + relationships (Puerto Williams, Puerto Toro, Punta
Arenas, Cabo de Hornos, Villa Ukika, Antarctic access) currently live as curated
JSON under the project `data/` and predate this projection pattern. They are slated
to migrate to the canonical → projection flow (see Known technical debt).

---

## Security boundaries

- The default agent runs fully offline: `answerViaAssistant` uses no API key and
  makes no outbound calls except the Y-905 live-verification fetch (only triggered
  by operational-signal queries).
- API keys (`GEMINI_API_KEY`, `AI_GATEWAY_API_KEY`) are read from env only.
  Providers throw if the key is absent, so the semantic path cannot silently
  half-initialize and the default path never needs a key.
- `.env` is git-ignored (`.env`, `.env.*`; `!.env.example` retained). Never commit
  secrets. `.env.example` documents names only.
- No secret is ever sent to the browser. The web client only `fetch`es
  `/api/answer`; embeddings/providers run server-side.
- HTTP input is validated (16 KB cap, JSON object, non-empty `question`); internal
  errors return a generic 500 without leaking stack/detail.
- Untrusted content (retrieved chunks, fetched official pages) is treated as data,
  never as instructions.

---

## Current supported intents

Deterministic (no key, no network):
- `connectivity` — Santiago → Puerto Williams; Punta Arenas → Puerto Williams.
- `destination-info` — Puerto Williams, Puerto Toro, Punta Arenas, Cabo de Hornos
  (ES + EN identity/where; source-backed cards).
- `relationship` — Puerto Williams ↔ Cabo de Hornos / Cape Horn (5 distinct
  referents); Villa Ukika ↔ Puerto Williams (living Yagán community context,
  distinct from Puerto Williams).
- `antarctic-access` — how to reach Antarctica from Chile (gateway-policy /
  commercial-product / state-science / planned-infrastructure categories; Punta
  Arenas is the verified commercial origin; Puerto Williams gateway-only).
- `strait-info` — Strait of Magellan stable identity/location/Chilean
  geographic + DIRECTEMAR jurisdiction context.

Knowledge layer:
- Stable RAG retrieval over the audited Puerto Williams golden corpus.

---

## Current unsupported / live-required intents

- Current currents, tides, traffic control, pilotage, navigation conditions,
  ferry/crossing status → routed to live verification or a safe
  "requires current official verification" response. Never answered from stable data.
- Treaty interpretation, competing sovereignty claims, unresolved/disputed
  boundaries, legal argumentation, geopolitical/strategic/military analysis →
  excluded from the Travel projection (future specialized legal/geopolitical agent).
- Live schedules/prices/availability → not asserted as stable facts.
- Live verification currently implements only the `road_condition` signal (Ruta
  Y-905 conservative verifier). Other live signals return a
  "requires verification" style response with official-source pointers.

---

## Test baseline

- Command: `npm test` (vitest run). Typechecks: `npm run typecheck` (server) and
  `npm run build:client` / `tsc -p tsconfig.client.json --noEmit` (client).
- **35 test files, 358 tests, 0 failures** as of 2026-08-31. Server + client
  typechecks clean.
- Note for Windows/PowerShell: `api.test.ts` deliberately triggers a simulated
  500 that writes to stderr; PowerShell may surface it as `NativeCommandError` and
  truncate output. Read totals from stdout (`2>nul` redirect) — this is not a real
  failure.
- RAG/live suites are grouped under `npm run test:rag`.

---

## Known technical debt

Classified BLOCKER / HIGH / MEDIUM / LOW / DEFERRED.

- **BLOCKER**: none. Baseline is green; default path is safe and offline.
- **HIGH — legacy destinations not yet canonical.** Puerto Williams, Puerto Toro,
  Punta Arenas, Cabo de Hornos, Villa Ukika and Antarctic-access live as curated
  JSON under project `data/`, outside the canonical
  `sources→claims→provenance→entity→relationships→sensitivity→chunks→projection`
  pattern. They should migrate incrementally without breaking passing behavior.
- **HIGH — `answerStraitInfo` hardcodes source display metadata.** The source
  title, publisher URL (`https://www.directemar.cl/`) and `verifiedAt` (`2026-08-29`)
  are written in code instead of derived from the canonical `sources.json`. This
  can drift from the canonical record. It should read title/URL/date from the
  canonical source object (provenance is otherwise preserved via `sourceIds`).
- **MEDIUM — weak provenance on `santiago-puerto-williams` route.** Its only source
  is `Austral Beacon Media` with `status: "provisional"`. Needs a first-party/
  institutional source before it is treated as strong evidence.
- **MEDIUM — `data/` vs `knowledge-base/` responsibility overlap.** Some knowledge
  exists in both the legacy project `data/` and the canonical `knowledge-base/`
  (e.g. Villa Ukika, Puerto Toro identity). Only the canonical layer should be
  authoritative long-term; the legacy JSON is a projection until migrated.
- **MEDIUM — no automated stale-date guard on route/relationship JSON.** Only
  `getDestinationCard` checks a 180-day staleness threshold; routes and
  relationship records do not surface staleness. All current dates are fresh
  (2026-07-24 … 2026-08-29 vs today 2026-08-31), but there is no ratchet.
- **MEDIUM — corpus location coupling.** Agent imports the corpus and knowledge-base
  via `../../../../` monorepo-root paths. Moving/renaming the project or corpus
  breaks the build. Consider a documented path constant or config.
- **MEDIUM — future web integration prompt-injection surface.** There is no LLM in
  the request path today, but when text generation or web retrieval is added,
  retrieved/fetched content must remain data-only and never executed as
  instructions; projection filtering must gate anything embedded.
- **LOW — no sensitivity filter inside the generic RAG path.** The golden corpus is
  pre-audited, but if operational/restricted chunks were ever added they could be
  retrieved. Keep `embedding_ready`/sensitivity discipline; consider a retrieval-time
  sensitivity guard when the corpus grows beyond Puerto Williams.
- **LOW — mixed language.** English questions receive Spanish fixed messages
  (fallbacks, warnings). Acceptable for an es-first product; localization deferred.
- **LOW — README.md is stale.** It still says the project has "no ejecutable
  application yet"; the app, API, tests and flows exist. Update when convenient.
- **DEFERRED — Punta Arenas ↔ Strait relationship**, Paso Tortuoso / narrows
  travel guidance, hydrology BNA and marine-ecosystem retrieval, Atlas refactor,
  and multilingual UX — all explicitly out of Strait v1 scope per the contract.

---

## Do-not-break rules

1. `knowledge-base/` is canonical truth. Consumers must use projections/adapters.
2. Do NOT create a parallel canonical entity under `data/entities/` for knowledge
   that belongs in `knowledge-base/`.
3. Stable verified Chilean geographic, administrative and jurisdictional context
   is `public_core`. Do NOT suppress `Chile` / `chileno` / `jurisdicción` /
   `territorial` because of isolated keywords.
4. Classify by intent, not by isolated keywords.
5. Treaty interpretation, competing sovereignty claims, unresolved boundaries,
   legal argumentation and geopolitical analysis are OUTSIDE the Travel Assistant.
6. Current currents, tides, traffic control, pilotage and navigation conditions
   require current official verification; never answer them from stable data.
7. Gemini is currently an EMBEDDING provider, NOT a confirmed text-generation
   engine. Do not introduce LLM prose into the answer path without an explicit
   decision and safeguards.
8. The default agent MUST run without `GEMINI_API_KEY` (offline
   `GoldenCorpusRetriever` path must keep working).
9. `SemanticRetriever` must remain provider-agnostic (inject `EmbeddingProvider`).
10. Preserve `claim_id` + `source_ids` provenance through every projection.
11. Never expose secrets to the browser; keep `.env` git-ignored.
12. Do NOT embed `operational_dynamic` claims as stable public knowledge
    (respect `blocked_consumers`, `embedding_eligible: false`, sensitivity).
13. Keep existing Puerto Williams / Puerto Toro / Punta Arenas / Cabo de Hornos /
    Villa Ukika / Cape Horn / Antarctic-access behavior green while changing anything.
14. Deterministic layer stays first; the knowledge layer is the fallback.
15. Live-verification queries must never receive stale RAG content as current state.

---

## Next implementation milestones

1. **Migrate legacy destinations to canonical + projection** (Puerto Williams
   first) using the Strait pattern: `sources → claims → provenance → entity →
   relationships → sensitivity → chunks → projection → agent`. Keep behavior green.
2. **Derive Strait answer source metadata from canonical `sources.json`** instead
   of hardcoded strings in `answerStraitInfo.ts`.
3. **Promote the Punta Arenas ↔ Strait relationship** once explicit canonical
   provenance exists; then enable those deferred intents.
4. **Strengthen `santiago-puerto-williams` provenance** with a first-party source.
5. **Decide the text-generation strategy** (if any). If an LLM is added, keep it
   behind the projection/sensitivity gates and preserve provenance.

---

## Recommended first Codex task

**Migrate Puerto Williams to the canonical knowledge-base + projection pattern,
behavior-preserving.** It is the best first task because:
- Puerto Williams is the most-referenced entity and already has canonical material
  in `knowledge-base/entities/…` to build on.
- It exercises the full pipeline (sources → claims → chunks → projection) exactly
  like the proven Strait v1 implementation.
- It has the strongest existing regression coverage, so "do not break behavior" is
  enforceable.

Concretely: build a `puertoWilliamsProjection` adapter (mirroring
`straitProjection.ts`) that reads canonical Puerto Williams claims, and have
`getDestinationCard`/the destination path consume the projection instead of the
legacy `data/destinations/puerto-williams.json` — while keeping every existing
`getDestinationCard`/`puertoWilliamsCaboDeHornosFlow` test green. Do NOT delete the
legacy JSON until the projection is validated and tests pass.

---

## Commands to run before and after changes

Run from `projects/end-of-the-world-travel-agent/`:

```bash
# BEFORE changes — capture baseline
npm run typecheck                         # server TypeScript
npx tsc -p tsconfig.client.json --noEmit  # client TypeScript
npm test                                  # full vitest suite (expect 358 passing)

# AFTER changes — must remain green
npm run typecheck
npx tsc -p tsconfig.client.json --noEmit
npm test
npm run test:rag                          # RAG/live subset (faster focused check)

# Manual smoke (offline default path, no key needed)
npm run demo                              # interactive CLI
npm run api                               # HTTP server on :3000 (POST /api/answer)

# Semantic path (requires GEMINI_API_KEY in .env)
npm run api:semantic
```

Windows/PowerShell note: to read vitest totals reliably despite the intentional
500-error stderr in `api.test.ts`, redirect stderr:
`cmd /c "npx vitest run --reporter=dot 1>out.txt 2>nul"` then read `out.txt`.

---

## Context that previously existed only in Kiro chat and is now persisted here

- The default entry point is offline-first by design; the Gemini path is opt-in
  and must never become a hard dependency of the default agent.
- The Strait projection intentionally answers from a DETERMINISTIC projection, not
  RAG; the golden corpus has no Strait chunk on purpose.
- The intent-aware Strait classifier deliberately does NOT block bare
  `Chile`/`jurisdicción`/`territorial`; earlier iterations over-blocked by keyword
  and were corrected per the clarified policy.
- Provider classes throw without their API key by design, which is why the default
  path never instantiates them.
- The known hardcoded source metadata in `answerStraitInfo.ts` is a recognized debt
  item, not an accident — provenance IDs are still preserved; only display strings
  are hardcoded.
```
