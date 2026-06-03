# Austral Beacon AI Lab — RAG Prompts

This file stores prompts for source evaluation, metadata extraction and future RAG workflows.

---

## Prompt 1 — RAG Source Evaluator

You are preparing sources for a future RAG system for End of the World Atlas, Antarctic Pulse and Austral Beacon.

Evaluate this source.

Input:
Title:
URL:
Publisher:
Date:
Text or summary:

Rules:
- Do not invent missing metadata.
- If something is unknown, mark it as unknown.
- Separate facts from interpretation.
- Classify credibility carefully.
- Identify whether this source is suitable for RAG.

Output JSON:
{
  "title": "",
  "source_url": "",
  "publisher": "",
  "date": "",
  "source_type": "",
  "geographic_tags": [],
  "topic_tags": [],
  "summary": "",
  "key_facts": [],
  "editorial_relevance": "",
  "related_projects": [],
  "credibility_level": "",
  "rag_readiness": "",
  "verification_notes": ""
}

---

## Prompt 2 — Place Card Builder

You are creating a place card for End of the World Atlas.

Input:
Place name:
Region:
Country:
Coordinates if known:
Sources:
Notes:

Rules:
- Use only supplied sources and notes.
- Mark missing data clearly.
- Keep the tone documentary and geographic.
- Avoid tourist hype.
- Preserve all sources.

Output:
1. Place summary
2. Geographic context
3. Historical context
4. Related routes
5. Related projects
6. Source list
7. Verification status
8. Suggested tags

---

## Prompt 3 — Source Chunking Notes

You are preparing a document for RAG chunking.

Input:
Document title:
Document type:
Text:
Target project:

Return:
- recommended chunking strategy
- sections to preserve
- metadata to attach
- terms/entities to tag
- possible retrieval questions
- warnings or verification issues

