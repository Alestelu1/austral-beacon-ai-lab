import { readFileSync } from "node:fs";
import type { KnowledgeRepository, KnowledgeSnapshot } from "./knowledgeTypes.js";

// Paths, not copies: factual content stays in the canonical layer.
// Requires the monorepo checkout; this is not a browser/deployment bundle.
const ROOT = new URL("../../../../", import.meta.url);
const readJson = (path: string): unknown =>
  JSON.parse(readFileSync(new URL(path, ROOT), "utf8"));

export function createKnowledgeRepository(): KnowledgeRepository {
  return {
    load(): KnowledgeSnapshot {
      // No cache shared with callers; returned object mutations cannot persist.
      return {
        contract: readJson("data/knowledge/travel-agent-wave2-query-contract.json"),
        input: {
          graph: readJson("data/knowledge/batch-05-wave-2-connectivity-graph.json"),
          packages: [
            readJson("knowledge-base/entities/places/puerto-yungay/claims.json"),
            readJson("knowledge-base/entities/infrastructure/rio-bravo/claims.json")
          ],
          verification: readJson("data/verification/campo-hielo-sur-chilean-authority-validation.json"),
          policy: readJson("knowledge-base/research/batch-05-wave-2-retrieval-policy.json")
        }
      };
    }
  };
}
