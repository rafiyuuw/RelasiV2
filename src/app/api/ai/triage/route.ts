import { NextRequest, NextResponse } from 'next/server';

interface TriageRequestBody {
  reportId: string;
  description: string;
  category?: string;
  partiesInvolved?: string;
  urgency?: string;
  location?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: TriageRequestBody = await req.json();
    const { reportId, description, category = 'Umum', partiesInvolved = '-', urgency = 'medium', location = 'Sekolah' } = body;

    if (!description) {
      return NextResponse.json(
        { error: 'Deskripsi laporan diperlukan untuk analisis Triage AI.' },
        { status: 400 }
      );
    }

    const apiKey = process.env.NVIDIA_API_KEY;

    // Check if NVIDIA API Key is provided
    if (apiKey && apiKey.startsWith('nvapi-')) {
      try {
        const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: 'meta/llama-3.1-70b-instruct',
            messages: [
              {
                role: 'system',
                content: `Anda adalah AI Spesialis Triage Bimbingan Konseling & Satgas PPKSP (Permendikbudristek No. 46/2023).
Tugas Anda adalah menganalisis laporan insiden kekerasan/perundungan sekolah secara objektif, empatik, dan berorientasi pada perlindungan korban.
Keluarkan output HANYA dalam format JSON valid tanpa tanda markdown (tanpa \`\`\`json):
{
  "riskLevel": "HIGH" | "MEDIUM" | "LOW",
  "riskLabel": "Risiko Tinggi (Perlu Intervensi Segera)" | "Risiko Sedang" | "Risiko Rendah",
  "urgencyScore": 1-100,
  "confidenceScore": 0.0-1.0,
  "keyFactors": ["faktor risiko 1", "faktor risiko 2", "faktor risiko 3"],
  "psychologicalImpact": "deskripsi singkat dampak psikologis korban",
  "powerImbalance": "deskripsi relasi kuasa (senioritas, fisik, kelompok)",
  "recommendedAction": "langkah tindakan segera untuk Guru BK",
  "sopCategory": "Kategori Permendikbud PPKSP"
}`
              },
              {
                role: 'user',
                content: `Analisis laporan perundungan berikut:
- ID Kasus: ${reportId}
- Kategori Laporan: ${category}
- Lokasi: ${location}
- Pihak Terlibat: ${partiesInvolved}
- Indikasi Urgensi Siswa: ${urgency}
- Kronologi Kasus:
"${description}"`
              }
            ],
            temperature: 0.2,
            max_tokens: 600,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const rawContent = data.choices?.[0]?.message?.content || '{}';
          
          // Clean json output in case model wrapped it in markdown
          const cleanJson = rawContent.replace(/```json/g, '').replace(/```/g, '').trim();
          const parsed = JSON.parse(cleanJson);

          return NextResponse.json({
            success: true,
            provider: 'NVIDIA NIM (meta/llama-3.1-70b-instruct)',
            triage: parsed,
          });
        }
      } catch (nvidiaErr) {
        console.warn('NVIDIA API call encountered error, falling back to intelligent rule-based triage:', nvidiaErr);
      }
    }

    // Heuristic Rule-Based Fallback (Ensures 100% reliability offline or without key)
    const lower = description.toLowerCase();
    const isHigh = 
      urgency === 'urgent' || 
      lower.includes('ancam') || 
      lower.includes('pukul') || 
      lower.includes('hajar') || 
      lower.includes('bunuh') || 
      lower.includes('darah') || 
      lower.includes('takut') || 
      lower.includes('luka');

    const isMedium = 
      urgency === 'medium' || 
      lower.includes('ejek') || 
      lower.includes('kucil') || 
      lower.includes('hina') || 
      lower.includes('grup') || 
      lower.includes('uang');

    const triageFallback = {
      riskLevel: isHigh ? 'HIGH' : isMedium ? 'MEDIUM' : 'LOW',
      riskLabel: isHigh 
        ? 'Risiko Tinggi (Perlu Intervensi Segera)' 
        : isMedium 
        ? 'Risiko Sedang (Pantau & Jadwalkan Konseling)' 
        : 'Risiko Rendah (Edukasi Preventif)',
      urgencyScore: isHigh ? 92 : isMedium ? 68 : 35,
      confidenceScore: 0.88,
      keyFactors: [
        isHigh ? 'Indikasi ancaman/tekanan fisik atau intimidasi berulang' : 'Konflik relasional antar-teman sebaya',
        partiesInvolved !== '-' ? `Keterlibatan pihak teridentifikasi: ${partiesInvolved}` : 'Pihak terlapor memerlukan klarifikasi lanjut',
        `Lokasi insiden pada area rawan pantauan: ${location}`,
      ],
      psychologicalImpact: isHigh 
        ? 'Tanda stres akut, kecemasan sosial, dan perasaan terisolasi.' 
        : 'Penurunan kenyamanan belajar dan rasa percaya diri.',
      powerImbalance: 'Relasi kelompok/senioritas berpotensi membatasi kemampuan korban membela diri.',
      recommendedAction: isHigh
        ? 'Aktivasi segera protokol pendampingan siswa, isolasi risiko di lingkungan sekolah, dan agendakan mediasi tertutup bersama wali kelas.'
        : 'Lakukan pemanggilan konseling individual untuk mendalami kronologi dan validasi perasaan pelapor.',
      sopCategory: category,
    };

    return NextResponse.json({
      success: true,
      provider: 'RELASI Heuristic Triage Engine (Fallback Mode)',
      triage: triageFallback,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Gagal menjalankan analisis Triage AI: ' + error.message },
      { status: 500 }
    );
  }
}
