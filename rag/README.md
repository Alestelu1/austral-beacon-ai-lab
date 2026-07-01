# Austral Beacon RAG Document Library

This directory stores source material and processing outputs for future RAG systems, AI agents, editorial research and knowledge bases across Austral Beacon Media.

## Directory Map

```text
rag/
├── raw-documents/      # Original PDFs, brochures, maps and source files
├── processed/          # Extracted text, cleaned markdown and structured notes
├── metadata/           # JSON/YAML metadata records for each source
├── embeddings/         # Vector-ready outputs or references, not necessarily committed
└── entities/           # Extracted places, routes, organizations and concepts
```

## Source Policy

Prioritize Chilean institutional, academic and regional sources when available.

Important source families:

- SERNATUR / Chile es TUYO.
- CONAF.
- INACH.
- Armada de Chile.
- INE Chile.
- Instituto Geográfico Militar.
- Gobierno Regional de Magallanes.
- Municipalidad de Cabo de Hornos.
- Universities and regional research institutions.

## Upload Rule

Keep original PDF files in `raw-documents/` and create a metadata record in `metadata/` when the document is important enough for extraction.

PDF files should not be rewritten or renamed casually after upload. Preserve source names when possible and use clear, lowercase filenames when renaming is necessary.
