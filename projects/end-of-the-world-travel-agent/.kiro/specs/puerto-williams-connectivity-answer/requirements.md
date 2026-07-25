# Requirements: Puerto Williams Connectivity Answer

## Objective

Build the first vertical slice of the End of the World Travel Agent: answer how to travel from Santiago to Puerto Williams using curated local data, explicit uncertainty and traceable sources.

## User story

As a traveller researching southern Chile, I want a clear explanation of the usual route from Santiago to Puerto Williams so that I can understand the connection points and know which operational details must be confirmed before travelling.

## Functional requirements

### R1 — Recognize the supported question

The system shall recognize questions about travelling from Santiago to Puerto Williams, including common Spanish and English variants.

### R2 — Return a structured answer

The answer shall contain:

1. direct summary;
2. route stages;
3. dynamic information warning;
4. source references;
5. recommended internal page.

### R3 — Separate stable and dynamic facts

The system shall distinguish stable geographic information from dynamic operational information such as schedules, frequencies, fares and availability.

### R4 — Avoid unsupported claims

The system shall not invent current schedules, prices, seat availability, operators or guaranteed connections.

### R5 — Cite curated sources

Every route answer shall include at least one source object with title, publisher, URL and verification date.

### R6 — Handle insufficient knowledge

When the available local data does not support a claim, the system shall state that the detail requires confirmation from an official provider.

### R7 — Work without an LLM

The first version shall produce a useful deterministic response from local JSON data without requiring an API key or paid model.

## Acceptance criteria

- A supported Spanish query returns the Santiago → Punta Arenas → Puerto Williams route.
- A supported English query returns the same evidence in English-ready structured data.
- No exact timetable, fare or availability claim is returned.
- Sources and `verifiedAt` are present.
- An unrelated query returns `unsupported` rather than a fabricated answer.
