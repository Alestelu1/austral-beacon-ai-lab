# Challenge Plan — Austral News Radar v0.1

This document preserves the Challenge plan and key program dates for the Austral Beacon AI Lab project.

## Context

The first recommended course, **n8n para desarrolladores: Construyendo workflows inteligentes**, has been completed. The course covered workflow automation, triggers, OAuth2, Gmail, Slack, GitHub, human-in-the-loop, Data Tables, observability, error handling, JavaScript code nodes, JSON outputs, Gemini/AI integration and structured AI responses.

The user is now building **Austral News Radar v0.1** as the natural MVP for the ONE / Tech Builder Challenge.

## Official Challenge Dates

From the Discord calendar screenshot:

- **23/06/2026** — Lanzamiento del Challenge
- **01/07/2026** — Live en YouTube: Challenge
- **13/07/2026** — Entrega final del Challenge
- **15/07/2026** — Live “Show me Projects”

## Project Candidate

### Name

**Austral News Radar**

### Spanish description

Flujo editorial con IA para monitorear fuentes sobre Patagonia, Magallanes y Antártica.

### English description

AI-assisted editorial workflow for Patagonia and Antarctic source monitoring.

## Problem

Southern Chile, Patagonia, Magallanes, Tierra del Fuego and Antarctica generate many scattered sources: regional news, institutional updates, scientific information, infrastructure topics, tourism/logistics notes and territorial/geographic references.

The problem is not just collecting information. The real need is to:

- preserve sources;
- summarize responsibly;
- classify by geography and topic;
- generate editorial angles;
- avoid unsupported claims;
- keep human review before publication;
- create reusable records for future RAG and dashboard systems.

## Solution

Austral News Radar v0.1 will be a simple n8n + AI workflow that receives a manual URL or text input and generates a structured editorial record.

The system should not publish automatically. It should assist editorial work and require human review.

## MVP Workflow

```text
Manual URL or article text
→ n8n Manual Trigger
→ Set node with source data
→ AI/Gemini node
→ structured JSON output
→ human review
→ save record in Notion / Google Sheets / GitHub Markdown
→ draft social post or editorial note
```

## Expected JSON Output

```json
{
  "source_url": "",
  "source_name": "",
  "original_title": "",
  "summary": "",
  "category": "",
  "geographic_relevance": "",
  "editorial_angle": "",
  "seo_title": "",
  "social_post_draft": "",
  "verification_notes": "",
  "approval_required": true,
  "status": "draft"
}
```

## Target Categories

- Antarctic science
- Antarctic logistics
- Southern Chile infrastructure
- Patagonia travel
- Puerto Williams / Cabo de Hornos
- Tierra del Fuego
- Maritime routes
- Faros australes
- Environmental signals
- Regional news
- Source for future RAG

## Human Review Policy

All AI outputs are drafts.

Before publishing anything, the user must verify:

- source URL;
- publisher;
- date;
- factual accuracy;
- whether claims are current;
- tone alignment with brand guidelines;
- whether the output is too speculative or promotional;
- whether it belongs to Antarctic Pulse, Austral Dispatch, End of the World Atlas or another brand.

## Brand Alignment

Related brands:

- Austral Beacon
- Antarctic Pulse / Pulso Antártico
- Austral Dispatch
- End of the World Atlas
- End of the World Travel
- Antarctica Begins

Tone:

- documentary;
- cartographic;
- source-based;
- cautious;
- bilingual-ready;
- not sensationalist;
- not generic influencer travel content.

## Development Plan

### Before 23/06/2026

Prepare the project concept:

- define project name;
- define problem;
- define MVP workflow;
- create sample prompt;
- prepare first test source;
- document in GitHub and Notion.

### 23/06/2026 to 01/07/2026

Build v0.1:

- Manual Trigger;
- Set node;
- AI/Gemini node;
- structured JSON output;
- first human review step;
- save output somewhere persistent.

### 01/07/2026 to 13/07/2026

Prepare final delivery:

- README;
- screenshots;
- workflow explanation;
- example input;
- example output;
- limitations;
- next steps.

### 15/07/2026

Prepare for “Show me Projects”:

- short demo;
- one-minute explanation;
- why it matters;
- what was learned;
- how it can scale.

## Success Criteria

Austral News Radar v0.1 is successful if it can:

- receive one manual source;
- generate a factual summary;
- classify the topic;
- identify geographic relevance;
- generate an editorial angle;
- create a social draft;
- preserve the original source;
- require human review;
- save a reusable record.

## Next Steps

1. Build the first manual n8n workflow.
2. Test with one source.
3. Save screenshots.
4. Add output example to GitHub.
5. Add evidence to Drive.
6. Use the project as the Challenge candidate.
