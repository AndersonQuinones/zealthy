'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError('Invalid email or password');
      return;
    }
    localStorage.setItem('token', data.token);
    localStorage.setItem('patient', JSON.stringify(data.patient));
    router.push('/portal');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center mb-2 text-blue-600">Zealthy</h1>
        <p className="text-center text-gray-500 mb-6">Sign in to your patient portal</p>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <form onSubmit={handleLogin} className="flex flex-col gap-3">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="border rounded px-3 py-2 text-sm text-black"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="border rounded px-3 py-2 text-sm text-black"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 rounded text-sm font-medium hover:bg-blue-700"
          >
            Login
          </button>
        </form>

        <p className="text-xs text-gray-400 text-center mt-4">
          Test: mark@some-email-provider.net / Password123!
        </p>
      </div>
    </div>
  );
}