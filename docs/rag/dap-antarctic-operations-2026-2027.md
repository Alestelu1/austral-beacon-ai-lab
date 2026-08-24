# Aerovías DAP — Antarctic Operations 2026–2027

## Source status

This extraction combines three first-party DAP documents from the Drive corpus:

- `DAP-Antarctic-Logistic-Services.pdf`
- `DAP-Antartica_Briefing-ES_2026.pdf`
- `Rate-2026_2027.pdf`

**Source class:** first-party commercial / operator material.

Use these documents as authoritative for DAP's own published products, fleet descriptions, schedules, operational conditions and prices. Do not use them as the sole authority for general Antarctic governance, independent safety assessment or geopolitical claims.

## Operational capability layers

### Air

DAP publishes a Punta Arenas–King George Island air bridge using BAe/RJ aircraft. Its briefing states that Antarctic configuration uses 70 passengers and that the flight takes approximately two hours depending on weather. The logistics brochure also publishes 7,200 kg maximum cargo capacity for the BAe/RJ fleet.

DAP also presents the Beechcraft King Air 300 for lighter operations and emergency medical transport, with six-passenger capacity, 960 kg maximum cargo and an operator-published Punta Arenas–King George Island time of approximately 2.5 hours.

### Emergency medical evacuation

DAP's logistics material describes an Emergency Medical Service from Antarctica to Punta Arenas, combining helicopter and aircraft when necessary.

This is relevant to the SAR / emergency-response layer of the Austral Connectivity Observatory, but it should not be confused with the State's official SAR responsibility.

### Maritime

DAP lists the vessel **Betanzos** for Antarctic logistics and scientific/logistics support. Operator-published features include a reinforced hull for ice, capacity to carry helicopters and containers, and 1,261 m³ maximum storage.

The operator also lists a **Zodiac MK5** for short-range Antarctic island movements, with a claimed capacity of up to 12 passengers or more than two tons of load.

### Land

On King George Island, DAP describes a land-logistics layer using Hagglunds vehicles, trucks, snowmobiles and rapid camp setups.

This is important because DAP is not just an airline in the corpus: it represents a multimodal Antarctic logistics stack:

`air + helicopter + maritime + ground + medical evacuation`

## Full Day Antártica — 2026–2027

DAP's published 2026–2027 rate sheet lists **USD 7,060 per person**, including the air fee.

Published dates:

- 4 December 2026
- 18 December 2026
- 6 January 2027
- 19 January 2027
- 9 February 2027
- 18 February 2027
- 4 March 2027
- 16 March 2027

The briefing describes a flight from Punta Arenas to King George Island, followed by an Antarctic visit of approximately five hours before returning to Punta Arenas.

The package published in the briefing includes four nights in Punta Arenas, round-trip Antarctic flights, transfers and alternative activities in Punta Arenas while waiting for flight conditions. Insurance is not included.

## Weather as a first-class operational constraint

DAP explicitly states that the program and all activities are subject to weather conditions. According to the briefing:

- the captain makes the final flight decision;
- meteorological reports are provided by the Antarctic Meteorological Center / DGAC;
- the departure time may only be determined the night before;
- specific visits on King George Island may be changed according to local conditions.

For RAG and Travel Assistant purposes, this should be represented as structured uncertainty, not hidden in prose.

Example:

```json
{
  "availability_type": "weather_contingent",
  "schedule_guarantee": false,
  "operational_dependency": ["weather", "visibility", "wind", "runway_conditions"],
  "final_go_no_go_authority": "flight_captain"
}
```

## Relationship to the 2020 policy and 2026–2030 plan

DAP provides concrete operator evidence for several capabilities described in the public-policy corpus:

| Public-policy layer | DAP operational evidence |
|---|---|
| Punta Arenas as Antarctic gateway | Direct Punta Arenas–King George Island product/logistics operations |
| Aero-cruise / air access | Dedicated Antarctic air operations |
| Teniente Marsh as connectivity asset | King George Island air operations depend on Antarctic airfield access |
| SAR / emergency capability | DAP publishes medical-evacuation capability |
| Magallanes logistics platform | DAP's Antarctic operations are organized from Punta Arenas |
| Public/private Antarctic capability | DAP demonstrates a private multimodal logistics layer |

The distinction must remain explicit: public policy establishes national objectives; DAP documents one operator's commercial and logistics capabilities.

## High-value entities

- Aerovías DAP
- Punta Arenas
- King George Island / Isla Rey Jorge
- Aeródromo Teniente Marsh
- Base Frei
- Villa Las Estrellas
- BAe 146-200 / RJ100
- Beechcraft King Air 300
- Betanzos
- Zodiac MK5
- Hagglunds
- DGAC / Antarctic Meteorological Center

## Project routing

| Project | Relevance |
|---|---|
| Antarctica Begins | Direct Chilean air-access and gateway evidence |
| End of the World Travel | Current product structure, with freshness checks before publication |
| Austral Connectivity Observatory | Air, maritime, ground and emergency connectivity |
| Austral Intelligence Radar | Monitor prices, dates, fleet, product changes and new capabilities |
| Antarctic Pulse | Logistics context only when relevant to science/operations |

## Freshness rule

Pricing and departure dates are volatile. The 2026–2027 rate sheet is valid evidence for that published season, but any live recommendation must re-check a current first-party source before publication or booking guidance.

## Technical status

- [x] Three DAP sources grouped
- [x] Source authority scoped correctly
- [x] Air capability normalized
- [x] Maritime capability normalized
- [x] Ground capability normalized
- [x] EMS capability normalized
- [x] Full Day 2026–2027 price normalized
- [x] Published departure dates normalized
- [x] Weather dependency normalized
- [x] Policy-to-operator relationship documented
- [ ] Exact page provenance across briefing sections
- [ ] Compare against Antarctica21 2027–2028 material
- [ ] Generate operational semantic chunks
- [ ] Embeddings
