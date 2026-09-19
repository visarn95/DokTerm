import { describe, expect, it } from "vitest";
import { visibleCatalog } from "@/lib/catalog";

describe("katalogu publik", () => {
  it("fsheh profilet dhe shërbimet joaktive", () => {
    const result = visibleCatalog([
      { id: "aktiv", isActive: true, services: [{ service: { isActive: true } }, { service: { isActive: false } }] },
      { id: "joaktiv", isActive: false, services: [{ service: { isActive: true } }] },
    ]);
    expect(result).toHaveLength(1);
    expect(result[0]?.id).toBe("aktiv");
    expect(result[0]?.services).toHaveLength(1);
  });
});
