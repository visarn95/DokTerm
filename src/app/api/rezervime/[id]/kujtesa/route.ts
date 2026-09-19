import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/session";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getCurrentSession();
  if (!session || session.user.role !== "PATIENT") return NextResponse.json({ error: "Duhet të kyçesh si pacient." }, { status: 401 });
  const { id } = await params;
  const body = await request.json().catch(() => null);
  const reminder = body?.reminder;
  const enabled = body?.enabled;
  if ((reminder !== "24h" && reminder !== "2h") || typeof enabled !== "boolean") return NextResponse.json({ error: "Kujtesa nuk është e vlefshme." }, { status: 400 });

  const appointment = await prisma.appointment.findFirst({ where: { id, patientId: session.user.id } });
  if (!appointment) return NextResponse.json({ error: "Termini nuk u gjet." }, { status: 404 });
  await prisma.appointment.update({ where: { id }, data: reminder === "24h" ? { reminder24h: enabled } : { reminder2h: enabled } });
  return NextResponse.json({ success: true });
}
