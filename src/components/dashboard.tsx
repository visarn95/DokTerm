import { LogoutButton } from "@/components/logout-button";
import { ToothLogo } from "@/components/auth-shell";
import { roleLabel, type AppRole } from "@/lib/roles";

export function Dashboard({ name, role }: { name: string; role: AppRole }) {
  return (
    <main className="dashboard">
      <header className="topbar">
        <div className="brand"><ToothLogo /> DokTerm</div>
        <LogoutButton />
      </header>
      <section className="dashboard-card">
        <span className="eyebrow">{roleLabel[role]}</span>
        <h1>Përshëndetje, {name}</h1>
        <p>Je kyçur në panelin tënd si {roleLabel[role].toLowerCase()}.</p>
      </section>
    </main>
  );
}
