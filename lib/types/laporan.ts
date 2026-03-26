/* ============================================================================
   LAPORAN TYPES — TypeScript interfaces for anomaly reports
   ============================================================================ */

export type AnomalyReportStatus =
  | "PENDING_INVESTIGATION"
  | "ON_PROGRESS"
  | "RESOLVED"
  | "REJECTED";

export interface AnomalyReport {
  id: string;
  reporterEmail: string; // email sekolah pelapor
  category: string; // e.g., "Indikasi Basi", "Benda Asing"
  notes: string; // deskripsi laporan
  photoBase64: string; // bukti foto dalam base64
  status: AnomalyReportStatus; // format: PENDING_INVESTIGATION, ON_PROGRESS, RESOLVED, REJECTED
  timestamp: string; // ISO datetime string (server time)
  date: string; // format: dd-MM-yyyy
}

/**
 * Extended report dengan informasi relasi yang sudah di-populate
 * Digunakan untuk display di UI
 */
export interface AnomalyReportWithRelation extends AnomalyReport {
  schoolName?: string; // nama sekolah dari relasi
  vendorName?: string; // nama vendor dari relasi
  vendorOwnerName?: string; // nama pemilik vendor
  vendorEmail?: string;
  vendorLocation?: string;
}

/**
 * Summary untuk dashboard mini
 */
export interface AnomalyReportSummary {
  total: number;
  pending: number;
  onProgress: number;
  resolved: number;
  rejected: number;
}
