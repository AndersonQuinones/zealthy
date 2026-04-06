import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const prescriptions = await prisma.prescription.findMany({
      where: { patientId: parseInt(id) },
      orderBy: { refillDate: 'asc' },
    });
    return NextResponse.json(prescriptions);
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { medication, dosage, quantity, refillDate, refillSchedule } = await req.json();
    const prescription = await prisma.prescription.create({
      data: {
        medication,
        dosage,
        quantity: parseInt(quantity),
        refillDate: new Date(refillDate),
        refillSchedule,
        patientId: parseInt(id),
      }
    });
    return NextResponse.json(prescription, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}