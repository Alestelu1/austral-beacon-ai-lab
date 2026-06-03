# Austral Beacon AI Lab — Workflows

This document defines the first practical workflows for AI, automation, RAG, editorial review and project memory.

The goal is to transform course learning from Alura ONE AI, CódigoFacilito Agents/Kiro, Codex, Gemini and Antigravity into reusable operational workflows for the Austral Beacon ecosystem.

---

## Workflow Principles

Every workflow should follow these rules:

1. Start small.
2. Preserve sources.
3. Save intermediate outputs.
4. Separate draft from publication.
5. Require human review before public publishing.
6. Document each step.
7. Make outputs reusable across projects.
8. Avoid over-automation before verification is reliable.
9. Prefer repeatable workflows over one-off prompts.
10. Keep GitHub, Notion and Google Drive updated.

---

## Workflow 1 — Austral News Radar v0.1

**Status:** First priority  
**Main tools:** n8n, AI model, Notion or Google Sheets, GitHub documentation  
**Related agents:** Austral News Radar, AI Editorial Copilot, RAG Source Curator  
**Related brands:** Austral Beacon, Antarctic Pulse, Austral Dispatch

### Purpose

Create a simple editorial intelligence workflow for detecting, summarizing and classifying southern / Antarctic news sources.

### Input

- Manual URL
- Article text
- RSS item
- User note
- Source name
- Publication date

### Process

1. Receive source URL or article text.
2. Extract title, source and date if available.
3. Send text to AI model.
4. Generate factual summary.
5. Classify topic.
6. Identify geographic relevance.
7. Suggest editorial angle.
8. Generate SEO title.
9. Generate short social post draft.
10. Save output to Notion, Google Sheets or Markdown.
11. Human reviews before publication.

### Output Fields

```json
{
  "source_url": "",
  "source_name": "",
  "publication_date": "",
  "original_title": "",
  "summary": "",
  "category": "",
  "geographic_relevance": "",
  "editorial_angle": "",
  "seo_title": "",
  "social_post_draft": "",
  "recommended_project": "",
  "verification_notes": "",
  "status": "draft"
}
