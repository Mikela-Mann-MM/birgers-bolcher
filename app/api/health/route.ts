import { NextResponse } from 'next/server';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  // Skip database during build
  if (process.env.SKIP_DB_VALIDATION === 'true' && !process.env.DATABASE_URL) {
    return NextResponse.json({ 
      status: 'Build mode', 
      timestamp: new Date().toISOString(),
      database: 'skipped during build' 
    });
  }
  
  const { prisma } = await import('@/lib/prisma');
  
  try {
    await prisma.$queryRaw`SELECT 1`;
    
    return NextResponse.json({ 
      status: 'OK', 
      timestamp: new Date().toISOString(),
      database: 'connected'
    });
  } catch (error) {
    return NextResponse.json(
      { 
        status: 'ERROR', 
        timestamp: new Date().toISOString(),
        database: 'disconnected',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}