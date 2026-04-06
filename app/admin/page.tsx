'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Admin() {
  const [patients, setPatients] = useState<any[]>([]);

  const fetchPatients = () => {
    fetch('/api/patients').then(r => r.json()).then(setPatients);
  };

  useEffect(() => { fetchPatients(); }, []);

  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b px-6 py-4 flex justify-between items-center">
        <h1 className="text-lg font-bold text-blue-600">Zealthy EMR</h1>
        <Link href="/admin/patients/new">
          <button className="bg-blue-600 text-white text-sm px-4 py-2 rounded hover:bg-blue-700">
            + New Patient
          </button>
        </Link>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8 ">
        <h2 className="text-xl font-bold mb-4 text-gray-500">Patients</h2>
        <div className="border rounded overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-gray-500">Name</th>
                <th className="px-4 py-3 text-left text-gray-500">Email</th>
                <th className="px-4 py-3 text-left text-gray-500">Appointments</th>
                <th className="px-4 py-3 text-left text-gray-500">Prescriptions</th>
                <th className="px-4 py-3 text-left text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {patients.map(p => (
                <tr key={p.id}>
                  <td className="px-4 py-3 font-medium text-gray-500">{p.name}</td>
                  <td className="px-4 py-3 text-gray-500">{p.email}</td>
                  <td className="px-4 py-3 text-gray-500">{p._count.appointments}</td>
                  <td className="px-4 py-3 text-gray-500">{p._count.prescriptions}</td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/patients/${p.id}`} className="text-blue-600 hover:underline">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}