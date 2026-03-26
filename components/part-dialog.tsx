import Image from "next/image";
import { Badge } from "./ui/badge";
import { CheckCircle2, XCircle } from "lucide-react";

interface DocCardProps {
  url?: string;
  label: string;
}

export function DocCard({ url, label }: DocCardProps) {
  if (!url) return null;

  const cleanUrl = url.trim();
  const imageSrc = cleanUrl.startsWith("data:") ? cleanUrl : `data:image/jpeg;base64,${cleanUrl}`;

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <Image
        src={imageSrc}
        alt={label}
        width={400}
        height={300}
        className="w-full aspect-video object-cover rounded-lg border border-border/40 bg-muted/20"
      />
    </div>
  );
}



export function Row({
  label,
  value,
  mono = false,
  fullWidth = false,
}: {
  label: string;
  value?: string | number | null;
  mono?: boolean;
  fullWidth?: boolean;
}) {
  return (
    <div className={`flex flex-col gap-0.5 ${fullWidth ? "col-span-2" : ""}`}>
      <dt className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
        {label}
      </dt>
      <dd className={`text-sm font-medium break-words ${mono ? "font-mono" : ""}`}>
        {value ?? <span className="text-muted-foreground/50">—</span>}
      </dd>
    </div>
  );
}

export function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground border-b border-border/30 pb-1.5">
        {title}
      </h4>
      {children}
    </div>
  );
}


export function BoolChip({ value, yes = "Ya", no = "Tidak" }: { value?: boolean; yes?: string; no?: string }) {
  if (value === undefined || value === null) return <span className="text-sm text-muted-foreground">—</span>;
  return value ? (
    <Badge variant="success">
      <CheckCircle2 className="h-3 w-3" />{yes}
    </Badge>
  ) : (
    <Badge variant="destructive">
      <XCircle className="h-3 w-3" />{no}
    </Badge>
  );
}