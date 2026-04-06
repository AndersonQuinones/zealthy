'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Prescriptions() {
  const router = useRouter();
  const [prescriptions, setPrescriptions] = useState<any[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('patient');
    if (!stored) { router.push('/'); return; }
    const p = JSON.parse(stored);
    fetch(`/api/patients/${p.id}/prescriptions`)
      .then(r => r.json())
      .then(setPrescriptions);
  }, [router]);

  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b px-6 py-4 flex justify-between items-center">
        <h1 className="text-lg font-bold text-blue-600">Zealthy</h1>
        <Link href="/portal" className="text-sm text-gray-500 hover:text-gray-700">← Back</Link>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-8 text-gray-500">
        <h2 className="text-xl font-bold mb-4">All Prescriptions</h2>
        <div className="border rounded overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-gray-500">Medication</th>
                <th className="px-4 py-3 text-left text-gray-500">Dosage</th>
                <th className="px-4 py-3 text-left text-gray-500">Qty</th>
                <th className="px-4 py-3 text-left text-gray-500">Refill Date</th>
                <th className="px-4 py-3 text-left text-gray-500">Schedule</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {prescriptions.map(rx => (
                <tr key={rx.id}>
                  <td className="px-4 py-3 font-medium text-gray-500">{rx.medication}</td>
                  <td className="px-4 py-3 text-gray-500">{rx.dosage}</td>
                  <td className="px-4 py-3 text-gray-500">{rx.quantity}</td>
                  <td className="px-4 py-3 text-gray-500">{new Date(rx.refillDate).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-gray-500">{rx.refillSchedule}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}