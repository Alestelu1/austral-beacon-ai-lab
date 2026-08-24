# External AI Verification Protocol

## Purpose

This protocol defines how Austral Beacon may use external AI systems such as Gemini or Perplexity to verify freshness, discover new sources, detect contradictions, and review claims already present in the canonical Knowledge Layer.

External AI output is **not** canonical evidence by itself. The canonical evidence remains the original source: institutional documents, first-party operator publications, academic publications, official datasets, or other explicitly classified sources.

## Core rule

**AI result -> source discovery -> primary-source review -> canonical update**

Never use:

**AI result -> canonical fact**

without reviewing the underlying source.

## When external verification is recommended

Use external verification for claims with meaningful freshness risk, including:

- current air routes and frequencies;
- current maritime services;
- current prices, seasons and availability;
- operator activity;
- infrastructure completion or opening;
- project implementation status;
- regulatory changes;
- current public access conditions;
- current Antarctic tourism products;
- current airport, port or road status;
- official announcements that could materially change a previously stored fact.

For stable geography or well-established historical facts, verification is normally unnecessary unless sources conflict.

## Verification statuses

Every verification task should end in exactly one of these statuses:

- `confirmed`: current evidence supports the stored claim.
- `confirmed_with_scope_change`: the claim is broadly correct but requires temporal, geographic, operational or legal qualification.
- `changed`: a newer reliable source shows that the situation changed.
- `contradicted`: a reliable source directly conflicts with the stored claim.
- `insufficient_evidence`: available evidence is not strong enough to confirm or reject the claim.
- `source_unavailable`: a potentially relevant source is referenced but cannot be inspected.

## Source priority

Prefer, in order when appropriate:

1. Chilean institutional / regulatory / public authority sources.
2. Original first-party operator or organization sources for their own products and operations.
3. Academic or scientific primary/authoritative sources.
4. Regional institutional sources.
5. Specialist secondary sources.
6. General news or media as discovery/context, not automatically as canonical truth.
7. Social posts only as leads unless the account is an official first-party source and the claim is inherently an announcement from that account.

External AI summaries never outrank the underlying source.

## Required verification record

Each verification result should preserve:

```json
{
  "claim_id": "...",
  "claim": "...",
  "verification_status": "confirmed | confirmed_with_scope_change | changed | contradicted | insufficient_evidence | source_unavailable",
  "checked_at": "YYYY-MM-DD",
  "verification_agent": "gemini | perplexity | other",
  "primary_source_url": "...",
  "primary_source_title": "...",
  "source_publisher": "...",
  "source_date": "YYYY-MM-DD | YYYY | unknown",
  "source_class": "institutional | first_party | academic | regional | specialist_secondary | media | social",
  "evidence_summary": "...",
  "canonical_action": "none | qualify | update | deprecate | add_new_fact | manual_review",
  "freshness_class": "stable | annual | seasonal | monthly | volatile",
  "next_review": "YYYY-MM-DD | event_triggered | not_required",
  "notes": "..."
}
```

## Rules for dynamic claims

### Routes, schedules and transport

Never treat an old timetable, brochure or article as proof of a current route.

Require, where possible:

- operator or authority source;
- explicit current season/date;
- origin and destination;
- operating status;
- distinction between scheduled, charter, expedition, military, scientific or logistics operation.

### Prices

Always preserve:

- amount;
- currency;
- price type;
- season / validity window;
- source;
- date checked.

Never overwrite historical prices; version them.

### Planned infrastructure

Distinguish:

`announced -> planned -> funded -> tendered -> under construction -> inaugurated -> operational`

A strategic plan is evidence of planning, not completion.

### Gateway status

Separate:

- political or strategic recognition;
- physical infrastructure;
- logistics capability;
- current commercial service;
- tourism product availability.

A city may be recognized as an Antarctic gateway without currently offering a specific commercial Antarctic route.

## Workflow

1. Select a canonical claim with freshness or contradiction risk.
2. Give the external AI the exact claim and current evidence context.
3. Require recent source discovery and explicit citations/URLs.
4. Ask the external AI to distinguish source fact from inference.
5. Inspect the underlying primary source manually or with Austral Beacon tooling.
6. Assign a verification status.
7. Update the canonical JSON only if the underlying evidence supports the change.
8. Preserve previous values when the fact is temporal.
9. Add or update retrieval chunks only after canonical review.
10. Re-run relevant RAG QA tests.

## Human review requirement

External AI may propose a change but must not autonomously publish consequential factual changes to Austral Beacon properties.

Human review is required before:

- changing canonical facts;
- declaring infrastructure operational;
- publishing current route or price information;
- changing legal/regulatory interpretations;
- resolving source conflicts where both sources are authoritative;
- publishing claims with geopolitical, environmental, safety or territorial implications.

## Example

Canonical claim:

> Puerto Williams is recognized in Chilean policy as an Antarctic gateway, but the current Knowledge Layer does not contain evidence of a regularly available commercial Antarctic air service departing from Puerto Williams.

External verification should not ask only: "Is Puerto Williams an Antarctic gateway?"

It should separately verify:

1. Is Puerto Williams still described by official sources as an Antarctic gateway?
2. Is there a current commercial Antarctic air product from Puerto Williams?
3. If yes, who operates it, when, under what operating model, and from what source?
4. Is the service scheduled, chartered, seasonal, expedition-specific or merely planned?

Only the reviewed primary-source evidence should update the canonical record.
