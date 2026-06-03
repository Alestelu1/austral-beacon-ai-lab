# Austral Beacon AI Lab — Agents

This document defines the first AI agents and assistant roles for the Austral Beacon ecosystem.

The goal is to build small, reusable and verifiable agents that support editorial intelligence, cartographic documentation, RAG research, source tracking and content preparation.

Agents should assist human editorial work. They should not publish automatically without review.

---

## Core Principle

Every agent must follow these rules:

1. Preserve original sources.
2. Separate factual summary from interpretation.
3. Identify uncertainty.
4. Avoid sensationalism.
5. Avoid nationalist or propagandistic framing.
6. Prefer documentary, cartographic and evidence-based framing.
7. Generate drafts, not final publications.
8. Support bilingual workflows when useful.
9. Keep outputs reusable across GitHub, Notion and future dashboards.
10. Never invent sources, quotes, locations or historical claims.

---

## Agent 1 — Austral News Radar

**Status:** Planned  
**Priority:** Highest  
**Related project:** Austral Beacon, Antarctic Pulse, Austral Dispatch  
**Main phase:** Alura ONE AI / n8n

### Purpose

Detect, summarize, classify and prepare editorial notes from southern / Antarctic news sources.

This is the first practical agent to build because it connects directly with n8n, automation, prompts, editorial workflows and later RAG systems.

### Inputs

- News URL
- RSS item
- Article text
- Source name
- Publication date
- Optional notes from the user

### Outputs

- Short factual summary
- Editorial category
- Geographic relevance
- Chile / Patagonia / Antarctica relevance
- Suggested SEO title
- Suggested social post
- Suggested editorial angle
- Verification notes
- Source URL preserved

### Categories

- Antarctica
- Patagonia
- Southern Chile
- Puerto Williams
- Punta Arenas
- Cape Horn
- Strait of Magellan
- Tierra del Fuego
- Polar science
- Antarctic logistics
- Tourism
- Maritime routes
- Infrastructure
- Climate / environment
- Maps / geography

### Example Output Structure

```json
{
  "title": "",
  "source_url": "",
  "source_name": "",
  "summary": "",
  "category": "",
  "geographic_relevance": "",
  "editorial_angle": "",
  "seo_title": "",
  "social_post_draft": "",
  "verification_notes": "",
  "recommended_project": ""
}
