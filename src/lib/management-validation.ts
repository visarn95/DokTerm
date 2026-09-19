import { z } from "zod";

const optionalPhone = z.string().trim().max(30, "Numri është shumë i gjatë.").transform((v) => v || null);

export const dentistProfileSchema = z.object({
  userId: z.string().min(1, "Zgjidh një llogari stomatologu."),
  specialization: z.string().trim().min(2, "Shkruaj specializimin.").max(80),
  bio: z.string().trim().min(10, "Përshkrimi duhet të ketë së paku 10 karaktere.").max(500),
  phone: optionalPhone,
  isActive: z.boolean(),
});

export function parsePriceToCents(value: unknown): number | null {
  if (value === "" || value === null || value === undefined) return null;
  const normalized = String(value).trim().replace(",", ".");
  if (!/^\d+(\.\d{1,2})?$/.test(normalized)) throw new Error("Çmimi duhet të jetë zero ose numër pozitiv me deri në dy decimalë.");
  const cents = Math.round(Number(normalized) * 100);
  if (!Number.isSafeInteger(cents)) throw new Error("Çmimi është shumë i madh.");
  return cents;
}

export const serviceSchema = z.object({
  name: z.string().trim().min(2, "Shkruaj emrin e shërbimit.").max(100),
  description: z.string().trim().min(5, "Shkruaj një përshkrim të shkurtër.").max(300),
  durationMinutes: z.coerce.number().int("Kohëzgjatja duhet të jetë numër i plotë.").positive("Kohëzgjatja duhet të jetë pozitive.").max(480),
  priceCents: z.number().int().nonnegative().nullable(),
  isActive: z.boolean(),
});

export const serviceAssignmentSchema = z.object({
  dentistId: z.string().min(1),
  serviceIds: z.array(z.string().min(1)),
});
