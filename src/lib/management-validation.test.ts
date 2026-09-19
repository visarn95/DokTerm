import { describe, expect, it } from "vitest";
import { parsePriceToCents, serviceSchema } from "@/lib/management-validation";

describe("validimi i shërbimeve", () => {
  const base = { name: "Kontroll", description: "Kontroll rutinor", durationMinutes: 30, priceCents: 2500, isActive: true };

  it("refuzon kohëzgjatjen zero ose negative", () => {
    expect(serviceSchema.safeParse({ ...base, durationMinutes: 0 }).success).toBe(false);
    expect(serviceSchema.safeParse({ ...base, durationMinutes: -10 }).success).toBe(false);
  });

  it("ruan çmimin në centë dhe refuzon çmimin negativ", () => {
    expect(parsePriceToCents("25.50")).toBe(2550);
    expect(() => parsePriceToCents("-1")).toThrow();
  });
});
