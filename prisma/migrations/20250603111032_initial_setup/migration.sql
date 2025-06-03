-- CreateTable
CREATE TABLE "bolcher" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "navn" TEXT NOT NULL,
    "farve" TEXT NOT NULL,
    "vaegt" INTEGER NOT NULL,
    "smagSurhed" TEXT NOT NULL,
    "smagStyrke" TEXT NOT NULL,
    "smagType" TEXT NOT NULL,
    "raavarepris" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
