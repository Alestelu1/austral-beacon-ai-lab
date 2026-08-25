export type GoldenCorpusChunk = {
  chunk_id: string;
  entity_id: string;
  class: string;
  embedding_ready: boolean;
  text: string;
  fact_scope?: string[];
  source_records?: string[];
};

export type GoldenCorpus = {
  corpus_id: string;
  chunks: GoldenCorpusChunk[];
};

export type RetrievalHit = {
  chunk: GoldenCorpusChunk;
  score: number;
  matchedTerms: string[];
};

const STOPWORDS = new Set([
  "a", "an", "and", "are", "as", "at", "be", "by", "for", "from", "has", "have", "how",
  "in", "is", "it", "of", "on", "or", "that", "the", "this", "to", "what", "where", "which",
  "with", "y", "de", "del", "la", "las", "el", "los", "un", "una", "en", "es", "que", "como",
  "cómo", "para", "por", "se", "su", "sus", "hay", "puedo"
]);

function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function tokenize(value: string): string[] {
  return normalize(value)
    .split(/\s+/)
    .filter((token) => token.length > 1 && !STOPWORDS.has(token));
}

function buildSearchText(chunk: GoldenCorpusChunk): string {
  return [
    chunk.entity_id,
    chunk.text,
    ...(chunk.fact_scope ?? [])
  ].join(" ");
}

export class GoldenCorpusRetriever {
  private readonly chunks: GoldenCorpusChunk[];

  constructor(corpus: GoldenCorpus) {
    this.chunks = corpus.chunks.filter((chunk) => chunk.embedding_ready === true);
  }

  search(query: string, topK = 3): RetrievalHit[] {
    const queryTerms = Array.from(new Set(tokenize(query)));
    if (queryTerms.length === 0 || topK <= 0) return [];

    return this.chunks
      .map((chunk) => {
        const normalizedText = normalize(buildSearchText(chunk));
        const matchedTerms = queryTerms.filter((term) => normalizedText.includes(term));
        const entityBoost = queryTerms.some((term) => normalize(chunk.entity_id).includes(term)) ? 2 : 0;
        const scopeBoost = (chunk.fact_scope ?? []).reduce((score, scope) => {
          const normalizedScope = normalize(scope);
          return score + queryTerms.filter((term) => normalizedScope.includes(term)).length * 0.5;
        }, 0);
        const score = matchedTerms.length + entityBoost + scopeBoost;
        return { chunk, score, matchedTerms };
      })
      .filter((hit) => hit.score > 0)
      .sort((a, b) => b.score - a.score || a.chunk.chunk_id.localeCompare(b.chunk.chunk_id))
      .slice(0, topK);
  }
}
