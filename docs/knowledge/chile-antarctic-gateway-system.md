# Chile Antarctic Gateway System — canonical model v1

## Purpose

This document defines a reusable cross-source model for Chile-linked Antarctic access, infrastructure, science, logistics and tourism.

It does **not** assert that every node or planned project is currently operational. Each relationship retains a source class and temporal rule.

## Four evidence layers

### 1. Policy and strategy — MINREL

Use for:
- national policy
- strategic objectives
- planned infrastructure
- institutional responsibilities
- Puerto Williams / Punta Arenas gateway strategy
- sustainable tourism and connectivity priorities

Do not use policy documents alone as proof that a route, service or infrastructure project is currently operational.

### 2. Scientific/geographic infrastructure — INACH

Use for:
- Antarctic geography
- scientific platforms
- historical establishment of bases and refuges
- science/logistics network relationships
- Fildes / King George Island place relationships

Do not use historical establishment dates as proof of current operating status.

### 3. State operational capability — FACH

Use for:
- demonstrated air mobility
- SAR and medevac capability
- deep-field deployments
- Glaciar Unión operations
- aircraft and mission evidence

Do not convert military/scientific deployments into public passenger routes.

### 4. First-party commercial operations — DAP / Antarctica21

Use for:
- current products
- operator routes
- aircraft/vessels
- prices and seasons
- visitor programs

All commercial facts require freshness metadata and re-verification before current user-facing answers.

## Two principal access layers

### A. Peninsula / King George gateway layer

`Punta Arenas -> Isla Rey Jorge -> Fildes / Marsh / Frei / Escudero / Villa Las Estrellas`

Supports combinations of:
- state operations
- science
- commercial air access
- tourism products
- logistics
- emergency response

### B. Deep-field scientific/state layer

`Punta Arenas -> Glaciar Unión -> Antarctic interior`

Supported by INACH and FACH evidence. This is a scientific/logistical/state capability layer, not a general public route.

## Puerto Williams layer

Puerto Williams is modelled separately because the strongest present evidence is strategic/policy rather than equivalent current Antarctic commercial operations:

- recognized in MINREL sources as an Antarctic gateway city;
- candidate origin for the Antarctic submarine cable study;
- target of an integrated Antarctic development-plan task for 2026–2030.

Future Radar workflows should monitor when policy commitments produce verifiable infrastructure, services or routes.

## Key canonical nodes

### Continental gateway
- Punta Arenas
- Puerto Williams

### King George / Fildes cluster
- Isla Rey Jorge / King George Island
- Península de Fildes
- Bahía Fildes
- Aeródromo Teniente Rodolfo Marsh
- Base Presidente Eduardo Frei Montalva
- Base Profesor Julio Escudero
- Villa Las Estrellas

### Deep-field
- Glaciar Unión
- Estación/Base Glaciar Unión

### Operators
- FACH
- DAP
- Antarctica21
- INACH as science-program/platform authority

### Planned infrastructure
- Bahía Fildes port infrastructure
- Antarctic submarine fiber-optic cable
- Puerto Williams integrated Antarctic development plan
- Teniente Marsh conservation/upgrades

## Agent routing logic

A user-facing agent should first classify the query:

- `travel_product` -> current DAP / Antarctica21 source layer
- `gateway_geography` -> INACH + MINREL
- `policy_strategy` -> MINREL
- `scientific_platform` -> INACH
- `state_air_capability` -> FACH
- `sar_medevac` -> FACH + DAP where relevant
- `planned_project` -> MINREL + implementation-status verification

## Critical truth rules

1. Planned is not operational.
2. Historical inauguration is not current availability.
3. Military/scientific mobility is not public transport.
4. Commercial prices/routes must include season and freshness.
5. Operator marketing cannot override institutional geographic or regulatory sources.
6. Geographic graph edges require explicit or authoritative geographic evidence.
7. Current availability must be checked at response time when the answer is user-facing and time-sensitive.

## Next expansion

1. Add current FACH/DGAC evidence for Teniente Marsh/Base Frei operational status.
2. Normalize INACH platform aliases and seasonal/permanent use.
3. Add current port/maritime evidence for Bahía Fildes.
4. Connect Puerto Williams to future verified Antarctic operational capabilities only when evidence exists.
5. Generate semantic chunks and retrieval views from canonical graph records.
