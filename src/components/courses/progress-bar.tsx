import { cn } from "@/lib/utils";

/** Kurs progressi uchun yupqa progress bar (foiz bilan) */
export function ProgressBar({
  percent,
  className,
  showLabel = false,
}: {
  percent: number;
  className?: string;
  showLabel?: boolean;
}) {
  const safe = Math.max(0, Math.min(100, percent));
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-2">
        <div
          className="h-full rounded-full bg-accent transition-all duration-500"
          style={{ width: `${safe}%` }}
        />
      </div>
      {showLabel && (
        <span className="shrink-0 text-xs font-semibold text-muted">{safe}%</span>
      )}
    </div>
  );
}
