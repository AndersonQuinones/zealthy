'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewPatient() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '', dateOfBirth: '', phone: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/patients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (!res.ok) { setError('Email already in use'); return; }
    router.push('/admin');
  };

  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b px-6 py-4 flex justify-between items-center">
        <h1 className="text-lg font-bold text-blue-600">Zealthy EMR</h1>
        <Link href="/admin" className="text-sm text-gray-500 hover:text-gray-700">← Back</Link>
      </nav>

      <div className="max-w-lg mx-auto px-6 py-8">
        <h2 className="text-xl font-bold mb-6">New Patient</h2>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {[
            { label: 'Full Name', key: 'name', type: 'text', required: true },
            { label: 'Email', key: 'email', type: 'email', required: true },
            { label: 'Password', key: 'password', type: 'password', required: true },
            { label: 'Date of Birth', key: 'dateOfBirth', type: 'date', required: false },
            { label: 'Phone', key: 'phone', type: 'tel', required: false },
          ].map(field => (
            <div key={field.key}>
              <label className="text-sm font-medium text-black">{field.label}</label>
              <input
                type={field.type}
                value={form[field.key as keyof typeof form]}
                onChange={e => setForm(p => ({ ...p, [field.key]: e.target.value }))}
                className="mt-1 w-full border rounded px-3 py-2 text-sm text-black"
                required={field.required}
              />
            </div>
          ))}

          <button
            type="submit"
            className="bg-blue-600 text-white py-2 rounded text-sm font-medium hover:bg-blue-700"
          >
            Create Patient
          </button>
        </form>
      </div>
    </div>
  );
}