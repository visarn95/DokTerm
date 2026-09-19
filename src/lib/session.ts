import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { dashboardForRole, isAppRole, type AppRole } from "@/lib/roles";

export async function getCurrentSession() {
  return auth.api.getSession({ headers: await headers() });
}

export async function requireRole(expectedRole: AppRole) {
  const session = await getCurrentSession();

  if (!session) redirect("/kycu");

  const role = session.user.role;
  if (!isAppRole(role)) redirect("/kycu");
  if (role !== expectedRole) redirect(dashboardForRole(role));

  return { ...session, user: { ...session.user, role } };
}
