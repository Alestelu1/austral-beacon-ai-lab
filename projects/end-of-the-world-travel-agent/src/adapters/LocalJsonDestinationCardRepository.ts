import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import type { DestinationCard } from "../domain/types.js";
import { normalize } from "../domain/normalize.js";
import type { DestinationCardRepository } from "../ports/DestinationCardRepository.js";
import { validateDestinationCard } from "./validateDestinationCard.js";

export class LocalJsonDestinationCardRepository implements DestinationCardRepository {
  private cardsBySlug: Map<string, DestinationCard> = new Map();
  private cardsByName: Map<string, DestinationCard> = new Map();

  constructor(directoryPath: string) {
    if (!existsSync(directoryPath)) {
      console.warn(`[DestinationCardRepository] Directory not found: ${directoryPath}. Starting with empty set.`);
      return;
    }

    let files: string[];
    try {
      files = readdirSync(directoryPath).filter((f) => f.endsWith(".json"));
    } catch (err) {
      console.error(`[DestinationCardRepository] Error reading directory: ${directoryPath}`, err);
      return;
    }

    if (files.length === 0) {
      console.warn(`[DestinationCardRepository] No .json files found in: ${directoryPath}. Starting with empty set.`);
      return;
    }

    for (const file of files) {
      const filePath = join(directoryPath, file);
      let raw: unknown;

      try {
        const content = readFileSync(filePath, "utf-8");
        raw = JSON.parse(content);
      } catch (err) {
        console.error(`[DestinationCardRepository] Error reading file: ${file}`, err);
        continue;
      }

      const result = validateDestinationCard(raw);

      if (!result.valid) {
        for (const error of result.errors) {
          console.error(`[DestinationCardRepository] Validation error in ${file}: ${error.path} — ${error.violation}: ${error.message}`);
        }
        continue;
      }

      const card = result.card;
      const slugKey = normalize(card.id);
      const nameKey = normalize(card.name);

      this.cardsBySlug.set(slugKey, card);
      this.cardsByName.set(nameKey, card);
    }

    console.info(`[DestinationCardRepository] Loaded ${this.cardsBySlug.size} destination card(s).`);
  }

  findByNormalizedKey(normalizedKey: string): DestinationCard | undefined {
    return this.cardsBySlug.get(normalizedKey) ?? this.cardsByName.get(normalizedKey);
  }

  listAll(): DestinationCard[] {
    return [...this.cardsBySlug.values()];
  }

  listByRegion(region: string): DestinationCard[] {
    const normalizedRegion = normalize(region);
    return this.listAll().filter((card) => normalize(card.region) === normalizedRegion);
  }
}
