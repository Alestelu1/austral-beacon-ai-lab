# Chile Antarctic Gateway — Retrieval View v1

## Purpose

This retrieval view converts the canonical source/fact layer into compact agent-facing retrieval units without discarding provenance or temporal status.

The view is intentionally not an embedding dump. It is a curated retrieval layer built after source classification and normalization.

## Initial chunks

1. **Punta Arenas → King George Island gateway**
   - geography + gateway role + facilities + operator routing
   - mixed institutional and first-party evidence

2. **Fildes scientific-logistics concentration**
   - Peninsula Fildes / King George Island
   - Villa Las Estrellas
   - Base Frei
   - Base Profesor Julio Escudero
   - Teniente Marsh

3. **Escudero renewal toward 2030**
   - planned permanent advanced scientific platform
   - projected capacity up to 98 people
   - must remain marked as planned until implementation is verified

4. **Punta Arenas → Glaciar Unión deep-field scientific-logistics network**
   - INACH describes a network of more than 3,000 km
   - supported by INACH, Armed Forces, ANID and GORE Magallanes
   - not a public/tourist route

5. **INACH Antarctic climate monitoring network**
   - 15 automatic weather stations reported in the 2025 encyclopedia
   - planned network total: 21 monitoring points

6. **Puerto Williams Antarctic policy role**
   - gateway status in policy
   - possible origin for Antarctic submarine cable study
   - integrated Antarctic development task
   - not proof of current commercial operations

## Retrieval policy

For user-facing answers, agents should first classify the question:

- **geography / science / institutional infrastructure** → INACH
- **policy / planned infrastructure / government priorities** → MINREL
- **state air capability / deep-field / SAR** → FACh (and DGAC where applicable)
- **current commercial products / schedules / prices** → first-party operator sources

## Guardrails

- Never infer public access from military or scientific capability.
- Never convert a planned project into an operational asset.
- Never use old operator pricing as current pricing without revalidation.
- Preserve entity IDs across Atlas, Radar, Travel, Antarctica Begins and Observatorio.
- Every retrieval chunk must maintain a route back to source IDs and canonical facts.

## Next step

Add current FACH/DGAC verification for Base Frei and Teniente Marsh, then create the first agent queries/tests against this retrieval view before embeddings.
