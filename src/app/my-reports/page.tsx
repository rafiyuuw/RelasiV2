'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Shield, 
  Plus, 
  ArrowRight, 
  MessageSquare,
  Clock,
  CheckCircle2,
  Calendar,
  MapPin,
  Users,
  Lock,
  X,
  Send,
  AlertTriangle,
  FileText,
  ChevronRight,
  ShieldCheck,
  Paperclip,
  Image as ImageIcon,
  Trash2,
  Bell
} from 'lucide-react';
import { useAuth } from '@/lib/authContext';
import { RuangSuaraStore } from '@/lib/store';
import { Report } from '@/lib/types';

export default function MyReportsPage() {
  const { currentUser } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [filterTab, setFilterTab] = useState<'all' | 'active' | 'resolved'>('all');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [chatMessage, setChatMessage] = useState('');
  const [attachmentPhoto, setAttachmentPhoto] = useState<string | null>(null);
  const [attachmentName, setAttachmentName] = useState<string>('');
  const [isSending, setIsSending] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const loadReports = () => {
    const all = RuangSuaraStore.getReports();
    // Load reports belonging to this user or matching student identity
    const myReports = all.filter(r => 
      (r.reporterName && r.reporterName.toLowerCase().includes('dimas')) || 
      r.id === 'RS-2026-0419' || 
      r.id === 'RS-2026-0412'
    );
    setReports(myReports.length > 0 ? myReports : all.slice(0, 3));
  };

  useEffect(() => {
    loadReports();
  }, [currentUser]);

  // Keep selected report updated with fresh store data
  useEffect(() => {
    if (selectedReport) {
      const fresh = RuangSuaraStore.getReportById(selectedReport.id);
      if (fresh) setSelectedReport(fresh);
    }
  }, [reports]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAttachmentName(file.name);
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      setAttachmentPhoto(uploadEvent.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReport || (!chatMessage.trim() && !attachmentPhoto)) return;

    setIsSending(true);
    setTimeout(() => {
      const updated = RuangSuaraStore.addReportMessage(selectedReport.id, {
        sender: 'student',
        senderName: selectedReport.isAnonymous ? 'Pelapor (Anonim)' : (selectedReport.reporterName || 'Siswa'),
        content: chatMessage.trim() || 'Lampiran foto bukti pengaduan.',
        photoUrl: attachmentPhoto || undefined,
      });

      if (updated) {
        setSelectedReport(updated);
        setChatMessage('');
        setAttachmentPhoto(null);
        setAttachmentName('');
        loadReports();
      }
      setIsSending(false);
    }, 350);
  };

  // Filter reports
  const filteredReports = reports.filter(r => {
    if (filterTab === 'active') {
      return r.status !== 'resolved' && r.status !== 'unsubstantiated';
    }
    if (filterTab === 'resolved') {
      return r.status === 'resolved' || r.status === 'unsubstantiated';
    }
    return true;
  });

  const activeCount = reports.filter(r => r.status !== 'resolved' && r.status !== 'unsubstantiated').length;
  const resolvedCount = reports.filter(r => r.status === 'resolved' || r.status === 'unsubstantiated').length;

  const getStatusBadge = (status: Report['status']) => {
    switch (status) {
      case 'submitted':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200/80">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
            <span>Menunggu Telaah BK</span>
          </span>
        );
      case 'reviewed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-800 border border-blue-200/80">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            <span>Telah Ditelaah Guru BK</span>
          </span>
        );
      case 'investigating':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-800 border border-purple-200/80">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
            <span>Dalam Investigasi</span>
          </span>
        );
      case 'followup':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-red-50 text-[#E02B2B] border border-red-200/80">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E02B2B]"></span>
            <span>Tindak Lanjut &amp; Mediasi</span>
          </span>
        );
      case 'resolved':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200/80">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>Selesai &amp; Pemulihan</span>
          </span>
        );
      case 'unsubstantiated':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200/80">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
            <span>Tidak Cukup Bukti</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#F6F4F0] py-6 sm:py-10 px-4 sm:px-6 lg:px-8 text-slate-900 font-sans">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Welcome Header Banner - Matching Landing Page Tether Aesthetic */}
        <div className="bg-white/95 backdrop-blur-xl rounded-[28px] p-6 sm:p-8 border border-black/[0.08] shadow-[0_10px_35px_rgba(0,0,0,0.03)] flex flex-wrap items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-[#E02B2B] text-xs font-medium uppercase tracking-wider border border-red-200/70">
              <Shield className="w-3.5 h-3.5" />
              <span>Portal Siswa Terlindungi</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-slate-950 tracking-tight">
              Riwayat Laporan <span className="text-[#E02B2B]">Saya</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
              Selamat datang, <span className="text-slate-900 font-medium">{currentUser.name}</span> ({currentUser.departmentOrClass || 'Siswa'}). Seluruh laporan di bawah diproses dengan kerahasiaan penuh di bawah pengawasan Guru BK.
            </p>
          </div>

          <Link
            href="/report"
            className="shrink-0 px-5 sm:px-6 py-3 rounded-full !bg-[#E02B2B] hover:!bg-[#c92424] !text-white font-medium text-xs sm:text-sm shadow-sm hover:shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Buat Laporan Baru</span>
          </Link>
        </div>

        {/* Symmetrical Stats Overview - 3 Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-5 border border-black/[0.08] shadow-xs flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center shrink-0 border border-slate-200/60">
              <FileText className="w-5 h-5 text-slate-700" />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-medium block">Total Pengaduan</span>
              <span className="text-2xl font-bold text-slate-900 tracking-tight">{reports.length}</span>
            </div>
          </div>

          <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-5 border border-black/[0.08] shadow-xs flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-200/60">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-medium block">Dalam Pendampingan BK</span>
              <span className="text-2xl font-bold text-amber-700 tracking-tight">{activeCount}</span>
            </div>
          </div>

          <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-5 border border-black/[0.08] shadow-xs flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-200/60">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-medium block">Kasus Tuntas &amp; Pulih</span>
              <span className="text-2xl font-bold text-emerald-700 tracking-tight">{resolvedCount}</span>
            </div>
          </div>
        </div>

        {/* Filter Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200/80 pb-3">
          <button
            type="button"
            onClick={() => setFilterTab('all')}
            className={`px-4 py-2 rounded-full text-xs font-medium transition cursor-pointer ${
              filterTab === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-black/[0.04]'
            }`}
          >
            Semua Laporan ({reports.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterTab('active')}
            className={`px-4 py-2 rounded-full text-xs font-medium transition cursor-pointer ${
              filterTab === 'active'
                ? 'bg-[#E02B2B] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-black/[0.04]'
            }`}
          >
            Dalam Proses ({activeCount})
          </button>
          <button
            type="button"
            onClick={() => setFilterTab('resolved')}
            className={`px-4 py-2 rounded-full text-xs font-medium transition cursor-pointer ${
              filterTab === 'resolved'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-black/[0.04]'
            }`}
          >
            Tuntas &amp; Selesai ({resolvedCount})
          </button>
        </div>

        {/* Reports List */}
        <div className="space-y-4">
          {filteredReports.length === 0 ? (
            <div className="bg-white/95 backdrop-blur-xl rounded-[28px] p-10 sm:p-12 border border-black/[0.08] shadow-xs text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center mx-auto border border-slate-200">
                <FileText className="w-6 h-6" />
              </div>
              <div className="space-y-1 max-w-sm mx-auto">
                <h3 className="text-base font-semibold text-slate-900">Belum Ada Laporan Terkait</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Tidak ditemukan laporan pada kategori ini. Anda dapat membuat pengaduan baru kapan saja secara aman.
                </p>
              </div>
              <Link
                href="/report"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full !bg-[#E02B2B] hover:!bg-[#c92424] !text-white text-xs font-medium transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Buat Pengaduan Sekarang</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredReports.map((r) => (
                <div 
                  key={r.id}
                  className="bg-white/95 backdrop-blur-xl rounded-[24px] p-5 sm:p-6 border border-black/[0.08] shadow-[0_6px_25px_rgba(0,0,0,0.02)] hover:border-black/[0.14] transition-all space-y-4"
                >
                  {/* Card Header Row */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="font-mono text-sm sm:text-base font-semibold text-slate-900 bg-slate-100/90 px-3 py-1 rounded-lg border border-slate-200/80">
                        {r.id}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200/70">
                        {r.isAnonymous ? 'Anonim' : 'Identitas Terbuka ke BK'}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium uppercase ${
                        r.urgency === 'urgent' 
                          ? 'bg-red-50 text-[#E02B2B] border border-red-200/80' 
                          : 'bg-slate-100 text-slate-600 border border-slate-200/70'
                      }`}>
                        {r.urgency}
                      </span>
                    </div>

                    <div>
                      {getStatusBadge(r.status)}
                    </div>
                  </div>

                  {/* Symmetrical Incident Metadata 3-Columns Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600 bg-slate-50/70 p-3.5 rounded-xl border border-slate-200/60">
                    <div className="flex items-start gap-2">
                      <Calendar className="w-3.5 h-3.5 text-[#E02B2B] shrink-0 mt-0.5" />
                      <div className="min-w-0">
                        <span className="text-slate-400 block font-normal text-[11px]">Waktu Kejadian:</span>
                        <span className="text-slate-800 font-medium truncate block">{r.incidentDate} • {r.incidentTime}</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="w-3.5 h-3.5 text-[#E02B2B] shrink-0 mt-0.5" />
                      <div className="min-w-0">
                        <span className="text-slate-400 block font-normal text-[11px]">Lokasi Spesifik:</span>
                        <span className="text-slate-800 font-medium truncate block">{r.location}</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Users className="w-3.5 h-3.5 text-[#E02B2B] shrink-0 mt-0.5" />
                      <div className="min-w-0">
                        <span className="text-slate-400 block font-normal text-[11px]">Pihak Disebutkan:</span>
                        <span className="text-slate-800 font-medium truncate block">{r.partiesInvolved || 'Tidak dicantumkan'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Kronologi Description - Text wrapped safely without overflow */}
                  <div className="p-4 rounded-xl bg-[#F8F7F4] border border-slate-200/80 text-xs sm:text-sm text-slate-700 leading-relaxed break-words font-normal">
                    &ldquo;{r.description}&rdquo;
                  </div>

                  {/* Bottom Action & Status Footer */}
                  <div className="pt-2 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3 text-xs text-slate-500 font-normal">
                      <span className="inline-flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-slate-400" />
                        <span>Enkripsi Berlapis</span>
                      </span>
                      <span>•</span>
                      {r.messages.some(m => m.sender === 'counselor') ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-red-100 text-red-700 animate-pulse border border-red-200">
                          <Bell className="w-3.5 h-3.5 text-red-600" />
                          <span>Pesan Masuk dari Guru BK</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-slate-700 font-medium">
                          <MessageSquare className="w-3.5 h-3.5 text-[#E02B2B]" />
                          <span>{r.messages.length} Pesan</span>
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedReport(r)}
                      className="px-4 sm:px-5 py-2 rounded-full !bg-[#E02B2B] hover:!bg-[#c92424] !text-white text-xs font-medium transition flex items-center gap-1.5 shadow-sm hover:shadow-md cursor-pointer"
                    >
                      <span>Buka Chat &amp; Rincian Kasus</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Built-in Interactive Report Detail & Secure Counseling Chat Modal */}
      {selectedReport && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/50 backdrop-blur-xs animate-in fade-in"
          onClick={() => setSelectedReport(null)}
        >
          <div 
            className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Top Header */}
            <div className="p-5 sm:p-6 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between gap-4 shrink-0">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-base font-bold text-slate-900">{selectedReport.id}</span>
                  {getStatusBadge(selectedReport.status)}
                </div>
                <p className="text-xs text-slate-500 font-normal">
                  Kategori: <strong className="text-slate-700 uppercase">{selectedReport.category}</strong> • Prioritas: <strong className="text-slate-700 uppercase">{selectedReport.urgency}</strong>
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedReport(null)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/80 transition cursor-pointer"
                aria-label="Tutup Detail"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 text-xs sm:text-sm">
              {/* Incident Facts Box */}
              <div className="p-4 rounded-2xl bg-[#F8F7F4] border border-slate-200/80 space-y-3">
                <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
                  Data Kejadian Dilaporkan
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Waktu:</span>
                    <span className="text-slate-800 font-medium">{selectedReport.incidentDate} • {selectedReport.incidentTime}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Lokasi:</span>
                    <span className="text-slate-800 font-medium">{selectedReport.location}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Pihak:</span>
                    <span className="text-slate-800 font-medium">{selectedReport.partiesInvolved || '-'}</span>
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-200/60 text-slate-700 leading-relaxed break-words font-normal">
                  <span className="text-[11px] text-slate-400 block mb-0.5">Kronologi Verbatim:</span>
                  &ldquo;{selectedReport.description}&rdquo;
                </div>
              </div>

              {/* Secure Chat with Counselor Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4 text-[#E02B2B]" />
                    <span>Ruang Komunikasi Privat Guru BK &amp; Siswa</span>
                  </span>
                  <span className="text-[11px] text-slate-400">Terenkripsi Privat</span>
                </div>

                <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200/70 min-h-[160px] max-h-[220px] overflow-y-auto space-y-2.5">
                  {selectedReport.messages && selectedReport.messages.length > 0 ? (
                    selectedReport.messages.map((m) => (
                      <div 
                        key={m.id}
                        className={`flex flex-col ${m.sender === 'student' ? 'items-end' : 'items-start'}`}
                      >
                        <div className={`p-3 rounded-2xl max-w-[85%] text-xs leading-relaxed break-words shadow-2xs ${
                          m.sender === 'student' 
                            ? 'bg-slate-900 text-white rounded-br-xs' 
                            : 'bg-white text-slate-800 border border-slate-200 rounded-bl-xs'
                        }`}>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-[11px] opacity-80">{m.senderName}</span>
                            <span className="text-[10px] opacity-60">
                              {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p>{m.content}</p>
                          {m.photoUrl && (
                            <div className="mt-2 rounded-xl overflow-hidden border border-slate-200/60 max-w-[200px] bg-slate-100">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img 
                                src={m.photoUrl} 
                                alt="Lampiran bukti" 
                                className="w-full h-auto object-cover rounded-lg cursor-pointer hover:opacity-90 transition"
                                onClick={() => window.open(m.photoUrl, '_blank')}
                              />
                              <span className="text-[10px] text-slate-400 block px-1 py-0.5">Bukti Foto (Klik perbesar)</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-6 text-center text-xs text-slate-400 space-y-1">
                      <p>Belum ada pesan tercatat pada berkas ini.</p>
                      <p className="text-[11px]">Anda dapat mengirim pesan keterangan tambahan kepada Guru BK di bawah ini.</p>
                    </div>
                  )}
                </div>

                {/* File Attachment Preview */}
                {attachmentPhoto && (
                  <div className="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-xl text-xs text-slate-800">
                    <ImageIcon className="w-4 h-4 text-[#E02B2B] shrink-0" />
                    <span className="truncate max-w-[220px] font-medium text-slate-700">{attachmentName || 'Foto Terlampir'}</span>
                    <button
                      type="button"
                      onClick={() => { setAttachmentPhoto(null); setAttachmentName(''); }}
                      className="text-red-500 hover:text-red-700 ml-auto p-1 cursor-pointer"
                      title="Hapus lampiran"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Input to send response to Counselor */}
                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    title="Upload Foto Bukti"
                    className="p-2.5 rounded-xl border border-slate-300 hover:border-slate-400 bg-slate-50 hover:bg-slate-100 text-slate-600 transition cursor-pointer flex items-center justify-center shrink-0"
                  >
                    <Paperclip className="w-4 h-4" />
                  </button>
                  <input
                    type="text"
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    placeholder="Tulis pesan atau upload foto bukti ke Guru BK..."
                    className="flex-1 px-4 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#E02B2B]/20 focus:border-[#E02B2B] bg-white transition"
                  />
                  <button
                    type="submit"
                    disabled={isSending || (!chatMessage.trim() && !attachmentPhoto)}
                    className="px-4 py-2.5 rounded-xl !bg-[#E02B2B] hover:!bg-[#c92424] !text-white text-xs font-medium transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shrink-0"
                  >
                    {isSending ? (
                      <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    ) : (
                      <Send className="w-3.5 h-3.5" />
                    )}
                    <span>Kirim</span>
                  </button>
                </form>
              </div>
            </div>

            {/* Modal Bottom Close Area */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 shrink-0">
              <span className="flex items-center gap-1.5 text-[11px]">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Terlindungi Standar Kerahasiaan Satuan Pendidikan</span>
              </span>
              <button
                type="button"
                onClick={() => setSelectedReport(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 font-medium hover:bg-slate-100 transition cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
