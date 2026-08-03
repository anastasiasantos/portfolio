"use client";

import { cn } from "@/lib/cn";
import { ACCENT } from "@/lib/accents";
import type { Accent } from "@/lib/types";
import { Collapsible } from "../ui/Collapsible";

/** Collapsible "approach" - the reasoning steps, behind a Show/Hide toggle. */
export function Approach({
  steps,
  accent,
}: {
  steps: string[];
  accent: Accent;
}) {
  return (
    <Collapsible label="approach">
      <ol className="mt-5 space-y-5">
        {steps.map((step, i) => (
          <li key={i} className="flex gap-4">
            <span
              className={cn(
                "mt-[2px] w-6 shrink-0 font-mono text-[12px] font-semibold tabular-nums",
                ACCENT[accent].text,
              )}
            >
              {i + 1}
            </span>
            <p className="text-[15px] leading-[1.65] text-ink-secondary">
              {step}
            </p>
          </li>
        ))}
      </ol>
    </Collapsible>
  );
}
