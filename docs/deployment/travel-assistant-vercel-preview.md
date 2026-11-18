# Travel Assistant — Vercel preview runtime plan (2026-11-18)

**Status: source code prepared, NOT deployed.** Dedicated preview service, no public production release, no DNS changes.

## Objective
Deploy the existing Travel Assistant from the Austral Beacon **repository root**, preserving its canonical imports into `knowledge-base/` and `data/retrieval/`. The Vercel Functions are thin entrypoints in `api/answer.ts` and `api/health.ts`, not a second knowledge base.

## Source layout
- `api/answer.ts`: Web Request/Response handler; wraps `answerViaAssistant` from `projects/end-of-the-world-travel-agent/`.
- `api/health.ts`: liveness only.
- `api/demo.ts`: protected, noindex same-origin Spanish demo page at `/api/demo`, calls `/api/answer`. It does not imply bilingual answer generation.
- `package.json`: root ESM and Node 24 requirement.
- The existing project under `projects/end-of-the-world-travel-agent/` retains its own package and tests.

## Required deployment gates
1. New **dedicated** Vercel project linked to this repository **with repository root as rootDirectory** (not the agent subfolder). Framework: other/Node, no production domain.
2. Preview deployment must use **Vercel Authentication / SSO**. Verify project-level deployment protection; do not grant broad public access.
3. Preview-only server-side env flag `TRAVEL_ASSISTANT_PREVIEW_ENABLED=true` when ready. Default is disabled; GET/POST requests are not a public offering.
4. Confirm source imports and JSON/projection tracing work with Vercel's builder; test build logs and GET `/api/health`; POST `/api/answer` with a supported and unsupported question.
5. Before any public enablement: proper distributed edge rate limiting / WAF, dependency audit (Issue #28), privacy/log review, outbound live-fetch timeout/cancellation, observability and cost caps.
6. **Initial demo path:** open the standalone protected backend preview at `/api/demo` in its own tab; same-origin POST works without changing Astro routing. CSP intentionally blocks cross-origin framing. The Astro pages remain non-indexed placeholders until a separately tested site integration is available. Do not rely on unsupported Astro `vercel.json` rewrites.
7. Validate English and Spanish **answer content** separately; current UI language selection does not guarantee translated backend summaries.
8. Record deployment IDs/preview URL, evidence, commit SHA and results in the Build 13 handoff and Issue #26.

## Operational limits
- POST refuses all queries when `TRAVEL_ASSISTANT_PREVIEW_ENABLED` is not exactly `true`.
- 16 KB body; JSON only; nonempty question <= 2000 characters; 12s serverless response timeout.
- Timer bounds HTTP response but does not cancel underlying work; DO NOT claim a hard cancellation.
- **No distributed rate limiting implemented.** Do not interpret basic input validation as abuse protection.
- Do not expose keys or user questions in logs.
- Do not merge PR #27 and #29 blindly; they share two legacy TypeScript typecheck fixes.

## Official platform documents
- https://vercel.com/docs/functions/runtimes/node-js
- https://vercel.com/docs/frameworks/frontend/astro
- https://vercel.com/docs/routing/rewrites

## Acceptance
No claims of a working deployment without a Ready deployment, health check, supported query, negative query and the standalone `/api/demo` browser smoke test, all grounded in actual evidence.

Security note: the demo page uses inline CSS/JS under a restrictive preview-only CSP. Before public exposure, replace unsafe-inline with hashed/nonced assets and complete the production security review.
