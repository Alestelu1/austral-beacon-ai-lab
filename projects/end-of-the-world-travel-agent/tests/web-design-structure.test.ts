import { describe, it, expect, beforeAll } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = resolve(__filename, "..");
const htmlPath = resolve(__dirname, "../public/index.html");
const cssPath = resolve(__dirname, "../public/styles.css");

let html: string;
let css: string;

beforeAll(() => {
  html = readFileSync(htmlPath, "utf-8");
  css = readFileSync(cssPath, "utf-8");
});


describe("HTML Structure — Protected IDs", () => {
  it("contains id=\"query-form\"", () => {
    expect(html).toContain('id="query-form"');
  });

  it("contains id=\"question-input\"", () => {
    expect(html).toContain('id="question-input"');
  });

  it("contains id=\"submit-btn\"", () => {
    expect(html).toContain('id="submit-btn"');
  });

  it("contains id=\"validation-msg\"", () => {
    expect(html).toContain('id="validation-msg"');
  });

  it("contains id=\"loading\"", () => {
    expect(html).toContain('id="loading"');
  });

  it("contains id=\"results\"", () => {
    expect(html).toContain('id="results"');
  });
});

describe("HTML Structure — Language", () => {
  it("has lang=\"es\" on the html element", () => {
    expect(html).toMatch(/<html[^>]*lang="es"/);
  });
});

describe("HTML Structure — ARIA Attributes", () => {
  it("contains aria-live=\"polite\"", () => {
    expect(html).toContain('aria-live="polite"');
  });

  it("contains aria-live=\"assertive\"", () => {
    expect(html).toContain('aria-live="assertive"');
  });

  it("contains aria-label", () => {
    expect(html).toContain("aria-label");
  });

  it("contains aria-labelledby=\"examples-heading\"", () => {
    expect(html).toContain('aria-labelledby="examples-heading"');
  });

  it("contains role=\"alert\"", () => {
    expect(html).toContain('role="alert"');
  });
});

describe("HTML Structure — Form Accessibility", () => {
  it("contains label with for=\"question-input\"", () => {
    expect(html).toContain('for="question-input"');
  });
});

describe("HTML Structure — Client Script", () => {
  it("loads app.client.js as type=\"module\"", () => {
    expect(html).toContain('<script type="module" src="/js/app.client.js">');
  });
});

describe("CSS Structure — Hidden Elements", () => {
  it("keeps hidden UI elements visually hidden", () => {
    expect(css).toMatch(
      /\[hidden\]\s*\{[^}]*display:\s*none\s*!important\s*;?[^}]*\}/s,
    );
  });
});

// --- CSS Structure Validation ---

describe("CSS Structure — Custom Properties", () => {
  it("defines --color-bg", () => {
    expect(css).toContain("--color-bg:");
  });

  it("defines --color-surface", () => {
    expect(css).toContain("--color-surface:");
  });

  it("defines --color-text", () => {
    expect(css).toContain("--color-text:");
  });

  it("defines --color-text-muted", () => {
    expect(css).toContain("--color-text-muted:");
  });

  it("defines --color-accent", () => {
    expect(css).toContain("--color-accent:");
  });

  it("defines --color-action", () => {
    expect(css).toContain("--color-action:");
  });

  it("defines --color-border", () => {
    expect(css).toContain("--color-border:");
  });

  it("defines --color-header-bg", () => {
    expect(css).toContain("--color-header-bg:");
  });

  it("defines --color-header-text", () => {
    expect(css).toContain("--color-header-text:");
  });
});

describe("CSS Structure — Media Queries", () => {
  it("contains @media (min-width: 768px)", () => {
    expect(css).toContain("@media (min-width: 768px)");
  });

  it("contains @media (prefers-reduced-motion: reduce)", () => {
    expect(css).toContain("@media (prefers-reduced-motion: reduce)");
  });
});

describe("CSS Structure — No External Dependencies", () => {
  it("does not contain @import", () => {
    expect(css).not.toMatch(/@import\s/);
  });

  it("does not contain url() with external resources", () => {
    const urlMatches = css.match(/url\s*\([^)]*\)/g) ?? [];
    for (const match of urlMatches) {
      expect(match).not.toMatch(/https?:\/\//);
    }
  });

  it("does not reference Tailwind", () => {
    expect(css.toLowerCase()).not.toContain("tailwind");
  });

  it("does not reference Bootstrap", () => {
    expect(css.toLowerCase()).not.toContain("bootstrap");
  });

  it("does not reference CDN fonts", () => {
    expect(css).not.toContain("fonts.googleapis.com");
    expect(css).not.toContain("fonts.gstatic.com");
    expect(css).not.toContain("use.typekit.net");
  });
});
