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
```

### MVP Success Criteria

- A URL can be processed manually.
- A summary is generated.
- A category is assigned.
- A draft post is created.
- The source URL is preserved.
- Output is saved somewhere outside chat.

---

## Workflow 2 — RAG Source Intake

**Status:** Planned  
**Main tools:** GitHub, Notion, Google Drive, future LangChain/RAG stack  
**Related agents:** RAG Source Curator, End of the World Atlas Knowledge Agent  
**Related brands:** End of the World Atlas, Antarctic Pulse, Austral Beacon

### Purpose

Prepare documents, URLs and notes for future RAG systems.

### Input

- PDF
- URL
- Government document
- Scientific paper
- Map reference
- Article
- Historical note
- Tourism source

### Process

1. Save original source.
2. Record source metadata.
3. Classify source type.
4. Summarize content.
5. Assign geographic tags.
6. Assign project relevance.
7. Evaluate credibility.
8. Mark RAG readiness.
9. Add to RAG_SOURCES.md.
10. Store file or link in Notion/Drive.

### Output Fields

```json
{
  "title": "",
  "source_url": "",
  "source_type": "",
  "publisher": "",
  "date": "",
  "geographic_tags": [],
  "topic_tags": [],
  "summary": "",
  "credibility_level": "",
  "rag_readiness": "",
  "recommended_project": "",
  "verification_notes": ""
}
```

### Source Quality Levels

- Primary source
- Official institutional source
- Scientific / academic source
- Reputable media source
- Local specialist source
- Tourism / commercial source
- User note
- Unverified / needs review

---

## Workflow 3 — End of the World Atlas Place Card

**Status:** Planned  
**Main tools:** RAG, Markdown, GitHub, future dashboard  
**Related agent:** End of the World Atlas Knowledge Agent  
**Related brand:** End of the World Atlas

### Purpose

Create structured place cards for geography, maps, routes and documentary storytelling.

### Input

- Place name
- Coordinates
- Source notes
- Historical context
- Map reference
- Related routes

### Process

1. Identify place.
2. Gather reliable sources.
3. Create factual summary.
4. Add geographic context.
5. Add historical context.
6. Identify related routes.
7. Add source list.
8. Mark verification status.
9. Save as Markdown or structured JSON.
10. Use later in dashboard or public atlas.

### Output Fields

```json
{
  "place_name": "",
  "region": "",
  "country": "",
  "coordinates": "",
  "summary": "",
  "historical_context": "",
  "geographic_relevance": "",
  "related_routes": [],
  "related_projects": [],
  "sources": [],
  "verification_status": ""
}
```

### First Place Cards

- Puerto Williams
- Cabo de Hornos
- Isla Navarino
- Punta Arenas
- Estrecho de Magallanes
- Canal Beagle
- Tierra del Fuego
- Ruta Vicuña–Yendegaia
- Faros australes
- Drake Passage

---

## Workflow 4 — Social Draft Generator

**Status:** Planned  
**Main tools:** AI model, Notion, GitHub prompts  
**Related agents:** AI Editorial Copilot, Austral Dispatch Briefing Agent  
**Related brands:** End of the World Travel, Fin del Mundo Travel, Antarctic Pulse, Austral Dispatch

### Purpose

Generate draft social posts from verified or semi-verified editorial notes.

### Input

- Summary
- Source URL
- Target brand
- Language
- Tone
- Platform

### Process

1. Select target brand.
2. Select language.
3. Select platform.
4. Use brand guidelines.
5. Generate post draft.
6. Add source note if needed.
7. Add hashtags.
8. Mark as draft.
9. Human reviews.
10. Publish manually.

### Platforms

- X
- Threads
- LinkedIn
- Instagram caption
- Reddit discussion starter
- Facebook Page
- YouTube Community

### Output Fields

```json
{
  "target_brand": "",
  "platform": "",
  "language": "",
  "post_draft": "",
  "hashtags": [],
  "source_url": "",
  "status": "draft",
  "review_notes": ""
}
```

---

## Workflow 5 — Learning Log After Each Class

**Status:** Active  
**Main tools:** GitHub, Notion, ChatGPT, Perplexity  
**Related projects:** Alura ONE AI, CódigoFacilito Agents/Kiro

### Purpose

Convert each course class into practical project knowledge.

### Process

After each class:

1. Save class title.
2. Save screenshots or notes.
3. Identify concepts learned.
4. Translate each concept into possible project applications.
5. Decide whether it applies to:
   - Austral News Radar
   - Antarctic Pulse Monitor
   - End of the World Atlas Knowledge Base
   - Dashboard prototype
   - RAG Source Library
6. Update GitHub.
7. Save important strategy to Notion.
8. Add technical experiments to the roadmap.

### Output Fields

```json
{
  "course": "",
  "class_title": "",
  "date": "",
  "concepts_learned": [],
  "tools_used": [],
  "project_applications": [],
  "next_actions": [],
  "status": ""
}
```

---

## Workflow 6 — GitHub / Notion / Drive Backup

**Status:** Active  
**Main tools:** GitHub, Notion, Google Drive  
**Related projects:** All

### Purpose

Avoid depending on a single chat or platform as the only source of project memory.

### Process

- Important strategy goes to Notion.
- Technical documentation goes to GitHub.
- Screenshots, evidence and assets go to Google Drive.
- Course notes are summarized in GitHub or Notion.
- Domain/social evidence is stored in Google Drive.
- Weekly review checks what is missing.

### Storage Logic

| Content type | Primary storage | Secondary storage |
|---|---|---|
| Technical docs | GitHub | Notion |
| Strategy | Notion | GitHub |
| Screenshots | Google Drive | Notion |
| Evidence of use | Google Drive | Notion |
| Workflows | GitHub | n8n export |
| Prompts | GitHub | Notion |
| Source lists | GitHub | Notion / Drive |
| Draft posts | Notion | GitHub if strategic |

---

## Workflow 7 — Dashboard Development Loop

**Status:** Planned  
**Main tools:** Codex, Antigravity, Gemini, GitHub  
**Related project:** Austral Beacon Intelligence Dashboard

### Purpose

Create a small dashboard prototype without overbuilding.

### Process

1. Define dashboard sections.
2. Create static mockup.
3. Use sample data.
4. Avoid backend at first.
5. Store sample JSON files in `data/`.
6. Add one feature at a time.
7. Keep README updated.
8. Take screenshots for portfolio/evidence.

### Initial Dashboard Sections

- News Radar
- Sources
- Places
- RAG Library
- Editorial Ideas
- Social Drafts
- Learning Log
- Project Status

### MVP Success Criteria

- Runs locally.
- Shows sample data.
- Has clear sections.
- Uses Austral Beacon visual identity.
- Can be expanded later.

---

## Workflow 8 — Human Editorial Review

**Status:** Required for all public content  
**Main tools:** Human review, source checklist, brand guidelines

### Purpose

Prevent AI-generated errors, exaggeration or unsupported claims.

### Checklist

Before publishing:

- [ ] Is the source preserved?
- [ ] Is the claim verified?
- [ ] Is the tone aligned with the brand?
- [ ] Is uncertainty clearly stated?
- [ ] Is the post too sensational?
- [ ] Is the geographic information accurate?
- [ ] Is the Chilean perspective evidence-based?
- [ ] Is the content draft or final?
- [ ] Is the platform appropriate?
- [ ] Does it need more context?

---

## Build Order

**First**

1. Learning Log After Each Class
2. GitHub / Notion / Drive Backup
3. Austral News Radar v0.1

**Second**

4. RAG Source Intake
5. Social Draft Generator
6. End of the World Atlas Place Card

**Third**

7. Dashboard Development Loop
8. Human Editorial Review refinement

---

## Notes

The first working system should be simple:

**Manual URL → AI summary → category → editorial angle → draft social post → saved record → human review.**

This is enough to begin building real infrastructure.








