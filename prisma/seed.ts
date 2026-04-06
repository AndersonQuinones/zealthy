import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcryptjs';
import * as fs from 'fs';

const adapter = new PrismaPg({
  connectionString: 'postgresql://postgres:postgres123@localhost:5432/zealthy?schema=public',
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const data = JSON.parse(fs.readFileSync('./prisma/seed-data.json', 'utf-8'));

  for (const user of data.users) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const created = await prisma.patient.create({
      data: {
        name: user.name,
        email: user.email,
        password: hashedPassword,
      },
    });

    // seed appointments
    for (const apt of user.appointments || []) {
      await prisma.appointment.create({
        data: {
          providerName: apt.provider,
          dateTime: new Date(apt.datetime),
          repeat: apt.repeat,
          patientId: created.id,
        },
      });
    }

    // seed prescriptions
    for (const rx of user.prescriptions || []) {
      await prisma.prescription.create({
        data: {
          medication: rx.medication,
          dosage: rx.dosage,
          quantity: rx.quantity,
          refillDate: new Date(rx.refill_on),
          refillSchedule: rx.refill_schedule,
          patientId: created.id,
        },
      });
    }
  }

  console.log('Seeded successfully!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());