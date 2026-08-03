"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Minus } from "lucide-react";

/**
 * A labeled show/hide toggle for optional case-study detail (Approach,
 * Supporting data). Renders a pill button plus a height/opacity reveal; the
 * revealed content is passed as children so every collapsible section behaves
 * and animates identically.
 */
export function Collapsible({
  label,
  showLabel,
  hideLabel,
  children,
}: {
  /** Lowercase noun used in the button, e.g. "approach" → "Show approach". */
  label?: string;
  /** Full button text when collapsed (overrides `Show {label}`). */
  showLabel?: string;
  /** Full button text when open (overrides `Hide {label}`). */
  hideLabel?: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const closed = showLabel ?? `Show ${label}`;
  const opened = hideLabel ?? `Hide ${label}`;

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="inline-flex items-center gap-2 rounded-full border border-line px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-secondary transition-colors duration-200 hover:border-line-strong hover:text-ink"
      >
        {open ? <Minus className="size-3.5" /> : <Plus className="size-3.5" />}
        {open ? opened : closed}
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
