# End of the World Atlas — Entity Graph

## Purpose

This document defines the first structured entity graph for the End of the World Atlas Knowledge Base.

It is designed to support:

- SEO architecture
- Internal linking
- RAG retrieval
- AI agents
- Map-based navigation
- Antarctic Pulse dashboards
- Antarctica Begins gateway logic

## Strategic Principle

End of the World Atlas is not only a website. It is a structured geographic knowledge base for Patagonia, Tierra del Fuego, Cape Horn and Antarctica.

The website, RAG systems, dashboards, agents and editorial content should all consume the same entity graph.

## Main Geographic Corridor

```text
Punta Arenas
→ Estrecho de Magallanes
→ Puerto Williams
→ Canal Beagle
→ Cabo de Hornos
→ Islas Diego Ramírez
→ Pasaje Drake
→ Península Antártica
```

## Chilean Antarctic Node

```text
Península Antártica
→ Bahía Fildes
→ Base Presidente Frei
→ Villa Las Estrellas
→ Base Profesor Escudero
```

## Entity Groups

### Gateways

- Punta Arenas
- Puerto Williams
- Bahía Fildes

### Maritime Routes

- Estrecho de Magallanes
- Canal Beagle
- Pasaje Drake

### Geographic Landmarks

- Cabo de Hornos
- Islas Diego Ramírez
- Península Antártica

### Antarctic Infrastructure

- Bahía Fildes
- Base Presidente Eduardo Frei Montalva
- Villa Las Estrellas
- Base Profesor Julio Escudero

## Priority Entities

### Priority 1

- Punta Arenas
- Estrecho de Magallanes
- Puerto Williams
- Canal Beagle
- Cabo de Hornos
- Pasaje Drake
- Península Antártica
- Bahía Fildes
- Base Frei
- Villa Las Estrellas

### Priority 2

- Islas Diego Ramírez
- Base Escudero
- Isla Navarino
- Parque Nacional Cabo de Hornos
- Parque Nacional Yendegaia
- Ruta Vicuña–Yendegaia

### Priority 3

- Punta Dungeness
- Cabo Espíritu Santo
- Seno Almirantazgo
- Mar de Scotia

## Core Relationship Logic

### Punta Arenas

Role: Main logistical gateway of Chilean Patagonia.

Related entities:

- Estrecho de Magallanes
- Puerto Williams
- Pasaje Drake
- Península Antártica
- Bahía Fildes
- Base Frei
- Villa Las Estrellas

### Estrecho de Magallanes

Role: Main maritime corridor connecting the Atlantic and Pacific through Chilean Patagonia.

Related entities:

- Punta Arenas
- Punta Dungeness
- Cabo Espíritu Santo
- Puerto Williams
- Canal Beagle
- Pasaje Drake

### Puerto Williams

Role: Southern gateway connected to Isla Navarino, Canal Beagle, Cape Horn and Antarctic route narratives.

Related entities:

- Canal Beagle
- Cabo de Hornos
- Punta Arenas
- Isla Navarino
- Pasaje Drake

### Canal Beagle

Role: Southern maritime corridor connecting Tierra del Fuego, Isla Navarino, Puerto Williams and routes toward Cape Horn.

Related entities:

- Puerto Williams
- Isla Navarino
- Cabo de Hornos
- Punta Arenas

### Cabo de Hornos

Role: Major maritime landmark and transition point toward the Drake Passage.

Related entities:

- Puerto Williams
- Canal Beagle
- Islas Diego Ramírez
- Pasaje Drake

### Islas Diego Ramírez

Role: Advanced oceanic observation node southwest of Cape Horn.

Related entities:

- Cabo de Hornos
- Pasaje Drake

### Pasaje Drake

Role: Main oceanic route between southern South America and the Antarctic Peninsula.

Related entities:

- Cabo de Hornos
- Islas Diego Ramírez
- Península Antártica
- Mar de Scotia
- Puerto Williams
- Punta Arenas

### Península Antártica

Role: Main scientific and logistical region of Antarctica connected to South American gateways.

Related entities:

- Pasaje Drake
- Mar de Scotia
- Bahía Fildes
- Base Frei
- Villa Las Estrellas
- Punta Arenas
- Puerto Williams

### Bahía Fildes

Role: Advanced Antarctic logistics and science node on King George Island.

Related entities:

- Península Antártica
- Base Frei
- Villa Las Estrellas
- Base Escudero
- Punta Arenas
- Puerto Williams

### Base Presidente Frei

Role: Chilean air and logistics infrastructure node in Bahía Fildes.

Related entities:

- Bahía Fildes
- Villa Las Estrellas
- Base Escudero
- Península Antártica
- Punta Arenas
- Pasaje Drake

### Villa Las Estrellas

Role: Civil and community dimension of the Chilean Antarctic node.

Related entities:

- Base Frei
- Bahía Fildes
- Base Escudero
- Península Antártica
- Punta Arenas
- Pasaje Drake

### Base Profesor Escudero

Role: Scientific research component of the Chilean Antarctic node.

Related entities:

- Bahía Fildes
- Base Frei
- Villa Las Estrellas
- Península Antártica
- Punta Arenas
- Pasaje Drake

## RAG Use Cases

This graph should support questions such as:

- What is the route from Punta Arenas to the Antarctic Peninsula?
- How are Puerto Williams and Cape Horn connected?
- What role does Bahía Fildes play in Chilean Antarctic logistics?
- How do Base Frei, Villa Las Estrellas and Base Escudero differ?
- Which entities form the Chilean Antarctic node?

## Maintenance Notes

- Entity IDs should match `projects/atlas/data/entities.json`.
- MDX files should use the same IDs in `related_entities`.
- This graph should be updated whenever new entities are added.
- Use careful Antarctic Treaty language for Antarctic entities.
