import Link from "next/link";

export function ToothLogo() {
  return (
    <span className="logo" aria-hidden="true">
      <svg width="23" height="23" viewBox="0 0 24 24" fill="none">
        <path d="M7.2 3.3c1.8-.7 3.1.5 4.8.5s3-1.2 4.8-.5c2.5 1 3 4 2 6.3-.8 1.7-1.3 2.8-1.6 5.6-.3 2.8-1.2 5.6-3 5.6-1.4 0-1.1-4.9-2.2-4.9s-.8 4.9-2.2 4.9c-1.8 0-2.7-2.8-3-5.6-.3-2.8-.8-3.9-1.6-5.6-1-2.3-.5-5.3 2-6.3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="shell">
      <section className="brand-side" aria-label="DokTerm">
        <Link href="/" className="brand" style={{ color: "inherit", textDecoration: "none" }}>
          <ToothLogo /> DokTerm
        </Link>
        <div className="brand-copy">
          <h1>Termini yt,<br />më lehtë.</h1>
          <p>Qasje e thjeshtë dhe e sigurt në kujdesin tënd stomatologjik.</p>
        </div>
      </section>
      <section className="form-side">{children}</section>
    </main>
  );
}
