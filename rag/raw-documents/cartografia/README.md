# Cartografía — Raw Documents

Store official maps and cartographic documents here before extraction.

Maps are treated as a separate source type because they are especially useful for entity extraction, route context, geographic relationships, toponymy and future atlas pages.

## Suggested Subfolders

```text
cartografia/
├── sernatur/
├── igm/
├── mapas-provinciales/
├── mapas-turisticos/
├── mapas-historicos/
├── cartas-nauticas/
└── rutas-y-conectividad/
```

## Priority Uses

- End of the World Atlas entities.
- End of the World Travel route and destination guides.
- Antarctica Begins gateway maps and access narratives.
- RAG pipelines for geographic lookup.
- Future map-based agents and dashboards.

## Metadata Reminder

Every important map should later receive a metadata record in `rag/metadata/`, preserving:

- Original title.
- Source URL.
- Publisher.
- Date if available.
- Geographic coverage.
- Map type.
- Related places, routes and protected areas.
- Usage or license notes.
