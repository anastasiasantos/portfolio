"use client";

import { cn } from "@/lib/cn";
import { ACCENT } from "@/lib/accents";
import { renderRichText } from "@/lib/richtext";
import type { Accent, AIDecision, Node, ProductOutcome } from "@/lib/types";
import { AIWorkflow } from "./AIWorkflow";
import { Collapsible } from "../ui/Collapsible";

/**
 * The Indigo Moore AI Product Operations Platform - the flagship AI build.
 *
 * Follows the STANDARD AI case-study hierarchy (shared across every AI build so
 * the category reads as one system, and mirrors the Product template's shape):
 *   Overview → The Problem → AI Strategy → Outcome → Takeaway →
 *   Technical Details (one Collapsible deep-dive).
 * Visible content tells the ~60-90s story; the Technical Details collapsible
 * proves the rigor. Every visualization stays - the System Workflow pipeline
 * and the AI-vs-code split both live (visible) inside AI Strategy.
 */

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

/** Small uppercase sub-heading used inside the Technical Details deep-dive. */
function SubLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-[0.09em] text-ink-faint">
      {children}
    </p>
  );
}

/** Bulleted list with a small accent dot marker. */
function BulletList({
  items,
  accent,
  muted,
}: {
  items: string[];
  accent: Accent;
  muted?: boolean;
}) {
  return (
    <ul className="mt-4 space-y-3.5">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3.5 text-[15px] leading-[1.65]">
          <span
            className={cn(
              "mt-[9px] size-1.5 shrink-0 rounded-full",
              muted ? "border border-line-strong" : ACCENT[accent].dot,
            )}
          />
          <span className={muted ? "text-ink-tertiary" : "text-ink-secondary"}>
            {item}
          </span>
        </li>
      ))}
    </ul>
  );
}

/** Measurable outcomes with an optional inline headline metric. */
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

/**
 * AI-vs-code split - the accented (AI) column vs. the neutral (code) column,
 * making the responsibility boundary legible at a glance.
 */
function ResponsibilitySplit({
  ai,
  deterministic,
  accent,
}: {
  ai: string[];
  deterministic: string[];
  accent: Accent;
}) {
  const a = ACCENT[accent];
  return (
    <div className="mt-5 grid gap-4 sm:grid-cols-2">
      <div
        className={cn(
          "rounded-node border p-5 shadow-card",
          a.softBorder,
          a.softBg,
        )}
      >
        <p
          className={cn(
            "flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.1em]",
            a.text,
          )}
        >
          <span aria-hidden className={cn("size-1.5 rounded-full", a.dot)} />
          AI · perceptual &amp; creative
        </p>
        <ul className="mt-3.5 space-y-2.5">
          {ai.map((item, i) => (
            <li
              key={i}
              className="flex gap-2.5 text-[14px] leading-[1.55] text-ink-secondary"
            >
              <span
                aria-hidden
                className={cn("mt-[8px] size-1 shrink-0 rounded-full", a.dot)}
              />
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-node border border-line bg-surface p-5 shadow-card">
        <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-faint">
          <span
            aria-hidden
            className="size-1.5 rotate-45 border border-current"
          />
          Code · exact &amp; compliant
        </p>
        <ul className="mt-3.5 space-y-2.5">
          {deterministic.map((item, i) => (
            <li
              key={i}
              className="flex gap-2.5 text-[14px] leading-[1.55] text-ink-secondary"
            >
              <span
                aria-hidden
                className="mt-[7px] size-1 shrink-0 rotate-45 border border-ink-faint"
              />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/** Key product decisions as compact cards. */
function DecisionCards({
  decisions,
  accent,
}: {
  decisions: AIDecision[];
  accent: Accent;
}) {
  return (
    <div className="mt-4 grid gap-3.5 sm:grid-cols-2">
      {decisions.map((d, i) => (
        <div
          key={i}
          className="rounded-node border border-line bg-surface p-5 shadow-card"
        >
          <p className="flex gap-3 text-[14.5px] font-semibold leading-[1.4] text-ink">
            <span
              aria-hidden
              className={cn(
                "mt-[7px] size-1.5 shrink-0 rounded-full",
                ACCENT[accent].dot,
              )}
            />
            {d.decision}
          </p>
          <p className="mt-2 pl-[18px] text-[14px] leading-[1.6] text-ink-tertiary">
            {d.tradeoff}
          </p>
        </div>
      ))}
    </div>
  );
}

export function IndigoMooreCaseStudy({
  node,
  accent,
}: {
  node: Node;
  accent: Accent;
}) {
  const a = ACCENT[accent];
  const ops = node.aiOps;
  if (!ops) return null;

  return (
    <div className="space-y-16 border-t border-line px-7 py-10 sm:space-y-20 sm:px-9 sm:py-12">
      {/* Overview - bold executive summary + supporting bullets */}
      <section>
        <SectionLabel accent={accent}>Overview</SectionLabel>
        <p className="mt-4 text-[16px] font-medium leading-[1.6] text-ink">
          {ops.overview}
        </p>
        <BulletList items={ops.overviewBullets} accent={accent} />
      </section>

      {/* The Problem - one concise paragraph */}
      <section>
        <SectionLabel accent={accent}>The Problem</SectionLabel>
        <p className="mt-4 text-[15px] leading-[1.7] text-ink-secondary">
          {ops.problem}
        </p>
      </section>

      {/* AI Strategy - PM framing + the two visuals do the explaining */}
      <section>
        <SectionLabel accent={accent}>AI Strategy</SectionLabel>
        <p className="mt-4 text-[15px] leading-[1.7] text-ink-secondary">
          {ops.aiStrategy}
        </p>

        {/* System Workflow visualization */}
        {node.aiWorkflow && node.aiWorkflow.length > 0 && (
          <div className="mt-8">
            <SubLabel>The workflow</SubLabel>
            <AIWorkflow stages={node.aiWorkflow} accent={accent} />
          </div>
        )}

        {/* AI-vs-code split + the boundary principle */}
        <div className="mt-8">
          <SubLabel>Who owns what</SubLabel>
          <ResponsibilitySplit
            ai={ops.aiResponsibilities}
            deterministic={ops.deterministicResponsibilities}
            accent={accent}
          />
          <div
            className={cn(
              "mt-4 rounded-node border-l-[3px] px-6 py-4",
              a.border,
              a.softBg,
            )}
          >
            <p className="text-[15px] leading-[1.65] text-ink">
              {renderRichText(ops.boundaryPrinciple)}
            </p>
          </div>
        </div>

        {/* Human review safeguards */}
        <div className="mt-8">
          <SubLabel>Human review</SubLabel>
          <BulletList items={ops.humanInLoop} accent={accent} />
          <p className="mt-4 text-[15px] leading-[1.65] text-ink-secondary">
            {ops.humanInLoopWhy}
          </p>
        </div>
      </section>

      {/* Outcome - verified outcomes only */}
      {node.results && node.results.length > 0 && (
        <section>
          <SectionLabel accent={accent}>Outcome</SectionLabel>
          <Outcomes results={node.results} accent={accent} />
        </section>
      )}

      {/* Takeaway - one product lesson, elevated panel */}
      <section>
        <SectionLabel accent={accent}>Takeaway</SectionLabel>
        <div
          className={cn(
            "mt-4 rounded-node border-l-[3px] px-7 py-6 sm:px-8 sm:py-7",
            a.border,
            a.softBg,
          )}
        >
          <p className="text-[16.5px] leading-[1.7] text-ink">
            {renderRichText(ops.takeaway)}
          </p>
        </div>
      </section>

      {/* Technical Details - one collapsible deep-dive (mirrors Products) */}
      <div>
        <Collapsible
          showLabel="Show technical details"
          hideLabel="Hide technical details"
        >
          <div className="mt-8 space-y-11">
            <section>
              <SectionLabel accent={accent}>Product Decisions</SectionLabel>
              <DecisionCards decisions={ops.decisions} accent={accent} />
            </section>

            <section>
              <SectionLabel accent={accent}>Technical Architecture</SectionLabel>
              <BulletList items={ops.architecture} accent={accent} />
            </section>

            {node.myRole && node.myRole.length > 0 && (
              <section>
                <SectionLabel accent={accent}>My Role</SectionLabel>
                <BulletList items={node.myRole} accent={accent} />
              </section>
            )}

            <section>
              <SectionLabel accent={accent}>Lessons in Depth</SectionLabel>
              <BulletList items={ops.lessons} accent={accent} />
            </section>

            <section>
              <SectionLabel accent={accent}>Future Opportunities</SectionLabel>
              <BulletList items={ops.futureOpportunities} accent={accent} />
            </section>
          </div>
        </Collapsible>
      </div>
    </div>
  );
}
