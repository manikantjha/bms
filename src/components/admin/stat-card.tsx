import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  color?: string;
}

export default function StatCard({
  label,
  value,
  icon: Icon,
  color = "text-primary",
}: StatCardProps) {
  return (
    <div className="bg-surface rounded-2xl border border-border p-6 flex items-start gap-4">
      <div
        className={`w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0`}
      >
        <Icon size={22} className={color} />
      </div>
      <div>
        <p className="text-2xl font-bold text-text">{value}</p>
        <p className="text-sm text-text-muted">{label}</p>
      </div>
    </div>
  );
}
