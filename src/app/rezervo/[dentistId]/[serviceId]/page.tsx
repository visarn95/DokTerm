import Link from "next/link";
import { notFound } from "next/navigation";
import { BookingForm } from "@/components/booking-form";
import { PanelShell } from "@/components/panel-shell";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";

export default async function BookingPage({ params }: { params: Promise<{ dentistId: string; serviceId: string }> }) {
  const session = await requireRole("PATIENT");
  const { dentistId, serviceId } = await params;
  const assignment = await prisma.dentistService.findUnique({ where: { dentistId_serviceId: { dentistId, serviceId } }, include: { dentist: { include: { user: true } }, service: true } });
  if (!assignment || !assignment.dentist.isActive || !assignment.service.isActive) notFound();
  return <PanelShell name={session.user.name} role="PATIENT"><section className="booking-card"><Link href="/pacienti">← Kthehu te stomatologët</Link><span className="eyebrow">Rezervo termin</span><h2>{assignment.service.name}</h2><p>Me {assignment.dentist.user.name} · {assignment.service.durationMinutes} min{assignment.service.priceCents !== null && <> · {(assignment.service.priceCents / 100).toFixed(2)} €</>}</p><BookingForm dentistId={dentistId} serviceId={serviceId} /></section></PanelShell>;
}
