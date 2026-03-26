/* ============================================================================
   VENDOR AUDIT TYPES — Advanced interfaces for Vendor Performance Audit
   ============================================================================ */

export type AuditStatus = "success" | "warning" | "destructive";

export interface CategoryPerformance {
  name: string;
  porsi: number;
  modal: number;
  pendapatan: number;
  margin: number;
  status: string;
  harga: number;
}

export interface MenuConfigItem {
  menuName: string;
  totalBudget: number;
  totalPorsi: number;
  unitPrice: number;
}

export interface VendorAuditReport {
  id: string; // tanggal (dd-MM-yyyy)
  vendorEmail: string;
  nama_menu: string;
  waktu_submit: string; // ISO or human readable
  suhu_chiller: number;
  statusLaporan: string;
  
  // Metrics
  total_porsi: number;
  porsi_realisasi: number;
  porsi_target: number;
  total_modal: number;
  total_pendapatan: number;
  wastageCount: number;
  wastageReason: string;
  
  // AI Insights
  hasil_ai: string;
  alasan_utama: string;
  
  // Nested Data
  categories: CategoryPerformance[];
  menuConfig: Record<string, MenuConfigItem>;
  
  // Images
  foto_bahan?: string;
  foto_sanitasi?: string;
  foto_menu?: string;
  foto_nota?: string;
  foto_ai?: string;
  foto_ai_2?: string;
  foto_safety?: string;
}

export interface AuditSummaryStats {
  totalTarget: number;
  totalRealisasi: number;
  totalModal: number;
  totalPendapatan: number;
  totalWastage: number;
  efficiency: number;
}
