# DAP vs Antarctica21 — operational comparison

## Purpose

This document separates two different layers of the Chilean Antarctic gateway ecosystem:

- **DAP** as an aviation/logistics operator with passenger, cargo, medevac, helicopter, maritime and land capabilities, plus a Full Day Antarctica tourism product.
- **Antarctica21** as an expedition operator centered on multi-day Antarctic air-cruises that combine a flight from Punta Arenas to King George Island with expedition-vessel operations.

The comparison is based only on the first-party documents normalized in this branch. It must not be used to infer current facts that are not explicitly supported by those sources.

## Core distinction

| Dimension | DAP | Antarctica21 |
|---|---|---|
| Main role | Air/logistics operator | Expedition operator |
| Chilean gateway | Punta Arenas | Punta Arenas |
| Air sector | Punta Arenas ↔ King George Island | Punta Arenas ↔ King George Island |
| Main tourism format | Full Day Antarctica | Multi-day fly-and-cruise |
| Logistics | Air, cargo, helicopter, ship, Zodiac, land vehicles, camp, EMS | Expedition-specific air/sea operations |
| Medical evacuation | Explicitly offered/documented | Not normalized as standalone service |
| Maritime layer | Betanzos + Zodiac MK5 | Magellan Explorer + Magellan Discoverer |
| Product duration | Approx. five hours on King George Island plus flights | 6–18 days depending itinerary |
| Seasonal price evidence | USD 7,060 Full Day, 2026–27 | USD 5,995–24,995 starting prices, 2027–28 |

## DAP operational layer

The DAP logistics brochure describes a multimodal capability, including:

- BAe/RJ aircraft between Punta Arenas and King George Island;
- Beechcraft King Air 300;
- AS355 F2 and BO-105 helicopters;
- Betanzos vessel;
- Zodiac MK5;
- Hagglunds vehicles;
- trucks and snowmobiles;
- temporary Antarctic camp setup;
- emergency medical transport from Antarctica to Punta Arenas.

The 2026 visitor briefing separately documents its Full Day Antarctica product, with a Punta Arenas departure, King George Island visit and return to Punta Arenas. The source explicitly stresses weather dependency and operational discretion.

The 2026–27 rate sheet lists the Full Day product at USD 7,060 per person, including the air fee. This value is season-bound and should never be surfaced as an evergreen price.

## Antarctica21 expedition layer

The Antarctica21 2027–28 brochure documents the air-cruise model as a two-stage product:

1. fly from Punta Arenas to King George Island;
2. board an expedition vessel and explore the Antarctic Peninsula / South Shetland Islands.

The brochure lists four product families:

- Classic Antarctica Air-Cruise — 8 days / 7 nights — from USD 15,995;
- Polar Circle Air-Cruise — 10 days / 9 nights — from USD 24,995;
- Antarctica & South Georgia Air-Cruise — 18 days / 17 nights — from USD 17,995;
- Antarctica Express Air-Cruise — 6 days / 5 nights — from USD 5,995.

It also documents Explorers House in Punta Arenas as a pre-expedition facility and identifies Antarctica21 as an IAATO member.

## RAG modelling rules

### 1. Separate operator role from product

Do not model DAP and Antarctica21 as two interchangeable tour companies.

Preferred entity pattern:

```text
DAP
├── role → aviation_operator
├── role → logistics_operator
├── product → full_day_antarctica
├── capability → medevac
├── capability → cargo
├── capability → maritime_logistics
└── capability → land_logistics

Antarctica21
├── role → expedition_operator
├── product → classic_air_cruise
├── product → polar_circle_air_cruise
├── product → south_georgia_air_cruise
└── product → antarctica_express
```

### 2. Model common gateway infrastructure separately

Both operators depend on a common gateway graph centered on Punta Arenas and King George Island. The Knowledge Layer should therefore keep gateway entities independent of any individual operator.

```text
Punta Arenas
   ├── gateway_to → Antarctica
   ├── departure_point_for → DAP Antarctic flights
   └── departure_point_for → Antarctica21 air-cruises

King George Island
   ├── arrival_point_for → Antarctic flights
   ├── supports → Full Day tourism
   └── embarkation_point_for → Antarctic air-cruise vessels
```

### 3. Prices require temporal metadata

Every price must include:

- operator;
- product;
- season;
- currency;
- amount;
- whether it is a list price or a starting price;
- inclusions if stated;
- original source document;
- retrieval/document date.

A price without season/freshness metadata must not be used by the Travel Assistant.

### 4. Weather-sensitive operations

Both product families are weather dependent. The Travel Assistant must avoid language that implies guaranteed departure, guaranteed landing or fixed Antarctic timing.

### 5. First-party claims vs institutional facts

DAP and Antarctica21 are authoritative for their own products, fleets and advertised services. They are not canonical sources for geopolitical, regulatory or general Antarctic claims.

For policy, environmental rules and governance, prefer MINREL, INACH and Antarctic Treaty System sources.

## Product-selection logic for the Travel Assistant

The comparison enables a simple future routing layer:

```text
user intent: short Antarctic visit
→ consider Full Day-type product
→ verify current DAP season, dates, price and availability

user intent: multi-day expedition without sailing the Drake both ways
→ consider air-cruise products
→ verify current Antarctica21 itinerary, season, vessel, price and availability

user intent: scientific/logistics/cargo/medevac
→ tourism product comparison is inappropriate
→ route to DAP logistics capability records or institutional/logistics sources
```

This is routing logic, not a recommendation ranking.

## Strategic implication for Austral Beacon

The sources show that the Chilean Antarctic gateway is a layered ecosystem rather than a single tourism route:

**Punta Arenas → aviation/logistics → King George Island → tourism / expedition / research / cargo / emergency operations.**

This structure is reusable by:

- Antarctica Begins;
- End of the World Travel Assistant;
- Austral Connectivity Observatory;
- Austral Intelligence Radar;
- End of the World Atlas.

## Files

Structured comparison:

`data/analysis/dap-vs-antarctica21-operational-comparison.csv`

Canonical source records:

- `data/sources/dap-antarctic-operations-2026-2027.json`
- `data/sources/antarctica21-air-cruises-2027-2028.json`

## Next step

Build a reusable **gateway capability graph** that separates:

- gateway places;
- infrastructure;
- operators;
- routes;
- transport modes;
- products;
- logistics capabilities;
- emergency capabilities;
- policy relationships;
- temporal/freshness metadata.
