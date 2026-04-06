import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { providerName, dateTime, repeat, endDate } = await req.json();
    const appointment = await prisma.appointment.update({
      where: { id: parseInt(id) },
      data: {
        providerName,
        dateTime: new Date(dateTime),
        repeat: repeat || null,
        endDate: endDate ? new Date(endDate) : null,
      }
    });
    return NextResponse.json(appointment);
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.appointment.delete({ where: { id: parseInt(id) } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}