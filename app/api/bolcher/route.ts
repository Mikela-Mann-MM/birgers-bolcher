import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs'

export async function GET() {
  try {
    const bolcher = await prisma.bolche.findMany({
      orderBy: { createdAt: 'desc' }
    });
    
    return NextResponse.json(bolcher);
  } catch (error) {
    console.error('Fejl ved hentning af bolcher:', error);
    return NextResponse.json(
      { error: 'Kunne ikke hente bolcher' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { navn, farve, vaegt, smagSurhed, smagStyrke, smagType, raavarepris } = body;
    
    if (!navn || !farve || !smagType || vaegt <= 0) {
      return NextResponse.json(
        { error: 'Manglende eller ugyldige data' },
        { status: 400 }
      );
    }
    
    const nyBolche = await prisma.bolche.create({
      data: {
        navn,
        farve,
        vaegt: parseInt(vaegt),
        smagSurhed,
        smagStyrke,
        smagType,
        raavarepris: parseInt(raavarepris)
      }
    });
    
    return NextResponse.json(nyBolche, { status: 201 });
  } catch (error) {
    console.error('Fejl ved oprettelse af bolche:', error);
    return NextResponse.json(
      { error: 'Kunne ikke oprette bolche' },
      { status: 500 }
    );
  }
}