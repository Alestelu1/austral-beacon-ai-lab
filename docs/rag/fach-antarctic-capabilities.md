# Fuerza Aérea de Chile — Antarctic operational capability layer

## Source set

This layer is based on four issues of the official *Revista Fuerza Aérea de Chile* added to the Drive corpus:

- Nº280 (2019)
- Nº285 (2021)
- Nº293 (2025)
- Nº294 (2025)

These are **first-party institutional sources**. They are strong evidence for what the FACh reported doing, which aircraft and units participated, and what capabilities were demonstrated at the documented time. They are not regulatory or live operational feeds.

## Priority assessment

### Nº293 (2025) — critical

The strongest new source. It documents **Operación Estrella Polar III** and the air-mobility chain used to reach the South Pole.

Key facts:

- The operation used the Estación Polar Científica Conjunta Glaciar Unión as the deep-field staging point.
- Two MH-60M Black Hawk helicopters and two DHC-6 Twin Otter aircraft flew from Glaciar Unión to the South Pole.
- The document states a distance of 1,129 km between Glaciar Unión and the South Pole.
- The wider operation included Boeing 767 transport from Santiago to Punta Arenas and Gulfstream G-IV aircraft from Punta Arenas toward Glaciar Unión.
- The mission is useful evidence of demonstrated Chilean state air mobility into the Antarctic interior, but it must not be presented as a regular passenger route.

### Nº285 (2021) — critical

A core source for **Glaciar Unión**, Antarctic science logistics and deep-field operations.

Key facts:

- Describes the Estación Polar Científica Conjunta Glaciar Unión as a joint scientific station deep in the Antarctic interior.
- Identifies participation by INACH, Army, Navy, FACh and DGAC personnel.
- Documents use of C-130 Hercules and DHC-6 Twin Otter aircraft.
- Connects the IV Brigada Aérea in Punta Arenas with the Twin Otter Antarctic mission.
- Describes air transport as essential for accessing and sustaining the operation.
- Documents movement from Base Aérea Chabunco toward the Antarctic continent.

This source is particularly valuable for Antarctic Pulse, the Connectivity Observatory and any future science-logistics agent.

### Nº280 (2019) — high

Useful for the **Search and Rescue / emergency response** layer.

The issue reports Antarctic rescue missions using a Bell-412 helicopter, including assistance to passengers from an Argentine Air Force aircraft near James Ross Island and the rescue of three Polish scientists from a small boat in the South Shetland Islands.

This complements the 2020 National Antarctic Tourism Policy, which identifies Chilean SAR responsibilities, but the magazine provides concrete operational examples rather than policy intent.

### Nº294 (2025) — medium / supplementary

Contains a specific article on **proactive safety during Operación Estrella Polar III**. It is relevant for mission planning, operational-risk and safety metadata, but it partly overlaps with Nº293 and should be treated as supporting evidence rather than a separate canonical description of the mission.

## New capability model

The Chilean Antarctic air layer should no longer be represented only as:

`Punta Arenas → King George Island`

There are at least two different operational patterns in the corpus:

### Gateway / Peninsula layer

`Punta Arenas → King George Island / Teniente Marsh`

Used by tourism, logistics, state operations and science support.

### Deep-field state/science layer

`Punta Arenas / Base Aérea Chabunco → Glaciar Unión → South Pole / Antarctic interior`

This second layer is **not a tourism route**. It is a state/scientific/logistical capability documented in FACh sources.

## Canonical entities to create or enrich

### Places and infrastructure

- Base Aérea Chabunco
- Estación Polar Científica Conjunta Glaciar Unión
- South Pole
- King George Island
- Aeródromo Teniente Marsh
- South Shetland Islands
- James Ross Island

### Institutions and units

- Fuerza Aérea de Chile
- II Brigada Aérea
- IV Brigada Aérea
- Grupo de Aviación N°10
- Instituto Antártico Chileno
- Dirección General de Aeronáutica Civil

### Aircraft

- DHC-6 Twin Otter
- C-130 Hercules
- Gulfstream G-IV
- MH-60M Black Hawk
- Bell-412
- Boeing 767

## Relationship with existing sources

The FACh material fills a gap left by MINREL, DAP and Antarctica21:

| Source | Best authority for |
|---|---|
| MINREL | policy, strategic plans, institutional responsibilities |
| FACh | state air operations, demonstrated aircraft capability, military/science logistics, SAR examples |
| DAP | commercial air/logistics products and first-party operational services |
| Antarctica21 | commercial fly-and-cruise expedition products |
| INACH | science, stations, research programs, Antarctic knowledge |

The sources should be combined, not flattened into a single authority level.

## RAG safeguards

1. A documented mission proves **demonstrated capability at that date**, not permanent availability.
2. A military/state route is not a public passenger route unless another current source explicitly says so.
3. Aircraft appearing in a mission should not automatically be marked as permanently based at that location.
4. Historical rescue examples can support a SAR capability narrative but should retain year, location and source.
5. Operational and infrastructure facts should be cross-linked to MINREL/INACH/DGAC sources when available.

## Project routing

- **Austral Connectivity Observatory:** state air logistics, deep-field access, SAR, gateway architecture.
- **Antarctica Begins:** explain the Chilean Antarctic access ecosystem, clearly distinguishing public/commercial access from state/science operations.
- **Antarctic Pulse:** science logistics and Glaciar Unión.
- **Austral Intelligence Radar:** monitor changes in aircraft, infrastructure, stations and operational capability.
- **End of the World Atlas:** canonical entities and geographic relationships.

## Next extraction target

Use INACH/FACH institutional material to enrich:

`Punta Arenas → Base Aérea Chabunco → King George Island / Teniente Marsh`

and separately:

`Punta Arenas → Glaciar Unión → Antarctic interior / South Pole`

These should remain separate route classes in the knowledge graph.
