"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { registrationSchema } from "@/lib/validation";

export function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const form = new FormData(event.currentTarget);
    const data = { name: form.get("name"), email: form.get("email"), password: form.get("password"), confirmPassword: form.get("confirmPassword") };
    const parsed = registrationSchema.safeParse(data);

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Kontrollo të dhënat.");
      return;
    }

    setLoading(true);
    const response = await fetch("/api/regjistrohu", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data),
    });
    const result = (await response.json()) as { error?: string };
    setLoading(false);

    if (!response.ok) {
      setError(result.error ?? "Regjistrimi dështoi. Provo përsëri.");
      return;
    }

    router.push("/kycu?regjistruar=1");
  }

  return (
    <div className="card">
      <h2>Krijo llogari</h2>
      <p className="subtitle">Regjistrohu si pacient në DokTerm.</p>
      {error && <div className="alert alert-error" role="alert">{error}</div>}
      <form onSubmit={handleSubmit} noValidate>
        <div className="field"><label htmlFor="name">Emri dhe mbiemri</label><input id="name" name="name" type="text" autoComplete="name" minLength={2} maxLength={80} required /></div>
        <div className="field"><label htmlFor="email">Email-i</label><input id="email" name="email" type="email" autoComplete="email" inputMode="email" required /></div>
        <div className="field">
          <label htmlFor="password">Fjalëkalimi</label><input id="password" name="password" type="password" autoComplete="new-password" minLength={8} maxLength={128} aria-describedby="password-hint" required />
          <small id="password-hint" style={{ color: "var(--muted)" }}>Së paku 8 karaktere.</small>
        </div>
        <div className="field"><label htmlFor="confirmPassword">Konfirmo fjalëkalimin</label><input id="confirmPassword" name="confirmPassword" type="password" autoComplete="new-password" required /></div>
        <button className="primary" type="submit" disabled={loading} aria-busy={loading}>{loading ? "Duke krijuar llogarinë…" : "Regjistrohu"}</button>
      </form>
      <p className="switch">Ke tashmë llogari? <Link href="/kycu">Kyçu</Link></p>
    </div>
  );
}
