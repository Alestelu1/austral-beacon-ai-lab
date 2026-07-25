export type AnswerStatus = "supported" | "unsupported";
export type TravelIntent = "connectivity" | "unknown";

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
