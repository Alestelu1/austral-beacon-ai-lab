import type { Retriever, RetrievalHit } from "./Retriever.js";
import { routeRetrievalQuery, type RetrievalRoutingDecision } from "./RetrievalQueryRouter.js";

export type RoutedRetrievalResult = {
  routing: RetrievalRoutingDecision;
  hits: RetrievalHit[];
};

export class RoutedRetrievalService {
  constructor(private readonly stableRetriever: Retriever) {}

  async search(query: string, topK = 3): Promise<RoutedRetrievalResult> {
    const routing = routeRetrievalQuery(query);

    if (routing.route === "live_verification") {
      return {
        routing,
        hits: []
      };
    }

    const hits = await this.stableRetriever.search(query, topK);
    return {
      routing,
      hits
    };
  }
}
