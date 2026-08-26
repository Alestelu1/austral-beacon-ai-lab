import registryData from "../../../../data/live/puerto-williams-live-source-registry-v1.json" with { type: "json" };

export type LiveVerificationSignal = "road_condition";

export type LiveVerificationSource = {
  source_id: string;
  producer: string;
  source_class: "official_publication_monitor" | "official_live_feed";
  url: string;
  machine_readable: boolean;
  operational_scope: string[];
  notes: string;
};

type RegistryShape = {
  registry_id: string;
  status: string;
  updated_at: string;
  policy: Record<string, boolean>;
  signals: Partial<Record<LiveVerificationSignal, LiveVerificationSource[]>>;
};

const registry = registryData as RegistryShape;

export type LiveVerificationPlan = {
  status: "source_check_required" | "unsupported_signal";
  signal: string;
  sources: LiveVerificationSource[];
  caution: string;
};

export function planLiveVerification(matchedSignals: string[]): LiveVerificationPlan[] {
  const uniqueSignals = Array.from(new Set(matchedSignals));

  return uniqueSignals.map((signal) => {
    const sources = registry.signals[signal as LiveVerificationSignal] ?? [];

    if (sources.length === 0) {
      return {
        status: "unsupported_signal",
        signal,
        sources: [],
        caution: "No live-source adapter is registered for this signal yet; do not infer current state from stable RAG knowledge."
      };
    }

    return {
      status: "source_check_required",
      signal,
      sources,
      caution: "These are authoritative source candidates, not proof of current operational state. The latest relevant publication or feed must be checked before answering."
    };
  });
}

export function getLiveSourceRegistryMetadata() {
  return {
    registryId: registry.registry_id,
    status: registry.status,
    updatedAt: registry.updated_at,
    policy: registry.policy
  };
}
