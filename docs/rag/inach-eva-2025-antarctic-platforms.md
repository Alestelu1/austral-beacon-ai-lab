# INACH — Enciclopedia Visual de la Antártica 2025: plataformas y geografía operativa

## Source status

- **Document ID:** `inach-eva-2025-antarctic-platforms`
- **Publisher:** Instituto Antártico Chileno (INACH)
- **Source type:** Primary institutional
- **Authority level:** Canonical scientific/geographic context
- **Publication year:** 2025
- **Drive file ID:** `1HKqX--t_DjvtRr5vdeQeB8Sphhzfji4g`
- **RAG priority:** High

## Why this source matters

This source strengthens geographic and scientific-logistics relationships that were previously present only through commercial operator material or policy documents.

It is particularly useful for validating:

- Isla Rey Jorge / King George Island
- península de Fildes
- Villa Las Estrellas
- Base Presidente Eduardo Frei Montalva
- Aeródromo Teniente Rodolfo Marsh
- Base Científica Profesor Julio Escudero
- Glaciar Unión
- the broader Chilean Antarctic scientific-logistics platform network

## Key geographic relationships

### Península de Fildes and Isla Rey Jorge

INACH explicitly places the península de Fildes on Isla Rey Jorge and describes it as the sector with the greatest concentration of Antarctic bases and scientific installations.

This allows `peninsula_fildes -> located_on -> king_george_island` to be treated as an institutional geographic relationship rather than an inference from operator maps.

### Villa Las Estrellas

INACH describes Villa Las Estrellas as a Chilean population nucleus in the Fildes Peninsula / King George Island environment. The source also places it alongside other national and international Antarctic facilities.

This strengthens Villa Las Estrellas as a canonical settlement/place entity for Atlas, Antarctica Begins and the Travel Assistant.

### Base Frei and Teniente Marsh

The 2025 encyclopedia's Chile-Antarctica timeline records:

- Base Presidente Eduardo Frei Montalva inaugurated in 1969 on Isla Rey Jorge and functioning as an air base.
- Aeródromo Teniente Rodolfo Marsh inaugurated in 1980 on Isla Rey Jorge.
- Villa Las Estrellas inaugurated in 1984 next to Base Frei.
- INACH Base Profesor Julio Escudero inaugurated in 1995 on Isla Rey Jorge.

These facts should be kept separate from current operational status. Historical establishment is stable; current services and operational availability require current institutional verification.

### Punta Arenas → Glaciar Unión scientific-logistics network

INACH describes a Chilean network of scientific-logistics platforms extending more than 3,000 km from Punta Arenas to Glaciar Unión, supported by INACH, the Armed Forces, ANID and the regional government of Magallanes and Chilean Antarctica.

This independently reinforces the deep-field model already identified in FACH sources:

`Punta Arenas -> scientific/logistics gateway -> Glaciar Unión -> Antarctic interior`

The relationship is not a public transport route and must not be exposed as such by user-facing agents.

## Platform inventory extracted

The encyclopedia includes a map/list of Chilean Antarctic bases, refuges and infrastructure. Initial normalized entities include:

- Base Capitán Arturo Prat
- Base General Bernardo O'Higgins
- Base Luis Risopatrón
- Base Presidente Gabriel González Videla
- Refugio General Jorge Boonen Rivera
- Base Teniente Luis Carvajal
- Base Yelcho
- Refugio Comodoro Guesalaga
- Base Presidente Eduardo Frei Montalva
- Aeródromo Teniente Rodolfo Marsh
- Refugio Julio Ripamonti
- Base Guillermo Mann
- Base Profesor Julio Escudero
- Refugio Collins
- Base Glaciar Unión

The inventory is useful for entity discovery, but individual current operating status, seasonal/permanent use and administrative ownership should be separately normalized before user-facing publication.

## Cross-source convergence

### FACH + INACH

FACH documents actual air operations and deep-field capability. INACH provides scientific/geographic context and a broader platform network.

Together they support a stronger model:

- **FACH:** operational air mobility, SAR, deep-field deployments.
- **INACH:** science network, bases/platforms, geographic and historical context.
- **MINREL:** policy, strategy and planned infrastructure.
- **DAP / Antarctica21:** current first-party commercial/logistics products.

These sources should not be collapsed into a single authority class.

## Routing

| Project | Use |
|---|---|
| End of the World Atlas | canonical place/entity relationships |
| Antarctica Begins | gateway infrastructure and Antarctic access context |
| Austral Connectivity Observatory | scientific/logistics network and air infrastructure |
| Austral Intelligence Radar | monitor planned/current infrastructure and institutional activity |
| Antarctic Pulse | science/platform context |
| Travel Assistant | only safe, current visitor-facing facts after freshness verification |

## Technical status

- [x] Source catalogued
- [x] Key Fildes / King George relationships extracted
- [x] Base Frei / Marsh / Villa Las Estrellas history normalized
- [x] Scientific-logistics network concept extracted
- [x] Initial platform inventory normalized
- [ ] Normalize aliases and ownership
- [ ] Verify current permanent/seasonal status per facility
- [ ] Add DGAC/FACH current operational evidence for air infrastructure
- [ ] Generate semantic chunks
- [ ] Generate embeddings
