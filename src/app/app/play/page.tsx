'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CAMPUS_CONFIG } from '@/src/campusConfig';

export default function LandingPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [mssv, setMssv] = useState('');
  const [error, setError] = useState('');

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return setError('Vui lòng nhập Họ và Tên!');
    if (mssv.trim().length !== 13) return setError('MSSV phải bao gồm đúng 13 ký tự!');

    const mssvMasked = mssv.slice(0, 4) + '*'.repeat(9);
    const user = {
      id: 'user-' + Math.random().toString(36).substring(2, 9),
      name: name.trim(),
      mssvMasked,
      outfit: { skin: '#FDB8B4', hair: '#222', shirt: '#0055A5', pants: '#333' }
    };

    localStorage.setItem('campus.user', JSON.stringify(user));
    router.push('/play');
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl">
        <div className="text-center mb-6">
          <h2 className="text-xs uppercase tracking-widest text-blue-400 font-semibold mb-1">
            {CAMPUS_CONFIG.universityName}
          </h2>
          <h1 className="text-2xl font-extrabold text-white">{CAMPUS_CONFIG.facultyName} Virtual Campus</h1>
          <p className="text-xs text-gray-400 mt-2">Dự án 3D Quảng trường Hồ Tri Kiến & Tòa nhà trung tâm</p>
        </div>

        <form onSubmit={handleJoin} className="space-y-4">
          <div>
            <label className="block text-xs text-gray-300 font-medium mb-1">Họ và Tên</label>
            <input
              type="text"
              placeholder="Nhập họ và tên..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-300 font-medium mb-1">Mã số sinh viên (13 ký tự)</label>
            <input
              type="text"
              placeholder="VD: K245520201001"
              value={mssv}
              onChange={(e) => setMssv(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          {error && <p className="text-red-400 text-xs">{error}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-lg text-sm transition"
          >
            Vào Campus 3D
          </button>
        </form>
      </div>
    </main>
  );
}