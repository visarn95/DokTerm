# DokTerm

**Termini yt, më lehtë.** Ky version përmban modulin e autentikimit dhe autorizimit sipas roleve.

## Nisja lokale

Kërkohen Node.js 20+ dhe pnpm.

```bash
pnpm install
Copy-Item .env.example .env
pnpm prisma migrate dev --name init
pnpm dev
```

Plotëso `BETTER_AUTH_SECRET` në `.env` me një vlerë të rastësishme prej së paku 32 bajtësh. Aplikacioni hapet në `http://localhost:3000`.

## Llogaritë për testim

Regjistrimi në `/regjistrohu` krijon gjithmonë vetëm një `PATIENT`. Për të krijuar lokalisht një llogari me cilindo rol, vendos përkohësisht këto variabla në `.env`:

```dotenv
TEST_USER_NAME="Emri Mbiemri"
TEST_USER_EMAIL="test@example.com"
TEST_USER_PASSWORD="nje-fjalekalim-i-forte"
TEST_USER_ROLE="DENTIST"
```

Pastaj ekzekuto:

```bash
pnpm user:create
```

Rolet e lejuara janë `PATIENT`, `DENTIST` dhe `ADMIN`. Skripti punon vetëm nga terminali, nuk ekspozohet si endpoint publik dhe ruan vetëm hash-in e fjalëkalimit. Hiqi kredencialet e testit nga `.env` pas krijimit.

## Verifikimi

```bash
pnpm test
pnpm build
```

Sesioni ruhet në databazë dhe shfletuesi mban cookie-n e sigurt `HttpOnly`. Faqet e roleve kontrollojnë sesionin dhe rolin në server në çdo kërkesë.
