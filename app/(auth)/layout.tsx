export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex bg-muted/20 min-h-screen items-center justify-center p-4">
      {children}
    </div>
  );
}
