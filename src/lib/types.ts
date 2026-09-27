export type ReporterRole = 'victim' | 'witness';
export type UrgencyLevel = 'normal' | 'urgent';
export type ReportCategory = 'fisik' | 'verbal' | 'relasional' | 'cyber' | 'pemalakan' | 'lainnya';

export type ReportStatus = 
  | 'submitted'       // Baru Masuk / Needs Review
  | 'reviewed'        // Telah Ditinjau Guru BK
  | 'investigating'   // Dalam Investigasi
  | 'followup'        // Tindak Lanjut / Mediasi
  | 'resolved'        // Kasus Selesai & Pemulihan
  | 'unsubstantiated';// Tidak Cukup Bukti / Gugur

export interface ReportMessage {
  id: string;
  sender: 'student' | 'counselor';
  senderName: string;
  content: string;
  photoUrl?: string;
  timestamp: string;
  isRead: boolean;
}

export interface Report {
  id: string;              // e.g. "RS-2026-0412"
  pin: string;             // 6-digit access code for anonymous tracking
  role: ReporterRole;      // korban / saksi
  isAnonymous: boolean;    // anonim vs berikan identitas ke BK
  reporterName?: string;
  reporterClass?: string;
  reporterContact?: string;
  incidentDate: string;    // YYYY-MM-DD
  incidentTime: string;    // Jam kejadian / istirahat
  location: string;        // Lokasi spesifik di sekolah
  partiesInvolved: string; // Pihak-pihak yang disebutkan
  description: string;     // Kronologi verbatim asli
  urgency: UrgencyLevel;   // normal vs urgent
  category: ReportCategory;
  status: ReportStatus;
  caseId?: string | null;  // Link ke Case Dossier jika dikelompokkan
  createdAt: string;
  updatedAt: string;
  messages: ReportMessage[];
}

export type CaseStatus = 
  | 'under_investigation'
  | 'follow_up_required'
  | 'resolved'
  | 'unsubstantiated';

export interface TimelineEvent {
  id: string;
  date: string;
  time: string;
  event: string;
  sourceReportId?: string;
}

export interface InvestigationNote {
  id: string;
  author: string;
  date: string;
  content: string;
  interviewee?: string;
  type: 'interview' | 'observation' | 'mediation' | 'counseling';
}

export interface ActionPlan {
  id: string;
  target: string;
  action: string;
  pic: string;
  deadline: string;
  status: 'pending' | 'in_progress' | 'completed';
}

export interface CaseDossier {
  id: string;              // e.g. "CASE-2026-001"
  title: string;
  summary: string;
  status: CaseStatus;
  reportIds: string[];     // Array of linked Report IDs
  location: string;
  partiesInvolved: string[];
  timeline: TimelineEvent[];
  investigationNotes: InvestigationNote[];
  actionPlans: ActionPlan[];
  createdAt: string;
  updatedAt: string;
  leadCounselor: string;
}

export interface RelationshipSignal {
  id: string;
  reportAId: string;
  reportBId: string;
  confidenceScore: number; // e.g. 92 (%)
  reasons: string[];       // e.g. ["Lokasi serupa: Belakang Kelas IX-B", "Pihak terduga sama", "Rentang waktu berdekatan"]
  status: 'suggested' | 'confirmed' | 'dismissed';
  detectedAt: string;
  reviewedBy?: string;
  reviewNotes?: string;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  actor: string;
  role: string;
  action: string;
  target: string;
  detail: string;
}
