import { Role } from "@prisma/client";
import { hashPassword } from "better-auth/crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const demoAccounts = {
  PATIENT: {
    name: "Elira Hoxha",
    email: "pacient@dokterm.demo",
    password: "DokTermDemo2026",
  },
  DENTIST: {
    name: "Dr. Arben Kola",
    email: "stomatolog@dokterm.demo",
    password: "DokTermDemo2026",
  },
} as const;

const dentistServices = [
  { name: "Kontrollë dentare", description: "Vlerësim i plotë i shëndetit oral dhe plan trajtimi.", durationMinutes: 30, priceCents: 1500 },
  { name: "Pastrimi profesional", description: "Heqje e pllakës bakteriale dhe pastrim i dhëmbëve.", durationMinutes: 45, priceCents: 2500 },
  { name: "Mbushje dentare", description: "Trajtim i kariesit me material estetik kompozit.", durationMinutes: 60, priceCents: 3500 },
] as const;

type DemoRole = keyof typeof demoAccounts;

function isDemoRole(value: unknown): value is DemoRole {
  return value === "PATIENT" || value === "DENTIST";
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const role = body?.role;

  if (!isDemoRole(role)) {
    return NextResponse.json({ error: "Roli i demonstrimit nuk është i vlefshëm." }, { status: 400 });
  }

  const account = demoAccounts[role];
  let user = await prisma.user.findUnique({ where: { email: account.email } });

  if (!user) {
    const userId = crypto.randomUUID();
    const passwordHash = await hashPassword(account.password);
    user = await prisma.user.create({
      data: {
        id: userId,
        name: account.name,
        email: account.email,
        emailVerified: true,
        role: role as Role,
        accounts: {
          create: {
            id: crypto.randomUUID(),
            accountId: userId,
            providerId: "credential",
            password: passwordHash,
          },
        },
      },
    });
  }

  if (role === "DENTIST") {
    const profile = await prisma.dentistProfile.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        specialization: "Stomatologji e përgjithshme",
        bio: "Profil demonstrues për prezantimin e DokTerm.",
        phone: "+383 44 000 000",
      },
    });

    const services = await Promise.all(dentistServices.map((service) => prisma.service.upsert({
      where: { name: service.name },
      update: { ...service, isActive: true },
      create: { ...service, isActive: true },
    })));

    await prisma.$transaction(services.map((service) => prisma.dentistService.upsert({
      where: { dentistId_serviceId: { dentistId: profile.id, serviceId: service.id } },
      update: {},
      create: { dentistId: profile.id, serviceId: service.id },
    })));
  }

  return NextResponse.json({ email: account.email, password: account.password });
}
