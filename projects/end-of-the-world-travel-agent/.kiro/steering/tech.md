---
inclusion: always
---

# Technology stack

## Initial architecture

Start as a small modular application. Do not introduce distributed services until real usage requires them.

## Preferred stack

- Frontend: TypeScript with a lightweight web interface; framework selected when implementation begins.
- Backend: TypeScript or Python, chosen after the first Kiro specification.
- Retrieval: provider-independent RAG interfaces.
- Data: versioned Markdown/JSON for curated fixtures; vector database only when document volume justifies it.
- Validation: schema validation at API and ingestion boundaries.
- Testing: unit tests for domain behavior and integration tests for retrieval contracts.

## Required boundaries

```text
UI
  → application/use-cases
  → domain
  → ports
  → adapters: LLM, retriever, storage, web/API
```

The domain layer must not import a specific model provider, vector database or cloud SDK.

## Response contract

Each answer should support:

- `answer`
- `confidence`
- `sources[]`
- `verifiedAt`
- `warnings[]`
- `suggestedInternalLinks[]`

## Security

- Environment variables for secrets.
- `.env.example` contains names only, never values.
- Sanitize user input and retrieved content.
- Apply prompt-injection defenses to retrieved documents.
- Log technical events without storing unnecessary personal information.

## Current constraint

This repository is a skeleton. Do not add dependencies until a Kiro spec explicitly approves the first implementation slice.