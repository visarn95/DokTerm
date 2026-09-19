import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

const times = new Set(["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"]);

export async function POST(request: Request) {
  const session = await getCurrentSession();
  if (!session || session.user.role !== "PATIENT") return NextResponse.json({ error: "Duhet të kyçesh si pacient." }, { status: 401 });

  const body = await request.json().catch(() => null);
  const dentistId = typeof body?.dentistId === "string" ? body.dentistId : "";
  const serviceId = typeof body?.serviceId === "string" ? body.serviceId : "";
  const date = typeof body?.date === "string" ? body.date : "";
  const time = typeof body?.time === "string" ? body.time : "";
  if (!dentistId || !serviceId || !/^\d{4}-\d{2}-\d{2}$/.test(date) || !times.has(time)) return NextResponse.json({ error: "Zgjidh datën dhe orën e vlefshme." }, { status: 400 });

  const startsAt = new Date(`${date}T${time}:00`);
  if (Number.isNaN(startsAt.valueOf()) || startsAt <= new Date()) return NextResponse.json({ error: "Zgjidh një termin në të ardhmen." }, { status: 400 });

  const assignment = await prisma.dentistService.findUnique({ where: { dentistId_serviceId: { dentistId, serviceId } }, include: { dentist: true, service: true } });
  if (!assignment || !assignment.dentist.isActive || !assignment.service.isActive) return NextResponse.json({ error: "Ky shërbim nuk ofrohet nga stomatologu." }, { status: 404 });

  try {
    const appointment = await prisma.appointment.create({ data: { patientId: session.user.id, dentistId, serviceId, startsAt } });
    return NextResponse.json({ id: appointment.id }, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") return NextResponse.json({ error: "Ky orar sapo u rezervua. Zgjidh një orë tjetër." }, { status: 409 });
    return NextResponse.json({ error: "Rezervimi dështoi. Provo përsëri." }, { status: 500 });
  }
}
