import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { School } from "@/lib/types/registration";
import { Row, DocCard, Section } from "@/components/part-dialog";
import { MapPin, MapPinOff } from "lucide-react";
import { Card } from "@/components/ui/card";

// ── helpers ──
function fmt(iso?: string): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  }).format(d);
}

function safeString(val: unknown): string {
  if (val === null || val === undefined) return "—";
  if (typeof val === "string") return val || "—";
  if (typeof val === "number") return String(val);
  if (typeof val === "boolean") return val ? "Ya" : "Tidak";
  if (Array.isArray(val)) return val.join(", ") || "—";
  if (typeof val === "object") {
    return Object.entries(val)
      .map(([k, v]) => `${k.replace(/_/g, " ")}: ${v}`)
      .join(", ") || "—";
  }
  return String(val);
}

function safePorsi(porsi: School["porsi"]): number {
  if (typeof porsi === "object" && porsi !== null)
    return Object.values(porsi).reduce((s, v) => s + (Number(v) || 0), 0);
  return Number(porsi) || 0;
}

// ── component ──
interface Props {
  school: School | null;
  isOpen: boolean;
  driverNames: Record<string, string>;
  vendorNames: Record<string, string>;
  onClose: () => void;
}

export function SchoolDetailDialog({ school, isOpen, driverNames, vendorNames, onClose }: Props) {
  if (!school) return null;

  const s = school;
  const ready = s.assignedVendorEmail && s.assignedDriverId;

  // PIC safe extraction
  const picName = s.picName || (typeof s.pic === "object" ? s.pic?.nama : s.pic) || "—";
  const picPos = s.picPosition || (typeof s.pic === "object" ? s.pic?.jabatan : undefined) || "—";
  const picPhone = s.picPhone || (typeof s.pic === "object" ? s.pic?.hp : s.phone) || "—";

  // Operasional safe extraction
  const op = typeof s.operasional === "object" && s.operasional !== null ? s.operasional : null;
  const jamMasuk = s.schoolStart || (op as any)?.jamMasuk || "—";
  const breakTime = s.breakTime || (op as any)?.jamMakan || "—";
  const dropOff = s.dropOffPoint || (op as any)?.dropOff || "—";
  const hariAktif = Array.isArray(s.activeDays)
    ? s.activeDays.join(", ")
    : (s.activeDays || (Array.isArray((op as any)?.hariAktif)
      ? (op as any).hariAktif.join(", ")
      : (op as any)?.hariAktif) || "—");

  const validasiUrl = typeof s.validasi_institusi === "string" ? s.validasi_institusi : undefined;
  const hasDocs = s.photoSK || s.photoSuratAktif || s.photoStempel || s.photoFotoSekolah || validasiUrl;

  return (
    <Dialog open={isOpen} onOpenChange={onClose} >
      <DialogContent className="min-w-5xl max-h-[90vh] p-0 flex flex-col gap-0  overflow-hidden">
        {/* ── header ── */}
        <DialogHeader className="p-6 border-b border-border bg-card">
          <div className="flex-1 min-w-0 space-y-2">
            <DialogTitle className="text-xl font-bold break-words leading-tight">
              {s.name || s.schoolName || "—"}
            </DialogTitle>
            <div className=" flex flex-wrap items-center gap-x-3 text-muted-foreground">
              <span>NPSN: {s.npsn || "—"}</span>
              <span>·</span>
              <span>ID: {s.id || s.schoolId || "—"}</span>
            </div>
            <Badge variant={ready ? "success" : "warning"} className="shrink-0">
              {ready ? "Siap Distribusi" : "Belum Siap"}
            </Badge>
          </div>
        </DialogHeader>

        {/* ── body — scrollable ── */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="grid grid-cols-2 gap-x-8 gap-y-8">
            {/* ════ LEFT COLUMN ════ */}
            <div className="space-y-8">
              {/* 1. Informasi Utama */}
              <Section title="Informasi Utama">
                <Card className="grid grid-cols-2 p-5">
                  <Row label="Nama Sekolah" value={s.name || s.schoolName} fullWidth />
                  <Row label="NPSN" value={s.npsn} mono />
                  <Row label="NIP" value={s.nip} mono />
                  <Row label="Jenjang" value={s.level} />
                  <Row label="Email" value={s.email} mono />
                  <Row label="Telepon" value={s.phone} />
                  <Row label="Status" value={s.status} />
                  <Row label="Status Persetujuan" value={s.isApproved ? "Ya" : "Tidak"} />
                  <Row label="ID Sekolah" value={s.id || s.schoolId} mono />
                </Card>
              </Section>

              {/* 2. PIC Sekolah */}
              <Section title="Kontak PIC">
                <Card className="grid grid-cols-2 p-5">
                  <Row label="Nama PIC" value={s.picName} fullWidth />
                  <Row label="Jabatan" value={s.picPosition} />
                  <Row label="HP / Telepon" value={s.picPhone} />
                  <Row label="PIC (Field)" value={picName} />
                  <Row label="Jabatan (Field)" value={picPos} />
                  <Row label="HP (Field)" value={picPhone} />
                </Card>
              </Section>

              {/* 3. Lokasi & Alamat */}
              <Section title="Lokasi & Alamat">
                <Card className="grid grid-cols-2 p-5">
                  <Row label="Alamat" value={s.address} fullWidth />
                  <div className="flex items-center gap-2 text-xs bg-muted/40 p-3 rounded-lg border border-border/40">
                    {s.latitude && s.longitude ? (
                      <>
                        <MapPin className="h-4 w-4 text-primary shrink-0" />
                        <span className="font-mono text-muted-foreground">{s.latitude}, {s.longitude}</span>
                      </>
                    ) : (
                      <>
                        <MapPinOff className="h-4 w-4 text-muted-foreground/40 shrink-0" />
                        <span className="text-muted-foreground/50">GPS tidak tersedia</span>
                      </>
                    )}
                  </div>
                </Card>
              </Section>

              <Section title="Informasi Tambahan">
                <Card className="grid grid-cols-2 p-5">
                  <div className="rounded-lg bg-muted/30 px-4 py-3 border border-border/20 text-center">
                    <dt className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">Terdaftar</dt>
                    <dd className="text-xs font-mono">{fmt(s.createdAt)}</dd>
                  </div>
                  <div className="rounded-lg bg-muted/30 px-4 py-3 border border-border/20 text-center">
                    <dt className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">Update Terakhir</dt>
                    <dd className="text-xs font-mono">{s.lastUpdate ? fmt(s.lastUpdate) : "—"}</dd>
                  </div>
                </Card>
              </Section>
            </div>

            {/* ════ RIGHT COLUMN ════ */}
            <div className="space-y-8">
              {/* 4. Dokumen */}
              <Section title="Dokumen">
                {hasDocs ? (
                  <Card className="grid grid-cols-2 p-5">
                    <DocCard url={s.photoSK} label="SK (photoSK)" />
                    <DocCard url={s.photoSuratAktif} label="Surat Aktif" />
                    <DocCard url={s.photoStempel} label="Stempel" />
                    <DocCard url={s.photoFotoSekolah} label="Foto Sekolah" />
                    <DocCard url={validasiUrl} label="Validasi Institusi" />
                  </Card>
                ) : (
                  <p className="text-sm text-muted-foreground/60 italic">Tidak ada dokumen.</p>
                )}
              </Section>

              {/* 5. Operasional */}
              <Section title="Operasional">
                <Card className="grid grid-cols-2 p-5">
                  <Row label="Hari Aktif" value={hariAktif} fullWidth />
                  <Row label="Jam Masuk" value={jamMasuk} />
                  <Row label="Istirahat / Makan" value={breakTime} />
                  <Row label="Drop Off Point" value={dropOff} />
                </Card>
              </Section>

              {/* 6. Kapasitas & Porsi */}
              <Section title="Kapasitas & Porsi">
                <Card className="grid grid-cols-2 p-5">
                  <Row label="Total Siswa" value={s.lastStudentCount} mono />
                  <Row label="Porsi Total (calculated)" value={safePorsi(s.porsi)} mono />
                  <Row label="Porsi (Raw/String)" value={safeString(s.porsi)} fullWidth />
                  <Row label="Siswa Kelas 1-3" value={s.count_grade_1_3} mono />
                  <Row label="Siswa Kelas 4-6" value={s.count_grade_4_6} mono />
                  <Row label="porsi SD 1-3" value={s.porsiSD13} mono />
                  <Row label="porsi SD 4-6" value={s.porsiSD46} mono />
                  <Row label="porsi SMP SMA" value={s.porsiSMP_SMA} mono />
                </Card>
              </Section>

              {/* 7. Distribusi */}
              <Section title="Distribusi / Assignment">
                <Card className="grid grid-cols-1 p-5">
                  <Row
                    label="Vendor"
                    value={s.assignedVendorEmail ? (vendorNames[s.assignedVendorEmail] || s.assignedVendorEmail) : "—"}
                    mono={!s.assignedVendorEmail || !vendorNames[s.assignedVendorEmail]}
                  />
                  <Row
                    label="Driver"
                    value={s.assignedDriverId ? (driverNames[s.assignedDriverId] || s.assignedDriverId) : "—"}
                    mono={!s.assignedDriverId || !driverNames[s.assignedDriverId]}
                  />
                </Card>
              </Section>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
