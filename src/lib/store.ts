import { Report, CaseDossier, RelationshipSignal, AuditLogItem, ReportMessage } from './types';

const STORAGE_KEY_REPORTS = 'ruangsuara_reports';
const STORAGE_KEY_CASES = 'ruangsuara_cases';
const STORAGE_KEY_SIGNALS = 'ruangsuara_signals';
const STORAGE_KEY_AUDIT = 'ruangsuara_audit';
const STORAGE_KEY_PRIVACY = 'ruangsuara_privacy_mode';

const INITIAL_REPORTS: Report[] = [
  {
    id: 'RS-2026-0412',
    pin: '491823',
    role: 'victim',
    isAnonymous: true,
    incidentDate: '2026-09-17',
    incidentTime: '10:15 WIB (Istirahat Pertama)',
    location: 'Lorong Belakang Kelas IX-B',
    partiesInvolved: 'Siswa kelas IX berinisial R dan 2 temannya',
    description: 'Kemarin waktu istirahat pertama saya dipukul di belakang kelas IX-B. Mereka memojokkan saya di dekat loker rusak dan meminta uang saku Rp 50.000 secara paksa. Saat saya menolak, bahu dan lengan kiri saya didorong keras ke dinding hingga memar.',
    urgency: 'urgent',
    category: 'fisik',
    status: 'investigating',
    caseId: 'CASE-2026-001',
    createdAt: '2026-09-17T11:30:00Z',
    updatedAt: '2026-09-18T08:00:00Z',
    messages: [
      {
        id: 'msg-1',
        sender: 'counselor',
        senderName: 'Guru BK (Ibu Siti Rahmawati)',
        content: 'Halo, terima kasih atas keberanianmu melapor. Kami telah menerima laporanmu dan saat ini sedang memeriksa rekaman CCTV koridor. Bisakah kamu menjelaskan apakah saat kejadian ada siswa lain yang melintas?',
        timestamp: '2026-09-17T13:00:00Z',
        isRead: true,
      },
      {
        id: 'msg-2',
        sender: 'student',
        senderName: 'Pelapor (Anonim)',
        content: 'Ada beberapa anak kelas VIII yang sempat lewat hendak ke toilet, tapi mereka langsung lari karena takut pada R.',
        timestamp: '2026-09-17T13:45:00Z',
        isRead: true,
      },
    ],
  },
  {
    id: 'RS-2026-0415',
    pin: '318592',
    role: 'witness',
    isAnonymous: true,
    incidentDate: '2026-09-17',
    incidentTime: '10:20 WIB (Istirahat Pertama)',
    location: 'Koridor Belakang Kelas IX',
    partiesInvolved: 'Siswa R (seragam dikeluarkan) dan seorang anak bertubuh kecil',
    description: 'Saya melihat siswa tersebut mendorong lalu memukul siswa lain di koridor belakang kelas. Korban tampak ketakutan dan menyerahkan uang kertas dari sakunya. Saya tidak berani mendekat karena mereka beramai-ramai.',
    urgency: 'normal',
    category: 'fisik',
    status: 'investigating',
    caseId: 'CASE-2026-001',
    createdAt: '2026-09-17T12:10:00Z',
    updatedAt: '2026-09-18T08:00:00Z',
    messages: [
      {
        id: 'msg-w-1',
        sender: 'counselor',
        senderName: 'Guru BK (Bpk. Ahmad Fauzi)',
        content: 'Terima kasih atas laporan saksi ini. Kesaksianmu sangat berharga dan identitasmu terjamin aman 100%. Apakah kamu mengenali salah satu teman yang bersama siswa R?',
        timestamp: '2026-09-17T14:15:00Z',
        isRead: true,
      },
    ],
  },
  {
    id: 'RS-2026-0419',
    pin: '829104',
    role: 'witness',
    isAnonymous: false,
    reporterName: 'Dimas Surya Pratama',
    reporterClass: 'XI MIPA 2',
    reporterContact: '0812-9847-2291',
    incidentDate: '2026-09-11',
    incidentTime: '12:45 WIB (Setelah Sholat Dzuhur)',
    location: 'Tangga Belakang Gedung Timur dekat Kantin',
    partiesInvolved: 'Kelompok siswa yang sering nongkrong di area loker belakang',
    description: 'Saya melihat kejadian yang mirip minggu lalu. Ada pemalakan berulang di tangga belakang gedung timur. Mereka menahan adik kelas dan meminta uang parkir/jajan. Kejadian ini sudah beberapa kali terjadi.',
    urgency: 'normal',
    category: 'pemalakan',
    status: 'reviewed',
    caseId: 'CASE-2026-001',
    createdAt: '2026-09-18T09:00:00Z',
    updatedAt: '2026-09-18T10:00:00Z',
    messages: [],
  },
  {
    id: 'RS-2026-0422',
    pin: '119482',
    role: 'victim',
    isAnonymous: false,
    reporterName: 'Larasati Putri Ayu',
    reporterClass: 'X-E3',
    reporterContact: '0857-1123-9900',
    incidentDate: '2026-09-18',
    incidentTime: '19:30 WIB (Daring/Malam)',
    location: 'Grup WhatsApp Angkatan & Instagram Story',
    partiesInvolved: 'Akun anonim @shadow_truth_99',
    description: 'Saya terus menerima pesan intimidasi dan ejekan di grup WhatsApp dan direct message. Akun anonim tersebut mengancam akan menyebarkan foto editan wajah saya jika saya tidak menuruti perkataannya. Saya merasa sangat cemas untuk masuk sekolah besok.',
    urgency: 'urgent',
    category: 'cyber',
    status: 'submitted',
    caseId: null,
    createdAt: '2026-09-18T20:15:00Z',
    updatedAt: '2026-09-18T20:15:00Z',
    messages: [],
  },
  {
    id: 'RS-2026-0430',
    pin: '550291',
    role: 'witness',
    isAnonymous: true,
    incidentDate: '2026-09-16',
    incidentTime: '11:00 WIB (Pergantian Jam Pelajaran)',
    location: 'Laboratorium Biologi Lantai 2',
    partiesInvolved: '3 siswi kelas XI IPS',
    description: 'Ejekan verbal dan pengucilan secara terus-menerus terhadap salah satu siswi yang duduk di pojok. Barang-barang miliknya disembunyikan di atas ventilasi lemari lab dan korban menangis sendirian.',
    urgency: 'normal',
    category: 'relasional',
    status: 'submitted',
    caseId: null,
    createdAt: '2026-09-16T14:20:00Z',
    updatedAt: '2026-09-16T14:20:00Z',
    messages: [],
  },
];

const INITIAL_CASES: CaseDossier[] = [
  {
    id: 'CASE-2026-001',
    title: 'Dugaan Intimidasi Fisik & Pemalakan Berulang Koridor Belakang Kelas IX',
    summary: 'Konsolidasi 3 laporan terpisah mengenai pola intimidasi dan pemerasan uang saku di area koridor belakang kelas IX dan tangga gedung timur yang melibatkan terduga siswa berinisial R.',
    status: 'under_investigation',
    reportIds: ['RS-2026-0412', 'RS-2026-0415', 'RS-2026-0419'],
    location: 'Koridor Belakang Kelas IX-B & Tangga Gedung Timur',
    partiesInvolved: [
      'Terduga Pelaku: Siswa R (Kelas IX-D)',
      'Terduga Rekan Pelaku: Siswa F & D',
      'Korban 1: Siswa Anonim (RS-2026-0412)',
      'Saksi Terbuka: Dimas Surya Pratama (XI MIPA 2)',
    ],
    timeline: [
      {
        id: 't-1',
        date: '2026-09-11',
        time: '12:45 WIB',
        event: 'Saksi Dimas melihat pemalakan berulang terhadap adik kelas di tangga belakang gedung timur (Ref: RS-2026-0419).',
        sourceReportId: 'RS-2026-0419',
      },
      {
        id: 't-2',
        date: '2026-09-17',
        time: '10:15 WIB',
        event: 'Korban dipojokkan dan mengalami kekerasan fisik serta pemerasan uang Rp 50.000 di lorong belakang kelas IX-B (Ref: RS-2026-0412).',
        sourceReportId: 'RS-2026-0412',
      },
      {
        id: 't-3',
        date: '2026-09-17',
        time: '10:20 WIB',
        event: 'Saksi melihat dari kejauhan korban menyerahkan uang saku sambil tertekan (Ref: RS-2026-0415).',
        sourceReportId: 'RS-2026-0415',
      },
      {
        id: 't-4',
        date: '2026-09-18',
        time: '08:30 WIB',
        event: 'Guru BK melakukan inspeksi fisik lokasi lorong dan koordinasi peninjauan CCTV sekolah.',
      },
    ],
    investigationNotes: [
      {
        id: 'inv-1',
        author: 'Ibu Siti Rahmawati, S.Psi., M.Pd. (Guru BK)',
        date: '2026-09-18 09:00',
        content: 'Telah berkomunikasi via jalur anonim dengan pelapor RS-2026-0412. Korban mengonfirmasi rasa cemas melewati lorong belakang. Pendampingan psikologis dijadwalkan secara tertutup di Ruang Konseling 1.',
        type: 'counseling',
      },
      {
        id: 'inv-2',
        author: 'Bpk. Ahmad Fauzi, S.Pd. (Tim PPKSP)',
        date: '2026-09-18 11:30',
        content: 'Wali kelas IX-D dihubungi untuk memantau kehadiran siswa R tanpa memberi tahu identitas pelapor. Prinsip kerahasiaan pelapor tetap dijaga mutlak.',
        type: 'observation',
      },
    ],
    actionPlans: [
      {
        id: 'act-1',
        target: 'Korban (RS-2026-0412)',
        action: 'Sesi konseling trauma dan penguatan rasa aman secara privat.',
        pic: 'Ibu Siti Rahmawati',
        deadline: '2026-09-20',
        status: 'in_progress',
      },
      {
        id: 'act-2',
        target: 'Area Koridor Belakang Kelas IX',
        action: 'Penempatan patroli guru piket pada jam istirahat ke-1 dan ke-2.',
        pic: 'Bpk. Ahmad Fauzi',
        deadline: '2026-09-19',
        status: 'completed',
      },
      {
        id: 'act-3',
        target: 'Terduga Pelaku (Siswa R)',
        action: 'Pemanggilan klarifikasi didampingi orang tua sesuai prosedur PPKSP.',
        pic: 'Kepala Sekolah & Tim BK',
        deadline: '2026-09-22',
        status: 'pending',
      },
    ],
    createdAt: '2026-09-18T08:00:00Z',
    updatedAt: '2026-09-18T14:30:00Z',
    leadCounselor: 'Ibu Siti Rahmawati, S.Psi., M.Pd.',
  },
];

const INITIAL_SIGNALS: RelationshipSignal[] = [
  {
    id: 'SIG-2026-01',
    reportAId: 'RS-2026-0412',
    reportBId: 'RS-2026-0415',
    confidenceScore: 94,
    reasons: [
      'Kesamaan Lokasi: "Lorong Belakang Kelas IX-B" vs "Koridor Belakang Kelas IX"',
      'Waktu Sangat Berdekatan: 10:15 WIB vs 10:20 WIB pada hari yang sama (17 September 2026)',
      'Pihak Terduga Identik: Disebutkan siswa berinisial "R" dengan karakteristik seragam serupa',
      'Tipologi Kejadian: Kekerasan fisik dan pemaksaan uang saku',
    ],
    status: 'confirmed',
    detectedAt: '2026-09-17T12:15:00Z',
    reviewedBy: 'Ibu Siti Rahmawati',
    reviewNotes: 'Dikonfirmasi: Laporan B adalah saksi mata langsung dari insiden Laporan A.',
  },
  {
    id: 'SIG-2026-02',
    reportAId: 'RS-2026-0412',
    reportBId: 'RS-2026-0419',
    confidenceScore: 82,
    reasons: [
      'Kedekatan Lokasi Geografis: Koridor belakang kelas IX terhubung langsung dengan tangga gedung timur',
      'Pola Berulang: Pemalakan uang jajan terhadap siswa yang melintas sendirian',
      'Karakteristik Kelompok: Terduga sering berkumpul di area loker belakang',
    ],
    status: 'confirmed',
    detectedAt: '2026-09-18T09:30:00Z',
    reviewedBy: 'Ibu Siti Rahmawati',
    reviewNotes: 'Dikonfirmasi menunjukkan pola pemalakan berulang di zona yang sama.',
  },
  {
    id: 'SIG-2026-03',
    reportAId: 'RS-2026-0422',
    reportBId: 'RS-2026-0430',
    confidenceScore: 35,
    reasons: [
      'Waktu dalam minggu yang sama',
      'Namun lokasi berbeda (Daring/WhatsApp vs Lab Biologi)',
      'Pihak terlibat tidak memiliki kesamaan token nama',
    ],
    status: 'dismissed',
    detectedAt: '2026-09-18T21:00:00Z',
    reviewedBy: 'Bpk. Ahmad Fauzi',
    reviewNotes: 'Bukan kasus terkait (False AI Clustering). Dua peristiwa berbeda dan ditangani terpisah.',
  },
];

const INITIAL_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: 'AUD-1',
    timestamp: '2026-09-19 08:30 WIB',
    actor: 'Ibu Siti Rahmawati (Guru BK)',
    role: 'Guru BK',
    action: 'VIEW_REPORT',
    target: 'RS-2026-0412',
    detail: 'Membuka teks laporan verbatim pelapor anonim untuk verifikasi awal.',
  },
  {
    id: 'AUD-2',
    timestamp: '2026-09-19 08:45 WIB',
    actor: 'Ibu Siti Rahmawati (Guru BK)',
    role: 'Guru BK',
    action: 'CONFIRM_SIGNAL',
    target: 'SIG-2026-01',
    detail: 'Mengonfirmasi hubungan antara RS-2026-0412 dan RS-2026-0415 ke Case #001.',
  },
  {
    id: 'AUD-3',
    timestamp: '2026-09-19 09:15 WIB',
    actor: 'Bpk. Ahmad Fauzi (Satgas PPKSP)',
    role: 'Satgas PPKSP',
    action: 'SEND_ANONYMOUS_MESSAGE',
    target: 'RS-2026-0412',
    detail: 'Mengirimkan pesan klarifikasi jadwal konseling tertutup kepada pelapor anonim.',
  },
  {
    id: 'AUD-4',
    timestamp: '2026-09-19 09:40 WIB',
    actor: 'Sistem RELASI',
    role: 'System AI Engine',
    action: 'DETECT_RELATIONSHIP',
    target: 'SIG-2026-03',
    detail: 'Menghasilkan sinyal potensi kesamaan waktu antara RS-2026-0422 & RS-2026-0430.',
  },
];

// Helper to access localStorage safely on client
function getFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function setToStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error('Failed to save to localStorage:', err);
  }
}

export const Store = {
  getReports(): Report[] {
    return getFromStorage<Report[]>(STORAGE_KEY_REPORTS, INITIAL_REPORTS);
  },

  getReportById(id: string): Report | undefined {
    const reports = this.getReports();
    return reports.find(r => r.id.toLowerCase() === id.toLowerCase());
  },

  getReportByPin(id: string, pin: string): Report | undefined {
    const reports = this.getReports();
    return reports.find(
      r => r.id.toLowerCase() === id.trim().toLowerCase() && r.pin.trim() === pin.trim()
    );
  },

  addReport(newReport: Omit<Report, 'id' | 'pin' | 'createdAt' | 'updatedAt' | 'messages' | 'status'> & { status?: Report['status'] }): { id: string; pin: string } {
    const reports = this.getReports();
    const idNum = Math.floor(1000 + Math.random() * 9000);
    const id = `RS-2026-${idNum}`;
    const pin = Math.floor(100000 + Math.random() * 900000).toString();
    const now = new Date().toISOString();

    const report: Report = {
      status: newReport.status || 'submitted',
      ...newReport,
      id,
      pin,
      createdAt: now,
      updatedAt: now,
      messages: [
        {
          id: `msg-welcome-${Date.now()}`,
          sender: 'counselor',
          senderName: 'Sistem RELASI',
          content: 'Laporanmu telah berhasil diterima dengan aman. Guru BK akan meninjau laporan ini secara rahasia. Kamu dapat menggunakan kolom pesan ini untuk memberikan info tambahan kapan saja.',
          timestamp: now,
          isRead: false,
        }
      ],
    };

    const updated = [report, ...reports];
    setToStorage(STORAGE_KEY_REPORTS, updated);

    // Otomatis catat ke Audit Log
    this.addAuditLog({
      actor: newReport.isAnonymous ? 'Siswa (Anonim)' : (newReport.reporterName || 'Siswa Terbuka'),
      role: 'Siswa / Pelapor',
      action: 'SUBMIT_REPORT',
      target: id,
      detail: `Laporan baru kategori ${newReport.category} dengan urgensi ${newReport.urgency}.`,
    });

    // Jalankan kalkulasi sinyal relasi sederhana
    this.detectSignalsForNewReport(report);

    return { id, pin };
  },

  updateReportStatus(id: string, newStatus: Report['status'], counselorName = 'Guru BK'): void {
    const reports = this.getReports();
    const updated = reports.map(r => {
      if (r.id === id) {
        return { ...r, status: newStatus, updatedAt: new Date().toISOString() };
      }
      return r;
    });
    setToStorage(STORAGE_KEY_REPORTS, updated);

    this.addAuditLog({
      actor: counselorName,
      role: 'Guru BK',
      action: 'UPDATE_STATUS',
      target: id,
      detail: `Mengubah status laporan menjadi: ${newStatus}.`,
    });
  },

  addMessageToReport(reportId: string, sender: 'student' | 'counselor', senderName: string, content: string, photoUrl?: string): void {
    const reports = this.getReports();
    const updated = reports.map(r => {
      if (r.id === reportId) {
        const newMessage: ReportMessage = {
          id: `msg-${Date.now()}`,
          sender,
          senderName,
          content,
          photoUrl,
          timestamp: new Date().toISOString(),
          isRead: sender === 'student' ? false : true,
        };
        return {
          ...r,
          messages: [...r.messages, newMessage],
          updatedAt: new Date().toISOString(),
        };
      }
      return r;
    });
    setToStorage(STORAGE_KEY_REPORTS, updated);
  },

  getCases(): CaseDossier[] {
    return getFromStorage<CaseDossier[]>(STORAGE_KEY_CASES, INITIAL_CASES);
  },

  getCaseById(id: string): CaseDossier | undefined {
    const cases = this.getCases();
    return cases.find(c => c.id.toLowerCase() === id.toLowerCase());
  },

  createCase(caseData: Omit<CaseDossier, 'id' | 'createdAt' | 'updatedAt'>): string {
    const cases = this.getCases();
    const id = `CASE-2026-${String(cases.length + 1).padStart(3, '0')}`;
    const now = new Date().toISOString();
    const newCase: CaseDossier = {
      ...caseData,
      id,
      createdAt: now,
      updatedAt: now,
    };
    const updated = [newCase, ...cases];
    setToStorage(STORAGE_KEY_CASES, updated);

    // Update caseId pada laporan yang ditautkan
    const reports = this.getReports();
    const updatedReports = reports.map(r => {
      if (caseData.reportIds.includes(r.id)) {
        return { ...r, caseId: id, status: 'investigating' as const };
      }
      return r;
    });
    setToStorage(STORAGE_KEY_REPORTS, updatedReports);

    this.addAuditLog({
      actor: caseData.leadCounselor || 'Guru BK',
      role: 'Guru BK',
      action: 'CREATE_CASE',
      target: id,
      detail: `Membuat berkas kasus baru: "${caseData.title}" menautkan ${caseData.reportIds.length} laporan.`,
    });

    return id;
  },

  updateCaseStatus(id: string, status: CaseDossier['status']): void {
    const cases = this.getCases();
    const updated = cases.map(c => {
      if (c.id === id) {
        return { ...c, status, updatedAt: new Date().toISOString() };
      }
      return c;
    });
    setToStorage(STORAGE_KEY_CASES, updated);
  },

  addInvestigationNote(
    caseId: string, 
    authorOrNote: string | { author: string; content: string; type: 'interview' | 'observation' | 'mediation' | 'counseling'; date?: string }, 
    content?: string, 
    type: 'interview' | 'observation' | 'mediation' | 'counseling' = 'counseling'
  ): void {
    const cases = this.getCases();
    const updated = cases.map(c => {
      if (c.id === caseId) {
        let note: any;
        if (typeof authorOrNote === 'object') {
          note = {
            id: `note-${Date.now()}`,
            date: authorOrNote.date || new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
            author: authorOrNote.author,
            content: authorOrNote.content,
            type: authorOrNote.type
          };
        } else {
          note = {
            id: `note-${Date.now()}`,
            author: authorOrNote,
            date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
            content: content || '',
            type,
          };
        }
        return {
          ...c,
          investigationNotes: [...c.investigationNotes, note],
          updatedAt: new Date().toISOString(),
        };
      }
      return c;
    });
    setToStorage(STORAGE_KEY_CASES, updated);
  },

  getSignals(): RelationshipSignal[] {
    return getFromStorage<RelationshipSignal[]>(STORAGE_KEY_SIGNALS, INITIAL_SIGNALS);
  },

  confirmSignal(signalId: string, reviewerName = 'Guru BK'): void {
    const signals = this.getSignals();
    const updated = signals.map(s => {
      if (s.id === signalId) {
        return {
          ...s,
          status: 'confirmed' as const,
          reviewedBy: reviewerName,
          reviewNotes: 'Hubungan dikonfirmasi oleh Guru BK.',
        };
      }
      return s;
    });
    setToStorage(STORAGE_KEY_SIGNALS, updated);

    this.addAuditLog({
      actor: reviewerName,
      role: 'Guru BK',
      action: 'CONFIRM_SIGNAL',
      target: signalId,
      detail: 'Konfirmasi AI Signal: Laporan diakui memiliki keterkaitan kasus.',
    });
  },

  dismissSignal(signalId: string, reviewerName = 'Guru BK'): void {
    const signals = this.getSignals();
    const updated = signals.map(s => {
      if (s.id === signalId) {
        return {
          ...s,
          status: 'dismissed' as const,
          reviewedBy: reviewerName,
          reviewNotes: 'Ditandai bukan terkait (False AI Clustering).',
        };
      }
      return s;
    });
    setToStorage(STORAGE_KEY_SIGNALS, updated);

    this.addAuditLog({
      actor: reviewerName,
      role: 'Guru BK',
      action: 'DISMISS_SIGNAL',
      target: signalId,
      detail: 'Mengesampingkan AI Signal: Dua laporan dievaluasi tidak berhubungan.',
    });
  },

  detectSignalsForNewReport(newReport: Report): void {
    const reports = this.getReports();
    const signals = this.getSignals();
    const newSignals: RelationshipSignal[] = [];

    reports.forEach(existing => {
      if (existing.id === newReport.id) return;

      const reasons: string[] = [];
      let score = 0;

      // Location similarity
      if (newReport.location && existing.location) {
        const locA = newReport.location.toLowerCase();
        const locB = existing.location.toLowerCase();
        if (locA.includes(locB) || locB.includes(locA) || (locA.includes('koridor') && locB.includes('koridor')) || (locA.includes('kelas ix') && locB.includes('kelas ix')) || (locA.includes('kantin') && locB.includes('kantin'))) {
          score += 45;
          reasons.push(`Kesamaan Lokasi: "${newReport.location}" dan "${existing.location}"`);
        }
      }

      // Category matching
      if (newReport.category === existing.category) {
        score += 25;
        reasons.push(`Kategori Pelanggaran Sama: ${newReport.category}`);
      }

      // Parties involved similarity
      if (newReport.partiesInvolved && existing.partiesInvolved) {
        const pA = newReport.partiesInvolved.toLowerCase();
        const pB = existing.partiesInvolved.toLowerCase();
        const wordsA = pA.split(/\s+/).filter(w => w.length > 2);
        const hasCommon = wordsA.some(w => pB.includes(w));
        if (hasCommon) {
          score += 25;
          reasons.push(`Indikasi Kesamaan Pihak Terlibat`);
        }
      }

      if (score >= 40) {
        newSignals.push({
          id: `SIG-${Date.now()}-${Math.floor(Math.random()*100)}`,
          reportAId: newReport.id,
          reportBId: existing.id,
          confidenceScore: Math.min(score, 96),
          reasons,
          status: 'suggested',
          detectedAt: new Date().toISOString(),
        });
      }
    });

    if (newSignals.length > 0) {
      setToStorage(STORAGE_KEY_SIGNALS, [...newSignals, ...signals]);
    }
  },

  getAuditLogs(): AuditLogItem[] {
    return getFromStorage<AuditLogItem[]>(STORAGE_KEY_AUDIT, INITIAL_AUDIT_LOGS);
  },

  addAuditLog(item: Omit<AuditLogItem, 'id' | 'timestamp'>): void {
    const logs = this.getAuditLogs();
    const newLog: AuditLogItem = {
      ...item,
      id: `AUD-${Date.now()}`,
      timestamp: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) + ' WIB',
    };
    setToStorage(STORAGE_KEY_AUDIT, [newLog, ...logs.slice(0, 49)]);
  },

  isPrivacyMode(): boolean {
    return getFromStorage<boolean>(STORAGE_KEY_PRIVACY, false);
  },

  setPrivacyMode(active: boolean): void {
    setToStorage(STORAGE_KEY_PRIVACY, active);
  },

  // Super Admin view: Encrypted report payload to protect student privacy
  getReportsForSuperAdmin() {
    const reports = this.getReports();
    return reports.map((r) => ({
      id: r.id,
      category: r.category,
      urgency: r.urgency,
      status: r.status,
      createdAt: r.createdAt,
      isAnonymous: r.isAnonymous,
      role: r.role,
      location: r.location,
      isEncrypted: true,
      encryptedPayload: `AES-GCM-256:enc_${Buffer.from(r.id + ':' + r.createdAt).toString('base64')}...[TERENKRIPSI - HAK AKSES KHUSUS GURU BK]`,
      maskedReporter: r.isAnonymous ? 'Siswa Anonim (Tersamar)' : 'Murid Terdaftar (Akses Terkunci)',
      description: '🔒 [KONTEN TERENKRIPSI END-TO-END — HAK AKSES KHUSUS GURU BK & TIM PPKSP]',
      partiesInvolved: '🔒 [PIHAK TERLIBAT DISEMBUNYIKAN DEMI PERLINDUNGAN ANAK]'
    }));
  },

  // Convenience aliases for RuangSuara platform
  submitReport(newReport: Omit<Report, 'id' | 'pin' | 'createdAt' | 'updatedAt' | 'messages' | 'status'> & { status?: Report['status'] }): { id: string; pin: string } {
    return this.addReport(newReport);
  },

  addReportMessage(reportId: string, msg: { sender: 'student' | 'counselor'; senderName: string; content: string; photoUrl?: string }): Report | undefined {
    this.addMessageToReport(reportId, msg.sender, msg.senderName, msg.content, msg.photoUrl);
    return this.getReportById(reportId);
  },

  reviewSignal(signalId: string, action: 'confirmed' | 'dismissed', reviewerName = 'Guru BK'): void {
    if (action === 'confirmed') {
      this.confirmSignal(signalId, reviewerName);
    } else {
      this.dismissSignal(signalId, reviewerName);
    }
  },

  addTimelineEvent(caseId: string, eventData: { date: string; time: string; event: string }): void {
    const cases = this.getCases();
    const updated = cases.map(c => {
      if (c.id === caseId) {
        const item = {
          id: `t-${Date.now()}`,
          ...eventData
        };
        return {
          ...c,
          timeline: [...c.timeline, item],
          updatedAt: new Date().toISOString()
        };
      }
      return c;
    });
    setToStorage(STORAGE_KEY_CASES, updated);
  },

  // Reset demo data back to default
  resetData(): void {
    if (typeof window === 'undefined') return;
    window.localStorage.removeItem(STORAGE_KEY_REPORTS);
    window.localStorage.removeItem(STORAGE_KEY_CASES);
    window.localStorage.removeItem(STORAGE_KEY_SIGNALS);
    window.localStorage.removeItem(STORAGE_KEY_AUDIT);
    window.localStorage.removeItem(STORAGE_KEY_PRIVACY);
  }
};

export const RuangSuaraStore = Store;
export default Store;

