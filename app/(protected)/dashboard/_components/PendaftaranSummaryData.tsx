import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Clock } from "lucide-react";

export function RegStatCard({
  label,
  icon: Icon,
  total,
  pending,
  approved,
}: {
  label: string;
  icon: React.ElementType;
  total: number;
  pending: number;
  approved: number;
}) {
  const pct = total > 0 ? Math.round((approved / total) * 100) : 0;

  return (
    <Card className="border-0 shadow-sm overflow-hidden bg-primary text-primary-foreground">
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider opacity-80">
              {label}
            </p>
            <p className="text-4xl font-extrabold tracking-tight mt-1">
              {total}
            </p>
          </div>
          <div className="rounded-xl p-2.5 bg-background/20">
            <Icon className="h-5 w-5 opacity-80" />
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 rounded-full bg-current/10 overflow-hidden mb-2">
          <div
            className="h-full rounded-full bg-current opacity-50 transition-all duration-700"
            style={{ width: `${pct}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px]">
          <span className="flex items-center gap-1 ">
            <CheckCircle2 className="h-3 w-3" /> {approved} disetujui
          </span>
          {pending > 0 && (
            <span className="flex items-center gap-1 font-semibold">
              <Clock className="h-3 w-3" /> {pending} tertunda
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
