# Atlas geospatial provenance policy

## Purpose

Define how Austral Beacon promotes a place, road, crossing, waterway or protected area from documentary knowledge into Atlas-ready geospatial data.

## Core rule

A place name is not enough to publish a canonical coordinate. Every geometry must retain provenance.

Required fields before `atlas_ready: true`:

- canonical entity ID
- geometry type (`Point`, `LineString`, `MultiLineString`, `Polygon`, `MultiPolygon`)
- coordinates/geometry
- original source institution
- source dataset/layer name
- original CRS or reference system
- transformation applied, if any
- retrieval date
- geographic/admin scope
- verification status

## Preferred source order

1. IDE Chile / SNIT datasets that preserve the originating public institution.
2. Instituto Geográfico Militar for authoritative cartographic/geodetic context.
3. MOP for road geometry and road-project segments.
4. CONAF / official protected-area geospatial layers for park boundaries.
5. DIRECTEMAR / SHOA for maritime infrastructure or hydrographic context when appropriate.
6. Regional or municipal official layers when no higher-authority dataset covers the entity.

Commercial maps, search-engine map pins, Wikipedia coordinates and AI-generated coordinates may be used for discovery only, not as canonical Atlas geometry.

## Reference-system rule

IDE Chile documents SIRGAS as the modern reference system used by IGM. The canonical layer may expose WGS84-compatible latitude/longitude for web use only after the source CRS and any transformation are recorded. Never silently convert or round coordinates without provenance.

## Geometry by entity type

| Entity type | Preferred geometry |
|---|---|
| city / settlement | Point or official urban polygon when justified |
| ferry terminal / border crossing | Point |
| road | LineString / MultiLineString |
| road project | Segmented LineString with construction status per segment |
| maritime crossing | LineString plus endpoint nodes |
| protected area | Polygon / MultiPolygon |
| island | Polygon / MultiPolygon |
| waterway | LineString or polygon depending on source model |

## Administrative hierarchy

Administrative containment is stored independently from geometry. A place can therefore have a verified `region/province/commune` hierarchy while its canonical point remains pending.

This prevents a common failure mode: using a convenient web-map point to infer jurisdiction.

## Dynamic information exclusion

The geometry layer must not contain current ferry schedules, border opening hours, ticket prices, park opening hours, waiting times or road-condition claims. Those belong in retrieval/verification layers with freshness metadata.

## Current Batch 02 status

The southern Magallanes entity set now contains verified administrative hierarchy for the main urban/settlement nodes where evidence is sufficient. Exact canonical coordinates and route geometries remain intentionally pending until authoritative layers from IDE Chile/IGM/MOP/CONAF are captured with CRS metadata.

`atlas_ready` remains false for geometry-dependent publication until that work is complete.
