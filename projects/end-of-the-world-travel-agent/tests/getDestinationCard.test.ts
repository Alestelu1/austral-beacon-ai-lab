import { describe, expect, it } from "vitest";
import { resolve } from "node:path";
import { LocalJsonDestinationCardRepository } from "../src/adapters/LocalJsonDestinationCardRepository.js";
import { validateDestinationCard } from "../src/adapters/validateDestinationCard.js";
import { getDestinationCard } from "../src/application/getDestinationCard.js";

const DESTINATIONS_DIR = resolve(import.meta.dirname, "../data/destinations");

function createRepository() {
  return new LocalJsonDestinationCardRepository(DESTINATIONS_DIR);
}

describe("getDestinationCard — fixture loading", () => {
  it("loads exactly 3 destination cards from data/destinations/", () => {
    const repository = createRepository();
    const cards = repository.listAll();
    expect(cards).toHaveLength(3);
  });
});

describe("getDestinationCard — retrieval", () => {
  const repository = createRepository();

  it("retrieves Punta Arenas with all required fields", () => {
    const result = getDestinationCard("Punta Arenas", repository);

    expect(result.status).toBe("supported");
    expect(result.intent).toBe("destination-info");
    expect(result.confidence).toBe("high");
    expect(result.summary).toBeTruthy();
    expect(result.sources.length).toBeGreaterThan(0);
    expect(result.verifiedAt).toBeTruthy();
    expect(result.card).toBeDefined();
    expect(result.card!.id).toBe("punta-arenas");
    expect(result.card!.name).toBe("Punta Arenas");
    expect(result.card!.region).toBe("Magallanes y de la Antártica Chilena");
    expect(result.card!.stableData.geographicContext).toBeTruthy();
    expect(result.card!.stableData.culturalContext).toBeTruthy();

    const linkPaths = result.suggestedInternalLinks.map((l) => l.path);
    expect(linkPaths).toContain("/puerto-williams");
    expect(linkPaths).toContain("/cabo-de-hornos");
  });

  it("retrieves Puerto Williams with Isla Navarino geographic data", () => {
    const result = getDestinationCard("Puerto Williams", repository);

    expect(result.status).toBe("supported");
    expect(result.intent).toBe("destination-info");
    expect(result.confidence).toBe("high");
    expect(result.card).toBeDefined();
    expect(result.card!.id).toBe("puerto-williams");
    expect(result.card!.comuna).toBe("Cabo de Hornos");
    expect(result.card!.region).toBe("Magallanes y de la Antártica Chilena");
    expect(result.card!.summary).toContain("Navarino");
  });

  it("retrieves Cabo de Hornos with disambiguation note", () => {
    const result = getDestinationCard("Cabo de Hornos", repository);

    expect(result.status).toBe("supported");
    expect(result.intent).toBe("destination-info");
    expect(result.card).toBeDefined();
    expect(result.card!.id).toBe("cabo-de-hornos");

    // The card should contain disambiguation across stableData fields
    const stableValues = Object.values(result.card!.stableData).join(" ");
    expect(stableValues).toMatch(/comuna/i);
    expect(stableValues).toMatch(/isla/i);
    expect(stableValues).toMatch(/cabo/i);
  });
});

describe("getDestinationCard — search by name and slug", () => {
  const repository = createRepository();

  it("resolves 'Puerto Williams' (name with caps)", () => {
    const result = getDestinationCard("Puerto Williams", repository);
    expect(result.status).toBe("supported");
    expect(result.card!.id).toBe("puerto-williams");
  });

  it("resolves 'puerto williams' (lowercase name)", () => {
    const result = getDestinationCard("puerto williams", repository);
    expect(result.status).toBe("supported");
    expect(result.card!.id).toBe("puerto-williams");
  });

  it("resolves 'PUERTO WILLIAMS' (uppercase name)", () => {
    const result = getDestinationCard("PUERTO WILLIAMS", repository);
    expect(result.status).toBe("supported");
    expect(result.card!.id).toBe("puerto-williams");
  });

  it("resolves 'puerto-williams' (slug format)", () => {
    const result = getDestinationCard("puerto-williams", repository);
    expect(result.status).toBe("supported");
    expect(result.card!.id).toBe("puerto-williams");
  });
});

describe("getDestinationCard — unsupported destinations", () => {
  const repository = createRepository();

  it("returns unsupported for a non-existent destination", () => {
    const result = getDestinationCard("Ushuaia", repository);

    expect(result.status).toBe("unsupported");
    expect(result.intent).toBe("destination-info");
    expect(result.confidence).toBe("none");
    expect(result.warnings).toEqual([]);
    expect(result.sources).toEqual([]);
    expect(result.suggestedInternalLinks).toEqual([]);
    expect(result.verifiedAt).toBeUndefined();
    expect(result.card).toBeUndefined();
  });

  it("returns unsupported for an empty string", () => {
    const result = getDestinationCard("", repository);

    expect(result.status).toBe("unsupported");
    expect(result.intent).toBe("destination-info");
    expect(result.confidence).toBe("none");
    expect(result.warnings).toEqual([]);
    expect(result.sources).toEqual([]);
    expect(result.suggestedInternalLinks).toEqual([]);
  });

  it("returns unsupported for whitespace-only string", () => {
    const result = getDestinationCard("   \t\n  ", repository);

    expect(result.status).toBe("unsupported");
    expect(result.intent).toBe("destination-info");
    expect(result.confidence).toBe("none");
  });
});

describe("validateDestinationCard — invalid inputs", () => {
  it("reports error for missing required field (comuna)", () => {
    const incomplete = {
      id: "test",
      name: "Test",
      region: "Test Region",
      // comuna is missing
      coordinates: { latitude: -50, longitude: -70 },
      summary: "A test destination for validation purposes.",
      stableData: { geographicContext: "geo context", culturalContext: "cultural context" },
      warnings: [],
      sources: [
        { title: "Source", publisher: "Publisher", url: "https://example.com", verifiedAt: "2025-01-01", status: "verified" },
      ],
      suggestedInternalLinks: [],
      verifiedAt: "2025-01-01",
    };

    const result = validateDestinationCard(incomplete);

    expect(result.valid).toBe(false);
    if (!result.valid) {
      const comunaError = result.errors.find((e) => e.path === "comuna");
      expect(comunaError).toBeDefined();
      expect(comunaError!.violation).toBe("missing");
    }
  });

  it("reports range error for latitude out of bounds", () => {
    const badCoords = {
      id: "test",
      name: "Test",
      region: "Test Region",
      comuna: "Test Comuna",
      coordinates: { latitude: -100, longitude: -70 },
      summary: "A test destination for validation purposes.",
      stableData: { geographicContext: "geo context", culturalContext: "cultural context" },
      warnings: [],
      sources: [
        { title: "Source", publisher: "Publisher", url: "https://example.com", verifiedAt: "2025-01-01", status: "verified" },
      ],
      suggestedInternalLinks: [],
      verifiedAt: "2025-01-01",
    };

    const result = validateDestinationCard(badCoords);

    expect(result.valid).toBe(false);
    if (!result.valid) {
      const latError = result.errors.find((e) => e.path === "coordinates.latitude" && e.violation === "range");
      expect(latError).toBeDefined();
    }
  });

  it("reports range error for longitude out of bounds", () => {
    const badCoords = {
      id: "test",
      name: "Test",
      region: "Test Region",
      comuna: "Test Comuna",
      coordinates: { latitude: -50, longitude: -200 },
      summary: "A test destination for validation purposes.",
      stableData: { geographicContext: "geo context", culturalContext: "cultural context" },
      warnings: [],
      sources: [
        { title: "Source", publisher: "Publisher", url: "https://example.com", verifiedAt: "2025-01-01", status: "verified" },
      ],
      suggestedInternalLinks: [],
      verifiedAt: "2025-01-01",
    };

    const result = validateDestinationCard(badCoords);

    expect(result.valid).toBe(false);
    if (!result.valid) {
      const lonError = result.errors.find((e) => e.path === "coordinates.longitude" && e.violation === "range");
      expect(lonError).toBeDefined();
    }
  });
});
