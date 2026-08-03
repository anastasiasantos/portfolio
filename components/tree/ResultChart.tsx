"use client";

import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";
import { cn } from "@/lib/cn";
import { ACCENT } from "@/lib/accents";
import type { Accent, ResultBar, ResultBlock } from "@/lib/types";
import { StatusPill } from "../ui/StatusPill";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Control vs Variant progress bars - shared by the simple and rich results. */
function Bars({ bars, accent }: { bars: ResultBar[]; accent: Accent }) {
  const max = Math.max(...bars.map((b) => b.value));
  return (
    <div className="space-y-7">
      {bars.map((bar, i) => (
        <div key={bar.name}>
          <div className="flex items-baseline justify-between gap-4">
            <div className="flex items-baseline gap-2.5">
              <span
                className={cn(
                  "text-[15px] font-semibold tracking-[-0.01em]",
                  bar.isPrimary ? "text-ink" : "text-ink-secondary",
                )}
              >
                {bar.name}
              </span>
              {bar.detail && (
                <span className="font-mono text-[13px] text-ink-secondary">
                  {bar.detail}
                </span>
              )}
            </div>
            <span
              className={cn(
                "font-mono text-[18px] font-semibold tabular-nums",
                bar.isPrimary ? "text-ink" : "text-ink-secondary",
              )}
            >
              {bar.display}
            </span>
          </div>
          <div className="mt-2 h-[10px] overflow-hidden rounded-full bg-line">
            <motion.span
              className={cn(
                "block h-full rounded-full",
                bar.isPrimary ? ACCENT[accent].bar : "bg-ink-faint",
              )}
              initial={{ width: 0 }}
              animate={{ width: `${(bar.value / max) * 100}%` }}
              transition={{ duration: 0.8, delay: 0.15 + i * 0.09, ease: EASE }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * The RESULT section - the visual focal point of an experiment.
 *
 * Simple mode: Goal → numeric headline (largest) → Control vs Variant bars →
 * confidence → paragraph. Rich mode (multi-outcome): Goal → verdict badge →
 * each metric with its own verdict → additional business impact → paragraph.
 *
 * Both use the same design language (hero panel, progress bars, status pills,
 * mono numerals) - no new colors or graphics. Paragraph/metadata stay quietest.
 */
export function ResultChart({
  result,
  accent,
}: {
  result: ResultBlock;
  accent: Accent;
}) {
  const isRich = !!result.metrics && result.metrics.length > 0;

  return (
    <div>
      {/* Hero: goal + primary outcome */}
      <div className="rounded-node border border-line bg-canvas/60 px-6 py-8 text-center">
        <p className="label-eyebrow text-ink-tertiary">Goal</p>
        <p className="mt-2 font-mono text-[13px] leading-relaxed text-ink-secondary">
          {result.goal}
        </p>

        {result.outcome ? (
          <>
            <p className="mt-7 label-eyebrow text-ink-tertiary">
              Primary outcome
            </p>
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: EASE }}
              className="mt-2.5 text-[30px] font-semibold tracking-[-0.02em] text-ink"
            >
              {result.outcome}
            </motion.p>
          </>
        ) : result.headline ? (
          <>
            <div className="mt-7 flex items-center justify-center gap-1.5">
              <TrendingUp className={cn("size-3.5", ACCENT[accent].text)} />
              <span className="label-eyebrow text-ink-tertiary">
                {result.headline.label}
              </span>
            </div>
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: EASE }}
              className="mt-2 font-mono text-[52px] font-semibold leading-none tracking-[-0.03em] text-ink tabular-nums"
            >
              {result.headline.value}
            </motion.p>
          </>
        ) : null}
      </div>

      {/* Body */}
      {isRich ? (
        <div className="mt-8 space-y-9">
          {result.metrics!.map((m) => (
            <div key={m.label}>
              <p className="text-[15px] font-semibold tracking-[-0.01em] text-ink">
                {m.label}
              </p>
              {m.caption && (
                <p className="mt-1.5 font-mono text-[12px] text-ink-tertiary">
                  {m.caption}
                </p>
              )}
              {m.bars && m.bars.length > 0 && (
                <div className="mt-5">
                  <Bars bars={m.bars} accent={accent} />
                </div>
              )}
              <div className="mt-4 flex items-center gap-2.5">
                <span className="label-eyebrow text-ink-tertiary">Result</span>
                <StatusPill label={m.verdict} tone={m.verdictTone} />
              </div>
            </div>
          ))}
        </div>
      ) : result.bars && result.bars.length > 0 ? (
        <>
          <div className="mt-7">
            <Bars bars={result.bars} accent={accent} />
          </div>
          {(result.confidence || result.meta) && (
            <div className="mt-7 flex items-center justify-center gap-2.5">
              {result.confidence && (
                <span className="flex items-baseline gap-2">
                  <span className="label-eyebrow text-ink-tertiary">
                    Confidence
                  </span>
                  <span className="font-mono text-[15px] font-semibold tabular-nums text-ink">
                    {result.confidence}
                  </span>
                </span>
              )}
              {result.confidence && result.meta && (
                <span className="text-ink-faint">·</span>
              )}
              {result.meta && (
                <span className="text-[12px] text-ink-faint">{result.meta}</span>
              )}
            </div>
          )}
        </>
      ) : null}

      {/* Additional business impact */}
      {result.impact && result.impact.length > 0 && (
        <div className="mt-8 rounded-node border border-line bg-canvas/50 px-5 py-4">
          <p className="label-eyebrow text-ink-tertiary">
            Additional business impact
          </p>
          <div className="mt-3.5 space-y-3">
            {result.impact.map((imp, i) => (
              <div key={i}>
                <p className="text-[14px] leading-snug text-ink-secondary">
                  {imp.label}
                </p>
                {imp.from && imp.to && (
                  <p className="mt-1.5 flex items-baseline gap-2 font-mono text-[15px] tabular-nums">
                    <span className="text-ink-secondary">{imp.from}</span>
                    <span className="text-ink-faint">→</span>
                    <span className={cn("font-semibold", ACCENT[accent].text)}>
                      {imp.to}
                    </span>
                    {imp.unit && (
                      <span className="text-[12px] text-ink-tertiary">
                        {imp.unit}
                      </span>
                    )}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Supporting explanation - quietest; supporting context, not primary */}
      <p className="mt-7 text-[13px] leading-relaxed text-ink-tertiary">
        {result.summary}
      </p>
    </div>
  );
}
