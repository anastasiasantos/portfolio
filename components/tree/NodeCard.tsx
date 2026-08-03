"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { ACCENT } from "@/lib/accents";
import type { Accent, Node } from "@/lib/types";

/**
 * A single work node - the entry point to a case study. Collapsed it shows the
 * category dot, title, and summary; activating it opens the case study in a
 * dedicated full-page workspace (see CaseStudyWorkspace) rather than expanding
 * inline. `onOpen` receives the trigger element so the workspace can grow from
 * this card and restore focus here on exit.
 */
export function NodeCard({
  node,
  accent,
  onOpen,
  template = "experiment",
}: {
  node: Node;
  accent: Accent;
  onOpen: (trigger: HTMLElement) => void;
  template?: "experiment" | "product" | "ai";
}) {
  const label =
    template === "product"
      ? "Read case study"
      : template === "ai"
        ? "View build"
        : "View case study";
  return (
    <motion.article
      layout="position"
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="group rounded-card border border-line bg-surface shadow-card transition-[border-color,box-shadow] duration-300 ease-premium hover:border-line-strong hover:shadow-raised"
    >
      <button
        type="button"
        onClick={(e) => onOpen(e.currentTarget)}
        aria-haspopup="dialog"
        className="flex w-full items-start gap-4 rounded-card px-5 py-6 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-exp/40 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas sm:gap-5 sm:px-9 sm:py-7"
      >
        <div className="flex min-w-0 flex-1 gap-3">
          {/* Category indicator - a single colored square left of the title.
              Represents the portfolio category, never the outcome. */}
          <span
            className={cn(
              "mt-[7px] size-2.5 shrink-0 rounded-[3px]",
              ACCENT[accent].dot,
            )}
            aria-hidden
          />
          <div className="min-w-0">
            <h3 className="text-[20px] font-semibold leading-[1.3] tracking-[-0.02em] text-ink">
              {node.title}
            </h3>
            <p className="mt-2.5 text-[15px] leading-[1.6] text-ink-tertiary">
              {node.summary}
            </p>
            <span
              className={cn(
                "mt-5 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.08em]",
                ACCENT[accent].text,
              )}
            >
              {label}
            </span>
          </div>
        </div>
        {/* Enter affordance - signals navigation into a dedicated workspace */}
        <span
          className={cn(
            "mt-1 grid size-8 shrink-0 place-items-center rounded-full border border-line text-ink-tertiary transition-all duration-200 ease-premium group-hover:border-line-strong group-hover:text-ink",
          )}
          aria-hidden
        >
          <ArrowUpRight className="size-4 transition-transform duration-200 ease-premium group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </button>
    </motion.article>
  );
}
