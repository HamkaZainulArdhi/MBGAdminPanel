import { ClientSidebarLayout } from "@/components/client-sidebar-layout";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ClientSidebarLayout>{children}</ClientSidebarLayout>;
}
