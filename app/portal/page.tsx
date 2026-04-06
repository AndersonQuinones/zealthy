'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Portal() {
  const router = useRouter();
  const [patient, setPatient] = useState<{id: number; name: string; email: string} | null>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [prescriptions, setPrescriptions] = useState<any[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('patient');
    const token = localStorage.getItem('token');
    if (!stored || !token) { router.push('/'); return; }
    const p = JSON.parse(stored);
    setPatient(p);

    fetch(`/api/patients/${p.id}/appointments`).then(r => r.json()).then(setAppointments);
    fetch(`/api/patients/${p.id}/prescriptions`).then(r => r.json()).then(setPrescriptions);
  }, [router]);

  const now = new Date();
  const in7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  const upcomingApts = appointments.filter(a => {
    const d = new Date(a.dateTime);
    return d >= now && d <= in7Days;
  });

  const upcomingRxs = prescriptions.filter(r => {
    const d = new Date(r.refillDate);
    return d >= now && d <= in7Days;
  });

  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b px-6 py-4 flex justify-between items-center">
        <h1 className="text-lg font-bold text-blue-600">Zealthy</h1>
        <div className="flex gap-4 items-center">
          <span className="text-sm text-gray-600">{patient?.name}</span>
          <button
            onClick={() => { localStorage.clear(); router.push('/'); }}
            className="text-sm text-gray-400 hover:text-gray-600"
          >Logout</button>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-8 flex flex-col gap-6">

        <div className="border rounded p-4 text-gray-500">
          <p className="text-sm text-gray-500">Patient Info</p>
          <p className="font-medium mt-1">{patient?.name}</p>
          <p className="text-sm text-gray-500">{patient?.email}</p>
        </div>

        <div className="border rounded p-4 text-gray-500">
          <div className="flex justify-between items-center mb-3">
            <p className="font-medium">Appointments this week ({upcomingApts.length})</p>
            <Link href="/portal/appointments" className="text-sm text-blue-600 hover:underline">View all</Link>
          </div>
          {upcomingApts.length === 0 ? (
            <p className="text-sm text-gray-400">No appointments in the next 7 days.</p>
          ) : (
            upcomingApts.map(apt => (
              <div key={apt.id} className="flex justify-between py-2 border-t text-sm">
                <span>{apt.providerName}</span>
                <span className="text-gray-500">{new Date(apt.dateTime).toLocaleDateString()}</span>
              </div>
            ))
          )}
        </div>

        <div className="border rounded p-4 text-gray-500">
          <div className="flex justify-between items-center mb-3">
            <p className="font-medium">Refills due this week ({upcomingRxs.length})</p>
            <Link href="/portal/prescriptions" className="text-sm text-blue-600 hover:underline">View all</Link>
          </div>
          {upcomingRxs.length === 0 ? (
            <p className="text-sm text-gray-400">No refills due in the next 7 days.</p>
          ) : (
            upcomingRxs.map(rx => (
              <div key={rx.id} className="flex justify-between py-2 border-t text-sm">
                <span>{rx.medication} {rx.dosage}</span>
                <span className="text-gray-500">{new Date(rx.refillDate).toLocaleDateString()}</span>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}