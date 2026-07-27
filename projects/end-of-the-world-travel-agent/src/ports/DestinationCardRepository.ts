import type { DestinationCard } from "../domain/types.js";

export interface DestinationCardRepository {
  findByNormalizedKey(normalizedKey: string): DestinationCard | undefined;
  listAll(): DestinationCard[];
  listByRegion(region: string): DestinationCard[];
}
