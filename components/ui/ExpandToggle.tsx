"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

/**
 * The circular +/− affordance on branch and node cards.
 * Purely presentational - the parent card owns the click target and state.
 */
export function ExpandToggle({
  open,
  className,
}: {
  open: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "relative grid size-8 shrink-0 place-items-center rounded-full border border-line bg-surface text-ink-tertiary transition-colors duration-200 group-hover:border-line-strong group-hover:text-ink-secondary",
        className,
      )}
      aria-hidden
    >
      {/* horizontal bar (always present) */}
      <span className="absolute h-px w-3.5 rounded-full bg-current" />
      {/* vertical bar collapses to form a minus when open */}
      <motion.span
        className="absolute h-3.5 w-px rounded-full bg-current"
        initial={false}
        animate={{ scaleY: open ? 0 : 1, opacity: open ? 0 : 1 }}
        transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
      />
    </span>
  );
}
