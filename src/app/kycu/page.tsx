import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth-shell";
import { LoginForm } from "@/components/login-form";
import { getCurrentSession } from "@/lib/session";
import { dashboardForRole } from "@/lib/roles";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ regjistruar?: string }> }) {
  const session = await getCurrentSession();
  if (session) redirect(dashboardForRole(session.user.role));
  const params = await searchParams;

  return (
    <AuthShell>
      <div style={{ width: "min(100%, 29rem)" }}>
        {params.regjistruar === "1" && <div className="alert alert-success" role="status">Llogaria u krijua. Tani mund të kyçesh.</div>}
        <LoginForm />
      </div>
    </AuthShell>
  );
}
