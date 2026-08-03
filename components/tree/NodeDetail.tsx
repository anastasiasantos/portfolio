"use client";

import { cn } from "@/lib/cn";
import { ACCENT } from "@/lib/accents";
import { renderRichText } from "@/lib/richtext";
import type { Accent, Node } from "@/lib/types";
import { Approach } from "./Approach";
import { ResultChart } from "./ResultChart";
import { SupportingData } from "./SupportingData";

/** Accent-colored section kicker used to head each detail block. */
function SectionLabel({
  children,
  accent,
}: {
  children: React.ReactNode;
  accent: Accent;
}) {
  return <p className={cn("label-eyebrow", ACCENT[accent].text)}>{children}</p>;
}

/** Placeholder for a headed section whose content hasn't been written yet. */
function Todo() {
  return (
    <p className="mt-4 font-mono text-[13px] tracking-tight text-ink-faint">
      [TODO]
    </p>
  );
}

/**
 * Placeholder for a header-less collapsible (Supporting data / Approach) that
 * has no content yet. Mirrors the toggle pill's shape but muted + dashed, and
 * carries its own label since these sections have no heading.
 */
function TodoPill({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-dashed border-line px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-faint">
      {label}
      <span className="font-mono text-[10px] tracking-normal">[TODO]</span>
    </span>
  );
}

/**
 * The expanded case study. Locked template order:
 *   Problem → Hypotheses (+ Supporting data toggle) → Result (+ Approach toggle)
 *   → Takeaway.
 * Supporting data and Approach have no blue heading - their pill toggle labels
 * itself. Each field renders its rich content if written, else a placeholder.
 */
export function NodeDetail({ node, accent }: { node: Node; accent: Accent }) {
  const hasHypotheses = !!node.hypotheses && node.hypotheses.length > 0;
  const hasApproach = !!node.approach && node.approach.length > 0;
  const hasSupporting = !!node.supportingData && node.supportingData.length > 0;

  return (
    <div className="space-y-14 border-t border-line px-7 py-9 sm:px-9 sm:py-10">
      {/* Problem */}
      <section>
        <SectionLabel accent={accent}>Problem</SectionLabel>
        {node.problem ? (
          <p className="mt-4 text-[16px] font-medium leading-[1.55] text-ink">
            {node.problem}
          </p>
        ) : (
          <Todo />
        )}
      </section>

      {/* Hypotheses, with the Supporting data toggle tucked directly beneath - 
          no heading, since the pill labels itself. */}
      <section>
        <SectionLabel accent={accent}>Hypotheses</SectionLabel>
        {hasHypotheses ? (
          <div className="mt-4 space-y-5">
            {node.hypotheses!.map((h) => (
              <div key={h.id} className="flex gap-4">
                <span
                  className={cn(
                    "mt-[2px] w-6 shrink-0 font-mono text-[12px] font-semibold",
                    ACCENT[accent].text,
                  )}
                >
                  {h.id}
                </span>
                <p className="text-[15px] leading-[1.65] text-ink-secondary">
                  {h.text}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <Todo />
        )}
        <div className="mt-6">
          {hasSupporting ? (
            <SupportingData items={node.supportingData!} accent={accent} />
          ) : (
            <TodoPill label="Supporting data" />
          )}
        </div>
      </section>

      {/* Result, with the Approach toggle tucked directly beneath - no heading. */}
      <section>
        <SectionLabel accent={accent}>Result</SectionLabel>
        {node.result ? (
          <div className="mt-4">
            <ResultChart result={node.result} accent={accent} />
          </div>
        ) : (
          <Todo />
        )}
        <div className="mt-6">
          {hasApproach ? (
            <Approach steps={node.approach!} accent={accent} />
          ) : (
            <TodoPill label="Approach" />
          )}
        </div>
      </section>

      {/* Takeaway - the conclusion. Elevated with a soft accent-tinted panel,
          accent edge, larger type, and more padding. Emphasis via hierarchy,
          not decoration (existing palette only). */}
      <section>
        <SectionLabel accent={accent}>Takeaway</SectionLabel>
        {node.takeaway ? (
          <div
            className={cn(
              "mt-4 rounded-node border-l-[3px] px-7 py-6 sm:px-8 sm:py-7",
              ACCENT[accent].border,
              ACCENT[accent].softBg,
            )}
          >
            <p className="text-[16.5px] leading-[1.7] text-ink">
              {renderRichText(node.takeaway)}
            </p>
          </div>
        ) : (
          <Todo />
        )}
      </section>
    </div>
  );
}
