CREATE TABLE "appointment" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "startsAt" DATETIME NOT NULL,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "patientId" TEXT NOT NULL,
  "dentistId" TEXT NOT NULL,
  "serviceId" TEXT NOT NULL,
  CONSTRAINT "appointment_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "appointment_dentistId_fkey" FOREIGN KEY ("dentistId") REFERENCES "dentistProfile" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "appointment_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "service" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "appointment_dentistId_startsAt_key" ON "appointment"("dentistId", "startsAt");
CREATE INDEX "appointment_patientId_idx" ON "appointment"("patientId");
CREATE INDEX "appointment_dentistId_idx" ON "appointment"("dentistId");
