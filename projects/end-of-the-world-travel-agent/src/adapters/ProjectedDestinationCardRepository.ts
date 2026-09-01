import type { DestinationCard } from "../domain/types.js";
import { normalize } from "../domain/normalize.js";
import type { DestinationCardRepository } from "../ports/DestinationCardRepository.js";
import { buildPuertoWilliamsDestinationCard } from "../knowledge/puertoWilliamsProjection.js";

/**
 * Incremental migration adapter.
 *
 * Puerto Williams is served from the canonical knowledge-base projection while
 * the remaining destination cards continue to come from the legacy local JSON
 * repository. This keeps the migration reversible and avoids duplicating a new
 * canonical truth inside the Travel Agent.
 */
export class ProjectedDestinationCardRepository implements DestinationCardRepository {
  private readonly puertoWilliams = buildPuertoWilliamsDestinationCard();
  private readonly puertoWilliamsKeys = new Set([
    normalize(this.puertoWilliams.id),
    normalize(this.puertoWilliams.name)
  ]);

  constructor(private readonly legacy: DestinationCardRepository) {}

  findByNormalizedKey(normalizedKey: string): DestinationCard | undefined {
    if (this.puertoWilliamsKeys.has(normalizedKey)) return this.puertoWilliams;
    return this.legacy.findByNormalizedKey(normalizedKey);
  }

  listAll(): DestinationCard[] {
    const legacyWithoutPuertoWilliams = this.legacy
      .listAll()
      .filter((card) => !this.puertoWilliamsKeys.has(normalize(card.id)));
    return [this.puertoWilliams, ...legacyWithoutPuertoWilliams];
  }

  listByRegion(region: string): DestinationCard[] {
    const normalizedRegion = normalize(region);
    return this.listAll().filter((card) => normalize(card.region) === normalizedRegion);
  }
}
