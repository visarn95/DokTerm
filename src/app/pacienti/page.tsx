import { PanelShell } from "@/components/panel-shell";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";

export default async function PatientPage({ searchParams }: { searchParams: Promise<{ q?: string; specializimi?: string; sherbimi?: string }> }) {
  const session = await requireRole("PATIENT");
  const params = await searchParams;
  const q = params.q?.trim() ?? "";
  const specialization = params.specializimi?.trim() ?? "";
  const serviceId = params.sherbimi?.trim() ?? "";
  const [dentists, specializationRows, services] = await Promise.all([
    prisma.dentistProfile.findMany({
      where: {
        isActive: true,
        ...(q && { user: { name: { contains: q } } }),
        ...(specialization && { specialization }),
        ...(serviceId && { services: { some: { serviceId, service: { isActive: true } } } }),
      },
      include: { user: true, services: { where: { service: { isActive: true } }, include: { service: true }, orderBy: { service: { name: "asc" } } } },
      orderBy: { user: { name: "asc" } },
    }),
    prisma.dentistProfile.findMany({ where: { isActive: true }, select: { specialization: true }, distinct: ["specialization"], orderBy: { specialization: "asc" } }),
    prisma.service.findMany({ where: { isActive: true, dentists: { some: { dentist: { isActive: true } } } }, orderBy: { name: "asc" } }),
  ]);

  return <PanelShell name={session.user.name} role="PATIENT">
    <section className="catalog-section">
      <div className="section-title"><div><h2>Gjej stomatologun</h2><p>Shiko profilet dhe shërbimet aktive të klinikës.</p></div></div>
      <form className="filters" method="get">
        <label>Kërko sipas emrit<input name="q" type="search" defaultValue={q} placeholder="p.sh. Arta Krasniqi" /></label>
        <label>Specializimi<select name="specializimi" defaultValue={specialization}><option value="">Të gjitha</option>{specializationRows.map((row) => <option key={row.specialization}>{row.specialization}</option>)}</select></label>
        <label>Shërbimi<select name="sherbimi" defaultValue={serviceId}><option value="">Të gjitha</option>{services.map((service) => <option value={service.id} key={service.id}>{service.name}</option>)}</select></label>
        <button className="filter-button" type="submit">Filtro</button>
      </form>
      <div className="catalog-grid">
        {dentists.length === 0 && <p className="empty-state wide">Nuk u gjet asnjë stomatolog me këta filtra.</p>}
        {dentists.map((dentist) => <article className="dentist-card" key={dentist.id}>
          <span className="avatar" aria-hidden="true">{dentist.user.name.charAt(0).toUpperCase()}</span><h3>{dentist.user.name}</h3><p className="specialization">{dentist.specialization}</p>
          <details><summary>Hap profilin</summary><p>{dentist.bio}</p>{dentist.phone && <p><strong>Telefoni:</strong> {dentist.phone}</p>}<h4>Shërbimet</h4>
            {dentist.services.length === 0 ? <p>Nuk ka shërbime aktive.</p> : <ul className="service-list">{dentist.services.map(({ service }) => <li key={service.id}><span><strong>{service.name}</strong><small>{service.description}</small></span><span>{service.durationMinutes} min{service.priceCents !== null && <> · {(service.priceCents / 100).toFixed(2)} €</>}</span></li>)}</ul>}
          </details>
        </article>)}
      </div>
    </section>
  </PanelShell>;
}
