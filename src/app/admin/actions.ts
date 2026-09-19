"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";
import { dentistProfileSchema, parsePriceToCents, serviceAssignmentSchema, serviceSchema } from "@/lib/management-validation";

function checked(form: FormData, key: string) { return form.get(key) === "on"; }
function done(message: string): never { redirect(`/admin?sukses=${encodeURIComponent(message)}`); }
function fail(message: string): never { redirect(`/admin?gabim=${encodeURIComponent(message)}`); }
function prismaMessage(error: unknown) {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002" ? "Ky rekord ekziston tashmë." : "Veprimi dështoi. Provo përsëri.";
}

export async function createDentist(form: FormData) {
  await requireRole("ADMIN");
  const parsed = dentistProfileSchema.safeParse({ userId: form.get("userId"), specialization: form.get("specialization"), bio: form.get("bio"), phone: form.get("phone"), isActive: checked(form, "isActive") });
  if (!parsed.success) fail(parsed.error.issues[0]?.message ?? "Të dhënat nuk janë të vlefshme.");
  const user = await prisma.user.findFirst({ where: { id: parsed.data.userId, role: "DENTIST", dentistProfile: null } });
  if (!user) fail("Llogaria nuk është stomatolog ose ka tashmë profil.");
  try { await prisma.dentistProfile.create({ data: parsed.data }); } catch (error) { fail(prismaMessage(error)); }
  revalidatePath("/admin"); done("Profili u krijua.");
}

export async function updateDentist(form: FormData) {
  await requireRole("ADMIN");
  const id = String(form.get("id") ?? "");
  const parsed = dentistProfileSchema.omit({ userId: true }).safeParse({ specialization: form.get("specialization"), bio: form.get("bio"), phone: form.get("phone"), isActive: checked(form, "isActive") });
  if (!id || !parsed.success) fail(parsed.error?.issues[0]?.message ?? "Profili nuk është i vlefshëm.");
  try { await prisma.dentistProfile.update({ where: { id }, data: parsed.data }); } catch { fail("Profili nuk u gjet."); }
  revalidatePath("/admin"); revalidatePath("/pacienti"); done("Profili u përditësua.");
}

function serviceData(form: FormData) {
  let priceCents: number | null;
  try { priceCents = parsePriceToCents(form.get("price")); } catch (error) { fail(error instanceof Error ? error.message : "Çmimi nuk është i vlefshëm."); }
  const parsed = serviceSchema.safeParse({ name: form.get("name"), description: form.get("description"), durationMinutes: form.get("durationMinutes"), priceCents, isActive: checked(form, "isActive") });
  if (!parsed.success) fail(parsed.error.issues[0]?.message ?? "Të dhënat nuk janë të vlefshme.");
  return parsed.data;
}

export async function createService(form: FormData) {
  await requireRole("ADMIN");
  const data = serviceData(form);
  try { await prisma.service.create({ data }); } catch (error) { fail(prismaMessage(error)); }
  revalidatePath("/admin"); done("Shërbimi u krijua.");
}

export async function updateService(form: FormData) {
  await requireRole("ADMIN");
  const id = String(form.get("id") ?? "");
  if (!id) fail("Shërbimi nuk u gjet.");
  const data = serviceData(form);
  try { await prisma.service.update({ where: { id }, data }); } catch (error) { fail(prismaMessage(error)); }
  revalidatePath("/admin"); revalidatePath("/pacienti"); done("Shërbimi u përditësua.");
}

export async function assignServices(form: FormData) {
  await requireRole("ADMIN");
  const parsed = serviceAssignmentSchema.safeParse({ dentistId: form.get("dentistId"), serviceIds: form.getAll("serviceIds") });
  if (!parsed.success) fail("Përzgjedhja nuk është e vlefshme.");
  const serviceIds = [...new Set(parsed.data.serviceIds)];
  const [dentist, count] = await Promise.all([
    prisma.dentistProfile.findUnique({ where: { id: parsed.data.dentistId } }),
    prisma.service.count({ where: { id: { in: serviceIds } } }),
  ]);
  if (!dentist || count !== serviceIds.length) fail("Profili ose një shërbim nuk ekziston.");
  await prisma.$transaction([
    prisma.dentistService.deleteMany({ where: { dentistId: parsed.data.dentistId } }),
    prisma.dentistService.createMany({ data: serviceIds.map((serviceId) => ({ dentistId: parsed.data.dentistId, serviceId })) }),
  ]);
  revalidatePath("/admin"); revalidatePath("/pacienti"); done("Shërbimet u caktuan.");
}
