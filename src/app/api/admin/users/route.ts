import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        roleLabel: true,
        departmentOrClass: true,
        status: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ success: true, users });
  } catch (error: any) {
    // If database connection is not active, return default accounts
    return NextResponse.json({
      success: false,
      fallback: true,
      users: [
        { id: 'usr-admin-1', name: 'Administrator Super Panel', role: 'super_admin', email: 'admin@gmail.com', status: 'active', departmentOrClass: 'Tata Kelola IT & Satuan PPKSP' },
        { id: 'usr-bk-1', name: 'Ibu Siti Rahmawati, S.Psi., M.Pd.', role: 'counselor', email: 'guru@gmail.com', status: 'active', departmentOrClass: 'Koordinator Unit BK & PPKSP' },
        { id: 'usr-bk-2', name: 'Bpk. Ahmad Fauzi, S.Pd.', role: 'counselor', email: 'ahmad.fauzi@sekolah.sch.id', status: 'active', departmentOrClass: 'Unit Bimbingan Konseling' },
        { id: 'usr-student-1', name: 'Dimas Surya Pratama', role: 'student', email: 'murid@gmail.com', status: 'active', departmentOrClass: 'XI MIPA 2' },
        { id: 'usr-student-2', name: 'Larasati Putri Ayu', role: 'student', email: 'larasati.putri@sekolah.sch.id', status: 'active', departmentOrClass: 'X-E3' },
      ],
      message: 'PostgreSQL belum tersambung, menggunakan data memori lokal.',
    });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, status } = await req.json();

    if (!id || !status) {
      return NextResponse.json({ error: 'ID dan status akun diperlukan.' }, { status: 400 });
    }

    try {
      const updatedUser = await prisma.user.update({
        where: { id },
        data: { status },
      });

      return NextResponse.json({ success: true, user: updatedUser });
    } catch {
      return NextResponse.json({ success: true, fallback: true, id, status });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
