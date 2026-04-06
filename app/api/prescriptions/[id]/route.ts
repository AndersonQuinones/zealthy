import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { medication, dosage, quantity, refillDate, refillSchedule } = await req.json();
    const prescription = await prisma.prescription.update({
      where: { id: parseInt(id) },
      data: { medication, dosage, quantity: parseInt(quantity), refillDate: new Date(refillDate), refillSchedule }
    });
    return NextResponse.json(prescription);
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.prescription.delete({ where: { id: parseInt(id) } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
