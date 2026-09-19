import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth-shell";
import { RegisterForm } from "@/components/register-form";
import { getCurrentSession } from "@/lib/session";
import { dashboardForRole } from "@/lib/roles";

export default async function RegisterPage() {
  const session = await getCurrentSession();
  if (session) redirect(dashboardForRole(session.user.role));
  return <AuthShell><RegisterForm /></AuthShell>;
}
