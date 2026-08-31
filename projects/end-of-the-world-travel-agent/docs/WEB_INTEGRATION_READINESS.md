# Web Integration Readiness — End of the World Travel Assistant

> READ-ONLY architecture & security audit for exposing the existing Travel
> Assistant through https://www.endoftheworld.travel. No production code was
> modified. Captured from repository state on 2026-08-31.
> Baseline at audit: server typecheck clean, client typecheck clean,
> **35 test files / 358 tests / 0 failures**.

Throughout, findings are marked **CURRENT** (what exists on disk today) vs
**RECOMMENDED** (what the website integration should add). This document does not
choose a hosting platform; platform-specific items are flagged as SPEC decisions.

---

## 1. Current web/API capability

**HTTP server** — `src/api/app.ts` (`createApp`), started by `src/api/server.ts`
(`npm run api`, default port 3000) or `src/api/semanticServer.ts`
(`npm run api:semantic`).

**Endpoints (CURRENT):**
- `GET /health` → `200 {"status":"ok","service":"end-of-the-world-travel-agent"}`.
  `405` + `Allow: GET` for other methods.
- `POST /api/answer` → body `{"question": string}`. Returns `200` with a
  `UnifiedTravelAnswer` JSON object. `405` + `Allow: POST` for other methods.
- `GET /`, `GET /styles.css`, `GET /js/*.js` → static assets via
  `src/api/staticHandler.ts` (whitelist for root files; `/js/` dynamic with a
  directory-traversal guard; `.js` only).
- Any other path → `404 {"error":{"code":"NOT_FOUND",...}}`.

**Request contract (CURRENT):** `POST /api/answer`, `Content-Type` not enforced,
body must be a JSON object with a non-empty string `question`. Max body size
16 KB (`MAX_BODY_BYTES`). Validation errors → `400` with
`{"error":{"code","message"}}` (`INVALID_JSON`, `INVALID_REQUEST`,
`PAYLOAD_TOO_LARGE`).

**Response contract (CURRENT):** `UnifiedTravelAnswer` (see §6). Shape varies by
intent: `connectivity`/`unknown` (`TravelAnswer`), `destination-info`
(`DestinationCardAnswer`), `relationship` (`RelationshipAnswer`),
`antarctic-access` (`AntarcticAccessAnswer`), `strait-info` (`StraitInfoAnswer`),
`knowledge` (`KnowledgeUiAnswer`). All share `status` + `intent`.

**Default offline path (CURRENT):** `createApp()` default `answerFn` is
`answerViaAssistant`, which uses the offline `GoldenCorpusRetriever` +
`DefaultLiveVerificationExecutor`. Runs with no API key and no network (except the
Y-905 live fetch triggered only by operational-signal queries).

**Semantic/Gemini path (CURRENT):** `semanticServer.ts` injects
`createGeminiTravelAssistantFromEnv()` via `createApp({ answerFn })`. Requires
`GEMINI_API_KEY`; the `GeminiEmbeddingProvider` throws at construction if absent.
Embedding-only (no text generation).

**Static web capability (CURRENT):** `public/index.html` (semantic HTML, es-first),
`public/styles.css`, and browser client compiled from `src/ui/web/` to
`public/js/*.js`. The client (`app.client.ts`) posts to same-origin `/api/answer`
and renders via `renderAnswer` → pure HTML string renderers (which HTML-escape
untrusted text).

**Browser/server boundary (CURRENT):** Same-origin only. The browser never holds
credentials; all retrieval/providers run server-side. The client sends only the
question string and renders the returned JSON.

**Known web gap (CURRENT):** `src/ui/web/renderAnswer.ts` only dispatches
`connectivity` and `destination-info`; `relationship`, `antarctic-access`,
`strait-info` and `knowledge` intents currently fall through to
`renderUnsupported`. The newer flows are NOT yet rendered in the browser UI even
though the API returns them. This is an integration blocker for full coverage
(see §13).

---

## 2. Recommended production boundary

```
Browser (endoftheworld.travel)
  │  HTTPS, same-origin fetch POST /api/answer  {question}
  ▼
Edge / reverse proxy / CDN         [RECOMMENDED: TLS, rate limit, WAF, headers, static cache]
  ▼
Server-side Travel Assistant API   (Node process: src/api/app.ts)
  │  answerViaAssistant → deterministic-first → knowledge layer
  ▼
Retrieval / projections / optional providers   [ALL server-side]
  • GoldenCorpusRetriever (offline, default)
  • SemanticRetriever + EmbeddingProvider (opt-in, needs key)
  • straitProjection / data + knowledge-base reads (filesystem)
  • Live verification (outbound fetch to official sources)
```

**MUST remain server-side (never reach the browser):**
- `GEMINI_API_KEY`, `AI_GATEWAY_API_KEY`, and any provider credential.
- Embedding provider calls and any outbound HTTP (live verification fetches).
- Filesystem access (canonical `knowledge-base/`, `data/`, corpus, static files).
- The projection/sensitivity filtering logic (`straitProjection`, routing).
- Any future LLM API key or system prompt.

**May reach the browser:** the `UnifiedTravelAnswer` JSON (§6) and static assets
only. The client must remain a thin render layer with no secrets, no tools, no
filesystem, and no ability to change knowledge-access rules.

**Deployment shape (RECOMMENDED):** run the Node API server-side behind the site's
reverse proxy; serve `/api/answer` same-origin under endoftheworld.travel (e.g.
`/travel-assistant/api/answer`) so the browser never performs cross-origin calls
and no CORS is needed. Static assets can be served by the platform/CDN or by the
existing `staticHandler`.

---

## 3. Secrets and environment security

**CURRENT:**
- `GEMINI_API_KEY` — read only in `GeminiEmbeddingProvider` from `process.env`;
  constructor throws if missing. Never referenced client-side.
- `AI_GATEWAY_API_KEY` — read only in `VercelGatewayEmbeddingProvider`; throws if
  missing. Not used by the default path.
- `.env` is git-ignored (`.gitignore`: `.env`, `.env.*`, with `!.env.example`).
- `.env.example` lists NAMES only (no values): `LLM_PROVIDER`, `LLM_MODEL`,
  `LLM_API_KEY`, `RETRIEVER_PROVIDER`, `VECTOR_DATABASE_URL`,
  `VECTOR_DATABASE_API_KEY`, `GEMINI_API_KEY`, `GEMINI_EMBEDDING_MODEL`,
  `AI_GATEWAY_API_KEY`, `AI_GATEWAY_EMBEDDING_MODEL`, `APP_BASE_URL`,
  `END_OF_WORLD_TRAVEL_BASE_URL=https://www.endoftheworld.travel`.
- Client bundle: `src/ui/web/` (client build via `tsconfig.client.json`) imports
  no provider modules and reads no `process.env`; there is no bundler that could
  inline env into the client. Client build output is `public/js/*.js`.
- Error logging: `app.ts` logs `[API] Internal error:` server-side and returns a
  generic 500 to the client (no stack/detail leak). `semanticServer.ts` logs
  provider id and chunk count (not the key).

**RECOMMENDED:**
- Inject secrets via the platform secret store / environment, never a committed
  file. Keep the `.env` local-only pattern.
- Ensure the client build step (`npm run build:client`) is the only thing that
  produces browser JS, and never bundle server modules. Add a CI check that
  `public/js/**` contains no `process.env`, no key names, and no provider imports.
- Scrub logs: never log request bodies containing free-text questions at info
  level in production if they may contain PII; never log env values. Confirm the
  reverse proxy access logs do not store full question text unless required.
- If a future LLM key is added, treat it identically: server-side only, throw-on-
  missing, never in client build.

---

## 4. API security

| Control | CURRENT | RECOMMENDED |
|---|---|---|
| Request validation | Yes — JSON object + non-empty string `question` | Keep; add explicit max question length (e.g. 2 KB) distinct from 16 KB body cap |
| Body-size limit | Yes — 16 KB (`MAX_BODY_BYTES`), streamed with early abort | Keep; consider lowering to ~8 KB for a Q&A endpoint |
| Rate limiting | **None** | Add per-IP/token rate limit at the edge/proxy (BLOCKER before public exposure) |
| Abuse prevention | **None** | Add throttling, optional CAPTCHA/bot mitigation, and a max-questions-per-minute policy |
| Timeouts | **None** on request handling or the Y-905 outbound fetch path at the API layer | Add server request timeout and an outbound-fetch timeout budget; return safe fallback on timeout |
| Concurrency | Node single process; retriever/executor are singletons | Document expected concurrency; the offline path is CPU-light, the semantic path is I/O-bound on the provider |
| CORS | **None set** | Prefer same-origin (no CORS). If cross-origin is required, allow only the exact site origin(s); never `*` |
| Allowed methods | Yes — `GET /health`, `POST /api/answer`, `405 + Allow` otherwise | Keep |
| Content-Type enforcement | **Not enforced** (parses body as JSON regardless) | Require `application/json` on `POST /api/answer`; reject otherwise with 415 |
| Generic errors | Yes — 400/404/405/413/500 with `{error:{code,message}}`, no stack leak | Keep; ensure proxy doesn't add verbose upstream errors |
| Request IDs / logging | **None** | Add a request ID per call, structured logs, and latency metrics (without storing raw questions long-term) |
| Sensitive-data logging | Generic 500 only; provider key never logged | Keep; add explicit log redaction policy |

Do not invent infrastructure the repo lacks: there is currently no proxy, no rate
limiter, no metrics, and no auth layer. These are RECOMMENDED additions owned by
the website/platform SPEC, not by the agent code.

---

## 5. Prompt injection / AI safety boundary

**CURRENT:** There is NO text-generation LLM in the request path. Answers are
assembled deterministically from curated data and contract-gated projections;
Gemini/Vercel are embedding-only. Retrieved chunks are used as ranked evidence,
never executed as instructions. This is the safest possible baseline.

**What changes when a text-generation LLM is added (RECOMMENDED, mandatory
principles):**
- Retrieved/fetched content is DATA, never instructions. Wrap it as untrusted
  context; strip/ignore any embedded "system"/"ignore previous" style content.
- The projection and sensitivity gates remain authoritative. The LLM may only
  receive claims/chunks already approved by a projection contract
  (`allowed_claims`, `public_core`, not `blocked_consumers`); it must not be able
  to pull raw canonical files or bypass the adapter.
- User prompts cannot override knowledge-access rules. Intent classification and
  the operational/legal exclusions run BEFORE generation; the LLM cannot
  re-open a blocked intent.
- No arbitrary file/repository/tool access from the generation layer. No shell,
  no fs, no network tools exposed to the model.
- No browser-supplied system prompts. The system prompt is server-owned; the
  browser sends only the user question.
- `operational_dynamic` cannot silently become stable knowledge — keep the router
  → live-verification path; never let the LLM assert current currents/tides/
  schedules from stale embeddings.
- `restricted_context` cannot leak through generation — treaty/sovereignty/
  disputed-boundary content is excluded at projection time and must never enter
  the model context for the Travel Assistant.
- Output must preserve provenance: generated prose must cite the same
  `claim_id`/`source_ids` it was grounded in; ungrounded claims are rejected.

---

## 6. Provenance contract for the website

The API should expose a stable, documented subset of `UnifiedTravelAnswer`. Fields
present TODAY (by intent):

- `status` — `"supported" | "unsupported"` (all intents).
- `intent` — `connectivity | destination-info | relationship | antarctic-access |
  strait-info | knowledge | unknown`.
- `summary` — short human answer (all supported intents).
- `confidence` — `high | medium | none` (destination-info, relationship,
  antarctic-access, strait-info).
- `facts[]` — `strait-info` only: `{entityId, claimId, text, sourceIds,
  sensitivity, embeddingEligible}` (canonical provenance preserved).
- `sources[]` — `{title, publisher, url, verifiedAt, status?, evidenceNote?}`
  (destination/relationship/antarctic/strait).
- `verifiedAt` — ISO date of the underlying record.
- `warnings[]` — uncertainty / current-verification / safety caveats.
- Live/current verification state — for `knowledge` answers: `route`
  (`stable_rag | live_verification`), `knowledgeStatus`
  (`retrieved | live_verification_required | live_verified | live_not_verified |
  no_evidence`), `matchedSignals[]`.
- Intent-specific structured data: `stages[]` (connectivity),
  `distinctReferents[]` (relationship), `pathways[]` +
  `puertoWilliamsClarification` (antarctic-access).

**RECOMMENDED for the website:** expose the above as the public API schema and
version it (e.g. `/api/answer` returns `schemaVersion`). Surface `claimId` +
`sourceIds` for strait-info (and future migrated entities) so the UI can show
traceable provenance. Do NOT expose internal implementation data: routing
`reason` strings, raw retrieval hit scores, chunk internals, filesystem paths,
provider ids, or `verificationPlans` internals. Keep source `url` (public) but
render long URLs compactly (see `cliFormat.ts` for the truncation precedent —
never mutate the stored URL).

---

## 7. Stable vs dynamic UX

The UI must visually separate these states (RECOMMENDED mapping to current data):

- **Stable verified fact** — `strait-info.facts` / destination `stableData`;
  `confidence: high`, `verifiedAt` present. Neutral "verified" styling with a
  source link and verification date.
- **Current/live verified** — `knowledge` with `knowledgeStatus: live_verified`.
  Distinct "checked just now" styling + timestamp; make clear it can change.
- **Requires current verification** — `knowledge` with
  `live_verification_required` / `live_not_verified`, or any answer whose warnings
  say "confirmar con la fuente oficial". Prominent caution styling + the official
  source pointer; never present as guaranteed.
- **Unsupported / no evidence** — `status: unsupported` /
  `knowledgeStatus: no_evidence` / `intent: unknown`. Honest "no verified
  answer yet" message; do not fabricate.
- **Provisional source** — `sources[].status: "provisional"` (or `evidenceNote`).
  Badge the source as provisional and show the caveat (e.g. the
  `santiago-puerto-williams` route currently has only a provisional source).
- **Restricted / out-of-scope query** — treaty/sovereignty/operational intents
  that route away. Show a clear "this assistant covers stable travel/geographic
  info; for legal/operational matters consult the official authority" message.

---

## 8. Performance

**CURRENT:**
- Server startup: the corpus and canonical JSON are imported as ES modules
  (`import ... with { type: "json" }`), loaded once at process start — cheap.
- `GoldenCorpusRetriever` (default) is pure in-memory term matching — fast, no
  network, no embedding cost.
- `SemanticRetriever.create` (opt-in) embeds every `embedding_ready` chunk once at
  startup (13 documents today) via the provider — one-time embedding cost; per
  query it embeds only the query (1 call) then does in-memory cosine. There is NO
  query-embedding cache and NO document-embedding persistence: restarting re-embeds
  all documents.
- `straitProjection` reads canonical files at module load and builds facts on each
  call to `answerStraitInfo` (small, synchronous, no I/O per request).
- `staticHandler` reads files from disk synchronously on EVERY request
  (`readFileSync`, `existsSync`) with NO cache headers and NO in-memory cache.
- API latency: offline path is sub-millisecond compute; semantic path latency is
  dominated by the provider round-trip; live-verification path makes outbound
  fetches (slowest).
- Browser JS is small vanilla ES modules; no framework.

**RECOMMENDED (without weakening freshness/safety):**
- Serve static assets via the CDN/platform with cache headers + fingerprinting;
  add in-memory caching or `Cache-Control` in `staticHandler` for `public/`.
- Cache document embeddings for the semantic path (persist vectors) to avoid
  re-embedding all chunks on every restart.
- Optionally cache query embeddings / stable answers with a SHORT TTL — but ONLY
  for `stable_rag`/deterministic stable answers. NEVER cache
  `live_verification`/operational answers, and never cache past a source's
  freshness window. Cache keys must include the answer's `verifiedAt`.
- Add outbound-fetch timeouts so live verification cannot stall a request.

---

## 9. Reliability

**CURRENT:** No request timeout, no provider-failure fallback wired at the API
layer. `semanticServer.ts` fails to start if the Gemini key/provider init fails
(sets `process.exitCode = 1`). The default `server.ts` has no external
dependencies and always starts. The Y-905 verifier already degrades to
`live_not_verified` on fetch failure (conservative).

**RECOMMENDED:**
- Request timeout with a safe fallback response ("could not complete; try again").
- Provider failure fallback: if the semantic/embedding provider errors at request
  time, degrade to the offline `GoldenCorpusRetriever` path rather than 500 —
  the offline path is always valid and must remain usable.
- Gemini unavailable: default deployment should run the OFFLINE path
  (`npm run api`) so the public site works with zero external dependencies; treat
  the semantic path as an enhancement, not a requirement.
- Live verifier unavailable: return "requires current official verification" with
  the official-source pointer (already the conservative behavior) — never a stale
  stable answer.
- Health/readiness: `GET /health` exists (liveness). Add a readiness check that
  confirms the corpus/projection loaded (and, for the semantic deployment, that
  the provider is reachable) before receiving traffic.

---

## 10. Deployment assumptions

**KNOWN from the repo:**
- Node.js ESM project (`"type":"module"`, TypeScript `NodeNext`), run via `tsx`
  (`npm run api` / `api:semantic`). No build-to-JS step for the server today
  (runs `.ts` directly through `tsx`).
- Default port 3000, overridable via `PORT` (validated).
- Target domain referenced: `.env.example` sets
  `END_OF_WORLD_TRAVEL_BASE_URL=https://www.endoftheworld.travel` and
  `APP_BASE_URL` (empty).
- No Dockerfile, no CI config, no reverse-proxy config, no process manager, no
  hosting manifest present in this project.
- No runtime dependencies (only devDependencies: `@types/node`, `fast-check`,
  `tsx`, `typescript`, `vitest`). `tsx` is currently a devDependency but is used
  to run the server.

**UNKNOWN / must be resolved in the website SPEC:**
- Hosting platform and whether it runs Node long-lived (server) or serverless
  (would change the singleton/startup-embedding assumptions).
- Whether the assistant is same-origin under endoftheworld.travel or a separate
  origin (drives CORS).
- Whether the semantic (Gemini) path is used in production or only the offline
  path.
- Production run command (currently `tsx` on `.ts`; production may need a compiled
  build and `tsx`/`node` as a real dependency).
- Reverse proxy / CDN / WAF ownership.

Do not assume a platform; the repo contains no evidence of one.

---

## 11. Security headers / browser policy

None of these are set today (the Node server sends only `Content-Type`). Most
belong to the website/platform (reverse proxy/CDN) layer, not the agent:

- **Content-Security-Policy** — RECOMMENDED, platform layer. The app is
  CSP-friendly: `index.html` uses no inline scripts (loads `/js/app.client.js` as
  a module) and no inline event handlers; a strict `script-src 'self'` +
  `default-src 'self'` policy should work. Verify styles (external `styles.css`,
  no inline styles required).
- **X-Content-Type-Options: nosniff** — RECOMMENDED, platform/agent.
- **Referrer-Policy: no-referrer / strict-origin-when-cross-origin** — RECOMMENDED,
  platform.
- **Frame protections** (`X-Frame-Options: DENY` / CSP `frame-ancestors`) —
  RECOMMENDED, platform.
- **Permissions-Policy** — RECOMMENDED, platform (disable geolocation/camera/mic;
  the app needs none).
- **HTTPS-only / HSTS** — RECOMMENDED, platform. Assume TLS termination at the
  edge; the app itself serves HTTP behind the proxy.

Agent-owned option: `staticHandler`/`app.ts` could add `nosniff` and basic headers
directly, but the authoritative place for security headers is the site edge.

---

## 12. Accessibility / mobile implications (assistant UI only)

**CURRENT (good foundation):** `index.html` is semantic (`header/main/footer`,
labeled form, `aria-labelledby`), the results region uses `aria-live="polite"`,
the loading region `aria-live="polite"` with an `aria-hidden` spinner, and the
validation message uses `role="alert" aria-live="assertive"`. `renderError` and
`renderDestination` HTML-escape untrusted text.

**RECOMMENDED before public launch:**
- Keyboard operation: verify full tab order (input → submit → results), Enter
  submits, and focus moves to/into the results region after an answer.
- Screen reader semantics: ensure new intents (relationship, antarctic-access,
  strait-info) render with headings/lists, not undifferentiated text; announce
  answer arrival via the live region.
- Focus states: visible focus rings on input and button (verify in `styles.css`).
- Loading state: already announced; ensure it toggles `hidden` correctly and
  doesn't trap focus.
- Long source URLs: render compact (mirror `cliFormat.ts` truncation) but keep the
  full URL in the link `href`/`title`; never mutate the stored URL.
- Long answers / narrow screens: verify wrapping, no horizontal overflow, chips
  and source lists reflow on mobile.
- Errors: `renderError` is present; ensure it is reachable by screen readers via
  the live region.
- Reduced motion: gate the loading spinner animation behind
  `@media (prefers-reduced-motion: reduce)`.
- **Renderer coverage:** update `renderAnswer` to handle `relationship`,
  `antarctic-access`, `strait-info` and `knowledge` intents (currently they render
  as "unsupported") — otherwise the web UI silently drops the newest answers.

---

## 13. Integration blockers

- **BLOCKER — Web renderer coverage.** `renderAnswer` handles only `connectivity`
  and `destination-info`; `relationship`, `antarctic-access`, `strait-info` and
  `knowledge` answers render as "unsupported" in the browser. Must be fixed before
  these flows are usable on the site.
- **BLOCKER — No rate limiting / abuse controls.** A public endpoint with no
  throttling is exposed to abuse and (on the semantic path) cost amplification.
  Must exist at the edge before public exposure.
- **HIGH — No security headers / TLS/HSTS policy** defined for the public surface
  (CSP, nosniff, frame, referrer, permissions). Platform layer.
- **HIGH — Content-Type not enforced** on `POST /api/answer`.
- **HIGH — No request timeout / outbound-fetch timeout**; a slow live-verification
  fetch can stall a request.
- **HIGH — Production run model undefined** (`tsx` on `.ts`, no build/Docker/CI,
  `tsx` is a devDependency). Must be resolved for a real deployment.
- **MEDIUM — Provider-failure fallback not wired** (semantic path errors should
  degrade to the offline path, not 500).
- **MEDIUM — No structured logging / request IDs / metrics.**
- **MEDIUM — Static files read from disk per request** with no cache headers.
- **MEDIUM — CORS undefined** (must be same-origin or a strict allowlist).
- **LOW — Mixed language** (English questions get Spanish fixed messages).
- **LOW — README stale.**
- **DEFERRED — Text-generation LLM safety layer** (only needed if/when generation
  is added; principles in §5).
- **DEFERRED — Legacy destination → canonical migration** (tracked in
  CODEX_HANDOFF.md; not a web blocker).

---

## 14. Production acceptance checklist

Before the assistant is exposed publicly at endoftheworld.travel:

- [ ] `renderAnswer` (or the site UI) renders all current intents
      (connectivity, destination-info, relationship, antarctic-access,
      strait-info, knowledge, unsupported) correctly.
- [ ] All output is HTML-escaped; no XSS via answer text or source URLs.
- [ ] `POST /api/answer` served same-origin under HTTPS; CORS is same-origin or a
      strict allowlist (never `*`).
- [ ] Rate limiting + abuse mitigation active at the edge.
- [ ] Request timeout and outbound-fetch timeout enforced with safe fallback.
- [ ] `Content-Type: application/json` required on `POST /api/answer`.
- [ ] Security headers set (CSP `default-src 'self'`, `nosniff`, frame-ancestors,
      referrer, permissions, HSTS).
- [ ] No secret reachable by the browser; CI check that `public/js/**` has no env
      names / provider imports.
- [ ] Default deployment runs the OFFLINE path and works with zero external keys;
      semantic path is optional and degrades gracefully.
- [ ] Provider failure degrades to offline path, not 500.
- [ ] `/health` (liveness) + a readiness check (corpus/projection loaded) wired.
- [ ] Logs carry request IDs, redact secrets, and do not persist raw questions
      beyond policy.
- [ ] Accessibility pass: keyboard, screen reader, focus, reduced motion, mobile
      reflow, long URLs/answers.
- [ ] Stable vs live vs requires-verification vs unsupported vs provisional vs
      restricted states are visually distinct (§7).
- [ ] Provenance (sources, verifiedAt, claim/source ids for strait-info) shown;
      no internal implementation data leaked.
- [ ] Server typecheck, client typecheck, full test suite green.
- [ ] Production run model decided (build/runtime deps, process manager).

---

## 15. Decisions the endoftheworld.travel SPEC must make

1. **Origin model** — same-origin path under endoftheworld.travel vs separate
   origin (determines CORS).
2. **Hosting platform & run model** — long-lived Node vs serverless; compiled
   build vs `tsx`; whether `tsx`/`node` becomes a runtime dependency;
   Dockerfile/CI/process manager ownership.
3. **Semantic path in production?** — offline-only (zero-key) vs Gemini-backed;
   if Gemini, who owns the key, cost budget, and rate limits.
4. **Rate limiting / abuse strategy** — limits, bot mitigation, per-IP vs token.
5. **Security headers & TLS/HSTS ownership** — edge/CDN vs app.
6. **Public API schema & versioning** — exact `UnifiedTravelAnswer` subset
   exposed, `schemaVersion`, and what internal fields are stripped.
7. **Caching policy** — static asset caching; whether stable answers may be cached
   and with what TTL/keying (must exclude live/operational answers).
8. **Logging/analytics & data retention** — request IDs, whether question text is
   stored, PII policy, redaction.
9. **UX state design** — how stable/live/requires-verification/unsupported/
   provisional/restricted are visually communicated.
10. **Renderer ownership** — extend the existing vanilla client vs build the UI in
    the website's stack (React/Astro/etc.); either way it must consume the same
    JSON contract and stay a thin, secret-free render layer.
11. **Text-generation decision** — whether an LLM is added; if so, adopt the §5
    safety layer before launch.
12. **Localization** — bilingual UX (English answers) vs es-first.
13. **Provenance display depth** — how much claim/source provenance to surface to
    end users.

---

## Final verification

- Server typecheck (`npm run typecheck`): clean.
- Client typecheck (`tsc -p tsconfig.client.json --noEmit`): clean.
- Full suite (`npm test`): **35 test files, 358 tests, 0 failures**.
- No production code was modified by this audit.
