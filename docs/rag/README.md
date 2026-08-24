# Austral Beacon RAG Knowledge Layer

This directory documents the canonical ingestion workflow for authoritative and reusable knowledge sources across Austral Beacon Media.

## Standard pipeline

`catalogue → deduplicate → extract facts → resolve entities → normalize JSON → generate MDX where useful → semantic chunking → embeddings → agent retrieval`

## Core rules

1. Preserve the original source and source identifier.
2. Classify authority and source type before ingestion.
3. Do not treat promotional operator material as equivalent to institutional policy sources.
4. Deduplicate by content hash before embedding.
5. Separate factual statements from interpretation.
6. Every normalized fact should retain provenance to its source document and, when available, page/section.
7. Reuse canonical entities instead of creating alternate names for the same place or institution.
8. Store temporal validity for prices, schedules, policies and operational information.
9. Do not use raw-PDF vectorization as the sole knowledge layer.
10. Human review is required before publication.

## Source priority

- **Critical / High:** current institutional policy, official maps, current logistics/access sources, canonical geographic sources.
- **Medium:** historical context, specialist secondary works, strategy/marketing studies, older operational sources.
- **Low / Cold corpus:** duplicates, translations of an already-ingested canonical source, out-of-scope regional material, temporary commercial forms.

## Initial canonical extraction

- `data/sources/minrel-pea-2026-2030.json` — Chilean Antarctic Strategic Plan 2026–2030.

## Planned Batch 01

1. MINREL — Plan Estratégico Antártico 2026–2030
2. MINREL — Política Nacional de Turismo Antártico 2020
3. INACH — Enciclopedia Visual Antártica, 4th edition (2025)
4. Antarctic Treaty environmental protection protocol
5. DAP — Antarctic Logistic Services
6. DAP — Antarctica Briefing 2026
7. Antarctica21 — Brochure 2027–28
8. Patagonia Chile — Puerto Williams map
9. Patagonia Chile — Provincia Antártica Chilena map
10. Parque Nacional Yendegaia
11. Ruta de los Parques — Magallanes road map
12. Patagonia Chile — Manual de Destino Magallanes 2025
