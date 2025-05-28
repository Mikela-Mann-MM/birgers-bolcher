import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  // Skip database during build
  if (process.env.SKIP_DB_VALIDATION === 'true' && !process.env.DATABASE_URL) {
    return NextResponse.json({ status: 'Build mode' });
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

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Skip database during build
  if (process.env.SKIP_DB_VALIDATION === 'true' && !process.env.DATABASE_URL) {
    return NextResponse.json({ status: 'Build mode' });
  }
  
  const { prisma } = await import('@/lib/prisma');
  
  try {
    const id = parseInt(params.id);
    const body = await request.json();
    
    const opdateretBolche = await prisma.bolche.update({
      where: { id },
      data: {
        ...body,
        vaegt: body.vaegt ? parseInt(body.vaegt) : undefined,
        raavarepris: body.raavarepris ? parseInt(body.raavarepris) : undefined
      }
    });
    
    return NextResponse.json(opdateretBolche);
  } catch (error) {
    console.error('Fejl ved opdatering af bolche:', error);
    return NextResponse.json(
      { error: 'Kunne ikke opdatere bolche' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Skip database during build
  if (process.env.SKIP_DB_VALIDATION === 'true' && !process.env.DATABASE_URL) {
    return NextResponse.json({ status: 'Build mode' });
  }
  
  const { prisma } = await import('@/lib/prisma');
  
  try {
    const id = parseInt(params.id);
    
    await prisma.bolche.delete({
      where: { id }
    });
    
    return NextResponse.json({ message: 'Bolche slettet' });
  } catch (error) {
    console.error('Fejl ved sletning af bolche:', error);
    return NextResponse.json(
      { error: 'Kunne ikke slette bolche' },
      { status: 500 }
    );
  }
}