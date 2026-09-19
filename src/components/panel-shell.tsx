import Link from "next/link";
import { LogoutButton } from "@/components/logout-button";
import { ToothLogo } from "@/components/auth-shell";
import { roleLabel, type AppRole } from "@/lib/roles";

export function PanelShell({ name, role, children }: { name: string; role: AppRole; children: React.ReactNode }) {
  return <main className="dashboard">
    <header className="topbar panel-topbar">
      <Link href="/" className="brand landing-brand"><ToothLogo /> DokTerm</Link>
      <nav className="panel-nav">
        {role === "PATIENT" && <Link href="/pacienti">Stomatologët</Link>}
        {role === "DENTIST" && <Link href="/stomatologu">Profili im</Link>}
        {role === "ADMIN" && <Link href="/admin">Menaxhimi</Link>}
        <LogoutButton />
      </nav>
    </header>
    <section className="panel-heading"><span className="eyebrow">{roleLabel[role]}</span><h1>Përshëndetje, {name}</h1></section>
    {children}
  </main>;
}
