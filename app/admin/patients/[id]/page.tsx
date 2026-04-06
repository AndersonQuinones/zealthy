'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

export default function PatientDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [patient, setPatient] = useState<any>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [medications, setMedications] = useState<string[]>([]);
  const [dosages, setDosages] = useState<string[]>([]);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', email: '', dateOfBirth: '', phone: '' });

  const [newApt, setNewApt] = useState({ providerName: '', dateTime: '', repeat: '', endDate: '' });
  const [newRx, setNewRx] = useState({ medication: '', dosage: '', quantity: '', refillDate: '', refillSchedule: 'monthly' });

  const fetchAll = async () => {
    const [patRes, aptRes, rxRes, medRes] = await Promise.all([
      fetch(`/api/patients/${id}`).then(r => r.json()),
      fetch(`/api/patients/${id}/appointments`).then(r => r.json()),
      fetch(`/api/patients/${id}/prescriptions`).then(r => r.json()),
      fetch('/api/medications').then(r => r.json()),
    ]);
    setPatient(patRes);
    setAppointments(aptRes);
    setPrescriptions(rxRes);
    setMedications(medRes.medications);
    setDosages(medRes.dosages);
    setEditForm({ name: patRes.name, email: patRes.email, dateOfBirth: patRes.dateOfBirth || '', phone: patRes.phone || '' });
  };

  useEffect(() => { fetchAll(); }, [id]);

  const savePatient = async () => {
    await fetch(`/api/patients/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editForm),
    });
    setEditing(false);
    fetchAll();
  };

  const addAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch(`/api/patients/${id}/appointments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newApt),
    });
    setNewApt({ providerName: '', dateTime: '', repeat: '', endDate: '' });
    fetchAll();
  };

  const deleteAppointment = async (aptId: number) => {
    await fetch(`/api/appointments/${aptId}`, { method: 'DELETE' });
    fetchAll();
  };

  const addPrescription = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch(`/api/patients/${id}/prescriptions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newRx),
    });
    setNewRx({ medication: '', dosage: '', quantity: '', refillDate: '', refillSchedule: 'monthly' });
    fetchAll();
  };

  const deletePrescription = async (rxId: number) => {
    await fetch(`/api/prescriptions/${rxId}`, { method: 'DELETE' });
    fetchAll();
  };

  if (!patient) return <div className="min-h-screen flex items-center justify-center"><p className="text-gray-500">Loading...</p></div>;

  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b px-6 py-4 flex justify-between items-center">
        <h1 className="text-lg font-bold text-blue-600">Zealthy EMR</h1>
        <Link href="/admin" className="text-sm text-gray-500 hover:text-gray-700">← Back</Link>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-8 flex flex-col gap-8">

        <div className="border rounded p-4">
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-bold text-lg text-gray-500">Patient Info</h2>
            <button
              onClick={() => setEditing(!editing)}
              className="text-sm text-blue-600 hover:underline"
            >
              {editing ? 'Cancel' : 'Edit'}
            </button>
          </div>

          {editing ? (
            <div className="flex flex-col gap-3">
              {[
                { label: 'Name', key: 'name' },
                { label: 'Email', key: 'email' },
                { label: 'Date of Birth', key: 'dateOfBirth' },
                { label: 'Phone', key: 'phone' },
              ].map(f => (
                <div key={f.key}>
                  <label className="text-sm text-gray-500">{f.label}</label>
                  <input
                    value={editForm[f.key as keyof typeof editForm]}
                    onChange={e => setEditForm(p => ({ ...p, [f.key]: e.target.value }))}
                    className="mt-1 w-full border rounded px-3 py-2 text-sm text-black"
                  />
                </div>
              ))}
              <button
                onClick={savePatient}
                className="bg-blue-600 text-white py-2 rounded text-sm hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          ) : (
            <div className="text-sm text-gray-600 flex flex-col gap-1">
              <p><span className="font-medium">Name:</span> {patient.name}</p>
              <p><span className="font-medium">Email:</span> {patient.email}</p>
              <p><span className="font-medium">DOB:</span> {patient.dateOfBirth || '—'}</p>
              <p><span className="font-medium">Phone:</span> {patient.phone || '—'}</p>
            </div>
          )}
        </div>

        <div className="border rounded p-4">
          <h2 className="font-bold text-lg mb-4 text-gray-500">Appointments</h2>

          <form onSubmit={addAppointment} className="flex flex-col gap-3 mb-4 pb-4 border-b">
            <p className="text-sm font-medium text-gray-600">Add Appointment</p>
            <input
              placeholder="Provider name"
              value={newApt.providerName}
              onChange={e => setNewApt(p => ({ ...p, providerName: e.target.value }))}
              className="border rounded px-3 py-2 text-sm text-black"
              required
            />
            <input
              type="datetime-local"
              value={newApt.dateTime}
              onChange={e => setNewApt(p => ({ ...p, dateTime: e.target.value }))}
              className="border rounded px-3 py-2 text-sm text-black"
              required
            />
            <select
              value={newApt.repeat}
              onChange={e => setNewApt(p => ({ ...p, repeat: e.target.value }))}
              className="border rounded px-3 py-2 text-sm text-black"
            >
              <option value="">No repeat</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
            {newApt.repeat && (
              <div>
                <label className="text-xs text-gray-500">End Date (optional)</label>
                <input
                  type="date"
                  value={newApt.endDate}
                  onChange={e => setNewApt(p => ({ ...p, endDate: e.target.value }))}
                  className="mt-1 w-full border rounded px-3 py-2 text-sm text-black"
                />
              </div>
            )}
            <button type="submit" className="bg-blue-600 text-white py-2 rounded text-sm hover:bg-blue-700">
              Add Appointment
            </button>
          </form>


          {appointments.length === 0 ? (
            <p className="text-sm text-gray-400">No appointments.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500">
                  <th className="py-2">Provider</th>
                  <th className="py-2">Date & Time</th>
                  <th className="py-2">Repeat</th>
                  <th className="py-2">End Date</th>
                  <th className="py-2"></th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {appointments.map(apt => (
                  <tr key={apt.id}>
                    <td className="py-2 text-gray-500">{apt.providerName}</td>
                    <td className="py-2 text-gray-500">{new Date(apt.dateTime).toLocaleString()}</td>
                    <td className="py-2 text-gray-500">{apt.repeat || '—'}</td>
                    <td className="py-2 text-gray-500">{apt.endDate ? new Date(apt.endDate).toLocaleDateString() : '—'}</td>
                    <td className="py-2">
                      <button
                        onClick={() => deleteAppointment(apt.id)}
                        className="text-red-500 hover:text-red-700 text-xs"
                      >Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="border rounded p-4">
          <h2 className="font-bold text-lg mb-4 text-gray-500">Prescriptions</h2>

          <form onSubmit={addPrescription} className="flex flex-col gap-3 mb-4 pb-4 border-b">
            <p className="text-sm font-medium text-gray-600">Add Prescription</p>
            <select
              value={newRx.medication}
              onChange={e => setNewRx(p => ({ ...p, medication: e.target.value }))}
              className="border rounded px-3 py-2 text-sm text-black"
              required
            >
              <option value="">Select medication</option>
              {medications.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
            <select
              value={newRx.dosage}
              onChange={e => setNewRx(p => ({ ...p, dosage: e.target.value }))}
              className="border rounded px-3 py-2 text-sm text-black"
              required
            >
              <option value="">Select dosage</option>
              {dosages.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <input
              type="number"
              placeholder="Quantity"
              value={newRx.quantity}
              onChange={e => setNewRx(p => ({ ...p, quantity: e.target.value }))}
              className="border rounded px-3 py-2 text-sm text-black"
              required
            />
            <div>
              <label className="text-xs text-gray-500">Refill Date</label>
              <input
                type="date"
                value={newRx.refillDate}
                onChange={e => setNewRx(p => ({ ...p, refillDate: e.target.value }))}
                className="mt-1 w-full border rounded px-3 py-2 text-sm text-black"
                required
              />
            </div>
            <select
              value={newRx.refillSchedule}
              onChange={e => setNewRx(p => ({ ...p, refillSchedule: e.target.value }))}
              className="border rounded px-3 py-2 text-sm text-black"
            >
              <option value="monthly">Monthly</option>
              <option value="weekly">Weekly</option>
              <option value="quarterly">Quarterly</option>
            </select>
            <button type="submit" className="bg-blue-600 text-white py-2 rounded text-sm hover:bg-blue-700">
              Add Prescription
            </button>
          </form>

          {prescriptions.length === 0 ? (
            <p className="text-sm text-gray-400">No prescriptions.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500">
                  <th className="py-2">Medication</th>
                  <th className="py-2">Dosage</th>
                  <th className="py-2">Qty</th>
                  <th className="py-2">Refill Date</th>
                  <th className="py-2">Schedule</th>
                  <th className="py-2"></th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {prescriptions.map(rx => (
                  <tr key={rx.id}>
                    <td className="py-2 font-medium text-gray-500">{rx.medication}</td>
                    <td className="py-2 text-gray-500">{rx.dosage}</td>
                    <td className="py-2 text-gray-500">{rx.quantity}</td>
                    <td className="py-2 text-gray-500">{new Date(rx.refillDate).toLocaleDateString()}</td>
                    <td className="py-2 text-gray-500">{rx.refillSchedule}</td>
                    <td className="py-2">
                      <button
                        onClick={() => deletePrescription(rx.id)}
                        className="text-red-500 hover:text-red-700 text-xs"
                      >Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </div>
  );
}