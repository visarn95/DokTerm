import { describe, expect, it } from "vitest";
import { dashboardForRole, isAppRole } from "@/lib/roles";

describe("rolet", () => {
  it.each([["PATIENT", "/pacienti"], ["DENTIST", "/stomatologu"], ["ADMIN", "/admin"]])("drejton %s vetëm te paneli përkatës", (role, route) => {
    expect(dashboardForRole(role)).toBe(route);
    expect(isAppRole(role)).toBe(true);
  });

  it("refuzon role të panjohura", () => {
    expect(isAppRole("SUPERADMIN")).toBe(false);
    expect(dashboardForRole("SUPERADMIN")).toBe("/kycu");
  });
});
