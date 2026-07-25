export type AnswerStatus = "supported" | "unsupported";
export type TravelIntent = "connectivity" | "destination-info" | "unknown";
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
  coordinates: GeoCoordinates;
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
