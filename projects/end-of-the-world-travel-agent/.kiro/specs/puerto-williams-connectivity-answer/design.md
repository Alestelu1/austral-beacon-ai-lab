# Design: Puerto Williams Connectivity Answer

## Approach

Use a deterministic, provider-independent TypeScript core. Curated JSON supplies route facts and sources. The core classifies the query, loads the route record and builds a structured response. An LLM adapter may be added later only for natural-language rendering.

## Components

- `data/routes/santiago-puerto-williams.json`: curated route record.
- `src/domain/types.ts`: domain contracts.
- `src/application/answerTravelQuestion.ts`: supported-intent detection and answer assembly.
- `src/index.ts`: public entry point and small CLI.
- `tests/answerTravelQuestion.test.ts`: acceptance tests.

## Response contract

```ts
interface TravelAnswer {
  status: "supported" | "unsupported";
  intent: "connectivity" | "unknown";
  summary: string;
  stages: RouteStage[];
  warnings: string[];
  sources: SourceReference[];
  recommendedPage?: string;
  verifiedAt?: string;
}
```

## Safety decisions

- Operational facts are marked dynamic.
- Exact schedules, fares and availability are intentionally absent.
- Unknown queries never fall through to a generic fabricated response.
- Source verification date is surfaced to the caller.

## Extension path

1. Add more curated routes.
2. Replace keyword matching with an intent-classifier port.
3. Add RAG retrieval behind a knowledge-source port.
4. Add an LLM renderer without changing the domain response.
5. Integrate the API into End of the World Travel.
