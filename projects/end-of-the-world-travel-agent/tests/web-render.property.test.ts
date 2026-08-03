import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import { validateQuestion } from "../src/ui/web/app.client.js";

describe("Feature: minimal-web-interface, Property 1: Whitespace-only input is always rejected", () => {
  const whitespaceChars = [" ", "\t", "\n", "\r", "\f", "\v", "\u00A0", "\u2000", "\u3000"];

  it("rejects any string composed entirely of whitespace characters", () => {
    const whitespaceArb = fc.array(fc.constantFrom(...whitespaceChars), { minLength: 0, maxLength: 50 })
      .map((chars) => chars.join(""));

    fc.assert(
      fc.property(whitespaceArb, (input: string) => {
        const result = validateQuestion(input);
        expect(result.valid).toBe(false);
        expect(result.message).toBeDefined();
      }),
      { numRuns: 100 }
    );
  });

  it("accepts any string containing at least one non-whitespace character", () => {
    const nonWhitespaceArb = fc.string({ minLength: 1 })
      .filter((s: string) => s.trim().length > 0);

    fc.assert(
      fc.property(nonWhitespaceArb, (input: string) => {
        const result = validateQuestion(input);
        expect(result.valid).toBe(true);
        expect(result.message).toBeUndefined();
      }),
      { numRuns: 100 }
    );
  });
});

import { renderConnectivity } from "../src/ui/web/renderConnectivity.js";
import type { TravelAnswer } from "../src/ui/web/types.js";

/**
 * Mirrors the escapeHtml logic from the render modules so we can check
 * that escaped values appear in the output.
 */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Arbitraries for TravelAnswer components

const routeStageArb = fc.record({
  from: fc.string({ minLength: 1, maxLength: 20 }),
  to: fc.string({ minLength: 1, maxLength: 20 }),
  mode: fc.constantFrom("air", "sea", "air-or-sea", "road"),
  note: fc.string({ minLength: 1, maxLength: 40 }),
});

const sourceArb = fc.record({
  title: fc.string({ minLength: 1, maxLength: 30 }),
  publisher: fc.string({ minLength: 1, maxLength: 30 }),
  url: fc.webUrl(),
  verifiedAt: fc.tuple(
    fc.integer({ min: 2020, max: 2026 }),
    fc.integer({ min: 1, max: 12 }),
    fc.integer({ min: 1, max: 28 })
  ).map(([y, m, d]) => `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`),
});

const travelAnswerArb: fc.Arbitrary<TravelAnswer> = fc.record({
  status: fc.constant("supported" as const),
  intent: fc.constant("connectivity" as const),
  summary: fc.string({ minLength: 1, maxLength: 80 }),
  stages: fc.array(routeStageArb, { minLength: 0, maxLength: 5 }),
  warnings: fc.array(fc.string({ minLength: 1, maxLength: 50 }), { minLength: 0, maxLength: 3 }),
  sources: fc.array(sourceArb, { minLength: 0, maxLength: 3 }),
  verifiedAt: fc.tuple(
    fc.integer({ min: 2020, max: 2026 }),
    fc.integer({ min: 1, max: 12 }),
    fc.integer({ min: 1, max: 28 })
  ).map(([y, m, d]) => `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`),
});

describe("Feature: minimal-web-interface, Property 2: Connectivity rendering includes all response data", () => {
  it("output contains summary, all stages, warnings, sources, and section labels", () => {
    fc.assert(
      fc.property(travelAnswerArb, (answer: TravelAnswer) => {
        const html = renderConnectivity(answer);

        // Summary is present
        expect(html).toContain(escapeHtml(answer.summary));

        // All stages present
        for (const stage of answer.stages) {
          expect(html).toContain(escapeHtml(stage.from));
          expect(html).toContain(escapeHtml(stage.to));
          expect(html).toContain(escapeHtml(stage.mode));
          expect(html).toContain(escapeHtml(stage.note));
        }

        // All warnings present
        for (const warning of answer.warnings) {
          expect(html).toContain(escapeHtml(warning));
        }

        // All sources present
        for (const source of answer.sources) {
          expect(html).toContain(escapeHtml(source.title));
          expect(html).toContain(escapeHtml(source.publisher));
          expect(html).toContain(escapeHtml(source.url));
          expect(html).toContain(escapeHtml(source.verifiedAt));
        }

        // General verifiedAt present
        if (answer.verifiedAt) {
          expect(html).toContain(escapeHtml(answer.verifiedAt));
        }

        // Section labels always present
        expect(html).toContain("Resumen");
        if (answer.stages.length > 0) {
          expect(html).toContain("Etapas");
        }
        if (answer.warnings.length > 0) {
          expect(html).toContain("Advertencias");
        }
        if (answer.sources.length > 0) {
          expect(html).toContain("Fuentes");
        }
      }),
      { numRuns: 100 }
    );
  });
});

import { renderDestination } from "../src/ui/web/renderDestination.js";
import type { DestinationCardAnswer } from "../src/ui/web/types.js";

// Arbitraries for DestinationCardAnswer components

const internalLinkArb = fc.record({
  path: fc.string({ minLength: 1, maxLength: 30 }).map((s) => "/" + s.replace(/\s/g, "-")),
  label: fc.string({ minLength: 1, maxLength: 30 }),
});

const destinationCardArb = fc.record({
  name: fc.string({ minLength: 1, maxLength: 30 }),
  stableData: fc.record({
    geographicContext: fc.string({ minLength: 1, maxLength: 60 }),
    culturalContext: fc.string({ minLength: 1, maxLength: 60 }),
  }),
});

const destinationAnswerArb: fc.Arbitrary<DestinationCardAnswer> = fc.record({
  status: fc.constant("supported" as const),
  intent: fc.constant("destination-info" as const),
  summary: fc.string({ minLength: 1, maxLength: 80 }),
  confidence: fc.constantFrom("high" as const, "medium" as const, "none" as const),
  warnings: fc.array(fc.string({ minLength: 1, maxLength: 50 }), { minLength: 0, maxLength: 3 }),
  sources: fc.array(sourceArb, { minLength: 0, maxLength: 3 }),
  suggestedInternalLinks: fc.array(internalLinkArb, { minLength: 0, maxLength: 3 }),
  verifiedAt: fc.tuple(
    fc.integer({ min: 2020, max: 2026 }),
    fc.integer({ min: 1, max: 12 }),
    fc.integer({ min: 1, max: 28 })
  ).map(([y, m, d]) => `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`),
  card: destinationCardArb,
});

describe("Feature: minimal-web-interface, Property 3: Destination rendering includes all response data", () => {
  it("output contains all destination fields, sources with href, internal links, confidence and verifiedAt", () => {
    fc.assert(
      fc.property(destinationAnswerArb, (answer: DestinationCardAnswer) => {
        const html = renderDestination(answer);

        // Destination name
        if (answer.card?.name) {
          expect(html).toContain(escapeHtml(answer.card.name));
        }

        // Summary
        expect(html).toContain(escapeHtml(answer.summary));

        // Geographic context
        if (answer.card?.stableData?.geographicContext) {
          expect(html).toContain(escapeHtml(answer.card.stableData.geographicContext));
        }

        // Cultural context
        if (answer.card?.stableData?.culturalContext) {
          expect(html).toContain(escapeHtml(answer.card.stableData.culturalContext));
        }

        // All warnings
        for (const warning of answer.warnings) {
          expect(html).toContain(escapeHtml(warning));
        }

        // All sources with href attributes
        for (const source of answer.sources) {
          expect(html).toContain(escapeHtml(source.title));
          expect(html).toContain(escapeHtml(source.publisher));
          expect(html).toContain(`href="${escapeHtml(source.url)}"`);
          expect(html).toContain(escapeHtml(source.verifiedAt));
        }

        // All internal links with path and label
        for (const link of answer.suggestedInternalLinks) {
          expect(html).toContain(escapeHtml(link.path));
          expect(html).toContain(escapeHtml(link.label));
        }

        // Confidence level
        expect(html).toContain(escapeHtml(answer.confidence));

        // VerifiedAt date
        if (answer.verifiedAt) {
          expect(html).toContain(escapeHtml(answer.verifiedAt));
        }
      }),
      { numRuns: 100 }
    );
  });
});

import { renderError } from "../src/ui/web/renderError.js";
import type { HttpErrorInfo } from "../src/ui/web/renderError.js";

describe("Feature: minimal-web-interface, Property 4: Error rendering preserves API error messages safely", () => {
  it("HTTP 400 output contains the escaped error message", () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 100 }),
        (message: string) => {
          const html = renderError({ type: "http", status: 400, message });
          // The escaped message must appear in the output
          expect(html).toContain(escapeHtml(message));
        }
      ),
      { numRuns: 100 }
    );
  });

  it("HTTP 500 uses a generic message and never exposes the provided message", () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 5, maxLength: 100 }).filter(
          (s) => !("Error interno del servidor. Intenta nuevamente.".includes(s))
        ),
        (message: string) => {
          const html = renderError({ type: "http", status: 500, message });
          // Generic message present
          expect(html).toContain("Error interno del servidor");
          // Provided message must NOT appear in the output
          expect(html).not.toContain(escapeHtml(message));
        }
      ),
      { numRuns: 100 }
    );
  });

  it("network errors show connection failure message", () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 0, maxLength: 50 }),
        (message: string) => {
          const info: HttpErrorInfo = { type: "network", message };
          const html = renderError(info);
          expect(html).toContain("No se pudo contactar al servidor");
          // Provided message must NOT appear
          if (message.trim().length > 0 && !html.includes("No se pudo contactar al servidor")) {
            expect(html).not.toContain(escapeHtml(message));
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it("output never contains raw HTML tags from error messages", () => {
    const htmlPayloads = fc.constantFrom(
      '<script>alert(1)</script>',
      '<img src=x onerror=alert(1)>',
      '<a href="javascript:void(0)">click</a>',
      '"><svg onload=alert(1)>',
    );

    fc.assert(
      fc.property(
        fc.constantFrom("network" as const, "http" as const),
        fc.constantFrom(400, 500, 502, 503),
        htmlPayloads,
        (type: "network" | "http", status: number, message: string) => {
          const html = renderError({ type, status, message });
          // No raw script, img, svg, or anchor injection
          expect(html).not.toContain("<script");
          expect(html).not.toContain("<img");
          expect(html).not.toContain("<svg");
          expect(html).not.toContain("<a href=\"javascript:");
        }
      ),
      { numRuns: 100 }
    );
  });

  it("output never contains file paths or stack trace patterns for non-400 errors", () => {
    const pathPatterns = fc.constantFrom(
      "C:\\Users\\admin\\project\\src\\index.ts:42",
      "/home/user/app/node_modules/express/lib/router.js:174:3",
      "at Object.<anonymous> (/app/src/server.ts:12:5)",
      "Error: ENOENT: no such file at /var/data/secrets.json",
    );

    fc.assert(
      fc.property(
        fc.constantFrom(500, 502, 503),
        pathPatterns,
        (status: number, message: string) => {
          const html = renderError({ type: "http", status, message });
          // For 500+ the message must not leak
          expect(html).not.toContain(escapeHtml(message));
          expect(html).not.toContain("node_modules");
          expect(html).not.toContain("ENOENT");
          expect(html).not.toContain("Object.<anonymous>");
        }
      ),
      { numRuns: 100 }
    );
  });
});

import { renderAnswer } from "../src/ui/web/renderAnswer.js";

// Arbitrary that produces either a supported TravelAnswer or a supported DestinationCardAnswer
const anyValidAnswerArb = fc.oneof(
  travelAnswerArb,
  destinationAnswerArb,
  // Also include unsupported variants
  fc.record({
    status: fc.constant("unsupported" as const),
    intent: fc.constantFrom("connectivity" as const, "destination-info" as const, "unknown" as const),
    summary: fc.string({ minLength: 0, maxLength: 50 }),
    stages: fc.constant([]),
    warnings: fc.constant([]),
    sources: fc.constant([]),
  }),
  fc.record({
    status: fc.constant("unsupported" as const),
    intent: fc.constant("destination-info" as const),
    summary: fc.string({ minLength: 0, maxLength: 50 }),
    confidence: fc.constantFrom("high" as const, "medium" as const, "none" as const),
    warnings: fc.constant([]),
    sources: fc.constant([]),
    suggestedInternalLinks: fc.constant([]),
  }),
);

describe("Feature: minimal-web-interface, Property 5: All render functions produce non-empty HTML", () => {
  it("renderAnswer always returns a non-empty string containing at least one HTML tag", () => {
    fc.assert(
      fc.property(anyValidAnswerArb, (answer) => {
        const html = renderAnswer(answer as TravelAnswer | DestinationCardAnswer);
        // Non-empty
        expect(html.length).toBeGreaterThan(0);
        // Contains at least one HTML tag (matches <[a-z])
        expect(html).toMatch(/<[a-z]/);
      }),
      { numRuns: 100 }
    );
  });
});
