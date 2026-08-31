import { describe, expect, it } from "vitest";
import { formatCliUrl } from "../src/ui/cliFormat.js";

describe("formatCliUrl", () => {
  it("keeps short URLs unchanged", () => {
    const url = "https://www.directemar.cl/";
    expect(formatCliUrl(url)).toBe(url);
  });

  it("compacts long URLs for narrow CLI output", () => {
    const url = "https://www.ine.gob.cl/sala-de-prensa/prensa/general/noticia/2019/09/16/ine-presenta-sitio-de-mapas-de-ciudades-pueblos-aldeas-y-caser%C3%ADos-2019-con-informaci%C3%B3n-desagregada-seg%C3%BAn-datos-censo-2017";
    const formatted = formatCliUrl(url, 72);

    expect(formatted.length).toBeLessThanOrEqual(72);
    expect(formatted).toContain("https://www.ine.gob.cl");
    expect(formatted).toContain("…");
  });

  it("does not mutate the canonical URL value", () => {
    const url = "https://example.com/a/very/long/path/that/should/remain/unchanged/in/the/source/data?with=query";
    const original = url;

    formatCliUrl(url, 48);

    expect(url).toBe(original);
  });
});
