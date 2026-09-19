export type AppRole = "PATIENT" | "DENTIST" | "ADMIN";

export const dashboardByRole: Record<AppRole, string> = {
  PATIENT: "/pacienti",
  DENTIST: "/stomatologu",
  ADMIN: "/admin",
};

export const roleLabel: Record<AppRole, string> = {
  PATIENT: "Pacient",
  DENTIST: "Stomatolog",
  ADMIN: "Administrator",
};

export function isAppRole(value: unknown): value is AppRole {
  return value === "PATIENT" || value === "DENTIST" || value === "ADMIN";
}

export function dashboardForRole(value: unknown): string {
  return isAppRole(value) ? dashboardByRole[value] : "/kycu";
}
