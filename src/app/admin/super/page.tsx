'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Lock, 
  Settings, 
  Users, 
  Activity, 
  CheckCircle2, 
  EyeOff, 
  ArrowRight
} from 'lucide-react';
import { RuangSuaraStore } from '@/lib/store';
import { AuditLogItem } from '@/lib/types';
import { useAuth } from '@/lib/authContext';

export default function SuperAdminPage() {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'settings' | 'users' | 'encrypted_reports' | 'audit'>('settings');
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);
  const [schoolSettings, setSchoolSettings] = useState({
    schoolName: 'SMA Negeri Unggulan 1 Kota',
    npsn: '20194821',
    ppkspUnit: 'Satuan Tugas Pencegahan & Penanganan Kekerasan (PPKSP)',
    systemStatus: 'active',
    allowAnonymous: true,
    emergencyPhone: '(021) 7788-9900',
    emergencyEmail: 'bk-pengaduan@sekolah.sch.id'
  });
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Akun pengguna untuk manajemen tata kelola
  const [accounts, setAccounts] = useState([
    { id: 'usr-admin-1', name: 'Administrator Super Panel', role: 'Super Admin Sistem', email: 'admin@gmail.com', status: 'active' },
    { id: 'usr-bk-1', name: 'Ibu Siti Rahmawati, S.Psi., M.Pd.', role: 'Guru Bimbingan Konseling (BK)', email: 'guru@gmail.com', status: 'active' },
    { id: 'usr-bk-2', name: 'Bpk. Ahmad Fauzi, S.Pd.', role: 'Anggota Satgas PPKSP / Guru BK', email: 'ahmad.fauzi@sekolah.sch.id', status: 'active' },
    { id: 'usr-stu-1', name: 'Dimas Surya Pratama', role: 'Siswa (XI MIPA 2)', email: 'murid@gmail.com', status: 'active' },
    { id: 'usr-stu-2', name: 'Larasati Putri Ayu', role: 'Siswa (X-E3)', email: 'larasati.putri@sekolah.sch.id', status: 'active' },
  ]);

  const [encryptedReports, setEncryptedReports] = useState<any[]>([]);

  useEffect(() => {
    setAuditLogs(RuangSuaraStore.getAuditLogs());
    setEncryptedReports(RuangSuaraStore.getReportsForSuperAdmin());

    // Sync from database API if available
    fetch('/api/admin/users')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.users && data.users.length > 0) {
          setAccounts(data.users.map((u: any) => ({
            id: u.id,
            name: u.name,
            role: u.roleLabel || u.role,
            email: u.email,
            status: u.status,
          })));
        }
      })
      .catch(() => {});

    const readUrlTab = () => {
      if (typeof window === 'undefined') return;
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab');
      if (tabParam && ['settings', 'users', 'encrypted_reports', 'audit'].includes(tabParam)) {
        setActiveTab(tabParam as any);
      }
    };

    readUrlTab();
    window.addEventListener('popstate', readUrlTab);
    return () => window.removeEventListener('popstate', readUrlTab);
  }, []);

  const handleToggleAccountStatus = async (id: string) => {
    let nextStatus = 'active';
    setAccounts(prev => prev.map(acc => {
      if (acc.id === id) {
        nextStatus = acc.status === 'active' ? 'inactive' : 'active';
        RuangSuaraStore.addAuditLog({
          actor: currentUser.name || 'Super Admin',
          role: 'super_admin',
          action: 'TOGGLE_USER_STATUS',
          target: id,
          detail: `Mengubah status akun ${acc.name} (${acc.email}) menjadi ${nextStatus}`,
        });
        return { ...acc, status: nextStatus };
      }
      return acc;
    }));

    setAuditLogs(RuangSuaraStore.getAuditLogs());

    // Realtime background database sync without page reload
    try {
      await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: nextStatus }),
      });
    } catch {
      // Ignore background sync error
    }
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    RuangSuaraStore.addAuditLog({
      actor: currentUser.name || 'Super Admin',
      role: 'super_admin',
      action: 'UPDATE_SYSTEM_SETTINGS',
      target: 'School_Config',
      detail: `Memperbarui konfigurasi sistem satuan pendidikan`,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="w-full min-h-screen bg-[#F6F4F0] py-8 sm:py-14 px-4 sm:px-6 lg:px-8 text-slate-900 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Strip Super Admin */}
        <div className="bg-slate-950 text-white rounded-[32px] p-6 sm:p-8 border border-slate-800 shadow-[0_12px_40px_rgba(0,0,0,0.06)] flex flex-wrap items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-medium uppercase tracking-wider border border-slate-700">
              <Lock className="w-3.5 h-3.5" />
              <span>Panel Tata Kelola Sistem (Super Admin)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-medium tracking-tight text-white">
              Tata Kelola Website &amp; Keamanan Sistem
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 font-normal">
              Administrator: <span className="text-white font-medium">{currentUser.name}</span> • Akses: <span className="text-slate-300 font-medium">Infrastruktur &amp; Akun (Laporan Terenkripsi)</span>
            </p>
          </div>

          <div className="p-3.5 bg-slate-800/90 rounded-xl border border-slate-700 text-right text-xs font-normal">
            <span className="text-slate-400 block mb-0.5 font-normal">Status Proteksi Data:</span>
            <span className="text-emerald-400 font-medium flex items-center gap-1.5 justify-end">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              Enkripsi End-to-End Aktif
            </span>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-5 py-2.5 rounded-xl font-medium text-xs transition flex items-center gap-2 ${
              activeTab === 'settings' 
                ? 'bg-[#E02B2B] text-white shadow-2xs' 
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Konfigurasi Satuan Pendidikan</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`px-5 py-2.5 rounded-xl font-medium text-xs transition flex items-center gap-2 ${
              activeTab === 'users' 
                ? 'bg-[#E02B2B] text-white shadow-2xs' 
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Manajemen Akun Pengguna</span>
          </button>

          <button
            onClick={() => setActiveTab('encrypted_reports')}
            className={`px-5 py-2.5 rounded-xl font-medium text-xs transition flex items-center gap-2 ${
              activeTab === 'encrypted_reports' 
                ? 'bg-slate-900 text-white shadow-2xs' 
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Lock className="w-4 h-4 text-slate-400" />
            <span>Data Laporan (Terenkripsi)</span>
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`px-5 py-2.5 rounded-xl font-medium text-xs transition flex items-center gap-2 ${
              activeTab === 'audit' 
                ? 'bg-slate-900 text-white shadow-2xs' 
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Log Audit Transparan ({auditLogs.length})</span>
          </button>
        </div>

        {/* TAB 1: PENGATURAN WEBSITE & SEKOLAH */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-6">
            <div className="pb-4 border-b border-slate-100">
              <h3 className="text-base font-medium text-slate-900">Identitas Satuan Pendidikan &amp; Kontak Darurat</h3>
              <p className="text-xs text-slate-500 font-normal">Sesuaikan nama sekolah, nomor telepon penanganan cepat, dan kebijakan perlindungan.</p>
            </div>

            {saveSuccess && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Konfigurasi sistem berhasil diperbarui.</span>
              </div>
            )}

            <form onSubmit={handleSaveSettings} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1.5">Nama Satuan Pendidikan *</label>
                  <input
                    type="text"
                    required
                    value={schoolSettings.schoolName}
                    onChange={(e) => setSchoolSettings({ ...schoolSettings, schoolName: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-300 bg-white text-xs focus:outline-none focus:border-[#E02B2B] font-normal shadow-2xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1.5">NPSN Sekolah *</label>
                  <input
                    type="text"
                    required
                    value={schoolSettings.npsn}
                    onChange={(e) => setSchoolSettings({ ...schoolSettings, npsn: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-300 bg-white text-xs focus:outline-none focus:border-[#E02B2B] font-normal shadow-2xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1.5">Unit Penanggung Jawab *</label>
                  <input
                    type="text"
                    required
                    value={schoolSettings.ppkspUnit}
                    onChange={(e) => setSchoolSettings({ ...schoolSettings, ppkspUnit: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-300 bg-white text-xs focus:outline-none focus:border-[#E02B2B] font-normal shadow-2xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1.5">Nomor Hotline Darurat Siswa *</label>
                  <input
                    type="text"
                    required
                    value={schoolSettings.emergencyPhone}
                    onChange={(e) => setSchoolSettings({ ...schoolSettings, emergencyPhone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-300 bg-white text-xs focus:outline-none focus:border-[#E02B2B] font-normal shadow-2xs"
                  />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                <div>
                  <span className="text-xs font-medium text-slate-900 block">Izinkan Pelaporan Tanpa Identitas (Anonim)</span>
                  <span className="text-[11px] text-slate-500 font-normal">Menerapkan prinsip anonimitas guna menjamin rasa aman pelapor.</span>
                </div>
                <input
                  type="checkbox"
                  checked={schoolSettings.allowAnonymous}
                  onChange={(e) => setSchoolSettings({ ...schoolSettings, allowAnonymous: e.target.checked })}
                  className="w-4 h-4 text-[#E02B2B] rounded focus:ring-0"
                />
              </div>

              <button
                type="submit"
                className="px-8 py-3 rounded-xl !bg-[#E02B2B] hover:!bg-[#c92424] !text-white font-medium text-xs shadow-2xs transition cursor-pointer"
              >
                Simpan Perubahan Konfigurasi
              </button>
            </form>
          </div>
        )}

        {/* TAB 2: MANAJEMEN AKUN GURU & SISWA */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-medium text-slate-900">Manajemen Akun Pengguna Terdaftar</h3>
                <p className="text-xs text-slate-500 font-normal">Kelola status keaktifan akun Guru Bimbingan Konseling dan Siswa terdaftar.</p>
              </div>
              <span className="text-xs font-medium text-slate-500 font-mono">Total Akun: {accounts.length}</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 uppercase text-[10px] font-medium">
                    <th className="py-3 px-4">Nama Pengguna</th>
                    <th className="py-3 px-4">Role / Peran</th>
                    <th className="py-3 px-4">Email Satuan Pendidikan</th>
                    <th className="py-3 px-4">Status Akun</th>
                    <th className="py-3 px-4 text-right">Aksi Administrator</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {accounts.map((acc) => (
                    <tr key={acc.id} className="hover:bg-slate-50/50 transition">
                      <td className="py-3.5 px-4 font-medium text-slate-900">{acc.name}</td>
                      <td className="py-3.5 px-4 text-slate-600 font-normal">{acc.role}</td>
                      <td className="py-3.5 px-4 font-mono text-slate-500 font-normal">{acc.email}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium ${
                          acc.status === 'active' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/60' : 'bg-red-50 text-red-800 border border-red-200/60'
                        }`}>
                          {acc.status === 'active' ? 'Aktif' : 'Dinonaktifkan'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleToggleAccountStatus(acc.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                            acc.status === 'active' 
                              ? 'bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-700' 
                              : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {acc.status === 'active' ? 'Non-aktifkan' : 'Aktifkan'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: DATA LAPORAN USER (TERENKRIPSI) */}
        {activeTab === 'encrypted_reports' && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-6">
            {/* Banner Proteksi Privasi & Enkripsi */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 space-y-1.5">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-slate-600 shrink-0" />
                <h3 className="font-medium text-xs text-slate-900 uppercase tracking-wider">
                  Hak Akses Terkunci: Prinsip Non-Intrusif Super Admin
                </h3>
              </div>
              <p className="text-xs leading-relaxed text-slate-600 font-normal">
                Sesuai prinsip perlindungan data anak: <strong>Super Admin tidak memiliki kewenangan membaca isi narasi atau identitas privat pelapor</strong>. Seluruh konten laporan di bawah ini terenkripsi dan hanya dapat didekripsi oleh <strong>Guru BK yang berwenang</strong>.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 uppercase text-[10px] font-medium">
                    <th className="py-3 px-4">Nomor Laporan</th>
                    <th className="py-3 px-4">Status &amp; Urgensi</th>
                    <th className="py-3 px-4">Pelapor</th>
                    <th className="py-3 px-4">Konten Narasi</th>
                    <th className="py-3 px-4">Status Enkripsi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {encryptedReports.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition">
                      <td className="py-3.5 px-4 font-mono font-medium text-slate-900">{item.id}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                          item.urgency === 'urgent' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {item.urgency.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-mono text-[11px] text-slate-500 flex items-center gap-1 font-normal">
                          <EyeOff className="w-3 h-3 text-slate-400" />
                          {item.maskedReporter}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-1 rounded bg-slate-100 text-[11px] font-mono text-slate-600 border border-slate-200 flex items-center gap-1.5 w-fit font-normal">
                          <Lock className="w-3 h-3 text-slate-400" />
                          {item.description}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="text-[11px] font-medium text-emerald-700 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Terenkripsi Standar
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 flex items-center justify-between font-normal">
              <span>Untuk membaca laporan siswa secara terbuka, silakan gunakan akun <strong>Guru Bimbingan Konseling</strong>.</span>
              <Link href="/counselor" className="text-[#E02B2B] font-medium hover:underline flex items-center gap-1">
                <span>Pindah ke Ruang Guru BK</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}

        {/* TAB 4: SYSTEM AUDIT LOG */}
        {activeTab === 'audit' && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-medium text-slate-900">Catatan Audit Sistem Transparan</h3>
                <p className="text-xs text-slate-500 font-normal">Merekam setiap aktivitas pembaruan status, peninjauan berkas, dan interaksi pengguna.</p>
              </div>
              <span className="text-xs font-medium text-slate-500 font-mono">Total Aktivitas: {auditLogs.length}</span>
            </div>

            <div className="space-y-3">
              {auditLogs.map((log) => (
                <div 
                  key={log.id} 
                  className="p-4 rounded-xl bg-slate-50/60 border border-slate-200/80 flex flex-wrap items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-900">{log.actor}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-200 text-slate-700 uppercase">
                        {log.role}
                      </span>
                      <span className="font-mono text-[11px] text-slate-700 font-medium bg-slate-200/80 px-2 py-0.5 rounded">
                        {log.action}
                      </span>
                      <span className="font-mono text-slate-500 font-normal">Target: {log.target}</span>
                    </div>
                    <p className="text-slate-600 font-normal">{log.detail}</p>
                  </div>
                  <span className="font-mono text-[11px] text-slate-400 font-normal">{log.timestamp}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
