# Austral Beacon AI Lab

**Austral Beacon AI Lab is the canonical knowledge and AI infrastructure layer for Austral Beacon: a provenance-aware knowledge system for Southern Chile, Magallanes, Cape Horn and Chile's Antarctic gateway context.**

The repository combines knowledge engineering, source governance, RAG, agentic systems, editorial tooling and reusable data products. Its purpose is not only to store documents or experiments, but to transform verified evidence into structured knowledge that can be safely reused across websites, assistants, maps, dashboards, search systems and future applications.

## Mission

Build a durable, verifiable and reusable knowledge infrastructure for the extreme south of Chile, with particular attention to:

- Patagonia and Southern Chile
- Magallanes and Tierra del Fuego
- Puerto Williams and Puerto Toro
- Cape Horn / Cabo de Hornos
- Strait of Magellan and Beagle Channel
- Southern infrastructure and connectivity
- Antarctic science, logistics and gateway context
- Protected areas, communities, heritage, geography and history

Austral Beacon is documentary and evidence-first. It does not use AI as a substitute for primary sources, institutional evidence or expert context.

## Knowledge Architecture

The core pipeline is:

```text
PDF / map / official webpage / report / dataset
        ↓
source authority and provenance
        ↓
verifiable claims
        ↓
canonical entities + relationships
        ↓
MDX / JSON knowledge packages
        ↓
consumer-specific projections
        ↓
RAG / agents / websites / maps / dashboards / APIs
```

AI systems may extract, classify, relate and explain information, but they are not treated as factual sources.

## Canonical Knowledge Base

`knowledge-base/` is the durable canonical knowledge layer for Austral Beacon.

A mature entity normally exposes:

```text
<slug>.mdx
<slug>/metadata.json
<slug>/sources.json
<slug>/claims.json
<slug>/relationships.json
<slug>/chunks.json
```

Canonical knowledge must preserve:

- entity identity
- claim-level provenance
- approved source IDs
- verification state
- sensitivity / freshness
- relationship provenance
- authorized retrieval scope

The normal promotion lifecycle is:

```text
candidate → verified / sourced → canonical
```

Candidate targets, disputed material and operational facts must never be silently promoted to canonical public truth.

See `knowledge-base/README.md` and `knowledge-base/ENTITY_TAXONOMY.md` for the governing contracts.

## Provenance and Claim-Level Verification

Austral Beacon uses a **provenance-aware knowledge architecture with claim-level verification**.

A published fact should be traceable to:

```text
claim_id
  + source_ids
  + verification state
  + sensitivity / freshness
  + consumer projection
```

This is intentionally stricter than placing a bibliography at the end of a page. Provenance determines what a consumer is allowed to publish or retrieve.

## Governance Scopes

Knowledge is separated by intended use and risk:

- `public_core` — stable verified geography, science, heritage, tourism context and administrative facts suitable for public consumers.
- `operational_dynamic` — routes, schedules, access, weather, navigation, infrastructure state and other information requiring current verification.
- `restricted_context` — treaty interpretation, disputes, sovereignty arguments, legal interpretation and sensitive geopolitical or strategic context.
- `internal_research` — unvalidated research notes, hypotheses and analytical material not ready for public retrieval.

A public travel product must not silently consume operational or restricted material as stable fact.

## Entity Taxonomy

The canonical taxonomy uses durable semantic roots rather than product-specific folders. Current or governed roots include:

```text
knowledge-base/entities/
├── places/
├── jurisdictions/
├── geography/
├── hydrology/
├── ecosystems/
├── protected-areas/
├── biodiversity/
├── communities/
├── heritage/
├── history/
├── science/
├── institutions/
├── infrastructure/
└── routes/
```

Fine-grained meaning belongs in `entity_type`, claims and relationships rather than in an ever-growing folder taxonomy.

## Projection and Consumer Model

Products do not own separate canonical truth.

They consume approved projections derived from the knowledge base:

```text
knowledge-base/
      ↓
consumer projection
      ↓
End of the World Travel
End of the World Atlas
Travel Assistant
Antarctic Pulse
Antarctica Begins
Austral Intelligence Radar
Observatorio de Conectividad Austral
future APIs and agents
```

`data/`, retrieval corpora, application payloads and website content are downstream artifacts. They must not silently replace `knowledge-base/` as the source of truth.

## Main Consumers and Projects

### End of the World Travel

Documentary travel and geographic publication focused on Southern Chile. It consumes approved public projections rather than maintaining an independent factual knowledge base.

### End of the World Travel Assistant

Agent application under `projects/end-of-the-world-travel-agent/`. The architecture separates stable knowledge from dynamic operational information and treats RAG as a governed retrieval layer.

### End of the World Atlas

Cartographic and documentary consumer for geographic entities, routes, administrative context and related knowledge layers.

### Antarctic Pulse

Science and polar-context consumer. Shared Antarctic projections allow scientific context to be reused without duplicating canonical entities.

### Antarctica Begins

Gateway and access-context consumer for Chilean Antarctic geography, infrastructure and verified commercial-access context.

### Austral Intelligence Radar / Austral Dispatch

Editorial intelligence workflows for monitoring, classification, verification and preparation of southern and Antarctic developments.

## Bilingual Knowledge Presentation

Austral Beacon supports bilingual presentation without duplicating factual truth.

The intended model is:

```text
Chilean source / approved evidence
        ↓
canonical claim + provenance
        ↓
approved projection
        ↓
locale presentation
   ├── es-CL — formal Chilean documentary Spanish
   └── en    — controlled international English
```

Both languages must preserve the same underlying claim IDs, source IDs, relationships, verification state and sensitivity.

For `es-CL`, terminology should remain precise and consistent with competent Chilean institutional usage, especially for concepts such as Región, Provincia, Comuna, localidad, poblado, aeródromo, infraestructura portuaria, área protegida and conectividad.

Translation may change wording. It must not strengthen or expand the factual claim.

## Source Authority Policy

Priority is given to authoritative and directly relevant evidence, especially Chilean institutional sources where the subject concerns Chilean geography, administration, infrastructure, science, conservation or public policy.

Typical high-priority sources include:

- DIRECTEMAR / Armada de Chile / SHOA
- INACH
- MOP and its technical directorates
- DGAC
- SERNATUR
- CONAF
- BCN
- INE
- Ministerio del Medio Ambiente
- SUBDERE and regional / municipal institutions
- Chilean universities and scientific institutions
- primary technical reports, official maps and approved datasets

Promotional or operator sources may support claims about their own products or services, but they do not automatically establish independent market, traffic or comparative facts.

## Repository Structure

```text
austral-beacon-ai-lab/
├── README.md
├── ROADMAP.md
├── AGENTS.md
├── BRAND_GUIDELINES.md
├── WORKFLOWS.md
├── RAG_SOURCES.md
├── knowledge-base/       # canonical entities, claims, sources, relations, audits, projections
│   ├── entities/
│   ├── projections/
│   ├── audits/
│   └── research/
├── projects/             # product / agent implementations
│   ├── atlas/
│   └── end-of-the-world-travel-agent/
├── rag/                  # retrieval and processing layers derived from source material
├── data/                 # generated / operational / evaluation / consumer artifacts
├── apps/                 # application surfaces and dashboards
├── docs/                 # architecture, research and project documentation
├── prompts/              # reusable prompt assets
└── workflows/            # automation and processing workflows
```

## What This Repository Is Not

Austral Beacon AI Lab is not:

- a dumping ground for PDFs without processing;
- a second copy of every product website;
- an AI-generated source of truth;
- a place where interpretation silently replaces evidence;
- a single RAG corpus with no distinction between stable, dynamic and restricted knowledge;
- a system that publishes automatically without review.

The goal is to preserve evidence, context, uncertainty and provenance while making knowledge reusable.

## Current Development Direction

Current work is focused on:

- expanding and auditing the canonical entity graph;
- strengthening claim-level provenance and projection contracts;
- integrating knowledge projections into End of the World Travel;
- developing the Travel Assistant as a governed RAG/agent consumer;
- reusing shared Antarctic gateway knowledge across products;
- building bilingual `en` / `es-CL` presentation layers;
- separating stable geographic knowledge from live operational verification;
- preparing future automation for ingestion, monitoring and editorial intelligence.

## Learning and Applied Research

The repository also records practical learning from AI, RAG, agent and software-development programs, including Alura ONE, n8n, LangChain, Kiro, AWS, Codex, Gemini and related development workflows.

Training is treated as applied research: useful techniques are incorporated only when they improve the reliability, traceability or reusability of the Austral Beacon system.

## Long-Term Vision

Build an AI-ready documentary knowledge infrastructure for Southern Chile and Chile's Antarctic gateway context that can support trustworthy publications, maps, agents, search systems, research tools and future public applications without losing connection to the original evidence.
