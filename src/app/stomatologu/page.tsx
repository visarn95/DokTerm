import { PanelShell } from "@/components/panel-shell";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";

export default async function DentistPage() {
  const session = await requireRole("DENTIST");
  const profile = await prisma.dentistProfile.findUnique({ where: { userId: session.user.id }, include: { services: { include: { service: true }, orderBy: { service: { name: "asc" } } }, appointments: { include: { patient: true, service: true }, orderBy: { startsAt: "asc" } } } });

  return <PanelShell name={session.user.name} role="DENTIST">
    {!profile ? <section className="empty-panel"><h2>Profili ende nuk është krijuar</h2><p>Administrata duhet të krijojë profilin tënd profesional dhe të caktojë shërbimet.</p></section> :
      <section className="profile-panel"><div><span className={`status ${profile.isActive ? "active" : "inactive"}`}>{profile.isActive ? "Profil aktiv" : "Profil joaktiv"}</span><h2>{profile.specialization}</h2><p>{profile.bio}</p>{profile.phone && <p><strong>Telefoni:</strong> {profile.phone}</p>}</div>
        <div><h3>Shërbimet e caktuara</h3>{profile.services.length === 0 ? <p className="empty-state">Nuk të është caktuar ende asnjë shërbim.</p> : <ul className="service-list">{profile.services.map(({ service }) => <li key={service.id}><span><strong>{service.name}</strong><small>{service.isActive ? service.description : "Shërbim joaktiv"}</small></span><span>{service.durationMinutes} min{service.priceCents !== null && <> · {(service.priceCents / 100).toFixed(2)} €</>}</span></li>)}</ul>}</div>
        <div className="appointments-panel"><h3>Rezervimet e pacientëve</h3>{profile.appointments.length === 0 ? <p className="empty-state">Nuk ka ende termine të rezervuara.</p> : <ul className="appointment-list">{profile.appointments.map((appointment) => <li key={appointment.id}><span><strong>{appointment.patient.name}</strong><small>{appointment.service.name}</small></span><time dateTime={appointment.startsAt.toISOString()}>{new Intl.DateTimeFormat("sq-AL", { dateStyle: "medium", timeStyle: "short" }).format(appointment.startsAt)}</time></li>)}</ul>}</div>
      </section>}
  </PanelShell>;
}
