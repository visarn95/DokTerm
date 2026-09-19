"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { loginSchema } from "@/lib/validation";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const form = new FormData(event.currentTarget);
    const parsed = loginSchema.safeParse({ email: form.get("email"), password: form.get("password") });

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Kontrollo të dhënat.");
      return;
    }

    setLoading(true);
    const result = await authClient.signIn.email(parsed.data);
    setLoading(false);

    if (result.error) {
      setError(result.error.status === 429 ? "Shumë tentativa. Prit një minutë dhe provo përsëri." : "Email-i ose fjalëkalimi është i pasaktë.");
      return;
    }

    router.push("/paneli");
    router.refresh();
  }

  return (
    <div className="card">
      <h2>Mirë se u ktheve</h2>
      <p className="subtitle">Kyçu për të vazhduar te paneli yt.</p>
      {error && <div className="alert alert-error" role="alert">{error}</div>}
      <form onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label htmlFor="email">Email-i</label>
          <input id="email" name="email" type="email" autoComplete="email" inputMode="email" required />
        </div>
        <div className="field">
          <label htmlFor="password">Fjalëkalimi</label>
          <input id="password" name="password" type="password" autoComplete="current-password" required />
        </div>
        <button className="primary" type="submit" disabled={loading} aria-busy={loading}>
          {loading ? "Duke u kyçur…" : "Kyçu"}
        </button>
      </form>
      <p className="switch">Nuk ke llogari? <Link href="/regjistrohu">Regjistrohu</Link></p>
    </div>
  );
}
