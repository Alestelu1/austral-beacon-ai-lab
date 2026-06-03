# Austral Beacon AI Lab — Project Ideas

This document stores possible projects for the Austral Beacon ecosystem.

Projects should remain focused, evidence-based and aligned with the documentary/cartographic identity.

---

## Priority Projects

### 1. Austral News Radar v0.1

Purpose:
Detect, summarize, classify and prepare editorial notes from southern / Antarctic news sources.

Core workflow:
Manual URL -> AI summary -> category -> editorial angle -> draft post -> save record -> human review.

Related brands:
- Austral Beacon
- Antarctic Pulse
- Austral Dispatch

Status:
First priority.

---

### 2. End of the World Atlas Knowledge Base

Purpose:
Build a RAG-ready knowledge base for places, routes, maps, lighthouses, infrastructure and southern geography.

Initial topics:
- Puerto Williams
- Cabo de Hornos
- Isla Navarino
- Ruta Vicuña–Yendegaia
- Estrecho de Magallanes
- Canal Beagle
- Faros australes
- Antarctic departure routes

Related brand:
End of the World Atlas.

Status:
Second priority.

---

### 3. Antarctic Pulse Monitor

Purpose:
Monitor Antarctic science, expedition updates, environmental signals and polar logistics without sensationalism.

Related brands:
- Antarctic Pulse
- Pulso Antártico
- Austral Dispatch

Status:
High potential after Austral News Radar.

---

### 4. Faros Australes Dataset

Purpose:
Create a structured dataset of southern Chilean lighthouses for maps, stories, routes and atlas entries.

Possible fields:
- Name
- Location
- Coordinates
- Region
- Source
- Historical note
- Route relevance
- Image rights status

Related brands:
- End of the World Atlas
- End of the World Travel
- Antarctica Begins

Status:
Strong documentary/cartographic project.

---

### 5. Austral Dispatch Briefing Generator

Purpose:
Turn verified or semi-verified source notes into concise bilingual briefings.

Outputs:
- 3-bullet briefing
- short headline
- source note
- X / LinkedIn draft
- newsletter note

Related brand:
Austral Dispatch.

Status:
Medium priority.

---

### 6. Antarctica Begins Story Engine

Purpose:
Generate narrative structures around Antarctic gateway routes, southern ports and expedition geography.

Related topics:
- Punta Arenas
- Puerto Williams
- Cape Horn
- Beagle Channel
- Drake Passage
- Antarctic logistics

Status:
Useful for landing pages and social storytelling.

---

### 7. End of the World Travel Route Builder

Purpose:
Create structured route ideas for travel-facing content while keeping a documentary/geographic tone.

Route types:
- Maritime route
- Lighthouse route
- Gateway route
- Scenic road route# Austral Beacon AI Lab — Project Ideas

This document stores possible projects for the Austral Beacon ecosystem.

Projects should remain focused, evidence-based and aligned with the documentary/cartographic identity.

---

## Priority Projects

### 1. Austral News Radar v0.1

Purpose:
Detect, summarize, classify and prepare editorial notes from southern / Antarctic news sources.

Core workflow:
Manual URL -> AI summary -> category -> editorial angle -> draft post -> save record -> human review.

Related brands:
- Austral Beacon
- Antarctic Pulse
- Austral Dispatch

Status:
First priority.

---

### 2. End of the World Atlas Knowledge Base

Purpose:
Build a RAG-ready knowledge base for places, routes, maps, lighthouses, infrastructure and southern geography.

Initial topics:
- Puerto Williams
- Cabo de Hornos
- Isla Navarino
- Ruta Vicuña–Yendegaia
- Estrecho de Magallanes
- Canal Beagle
- Faros australes
- Antarctic departure routes

Related brand:
End of the World Atlas.

Status:
Second priority.

---

### 3. Antarctic Pulse Monitor

Purpose:
Monitor Antarctic science, expedition updates, environmental signals and polar logistics without sensationalism.

Related brands:
- Antarctic Pulse
- Pulso Antártico
- Austral Dispatch

Status:
High potential after Austral News Radar.

---

### 4. Faros Australes Dataset

Purpose:
Create a structured dataset of southern Chilean lighthouses for maps, stories, routes and atlas entries.

Possible fields:
- Name
- Location
- Coordinates
- Region
- Source
- Historical note
- Route relevance
- Image rights status

Related brands:
- End of the World Atlas
- End of the World Travel
- Antarctica Begins

Status:
Strong documentary/cartographic project.

---

### 5. Austral Dispatch Briefing Generator

Purpose:
Turn verified or semi-verified source notes into concise bilingual briefings.

Outputs:
- 3-bullet briefing
- short headline
- source note
- X / LinkedIn draft
- newsletter note

Related brand:
Austral Dispatch.

Status:
Medium priority.

---

### 6. Antarctica Begins Story Engine

Purpose:
Generate narrative structures around Antarctic gateway routes, southern ports and expedition geography.

Related topics:
- Punta Arenas
- Puerto Williams
- Cape Horn
- Beagle Channel
- Drake Passage
- Antarctic logistics

Status:
Useful for landing pages and social storytelling.

---

### 7. End of the World Travel Route Builder

Purpose:
Create structured route ideas for travel-facing content while keeping a documentary/geographic tone.

Route types:
- Maritime route
- Lighthouse route
- Gateway route
- Scenic road route
- Subantarctic route
- Infrastructure route

Status:
Later phase after source base improves.

---

### 8. Austral Beacon Intelligence Dashboard

Purpose:
A simple dashboard to review AI summaries, sources, RAG notes, social drafts and project status.

Initial sections:
- News Radar
- Sources
- Places
- RAG Library
- Editorial Ideas
- Social Drafts
- Learning Log
- Project Status

Status:
Dashboard prototype after documentation and prompts are ready.

- Subantarctic route
- Infrastructure route

Status:
Later phase after source base improves.

---

### 8. Austral Beacon Intelligence Dashboard

Purpose:
A simple dashboard to review AI summaries, sources, RAG notes, social drafts and project status.

Initial sections:
- News Radar
- Sources
- Places
- RAG Library
- Editorial Ideas
- Social Drafts
- Learning Log
- Project Status

Status:
Dashboard prototype after documentation and prompts are ready.
- Manual URLs
- RSS feeds
- PDFs
- official documents
- scientific papers
- tourism/infrastructure sources
- user notes

Processing layer:
- n8n workflows
- AI model calls
- classification prompts
- RAG source evaluation
- human review

Storage layer:
- GitHub for technical documentation
- Notion for strategy, task planning and editorial organization
- Google Drive for screenshots, evidence, PDFs and assets
- future database for structured records

Output layer:
- Markdown files
- Notion records
- Google Sheets records
- dashboard views
- draft social posts
- draft articles
- RAG-ready documents

---

## Minimum Viable System

The first real system should be:

Manual URL -> AI summary -> classification -> editorial angle -> social draft -> saved record -> human review.

This is enough to prove the workflow before adding RSS, automation, dashboards or publishing.

---

## Future Dashboard Structure

apps/dashboard/

Possible sections:
- News Radar
- Sources
- Places
- RAG Library
- Editorial Ideas
- Social Drafts
- Learning Log
- Project Status

The first dashboard should use static JSON data. Avoid backend complexity at the beginning.

---

## Suggested Future Stack

Frontend:
- React / Next.js or Vite
- Tailwind or simple CSS
- static JSON data at first

Automation:
- n8n

AI:
- OpenAI / Gemini / other available models

RAG:
- LangChain
- vector database later
- Markdown/PDF source library first

Storage:
- GitHub
- Notion
- Google Drive
- future database when needed

Deployment:
- Vercel for frontend prototypes
- OCI for learning cloud deployment
- local development when necessary

---

## Security Notes

Do not commit:
- API keys
- tokens
- passwords
- private credentials
- private customer data
- unpublished sensitive legal strategy

Use:
- .env files locally
- .env.example in GitHub
- secret managers if deployed

