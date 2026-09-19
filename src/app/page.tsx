import Link from "next/link";
import { ToothLogo } from "@/components/auth-shell";

const roles = [
  { title: "Pacienti", text: "Krijon llogari dhe, në fazat e ardhshme, do të rezervojë termine sipas stomatologut dhe orarit të lirë." },
  { title: "Stomatologu", text: "Do të menaxhojë orarin dhe vizitat e veta nga një panel i dedikuar." },
  { title: "Administrata", text: "Do të menaxhojë përdoruesit, stomatologët, shërbimet dhe rezervimet." },
];

export default function Home() {
  return (
    <main className="landing">
      <nav className="landing-nav" aria-label="Navigimi kryesor">
        <Link href="/" className="brand landing-brand"><ToothLogo /> DokTerm</Link>
        <div className="nav-actions"><Link className="text-link" href="/kycu">Kyçu</Link><Link className="nav-primary" href="/regjistrohu">Regjistrohu</Link></div>
      </nav>
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">Platformë për klinika stomatologjike</span>
          <h1>Termini yt,<br /><span>më lehtë.</span></h1>
          <p>DokTerm është ideja për një mënyrë më të thjeshtë të rezervimit dhe menaxhimit të termineve stomatologjike — për pacientë, stomatologë dhe administratë.</p>
          <div className="hero-actions"><Link className="hero-primary" href="/regjistrohu">Krijo llogari si pacient</Link><a className="hero-secondary" href="#si-funksionon">Shiko si funksionon</a></div>
        </div>
        <div className="concept-card" aria-label="Rrjedha e DokTerm">
          <span className="concept-label">Ideja në 3 hapa</span>
          <ol>
            <li><b>1</b><div><strong>Zgjidh</strong><span>stomatologun dhe shërbimin</span></div></li>
            <li><b>2</b><div><strong>Rezervo</strong><span>një orar të lirë</span></div></li>
            <li><b>3</b><div><strong>Menaxho</strong><span>terminin nga paneli yt</span></div></li>
          </ol>
          <p className="concept-note">Rezervimet do të implementohen në modulin e ardhshëm.</p>
        </div>
      </section>
      <section className="explain" id="si-funksionon">
        <div className="section-heading"><span className="eyebrow">Një platformë, tri përvoja</span><h2>Secili përdorues sheh vetëm atë që i nevojitet.</h2></div>
        <div className="role-grid">
          {roles.map((role, index) => <article className="role-card" key={role.title}><span className="role-number">0{index + 1}</span><h3>{role.title}</h3><p>{role.text}</p></article>)}
        </div>
      </section>
      <section className="module-banner">
        <div><span className="eyebrow">Moduli i parë</span><h2>Autentikim i qartë dhe role të ndara.</h2></div>
        <p>Prototipi demonstron regjistrimin e pacientit, kyçjen, daljen dhe panelet e veçanta për pacientin, stomatologun dhe administratorin.</p>
      </section>
      <footer className="landing-footer"><div className="brand landing-brand"><ToothLogo /> DokTerm</div><p>Termini yt, më lehtë.</p></footer>
    </main>
  );
}
