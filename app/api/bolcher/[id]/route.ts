// PUT /api/bolcher/[id] - Opdater bolche
// DELETE /api/bolcher/[id] - Slet bolche

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();
    
    // Opdater bolche i databasen
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
  try {
    const id = parseInt(params.id);
    
    // Slet bolche fra databasen
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