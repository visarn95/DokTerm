CREATE TABLE "dentistProfile" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "specialization" TEXT NOT NULL,
  "bio" TEXT NOT NULL,
  "phone" TEXT,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL,
  CONSTRAINT "dentistProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE "service" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "durationMinutes" INTEGER NOT NULL,
  "priceCents" INTEGER,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL
);

CREATE TABLE "dentistService" (
  "dentistId" TEXT NOT NULL,
  "serviceId" TEXT NOT NULL,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("dentistId", "serviceId"),
  CONSTRAINT "dentistService_dentistId_fkey" FOREIGN KEY ("dentistId") REFERENCES "dentistProfile" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "dentistService_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "service" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "dentistProfile_userId_key" ON "dentistProfile"("userId");
CREATE INDEX "dentistProfile_specialization_idx" ON "dentistProfile"("specialization");
CREATE UNIQUE INDEX "service_name_key" ON "service"("name");
CREATE INDEX "dentistService_serviceId_idx" ON "dentistService"("serviceId");
