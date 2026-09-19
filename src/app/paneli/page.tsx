import { redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/session";
import { dashboardForRole } from "@/lib/roles";

export default async function PanelRedirect() {
  const session = await getCurrentSession();
  redirect(session ? dashboardForRole(session.user.role) : "/kycu");
}
