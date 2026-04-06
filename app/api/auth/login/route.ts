import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'zealthy_secret_123';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    const patient = await prisma.patient.findUnique({
      where: { email },
    });

    if (!patient) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, patient.password);
    if (!valid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = jwt.sign(
      { sub: patient.id, email: patient.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return NextResponse.json({
      token,
      patient: {
        id: patient.id,
        name: patient.name,
        email: patient.email,
      }
    });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}