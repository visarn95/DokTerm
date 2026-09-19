"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

type DemoRole = "PATIENT" | "DENTIST";

export function DemoLoginButtons() {
  const router = useRouter();
  const [loadingRole, setLoadingRole] = useState<DemoRole | null>(null);
  const [error, setError] = useState("");

  async function enterDemo(role: DemoRole) {
    setLoadingRole(role);
    setError("");

    try {
      const response = await fetch("/api/demo-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      const account = (await response.json()) as { email?: string; password?: string; error?: string };
      if (!response.ok || !account.email || !account.password) throw new Error(account.error ?? "Hyrja demonstruese dështoi.");

      const result = await authClient.signIn.email({ email: account.email, password: account.password });
      if (result.error) throw new Error("Hyrja demonstruese dështoi.");

      router.push(role === "PATIENT" ? "/pacienti" : "/stomatologu");
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Hyrja demonstruese dështoi.");
      setLoadingRole(null);
    }
  }

  return <section className="demo-login" aria-label="Hyrje e shpejtë për demonstrim">
    <p>Hyrje e shpejtë për prezantim</p>
    {error && <div className="alert alert-error" role="alert">{error}</div>}
    <div className="demo-actions">
      <button type="button" onClick={() => enterDemo("PATIENT")} disabled={loadingRole !== null}>
        {loadingRole === "PATIENT" ? "Duke u kyçur…" : "Hyr si pacient"}
      </button>
      <button type="button" onClick={() => enterDemo("DENTIST")} disabled={loadingRole !== null}>
        {loadingRole === "DENTIST" ? "Duke u kyçur…" : "Hyr si stomatolog"}
      </button>
    </div>
  </section>;
}
