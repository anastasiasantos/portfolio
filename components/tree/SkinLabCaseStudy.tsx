"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { ACCENT } from "@/lib/accents";
import { renderRichText } from "@/lib/richtext";
import type {
  Accent,
  Node,
  ProductOutcome,
  SkinLabDimension,
} from "@/lib/types";
import { Collapsible } from "../ui/Collapsible";

/**
 * Skin Lab - AI Ingredient Intelligence for acne-prone skin. The second
 * flagship AI build, distinct from the Indigo Moore orchestration story: this
 * reads as domain modeling + AI decision support + a credible evaluation
 * strategy.
 *
 * Follows the STANDARD AI case-study hierarchy (shared across every AI build):
 *   Overview → The Problem → AI Strategy → Outcome → Takeaway →
 *   Technical Details (one Collapsible deep-dive).
 * Visible content tells the ~60-90s story; the deep-dive proves the rigor.
 *
 * Every visualization is preserved: the six-dimension reasoning model and the
 * AI-vs-code split live (visible) in AI Strategy; the AI reasoning architecture
 * and the full AI-quality/evaluation visuals live inside Technical Details.
 * Nothing medical, scientific, or performance-related is fabricated.
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

/** Small uppercase sub-heading used inside sections / the deep-dive. */
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

/** Numbered reasoning list (AI Reasoning Architecture). */
function NumberedList({ items, accent }: { items: string[]; accent: Accent }) {
  return (
    <ol className="mt-4 space-y-4">
      {items.map((step, i) => (
        <li key={i} className="flex gap-4">
          <span
            className={cn(
              "mt-[1px] w-6 shrink-0 font-mono text-[12px] font-semibold tabular-nums",
              ACCENT[accent].text,
            )}
          >
            {i + 1}
          </span>
          <p className="text-[15px] leading-[1.65] text-ink-secondary">{step}</p>
        </li>
      ))}
    </ol>
  );
}

/** Built outcomes, with an optional inline headline metric. */
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

/** A centered node in the reasoning flow. */
function FlowNode({
  children,
  tone = "plain",
  accent,
}: {
  children: React.ReactNode;
  tone?: "ai" | "det" | "plain";
  accent: Accent;
}) {
  const a = ACCENT[accent];
  return (
    <div
      className={cn(
        "mx-auto flex max-w-[420px] items-center justify-center gap-2 rounded-node border px-5 py-3 text-center text-[13.5px] font-semibold shadow-card",
        tone === "ai"
          ? cn(a.softBorder, a.softBg, "text-ink")
          : "border-line bg-surface text-ink",
      )}
    >
      {tone === "ai" && (
        <span aria-hidden className={cn("size-1.5 rounded-full", a.dot)} />
      )}
      {tone === "det" && (
        <span
          aria-hidden
          className="size-1.5 rotate-45 border border-ink-faint"
        />
      )}
      {children}
    </div>
  );
}

/** Short vertical connector between flow nodes. */
function FlowDown() {
  return <div aria-hidden className="mx-auto my-2 h-4 w-px bg-line" />;
}

/**
 * SIGNATURE VISUAL - the six-dimension reasoning model. A single AI analysis
 * fans into six parallel dimensions (a selectable grid); picking one reveals
 * what it evaluates, the shared scoring semantics, and how flagged ingredients
 * surface. The flow then converges to a rule-based risk profile → rendering →
 * decision support. Restrained: one click-to-select interaction, no motion.
 */
function SixDimensionModel({
  dims,
  scoringNote,
  flaggedNote,
  accent,
}: {
  dims: SkinLabDimension[];
  scoringNote: string;
  flaggedNote: string;
  accent: Accent;
}) {
  const [sel, setSel] = useState(0);
  const a = ACCENT[accent];
  const d = dims[sel];

  return (
    <figure
      className="mt-6"
      aria-label="Six-dimension ingredient reasoning model: one AI analysis fans into six parallel acne-related dimensions, then converges to a rule-based risk profile."
    >
      <FlowNode accent={accent}>Ingredient List</FlowNode>
      <FlowDown />
      <FlowNode tone="ai" accent={accent}>
        AI Ingredient Analysis
      </FlowNode>
      <FlowDown />

      <p className="mb-3 text-center text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-faint">
        Six parallel dimensions
      </p>
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
        {dims.map((dim, i) => {
          const active = i === sel;
          return (
            <button
              key={dim.key}
              type="button"
              onClick={() => setSel(i)}
              aria-pressed={active}
              className={cn(
                "rounded-node border px-3 py-2.5 text-[13px] font-semibold outline-none transition-[border-color,background-color,box-shadow,transform] duration-200 ease-premium",
                "hover:-translate-y-px focus-visible:-translate-y-px",
                a.focus,
                active
                  ? cn(a.softBorder, a.softBg, "text-ink shadow-card")
                  : "border-line bg-surface text-ink-secondary hover:border-line-strong hover:text-ink",
              )}
            >
              <span className="flex items-center justify-center gap-1.5">
                <span
                  aria-hidden
                  className={cn(
                    "size-1.5 rounded-full",
                    active ? a.dot : "bg-line-strong",
                  )}
                />
                {dim.name}
              </span>
            </button>
          );
        })}
      </div>

      <div
        className={cn(
          "mt-3 rounded-node border p-5 shadow-card",
          a.softBorder,
          a.softBg,
        )}
      >
        <p className={cn("label-eyebrow", a.text)}>{d.name}</p>
        <p className="mt-2.5 text-[14.5px] leading-[1.6] text-ink">
          {d.evaluates}
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <SubLabel>Score</SubLabel>
            <p className="mt-1.5 text-[13.5px] leading-[1.55] text-ink-secondary">
              {scoringNote}
            </p>
          </div>
          <div>
            <SubLabel>How it&apos;s surfaced</SubLabel>
            <p className="mt-1.5 text-[13.5px] leading-[1.55] text-ink-secondary">
              {flaggedNote}
            </p>
          </div>
        </div>
      </div>

      <FlowDown />
      <FlowNode accent={accent}>Structured Risk Profile</FlowNode>
      <FlowDown />
      <FlowNode tone="det" accent={accent}>
        Rule-Based Thresholds &amp; Rendering
      </FlowNode>
      <FlowDown />
      <FlowNode accent={accent}>User Decision Support</FlowNode>
    </figure>
  );
}

/** Two-column AI vs. code split - accented (model) vs. neutral (code). */
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
        className={cn("rounded-node border p-5 shadow-card", a.softBorder, a.softBg)}
      >
        <p
          className={cn(
            "flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.1em]",
            a.text,
          )}
        >
          <span aria-hidden className={cn("size-1.5 rounded-full", a.dot)} />
          AI · open-ended reasoning
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
          <span aria-hidden className="size-1.5 rotate-45 border border-current" />
          Code · finite &amp; reproducible
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

/** Small status badge separating implemented work from proposed work. */
function StatusBadge({
  kind,
  accent,
}: {
  kind: "now" | "gap" | "next";
  accent: Accent;
}) {
  const a = ACCENT[accent];
  const label = kind === "now" ? "Now" : kind === "gap" ? "Not yet" : "Next";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.09em]",
        kind === "now" && cn(a.softBg, a.text),
        kind === "gap" &&
          "border border-dashed border-line-strong text-ink-faint",
        kind === "next" && "border border-line-strong text-ink-tertiary",
      )}
    >
      {kind === "now" && (
        <span aria-hidden className={cn("size-1.5 rounded-full", a.dot)} />
      )}
      {label}
    </span>
  );
}

/** A titled block within AI Quality & Evaluation, tagged by status. */
function EvalBlock({
  title,
  badge,
  children,
  accent,
}: {
  title: string;
  badge: "now" | "gap" | "next";
  children: React.ReactNode;
  accent: Accent;
}) {
  return (
    <div>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
        <h4 className="text-[15px] font-semibold tracking-[-0.01em] text-ink">
          {title}
        </h4>
        <StatusBadge kind={badge} accent={accent} />
      </div>
      {children}
    </div>
  );
}

/** Muted list for gaps (dashed markers), signalling "not built". */
function GapList({ items }: { items: string[] }) {
  return (
    <ul className="mt-3.5 grid gap-2.5 sm:grid-cols-2">
      {items.map((item, i) => (
        <li
          key={i}
          className="flex gap-2.5 text-[14px] leading-[1.55] text-ink-tertiary"
        >
          <span
            aria-hidden
            className="mt-[7px] size-1.5 shrink-0 rotate-45 border border-line-strong"
          />
          {item}
        </li>
      ))}
    </ul>
  );
}

/** Key product decisions as compact cards. */
function DecisionCards({
  decisions,
  accent,
}: {
  decisions: { decision: string; tradeoff: string }[];
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
              className={cn("mt-[7px] size-1.5 shrink-0 rounded-full", ACCENT[accent].dot)}
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

/** The full AI Quality & Evaluation content (implemented vs. proposed), lifted
 *  into the Technical Details deep-dive. Keeps every evaluation visual. */
function QualityAndEvaluation({
  s,
  accent,
}: {
  s: NonNullable<Node["skinLab"]>;
  accent: Accent;
}) {
  const a = ACCENT[accent];
  return (
    <div>
      <p className="mt-2 text-[15px] leading-[1.65] text-ink-secondary">
        What&apos;s in place today are output controls and product tests - not a
        scientific-accuracy framework. The gaps and the evaluation system that
        would close them are called out plainly.
      </p>

      <div className="mt-6 space-y-8">
        <EvalBlock title="Quality controls in place" badge="now" accent={accent}>
          <BulletList items={s.qualityControls} accent={accent} />
          <p className="mt-3 text-[13.5px] leading-[1.55] text-ink-tertiary">
            {s.qualityControlsNote}
          </p>
        </EvalBlock>

        <EvalBlock title="Testing in place" badge="now" accent={accent}>
          <BulletList items={s.testingToday} accent={accent} />
          <p className="mt-3 text-[13.5px] leading-[1.55] text-ink-tertiary">
            {s.testingTodayNote}
          </p>
        </EvalBlock>

        <EvalBlock
          title="AI evaluations not yet implemented"
          badge="gap"
          accent={accent}
        >
          <GapList items={s.notYetImplemented} />
        </EvalBlock>

        <EvalBlock
          title="Recommended evaluation framework"
          badge="next"
          accent={accent}
        >
          <p className="mt-3 text-[14px] leading-[1.6] text-ink-tertiary">
            The next iteration, not completed work - five layers, structure
            through localization.
          </p>
          <div className="mt-4 grid gap-3.5 sm:grid-cols-2">
            {s.evalFramework.map((layer, i) => (
              <div
                key={i}
                className="rounded-node border border-line bg-surface p-5 shadow-card"
              >
                <p className="flex items-baseline gap-2.5 text-[14.5px] font-semibold text-ink">
                  <span
                    className={cn(
                      "font-mono text-[12px] font-semibold tabular-nums",
                      a.text,
                    )}
                  >
                    {i + 1}
                  </span>
                  {layer.title}
                </p>
                <ul className="mt-3 space-y-2 pl-[26px]">
                  {layer.measures.map((m, j) => (
                    <li
                      key={j}
                      className="flex gap-2.5 text-[13.5px] leading-[1.5] text-ink-secondary"
                    >
                      <span
                        aria-hidden
                        className={cn(
                          "mt-[7px] size-1 shrink-0 rounded-full",
                          a.dot,
                        )}
                      />
                      {m}
                    </li>
                  ))}
                </ul>
                <p className="mt-3.5 pl-[26px] text-[13px] leading-[1.55] text-ink-tertiary">
                  <span className={cn("font-semibold", a.text)}>
                    Recommend·{" "}
                  </span>
                  {layer.recommend}
                </p>
              </div>
            ))}
          </div>

          {/* Evaluation ladder - Current vs. Next, compact */}
          <div className="mt-6">
            <SubLabel>Evaluation ladder</SubLabel>
            <div className="mt-3 flex flex-wrap items-center gap-x-1.5 gap-y-2.5">
              {s.evalLadder.map((rung, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-medium",
                      rung.status === "current"
                        ? cn(a.softBorder, a.softBg, "text-ink")
                        : "border-dashed border-line-strong text-ink-tertiary",
                    )}
                  >
                    <span
                      className={cn(
                        "text-[9px] font-semibold uppercase tracking-[0.08em]",
                        rung.status === "current" ? a.text : "text-ink-faint",
                      )}
                    >
                      {rung.status === "current" ? "Current" : "Next"}
                    </span>
                    {rung.label}
                  </span>
                  {i < s.evalLadder.length - 1 && (
                    <span aria-hidden className="text-ink-faint">
                      ›
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </EvalBlock>
      </div>
    </div>
  );
}

export function SkinLabCaseStudy({
  node,
  accent,
}: {
  node: Node;
  accent: Accent;
}) {
  const a = ACCENT[accent];
  const s = node.skinLab;
  if (!s) return null;

  return (
    <div className="space-y-16 border-t border-line px-7 py-10 sm:space-y-20 sm:px-9 sm:py-12">
      {/* Overview - bold executive summary + supporting bullets */}
      <section>
        <SectionLabel accent={accent}>Overview</SectionLabel>
        <p className="mt-4 text-[16px] font-medium leading-[1.6] text-ink">
          {node.summary}
        </p>
        <BulletList items={s.capabilities} accent={accent} />
      </section>

      {/* The Problem - one concise paragraph + the reframe visual */}
      <section>
        <SectionLabel accent={accent}>The Problem</SectionLabel>
        <p className="mt-4 text-[15px] leading-[1.7] text-ink-secondary">
          {s.problemLead}
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-stretch">
          <div className="rounded-node border border-line bg-surface p-4">
            <SubLabel>From</SubLabel>
            <p className="mt-2 text-[14.5px] leading-[1.5] text-ink-tertiary">
              {s.reframeFrom}
            </p>
          </div>
          <div aria-hidden className="hidden items-center justify-center sm:flex">
            <span className={cn("text-[18px] font-semibold", a.text)}>→</span>
          </div>
          <div className={cn("rounded-node border p-4", a.softBorder, a.softBg)}>
            <p className={cn("text-[10px] font-semibold uppercase tracking-[0.1em]", a.text)}>
              To
            </p>
            <p className="mt-2 text-[14.5px] font-medium leading-[1.5] text-ink">
              {s.reframeTo}
            </p>
          </div>
        </div>
      </section>

      {/* AI Strategy - PM framing + the visuals do the explaining */}
      <section>
        <SectionLabel accent={accent}>AI Strategy</SectionLabel>
        <p className="mt-4 text-[15px] leading-[1.7] text-ink-secondary">
          {s.aiStrategy}
        </p>

        {/* The six-dimension reasoning model (signature visual) */}
        <div className="mt-8">
          <SubLabel>The reasoning model</SubLabel>
          <SixDimensionModel
            dims={s.dimensions}
            scoringNote={s.scoringNote}
            flaggedNote={s.flaggedNote}
            accent={accent}
          />
        </div>

        {/* Who owns what - AI vs. code + the boundary principle */}
        <div className="mt-8">
          <SubLabel>Who owns what</SubLabel>
          <ResponsibilitySplit
            ai={s.aiResponsibilities}
            deterministic={s.deterministicResponsibilities}
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
              {renderRichText(s.boundaryPrinciple)}
            </p>
          </div>
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
            {renderRichText(s.takeaway)}
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
              <SectionLabel accent={accent}>
                AI Reasoning Architecture
              </SectionLabel>
              <NumberedList items={s.architecture} accent={accent} />
              <p className="mt-5 text-[14.5px] leading-[1.6] text-ink-tertiary">
                {s.architectureNote}
              </p>
            </section>

            <section>
              <SectionLabel accent={accent}>
                AI Quality &amp; Evaluation
              </SectionLabel>
              <QualityAndEvaluation s={s} accent={accent} />
            </section>

            <section>
              <SectionLabel accent={accent}>Key Product Decisions</SectionLabel>
              <DecisionCards decisions={s.decisions} accent={accent} />
            </section>

            <section>
              <SectionLabel accent={accent}>Product Experience</SectionLabel>
              <div className="mt-4 flex flex-wrap gap-2">
                {s.productExperience.map((item, i) => (
                  <span
                    key={i}
                    className="rounded-full border border-line bg-surface px-3.5 py-1.5 text-[13px] text-ink-secondary"
                  >
                    {item}
                  </span>
                ))}
              </div>
              <p className="mt-4 text-[14.5px] leading-[1.6] text-ink-tertiary">
                {s.productExperienceNote}
              </p>
            </section>

            {node.myRole && node.myRole.length > 0 && (
              <section>
                <SectionLabel accent={accent}>My Role</SectionLabel>
                <BulletList items={node.myRole} accent={accent} />
              </section>
            )}

            <section>
              <SectionLabel accent={accent}>Lessons in Depth</SectionLabel>
              <BulletList items={s.lessons} accent={accent} />
            </section>
          </div>
        </Collapsible>
      </div>
    </div>
  );
}
