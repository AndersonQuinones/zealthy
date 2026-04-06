import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const patient = await prisma.patient.findUnique({
      where: { id: parseInt(id) },
      include: {
        appointments: { orderBy: { dateTime: 'asc' } },
        prescriptions: { orderBy: { refillDate: 'asc' } },
      }
    });
    if (!patient) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(patient);
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await req.json();
    const patient = await prisma.patient.update({
      where: { id: parseInt(id) },
      data: { name: data.name, email: data.email, dateOfBirth: data.dateOfBirth, phone: data.phone }
    });
    return NextResponse.json(patient);
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
