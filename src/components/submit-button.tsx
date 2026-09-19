"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return <button className="primary compact-button" type="submit" disabled={pending} aria-busy={pending}>{pending ? "Duke ruajtur…" : children}</button>;
}
