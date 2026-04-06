import { NextResponse } from 'next/server';

const medications = ["Diovan", "Lexapro", "Metformin", "Ozempic", "Prozac", "Seroquel", "Tegretol"];
const dosages = ["1mg", "2mg", "3mg", "5mg", "10mg", "25mg", "50mg", "100mg", "250mg", "500mg", "1000mg"];

export async function GET() {
  return NextResponse.json({ medications, dosages });
}
