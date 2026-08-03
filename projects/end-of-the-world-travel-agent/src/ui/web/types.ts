/**
 * Local structural types for the web client rendering layer.
 *
 * These mirror the shapes consumed from the API response JSON.
 * They do NOT import from domain — they are structurally compatible
 * but self-contained within src/ui/web to keep rootDir clean.
 */

export type AnswerStatus = "supported" | "unsupported";
export type TravelIntent = "connectivity" | "destination-info" | "unknown";
export type Confidence = "high" | "medium" | "none";

export interface RouteStage {
  from: string;
  to: string;
  mode: string;
  note: string;
}

export interface SourceReference {
  title: string;
  publisher: string;
  url: string;
  verifiedAt: string;
}

export interface InternalLink {
  path: string;
  label: string;
}

export interface StableData {
  geographicContext: string;
  culturalContext: string;
}

export interface DestinationCard {
  name: string;
  stableData: StableData;
}

export interface TravelAnswer {
  status: AnswerStatus;
  intent: TravelIntent;
  summary: string;
  stages: RouteStage[];
  warnings: string[];
  sources: SourceReference[];
  verifiedAt?: string;
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
