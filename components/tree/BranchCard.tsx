"use client";

import { cn } from "@/lib/cn";
import { ACCENT } from "@/lib/accents";
import type { Branch } from "@/lib/types";
import { ExpandToggle } from "../ui/ExpandToggle";

/** The category header card (Experimentation, AI Builds, Products). */
export function BranchCard({
  branch,
  open,
  onToggle,
}: {
  branch: Branch;
  open: boolean;
  onToggle: () => void;
}) {
  const count = branch.nodes.length;
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      className={cn(
        "group flex w-full items-center gap-4 rounded-card border bg-surface px-7 py-6 text-left shadow-card transition-[border-color,box-shadow] duration-300 ease-premium focus-visible:outline-none focus-visible:ring-2 sm:px-9 sm:py-7",
        ACCENT[branch.accent].focus,
        open
          ? ACCENT[branch.accent].softBorder
          : cn(
              "border-line hover:shadow-raised",
              ACCENT[branch.accent].ring,
            ),
      )}
    >
      <span
        className={cn(
          "mt-[5px] size-2.5 shrink-0 self-start rounded-[3px]",
          ACCENT[branch.accent].dot,
        )}
        aria-hidden
      />
      <div className="min-w-0 flex-1">
        <h2 className="text-[18px] font-semibold leading-tight tracking-[-0.015em] text-ink">
          {branch.label}
        </h2>
        <p className="mt-1.5 text-[14px] leading-snug text-ink-tertiary">
          {branch.blurb}
        </p>
      </div>
      <span className="shrink-0 font-mono text-[11.5px] tabular-nums text-ink-faint">
        {count} {count === 1 ? "item" : "items"}
      </span>
      <ExpandToggle open={open} />
    </button>
  );
}
