"use client";

import { Fragment } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/cn";
import { ACCENT } from "@/lib/accents";
import type { Accent, WorkflowStage, WorkflowStageKind } from "@/lib/types";

/**
 * Signature AI-workflow visual - a pipeline that shows how a build turns an
 * input into a shipped output, and *where AI adds value* (accented stages),
 * *where a human decides* (human / decision stages), and how the stages are
 * orchestrated. Reuses the portfolio's existing vocabulary: the card + tooltip
 * styling, the connector-pulse motion from the Lifecycle spine, and the
 * category accent - no new design language.
 *
 * LAYOUT - the whole pipeline is visible at once, never horizontally scrolled:
 *  • Mobile: a single vertical column, stage → stage, top to bottom.
 *  • Desktop (sm+): rows of four. Eight stages read as 4 + 4; a wrap connector
 *    carries the flow from the end of one row down and back to the start of the
 *    next, so the full left→right sequence stays legible as one workflow.
 * The two layouts are the same stages rendered twice; only one is ever visible
 * (the other is `display:none`, so it is neither focusable nor read by AT).
 *
 * Data-driven and content-safe: it renders only the `stages` a build supplies.
 * A build with no stages shows a "[TODO]" placeholder (handled by the parent).
 *
 * Reduced motion: reveals resolve instantly and the flow pulse is dropped; the
 * pipeline stays fully readable and interactive.
 */

const EASE = [0.22, 1, 0.36, 1] as const;

/** Stages per row on desktop. Eight stages → 4 + 4. */
const PER_ROW = 4;

const reveal = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.28, ease: EASE } },
};
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

/** Micro-eyebrow label per stage kind. "ai" is the only accented kind. */
const KIND_TAG: Record<WorkflowStageKind, string> = {
  input: "Input",
  ai: "AI",
  tool: "Tool",
  decision: "Decision",
  human: "Human",
  output: "Output",
};

/** A single stage node - the card is identical across both layouts. Fills its
 *  container (width + height) so grid columns/rows stay even. */
function StageCard({
  stage,
  accent,
}: {
  stage: WorkflowStage;
  accent: Accent;
}) {
  const kind = stage.kind ?? "tool";
  const isAI = kind === "ai";
  const tag = KIND_TAG[kind];
  const a = ACCENT[accent];
  return (
    <motion.div
      variants={reveal}
      tabIndex={0}
      aria-label={`${tag}: ${stage.label}.${stage.detail ? ` ${stage.detail}` : ""}`}
      className={cn(
        "group relative flex h-full w-full cursor-default flex-col justify-center rounded-node border px-4 py-3.5 text-center outline-none transition-[border-color,box-shadow,transform] duration-200 ease-premium",
        "hover:-translate-y-px hover:shadow-raised focus-visible:-translate-y-px focus-visible:shadow-raised",
        a.focus,
        isAI
          ? cn("shadow-card", a.softBorder, a.softBg)
          : "border-line bg-surface shadow-card hover:border-line-strong focus-visible:border-line-strong",
      )}
    >
      <p
        className={cn(
          "flex items-center justify-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.1em]",
          isAI ? a.text : "text-ink-faint",
        )}
      >
        {isAI && (
          <span aria-hidden className={cn("size-1.5 rounded-full", a.dot)} />
        )}
        {kind === "decision" && (
          <span
            aria-hidden
            className="size-1.5 rotate-45 border border-current"
          />
        )}
        {kind === "human" && (
          <span
            aria-hidden
            className="size-1.5 rounded-full border border-current"
          />
        )}
        {tag}
      </p>
      <p className="mt-1 text-[13.5px] font-semibold leading-tight text-ink">
        {stage.label}
      </p>

      {/* Detail - an existing-pattern tooltip, on hover / focus */}
      {stage.detail && (
        <span
          role="tooltip"
          className="pointer-events-none absolute left-1/2 top-full z-20 mt-2 w-[210px] -translate-x-1/2 rounded-node border border-line bg-surface-raised px-3.5 py-2.5 text-left text-[12px] leading-[1.5] text-ink-secondary opacity-0 shadow-raised transition-opacity duration-200 ease-premium group-hover:opacity-100 group-focus-visible:opacity-100"
        >
          {stage.detail}
        </span>
      )}
    </motion.div>
  );
}

/** Horizontal in-row connector between two cards, with the one-shot flow pulse
 *  (dropped under reduced motion). `order` staggers the pulse along the flow. */
function HConnector({
  accent,
  order,
  reduce,
}: {
  accent: Accent;
  order: number;
  reduce: boolean | null;
}) {
  const a = ACCENT[accent];
  return (
    <div aria-hidden className="flex w-6 shrink-0 items-center">
      <div className="relative h-px w-full bg-line">
        {!reduce && (
          <motion.span
            className={cn(
              "absolute top-1/2 size-1.5 -translate-y-1/2 rounded-full",
              a.dot,
            )}
            initial={{ left: "0%", opacity: 0 }}
            animate={{ left: "100%", opacity: [0, 1, 1, 0] }}
            transition={{ duration: 0.5, ease: EASE, delay: 0.6 + order * 0.18 }}
          />
        )}
      </div>
    </div>
  );
}

/** One desktop row of up to PER_ROW cards, evenly sized, joined by in-row
 *  connectors. Cards flex to equal widths so the row always fits the column. */
function Row({
  stages,
  startOrder,
  accent,
  reduce,
}: {
  stages: WorkflowStage[];
  startOrder: number;
  accent: Accent;
  reduce: boolean | null;
}) {
  return (
    <motion.div variants={stagger} className="flex items-stretch">
      {stages.map((stage, j) => (
        <Fragment key={j}>
          <div className="flex min-w-0 flex-1 basis-0">
            <StageCard stage={stage} accent={accent} />
          </div>
          {j < stages.length - 1 && (
            <HConnector
              accent={accent}
              order={startOrder + j}
              reduce={reduce}
            />
          )}
        </Fragment>
      ))}
    </motion.div>
  );
}

/**
 * Wrap connector between two full desktop rows - carries the flow from the end
 * of the upper row (right) down, back across, and down into the start of the
 * next row (left), so 4 → 5 reads as one continuous sequence. The stubs sit
 * near the outer column centers of a full four-card row.
 */
function WrapConnector({ accent }: { accent: Accent }) {
  return (
    <div aria-hidden className="relative h-11 sm:h-12">
      {/* down from the end of the upper row (right column) */}
      <div className="absolute left-[88%] top-0 h-1/2 w-px bg-line" />
      {/* across to the start column */}
      <div className="absolute left-[12%] right-[12%] top-1/2 h-px bg-line" />
      {/* down into the start of the next row (left column) */}
      <div className="absolute bottom-0 left-[12%] h-1/2 w-px bg-line" />
      {/* arrowhead pointing down into the first card of the next row */}
      <div
        className="absolute bottom-0 left-[12%] size-1.5 border-b border-r border-line"
        style={{ transform: "translate(-50%, 20%) rotate(45deg)" }}
      />
    </div>
  );
}

export function AIWorkflow({
  stages,
  accent,
}: {
  stages: WorkflowStage[];
  accent: Accent;
}) {
  const reduce = useReducedMotion();

  // Chunk the stages into desktop rows of PER_ROW.
  const rows: WorkflowStage[][] = [];
  for (let i = 0; i < stages.length; i += PER_ROW) {
    rows.push(stages.slice(i, i + PER_ROW));
  }

  return (
    <motion.figure
      role="group"
      aria-label="AI workflow pipeline, from input to output. Accented stages are where AI does the work."
      className="mt-6"
      variants={stagger}
      initial={reduce ? "show" : "hidden"}
      animate="show"
    >
      {/* Mobile - a single vertical column, no horizontal overflow. */}
      <div className="flex flex-col sm:hidden">
        {stages.map((stage, i) => (
          <Fragment key={i}>
            <StageCard stage={stage} accent={accent} />
            {i < stages.length - 1 && (
              <div aria-hidden className="mx-auto h-5 w-px bg-line" />
            )}
          </Fragment>
        ))}
      </div>

      {/* Desktop - rows of four; the whole pipeline is visible at once. */}
      <div className="hidden sm:block">
        {rows.map((rowStages, r) => (
          <Fragment key={r}>
            {r > 0 && <WrapConnector accent={accent} />}
            <Row
              stages={rowStages}
              startOrder={r * PER_ROW}
              accent={accent}
              reduce={reduce}
            />
          </Fragment>
        ))}
      </div>
    </motion.figure>
  );
}
