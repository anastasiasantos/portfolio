import { cn } from "@/lib/cn";
import type { StatusTone } from "@/lib/types";

/**
 * Outcome indicator for a work node. A small square swatch + uppercase label,
 * colored by semantic tone rather than by category.
 */
const TONE: Record<StatusTone, { dot: string; text: string }> = {
  win: { dot: "bg-status-win", text: "text-status-win" },
  near: { dot: "bg-status-near", text: "text-status-near" },
  flat: { dot: "bg-ink-tertiary", text: "text-ink-tertiary" },
  shipped: { dot: "bg-accent-ai", text: "text-ink-secondary" },
  live: { dot: "bg-accent-exp", text: "text-ink-secondary" },
};

export function StatusPill({
  label,
  tone,
  className,
}: {
  label: string;
  tone: StatusTone;
  className?: string;
}) {
  const c = TONE[tone];
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span className={cn("size-[7px] rounded-[2px]", c.dot)} aria-hidden />
      <span className={cn("label-eyebrow", c.text)}>{label}</span>
    </span>
  );
}
