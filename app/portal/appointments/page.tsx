'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Appointments() {
  const router = useRouter();
  const [appointments, setAppointments] = useState<any[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('patient');
    if (!stored) { router.push('/'); return; }
    const p = JSON.parse(stored);
    fetch(`/api/patients/${p.id}/appointments`)
      .then(r => r.json())
      .then(data => {
        const threeMonths = new Date();
        threeMonths.setMonth(threeMonths.getMonth() + 3);
        setAppointments(data.filter((a: any) => new Date(a.dateTime) <= threeMonths));
      });
  }, [router]);

  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b px-6 py-4 flex justify-between items-center">
        <h1 className="text-lg font-bold text-blue-600">Zealthy</h1>
        <Link href="/portal" className="text-sm text-gray-500 hover:text-gray-700">← Back</Link>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-8 text-gray-500">
        <h2 className="text-xl font-bold mb-4">All Appointments (Next 3 Months)</h2>
        <div className="border rounded overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-gray-500">Provider</th>
                <th className="px-4 py-3 text-left text-gray-500">Date & Time</th>
                <th className="px-4 py-3 text-left text-gray-500">Repeat</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {appointments.map(apt => (
                <tr key={apt.id}>
                  <td className="px-4 py-3 text-gray-500">{apt.providerName}</td>
                  <td className="px-4 py-3 text-gray-500">{new Date(apt.dateTime).toLocaleString()}</td>
                  <td className="px-4 py-3 text-gray-500">{apt.repeat || 'One-time'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}