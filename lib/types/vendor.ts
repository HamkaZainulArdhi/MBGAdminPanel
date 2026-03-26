/* ============================================================================
   VENDOR TYPES — TypeScript interfaces for Vendor SPPG
   ============================================================================ */

export interface Vendor {
  id?: string;
  vendorId: string;
  name: string;
  ownerName: string;
  email: string;
  location: string;
  address?: string;
  npwp?: string;
  nib: string;
  employeeCount: number;

  // Status & Validasi
  isApproved: boolean;
  aiVerified: boolean;
  safetyVerified: boolean;
  safetyConfirmed: boolean;
  safetyTemp: number;
  complianceScore: number;
  currentStep: number;
  statusProduksi: string;
  averageRating: number;

  // Produksi
  targetPorsi: number;
  cookedCount: number;
  rawMaterialWeight: number;
  cookingStartTime: string;
  cookingEndTime: string;
  chillerTemp: number;

  // Finansial
  totalCapital: number;

  // Lokasi
  latitude: number;
  longitude: number;

  // Legal & Persetujuan
  hasHalal: boolean;
  setujuSLA: boolean;
  setujuLaporan: boolean;
  setujuGizi: boolean;
  operatingHours: string;

  // Foto (Base64)
  menuPhotoBase64?: string;
  photoHygiene?: string;
  photoIzinOps?: string;
  photoHalal?: string;
  photoPIRT?: string;
  photoDapur?: string;
  samplePhotoUrl?: string;

  // Meta
  createdAt: string;
  lastUpdate?: string;
  rejectReason?: string | null;
}

export interface VendorRating {
  id: string;
  fromSchool: string;
  targetId: string;
  review: string;
  historyId?: string;
  rating: number;
  timestamp: string;
}
