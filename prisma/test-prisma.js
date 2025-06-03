const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  try {
    console.log('Testing Prisma connection...')
    const bolcher = await prisma.bolche.findMany()
    console.log('Success! Bolcher count:', bolcher.length)
    console.log('Bolcher:', bolcher)
  } catch (error) {
    console.error('Error details:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
