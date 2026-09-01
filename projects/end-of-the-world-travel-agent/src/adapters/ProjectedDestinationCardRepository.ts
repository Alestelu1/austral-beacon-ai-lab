import type { DestinationCard } from "../domain/types.js";
import { normalize } from "../domain/normalize.js";
import type { DestinationCardRepository } from "../ports/DestinationCardRepository.js";
import { buildPuertoWilliamsDestinationCard } from "../knowledge/puertoWilliamsProjection.js";
import { buildCaboDeHornosDestinationCard } from "../knowledge/caboDeHornosProjection.js";
import { buildPuertoToroDestinationCard } from "../knowledge/puertoToroProjection.js";
import { buildPuntaArenasDestinationCard } from "../knowledge/puntaArenasProjection.js";

/** Incremental migration adapter: canonical projections override legacy JSON cards. */
export class ProjectedDestinationCardRepository implements DestinationCardRepository {
  private readonly projected: DestinationCard[] = [
    buildPuertoWilliamsDestinationCard(),
    buildCaboDeHornosDestinationCard(),
    buildPuertoToroDestinationCard(),
    buildPuntaArenasDestinationCard()
  ];
  private readonly byKey = new Map<string, DestinationCard>();

  constructor(private readonly legacy: DestinationCardRepository) {
    for (const card of this.projected) {
      this.byKey.set(normalize(card.id), card);
      this.byKey.set(normalize(card.name), card);
    }
  }

  findByNormalizedKey(normalizedKey: string): DestinationCard | undefined {
    return this.byKey.get(normalizedKey) ?? this.legacy.findByNormalizedKey(normalizedKey);
  }

  listAll(): DestinationCard[] {
    const projectedIds = new Set(this.projected.map((card) => normalize(card.id)));
    const remainingLegacy = this.legacy.listAll().filter((card) => !projectedIds.has(normalize(card.id)));
    return [...this.projected, ...remainingLegacy];
  }

  listByRegion(region: string): DestinationCard[] {
    const normalizedRegion = normalize(region);
    return this.listAll().filter((card) => normalize(card.region) === normalizedRegion);
  }
}
