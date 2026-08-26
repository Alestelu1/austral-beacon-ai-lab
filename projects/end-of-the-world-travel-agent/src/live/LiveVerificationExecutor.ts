import { verifyY905Live, type Y905LiveVerificationResult } from "./Y905LiveVerificationService.js";

export type LiveVerificationExecution = {
  status: "verified" | "not_verified" | "unsupported";
  signal: string;
  summary: string;
  result: Y905LiveVerificationResult | null;
};

export type LiveVerificationExecutor = {
  execute(matchedSignals: string[]): Promise<LiveVerificationExecution[]>;
};

export class DefaultLiveVerificationExecutor implements LiveVerificationExecutor {
  async execute(matchedSignals: string[]): Promise<LiveVerificationExecution[]> {
    const uniqueSignals = Array.from(new Set(matchedSignals));
    const executions: LiveVerificationExecution[] = [];

    for (const signal of uniqueSignals) {
      if (signal !== "road_condition") {
        executions.push({
          status: "unsupported",
          signal,
          summary: `No executable live verifier is registered for ${signal}.`,
          result: null
        });
        continue;
      }

      const result = await verifyY905Live();
      const verified = result.verification.status !== "not_verified";

      executions.push({
        status: verified ? "verified" : "not_verified",
        signal,
        summary: verified
          ? `Ruta Y-905 live verification returned ${result.verification.status}.`
          : "Ruta Y-905 current operational state could not be verified from sufficiently fresh explicit official evidence.",
        result
      });
    }

    return executions;
  }
}
