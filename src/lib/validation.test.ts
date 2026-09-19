import { describe, expect, it } from "vitest";
import { registrationSchema } from "@/lib/validation";

const valid = { name: "Arta Krasniqi", email: "arta@example.com", password: "Fjalekalim-123", confirmPassword: "Fjalekalim-123" };

describe("registrationSchema", () => {
  it("pranon të dhëna të vlefshme dhe normalizon email-in", () => {
    expect(registrationSchema.parse({ ...valid, email: " ARTA@EXAMPLE.COM " }).email).toBe("arta@example.com");
  });

  it("refuzon fjalëkalimet që nuk përputhen", () => {
    const result = registrationSchema.safeParse({ ...valid, confirmPassword: "tjeter-123" });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.path).toEqual(["confirmPassword"]);
  });

  it("refuzon fjalëkalime më të shkurtra se tetë karaktere", () => {
    expect(registrationSchema.safeParse({ ...valid, password: "123", confirmPassword: "123" }).success).toBe(false);
  });
});
