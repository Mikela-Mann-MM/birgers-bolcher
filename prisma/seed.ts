import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Opret nogle test-bolcher
  await prisma.bolche.createMany({
    data: [
      {
        navn: "Jordbær",
        farve: "Rød",
        vaegt: 11,
        smagSurhed: "Sødt",
        smagStyrke: "Mild",
        smagType: "Jordbær",
        raavarepris: 16
      },
      {
        navn: "Citron",
        farve: "Gul",
        vaegt: 10,
        smagSurhed: "Bittert",
        smagStyrke: "Mild",
        smagType: "Citron",
        raavarepris: 14
      }
    ]
  });
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });