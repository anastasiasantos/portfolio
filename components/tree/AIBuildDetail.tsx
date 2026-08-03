"use client";

import { cn } from "@/lib/cn";
import { ACCENT } from "@/lib/accents";
import { renderRichText } from "@/lib/richtext";
import type { Accent, Node, ProductOutcome } from "@/lib/types";
import { AIWorkflow } from "./AIWorkflow";
import { Collapsible } from "../ui/Collapsible";

/** Accent-colored section kicker (shared visual language across templates). */
function SectionLabel({
  children,
  accent,
}: {
  children: React.ReactNode;
  accent: Accent;
}) {
  return <p className={cn("label-eyebrow", ACCENT[accent].text)}>{children}</p>;
}

/** Placeholder for a section whose content hasn't been written yet. */
function Todo() {
  return (
    <p className="mt-4 font-mono text-[13px] tracking-tight text-ink-faint">
      [TODO]
    </p>
  );
}

/** Bulleted list with a small accent dot marker (Solution, Architecture). */
function BulletList({ items, accent }: { items: string[]; accent: Accent }) {
  return (
    <ul className="mt-4 space-y-3.5">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3.5 text-[15px] leading-[1.65]">
          <span
            className={cn(
              "mt-[9px] size-1.5 shrink-0 rounded-full",
              ACCENT[accent].dot,
            )}
          />
          <span className="text-ink-secondary">{item}</span>
        </li>
      ))}
    </ul>
  );
}

/** Measurable outcomes: an accent-dot bullet, with an optional headline metric
 *  value shown inline before the description (metric emphasis). */
function Outcomes({
  results,
  accent,
}: {
  results: ProductOutcome[];
  accent: Accent;
}) {
  return (
    <ul className="mt-4 space-y-3.5">
      {results.map((r, i) => (
        <li key={i} className="flex gap-3.5 text-[15px] leading-[1.65]">
          <span
            className={cn(
              "mt-[9px] size-1.5 shrink-0 rounded-full",
              ACCENT[accent].dot,
            )}
          />
          <span className="text-ink-secondary">
            {r.value && (
              <span className="mr-1.5 font-mono font-semibold text-ink">
                {r.value}
              </span>
            )}
            {r.label}
          </span>
        </li>
      ))}
    </ul>
  );
}

/** Text section, or a [TODO] placeholder. */
function Prose({ text }: { text?: string }) {
  return text ? (
    <p className="mt-4 text-[15px] leading-[1.7] text-ink-secondary">
      {text}
    </p>
  ) : (
    <Todo />
  );
}

/**
 * The STANDARD AI BUILD case study - the template every non-flagship AI build
 * uses, and the shared hierarchy the flagship layouts (Indigo Moore, Skin Lab)
 * also follow so the whole AI category reads as one system:
 *   Overview → The Problem → AI Strategy → Outcome → Takeaway →
 *   Technical Details (one Collapsible deep-dive).
 *
 * Visible content tells the ~60-90s story; the Technical Details collapsible
 * holds the supporting depth. The signature AI-workflow pipeline lives
 * (visible) inside AI Strategy. A field left undefined renders "[TODO]".
 */
export function AIBuildDetail({
  node,
  accent,
}: {
  node: Node;
  accent: Accent;
}) {
  const a = ACCENT[accent];
  const has = (v?: unknown[]) => !!v && v.length > 0;

  return (
    <div className="space-y-16 border-t border-line px-7 py-10 sm:space-y-20 sm:px-9 sm:py-12">
      {/* Overview - bold executive summary */}
      <section>
        <SectionLabel accent={accent}>Overview</SectionLabel>
        {node.summary ? (
          <p className="mt-4 text-[16px] font-medium leading-[1.6] text-ink">
            {node.summary}
          </p>
        ) : (
          <Todo />
        )}
      </section>

      {/* The Problem */}
      <section>
        <SectionLabel accent={accent}>The Problem</SectionLabel>
        {Array.isArray(node.problem) ? (
          <BulletList items={node.problem} accent={accent} />
        ) : (
          <Prose text={node.problem} />
        )}
      </section>

      {/* AI Strategy - the builder's framing + the signature workflow visual */}
      <section>
        <SectionLabel accent={accent}>AI Strategy</SectionLabel>
        <Prose text={node.whyIBuilt} />
        {has(node.aiWorkflow) && (
          <div className="mt-8">
            <AIWorkflow stages={node.aiWorkflow!} accent={accent} />
          </div>
        )}
      </section>

      {/* Outcome */}
      <section>
        <SectionLabel accent={accent}>Outcome</SectionLabel>
        {has(node.results) ? (
          <Outcomes results={node.results!} accent={accent} />
        ) : (
          <Todo />
        )}
      </section>

      {/* Takeaway - elevated panel */}
      <section>
        <SectionLabel accent={accent}>Takeaway</SectionLabel>
        {node.takeaway ? (
          <div
            className={cn(
              "mt-4 rounded-node border-l-[3px] px-7 py-6 sm:px-8 sm:py-7",
              a.border,
              a.softBg,
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

      {/* Technical Details - one collapsible deep-dive (mirrors Products) */}
      <div>
        <Collapsible
          showLabel="Show technical details"
          hideLabel="Hide technical details"
        >
          <div className="mt-8 space-y-11">
            <section>
              <SectionLabel accent={accent}>Solution</SectionLabel>
              {has(node.solution) ? (
                <BulletList items={node.solution!} accent={accent} />
              ) : (
                <Todo />
              )}
            </section>
            <section>
              <SectionLabel accent={accent}>Architecture</SectionLabel>
              {has(node.architecture) ? (
                <BulletList items={node.architecture!} accent={accent} />
              ) : (
                <Todo />
              )}
            </section>
          </div>
        </Collapsible>
      </div>
    </div>
  );
}
