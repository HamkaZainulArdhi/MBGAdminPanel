/* ============================================================================
   REGISTRATION TYPES — TypeScript interfaces aligned with Firebase schema.json
   Collections: schools, vendors, drivers
   ============================================================================ */

// ---------------------------------------------------------------------------
// School — Firebase collection: "schools"
// NOTE: Firebase stores the school name in the "name" field.
//       We normalise it to "name" here to stay consistent with the schema.
// ---------------------------------------------------------------------------
export interface School {
  id?: string;
  // Firebase field is "name" for schools (also has "schoolName" as alias)
  name: string;
  schoolName?: string; // kept for backwards-compat, prefer "name"
  npsn: string;
  address: string;
  latitude?: number;
  longitude?: number;
  porsi?: number | { smp_sma?: number; sd_4_6?: number; sd_1_3?: number;[key: string]: any };
  p13?: number;
  p46?: number;
  pSMP?: number;
  porsiSD13?: number;
  porsiSD46?: number;
  porsiSMP_SMA?: number;
  level?: string;
  email: string;
  phone?: string;
  pic?: string | { nama?: string; jabatan?: string; hp?: string;[key: string]: any };
  picName?: string;
  picPosition?: string;
  picPhone?: string;
  nip?: string;
  isApproved: boolean;
  rejectReason?: string | null;
  createdAt: string;
  lastUpdate?: string;
  assignedVendorEmail?: string;
  assignedDriverId?: string;
  status?: string;
  validasi_institusi?: string | Record<string, any>;
  operasional?: string | Record<string, any>;
  activeDays?: string[];
  schoolStart?: string;
  breakTime?: string;
  dropOffPoint?: string;
  location?: string;
  count_grade_1_3?: number;
  count_grade_4_6?: number;
  lastStudentCount?: number;
  schoolId?: string;
  // Documents (Stored as Base64 strings)
  photoSK?: string;
  photoSuratAktif?: string;
  photoStempel?: string;
  photoFotoSekolah?: string;
}

// ---------------------------------------------------------------------------
// Vendor — Firebase collection: "vendors"
// ---------------------------------------------------------------------------
export interface Vendor {
  id?: string;
  vendorId?: string;
  name: string;
  ownerName?: string;
  nib: string;
  npwp?: string;
  email: string;
  address: string;
  latitude?: number;
  longitude?: number;
  location?: string;
  targetPorsi: number;
  employeeCount?: number;
  isApproved: boolean;
  rejectReason?: string | null;
  createdAt: string;
  lastUpdate?: string;
  // Compliance
  hasHalal?: boolean;
  setujuSLA?: boolean;
  setujuLaporan?: boolean;
  setujuGizi?: boolean;
  complianceScore?: number;
  averageRating?: number;
  // Production
  menuTypes?: string[];
  cookingStartTime?: string;
  cookingEndTime?: string;
  cookedCount?: number;
  rawMaterialWeight?: number;
  totalCapital?: number;
  statusProduksi?: string;
  currentStep?: number;
  operatingHours?: string;
  // Safety
  safetyVerified?: boolean;
  safetyTemp?: number;
  chillerTemp?: number;
  safetyConfirmed?: boolean;
  safetyVerifiedAt?: string;
  aiVerified?: boolean;
  isManualSubmit?: boolean;
  // Documents (Stored as Base64 strings)
  photoDapur?: string;
  photoIzinOps?: string;
  photoHalal?: string;
  photoPIRT?: string;
  photoHygiene?: string;
  samplePhotoUrl?: string; // Kept as URL or Base64 based on usage
  menuPhotoBase64?: string;
}

// ---------------------------------------------------------------------------
// Driver — Firebase collection: "drivers"
// ---------------------------------------------------------------------------
export interface Driver {
  id?: string;
  driverId?: string;
  name: string;
  nik: string;
  email: string;
  phone: string;
  address?: string;
  vehicleType: string;
  vehiclePlate: string;
  carryingCapacity: number;
  coverageArea?: string;
  isApproved: boolean;
  rejectReason?: string | null;
  createdAt: string;
  lastUpdate?: string;
  assignedVendorEmail?: string;
  currentNavigatingSchool?: string;
  // Status
  statusShift?: string;
  statusDelivery?: string;
  statusHandover?: string;
  vendorActionStatus?: string;
  isGpsConsent?: boolean;
  // Ratings
  rating?: number;
  averageRating?: number;
  slaScore?: number;
  // Location
  currentLat?: number;
  currentLng?: number;
  // Work
  workingHours?: string;
  // Issue
  currentIssueType?: string;
  currentIssueMsg?: string;
  currentIssuePhoto?: string;
  // Documents (Stored as Base64 strings)
  profilephoto?: string;
  photoSIM?: string;
  photoSTNK?: string;
  photoSKCK?: string;
  photoVehicle?: string;
}

// ---------------------------------------------------------------------------
// Union & helpers
// ---------------------------------------------------------------------------
export type RegistrationType = "school" | "vendor" | "driver";
export type RegistrationData = School | Vendor | Driver;

export interface RegistrationStats {
  total: number;
  approved: number;
  pending: number;
  rejected: number;
}

/**
 * Type guard for School.
 * Schools uniquely have the "npsn" field.
 */
export const isSchool = (data: RegistrationData): data is School =>
  "npsn" in data;

/**
 * Type guard for Vendor.
 * Vendors uniquely have "nib" AND "targetPorsi" fields but no "npsn" or "nik".
 */
export const isVendor = (data: RegistrationData): data is Vendor =>
  "nib" in data && "targetPorsi" in data && !("npsn" in data) && !("nik" in data);

/**
 * Type guard for Driver.
 * Drivers uniquely have "nik" AND "vehiclePlate" fields.
 */
export const isDriver = (data: RegistrationData): data is Driver =>
  "nik" in data && "vehiclePlate" in data;

/**
 * Returns the display name for any registration entity.
 * Schools: name (or schoolName fallback)
 * Vendors: name
 * Drivers: name
 */
export function getRegistrationName(data: RegistrationData): string {
  if (isSchool(data)) {
    return data.name || data.schoolName || "—";
  }
  if (isVendor(data) || isDriver(data)) {
    return data.name || "—";
  }
  return "—";
}

/**
 * Returns approval status label in Indonesian.
 */
export function getStatusLabel(data: RegistrationData): "Disetujui" | "Ditolak" | "Tertunda" {
  if (data.isApproved) return "Disetujui";
  if (data.rejectReason) return "Ditolak";
  return "Tertunda";
}
