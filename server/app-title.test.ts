import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

describe("identidade do aplicativo", () => {
  it("mantém a configuração pública com o nome Tribuna Jovem", () => {
    expect(process.env.VITE_APP_TITLE).toBe("Tribuna Jovem — Jornal Escolar");
    const indexPath = fileURLToPath(new URL("../client/index.html", import.meta.url));
    expect(readFileSync(indexPath, "utf-8")).toContain("<title>%VITE_APP_TITLE%</title>");
  });
});
