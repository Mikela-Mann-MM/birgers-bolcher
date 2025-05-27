
// GET /api/bolcher - Hent alle bolcher
// POST /api/bolcher - Opret ny bolche

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Hent alle bolcher fra databasen
    const bolcher = await prisma.bolche.findMany({
      orderBy: { createdAt: 'desc' } // Nyeste først
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
    
    // Valider at alle påkrævede felter er til stede
    const { navn, farve, vaegt, smagSurhed, smagStyrke, smagType, raavarepris } = body;
    
    if (!navn || !farve || !smagType || vaegt <= 0) {
      return NextResponse.json(
        { error: 'Manglende eller ugyldige data' },
        { status: 400 }
      );
    }
    
    // Opret ny bolche i databasen
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