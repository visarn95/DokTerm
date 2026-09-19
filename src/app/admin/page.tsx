import { PanelShell } from "@/components/panel-shell";
import { SubmitButton } from "@/components/submit-button";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";
import { assignServices, createDentist, createService, updateDentist, updateService } from "./actions";

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ sukses?: string; gabim?: string }> }) {
  const session = await requireRole("ADMIN");
  const params = await searchParams;
  const [eligibleUsers, dentists, services] = await Promise.all([
    prisma.user.findMany({ where: { role: "DENTIST", dentistProfile: null }, orderBy: { name: "asc" } }),
    prisma.dentistProfile.findMany({ include: { user: true, services: true }, orderBy: { user: { name: "asc" } } }),
    prisma.service.findMany({ orderBy: { name: "asc" } }),
  ]);

  return <PanelShell name={session.user.name} role="ADMIN">
    {params.sukses && <div className="alert alert-success panel-alert" role="status">{params.sukses}</div>}
    {params.gabim && <div className="alert alert-error panel-alert" role="alert">{params.gabim}</div>}
    <div className="management-grid">
      <section className="management-section">
        <h2>Stomatologët</h2><p>Krijo profil për një llogari ekzistuese me rolin DENTIST.</p>
        <form action={createDentist} className="management-form">
          <label>Llogaria<select name="userId" required defaultValue=""><option value="" disabled>Zgjidh stomatologun</option>{eligibleUsers.map((u) => <option value={u.id} key={u.id}>{u.name} — {u.email}</option>)}</select></label>
          {eligibleUsers.length === 0 && <small>Nuk ka llogari DENTIST pa profil.</small>}
          <label>Specializimi<input name="specialization" required maxLength={80} /></label>
          <label>Përshkrimi profesional<textarea name="bio" required minLength={10} maxLength={500} /></label>
          <label>Telefoni, opsional<input name="phone" type="tel" maxLength={30} /></label>
          <label className="check"><input name="isActive" type="checkbox" defaultChecked /> Profil aktiv</label>
          <SubmitButton>Krijo profilin</SubmitButton>
        </form>
        <div className="record-list">
          {dentists.length === 0 && <p className="empty-state">Nuk ka profile stomatologësh.</p>}
          {dentists.map((dentist) => <details className="record-card" key={dentist.id}>
            <summary><span><strong>{dentist.user.name}</strong><small>{dentist.specialization} · {dentist.isActive ? "Aktiv" : "Joaktiv"}</small></span><span>Ndrysho</span></summary>
            <form action={updateDentist} className="management-form"><input type="hidden" name="id" value={dentist.id} /><p className="readonly">{dentist.user.email}</p>
              <label>Specializimi<input name="specialization" required defaultValue={dentist.specialization} /></label><label>Përshkrimi<textarea name="bio" required defaultValue={dentist.bio} /></label><label>Telefoni<input name="phone" type="tel" defaultValue={dentist.phone ?? ""} /></label>
              <label className="check"><input name="isActive" type="checkbox" defaultChecked={dentist.isActive} /> Profil aktiv</label><SubmitButton>Ruaj profilin</SubmitButton>
            </form>
            <form action={assignServices} className="management-form assignment"><input type="hidden" name="dentistId" value={dentist.id} /><h3>Shërbimet e caktuara</h3>
              {services.length === 0 ? <p className="empty-state">Krijo fillimisht një shërbim.</p> : services.map((service) => <label className="check" key={service.id}><input type="checkbox" name="serviceIds" value={service.id} defaultChecked={dentist.services.some((item) => item.serviceId === service.id)} /> {service.name}{!service.isActive && " (joaktiv)"}</label>)}
              <SubmitButton>Ruaj shërbimet</SubmitButton>
            </form>
          </details>)}
        </div>
      </section>

      <section className="management-section">
        <h2>Shërbimet</h2><p>Shto dhe menaxho shërbimet e klinikës.</p>
        <form action={createService} className="management-form">
          <label>Emri<input name="name" required maxLength={100} /></label><label>Përshkrimi<textarea name="description" required minLength={5} maxLength={300} /></label>
          <div className="form-row"><label>Kohëzgjatja (min)<input name="durationMinutes" type="number" min="1" max="480" step="1" required /></label><label>Çmimi (€), opsional<input name="price" type="number" min="0" step="0.01" /></label></div>
          <label className="check"><input name="isActive" type="checkbox" defaultChecked /> Shërbim aktiv</label><SubmitButton>Krijo shërbimin</SubmitButton>
        </form>
        <div className="record-list">
          {services.length === 0 && <p className="empty-state">Nuk ka shërbime.</p>}
          {services.map((service) => <details className="record-card" key={service.id}><summary><span><strong>{service.name}</strong><small>{service.durationMinutes} min · {service.isActive ? "Aktiv" : "Joaktiv"}</small></span><span>Ndrysho</span></summary>
            <form action={updateService} className="management-form"><input type="hidden" name="id" value={service.id} /><label>Emri<input name="name" required defaultValue={service.name} /></label><label>Përshkrimi<textarea name="description" required defaultValue={service.description} /></label>
              <div className="form-row"><label>Kohëzgjatja (min)<input name="durationMinutes" type="number" min="1" step="1" required defaultValue={service.durationMinutes} /></label><label>Çmimi (€)<input name="price" type="number" min="0" step="0.01" defaultValue={service.priceCents === null ? "" : (service.priceCents / 100).toFixed(2)} /></label></div>
              <label className="check"><input name="isActive" type="checkbox" defaultChecked={service.isActive} /> Shërbim aktiv</label><SubmitButton>Ruaj shërbimin</SubmitButton>
            </form>
          </details>)}
        </div>
      </section>
    </div>
  </PanelShell>;
}
