# Antarctica21 — Antarctic Air-Cruises 2027–2028

## Source status

- **Publisher:** Antarctica21
- **Source class:** first-party commercial / operator material
- **Season:** 2027–2028
- **Drive file ID:** `1i15c9sMaatxSZu1tdHcksK25NG6gMv9L`

Use this brochure as authoritative for Antarctica21's own published itineraries, product model, prices, vessels, expedition center and company claims. Do not treat it as independent evidence for general Antarctic governance or operator safety beyond what the company states.

## Core operating model

Antarctica21's main model is the **Antarctic air-cruise**:

`Punta Arenas -> flight to King George Island -> expedition vessel -> Antarctic Peninsula / South Shetland Islands -> return flight to Punta Arenas`

The company states a flight time of approximately two hours from Punta Arenas to Antarctica.

Its central commercial proposition is to avoid the conventional two-day Drake Passage sailing on its principal fly-and-cruise itineraries, reducing transit time and combining air access with a small expedition vessel.

## Punta Arenas as operational gateway

The brochure repeatedly describes **Punta Arenas as the Chilean gateway to Antarctica**. Day 1 of the main itineraries begins in Punta Arenas, with expedition preparation and a welcome event at Explorers House; Day 2 uses a scheduled flight to King George Island.

This is direct first-party operational evidence that complements the public-policy gateway framing already extracted from MINREL.

## Explorers House

Antarctica21 operates **Explorers House** in Punta Arenas as an expedition preparation center for briefings, welcome activities and pre-departure preparation.

For Austral Beacon this is relevant as a gateway-support entity: the Antarctic gateway is not only an airport or port, but also includes specialist expedition infrastructure in the city.

## 2027–2028 itineraries and published starting prices

| Itinerary | Duration | Published starting price |
|---|---:|---:|
| Classic Antarctica Air-Cruise | 8 days / 7 nights | USD 15,995 |
| Polar Circle Air-Cruise | 10 days / 9 nights | USD 24,995 |
| Antarctica & South Georgia Air-Cruise | 18 days / 17 nights | USD 17,995 |
| Antarctica Express Air-Cruise | 6 days / 5 nights | USD 5,995 |

These are seasonal first-party prices and must be treated as time-sensitive commercial data.

## Vessel layer

The brochure identifies:

- **Magellan Explorer**
- **Magellan Discoverer**

as expedition vessels used for air-cruise itineraries.

Antarctica21 states that its boutique ships carry a maximum of 76 guests. This supports a small-ship product model but remains an operator-published claim.

## Operator claims requiring explicit attribution

The brochure states that Antarctica21:

- pioneered the Antarctic air-cruise in 2003;
- has completed more than 300 fly-and-cruise expeditions;
- uses a single flight for all guests on an expedition;
- has priority over the flight window following a delay;
- is a member of IAATO;
- is an accredited provider company with PTGA;
- is CarbonNeutral certified.

These claims should always retain `first_party_operator_claim` provenance unless independently verified.

## DAP vs Antarctica21 — different layers of the Chilean gateway

The two operator corpora should not be collapsed into one entity.

### DAP

- aircraft and logistics operator;
- Full Day Antarctic product;
- cargo and passenger transport;
- medical evacuation;
- helicopters;
- maritime and ground logistics.

### Antarctica21

- expedition-tourism operator;
- fly-and-cruise product design;
- expedition vessels;
- multi-day Antarctic Peninsula itineraries;
- pre-expedition infrastructure in Punta Arenas.

The relationship is best modeled as a **gateway ecosystem**, not as interchangeable operators.

## Public-policy continuity

The 2020 National Antarctic Tourism Policy identified air-cruises, Punta Arenas, gateway infrastructure and public/private coordination as strategic themes. The 2026–2030 Strategic Antarctic Plan expands Magallanes as an Antarctic logistics and development hub.

DAP and Antarctica21 provide operator-level evidence that several of those capabilities are commercially instantiated from Punta Arenas.

However:

`policy objective != operator claim != verified implementation status`

These layers must remain separate in RAG.

## Project routing

| Project | Relevance |
|---|---|
| Antarctica Begins | Primary operational evidence for fly-and-cruise access from Chile |
| End of the World Travel | Product comparison and trip-planning context, with freshness checks |
| Austral Connectivity Observatory | Air-to-sea multimodal gateway model |
| Austral Intelligence Radar | Monitor products, ships, prices, departures and operational changes |
| End of the World Atlas | Punta Arenas–King George Island route and expedition geography |

## Technical status

- [x] Source classified
- [x] Air-cruise model normalized
- [x] Main itineraries normalized
- [x] Starting prices normalized
- [x] Core gateway entities identified
- [x] DAP vs Antarctica21 role distinction documented
- [ ] Extract full seasonal departure tables
- [ ] Normalize all inclusions/exclusions
- [ ] Normalize contingency-plan details
- [ ] Add exact page provenance to all commercial facts
- [ ] Generate semantic chunks
- [ ] Embeddings
