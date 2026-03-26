import { LayoutDashboard, Users, Settings, LucideIcon, School, Files, FolderOpenDot, FileCheck } from "lucide-react";

export interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
  description?: string;
}

export interface NavConfig {
  title: string;
  logo: string;
  mainNav: NavItem[];
  settingsNav?: NavItem[];
}

export const navConfig: NavConfig = {
  title: "Admin Dashboard",
  logo: "Acme Inc",
  mainNav: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
      description: "Main dashboard view",
    },
    {
      title: "Pendaftaran",
      url: "/pendaftaran",
      icon: Users,
      description: "Manage users",
    },
    {
      title: "Sekolah",
      url: "/sekolah",
      icon: School,
      description: "App settings",
    },
    {
      title: "Daftar Laporan",
      url: "/laporan",
      icon: Files,
      description: "Pusat laporan anomali dan resolusi",
    },
    {
      title: "Vendor SPPG",
      url: "/vendor-sppg",
      icon: FolderOpenDot,
      description: "App settings",
    },
    {
      title: "Audit Vendor",
      url: "/audit",
      icon: FileCheck,
      description: "Monitoring performa dan insight harian",
    },
  ],
};
