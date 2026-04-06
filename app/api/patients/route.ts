import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    const patients = await prisma.patient.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        dateOfBirth: true,
        phone: true,
        createdAt: true,
        _count: {
          select: {
            appointments: true,
            prescriptions: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(patients);
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, dateOfBirth, phone } = await req.json();
    const hashedPassword = await bcrypt.hash(password, 10);
    const patient = await prisma.patient.create({
      data: { name, email, password: hashedPassword, dateOfBirth, phone }
    });
    return NextResponse.json(patient, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Email already in use' }, { status: 400 });
  }
}
