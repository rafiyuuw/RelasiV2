import { PrismaClient, Role, AccountStatus, UrgencyLevel, ReportStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // 1. Clean existing records
  await prisma.auditLog.deleteMany({});
  await prisma.chatMessage.deleteMany({});
  await prisma.caseRecord.deleteMany({});
  await prisma.triageAnalysis.deleteMany({});
  await prisma.report.deleteMany({});
  await prisma.user.deleteMany({});

  // 2. Create Users
  const superAdmin = await prisma.user.create({
    data: {
      id: 'usr-admin-1',
      name: 'Administrator Super Panel',
      email: 'admin@gmail.com',
      password: 'admin123',
      role: Role.super_admin,
      roleLabel: 'Super Admin Website & Sistem',
      departmentOrClass: 'Tata Kelola IT & Satuan PPKSP',
      status: AccountStatus.active,
    },
  });

  const counselor = await prisma.user.create({
    data: {
      id: 'usr-bk-1',
      name: 'Ibu Siti Rahmawati, S.Psi., M.Pd.',
      email: 'guru@gmail.com',
      password: 'guru123',
      role: Role.counselor,
      roleLabel: 'Guru Bimbingan Konseling (BK)',
      departmentOrClass: 'Koordinator Unit BK & Tim PPKSP',
      status: AccountStatus.active,
    },
  });

  const counselor2 = await prisma.user.create({
    data: {
      id: 'usr-bk-2',
      name: 'Bpk. Ahmad Fauzi, S.Pd.',
      email: 'ahmad.fauzi@sekolah.sch.id',
      password: 'guru123',
      role: Role.counselor,
      roleLabel: 'Guru BK & Anggota Satgas',
      departmentOrClass: 'Unit Bimbingan Konseling',
      status: AccountStatus.active,
    },
  });

  const student = await prisma.user.create({
    data: {
      id: 'usr-student-1',
      name: 'Dimas Surya Pratama',
      email: 'murid@gmail.com',
      password: 'murid123',
      role: Role.student,
      roleLabel: 'Siswa (Pelapor Terdaftar)',
      departmentOrClass: 'XI MIPA 2',
      status: AccountStatus.active,
    },
  });

  const student2 = await prisma.user.create({
    data: {
      id: 'usr-student-2',
      name: 'Larasati Putri Ayu',
      email: 'larasati.putri@sekolah.sch.id',
      password: 'murid123',
      role: Role.student,
      roleLabel: 'Siswa (X-E3)',
      departmentOrClass: 'X-E3',
      status: AccountStatus.active,
    },
  });

  console.log('✅ Default users created:');
  console.log('   - Super Admin: admin@gmail.com / admin123');
  console.log('   - Guru BK    : guru@gmail.com / guru123');
  console.log('   - Siswa      : murid@gmail.com / murid123');

  // 3. Create Sample Reports
  const report1 = await prisma.report.create({
    data: {
      id: 'RS-2026-0419',
      reporterId: student.id,
      reporterName: student.name,
      reporterEmail: student.email,
      isAnonymous: false,
      category: 'Perundungan Verbal & Pengucilan',
      urgency: UrgencyLevel.urgent,
      location: 'Kantin Belakang & Area Parkir Motor Siswa',
      description: 'Saya diejek secara berulang dan disudutkan saat jam istirahat kedua oleh sekelompok siswa kelas XII. Mereka mengancam jika saya melapor akan ada pembalasan di luar sekolah.',
      partiesInvolved: 'Riko (XII IPS 1), Bagas (XII IPS 3)',
      status: ReportStatus.followup,
    },
  });

  const report2 = await prisma.report.create({
    data: {
      id: 'RS-2026-0412',
      reporterId: student2.id,
      reporterName: 'Pelapor Dilindungi',
      reporterEmail: student2.email,
      isAnonymous: true,
      category: 'Intimidasi & Cyberbullying',
      urgency: UrgencyLevel.medium,
      location: 'Grup WhatsApp Angkatan & Lorong Lantai 2',
      description: 'Terdapat akun tiruan dan grup tidak resmi yang menyebarkan editan foto merendahkan dan ancaman sosial terhadap siswi kelas X.',
      partiesInvolved: 'Akun anonim @sekolah_confess_26',
      status: ReportStatus.submitted,
    },
  });

  const report3 = await prisma.report.create({
    data: {
      id: 'RS-2026-0398',
      reporterId: student.id,
      reporterName: student.name,
      reporterEmail: student.email,
      isAnonymous: false,
      category: 'Pemerasan & Kekerasan Fisik',
      urgency: UrgencyLevel.urgent,
      location: 'Koridor Toilet Belakang Lapangan Futsal',
      description: 'Pemaksaan meminta uang kas kelas dan dorongan fisik ke dinding saat jam pulang sekolah.',
      partiesInvolved: 'Siswa berinisial RK & geng motor alumni',
      status: ReportStatus.under_review,
    },
  });

  // 4. Create Medical & Counseling Case Records
  await prisma.caseRecord.create({
    data: {
      reportId: report1.id,
      studentName: 'Dimas Surya Pratama',
      studentClass: 'XI MIPA 2',
      diagnosis: 'Gejala Kecemasan Reaktif & Penurunan Motivasi Belajar',
      physicalInjury: 'Tidak terdapat trauma fisik mayor; tercatat keluhan insomnia dan sakit kepala tegang.',
      emotionalState: 'Cemas, ketakutan saat melewati area parkir, waspada berlebihan.',
      counselorNotes: 'Siswa menceritakan kronologi dengan kooperatif. Perlu pengawalan keamanan internal saat jam istirahat dan pulang sekolah.',
      actionTaken: '1. Konseling individu empatik\n2. Pemanggilan terpisah pihak terlapor dengan didampingi wali kelas\n3. Pengamanan titik rawan kantin oleh satgas PPKSP',
      followUpPlan: 'Sesi evaluasi mingguan kedua dijadwalkan hari Jumat pukul 10.00 WIB.',
      counselorInCharge: counselor.name,
    },
  });

  await prisma.caseRecord.create({
    data: {
      reportId: report3.id,
      studentName: 'Dimas Surya Pratama',
      studentClass: 'XI MIPA 2',
      diagnosis: 'Trauma Fisik Ringan & Stres Akut',
      physicalInjury: 'Memar kemerahan pada bahu kiri akibat benturan dinding koridor.',
      emotionalState: 'Takut melintas sendirian saat jam pulang sekolah.',
      counselorNotes: 'Koordinasi segera dengan tim keamanan gerbang sekolah dan koordinasi dengan orang tua murid.',
      actionTaken: 'Pemeriksaan luka oleh tim UKS, dokumentasi foto rekam medis bukti perundungan fisik.',
      followUpPlan: 'Mediasi tertutup bersama perwakilan orang tua terlapor dan satgas PPKSP.',
      counselorInCharge: counselor.name,
    },
  });

  // 5. Create Interactive Chat Messages (with photo attachments)
  await prisma.chatMessage.createMany({
    data: [
      {
        reportId: report1.id,
        sender: Role.student,
        senderName: 'Dimas Surya Pratama',
        content: 'Selamat siang Ibu Siti, ini saya lampirkan foto corat-coret di loker saya dan ancaman kertas kemarin.',
        photoUrl: '/images/sample-evidence-1.jpg',
        isRead: true,
        createdAt: new Date(Date.now() - 3600000 * 24),
      },
      {
        reportId: report1.id,
        sender: Role.counselor,
        senderName: counselor.name,
        content: 'Terima kasih atas laporannya Dimas. Bukti foto sudah kami amankan ke berkas kasus. Kamu berada di ruang yang aman bersama kami. Silakan datang ke ruang BK pukul 13.00 ya.',
        photoUrl: null,
        isRead: true,
        createdAt: new Date(Date.now() - 3600000 * 20),
      },
      {
        reportId: report1.id,
        sender: Role.student,
        senderName: 'Dimas Surya Pratama',
        content: 'Baik Bu Siti, saya akan datang tepat waktu. Terima kasih banyak atas perlindungannya.',
        photoUrl: null,
        isRead: true,
        createdAt: new Date(Date.now() - 3600000 * 18),
      },
      {
        reportId: report1.id,
        sender: Role.counselor,
        senderName: counselor.name,
        content: 'Ini denah jalur akses aman yang sudah diawasi guru piket selama kamu di sekolah.',
        photoUrl: '/images/sample-safe-route.jpg',
        isRead: false,
        createdAt: new Date(Date.now() - 3600000 * 2),
      },
      {
        reportId: report2.id,
        sender: Role.counselor,
        senderName: counselor.name,
        content: 'Laporan telah diterima oleh tim Satgas PPKSP. Privasimu sepenuhnya dienkripsi. Kamu bisa mengirimkan bukti screenshot di sini secara aman.',
        photoUrl: null,
        isRead: false,
        createdAt: new Date(Date.now() - 3600000 * 5),
      },
    ],
  });

  // 6. Create AI Triage Analysis (NVIDIA Llama 3.1)
  await prisma.triageAnalysis.create({
    data: {
      reportId: report1.id,
      riskLevel: 'HIGH_RISK_URGENT',
      confidenceScore: 0.94,
      keyFactors: [
        'Ancaman fisik berulang di luar gerbang sekolah',
        'Pelaku lebih dari satu orang dengan relasi kuasa senioritas (Kelas XII vs XI)',
        'Dampak psikologis ketakutan aktif dan penarikan diri sosial',
      ],
      recommendation: 'Aktivasi protokol darurat Permendikbud 46/2023: Berikan pengawalan safe-passage, pisahkan jadwal istirahat, dan lakukan konseling trauma psikologis.',
      modelUsed: 'nvidia/meta/llama-3.1-70b-instruct',
    },
  });

  // 7. Create Audit Logs
  await prisma.auditLog.createMany({
    data: [
      {
        actor: superAdmin.name,
        role: Role.super_admin,
        action: 'SYSTEM_INITIALIZATION',
        target: 'RELASI_PLATFORM',
        detail: 'Inisialisasi database PostgreSQL, migrasi skema tabel dan seeding akun uji coba bawaan.',
        userId: superAdmin.id,
      },
      {
        actor: counselor.name,
        role: Role.counselor,
        action: 'AI_TRIAGE_RUN',
        target: report1.id,
        detail: 'Menjalankan NVIDIA AI Triage analysis pada laporan RS-2026-0419: Tingkat risiko terdeteksi HIGH.',
        userId: counselor.id,
      },
      {
        actor: counselor.name,
        role: Role.counselor,
        action: 'RECORD_CASE_DIAGNOSIS',
        target: report1.id,
        detail: 'Menyimpan berkas rekam medis kasus konseling untuk Dimas Surya Pratama.',
        userId: counselor.id,
      },
    ],
  });

  console.log('✅ Database seeding finished successfully.');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
