"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";

const slots = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"];

export function BookingForm({ dentistId, serviceId }: { dentistId: string; serviceId: string }) {
  const router = useRouter();
  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const defaultDate = useMemo(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().slice(0, 10);
  }, []);
  const [date, setDate] = useState(defaultDate);
  const [time, setTime] = useState(slots[0]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function reserve(event: FormEvent) {
    event.preventDefault(); setLoading(true); setError("");
    const response = await fetch("/api/rezervime", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ dentistId, serviceId, date, time }) });
    const result = await response.json() as { error?: string };
    setLoading(false);
    if (!response.ok) { setError(result.error ?? "Rezervimi dështoi."); return; }
    setSuccess(true); router.refresh();
  }

  if (success) return <div className="alert alert-success" role="status">Termini u rezervua me sukses.</div>;
  return <form className="booking-form" onSubmit={reserve}><label>Data<input type="date" value={date} min={today} onChange={(event) => setDate(event.target.value)} required /></label><label>Ora<select value={time} onChange={(event) => setTime(event.target.value)}>{slots.map((slot) => <option key={slot}>{slot}</option>)}</select></label>{error && <div className="alert alert-error" role="alert">{error}</div>}<button className="primary" disabled={loading}>{loading ? "Duke rezervuar…" : "Konfirmo rezervimin"}</button></form>;
}
