# Initial architecture

## Components

1. **Chat interface** — captures the question and displays answer, warnings and sources.
2. **Intent classifier** — identifies destination, connectivity, experience or planning questions.
3. **Application service** — coordinates retrieval, validation and response composition.
4. **Retriever port** — searches curated documents and entities.
5. **Source validator** — checks authority, freshness and required metadata.
6. **Answer generator** — synthesizes only from approved context.
7. **Citation formatter** — preserves source title, URL, publisher and verification date.

## Core interfaces

```ts
export type SourceEvidence = {
  id: string;
  title: string;
  publisher: string;
  url: string;
  retrievedAt: string;
  validUntil?: string;
};

export type TravelAnswer = {
  answer: string;
  confidence: "high" | "medium" | "low";
  sources: SourceEvidence[];
  verifiedAt: string;
  warnings: string[];
  suggestedInternalLinks: string[];
};
```

These interfaces are architectural examples, not a finalized implementation.

## First vertical slice

**Question:** “¿Cómo se llega a Puerto Williams desde Santiago?”

The first version should:

- explain the usual connection through Punta Arenas;
- separate stable geographic context from dynamic schedules;
- refuse to invent frequencies or prices;
- cite the current transport provider or relevant official source;
- recommend the Puerto Williams guide on End of the World Travel.

## Future integrations

- Austral Beacon RAG repository.
- Observatorio de Conectividad Austral.
- End of the World Atlas entity graph.
- n8n ingestion and freshness workflows.
- Model and vector-store adapters selected later.