import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const appointments = await prisma.appointment.findMany({
      where: { patientId: parseInt(id) },
      orderBy: { dateTime: 'asc' },
    });
    return NextResponse.json(appointments);
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { providerName, dateTime, repeat, endDate } = await req.json();
    const appointment = await prisma.appointment.create({
      data: {
        providerName,
        dateTime: new Date(dateTime),
        repeat: repeat || null,
        endDate: endDate ? new Date(endDate) : null,
        patientId: parseInt(id),
      }
    });
    return NextResponse.json(appointment, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
