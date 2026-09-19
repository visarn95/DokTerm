"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function logout() {
    setLoading(true);
    await authClient.signOut();
    router.replace("/kycu");
    router.refresh();
  }

  return <button className="logout" type="button" onClick={logout} disabled={loading}>{loading ? "Duke dalë…" : "Dil"}</button>;
}
