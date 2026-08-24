# Southern Magallanes territorial knowledge model

## Purpose

This model promotes travel-retrieval facts into reusable canonical entities and source-scoped graph relationships for Tierra del Fuego, Isla Navarino and the southern protected-area system.

It is intended for End of the World Atlas, End of the World Travel Assistant, Austral Connectivity Observatory and Austral Intelligence Radar.

## Core distinction

A place, route or infrastructure node can be canonically stable while its travel usability is dynamic.

Examples:

- Puerto Navarino is a stable place entity; the availability of an international passenger connection is not stable.
- Ruta Y-905 is a stable road entity; its condition after precipitation is dynamic.
- Primera Angostura is a stable crossing entity; ferry status and waiting conditions are dynamic.
- Paso Bellavista is a stable border-crossing entity; its seasonal opening is dynamic.
- Vicuña–Yendegaia is a real road project; that does not make it a completed public route to Puerto Williams.

## Canonical territorial layers

### Tierra del Fuego

- Porvenir
- Cerro Sombrero
- Punta Delgada / Bahía Azul / Primera Angostura
- Paso San Sebastián / Ruta Y-71
- Paso Bellavista / Ruta Y-85
- Vicuña–Yendegaia / Caleta 2 de Mayo
- Parque Nacional Yendegaia

### Isla Navarino

- Puerto Williams
- Ruta Y-905
- Puerto Navarino
- Puerto Toro

### Southern maritime protected areas

- Parque Nacional Alberto de Agostini
- Parque Nacional Cabo de Hornos
- Canal Beagle

## Graph federation

`puerto_williams` intentionally uses the same canonical ID used by the Antarctic gateway graph.

This allows controlled federation:

`Southern Magallanes graph -> Puerto Williams -> Antarctic gateway graph`

The shared ID does **not** mean that relationships can be copied between domains. For example, Puerto Williams being an Antarctic gateway in policy does not prove a current commercial Antarctic air route; similarly, its role as a Navarino service node does not imply scheduled access to every nearby protected area.

## Relationship rules

1. Geographic containment and road connectivity require explicit institutional or authoritative territorial evidence.
2. Current transport services require first-party or institutional freshness verification.
3. Infrastructure authorization does not establish service frequency.
4. Subsidized isolated-zone transport must not be converted into a tourism product.
5. Road projects under construction must remain project nodes rather than completed-route edges.
6. Protected-area access and visitor infrastructure are separate properties.

## Atlas implications

The Atlas can now create entity pages or structured records for Porvenir, Cerro Sombrero, Primera Angostura, San Sebastián, Bellavista, Ruta Y-85, Ruta Y-905 and Puerto Navarino without mixing them with volatile timetable data.

Travel-specific information such as ferry departures, border opening hours, road conditions and park opening status should remain in retrieval/verification layers and be refreshed independently.

## Next normalization targets

- explicit municipality/province containment for each settlement and protected area;
- authoritative coordinates from Chilean geographic/institutional sources;
- road segment geometry and route hierarchy;
- current bridge/ferry/port infrastructure nodes;
- controlled links to Puerto Toro, Cabo de Hornos, Yendegaia and future Atlas MDX entities.
