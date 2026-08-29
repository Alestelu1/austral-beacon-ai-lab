export type AnswerStatus = "supported" | "unsupported";
export type TravelIntent =
  | "connectivity"
  | "destination-info"
  | "relationship"
  | "antarctic-access"
  | "unknown";
export type Confidence = "high" | "medium" | "none";

export interface RouteStage {
  from: string;
  to: string;
  mode: "air" | "sea" | "air-or-sea" | "road";
  stability: "stable" | "dynamic";
  note: string;
}

export interface SourceReference {
  title: string;
  publisher: string;
  url: string;
  verifiedAt: string;
  status?: "verified" | "provisional";
  /**
   * Optional clarification of what the source verification means. Notably, for
   * first-party commercial sources, `status: "verified"` confirms that the
   * operator publishes the product — not that operation is independently
   * verified, nor that a current departure or availability exists.
   */
  evidenceNote?: string;
}

export interface RouteRecord {
  id: string;
  origin: string;
  destination: string;
  summary: string;
  stages: RouteStage[];
  warnings: string[];
  sources: SourceReference[];
  recommendedPage: string;
  verifiedAt: string;
}

export interface TravelAnswer {
  status: AnswerStatus;
  intent: TravelIntent;
  summary: string;
  stages: RouteStage[];
  warnings: string[];
  sources: SourceReference[];
  recommendedPage?: string;
  verifiedAt?: string;
}

// --- Destination Card types ---

export interface GeoCoordinates {
  latitude: number;
  longitude: number;
}

export interface StableData {
  geographicContext: string;
  culturalContext: string;
  [key: string]: string;
}

export interface InternalLink {
  path: string;
  label: string;
}

export interface DestinationCard {
  id: string;
  name: string;
  region: string;
  comuna: string;
  /**
   * Optional. Some entities (e.g. localities whose authoritative point is still
   * pending) intentionally omit coordinates. When present it must be valid;
   * geometry is never fabricated.
   */
  coordinates?: GeoCoordinates;
  summary: string;
  stableData: StableData;
  warnings: string[];
  sources: SourceReference[];
  suggestedInternalLinks: InternalLink[];
  verifiedAt: string;
}

export interface DestinationCardAnswer {
  status: AnswerStatus;
  intent: "destination-info";
  summary: string;
  confidence: Confidence;
  warnings: string[];
  sources: SourceReference[];
  suggestedInternalLinks: InternalLink[];
  verifiedAt?: string;
  card?: DestinationCard;
}

// --- Place relationship types ---

/**
 * A single named referent that a place name can resolve to.
 *
 * Used to keep distinct meanings (commune, cape, island, park, city) explicitly
 * separated so the assistant never collapses them into one entity.
 */
export interface PlaceReferent {
  kind: "city" | "commune" | "cape" | "island" | "national-park" | "province";
  name: string;
  description: string;
}

/**
 * A curated, source-backed relationship record between two places.
 *
 * Separates the stable administrative relationship and geographic distinction
 * from dynamic access details, and enumerates the distinct referents of an
 * ambiguous name to prevent entity collapse.
 */
export interface PlaceRelationshipRecord {
  id: string;
  subject: string;
  object: string;
  administrativeRelation: string;
  geographicDistinction: string;
  distinctReferents: PlaceReferent[];
  warnings: string[];
  sources: SourceReference[];
  suggestedInternalLinks: InternalLink[];
  verifiedAt: string;
}

export interface RelationshipAnswer {
  status: AnswerStatus;
  intent: "relationship";
  summary: string;
  administrativeRelation: string;
  geographicDistinction: string;
  distinctReferents: PlaceReferent[];
  confidence: Confidence;
  warnings: string[];
  sources: SourceReference[];
  suggestedInternalLinks: InternalLink[];
  verifiedAt?: string;
}

// --- Antarctic access types ---

/**
 * Evidence category for an Antarctic access pathway. Kept explicit so the
 * assistant never collapses distinct kinds of evidence:
 * - gateway-policy: stable policy/gateway context (not a service).
 * - commercial-product: a published operator route/product identity
 *   (not proof of current date-specific availability).
 * - state-science: state/scientific capability (never a public passenger route).
 * - planned-infrastructure: planned/future works (not operational).
 */
export type AntarcticAccessCategory =
  | "gateway-policy"
  | "commercial-product"
  | "state-science"
  | "planned-infrastructure";

export interface AntarcticAccessPathway {
  category: AntarcticAccessCategory;
  origin: string;
  title: string;
  description: string;
  sourceIds: string[];
}

export interface AntarcticAccessRecord {
  id: string;
  subject: string;
  summary: string;
  pathways: AntarcticAccessPathway[];
  puertoWilliamsClarification: string;
  warnings: string[];
  sources: SourceReference[];
  suggestedInternalLinks: InternalLink[];
  verifiedAt: string;
}

export interface AntarcticAccessAnswer {
  status: AnswerStatus;
  intent: "antarctic-access";
  summary: string;
  pathways: AntarcticAccessPathway[];
  puertoWilliamsClarification: string;
  confidence: Confidence;
  warnings: string[];
  sources: SourceReference[];
  suggestedInternalLinks: InternalLink[];
  verifiedAt?: string;
}
