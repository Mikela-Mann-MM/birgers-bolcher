// GET /api/bolcher - Hent alle bolcher
// POST /api/bolcher - Opret ny bolche

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    console.log('=== API ROUTE CALLED ===')
    console.log('Current working directory:', process.cwd())
    console.log('DATABASE_URL:', process.env.DATABASE_URL)
    
    // Test database connection
    await prisma.$connect()
    console.log('Prisma connected successfully')
    
    const bolcher = await prisma.bolche.findMany({
      orderBy: { createdAt: 'desc' }
    });
    
    console.log('Query successful, found:', bolcher.length, 'bolcher')
    return NextResponse.json(bolcher);
  } catch (error) {
    console.error('=== API ERROR ===')
    
    // Håndter TypeScript error type properly
    if (error instanceof Error) {
      console.error('Error message:', error.message)
      console.error('Error name:', error.name)
      console.error('Error stack:', error.stack)
      
      return NextResponse.json({ 
        error: 'Fejl ved hentning af bolcher', 
        details: error.message,
        name: error.name
      }, { status: 500 });
    } else {
      console.error('Unknown error:', error)
      return NextResponse.json({ 
        error: 'Ukendt fejl ved hentning af bolcher', 
        details: String(error)
      }, { status: 500 });
    }
  }
}