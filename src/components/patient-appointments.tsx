"use client";

import { useState } from "react";

type Appointment = { id: string; startsAt: string; reminder24h: boolean; reminder2h: boolean; dentist: string; service: string };

export function PatientAppointments({ appointments }: { appointments: Appointment[] }) {
  const [items, setItems] = useState(appointments);
  const [message, setMessage] = useState("");

  async function toggle(id: string, reminder: "24h" | "2h", enabled: boolean) {
    const response = await fetch(`/api/rezervime/${id}/kujtesa`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ reminder, enabled }) });
    if (!response.ok) { setMessage("Ndryshimi i kujtesës dështoi."); return; }
    setItems((current) => current.map((item) => item.id !== id ? item : { ...item, [reminder === "24h" ? "reminder24h" : "reminder2h"]: enabled }));
    setMessage(`Kujtesa ${reminder === "24h" ? "24 orë" : "2 orë"} para terminit u ${enabled ? "aktivizua" : "çaktivizua"}.`);
  }

  return <section className="patient-appointments"><div className="section-title"><div><h2>Terminet e mia</h2><p>Aktivizo kujtesat demonstrative për terminin tënd.</p></div></div>{message && <div className="alert alert-success" role="status">{message}</div>}{items.length === 0 ? <p className="empty-state">Nuk ke ende termine të rezervuara.</p> : <div className="appointment-grid">{items.map((item) => <article className="patient-appointment" key={item.id}><time>{new Intl.DateTimeFormat("sq-AL", { dateStyle: "medium", timeStyle: "short" }).format(new Date(item.startsAt))}</time><h3>{item.service}</h3><p>Stomatologu: {item.dentist}</p><div className="reminder-actions"><button className={item.reminder24h ? "reminder active" : "reminder"} onClick={() => toggle(item.id, "24h", !item.reminder24h)}>{item.reminder24h ? "✓ Kujtesa 24h aktive" : "Aktivizo kujtesën 24h"}</button><button className={item.reminder2h ? "reminder active" : "reminder"} onClick={() => toggle(item.id, "2h", !item.reminder2h)}>{item.reminder2h ? "✓ Kujtesa 2h aktive" : "Aktivizo kujtesën 2h"}</button></div></article>)}</div>}</section>;
}
