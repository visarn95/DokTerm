import { PrismaClient, Role } from "@prisma/client";
import { hashPassword } from "better-auth/crypto";

const prisma = new PrismaClient();

async function main() {
  const name = process.env.TEST_USER_NAME?.trim();
  const email = process.env.TEST_USER_EMAIL?.trim().toLowerCase();
  const password = process.env.TEST_USER_PASSWORD;
  const role = process.env.TEST_USER_ROLE as Role | undefined;

  if (!name || !email || !password || !role) throw new Error("Vendos TEST_USER_NAME, TEST_USER_EMAIL, TEST_USER_PASSWORD dhe TEST_USER_ROLE.");
  if (!Object.values(Role).includes(role)) throw new Error("TEST_USER_ROLE duhet të jetë PATIENT, DENTIST ose ADMIN.");
  if (password.length < 8 || password.length > 128) throw new Error("Fjalëkalimi duhet të ketë 8–128 karaktere.");
  if (await prisma.user.findUnique({ where: { email } })) throw new Error("Ekziston tashmë një përdorues me këtë email.");

  const id = crypto.randomUUID();
  const passwordHash = await hashPassword(password);
  await prisma.$transaction([
    prisma.user.create({ data: { id, name, email, role, emailVerified: true } }),
    prisma.account.create({ data: { id: crypto.randomUUID(), accountId: id, providerId: "credential", userId: id, password: passwordHash } }),
  ]);

  console.log(`U krijua përdoruesi ${email} me rolin ${role}.`);
}

main().finally(() => prisma.$disconnect());
